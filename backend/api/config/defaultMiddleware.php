<?php

use App\Middleware\AddJsonResponseHeader;
use Slim\App;
use Slim\Exception\HttpException;
use Slim\Psr7\Request;

return function (App $app) {
    $app->addBodyParsingMiddleware();
    $app->add(AddJsonResponseHeader::class);

    $errorMiddleware = $app->addErrorMiddleware(true, true, true);

    $errorMiddleware->setDefaultErrorHandler(
        function (
            Request $request,
            Throwable $exception,
            bool $displayErrorDetails,
            bool $logErrors,
            bool $logErrorDetails
        ) use ($app) {
            $response = $app->getResponseFactory()->createResponse();
            $statusCode = $exception instanceof HttpException ? $exception->getCode() : 500;
            $message = $exception->getMessage();

            $payload = [
                'error' => [
                    'code' => $statusCode,
                    'message' => $message,
                ]
            ];

            $response->getBody()->write(json_encode($payload));
            return $response->withHeader('Content-Type', 'application/json')->withStatus($statusCode);
        }
    );
};
