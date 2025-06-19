<?php

declare(strict_types= 1);

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
 
  public function getUser(Request $request, Response $response, string $id): Response {
    $user = $this->userDao->getById($id);
    
    if(empty($user)) {
      LogService::error("/users/$id", "User with the following ID was not found: $id");
      throw new HttpNotFoundException($request, 'Object not found') ;
    }

    $token = $request->getAttribute("token");

    if($token["sub"] !== $user->getUserId()) {
      LogService::error("/users/$id", "User with ID: ".$token["sub"]. " unauthorized to access get data from user with ID: $id");
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
      LogService::error("/users/$id", "Unprocessable entity, missing POST parameters: 'full_name', 'password' and 'profile_picture_url'");
      throw new HttpException($request, "'full_name', 'password' or 'profile_picture_url' are required", 422);
    }

    // Validações condicionais
    if (!empty($fullName) && !$this->validationService->isValidUsername($fullName)) {
      LogService::error("/users/$id", "Could not update user due to invalid username: $fullName");
      throw new HttpException($request, 'Full name must be between 5 and 64 characters', 422);
    }
    if (!empty($password) && !$this->validationService->isValidPassword($password)) {
      LogService::error("/users/$id", "Could not update user due to invalid password: $password");
      throw new HttpException($request, 'Password must be between 8 and 64 characters, and must contain at least one uppercase letter, one lowercase letter, one number, and one special character', 422);
    }
    if (!empty($profilePictureUrl) && !$this->validationService->isValidURL($profilePictureUrl)) {
      LogService::error("/users/$id", "Could not update user due to invalid profile picture URL");
      throw new HttpException($request, 'Invalid profile picture URL', 422);
    }

    try {
      $user = $this->userDao->getById($id);

      if (empty($user)) {
        LogService::error("/users/$id", "Could not find the user with ID: $id");
        throw new HttpNotFoundException($request, 'Object not found');
      }

      $token = $request->getAttribute('token');

      if ($token['sub'] !== $user->getUserId()) {
        LogService::error("/users/$id", "User with ID: ".$token["sub"]. " unauthorized to update data from user with ID: $id");
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
      switch(true) {
        case $e instanceof PDOException:
          LogService::error("/users/$id", "Could not update user due to database error: ".$e->getMessage());
          throw new HttpInternalServerErrorException($request, "Could not update user due to a database error");
        case $e instanceof HttpException:
          throw $e;
        default:
          LogService::error("/users/$id", "Could not update user due to database error: ".$e->getMessage());
          throw new HttpInternalServerErrorException($request, "An unexpected error occured. See logs for more detail.");
      }
    }
  }

  public function deleteUser(Request $request, Response $response, string $id): Response {
    $user = $this->userDao->getById($id);
    
    if(empty($user)) {
      LogService::error("/users/$id", "Could not find the user with ID: $id");
      throw new HttpNotFoundException($request, 'Object not found');
    }

    $token = $request->getAttribute("token");

    if($token["sub"] !== $user->getUserId()) {
      LogService::error("/users/$id", "User with ID: ".$token["sub"]. " unauthorized to delete data from user with ID: $id");
      throw new HttpUnauthorizedException($request, 'User not authorized');
    }

    if(!$this->userDao->delete($user->getUserId())) {
      LogService::error("/users/$id", "Could not delete the user with ID: $id");
      throw new HttpException($request, 'Failed to delete user', 500);
    }

    $response->getBody()->write(json_encode(['message' => 'User deleted successfully']));
    return $response;
  }

}