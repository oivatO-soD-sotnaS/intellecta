<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Dao\UserDao;
use App\Services\EmailService;
use App\Services\LogService;
use App\Services\ValidationService;
use Exception;
use PDOException;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class UserController {
  public function __construct(
    private UserDao $userDao, 
    private EmailService $emailService,
    private ValidationService $validationService
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
    $profilePictureUrl = $body['profile_picture_url'] ?? null;

    if (empty($fullName) && empty($password) && empty($profilePictureUrl)) {
      LogService::http422("/users/$user_id", "Missing fields to update");
      throw new HttpException($request, "'full_name', 'password' or 'profile_picture_url' are required", 422);
    }

    if (!empty($fullName) && !$this->validationService->isValidUsername($fullName)) {
      LogService::http422("/users/$user_id", "Invalid username: $fullName");
      throw new HttpException($request, 'Full name must be between 5 and 64 characters', 422);
    }

    if (!empty($password) && !$this->validationService->isValidPassword($password)) {
      LogService::http422("/users/$user_id", "Invalid password format");
      throw new HttpException($request, 'Password must be between 8 and 64 characters, and must contain at least one uppercase letter, one lowercase letter, one number, and one special character', 422);
    }

    if (!empty($profilePictureUrl) && !$this->validationService->isValidURL($profilePictureUrl)) {
      LogService::http422("/users/$user_id", "Invalid profile picture URL");
      throw new HttpException($request, 'Invalid profile picture URL', 422);
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

      if (!empty($profilePictureUrl)) {
        $user->setProfilePictureId($profilePictureUrl);
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
}
