<?php

use App\Controllers\AuthController;
use App\Controllers\FilesController;
use App\Controllers\InstitutionalEventController;
use App\Controllers\InstitutionsController;
use App\Controllers\InstitutionUsersController;
use App\Controllers\InvitationsController;
use App\Controllers\UserController;
use App\Controllers\UserEventController;
use App\Middleware\RequireAdmin;
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
    $app->put('/users/events/{event_id:'.UUIDv4_REGEX.'}', UserEventController::class . ':updateUserEvent')
        ->add(RequireAuth::class);
    $app->delete('/users/events/{event_id:'.UUIDv4_REGEX.'}', UserEventController::class . ':deleteUserEvent')
        ->add(RequireAuth::class);
    $app->get('/users/events/{event_id:'.UUIDv4_REGEX.'}', UserEventController::class . ':getUserEvent')
        ->add(RequireAuth::class);

    // Rotas de usuário
    $app->get('/users/{user_id:'.UUIDv4_REGEX.'}', UserController::class . ':getUser')
        ->add(RequireAuth::class);
    $app->put('/users/{user_id:'.UUIDv4_REGEX.'}', UserController::class . ':updateUser')
        ->add(RequireAuth::class);
    $app->delete('/users/{user_id:'.UUIDv4_REGEX.'}', UserController::class . ':deleteUser')
        ->add(RequireAuth::class);
    // Rotas de evento da instituição
    $app->get('/institutions/{institution_id:'.UUIDv4_REGEX.'}/events', InstitutionalEventController::class . ':getInstitutionalEvents')
        ->add(RequireInstitutionMembership::class)    
        ->add(RequireAuth::class);
    $app->post('/institutions/{institution_id:'.UUIDv4_REGEX.'}/events', InstitutionalEventController::class . ':createInstitutionalEvent')
        ->add(RequireAdmin::class)    
        ->add(RequireInstitutionMembership::class)    
        ->add(RequireAuth::class);
    $app->put('/institutions/{institution_id:'.UUIDv4_REGEX.'}/events/{event_id:'.UUIDv4_REGEX.'}', InstitutionalEventController::class . ':updateInstitutionalEvent')
        ->add(RequireAdmin::class)    
        ->add(RequireInstitutionMembership::class)    
        ->add(RequireAuth::class);
    $app->delete('/institutions/{institution_id:'.UUIDv4_REGEX.'}/events/{event_id:'.UUIDv4_REGEX.'}', InstitutionalEventController::class . ':deleteInstitutionalEvent')
        ->add(RequireAdmin::class)    
        ->add(RequireInstitutionMembership::class)    
        ->add(RequireAuth::class);
    $app->get('/institutions/{institution_id:'.UUIDv4_REGEX.'}/events/{event_id:'.UUIDv4_REGEX.'}', InstitutionalEventController::class . ':getInstitutionalEvent')
        ->add(RequireInstitutionMembership::class)    
        ->add(RequireAuth::class);

    // Rotas de instituição
    $app->get('/institutions/summaries', InstitutionsController::class . ':getInstitutionsSummary')
        ->add(RequireAuth::class);
    $app->get('/institutions/{institution_id:'.UUIDv4_REGEX.'}/summary', InstitutionsController::class . ':getInstitutionSummaryById')
        ->add(RequireInstitutionMembership::class)
        ->add(RequireAuth::class);
    $app->get('/institutions/owned', InstitutionsController::class . ":getUserInstitutions")
        ->add(RequireAuth::class);
    $app->get('/institutions', InstitutionsController::class . ":getInstitutions")
        ->add(RequireAuth::class);
    $app->post('/institutions', InstitutionsController::class . ":createInstitution")
        ->add(RequireAuth::class);
    $app->get('/institutions/{institution_id:'.UUIDv4_REGEX.'}', InstitutionsController::class . ":getInstitutionById")
        ->add(RequireInstitutionMembership::class)
        ->add(RequireAuth::class);
    $app->put('/institutions/{institution_id:'.UUIDv4_REGEX.'}', InstitutionsController::class . ":updateInstitution")
        ->add(RequireAdmin::class)
        ->add(RequireInstitutionMembership::class)
        ->add(RequireAuth::class);
    $app->delete('/institutions/{institution_id:'.UUIDv4_REGEX.'}', InstitutionsController::class . ":deleteInstitution")
        ->add(RequireAdmin::class)
        ->add(RequireInstitutionMembership::class)
        ->add(RequireAuth::class);
    // Rotas de usuário da instituição
    $app->get('/institutions/{institution_id:'.UUIDv4_REGEX.'}/users', InstitutionUsersController::class . ":getInstitutionUsers")
        ->add(RequireAdmin::class)    
        ->add(RequireInstitutionMembership::class)
        ->add(RequireAuth::class);
    $app->post('/institutions/{institution_id:'.UUIDv4_REGEX.'}/users/invite', InstitutionUsersController::class . ":inviteUsers")
        ->add(RequireAdmin::class)    
        ->add(RequireInstitutionMembership::class)
        ->add(RequireAuth::class);
    $app->patch('/institutions/{institution_id:'.UUIDv4_REGEX.'}/users/{institution_user_id:'.UUIDv4_REGEX.'}', InstitutionUsersController::class . ":changeUserRole")
        ->add(RequireAdmin::class)    
        ->add(RequireInstitutionMembership::class)
        ->add(RequireAuth::class);
    $app->delete('/institutions/{institution_id:'.UUIDv4_REGEX.'}/users/{institution_user_id:'.UUIDv4_REGEX.'}', InstitutionUsersController::class . ":removeUser")
        ->add(RequireAdmin::class)    
        ->add(RequireInstitutionMembership::class)
        ->add(RequireAuth::class);
    // Rotas de convite
    $app->post('/invitations/{invitation_id:'.UUIDv4_REGEX.'}/accept', InvitationsController::class . ":acceptInvitation")
        ->add(RequireAuth::class);
    $app->get('/invitations', InvitationsController::class . ":getAllInvitations")
        ->add(RequireAuth::class);
    $app->get('/invitations/{invitation_id:'.UUIDv4_REGEX.'}', InvitationsController::class . ":getInvitation")
        ->add(RequireAuth::class);
        
    // Rotas de turma


    // Rotas de disciplina


    // Rotas de mensagem do fórum da disciplina 


    // Rotas de evento


    // Rotas de atividade avaliativa


    // Rotas de entrega de atividade avaliativa


    // Rotas de Notificação 


    // Rotas de arquivo
    $app->post('/files/upload-profile-assets', FilesController::class . ':uploadProfileAssets');
};
