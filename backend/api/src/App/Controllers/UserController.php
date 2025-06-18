<?php

declare(strict_types= 1);

namespace App\Controllers;

use App\Dao\UserDao;
use App\Services\EmailService;
use App\Services\ValidationService;
use Exception;
use Slim\Exception\HttpException;
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
 
  public function getUser(Request $request, Response $response, string $id): Response {
    $user = $this->userDao->getById($id);
    
    if(empty($user)) {
     throw new HttpNotFoundException($request, 'Object not found') ;
    }

    $token = $request->getAttribute("token");

    if($token["sub"] !== $user->getUserId()) {
      throw new HttpUnauthorizedException($request, 'User not authorized');
    }

    $response->getBody()->write(json_encode($user));
    return $response;
  }

  public function updateUser(Request $request, Response $response, string $id): Response {
    $body = $request->getParsedBody();

    $fullName = $body['full_name'] ?? null;
    $password = $body['password'] ?? null;
    $profilePictureUrl = $body['profile_picture_url'] ?? null;

    if(
      empty($fullName) && 
      empty($password) && 
      empty($profilePictureUrl)
    ){
      throw new HttpException($request, "'full_name', 'password' or 'profile_picture_url' are required", 422);
    }

    // Validações condicionais
    if (!empty($fullName) && !$this->validationService->isValidUsername($fullName)) {
      throw new HttpException($request, 'Full name must be between 5 and 64 characters', 422);
    }
    if (!empty($profilePictureUrl) && !$this->validationService->isValidURL($profilePictureUrl)) {
      throw new HttpException($request, 'Invalid profile picture URL', 422);
    }
    if (!empty($password) && !$this->validationService->isValidPassword($password)) {
      throw new HttpException($request, 'Password must be between 8 and 64 characters, and must contain at least one uppercase letter, one lowercase letter, one number, and one special character', 422);
    }

    try {
      $user = $this->userDao->getById($id);

      if (empty($user)) {
        throw new HttpNotFoundException($request, 'Object not found');
      }

      $token = $request->getAttribute('token');

      if ($token['sub'] !== $user->getUserId()) {
        throw new HttpUnauthorizedException($request, 'User not authorized');
      }

      // Atualiza somente os campos fornecidos
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

      return $response;
    } catch (Exception $e) {
      throw new HttpException(
        $request,
        "An error occurred while processing the request. Error: " . $e->getMessage(),
        500
      );
    }
  }

  public function deleteUser(Request $request, Response $response, string $id): Response {
    $user = $this->userDao->getById($id);
    
    if(empty($user)) {
      throw new HttpNotFoundException($request, 'Object not found');
    }

    $token = $request->getAttribute("token");

    if($token["sub"] !== $user->getUserId()) {
      throw new HttpUnauthorizedException($request, 'User not authorized');
    }

    if(!$this->userDao->delete($user->getUserId())) {
      throw new HttpException($request, 'Failed to delete user', 500);
    }

    $response->getBody()->write(json_encode(['message' => 'User deleted successfully']));
    return $response;
  }

}