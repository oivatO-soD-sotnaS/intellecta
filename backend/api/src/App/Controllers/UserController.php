<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\UserDao;
use App\Dto\UserDto;
use App\Models\File;
use App\Services\EmailService;
use App\Services\LogService;
use App\Services\UploadService;
use App\Vo\PasswordVo;
use App\Vo\ProfilePictureVo;
use App\Vo\UsernameVo;
use App\Vo\UuidV4Vo;
use Exception;
use InvalidArgumentException;
use PDOException;
use Psr\Http\Message\UploadedFileInterface;
use Ramsey\Uuid\Nonstandard\Uuid;
use RuntimeException;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

use OpenApi\Attributes as OA;

#[OA\Tag(name: "Usuários", description: "Operações relacionadas a gestão de usuários")]
class UserController {
  public function __construct(
    private UserDao $userDao,
    private FilesDao $fileDao,
    private EmailService $emailService,
    private UploadService $uploadService,
    private FilesDao $filesDao
  ) {}
 
   #[OA\Get(
        path: "/users/{user_id}",
        tags: ["Usuários"],
        summary: "Obter dados do usuário",
        description: "Retorna os dados completos de um usuário específico (requer autenticação do próprio usuário)",
        operationId: "getUser",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "user_id",
                in: "path",
                required: true,
                description: "ID do usuário",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Dados do usuário",
                content: new OA\JsonContent(ref: "#/components/schemas/UserResponse")
            ),
            new OA\Response(
                response: 401,
                description: "Não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Usuário não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getUser(Request $request, Response $response, string $user_id): Response {
    try {
      $user = $this->userDao->getById($user_id);
      
      if (empty($user)) {
        LogService::http404("/users/$user_id", "User not found");
        throw new HttpNotFoundException($request, 'Object not found');
      }

      $token = $request->getAttribute("token");

      if ($token["sub"] !== $user->getUserId()) {
        LogService::http401("/users/$user_id", "Unauthorized access attempt by user {$token["sub"]}");
        throw new HttpUnauthorizedException($request, 'User not authorized');
      }

      if(!empty($user->getProfilePictureId())) {
        $profilePicture = $this->fileDao->getFileById($user->getProfilePictureId());
      }

      $userDto = new UserDto($user, $profilePicture);
      $response->getBody()->write(json_encode($userDto));
      return $response;
    } catch (PDOException $e) {
      LogService::http500("/users/$user_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Database error. See logs for details');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/users/$user_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Unexpected error. See logs for details');
    }
  }

  #[OA\Patch(
        path: "/users/{user_id}",
        tags: ["Usuários"],
        summary: "Atualizar usuário",
        description: "Atualiza os dados de um usuário (requer autenticação do próprio usuário)",
        operationId: "updateUser",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "user_id",
                in: "path",
                required: true,
                description: "ID do usuário",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Dados do usuário para atualização",
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "full_name", type: "string", nullable: true, minLength: 3, maxLength: 255),
                    new OA\Property(property: "password", type: "string", format: "password", nullable: true, minLength: 8),
                    new OA\Property(property: "profile_picture_id", type: "string", format: "uuid", nullable: true)
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Usuário atualizado com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "User updated successfully"),
                        new OA\Property(property: "user", ref: "#/components/schemas/UserResponse")
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: "Dados inválidos",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 401,
                description: "Não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Usuário não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function updateUser(Request $request, Response $response, string $user_id): Response {
    $body = $request->getParsedBody();

    $fullName = $body['full_name'] ?? null;
    $password = $body['password'] ?? null;
    $profilePictureId = $body['profile_picture_id'] ?? null;
    
    if (empty($fullName) && empty($password) && empty($profilePictureId)) {
      LogService::http422("/users/$user_id", "Missing fields to update");
      throw new HttpException($request, "'full_name', 'password' or 'profile_picture_id' are required", 422);
    }

    try {
      if(!empty($fullName)) $fullName = new UsernameVo($fullName);
      if(!empty($password)) $password = new PasswordVo($password);
      if(!empty($profilePictureId)) $profilePictureId = new UuidV4Vo($profilePictureId);
    } catch (InvalidArgumentException $e) {
      LogService::http422('/auth/sign-up', $e->getMessage());
      throw new HttpException($request, $e->getMessage(), 422);
    }

    try {
      $user = $this->userDao->getById($user_id);

      if (empty($user)) {
        LogService::http404("/users/$user_id", "User not found");
        throw new HttpNotFoundException($request, 'Object not found');
      }

      $token = $request->getAttribute('token');

      if ($token['sub'] !== $user->getUserId()) {
        LogService::http401("/users/$user_id", "Unauthorized update attempt by user {$token["sub"]}");
        throw new HttpUnauthorizedException($request, 'User not authorized');
      }

      if (!empty($fullName)) {
        $user->setFullName($fullName->getValue());
      }

      if (!empty($password)) {
        $user->setPasswordHash(password_hash($password->getValue(), PASSWORD_DEFAULT));
      }

      if (!empty($profilePictureId)) {
        $user->setProfilePictureId($profilePictureId->getValue());
      }
      
      $user = $this->userDao->update($user);
            
      if(!empty($user->getProfilePictureId())) {
        $profilePicture = $this->filesDao->getFileById($user->getProfilePictureId());
      }

      $userDto = new UserDto($user, $profilePicture);

      $response->getBody()->write(json_encode([
        'user' => $userDto,
        'message' => 'User updated successfully'
      ]));

      LogService::info("/users/$user_id", "User updated successfully");
      return $response;
    } catch (PDOException $e) {
      LogService::http500("/users/$user_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, "Could not update user due to a database error");
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/users/$user_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, "Unexpected error during update. See logs for more detail.");
    }
  }

  #[OA\Delete(
        path: "/users/{user_id}",
        tags: ["Usuários"],
        summary: "Excluir usuário",
        description: "Remove permanentemente um usuário (requer autenticação do próprio usuário)",
        operationId: "deleteUser",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "user_id",
                in: "path",
                required: true,
                description: "ID do usuário",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Usuário excluído com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "User deleted successfully")
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: "Não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Usuário não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function deleteUser(Request $request, Response $response, string $user_id): Response {
    try {
      $user = $this->userDao->getById($user_id);

      if (empty($user)) {
        LogService::http404("/users/$user_id", "User not found");
        throw new HttpNotFoundException($request, 'Object not found');
      }

      $token = $request->getAttribute("token");

      if ($token["sub"] !== $user->getUserId()) {
        LogService::http401("/users/$user_id", "Unauthorized deletion attempt by user {$token["sub"]}");
        throw new HttpUnauthorizedException($request, 'User not authorized');
      }

      if (!$this->userDao->delete($user->getUserId())) {
        LogService::http500("/users/$user_id", "Failed to delete user");
        throw new HttpInternalServerErrorException($request, 'Failed to delete user');
      }

      $response->getBody()->write(json_encode(['message' => 'User deleted successfully']));
      LogService::info("/users/$user_id", "User deleted successfully");
      return $response;
    } catch (PDOException $e) {
      LogService::http500("/users/$user_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not delete user due to a database error');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/users/$user_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Unexpected error. See logs for more detail');
    }
  }

   #[OA\Post(
        path: "/users/upload-profile-picture",
        tags: ["Usuários"],
        summary: "Upload de foto de perfil",
        description: "Faz upload de uma nova foto de perfil para o usuário",
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
  public function uploadProfilePicture(Request $request, Response $response): Response {
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
