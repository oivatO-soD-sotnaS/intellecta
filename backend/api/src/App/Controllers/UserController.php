<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\UserDao;
use App\Dto\UserDto;
use App\Enums\FileType;
use App\Services\EmailService;
use App\Services\LogService;
use App\Services\UploadService;
use App\Services\ValidatorService;
use App\Vo\PasswordVo;
use App\Vo\UsernameVo;
use App\Vo\UuidV4Vo;
use InvalidArgumentException;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Documented
readonly class UserController extends BaseController
{
  public function __construct(
    private UserDao $userDao,
    private FilesDao $fileDao,
    private FilesDao $filesDao,
    private EmailService $emailService,
    private UploadService $uploadService,
    private ValidatorService $validatorService
  ) {}

  public function getUser(Request $request, Response $response, string $user_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $user_id) {
      $user = $this->userDao->getById($user_id);
      
      if (empty($user)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $token = $request->getAttribute("token");
      if ($token["sub"] !== $user->getUserId()) {
        throw new HttpForbiddenException($request, LogService::HTTP_403);
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
        throw new InvalidArgumentException("'full_name', 'password' or 'profile_picture_id' are necessary to update the user");
      }

      if (!empty($fullName)) $fullName = new UsernameVo($fullName);
      if (!empty($password)) $password = new PasswordVo($password);
      if (!empty($profilePictureId)) $profilePictureId = new UuidV4Vo($profilePictureId);

      $user = $this->userDao->getById($user_id);
      if (empty($user)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $token = $request->getAttribute('token');
      if ($token['sub'] !== $user->getUserId()) {
        throw new HttpForbiddenException($request, LogService::HTTP_403);
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
          throw new HttpNotFoundException($request, LogService::HTTP_404 . "Profile picture not found");
        }
        if ($profilePicture->getFileType()->value !== FileType::Image->value) {
          throw new InvalidArgumentException( "Profile picture must be an image");
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
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $token = $request->getAttribute("token");
      if ($token["sub"] !== $user->getUserId()) {
        throw new HttpForbiddenException($request, LogService::HTTP_403);
      }

      $success = $this->userDao->delete($user->getUserId());
      if (!$success) {
        throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
      }

      $response->getBody()->write(json_encode(['message' => 'User deleted successfully']));
      LogService::info("/users/$user_id", "User deleted successfully");
      return $response;
    });
  }
}