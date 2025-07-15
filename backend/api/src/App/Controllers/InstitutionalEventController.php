<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\EventDao;
use App\Dao\InstitutionalEventDao;
use App\Dao\InstitutionDao;
use App\Dao\UserDao;
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

class InstitutionalEventController extends BaseController
{
  public function __construct(
    private InstitutionalEventDao $institutionalEventDao,
    private EventDao $eventDao,
    private UserDao $userDao,
    private InstitutionDao $institutionDao,
    private EmailService $emailService,
    private ValidatorService $validatorService
  ) {}

  public function getInstitutionalEvents(Request $request, Response $response, string $institution_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
      $institutionalEvents = $this->institutionalEventDao->getAllInstitutionalEventsById($institution_id);

      if (empty($institutionalEvents)) {
        throw new HttpNotFoundException($request, "Institution does not have any events");
      }

      $data = array_map(function ($institutionalEvent) {
        $event = $this->eventDao->getEventById($institutionalEvent->getEventId());
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

      $institution = $this->institutionDao->getInstitutionById($institution_id);
      if (!$institution) {
        throw new HttpNotFoundException($request, 'Institution not found');
      }

      $event = $this->eventDao->createEvent(new Event([
        'event_id' => Uuid::uuid4()->toString(),
        'title' => $title->getValue(),
        'description' => $description->getValue(),
        'event_date' => $eventDate->toString(),
        'type' => $eventType
      ]));

      $institutionalEvent = $this->institutionalEventDao->createInstitutionalEvent(new InstitutionalEvent([
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
      
      $institutionalEvent = $this->institutionalEventDao->getInstitutionalEventById($event_id);
      if (empty($institutionalEvent)) {
        throw new HttpNotFoundException($request, 'Institutional event not found');
      }

      if ($institutionalEvent->getInstitutionId() !== $institution_id) {
        throw new HttpNotFoundException($request, 'Event does not belong to the institution');
      }

      $event = $this->eventDao->getEventById($institutionalEvent->getEventId());
      if (empty($event)) {
        throw new HttpNotFoundException($request, 'Event not found');
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

      $event = $this->eventDao->updateEvent($event);

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
      $institutionalEvent = $this->institutionalEventDao->getInstitutionalEventById($event_id);
      if (empty($institutionalEvent)) {
        throw new HttpNotFoundException($request, 'Institutional event not found');
      }

      if ($institutionalEvent->getInstitutionId() !== $institution_id) {
        throw new HttpNotFoundException($request, 'Event does not belong to the institution');
      }

      $event = $this->eventDao->getEventById($institutionalEvent->getEventId());
      if (empty($event)) {
        throw new HttpNotFoundException($request, 'Event not found');
      }

      $this->eventDao->deleteEventById($event->getEventId());
      
      LogService::info("/institutions/$institution_id/events/$event_id", "Institutional event deleted: $institutionalEvent");
      $response->getBody()->write(json_encode(["Message" => "Institutional event deleted successfully"]));
      return $response;
    });
  }

  public function getInstitutionalEvent(Request $request, Response $response, string $institution_id, string $event_id): Response
  {
    return $this->handleErrors($request, function() use ($request, $response, $institution_id, $event_id) {
      $institutionalEvent = $this->institutionalEventDao->getInstitutionalEventById($event_id);
      if (empty($institutionalEvent)) {
        throw new HttpNotFoundException($request, 'Institutional event not found');
      }

      if ($institutionalEvent->getInstitutionId() !== $institution_id) {
        throw new HttpNotFoundException($request, 'Event does not belong to the institution');
      }

      $event = $this->eventDao->getEventById($institutionalEvent->getEventId());
      if (empty($event)) {
        throw new HttpNotFoundException($request, 'Event not found');
      }

      $institutionalEventDto = new InstitutionalEventDto($institutionalEvent, $event);
      $response->getBody()->write(json_encode($institutionalEventDto));

      return $response;
    });
  }
}