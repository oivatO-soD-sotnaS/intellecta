<?php

use App\Controllers\AuthController;
use App\Controllers\ClassesController;
use App\Controllers\ClassUsersController;
use App\Controllers\FilesController;
use App\Controllers\InstitutionalEventController;
use App\Controllers\InstitutionsController;
use App\Controllers\InstitutionUsersController;
use App\Controllers\InvitationsController;
use App\Controllers\UserController;
use App\Controllers\UserEventController;
use App\Middleware\RequireAdmin;
use App\Middleware\RequireAuth;
use App\Middleware\RequireClassMembership;
use App\Middleware\RequireInstitutionMembership;
use Slim\App;
use Slim\Handlers\Strategies\RequestResponseArgs;

return function (App $app) {
    $collector = $app->getRouteCollector();
    $collector->setDefaultInvocationStrategy(new RequestResponseArgs);

    define(
        'UUIDv4_REGEX', 
        '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'
    );

    // ******** ROTAS NÃO AUTENTICADAS ********
    $app->group('/auth', function ($group) {
        $group->post('/sign-up', AuthController::class . ':signUp');
        $group->post('/verify-account', AuthController::class . ':verifyEmail');
        $group->post('/sign-in', AuthController::class . ':signIn');
    });

    // ******** ROTAS AUTENTICADAS ********
    $app->group('/auth', function ($group) {
        $group->post('/sign-out', AuthController::class . ':signOut');
    })->add(RequireAuth::class);

    $app->group('/users', function ($group) {
        $group->group('/{user_id:'.UUIDv4_REGEX.'}', function($usersWithId) {
            $usersWithId->get('', UserController::class . ':getUser');
            $usersWithId->put('', UserController::class . ':updateUser');
            $usersWithId->delete('', UserController::class . ':deleteUser');
        });

        $group->post('/events', UserEventController::class . ':createUserEvent');
        $group->get('/events', UserEventController::class . ':getUserEvents');
        $group->group('/events/{event_id:'.UUIDv4_REGEX.'}', function($eventsWithId) {
            $eventsWithId->get('', UserEventController::class . ':getUserEvent');
            $eventsWithId->put('', UserEventController::class . ':updateUserEvent');
            $eventsWithId->delete('', UserEventController::class . ':deleteUserEvent');
        });

    })->add(RequireAuth::class);

    $app->group('/invitations', function ($group) {
        $group->get('', InvitationsController::class . ':getAllInvitations');
        
        $group->group('/{invitation_id:'.UUIDv4_REGEX.'}', function($invitationWithId) {
            $invitationWithId->get('', InvitationsController::class . ':getInvitation');
            $invitationWithId->post('/accept', InvitationsController::class . ':acceptInvitation');
        });
    })->add(RequireAuth::class);

    $app->group('/institutions', function ($group) {

        $group->get('', InstitutionsController::class . ':getInstitutions');
        $group->post('', InstitutionsController::class . ':createInstitution');
        $group->get('/owned', InstitutionsController::class . ':getUserInstitutions');
        $group->get('/summaries', InstitutionsController::class . ':getInstitutionsSummary');

        $group->group('/{institution_id:'.UUIDv4_REGEX.'}', function ($institution) {

            $institution->get('', InstitutionsController::class . ':getInstitutionById');
            $institution->put('', InstitutionsController::class . ':updateInstitution')->add(RequireAdmin::class);
            $institution->delete('', InstitutionsController::class . ':deleteInstitution')->add(RequireAdmin::class);
            $institution->get('/summary', InstitutionsController::class . ':getInstitutionSummaryById');

            // Institution Users
            $institution->group('/users', function ($users) {
                $users->get('', InstitutionUsersController::class . ':getInstitutionUsers')->add(RequireAdmin::class);
                $users->post('/invite', InstitutionUsersController::class . ':inviteUsers')->add(RequireAdmin::class);
                $users->patch('/{institution_user_id:'.UUIDv4_REGEX.'}', InstitutionUsersController::class . ':changeUserRole')->add(RequireAdmin::class);
                $users->delete('/{institution_user_id:'.UUIDv4_REGEX.'}', InstitutionUsersController::class . ':removeUser')->add(RequireAdmin::class);
            });

            // Institutional Events
            $institution->group('/events', function ($events) {
                $events->get('', InstitutionalEventController::class . ':getInstitutionalEvents');
                $events->post('', InstitutionalEventController::class . ':createInstitutionalEvent')->add(RequireAdmin::class);
                $events->get('/{event_id:'.UUIDv4_REGEX.'}', InstitutionalEventController::class . ':getInstitutionalEvent');
                $events->put('/{event_id:'.UUIDv4_REGEX.'}', InstitutionalEventController::class . ':updateInstitutionalEvent')->add(RequireAdmin::class);
                $events->delete('/{event_id:'.UUIDv4_REGEX.'}', InstitutionalEventController::class . ':deleteInstitutionalEvent')->add(RequireAdmin::class);
            });

            // Classes
            $institution->group('/classes', function ($classes) {
                $classes->get('', ClassesController::class . ':getInstitutionClasses');
                $classes->post('', ClassesController::class . ':createClass')
                    ->add(RequireAdmin::class);

                $classes->group('/{class_id:'.UUIDv4_REGEX.'}', function ($classesWithId) {
                    $classesWithId->get('', ClassesController::class . ':getClassById');
                    $classesWithId->put('', ClassesController::class . ':updateClass')
                        ->add(RequireAdmin::class);
                    $classesWithId->delete('', ClassesController::class . ':deleteClass')
                        ->add(RequireAdmin::class);
                    
                    $classesWithId->group('/users', function ($classUsers) {
                        $classUsers->get('', ClassUsersController::class . ':getClassUsers');
                        $classUsers->post('', ClassUsersController::class . ':createClassUsers')
                            ->add(RequireAdmin::class);

                        $classUsers->group('/{class_user_id:'.UUIDv4_REGEX.'}', function ($classUsersWithId) {
                            $classUsersWithId->get('', ClassUsersController::class . ':getClassUserById');
                            $classUsersWithId->delete('', ClassUsersController::class . ':removeClassUser')
                                ->add(RequireAdmin::class);
                        });
                    });

                    // Subjects under a class
                    // $classesWithId->group('/subjects', function ($subjects) {
                    //     $subjects->get('', SubjectsController::class . ':getSubjects');
                    //     $subjects->post('', SubjectsController::class . ':createSubject')
                    //         ->add(RequireAdmin::class);
                    //     $subjects->get('/{subject_id:'.UUIDv4_REGEX.'}', SubjectsController::class . ':getSubjectById');
                    //     $subjects->put('/{subject_id:'.UUIDv4_REGEX.'}', SubjectsController::class . ':updateSubject')
                    //         ->add(RequireAdmin::class);
                    //     $subjects->delete('/{subject_id:'.UUIDv4_REGEX.'}', SubjectsController::class . ':deleteSubject')
                    //         ->add(RequireAdmin::class);
                    // });
                })->add(RequireClassMembership::class);
            });

        })->add(RequireInstitutionMembership::class)->add(RequireAuth::class);

    })->add(RequireAuth::class); 

    $app->post('/files/upload-profile-assets', FilesController::class . ':uploadProfileAssets')
        ->add(RequireAuth::class);
};