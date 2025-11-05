<?php
declare(strict_types= 1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\ForumMessagesDao;
use App\Dao\SubjectsDao;
use App\Dao\UsersDao;
use App\Dto\ForumMessageDto;
use App\Dto\PaginationDto;
use App\Dto\UserDto;
use App\Models\ForumMessage;
use App\Queue\RedisEmailQueue;
use App\Services\LogService;
use App\Services\ValidatorService;
use App\Templates\Email\EmailTemplateProvider;
use App\Vo\ForumMessageContentVo;
use App\Vo\ForumMessagesFiltersVo;
use App\Vo\PaginationVo;
use DateTime;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

readonly class ForumMessagesController extends BaseController {
    public function __construct(
        private ForumMessagesDao $forumMessagesDao,
        private UsersDao $usersDao,
        private FilesDao $filesDao,
        private ValidatorService $validatorService,
        private SubjectsDao $subjectsDao,
        private EmailTemplateProvider $emailTemplateProvider,
        private RedisEmailQueue $emailQueue
    ) {}

    public function getSubjectForumMessages(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            $queryParameters = $request->getQueryParams();

            $pagination = new PaginationVo($queryParameters);
            $forumMessagesFilters = new ForumMessagesFiltersVo($queryParameters);

            $forumMessages = $this->forumMessagesDao->getForumMessagesBySubjectIdPaginated(
                $subject_id,
                $pagination,
                $forumMessagesFilters->getDaoFilters()
            );

            if(count($forumMessages) === 0) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }
            
            $forumMessagesDtos = array_map(
                function(ForumMessage $forumMessage): ForumMessageDto 
                {
                    $sentBy = !empty($forumMessage->getSentBy())
                        ? $this->usersDao->getUserById($forumMessage->getSentBy())
                        : null;
                    $sentByProfilePicture = $sentBy !== null && !empty($sentBy->getProfilePictureId())
                        ? $this->filesDao->getFileById($sentBy->getProfilePictureId())
                        : null;
                    $sentByDto = $sentBy !== null
                        ? new UserDto($sentBy, $sentByProfilePicture)
                        : null;

                    return new ForumMessageDto($forumMessage, $sentByDto);
                }, $forumMessages
            );

            $total_records = $this->forumMessagesDao->countForumMessagesBySubjectId(
                $subject_id,
                $forumMessagesFilters->getDaoFilters()
            );
            
            $total_pages = (int) ceil($total_records / $pagination->getLimit());

            $page = intdiv($pagination->getOffset(), $pagination->getLimit()) + 1;

            $paginationDto = new PaginationDto(
                $page,
                $total_pages,
                $total_records,
                $forumMessagesDtos
            );

            $response->getBody()->write(json_encode($paginationDto));                
            return $response;
        });
    }

    public function countSubjectForumMessages(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            $queryParameters = $request->getQueryParams();
            $forumMessagesFilters = new ForumMessagesFiltersVo($queryParameters);

            $count = $this->forumMessagesDao->countForumMessagesBySubjectId(
                $subject_id,
                $forumMessagesFilters->getDaoFilters()
            );

            $response->getBody()->write(json_encode(['count' => $count]));
            return $response;
        });
    }

    public function createSubjectForumMessage(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            $user = $request->getAttribute('user');
            $body = $request->getParsedBody();
            $this->validatorService->validateRequired($body, ["content"]);

            $content = new ForumMessageContentVo($body['content']);

            $timestamp = date('Y-m-d H:i:s');
            $forumMessage = $this->forumMessagesDao->createForumMessage(
                new ForumMessage([
                    'forum_messages_id' => Uuid::uuid4()->toString(),
                    'content' => $content->getValue(),
                    'created_at' => $timestamp,
                    'changed_at' => $timestamp,
                    'sent_by' => $user->getUserId(),
                    'subject_id' => $subject_id
                ])
            );

            if(empty($forumMessage)) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $subjectStudents = $this->subjectsDao->getStudentsBySubjectId($subject_id);
            $subject = $this->subjectsDao->getSubjectBySubjectIdAndInstitutionId($subject_id, $institution_id);

            foreach ($subjectStudents as $student) {
                $this->emailQueue->push([
                'to' => $student->getEmail(),
                'toName' => $student->getFullName(),
                'subject' => "{$subject->getName()} - Nova publicação no fórum da disciplina",
                'body' => $this->emailTemplateProvider->getProfessorForumPostCreatedEmailTemplate(
                    $student->getFullName(),
                    $forumMessage,
                    $subject->getName(),
                    $user->getFullName(),
                    $user->getEmail()
                ),
                'altBody' => "{$student->getFullName()},\n\nUma nova publicação foi feita no fórum da disciplina {$subject->getName()}.\n\nAtenciosamente,\nEquipe Intellecta"
                ]);
            }

            $sentByProfilePicture = !empty($user->getProfilePictureId())
                ? $this->filesDao->getFileById($user->getProfilePictureId())
                : null;
            $sentByDto = new UserDto($user, $sentByProfilePicture);

            $forumMessageDto = new ForumMessageDto($forumMessage, $sentByDto);

            $response->getBody()->write(json_encode($forumMessageDto));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/forum/messages",
                "{$user->getUserId()} created a new forum message to subject '{$subject_id}'",
            );
            return $response;
        });
    }

    public function updateForumMessage(Request $request, Response $response, string $institution_id, string $subject_id, string $forum_message_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $forum_message_id) {
            $user = $request->getAttribute('user');
            $forumMessage = $this->forumMessagesDao->getForumMessageByForumMessageId($forum_message_id);

            if (
                $forumMessage === null ||
                $forumMessage->getSubjectId() !== $subject_id
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $now = new DateTime();
            $createdAt = new DateTime($forumMessage->getCreatedAt());
            $createdAtPlus15 = (clone $createdAt)->modify('+15 minutes');
            if ($now > $createdAtPlus15) {
                throw new HttpForbiddenException($request, LogService::HTTP_403.'Forum message cannot be updated after 15 minutes');
            }
                        
            $body = $request->getParsedBody();
            $this->validatorService->validateRequired($body, ["content"]);

            $content = new ForumMessageContentVo($body['content']);
            $timestamp = $now->format('Y-m-d H:i:s');

            $forumMessage->setContent($content->getValue());
            $forumMessage->setChangedAt($timestamp);

            $forumMessage = $this->forumMessagesDao->updateForumMessage($forumMessage);
            
            if ($forumMessage === null) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $subjectStudents = $this->subjectsDao->getStudentsBySubjectId($subject_id);
            $subject = $this->subjectsDao->getSubjectBySubjectIdAndInstitutionId($subject_id, $institution_id);

            foreach ($subjectStudents as $student) {
                $this->emailQueue->push([
                'to' => $student->getEmail(),
                'toName' => $student->getFullName(),
                'subject' => "{$subject->getName()} - Publicação alterada no fórum da disciplina",
                'body' => $this->emailTemplateProvider->getProfessorForumPostUpdatedEmailTemplate(
                    $student->getFullName(),
                    $forumMessage,
                    $subject->getName(),
                    $user->getFullName(),
                    $user->getEmail()
                ),
                'altBody' => "{$student->getFullName()},\n\nUma publicação foi alterada no fórum da disciplina {$subject->getName()}.\n\nAtenciosamente,\nEquipe Intellecta"
                ]);
            }

            $sentByProfilePicture = !empty($user->getProfilePictureId())
                ? $this->filesDao->getFileById($user->getProfilePictureId())
                : null;
            $sentByDto = new UserDto($user, $sentByProfilePicture);

            $forumMessageDto = new ForumMessageDto($forumMessage, $sentByDto);

            $response->getBody()->write(json_encode($forumMessageDto));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/forum/messages/{$forum_message_id}",
                "{$user->getUserId()} updated the forum message '{$forum_message_id}'",
            );
            return $response;
        });
    }    
}