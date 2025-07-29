<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\EventsDao;
use App\Dao\InstitutionalEventsDao;
use App\Dao\InstitutionsDao;
use App\Dao\UsersDao;
use App\Dto\InstitutionalEventDto;
use App\Models\Event;
use App\Models\InstitutionalEvent;
use App\Services\EmailService;
use App\Services\LogService;
use App\Services\ValidatorService;
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
    private EventsDao $eventsDao,
    private UsersDao $usersDao,
    private InstitutionsDao $institutionsDao,
    private EmailService $emailService,
    private ValidatorService $validatorService
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

      $this->validatorService->validateRequired($body, ['title', 'description', 'event_date', 'event_type']);

      $title = new EventTitleVo($body['title']);
      $description = new EventDescriptionVo($body['description']);
      $eventDate = new EventDateVo($body['event_date']);
      $eventType = $body['event_type'];

      $institution = $this->institutionsDao->getInstitutionById($institution_id);
      if (!$institution) {
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      $event = $this->eventsDao->createEvent(new Event([
        'event_id' => Uuid::uuid4()->toString(),
        'title' => $title->getValue(),
        'description' => $description->getValue(),
        'event_date' => $eventDate->toString(),
        'type' => $eventType
      ]));

      $institutionalEvent = $this->institutionalEventsDao->createInstitutionalEvent(new InstitutionalEvent([
        "institutional_event_id" => Uuid::uuid4()->toString(),
        "institution_id" => $institution->getInstitutionId(),
        "event_id" => $event->getEventId()
      ]));

      $institutionalEventDto = new InstitutionalEventDto($institutionalEvent, $event);
      
      $response->getBody()->write(json_encode([
        "Message" => "Institutional event created successfully",
        "institutional_event" => $institutionalEventDto
      ]));

      return $response;
    });
  }

  public function updateInstitutionalEvent(Request $request, Response $response, string $institution_id, string $event_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id, $event_id) {
      $body = $request->getParsedBody();

      $this->validatorService->validateRequired($body, ['title', 'description', 'event_data', 'event_type']);
      
      $title = new EventTitleVo($body['title']);
      $description = new EventDescriptionVo($body['description']);
      $eventDate = new EventDateVo($body['event_date']);
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
      
      if (!empty($title)) {
        $event->setTitle($title->getValue());
      }
      if (!empty($description)) {
        $event->setDescription($description->getValue());
      }
      if (!empty($eventDate)) {
        $event->setEventDate($eventDate->toString());
      }

      $event->setType($eventType ?? $event->getType());

      $event = $this->eventsDao->updateEvent($event);

      $institutionalEventDto = new InstitutionalEventDto($institutionalEvent, $event);
      
      $response->getBody()->write(json_encode([
        "Message" => "User event updated successfully",
        "user_event" => $institutionalEventDto
      ]));
      
      LogService::info("/institutions/$institution_id/events/$event_id", "Institutional event updated: $institutionalEvent");
      return $response;
    });
  }

  public function deleteInstitutionalEvent(Request $request, Response $response, string $institution_id, string $event_id): Response
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

      $this->eventsDao->deleteEventById($event->getEventId());
      
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