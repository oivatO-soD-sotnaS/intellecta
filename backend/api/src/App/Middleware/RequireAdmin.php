<?php
declare(strict_types= 1);

namespace App\Middleware;

use App\Dao\InstitutionUserDao;
use App\Models\InstitutionUser;
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

class RequireAdmin{
  public function __construct(
    private InstitutionUserDao $institutionUserDao
  ) {}

  public function __invoke(Request $request, RequestHandler $handler): Response
  {    
    /** @var InstitutionUser $membership */
    $membership = $request->getAttribute('membership');
    if ($membership->getRole() !== "admin") {
        throw new HttpForbiddenException($request, 'User must be admin of the institution');
    }

    return $handler->handle($request);
  }
}