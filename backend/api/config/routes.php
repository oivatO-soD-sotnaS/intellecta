<?php

use App\Controllers\AuthController;
use App\Controllers\ClassesController;
use App\Controllers\ClassSubjectsController;
use App\Controllers\ClassUsersController;
use App\Controllers\FilesController;
use App\Controllers\InstitutionalEventController;
use App\Controllers\InstitutionsController;
use App\Controllers\InstitutionUsersController;
use App\Controllers\InvitationsController;
use App\Controllers\SubjectMaterialsController;
use App\Controllers\SubjectsController;
use App\Controllers\UserController;
use App\Controllers\UserEventController;
use App\Middleware\RequireAdmin;
use App\Middleware\RequireAuth;
use App\Middleware\RequireClassMembership;
use App\Middleware\RequireInstitutionMembership;
use App\Middleware\RequireSubjectRelationship;
use App\Middleware\RequireSubjectTeacher;
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

    $app->group('/institutions', function ($institution) {

        $institution->get('', InstitutionsController::class . ':getInstitutions');
        $institution->post('', InstitutionsController::class . ':createInstitution');
        $institution->get('/owned', InstitutionsController::class . ':getUserInstitutions');
        $institution->get('/summaries', InstitutionsController::class . ':getInstitutionsSummary');

        $institution->group('/{institution_id:'.UUIDv4_REGEX.'}', function ($institutionWithId) {
            $institutionWithId->get('', InstitutionsController::class . ':getInstitutionById');
            $institutionWithId->put('', InstitutionsController::class . ':updateInstitution')
                ->add(RequireAdmin::class);
            $institutionWithId->delete('', InstitutionsController::class . ':deleteInstitution')
                ->add(RequireAdmin::class);
            $institutionWithId->get('/summary', InstitutionsController::class . ':getInstitutionSummaryById');

            // Institution subjects
            $institutionWithId->group('/subjects', function ($institutionSubjects) {
                $institutionSubjects->get('', SubjectsController::class . ':getInstitutionSubjects')
                    ->add(RequireAdmin::class);
                $institutionSubjects->post('', SubjectsController::class . ':createSubject');

                $institutionSubjects->group('/{subject_id:'.UUIDv4_REGEX.'}', function($institutionSubjectsWithId) {
                    $institutionSubjectsWithId->get('', SubjectsController::class . ':getSubjectById');
                    $institutionSubjectsWithId->put('', SubjectsController::class . ':updateSubjectById');
                    $institutionSubjectsWithId->delete('', SubjectsController::class . ':deleteSubjectById');

                    // Subject materials
                    $institutionSubjectsWithId->group('/materials', function($subjectMaterials) {
                        $subjectMaterials->get('', SubjectMaterialsController::class . ':getSubjectMaterials');
                        $subjectMaterials->post('', SubjectMaterialsController::class . ':createSubjectMaterial')
                            ->add(RequireSubjectTeacher::class);
                        $subjectMaterials->group('/{material_id:'.UUIDv4_REGEX.'}', function($subjectMaterialWithId) {
                            $subjectMaterialWithId->get('', SubjectMaterialsController::class . ':getMaterialById');
                            $subjectMaterialWithId->patch('', SubjectMaterialsController::class . ':updateMaterial')
                                ->add(RequireSubjectTeacher::class);
                            $subjectMaterialWithId->delete('', SubjectMaterialsController::class . ':deleteMaterial')
                                ->add(RequireSubjectTeacher::class);
                        });
                    });
                })->add(RequireSubjectRelationship::class);
            });
            
            // Institution Users
            $institutionWithId->group('/users', function ($institutionUsers) {
                $institutionUsers->get('', InstitutionUsersController::class . ':getInstitutionUsers')
                    ->add(RequireAdmin::class);
                $institutionUsers->post('/invite', InstitutionUsersController::class . ':inviteUsers')
                    ->add(RequireAdmin::class);
                $institutionUsers->group('/{institution_user_id:'.UUIDv4_REGEX.'}', function($institutionUsersWithId) {
                    $institutionUsersWithId->patch('/change-role', InstitutionUsersController::class . ':changeUserRole')
                        ->add(RequireAdmin::class);
                    $institutionUsersWithId->delete('', InstitutionUsersController::class . ':removeUser');
                });
            });

            // Institutional Events
            $institutionWithId->group('/events', function ($institutionEvents) {
                $institutionEvents->get('', InstitutionalEventController::class . ':getInstitutionalEvents');
                $institutionEvents->post('', InstitutionalEventController::class . ':createInstitutionalEvent')
                    ->add(RequireAdmin::class);
                $institutionEvents->group('/{event_id:'.UUIDv4_REGEX.'}', function($institutionEventsWithId) {
                    $institutionEventsWithId->get('', InstitutionalEventController::class . ':getInstitutionalEvent');
                    $institutionEventsWithId->put('', InstitutionalEventController::class . ':updateInstitutionalEvent')
                        ->add(RequireAdmin::class);
                    $institutionEventsWithId->delete('', InstitutionalEventController::class . ':deleteInstitutionalEvent')
                        ->add(RequireAdmin::class);
                });
            });

            // Classes
            $institutionWithId->group('/classes', function ($institutionClasses) {
                $institutionClasses->get('', ClassesController::class . ':getInstitutionClasses');
                $institutionClasses->post('', ClassesController::class . ':createClass')
                    ->add(RequireAdmin::class);

                $institutionClasses->group('/{class_id:'.UUIDv4_REGEX.'}', function ($classesWithId) {
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
                    $classesWithId->group('/subjects', function ($clasSubjects) {
                        $clasSubjects->get('', ClassSubjectsController::class . ':getClassSubjects');
                        $clasSubjects->post('', ClassSubjectsController::class . ':addSubjectToClass')
                            ->add(RequireAdmin::class);
                        $clasSubjects->group('/{class_subject_id:'.UUIDv4_REGEX.'}', function($clasSubjectsWithId) {
                            $clasSubjectsWithId->get('', ClassSubjectsController::class . ':getClassSubjectById');
                            $clasSubjectsWithId->delete('', ClassSubjectsController::class . ':removeSubjectFromClass')
                                ->add(RequireAdmin::class);
                        });
                    });
                })->add(RequireClassMembership::class);
            });

        })->add(RequireInstitutionMembership::class)->add(RequireAuth::class);

    })->add(RequireAuth::class); 

    $app->post('/files/upload-profile-assets', FilesController::class . ':uploadProfileAssets')
        ->add(RequireAuth::class);
};