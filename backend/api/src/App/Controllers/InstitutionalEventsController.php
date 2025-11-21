<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\EventsDao;
use App\Dao\FilesDao;
use App\Dao\InstitutionalEventsDao;
use App\Dao\InstitutionsDao;
use App\Dao\InstitutionUsersDao;
use App\Dao\NotificationsDao;
use App\Dao\UsersDao;
use App\Dto\InstitutionalEventDto;
use App\Models\Event;
use App\Models\InstitutionalEvent;
use App\Queue\RedisEmailQueue;
use App\Services\LogService;
use App\Services\ValidatorService;
use App\Templates\Email\EmailTemplateProvider;
use App\Vo\EventDateVo;
use App\Vo\EventDescriptionVo;
use App\Vo\EventTitleVo;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

readonly class InstitutionalEventsController extends BaseController
{
  public function __construct(
    private InstitutionalEventsDao $institutionalEventsDao,
    private InstitutionsDao $institutionsDao,
    private InstitutionUsersDao $institutionUsersDao,
    private EventsDao $eventsDao,
    private UsersDao $usersDao,
    private EmailTemplateProvider $emailTemplateProvider,
    private ValidatorService $validatorService,
    private RedisEmailQueue $emailQueue,
    private NotificationsDao $notificationsDao,
    private FilesDao $filesDao
  ) {}

  public function getInstitutionalEvents(Request $request, Response $response, string $institution_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
      $institutionalEvents = $this->institutionalEventsDao->getInstitutionalEventsByInstitutionId($institution_id);

      if (empty($institutionalEvents)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $data = array_map(function ($institutionalEvent) {
        $event = $this->eventsDao->getEventById($institutionalEvent->getEventId());
        return new InstitutionalEventDto($institutionalEvent, $event);
      }, $institutionalEvents);

      $response->getBody()->write(json_encode($data));
      LogService::info("/institutions/$institution_id/events", "Institutional events successfully fetched for $institution_id");
      return $response;
    });
  }

  public function createInstitutionalEvent(Request $request, Response $response, string $institution_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
      $body = $request->getParsedBody();

      // Validate new required fields
      $this->validatorService->validateRequired($body, [
        'title',
        'description',
        'event_start',
        'event_end',
        'event_type'
      ]);

      $title = new EventTitleVo($body['title']);
      $description = new EventDescriptionVo($body['description']);
      $eventStart = new EventDateVo($body['event_start']);
      $eventEnd = new EventDateVo($body['event_end']);
      $eventType = $body['event_type'];

      $institution = $this->institutionsDao->getInstitutionById($institution_id);
      if (!$institution) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      // Create event with event_start and event_end
      $event = $this->eventsDao->createEvent(new Event([
        'event_id' => Uuid::uuid4()->toString(),
        'title' => $title->getValue(),
        'description' => $description->getValue(),
        'event_start' => $eventStart->toString(),
        'event_end' => $eventEnd->toString(),
        'type' => $eventType
      ]));

      $institutionalEvent = $this->institutionalEventsDao->createInstitutionalEvent(new InstitutionalEvent([
        'institutional_event_id' => Uuid::uuid4()->toString(),
        'institution_id' => $institution->getInstitutionId(),
        'event_id' => $event->getEventId()
      ]));

      // Notify all institution users
      $institutionUsers = $this->institutionUsersDao->getInstitutionUsersByInstitutionId($institution_id);
      $institutionUserDtos = $this->institutionUsersDao->mapInstitutionUsersToUsers($institutionUsers);

      $this->notificationsDao->createNotificationsForUsers(
        array_map(fn($dto) => $dto->getUserDto()->getUser()->getUserId(), $institutionUserDtos),
        $event->getEventId()
      );

      // Send email to each user
      foreach ($institutionUserDtos as $institutionUserDto) {
        $user = $institutionUserDto->getUserDto()->getUser();

        $this->emailQueue->push([
          'to' => $user->getEmail(),
          'toName' => $user->getFullName(),
          'subject' => "{$institution->getName()} - Novo evento institucional: {$event->getTitle()}",
          'body' => $this->emailTemplateProvider->getInstitutionalNotificationEmailTemplate(
            $user->getFullName(),
            $event,
            $institution->getName(),
            $institution->getEmail()
          ),
          'altBody' => "Olá {$user->getFullName()},\n\nUm novo evento institucional foi criado.\n\n" .
                      "Título: {$event->getTitle()}\n" .
                      "Descrição: {$event->getDescription()}\n" .
                      "Início: {$event->getEventStart()}\n" .
                      "Fim: {$event->getEventEnd()}\n\n" .
                      "Atenciosamente,\nEquipe Intellecta"
        ]);
      }

      $institutionalEventDto = new InstitutionalEventDto($institutionalEvent, $event);

      $response->getBody()->write(json_encode([
        'Message' => 'Institutional event created successfully',
        'institutional_event' => $institutionalEventDto,
        'notified_users' => $institutionUserDtos
      ]));

      return $response;
    });
  }



  public function updateInstitutionalEvent(Request $request, Response $response, string $institution_id, string $event_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id, $event_id) {
      $body = $request->getParsedBody();

      // Updated required fields
      $this->validatorService->validateRequired($body, [
        'title',
        'description',
        'event_start',
        'event_end',
        'event_type'
      ]);

      $title = new EventTitleVo($body['title']);
      $description = new EventDescriptionVo($body['description']);
      $eventStart = new EventDateVo($body['event_start']);
      $eventEnd = new EventDateVo($body['event_end']);
      $eventType = $body['event_type'];

      $institutionalEvent = $this->institutionalEventsDao->getInstitutionalEventById($event_id);
      if (empty($institutionalEvent)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      if ($institutionalEvent->getInstitutionId() !== $institution_id) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $event = $this->eventsDao->getEventById($institutionalEvent->getEventId());
      if (empty($event)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $institution = $this->institutionsDao->getInstitutionById($institution_id);

      // Apply updates
      $event->setTitle($title->getValue());
      $event->setDescription($description->getValue());
      $event->setEventStart($eventStart->toString());
      $event->setEventEnd($eventEnd->toString());
      $event->setType($eventType ?? $event->getType());

      $event = $this->eventsDao->updateEvent($event);

      $institutionUsers = $this->institutionUsersDao->getInstitutionUsersByInstitutionId($institution_id);
      $institutionUserDtos = $this->institutionUsersDao->mapInstitutionUsersToUsers($institutionUsers);

      foreach ($institutionUserDtos as $institutionUserDto) {
        $user = $institutionUserDto->getUserDto()->getUser();

        $this->emailQueue->push([
          'to' => $user->getEmail(),
          'toName' => $user->getFullName(),
          'subject' => "{$institution->getName()} - Atualização de evento institucional: {$event->getTitle()}",
          'body' => $this->emailTemplateProvider->getInstitutionalNotificationUpdatedEmailTemplate(
            $user->getFullName(),
            $event,
            $institution->getName(),
            $institution->getEmail()
          ),
          'altBody' => "Olá {$user->getFullName()},\n\nO evento institucional foi atualizado.\n\n" .
                      "Título: {$event->getTitle()}\n" .
                      "Descrição: {$event->getDescription()}\n" .
                      "Início: {$event->getEventStart()}\n" .
                      "Fim: {$event->getEventEnd()}\n\n" .
                      "Atenciosamente,\nEquipe Intellecta"
        ]);
      }

      $institutionalEventDto = new InstitutionalEventDto($institutionalEvent, $event);

      $response->getBody()->write(json_encode([
        'Message' => 'Institutional event updated successfully',
        'institutional_event' => $institutionalEventDto
      ]));

      LogService::info("/institutions/$institution_id/events/$event_id", "Institutional event updated: $institutionalEvent");
      return $response;
    });
  }


  public function deleteInstitutionalEvent(Request $request, Response $response, string $institution_id, string $event_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id, $event_id) {
      $institution = $this->institutionsDao->getInstitutionById($institution_id);
      $institutionalEvent = $this->institutionalEventsDao->getInstitutionalEventById($event_id);
      if (empty($institutionalEvent)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      if ($institutionalEvent->getInstitutionId() !== $institution_id) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $event = $this->eventsDao->getEventById($institutionalEvent->getEventId());
      if (empty($event)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $this->eventsDao->deleteEventById($event->getEventId());

      $institutionUsers = $this->institutionUsersDao->getInstitutionUsersByInstitutionId($institution_id);
      $institutionUserDtos = $this->institutionUsersDao->mapInstitutionUsersToUsers($institutionUsers);

      foreach ($institutionUserDtos as $institutionUserDto) {
        $user = $institutionUserDto->getUserDto()->getUser();

        $this->emailQueue->push([
          'to' => $user->getEmail(),
          'toName' => $user->getFullName(),
          'subject' => "{$institution->getName()} - Evento institucional removido: {$event->getTitle()}",
          'body' => $this->emailTemplateProvider->getInstitutionalNotificationDeletedEmailTemplate(
            $user->getFullName(),
            $event,
            $institution->getName(),
            $institution->getEmail()
          ),
          'altBody' => "Olá {$user->getFullName()},\n\nO evento institucional foi removido.\n\n" .
                "Título: {$event->getTitle()}\n" .
                "Descrição: {$event->getDescription()}\n" .
                "Início: {$event->getEventStart()}\n" .
                "Fim: {$event->getEventEnd()}\n\n" .
                "Atenciosamente,\nEquipe Intellecta"
        ]);
      }


      LogService::info("/institutions/$institution_id/events/$event_id", "Institutional event deleted: $institutionalEvent");
      $response->getBody()->write(json_encode(["Message" => "Institutional event deleted successfully"]));
      return $response;
    });
  }

  public function getInstitutionalEvent(Request $request, Response $response, string $institution_id, string $event_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id, $event_id) {
      $institutionalEvent = $this->institutionalEventsDao->getInstitutionalEventById($event_id);
      if (empty($institutionalEvent)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      if ($institutionalEvent->getInstitutionId() !== $institution_id) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $event = $this->eventsDao->getEventById($institutionalEvent->getEventId());
      if (empty($event)) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $institutionalEventDto = new InstitutionalEventDto($institutionalEvent, $event);
      $response->getBody()->write(json_encode($institutionalEventDto));

      return $response;
    });
  }
}