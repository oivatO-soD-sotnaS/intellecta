<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\InstitutionDao;
use App\Dao\InstitutionUserDao;
use App\Dto\InstitutionDto;
use App\Dto\InstitutionSummaryDto;
use App\Models\File;
use App\Models\Institution;
use App\Models\InstitutionSummary;
use App\Models\InstitutionUser;
use App\Services\LogService;
use App\Services\UploadService;
use App\Vo\InstitutionDescriptionVo;
use App\Vo\InstitutionNameVo;
use App\Vo\ProfilePictureVo;
use App\Vo\UuidV4Vo;
use Exception;
use InvalidArgumentException;
use PDOException;
use Psr\Http\Message\UploadedFileInterface;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

use OpenApi\Attributes as OA;

#[OA\Tag(name: "Instituições", description: "Operações relacionadas a instituições")]
class InstitutionsController {
  public function __construct(
    private InstitutionDao $institutionDao,
    private InstitutionUserDao $institutionUserDao,
    private FilesDao $filesDao,
    private UploadService $uploadService
  ){}

  #[OA\Get(
        path: "/institutions/summary",
        tags: ["Instituições"],
        summary: "Listar resumos de instituições",
        description: "Retorna resumos de todas as instituições do usuário autenticado",
        operationId: "getInstitutionsSummary",
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de resumos de instituições",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/InstitutionSummaryResponse")
                )
            ),
            new OA\Response(
                response: 404,
                description: "Nenhuma instituição encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getInstitutionsSummary(Request $request, Response $response): Response {
    $token = $request->getAttribute('token');

    try{
      $summaries = $this->institutionDao->getInstitutionsSummary($token['sub']);
      if(empty($summaries)) {
        LogService::http404('/institutions/summary', "No summaries found for the user {$token['sub']}");
        throw new HttpNotFoundException($request, "No summaries found for the user {$token['sub']}");
      }

      $summariesDtos = array_map(function(InstitutionSummary $summary) {
        if(!empty($summary->getBannerId())) {
          $banner = $this->filesDao->getFileById($summary->getBannerId());
        }
        if(!empty($summary->getProfilePictureId())) {
          $profilePicture = $this->filesDao->getFileById($summary->getProfilePictureId());
        }

        $summaryDto = new InstitutionSummaryDto($summary, $banner, $profilePicture);
        return $summaryDto;
      }, $summaries);

      $response->getBody()->write(json_encode($summariesDtos));
      return $response;
    }catch (PDOException $e) {
      LogService::http500('/institutions-summary', "Could not get institutions summaries due to a database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not get institutions summaries due to a database error. See logs for more details');
    }
  }

  #[OA\Get(
        path: "/institutions/summary/{institution_id}",
        tags: ["Instituições"],
        summary: "Obter resumo de uma instituição",
        description: "Retorna o resumo de uma instituição específica do usuário autenticado",
        operationId: "getInstitutionSummaryById",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID da instituição",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Resumo da instituição",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionSummaryResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Instituição não encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getInstitutionSummaryById(Request $request, Response $response, string $institution_id): Response {
    $token = $request->getAttribute('token');

    try{
      $summary = $this->institutionDao->getInstitutionSummaryById($token['sub'], $institution_id);
      if(empty($summary)) {
        LogService::http404('/institutions/summary', "No summary found for the user {$token['sub']} and institution $institution_id");
        throw new HttpNotFoundException($request, "No summaries found for the user {$token['sub']} and institution $institution_id");
      }
      if(!empty($summary->getBannerId())) {
        $banner = $this->filesDao->getFileById($summary->getBannerId());
      }
      if(!empty($summary->getProfilePictureId())) {
        $profilePicture = $this->filesDao->getFileById($summary->getProfilePictureId());
      }

      $summaryDto = new InstitutionSummaryDto($summary, $banner, $profilePicture);

      $response->getBody()->write(json_encode($summaryDto));
      return $response;
    }catch (PDOException $e) {
      LogService::http500('/institutions-summary', "Could not get institutions summaries due to a database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not get institutions summaries due to a database error. See logs for more details');
    }
  }

  #[OA\Get(
        path: "/institutions",
        tags: ["Instituições"],
        summary: "Listar instituições do usuário",
        description: "Retorna todas as instituições em que o usuário autenticado participa",
        operationId: "getInstitutions",
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de instituições",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/InstitutionResponse")
                )
            ),
            new OA\Response(
                response: 404,
                description: "Nenhuma instituição encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getInstitutions(Request $request, Response $response): Response {
    try{
      $token = $request->getAttribute('token');
      $institutions = $this->institutionDao->getInstitutionsByUserId($token['sub']);
      if(empty($institutions)) {
        LogService::http404('/institutions', "User {$token['sub']} does not participate in any institutions");
        throw new HttpNotFoundException($request, "User does not participate in any institutions");
      }

      $institutionsDtos = array_map(function(Institution $institution) {
        if(!empty($institution->getBannerId())) {
          $banner = $this->filesDao->getFileById($institution->getBannerId());
        }
        if(!empty($institution->getProfilePictureId())) {
          $profilePicture = $this->filesDao->getFileById($institution->getProfilePictureId());          
        }

        return new InstitutionDto($institution, $banner, $profilePicture);
      }, $institutions);

      $response->getBody()->write(json_encode($institutionsDtos));
      return $response;
    } catch (PDOException $e) {
      LogService::http500('/institutions', "Could not search for institutions the user participates in due to an database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not search for institutions the user participates in due to an database error. See logs for more details');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500('/institutions', "Could not search for institutions the user participates in due to a unknown error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not search for institutions the user participates in due to a unknown error. See logs for more details');
    } 
  }

  #[OA\Get(
        path: "/institutions/{institution_id}",
        tags: ["Instituições"],
        summary: "Obter detalhes de uma instituição",
        description: "Retorna os detalhes completos de uma instituição específica",
        operationId: "getInstitutionById",
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID da instituição",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Detalhes da instituição",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Instituição não encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getInstitutionById(Request $request, Response $response, string $institution_id): Response {
    try{
      $institution = $this->institutionDao->getInstitutionById($institution_id);
      
      if(!empty($institution->getBannerId())) {
        $banner = $this->filesDao->getFileById($institution->getBannerId());
      }
      if(!empty($institution->getProfilePictureId())) {
        $profilePicture = $this->filesDao->getFileById($institution->getProfilePictureId());          
      }
      $institutionDto = new InstitutionDto($institution, $banner, $profilePicture);

      $response->getBody()->write(json_encode($institutionDto));
      return $response;
    } catch (PDOException $e) {
      LogService::http500('/institutions', "Could not search for institutions the user participates in due to an database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not search for institutions the user participates in due to an database error. See logs for more details');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500('/institutions', "Could not search for institutions the user participates in due to a unknown error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not search for institutions the user participates in due to a unknown error. See logs for more details');
    }
  }

  #[OA\Post(
        path: "/institutions",
        tags: ["Instituições"],
        summary: "Criar nova instituição",
        description: "Cria uma nova instituição para o usuário autenticado (limite de 3 instituições por usuário)",
        operationId: "createInstitution",
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Dados da instituição e arquivos de imagem",
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["name", "description"],
                    properties: [
                        new OA\Property(property: "name", type: "string", minLength: 3, maxLength: 255),
                        new OA\Property(property: "description", type: "string"),
                        new OA\Property(
                            property: "profile-picture",
                            type: "string",
                            format: "binary",
                            description: "Imagem de perfil da instituição"
                        ),
                        new OA\Property(
                            property: "banner",
                            type: "string",
                            format: "binary",
                            description: "Banner da instituição"
                        )
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Instituição criada com sucesso",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionResponse")
            ),
            new OA\Response(
                response: 400,
                description: "Dados inválidos",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 403,
                description: "Limite de instituições atingido",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function createInstitution(Request $request, Response $response): Response {
    try {
      $token = $request->getAttribute('token');
  
      $userOwnedInstitutions = $this->institutionDao->getOwnedInstitutions($token['sub']);
      
      if(count($userOwnedInstitutions) >= 3) {
        LogService::http403('/institutions', "User {$token['sub']} has reached the maximum number of owned institutions (3). Could not create institution.");
        throw new HttpForbiddenException($request, "User has reached the maximum number of owned institutions (3). Could not create institution.");
      }

      $body = $request->getParsedBody();
  
      $name = $body["name"] ?? null;
      $description = $body["description"] ?? null;

      $uploadedFiles = $request->getUploadedFiles();
    
      /**
       * @var UploadedFileInterface|null
       */
      $profilePicture = $uploadedFiles['profile-picture'] ?? null;
      /**
       * @var UploadedFileInterface|null
       */
      $banner = $uploadedFiles['banner'] ?? null;
      
      // Check for empty required fields
      if (empty($name) || empty($description)) {
        LogService::http422('/institutions', "Missing POST parameters: 'name' or 'description'");
        throw new HttpException($request, "POST parameters: 'name' and 'description' are required", 422);
      }

      try {
        $name = new InstitutionNameVo($name);
        $description = new InstitutionDescriptionVo($description);
        if(!empty($profilePicture)) $profilePicture = new ProfilePictureVo($profilePicture);
        if(!empty($banner)) $banner = new ProfilePictureVo($banner);
      } catch (InvalidArgumentException $e) {
        LogService::http422("/institutions/", $e->getMessage());
        throw new HttpException($request, $e->getMessage(), 422);
      }
      
      if(!empty($profilePicture)) {
        $fileUrl = $this->uploadService->institutionProfilePicture($profilePicture->getExtension(), $profilePicture->getContent());

        $profilePicture = $this->filesDao->createFile(new File([
          "file_id" => Uuid::uuid4()->toString(),
          "url" => $fileUrl,
          "filename" => $profilePicture->getSafeFilename(),
          "mime_type" => $profilePicture->getMimeType(),
          "size" => $profilePicture->getSize(),
          "uploaded_at" => date('Y-m-d H:i:s')
        ]));
      }

      if(!empty($banner)) {
        $fileUrl = $this->uploadService->institutionBanner($banner->getExtension(), $banner->getContent());

        $banner = $this->filesDao->createFile(new File([
          "file_id" => Uuid::uuid4()->toString(),
          "url" => $fileUrl,
          "filename" => $banner->getSafeFilename(),
          "mime_type" => $banner->getMimeType(),
          "size" => $banner->getSize(),
          "uploaded_at" => date('Y-m-d H:i:s')
        ]));
      }

      $institution = $this->institutionDao->createInstitution(new Institution([
        "institution_id" => Uuid::uuid4()->toString(),
        "user_id" => $token['sub'],
        "name" => $name->getValue(),
        "email" => $token["email"],
        "description" => $description->getValue(),
        "profile_picture_id" => $profilePicture ? $profilePicture->getFileId() : null,
        "banner_id" => $banner ? $banner->getFileId() : null,
      ]));

      $this->institutionUserDao->createInstitutionUser(new InstitutionUser([
        "institution_users_id" => Uuid::uuid4()->toString(),
        "role" => 'admin',
        "joined_at" => date('Y-m-d H:i:s'),
        "institution_id" => $institution->getInstitutionId(),
        "user_id" => $token['sub']
      ]));

      $institutionDto = new InstitutionDto($institution, $banner, $profilePicture);
      LogService::info('/institutions', "Create institution {$institution->getInstitutionId()} for user {$token['sub']}");
      $response->getBody()->write(json_encode($institutionDto));
      return $response;
    } catch (PDOException $e) {
      LogService::http500('/institutions', "Could not create the institution due to an database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not create the institution due to an database error. See logs for more detail');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500('/institutions', "Could not create the institution due to a unknown error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not create the institution due to a unknown error. See logs for more detail');
    }
  }

  #[OA\Patch(
    path: "/institutions/{institution_id}",
    tags: ["Instituições"],
    summary: "Atualizar instituição",
    description: "Atualiza os dados de uma instituição. Apenas administradores podem atualizar.",
    operationId: "updateInstitution",
    security: [["bearerAuth" => []]],
    parameters: [
      new OA\Parameter(
        name: "institution_id",
        in: "path",
        required: true,
        description: "ID da instituição",
        schema: new OA\Schema(type: "string", format: "uuid")
      )
    ],
    requestBody: new OA\RequestBody(
      required: true,
      description: "Dados da instituição e arquivos de imagem (ao menos um campo deve ser enviado)",
      content: new OA\MediaType(
        mediaType: "multipart/form-data",
        schema: new OA\Schema(
          properties: [
            new OA\Property(property: "name", type: "string", minLength: 3, maxLength: 255),
            new OA\Property(property: "description", type: "string"),
            new OA\Property(
              property: "profile-picture",
              type: "string",
              format: "binary",
              description: "Imagem de perfil da instituição"
            ),
            new OA\Property(
              property: "banner",
              type: "string",
              format: "binary",
              description: "Banner da instituição"
            )
          ]
        )
      )
    ),
    responses: [
      new OA\Response(
        response: 200,
        description: "Instituição atualizada com sucesso",
        content: new OA\JsonContent(ref: "#/components/schemas/InstitutionResponse")
      ),
      new OA\Response(
        response: 403,
        description: "Usuário não é administrador da instituição",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      ),
      new OA\Response(
        response: 404,
        description: "Instituição não encontrada",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      ),
      new OA\Response(
        response: 422,
        description: "Dados inválidos ou ausentes",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      ),
      new OA\Response(
        response: 500,
        description: "Erro interno do servidor",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      )
    ]
  )]
  public function updateInstitution(Request $request, Response $response, string $institution_id): Response {
    /**
     * @var InstitutionUser $membership
    */
    $membership = $request->getAttribute('membership');
    
    if($membership->getRole() !== "admin") {
      LogService::http403("/institutions/$institution_id", "User {$membership->getUserId()} is not admin");
      throw new HttpForbiddenException($request, 'User must be admin of the institution');
    }

    $body = $request->getParsedBody();
  
    $name = $body["name"] ?? null;
    $description = $body["description"] ?? null;
    $profilePictureId = $body["profile_picture_id"] ?? null;
    $bannerId = $body["banner_id"] ?? null;

    // Check for empty required fields
    if (empty($name) && empty($description) && empty($profilePictureId) && empty($bannerId)) {
      LogService::http422("/institutions/{$institution_id}", "Missing POST parameters: 'name' or 'description' and missing uploaded files 'profile_picture' or 'banner'");
      throw new HttpException($request, "POST parameters: 'name', 'description', 'profile_picture' or 'banner' are required", 422);
    }

    try {
      if(!empty($name)) $name = new InstitutionNameVo($name);
      if(!empty($description)) $description = new InstitutionDescriptionVo($description);
      if(!empty($profilePictureId)) $profilePictureId = new UuidV4Vo($profilePictureId);
      if(!empty($bannerId)) $bannerId = new UuidV4Vo($bannerId);
    } catch (InvalidArgumentException $e) {
      LogService::http422("/institutions/{$institution_id}", $e->getMessage());
      throw new HttpException($request, $e->getMessage(), 422);
    }

    try{
      $institution = $this->institutionDao->getInstitutionById($institution_id);
      
      if(empty($institution)) {
        throw new HttpInternalServerErrorException($request, "Could not update institution, institution $institution_id not found");
      }

      if(!empty($profilePictureId)) {
        $profilePicture = $this->filesDao->getFileById($profilePictureId->getValue());
        if(empty($profilePicture)) {
          LogService::http404("/institutions/{$institution_id}", "Profile picture with ID {$profilePictureId->getValue()} not found");
          throw new HttpNotFoundException($request, "Profile picture with ID {$profilePictureId->getValue()} not found");
        }
        if($profilePicture->getFileType()->value !== 'image') {
          LogService::http422("/institutions/{$institution_id}", "File (Profile picture) with ID {$profilePictureId->getValue()} is not an image");
          throw new HttpException($request, "File (Profile picture) with ID {$profilePictureId->getValue()} is not an image", 422);
        }
        $institution->setProfilePictureId($profilePictureId->getValue());
      }

      if(!empty($bannerId)) {
        $banner = $this->filesDao->getFileById($bannerId->getValue());
        if(empty($banner)) {
          LogService::http404("/institutions/{$institution_id}", "Banner with ID {$bannerId->getValue()} not found");
          throw new HttpNotFoundException($request, "Banner with ID {$bannerId->getValue()} not found");
        }
        if($banner->getFileType()->value !== 'image') {
          LogService::http422("/institutions/{$institution_id}", "File (Banner) with ID {$bannerId->getValue()} is not an image");
          throw new HttpException($request, "File (Banner) with ID {$bannerId->getValue()} is not an image", 422);
        }
        $institution->setBannerId($bannerId->getValue());
      }

      if(!empty($name)) $institution->setName($name->getValue());
      if(!empty($description)) $institution->setDescription($description->getValue());
      
      $institution = $this->institutionDao->updateInstitution($institution);

      $institutionDto = new InstitutionDto($institution, $banner ?? null, $profilePicture ?? null);

      $response->getBody()->write(json_encode($institutionDto));
      LogService::info("/institutions/{$institution_id}", "Institution {$institution->getInstitutionId()} updated by user {$membership->getUserId()}");
      return $response;
    }catch(PDOException $e) {
      LogService::http500("/institutions/{$institution_id}", "Could not update institution due to a database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not update institution due to a database error. See logs for more details');
    }catch(HttpException $e) {
      throw $e;
    }catch(Exception $e) {
      LogService::http500("/institutions/{$institution_id}", "Could not update institution due to a unknown error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not update institution due to a unknown error. See logs for more details');
    }
  }

  #[OA\Delete(
    path: "/institutions/{institution_id}",
    tags: ["Instituições"],
    summary: "Excluir instituição",
    description: "Exclui uma instituição. Apenas administradores podem excluir.",
    operationId: "deleteInstitution",
    security: [["bearerAuth" => []]],
    parameters: [
      new OA\Parameter(
        name: "institution_id",
        in: "path",
        required: true,
        description: "ID da instituição",
        schema: new OA\Schema(type: "string", format: "uuid")
      )
    ],
    responses: [
      new OA\Response(
        response: 204,
        description: "Instituição excluída com sucesso"
      ),
      new OA\Response(
        response: 403,
        description: "Usuário não é administrador da instituição",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      ),
      new OA\Response(
        response: 404,
        description: "Instituição não encontrada",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      ),
      new OA\Response(
        response: 500,
        description: "Erro interno do servidor",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      )
    ]
  )]
  public function deleteInstitution(Request $request, Response $response, string $institution_id): Response
  {
    /**
     * @var InstitutionUser $membership
     */
    $membership = $request->getAttribute('membership');

    if ($membership->getRole() !== "admin") {
      LogService::http403("/institutions/$institution_id", "User {$membership->getUserId()} is not admin");
      throw new HttpForbiddenException($request, 'User must be admin of the institution');
    }

    try {
      $institution = $this->institutionDao->getInstitutionById($institution_id);

      if (empty($institution)) {
        LogService::http404("/institutions/$institution_id", "Institution $institution_id not found");
        throw new HttpNotFoundException($request, "Institution $institution_id not found");
      }

      $this->institutionDao->deleteInstitution($institution_id);

      LogService::info("/institutions/$institution_id", "Institution $institution_id deleted by user {$membership->getUserId()}");
      return $response->withStatus(204);
    } catch (PDOException $e) {
      LogService::http500("/institutions/$institution_id", "Could not delete institution due to a database error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not delete institution due to a database error. See logs for more details');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/institutions/$institution_id", "Could not delete institution due to a unknown error: {$e->getMessage()}");
      throw new HttpInternalServerErrorException($request, 'Could not delete institution due to a unknown error. See logs for more details');
    }
  }
}