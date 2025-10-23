<?php
declare(strict_types= 1);

namespace App\Middleware;

use App\Dao\ClassUsersDao;
use App\Enums\InstitutionUserType;
use App\Models\InstitutionUser;
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
class RequireClassMembership{
  public function __construct(
    private ClassUsersDao $classUsersDao
  ) {}

  public function __invoke(Request $request, RequestHandler $handler): Response
  {
    $routeContext = RouteContext::fromRequest($request);
    $route = $routeContext->getRoute();

    if (!$route) {
      throw new HttpBadRequestException($request, 'Route not found.');
    }

    $classId = $route->getArgument('class_id');
    
    if(empty($classId)) {
      throw new HttpBadRequestException($request, 'Missing class ID.');
    }
    /** @var InstitutionUser $membership */
    $membership = $request->getAttribute('membership');
    $user = $request->getAttribute('user');
    
    try {
      $isUserMemberOfClass = $this->classUsersDao->isUserMemberOfClass($user->getUserId(), $classId);

      if(
        $membership->getRole() !== InstitutionUserType::Admin->value
        && !$isUserMemberOfClass
      ) {
        LogService::http403('RequireClassMembership', "User ".$user->getUserId(). " is not a member of the class {$classId}");
        throw new HttpForbiddenException($request, 'User can not access this class');
      } 

      return $handler->handle($request);
    }catch (PDOException $e) {
      LogService::error('RequireClassMembership middleware', 'Class membership validation failed due to a database error: '.$e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Class membership validation failed due to a database error. See logs for more details');
    }catch (HttpException $e) {
      throw $e;
    }catch (Exception $e) {
      LogService::error('RequireClassMembership middleware', 'Class membership validation failed due to an unknown error: '.$e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Class membership validation failed due to an unknown error. See logs for more details');          
    }
  }
}