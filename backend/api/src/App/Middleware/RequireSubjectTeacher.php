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
class RequireSubjectTeacher{
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

    $subject_id = $route->getArgument('subject_id');
    $institution_id = $route->getArgument('institution_id');
    
    if(empty($subject_id) || empty($institution_id)) {
      throw new HttpBadRequestException($request, 'Missing subject ID or institution ID.');
    }

    $token = $request->getAttribute('token');
    
    try {
        $subject = $this->subjectsDao->getSubjectBySubjectIdAndInstitutionId($subject_id, $institution_id);
        
        if($subject->getTeacherId() !== $token['sub']) {
          throw new HttpForbiddenException($request, "Only the teacher of the subject can access this subject");
        }

        return $handler->handle($request);
    }catch (PDOException $e) {
        LogService::error('RequireSubjectTeacher middleware', 'Subject teacher validation failed due to a database error: '.$e->getMessage());
        throw new HttpInternalServerErrorException($request, 'Subject teacher validation failed due to a database error. See logs for more details');
    }catch (HttpException $e) {
        throw $e;
    }catch (Exception $e) {
        LogService::error('RequireSubjectTeacher middleware', 'Subject teacher validation failed due to an unknown error: '.$e->getMessage());
        throw new HttpInternalServerErrorException($request, 'Subject teacher validation failed due to an unknown error. See logs for more details');          
    }
  }
}