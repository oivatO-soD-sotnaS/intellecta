<?php
declare(strict_types= 1);

namespace App\Middleware;

use App\Dao\InstitutionUsersDao;
use App\Services\JwtService;
use App\Services\LogService;
use Exception;
use PDOException;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Routing\RouteContext;

class RequireInstitutionMembership{
  public function __construct(
    private InstitutionUsersDao $institutionUsersDao
  ) {}

  public function __invoke(Request $request, RequestHandler $handler): Response
  {
    
    $routeContext = RouteContext::fromRequest($request);
    $route = $routeContext->getRoute();

    if (!$route) {
      throw new HttpBadRequestException($request, 'Route not found.');
    }

    $institutionId = $route->getArgument('institution_id');
    
    if (!$institutionId) {
      throw new HttpBadRequestException($request, 'Missing institution ID.');
    }
    
    $token = $request->getAttribute("token");
    
    try {
      $institutionUser = $this->institutionUsersDao->getInstitutionUserByInstitutionIdAndUserId($institutionId, $token['sub']);
      if(empty($institutionUser)) {
        LogService::http403('RequireInstitutionMembership', "User ".$token['email']. " is not a member of the institution $institutionId");
        throw new HttpForbiddenException($request, 'User is not a member of the institution');
      }

      $request = $request->withAttribute('membership', $institutionUser);

      return $handler->handle($request);
    }catch (PDOException $e) {
      LogService::error('RequireInstitutionMembership middleware', 'Institution membership validation failed due to a database error: '.$e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Institution membership validation failed due to a database error. See logs for more details');
    }catch (HttpException $e) {
      throw $e;
    }catch (Exception $e) {
      LogService::error('RequireInstitutionMembership middleware', 'Institution membership validation failed due to an unknown error: '.$e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Institution membership validation failed due to an unknown error. See logs for more details');          
    }
  }
}