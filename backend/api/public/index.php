<?php

declare(strict_types=1);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php://stderr');
error_reporting(E_ALL);

use DI\ContainerBuilder;
use Slim\Exception\HttpException;
use Slim\Factory\AppFactory;
use Slim\Handlers\Strategies\RequestResponseArgs;
use Slim\Psr7\Request;

define('APP_ROOT', dirname(__DIR__));

require APP_ROOT . "/vendor/autoload.php";

$builder = new ContainerBuilder;

$container = $builder->addDefinitions(APP_ROOT . '/config/definitions.php')
                     ->build();

AppFactory::setContainer($container);

$app = AppFactory::create();

$collector = $app->getRouteCollector();
$collector->setDefaultInvocationStrategy(new RequestResponseArgs);

// Add body parsing middleware
$app->addBodyParsingMiddleware();

// Add error middleware (correct variable name)
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// Set custom error handler
$errorMiddleware->setDefaultErrorHandler(function (
    Request $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails
) use ($app) {
    $response = $app->getResponseFactory()->createResponse();
    $statusCode = 500;
    $message = 'An error occurred';
    
    // Handle HTTP exceptions
    if ($exception instanceof HttpException) {
        $statusCode = $exception->getCode();
        $message = $exception->getMessage();
    }
    // Handle other exceptions
    else {
        $statusCode = 500;
        $message = $exception->getMessage();
    }
    
    // Prepare JSON response
    $payload = [
        'error' => [
            'code' => $statusCode,
            'message' => $message,
        ]
    ];
    
    $response->getBody()->write(json_encode($payload));
    
    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($statusCode);
});

// Add JSON response header middleware
$app->add(App\Middleware\AddJsonResponseHeader::class);

// ********ROTAS NÃO AUTENTICADAS***********
// Rotas de auth
$app->post('/auth/sign-up', App\Controllers\AuthController::class . ':signUp');
$app->post('/auth/verify-account', App\Controllers\AuthController::class . ':verifyEmail');
$app->post('/auth/sign-in', App\Controllers\AuthController::class . ':signIn');
$app->post('/auth/sign-out', App\Controllers\AuthController::class . ':signOut')
    ->add(App\Middleware\ValidateToken::class);

// ********ROTAS AUTENTICADAS***********
// Rotas de usuário
$app->get('/users/{id}', App\Controllers\UserController::class . ':getById')
    ->add(App\Middleware\ValidateToken::class);
$app->patch('/users/{id}', App\Controllers\UserController::class . ':patchById')
    ->add(App\Middleware\ValidateToken::class);
$app->delete('/users/{id}', App\Controllers\UserController::class . ':deleteById')
    ->add(App\Middleware\ValidateToken::class);
// Rotas de evento do usuário
$app->get('/users/{id}/events', App\Controllers\UserEventController::class . ':getUserEvents')
    ->add(App\Middleware\ValidateToken::class);
$app->post('/users/{id}/events', App\Controllers\UserEventController::class . ':createUserEvent')
    ->add(App\Middleware\ValidateToken::class);
// Rotas de instituição

// Rotas de turma

// Rotas de disciplina

// Rotas de mensagem do fórum da disciplina 

// Rotas de evento

// Rotas de atividade avaliativa

// Rotas de entrega de atividade avaliativa

// Rotas de Notificação 

// Rotas de arquivo

// -> Inicializa Aplicação REST <-
$app->run();