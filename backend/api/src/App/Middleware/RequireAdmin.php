<?php
declare(strict_types= 1);

namespace App\Middleware;

use App\Dao\InstitutionUsersDao;
use App\Enums\InstitutionUserType;
use App\Models\InstitutionUser;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Exception\HttpForbiddenException;

class RequireAdmin{
  public function __construct(
    private InstitutionUsersDao $institutionUsersDao
  ) {}

  public function __invoke(Request $request, RequestHandler $handler): Response
  {    
    /** @var InstitutionUser $membership */
    $membership = $request->getAttribute('membership');
    if ($membership->getRole() !== InstitutionUserType::Admin->value) {
      throw new HttpForbiddenException($request, 'User must be admin of the institution');
    }

    return $handler->handle($request);
  }
}