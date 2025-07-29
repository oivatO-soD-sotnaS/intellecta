<?php
declare(strict_types= 1);

namespace App\Controllers;

use App\Dao\EventsDao;
use App\Dao\SubjectEventsDao;
use App\Dao\SubjectsDao;
use App\Dao\UserEventsDao;
use App\Dto\SubjectEventDto;
use App\Enums\EventType;
use App\Models\Event;
use App\Models\SubjectEvent;
use App\Services\LogService;
use App\Services\ValidatorService;
use App\Vo\EventDateVo;
use App\Vo\EventDescriptionVo;
use App\Vo\EventTitleVo;
use InvalidArgumentException;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

readonly class SubjectEventsController extends BaseController {
    public function __construct(
        private SubjectEventsDao $subjectEventsDao,
        private EventsDao $eventsDao,
        private SubjectsDao $subjectsDao,
        private ValidatorService $validatorService,
        private UserEventsDao $userEventsDao
    ) {}

    public function getSubjectEvents(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {    
            $subjectEvents = $this->subjectEventsDao->getAllSubjectEventsBySubjectId($subject_id);

            if(count($subjectEvents) === 0){
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $subjectEventsDto = array_map(function (SubjectEvent $subjectEvent) {
                $event = $this->eventsDao->getEventById($subjectEvent->getEventId());
                return new SubjectEventDto($subjectEvent, $event);
            }, $subjectEvents);

            $response->getBody()->write(json_encode($subjectEventsDto));

            return $response;
        });
    }

    public function createSubjectEvent(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            $token = $request->getAttribute("token");
            $body = $request->getParsedBody();
            $this->validatorService->validateRequired($body, ["title", "description", "event_date", "event_type"]);

            $title = new EventTitleVo($body['title']);
            $description = new EventDescriptionVo($body['description']);
            $eventDate = new EventDateVo($body['event_date']);
            $eventType = EventType::tryFrom($body['event_type']);
    
            if($eventType === null) {
                throw new InvalidArgumentException("Event type does not match any of the available event types");
            }

            $event = $this->eventsDao->createEvent(new Event([
                'event_id' => Uuid::uuid4()->toString(),
                'title' => $title->getValue(),
                'description' => $description->getValue(),
                'event_date' => $eventDate->toString(),
                'type' => $eventType->value
            ]));

            $subjectEvent = $this->subjectEventsDao->createSubjectEvent(new SubjectEvent([
                'subject_event_id' => Uuid::uuid4()->toString(),
                'subject_id' => $subject_id,
                'event_id' => $event->getEventId()
            ]));

            $subjectEventDto = new SubjectEventDto($subjectEvent, $event);

            $response->getBody()->write(json_encode([
                "Message" => "User event created successfully",
                "subject_event" => $subjectEventDto
            ]));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/events", 
                "{$token['email']} created a subject event with id '{$subjectEvent->getSubjectEventId()}'"
            );
            return $response->withStatus(201);
        });
    }

    public function updateSubjectEvent(Request $request, Response $response, string $institution_id, string $subject_id, string $subject_event_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $subject_event_id) {
            $token = $request->getAttribute("token");

            $body = $request->getParsedBody();
            $this->validatorService->validateRequired($body, ["title", "description", "event_date", "event_type"]);

            $title = new EventTitleVo($body['title']);
            $description = new EventDescriptionVo($body['description']);
            $eventDate = new EventDateVo($body['event_date']);
            $eventType = EventType::tryFrom($body['event_type']);
            
            if($eventType === null) {
                throw new InvalidArgumentException("Event type does not match any of the available event types");
            }
                
            $subjectEvent = $this->subjectEventsDao->getSubjectEventById($subject_event_id);
            
            if (
                empty($subjectEvent)
                || $subjectEvent->getSubjectId() !== $subject_id
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $event = $this->eventsDao->getEventById($subjectEvent->getEventId());
            if (empty($event)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $event->setTitle($title->getValue());
            $event->setDescription($description->getValue());
            $event->setEventDate($eventDate->toString());
            $event->setType($eventType->value);

            $this->eventsDao->updateEvent($event);

            $subjectEventDto = new SubjectEventDto($subjectEvent, $event);
            $response->getBody()->write(json_encode([
                "Message" => "Subject event updated successfully",
                "subject_event" => $subjectEventDto
            ]));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/events/{$subject_event_id}", 
            "{$token['email']} update a subject event with ID '{$subjectEvent->getSubjectEventId()}'"
            );
            return $response;
        });
    }

    public function deleteSubjectEvent(Request $request, Response $response,string $institution_id, string $subject_id, string $subject_event_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $subject_event_id) {
            $token = $request->getAttribute("token");
            
            $subjectEvent = $this->subjectEventsDao->getSubjectEventById($subject_event_id);
            
            if (
                empty($subjectEvent)
                || $subjectEvent->getSubjectId() !== $subject_id
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $event = $this->eventsDao->getEventById($subjectEvent->getEventId());
            if (empty($event)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $success = $this->eventsDao->deleteEventById($event->getEventId());
            if(! $success) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $response->getBody()->write(json_encode([
                "Message" => "Subject event deleted successfully"
            ]));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/events/{$subject_event_id}",
                "{$token['email']} deleted a subject event with id '{$subject_event_id}'"
            );
            return $response;
        });
    }

    public function getSubjectEvent(Request $request, Response $response,string $institution_id, string $subject_id, string $subject_event_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $subject_event_id) {
            $subjectEvent = $this->subjectEventsDao->getSubjectEventById($subject_event_id);
            
            if (
                empty($subjectEvent)
                || $subjectEvent->getSubjectId() !== $subject_id
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $event = $this->eventsDao->getEventById($subjectEvent->getEventId());

            if (empty($event)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $subjectEventDto = new SubjectEventDto($subjectEvent, $event);
            $response->getBody()->write(json_encode($subjectEventDto));

            return $response;
        });
    }
}