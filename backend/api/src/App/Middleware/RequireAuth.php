<?php

declare(strict_types= 1);

namespace App\Middleware;

use App\Dao\UsersDao;
use App\Services\JwtService;
use App\Services\LogService;
use Exception;
use PDOException;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpUnauthorizedException;

class RequireAuth{
  public function __construct(
    private JwtService $jwtService,
    private UsersDao $usersDao
  ) {}

  public function __invoke(Request $request, RequestHandler $handler): Response
{
    $authHeader = $request->getHeaderLine("Authorization");

    if (empty($authHeader)) {
      throw new HttpUnauthorizedException($request, 'Authorization header is required');
    }

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
      throw new HttpUnauthorizedException($request, 'Malformed authorization header');
    }

    $token = $matches[1];

    if (empty($token) || count(explode('.', $token)) !== 3) {
      throw new HttpUnauthorizedException($request, 'Invalid token format');
    }

    try {
      $decoded = $this->jwtService->validateToken($token);

      if (!$decoded) {
        throw new HttpUnauthorizedException($request, 'Invalid token signature');
      }

      $user = $this->usersDao->getUserById($decoded["sub"]);
      
      if(empty($user) || !$user->isEmailVerified()){
        throw new HttpUnauthorizedException($request, 'User not found');
      }

      $request = $request->withAttribute('user', $user);

      return $handler->handle($request);
    }catch (PDOException $e) {
      LogService::error('RequireAuth middlware', 'Token validation failed due to a database error: '.$e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Token validation failed due to a database error. See logs for more details');
    }catch (HttpException $e) {
      throw $e;
    }catch (Exception $e) {
      LogService::error('RequireAuth middlware', 'Token validation failed due to a unknown error: '.$e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Token validation failed due to a unknown error. See logs for more details');
    }
  }
}
