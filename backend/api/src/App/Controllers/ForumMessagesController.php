<?php
declare(strict_types= 1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\ForumMessagesDao;
use App\Dao\UsersDao;
use App\Dto\ForumMessageDto;
use App\Dto\PaginationDto;
use App\Dto\UserDto;
use App\Models\ForumMessage;
use App\Services\LogService;
use App\Services\ValidatorService;
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
        private ValidatorService $validatorService
    ) {}

    public function getSubjectForumMessages(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            $queryParameters = $request->getQueryParams();

            $pagination = new PaginationVo($queryParameters);
            $forumMessagesFilters = new ForumMessagesFiltersVo($queryParameters);

            $forumMessages = $pagination->hasPagination()
                ? $forumMessages = $this->forumMessagesDao->getForumMessagesBySubjectIdPaginated(
                    $subject_id, 
                    $pagination, 
                    $forumMessagesFilters->getDaoFilters()
                )
                : $forumMessages = $this->forumMessagesDao->getForumMessagesBySubjectId(
                    $subject_id,
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
            
            $total_pages = $pagination->hasPagination()
                ? (int) ceil($total_records / $pagination->getLimit())
                : 1;

            $page = $pagination->hasPagination()
                ? $page = intdiv($pagination->getOffset(), $pagination->getLimit()) + 1
                : 1;

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
            $token = $request->getAttribute('token');
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
                    'sent_by' => $token['sub'],
                    'subject_id' => $subject_id
                ])
            );

            if(empty($forumMessage)) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $sentBy = !empty($forumMessage->getSentBy())
                ? $this->usersDao->getUserById($forumMessage->getSentBy())
                : null;
            $sentByProfilePicture = $sentBy !== null && !empty($sentBy->getProfilePictureId())
                ? $this->filesDao->getFileById($sentBy->getProfilePictureId())
                : null;
            $sentByDto = $sentBy !== null
                ? new UserDto($sentBy, $sentByProfilePicture)
                : null;

            $forumMessageDto = new ForumMessageDto($forumMessage, $sentByDto);

            $response->getBody()->write(json_encode($forumMessageDto));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/forum/messages",
                "{$token['email']} created a new forum message to subject '{$subject_id}'",
            );
            return $response;
        });
    }

    public function updateForumMessage(Request $request, Response $response, string $institution_id, string $subject_id, string $forum_message_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $forum_message_id) {
            $token = $request->getAttribute('token');
            $forum_message = $this->forumMessagesDao->getForumMessageByForumMessageId($forum_message_id);

            if (
                $forum_message === null ||
                $forum_message->getSubjectId() !== $subject_id
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $now = new DateTime();
            $createdAt = new DateTime($forum_message->getCreatedAt());
            $createdAtPlus15 = (clone $createdAt)->modify('+15 minutes');
            if ($now > $createdAtPlus15) {
                throw new HttpForbiddenException($request, LogService::HTTP_403.'Forum message cannot be updated after 15 minutes');
            }
                        
            $body = $request->getParsedBody();
            $this->validatorService->validateRequired($body, ["content"]);

            $content = new ForumMessageContentVo($body['content']);
            $timestamp = $now->format('Y-m-d H:i:s');

            $forum_message->setContent($content->getValue());
            $forum_message->setChangedAt($timestamp);

            $forum_message = $this->forumMessagesDao->updateForumMessage($forum_message);
            
            if ($forum_message === null) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $sentBy = !empty($forum_message->getSentBy())
                ? $this->usersDao->getUserById($forum_message->getSentBy())
                : null;
            $sentByProfilePicture = $sentBy !== null && !empty($sentBy->getProfilePictureId())
                ? $this->filesDao->getFileById($sentBy->getProfilePictureId())
                : null;
            $sentByDto = $sentBy !== null
                ? new UserDto($sentBy, $sentByProfilePicture)
                : null;

            $forumMessageDto = new ForumMessageDto($forum_message, $sentByDto);

            $response->getBody()->write(json_encode($forumMessageDto));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/forum/messages/{$forum_message_id}",
                "{$token['email']} updated the forum message '{$forum_message_id}'",
            );
            return $response;
        });
    }    
}