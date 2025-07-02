<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\UserDao;
use App\Models\File;
use App\Services\EmailService;
use App\Services\LogService;
use App\Services\UploadService;
use App\Services\ValidationService;
use Exception;
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
    private ValidationService $validationService,
    private UploadService $uploadService
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

      $response->getBody()->write(json_encode($user));
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

    if (!empty($fullName) && !$this->validationService->isValidUsername($fullName)) {
      LogService::http422("/users/$user_id", "Invalid username: $fullName");
      throw new HttpException($request, 'Full name must be between 5 and 64 characters', 422);
    }

    if (!empty($password) && !$this->validationService->isValidPassword($password)) {
      LogService::http422("/users/$user_id", "Invalid password format");
      throw new HttpException($request, 'Password must be between 8 and 64 characters, and must contain at least one uppercase letter, one lowercase letter, one number, and one special character', 422);
    }

    if (!empty($profilePictureId)) {
      LogService::http422("/users/$user_id", "Invalid profile picture file id");
      throw new HttpException($request, 'Invalid profile picture file id', 422);
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
        $user->setFullName($fullName);
      }

      if (!empty($password)) {
        $user->setPasswordHash(password_hash($password, PASSWORD_DEFAULT));
      }

      if (!empty($profilePictureId)) {
        $user->setProfilePictureId($profilePictureId);
      }

      $user = $this->userDao->update($user);

      $response->getBody()->write(json_encode([
        'user' => $user,
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

    if (!$profilePicture || $profilePicture->getError() !== UPLOAD_ERR_OK) {
      LogService::http422('/users/upload-profile-picture', "Missing 'profile-picture' file");
      throw new HttpException($request, "Invalid upload, Missing 'profile-picture' file", 422);
    }

    $maxSize = 1024 * 500; // 500KB
    if ($profilePicture->getSize() > $maxSize) {
      LogService::http413('/users/upload-profile-picture', 'Image exceds maximum size of 500kbs');
      throw new HttpException($request, "File exceeds 500KB limit", 413);
    }
    if ($profilePicture->getSize() === 0) {
      LogService::http422('/users/upload-profile-picture', 'Image cannot be empty');
      throw new HttpException($request, "Empty file not allowed", 422);
    }

    $tempFile = $profilePicture->getStream()->getMetadata('uri');

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $tempFile);
    finfo_close($finfo);

    $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($mimeType, $allowedMimes, true)) {
      LogService::http422('/users/upload-profile-picture', "Invalid mime type: $mimeType");
      throw new HttpException($request, "Only JPEG, PNG, GIF, and WebP are allowed", 422);
    }

    $filename = $profilePicture->getClientFilename();
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $mimeToExt = [
      'image/jpeg' => ['jpeg', 'jpg'],
      'image/png'  => ['png'],
      'image/gif'  => ['gif'],
      'image/webp' => ['webp'],
    ];
    if (!in_array($ext, $mimeToExt[$mimeType] ?? [])) {
      LogService::http422('/users/upload-profile-picture', "File extension does not match its content");
      throw new HttpException($request, "File extension does not match its content", 422);
    }

    $safeFilename = preg_replace('/[^a-zA-Z0-9\-_.]/', '', $filename);
    $safeFilename = substr($safeFilename, 0, 100); // Limit filename length
    $safeFilename = pathinfo($safeFilename, PATHINFO_FILENAME);

    try {
      $fileUrl = $this->uploadService->avatar($ext, $profilePicture->getStream()->getContents());
      
      $file = $this->fileDao->createFile(new File([
        "file_id" => Uuid::uuid4()->toString(),
        "url" => $fileUrl,
        "filename" => $safeFilename,
        "mime_type" => $mimeType,
        "size" => $profilePicture->getSize(),
        "uploaded_at" => date('Y-m-d H:i:s')
      ]));
      
      if(empty($file)) {
        LogService::http500('/users/upload-profile-picture', "Could not create file due to an database error");
        throw new HttpInternalServerErrorException($request, "Could not create file due to an database error");
      }

      $response->getBody()->write(json_encode($file));

      LogService::info('/users/upload-profile-picture', "Avatar uploaded successfully!");
      return $response->withHeader('Content-Type', 'application/json');
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
