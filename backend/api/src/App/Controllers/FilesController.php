<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Models\File;
use App\Services\LogService;
use App\Services\UploadService;
use App\Vo\ProfilePictureVo;
use Exception;
use InvalidArgumentException;
use OpenApi\Attributes as OA;
use PDOException;
use Psr\Http\Message\UploadedFileInterface;
use Ramsey\Uuid\Uuid;
use RuntimeException;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class FilesController {

  public function __construct(
    private readonly UploadService $uploadService,
    private readonly FilesDao $fileDao
  ) {}

  #[OA\Post(
        path: "/files/upload-profile-assets",
        tags: ["Arquivos"],
        summary: "Upload de foto de perfil/banner do usuário/instituição/etc",
        description: "Faz upload de uma nova foto de perfil",
        operationId: "uploadProfilePicture",
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Arquivo de imagem para upload",
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(
                            property: "profile-picture",
                            type: "string",
                            format: "binary",
                            description: "Imagem de perfil (formatos: jpg, jpeg, png)"
                        )
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Upload realizado com sucesso",
                content: new OA\JsonContent(ref: "#/components/schemas/FileResponse")
            ),
            new OA\Response(
                response: 400,
                description: "Arquivo inválido ou ausente",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 422,
                description: "Validação falhou",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function uploadProfileAssets(Request $request, Response $response): Response {
    $uploadedFiles = $request->getUploadedFiles();
    
    /**
     * @var UploadedFileInterface|null
     */
    $profilePicture = $uploadedFiles['profile-picture'] ?? null;

    if (!$profilePicture) {
      LogService::http422('/users/upload-profile-picture', "'profile-picture' file is required");
      throw new HttpException($request, "Missing file", 422);
    }

    try {
      $picture = new ProfilePictureVo($profilePicture);
      $fileUrl = $this->uploadService->userProfilePicture($picture->getExtension(), $picture->getContent());

      $file = $this->fileDao->createFile(new File([
        "file_id" => Uuid::uuid4()->toString(),
        "url" => $fileUrl,
        "filename" => $picture->getSafeFilename(),
        "mime_type" => $picture->getMimeType(),
        "file_type" => "image", 
        "size" => $picture->getSize(),
        "uploaded_at" => date('Y-m-d H:i:s')
      ]));

      $response->getBody()->write(json_encode($file));
      
      LogService::info('/users/upload-profile-picture', "Avatar uploaded successfully!");
      return $response;
    } catch (InvalidArgumentException $e) {
      LogService::http422('/users/upload-profile-picture', $e->getMessage());
      throw new HttpException($request, $e->getMessage(), 422);
    } catch (RuntimeException $e) {
      LogService::error('/users/upload-profile-picture', 'Could not upload avatar due to a run time error: '.$e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not upload avatar due to an run time error. See logs for more details');
    } catch (PDOException $e) {
      LogService::error('/users/upload-profile-picture', 'Could not upload avatar due to a database error:'.$e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not upload avatar due to a database error. See logs for more details');      
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::error('/users/upload-profile-picture', 'Could not upload avatar due to an unknown error:'.$e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not upload avatar due to an unknown error. See logs for more details');
    }    
  }
}