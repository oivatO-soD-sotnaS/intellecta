<?php
declare(strict_types= 1);

namespace App\Middleware;

use App\Dao\SubjectsDao;
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
class RequireSubjectRelationship{
  public function __construct(
    private SubjectsDao $subjectsDao
  ) {}

  public function __invoke(Request $request, RequestHandler $handler): Response
  {
    $routeContext = RouteContext::fromRequest($request);
    $route = $routeContext->getRoute();

    if (!$route) {
      throw new HttpBadRequestException($request, 'Route not found.');
    }

    $subjectId = $route->getArgument('subject_id');
    
    if(empty($subjectId)) {
      throw new HttpBadRequestException($request, 'Missing subject ID.');
    }
    /** @var InstitutionUser $membership */
    $membership = $request->getAttribute('membership');
    $user = $request->getAttribute('user');
    
    try {
      $isRelatedToSubject = $this->subjectsDao->isUserRelatedToSubject($user->getUserId(), $subjectId);

      if(
        $membership->getRole() !== InstitutionUserType::Admin->value
        && !$isRelatedToSubject
      ) {
        LogService::http403('RequireSubjectRelationship', "User ".$user->getUserId(). " is not related to the subject with id {$subjectId}");
        throw new HttpForbiddenException($request, 'User can not access this subject');
      } 

      return $handler->handle($request);
    }catch (PDOException $e) {
      LogService::error('RequireSubjectRelationship middleware', 'Subject relationship validation failed due to a database error: '.$e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Subject relationship validation failed due to a database error. See logs for more details');
    }catch (HttpException $e) {
      throw $e;
    }catch (Exception $e) {
      LogService::error('RequireSubjectRelationship middleware', 'Subject relationship validation failed due to an unknown error: '.$e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Subject relationship validation failed due to an unknown error. See logs for more details');          
    }
  }
}