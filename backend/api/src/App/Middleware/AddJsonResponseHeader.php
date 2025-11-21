<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class AddJsonResponseHeader
{
  public function __invoke(Request $request, RequestHandler $handler): Response
  {
    $method = $request->getMethod();
    $url    = (string) $request->getUri();

    error_log(sprintf('Request: %s %s', $method, $url));

    $response = $handler->handle($request);

    return $response->withHeader("Content-Type", "application/json");
  }
}
