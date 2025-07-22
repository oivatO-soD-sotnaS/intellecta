<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\UserDao;
use App\Dto\UserDto;
use App\Services\EmailService;
use App\Services\LogService;
use App\Services\UploadService;
use App\Vo\PasswordVo;
use App\Vo\UsernameVo;
use App\Vo\UuidV4Vo;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Documented
class UserController extends BaseController
{
  public function __construct(
    private UserDao $userDao,
    private FilesDao $fileDao,
    private EmailService $emailService,
    private UploadService $uploadService,
    private FilesDao $filesDao
  ) {}

  public function getUser(Request $request, Response $response, string $user_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $user_id) {
      $user = $this->userDao->getById($user_id);
      
      if (empty($user)) {
        throw new HttpNotFoundException($request, 'User not found');
      }

      $token = $request->getAttribute("token");
      if ($token["sub"] !== $user->getUserId()) {
        throw new HttpUnauthorizedException($request, 'User not authorized');
      }

      $profilePicture = !empty($user->getProfilePictureId()) 
        ? $this->fileDao->getFileById($user->getProfilePictureId()) 
        : null;

      $userDto = new UserDto($user, $profilePicture);
      $response->getBody()->write(json_encode($userDto));
      return $response;
    });
  }

  public function updateUser(Request $request, Response $response, string $user_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $user_id) {
      $body = $request->getParsedBody();
      $fullName = $body['full_name'] ?? null;
      $password = $body['password'] ?? null;
      $profilePictureId = $body['profile_picture_id'] ?? null;
      
      if (empty($fullName) && empty($password) && empty($profilePictureId)) {
        throw new HttpException($request, "At least one field is required for update", 422);
      }

      if (!empty($fullName)) $fullName = new UsernameVo($fullName);
      if (!empty($password)) $password = new PasswordVo($password);
      if (!empty($profilePictureId)) $profilePictureId = new UuidV4Vo($profilePictureId);

      $user = $this->userDao->getById($user_id);
      if (empty($user)) {
        throw new HttpNotFoundException($request, 'User not found');
      }

      $token = $request->getAttribute('token');
      if ($token['sub'] !== $user->getUserId()) {
        throw new HttpUnauthorizedException($request, 'User not authorized');
      }

      if ($fullName) {
        $user->setFullName($fullName->getValue());
      }

      if ($password) {
        $user->setPasswordHash(password_hash($password->getValue(), PASSWORD_DEFAULT));
      }

      if ($profilePictureId) {
        $profilePicture = $this->filesDao->getFileById($profilePictureId->getValue());
        if (empty($profilePicture)) {
          throw new HttpNotFoundException($request, "Profile picture not found");
        }
        if ($profilePicture->getFileType()->value !== 'image') {
          throw new HttpInternalServerErrorException($request, "Profile picture must be an image");
        }
        $user->setProfilePictureId($profilePictureId->getValue());
      }
      
      $user = $this->userDao->update($user);
      $profilePicture = $user->getProfilePictureId() 
        ? $this->filesDao->getFileById($user->getProfilePictureId()) 
        : null;

      $userDto = new UserDto($user, $profilePicture);
      $response->getBody()->write(json_encode([
        'user' => $userDto,
        'message' => 'User updated successfully'
      ]));

      LogService::info("/users/$user_id", "User updated successfully");
      return $response;
    });
  }

  public function deleteUser(Request $request, Response $response, string $user_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $user_id) {
      $user = $this->userDao->getById($user_id);
      if (empty($user)) {
        throw new HttpNotFoundException($request, 'User not found');
      }

      $token = $request->getAttribute("token");
      if ($token["sub"] !== $user->getUserId()) {
        throw new HttpUnauthorizedException($request, 'User not authorized');
      }

      if (!$this->userDao->delete($user->getUserId())) {
        throw new HttpInternalServerErrorException($request, 'Failed to delete user');
      }

      $response->getBody()->write(json_encode(['message' => 'User deleted successfully']));
      LogService::info("/users/$user_id", "User deleted successfully");
      return $response;
    });
  }
}