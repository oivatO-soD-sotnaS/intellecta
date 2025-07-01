<?php

use App\Controllers\AuthController;
use App\Controllers\InstitutionalEventController;
use App\Controllers\InstitutionsController;
use App\Controllers\UserController;
use App\Controllers\UserEventController;
use App\Middleware\RequireAuth;
use App\Middleware\RequireInstitutionMembership;
use Slim\App;
use Slim\Handlers\Strategies\RequestResponseArgs;

return function (App $app) {
    $collector = $app->getRouteCollector();
    $collector->setDefaultInvocationStrategy(new RequestResponseArgs);

    define('UUIDv4_REGEX', '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}');

    // ********ROTAS NÃO AUTENTICADAS***********
    // Rotas de auth
    $app->post('/auth/sign-up', AuthController::class . ':signUp');
    $app->post('/auth/verify-account', AuthController::class . ':verifyEmail');
    $app->post('/auth/sign-in', AuthController::class . ':signIn');
    $app->post('/auth/sign-out', AuthController::class . ':signOut')
        ->add(RequireAuth::class);

    // ********ROTAS AUTENTICADAS***********
    // Rotas de evento do usuário
    $app->get('/users/events', UserEventController::class . ':getUserEvents')
        ->add(RequireAuth::class);
    $app->post('/users/events', UserEventController::class . ':createUserEvent')
        ->add(RequireAuth::class);
    $app->patch('/users/events/{event_id:'.UUIDv4_REGEX.'}', UserEventController::class . ':updateUserEvent')
        ->add(RequireAuth::class);
    $app->delete('/users/events/{event_id:'.UUIDv4_REGEX.'}', UserEventController::class . ':deleteUserEvent')
        ->add(RequireAuth::class);
    $app->get('/users/events/{event_id:'.UUIDv4_REGEX.'}', UserEventController::class . ':getUserEvent')
        ->add(RequireAuth::class);

    // Rotas de usuário
    $app->get('/users/{user_id:'.UUIDv4_REGEX.'}', UserController::class . ':getUser')
        ->add(RequireAuth::class);
    $app->patch('/users/{user_id:'.UUIDv4_REGEX.'}', UserController::class . ':updateUser')
        ->add(RequireAuth::class);
    $app->delete('/users/{user_id:'.UUIDv4_REGEX.'}', UserController::class . ':deleteUser')
        ->add(RequireAuth::class);
    $app->post('/users/upload-profile-picture', UserController::class . ':uploadProfilePicture');
        // ->add(RequireAuth::class);

    // Rotas de evento da instituição
    $app->get('/institutions/{institution_id:'.UUIDv4_REGEX.'}/events', InstitutionalEventController::class . ':getInstitutionalEvents')
        ->add(RequireInstitutionMembership::class)    
        ->add(RequireAuth::class);
    $app->post('/institutions/{institution_id:'.UUIDv4_REGEX.'}/events', InstitutionalEventController::class . ':createInstitutionalEvent')
        ->add(RequireInstitutionMembership::class)    
        ->add(RequireAuth::class);
    $app->patch('/institutions/{institution_id:'.UUIDv4_REGEX.'}/events/{event_id:'.UUIDv4_REGEX.'}', InstitutionalEventController::class . ':updateInstitutionalEvent')
        ->add(RequireInstitutionMembership::class)    
        ->add(RequireAuth::class);
    $app->delete('/institutions/{institution_id:'.UUIDv4_REGEX.'}/events/{event_id:'.UUIDv4_REGEX.'}', InstitutionalEventController::class . ':deleteInstitutionalEvent')
        ->add(RequireInstitutionMembership::class)    
        ->add(RequireAuth::class);
    $app->get('/institutions/{institution_id:'.UUIDv4_REGEX.'}/events/{event_id:'.UUIDv4_REGEX.'}', InstitutionalEventController::class . ':getInstitutionalEvent')
        ->add(RequireInstitutionMembership::class)    
        ->add(RequireAuth::class);

    // Rotas de instituição
    $app->get('/institutions/summary', InstitutionsController::class . ':getInstitutionsSummary')
        ->add(RequireAuth::class);
    $app->get('/institutions/{institution_id:'.UUIDv4_REGEX.'}/summary', InstitutionsController::class . ':getInstitutionSummaryById')
        ->add(RequireInstitutionMembership::class)
        ->add(RequireAuth::class);
    $app->post('/institutions', InstitutionsController::class . ":createInstitution")
        ->add(RequireAuth::class);
    // Rotas de turma


    // Rotas de disciplina


    // Rotas de mensagem do fórum da disciplina 


    // Rotas de evento


    // Rotas de atividade avaliativa


    // Rotas de entrega de atividade avaliativa


    // Rotas de Notificação 


    // Rotas de arquivo
};
