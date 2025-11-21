<?php

use App\Controllers\AuthController;
use App\Controllers\ClassesController;
use App\Controllers\ClassSubjectsController;
use App\Controllers\ClassUsersController;
use App\Controllers\FilesController;
use App\Controllers\InstitutionalEventsController;
use App\Controllers\InstitutionsController;
use App\Controllers\InstitutionUsersController;
use App\Controllers\InvitationsController;
use App\Controllers\AssignmentsController;
use App\Controllers\ForumMessagesController;
use App\Controllers\NotificationsController;
use App\Controllers\SubjectEventsController;
use App\Controllers\SubjectMaterialsController;
use App\Controllers\SubjectsController;
use App\Controllers\SubmissionsController;
use App\Controllers\UsersController;
use App\Controllers\UserEventsController;
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

    $app->group('/users', function ($users) {
        $users->group('/me', function($user) {
            $user->get('', UsersController::class . ':getUser');
            $user->put('', UsersController::class . ':updateUser');
            $user->delete('', UsersController::class . ':deleteUser');

            $user->group('/events', function($userEvents) use ($user) {
                $userEvents->post('', UserEventsController::class . ':createUserEvent');
                $userEvents->get('', UserEventsController::class . ':getUserEvents');
                $userEvents->get('/upcoming', UserEventsController::class . ':getUpcomingEvents');

                $userEvents->group('/{user_event_id:'.UUIDv4_REGEX.'}', function($userEventsWithId) {
                    $userEventsWithId->get('', UserEventsController::class . ':getUserEvent');
                    $userEventsWithId->put('', UserEventsController::class . ':updateUserEvent');
                    $userEventsWithId->delete('', UserEventsController::class . ':deleteUserEvent');
                });
            });
    
            $user->group('/notifications', function($userNotifications) {
               $userNotifications->get('', NotificationsController::class . ':getUserNotifications');
               $userNotifications->patch('/{notification_id:'.UUIDv4_REGEX.'}/set-as-seen', NotificationsController::class . ':setNotificationAsSeen'); 
            });
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

                    // Subject Forum messages
                    $institutionSubjectsWithId->group('/forum/messages', function($institutionSubjectsWithIdForum) {
                        $institutionSubjectsWithIdForum->get('', ForumMessagesController::class . ':getSubjectForumMessages');
                        $institutionSubjectsWithIdForum->get('/count', ForumMessagesController::class . ':countSubjectForumMessages');
                        $institutionSubjectsWithIdForum->post('', ForumMessagesController::class . ':createSubjectForumMessage')
                            ->add(RequireSubjectTeacher::class);

                        $institutionSubjectsWithIdForum->patch('/{forum_message_id:'.UUIDv4_REGEX.'}', ForumMessagesController::class . ':updateForumMessage')
                            ->add(RequireSubjectTeacher::class);
                    });

                    // Subject Materials
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

                    // Subject Assignments
                    $institutionSubjectsWithId->group('/assignments', function($subjectAssignments) {
                        $subjectAssignments->get('', AssignmentsController::class . ':getSubjectAssignments');
                        $subjectAssignments->post('', AssignmentsController::class . ':createSubjectAssignment')
                            ->add(RequireSubjectTeacher::class);

                        $subjectAssignments->group('/{assignment_id:'.UUIDv4_REGEX.'}', function($subjectAssignmentWithId) {
                            $subjectAssignmentWithId->get('', AssignmentsController::class . ':getSubjectAssignmentById');
                            $subjectAssignmentWithId->patch('', AssignmentsController::class . ':patchSubjectAssignmentById')
                                ->add(RequireSubjectTeacher::class);
                            $subjectAssignmentWithId->delete('', AssignmentsController::class . ':deleteSubjectAssignmentById')
                                ->add(RequireSubjectTeacher::class);

                            // Assignment submissions
                            $subjectAssignmentWithId->group('/submissions', function ($assignmentSubmissions) {
                                $assignmentSubmissions->get('', SubmissionsController::class . ':getAssignmentSubmissions')
                                    ->add(RequireSubjectTeacher::class);
                                $assignmentSubmissions->post('', SubmissionsController::class . ':createAssignmentSubmission');

                                $assignmentSubmissions->group('/{submission_id:'.UUIDv4_REGEX.'}', function($assignmentSubmissionWithId) {
                                    $assignmentSubmissionWithId->get('', SubmissionsController::class .':getSubmissionById');
                                    $assignmentSubmissionWithId->delete('', SubmissionsController::class . ':deleteSubmissionById');
                                    
                                    $assignmentSubmissionWithId->group('attachment', function ($assignmentSubmissionWithIdAttachment) {
                                        $assignmentSubmissionWithIdAttachment->patch('', SubmissionsController::class . ':updateSubmissionAttachment');
                                    });
                                    // Avaliar envio de atividade
                                    $assignmentSubmissionWithId->group('/evaluate', function ($assignmentSubmissionWithIdGrading) {
                                        $assignmentSubmissionWithIdGrading->post('', SubmissionsController::class . ':evaluateSubmissionById');
                                    })->add(RequireSubjectTeacher::class);
                                });
                            });
                        });
                    });

                    // Subject Events
                    $institutionSubjectsWithId->group('/events', function($subjectEvents) {
                        $subjectEvents->get('', SubjectEventsController::class . ':getSubjectEvents');
                        $subjectEvents->post('', SubjectEventsController::class . ':createSubjectEvent')
                            ->add(RequireSubjectTeacher::class);

                        $subjectEvents->group('/{subject_event_id:'.UUIDv4_REGEX.'}', function($subjectEventsWithId) {
                            $subjectEventsWithId->get('', SubjectEventsController::class . ':getSubjectEvent');
                            $subjectEventsWithId->patch('', SubjectEventsController::class . ':updateSubjectEvent')
                                ->add(RequireSubjectTeacher::class);
                            $subjectEventsWithId->delete('', SubjectEventsController::class . ':deleteSubjectEvent')
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
                $institutionEvents->get('', InstitutionalEventsController::class . ':getInstitutionalEvents');
                $institutionEvents->post('', InstitutionalEventsController::class . ':createInstitutionalEvent')
                    ->add(RequireAdmin::class);
                $institutionEvents->group('/{event_id:'.UUIDv4_REGEX.'}', function($institutionEventsWithId) {
                    $institutionEventsWithId->get('', InstitutionalEventsController::class . ':getInstitutionalEvent');
                    $institutionEventsWithId->put('', InstitutionalEventsController::class . ':updateInstitutionalEvent')
                        ->add(RequireAdmin::class);
                    $institutionEventsWithId->delete('', InstitutionalEventsController::class . ':deleteInstitutionalEvent')
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

    // Files
    $app->post('/files/upload-profile-assets', FilesController::class . ':uploadProfileAssets')
        ->add(RequireAuth::class);
    $app->post('/files/upload-file', FilesController::class . 'uploadFile')
        ->add(RequireAuth::class);
};
