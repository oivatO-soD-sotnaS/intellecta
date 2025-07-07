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

class UserController {
  public function __construct(
    private UserDao $userDao,
    private FilesDao $fileDao,
    private EmailService $emailService,
    private UploadService $uploadService,
    private FilesDao $filesDao
  ) {}
 
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
