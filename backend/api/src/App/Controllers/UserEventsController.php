<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\EventsDao;
use App\Dao\UserEventsDao;
use App\Models\Event;
use App\Models\UserEvent;
use App\Services\LogService;
use App\Dto\UserEventDto;
use App\Enums\EventType;
use App\Services\ValidatorService;
use App\Vo\EventDateVo;
use App\Vo\EventDescriptionVo;
use App\Vo\EventTitleVo;
use InvalidArgumentException;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

readonly class UserEventsController extends BaseController {
    public function __construct(
        private UserEventsDao $userEventDao,
        private EventsDao $eventsDao,
        private ValidatorService $validatorService
    ) {}

    public function getUserEvents(Request $request, Response $response): Response {
        return $this->handleErrors($request, function() use ($request, $response) {
            $user = $request->getAttribute("user");
            
            $userEvents = $this->userEventDao->getAllUserEventsByUserId($user->getUserId());

            if(count($userEvents) === 0){
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $userEventsDto = array_map(function (UserEvent $userEvent) {
                $event = $this->eventsDao->getEventById($userEvent->getEventId());
                return new UserEventDto($userEvent, $event);
            }, $userEvents);

            $response->getBody()->write(json_encode($userEventsDto));
            LogService::info("/users/me/events", "User events fetched for: $user");
            return $response;
        });
    }

    public function createUserEvent(Request $request, Response $response): Response {
        return $this->handleErrors($request, function() use ($request, $response) {
            $user = $request->getAttribute("user");
            $body = $request->getParsedBody();

            // Agora exige event_start e event_end
            $this->validatorService->validateRequired(
                $body,
                ["title", "description", "event_start", "event_end", "event_type"]
            );

            $title = new EventTitleVo($body['title']);
            $description = new EventDescriptionVo($body['description']);
            $eventStart = new EventDateVo($body['event_start']);
            $eventEnd = new EventDateVo($body['event_end']);
            $eventType = EventType::tryFrom($body['event_type']);

            if ($eventType === null) {
                throw new InvalidArgumentException("Event type does not match any of the available event types");
            }

            if ($eventStart->getDateTime() >= $eventEnd->getDateTime()) {
                throw new InvalidArgumentException("Event end must be after event start");
            }

            $event = $this->eventsDao->createEvent(new Event([
                'event_id' => Uuid::uuid4()->toString(),
                'title' => $title->getValue(),
                'description' => $description->getValue(),
                'event_start' => $eventStart->toString(),
                'event_end' => $eventEnd->toString(),
                'type' => $eventType->value
            ]));

            $userEvent = $this->userEventDao->createUserEvent(new UserEvent([
                'user_event_id' => Uuid::uuid4()->toString(),
                'user_id' => $user->getUserId(),
                'event_id' => $event->getEventId()
            ]));

            $userEventDto = new UserEventDto($userEvent, $event);

            $response->getBody()->write(json_encode([
                "Message" => "User event created successfully",
                "user_event" => $userEventDto
            ]));

            LogService::info("/users/me/events", "User event created: $userEvent");

            return $response->withStatus(201);
        });
    }


    public function updateUserEvent(Request $request, Response $response, string $user_event_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $user_event_id) {
            $user = $request->getAttribute("user");
            $body = $request->getParsedBody();

            // Atualizado para exigir event_start e event_end
            $this->validatorService->validateRequired(
                $body,
                ["title", "description", "event_start", "event_end", "event_type"]
            );

            $title = new EventTitleVo($body['title']);
            $description = new EventDescriptionVo($body['description']);
            $eventStart = new EventDateVo($body['event_start']);
            $eventEnd = new EventDateVo($body['event_end']);
            $eventType = EventType::tryFrom($body['event_type']);

            if ($eventType === null) {
                throw new InvalidArgumentException("Event type does not match any of the available event types");
            }

            if ($eventStart->getDateTime() >= $eventEnd->getDateTime()) {
                throw new InvalidArgumentException("Event end must be after event start");
            }

            $userEvent = $this->userEventDao->getUserEventById($user_event_id);

            if (empty($userEvent) || $userEvent->getUserId() !== $user->getUserId()) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $event = $this->eventsDao->getEventById($userEvent->getEventId());
            if (empty($event)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $event->setTitle($title->getValue());
            $event->setDescription($description->getValue());
            $event->setEventStart($eventStart->toString());
            $event->setEventEnd($eventEnd->toString());
            $event->setType($eventType->value);

            $this->eventsDao->updateEvent($event);

            $userEventDto = new UserEventDto($userEvent, $event);

            $response->getBody()->write(json_encode([
                "Message" => "User event updated successfully",
                "user_event" => $userEventDto
            ]));

            LogService::info(
                "/users/me/events/{$user_event_id}",
                "{$user->getUserId()} has updated a user event with id '{$user_event_id}'"
            );

            return $response;
        });
    }

    public function deleteUserEvent(Request $request, Response $response, string $user_event_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $user_event_id) {
            $user = $request->getAttribute("user");

            $userEvent = $this->userEventDao->getUserEventById($user_event_id);
            if (
                empty($userEvent)
                || $userEvent->getUserId() !== $user->getUserId()
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $event = $this->eventsDao->getEventById($userEvent->getEventId());
            if (empty($event)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $success = $this->eventsDao->deleteEventById($event->getEventId());
            if(! $success) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $response->getBody()->write(json_encode([
                "Message" => "User event deleted successfully"
            ]));

            LogService::info(
                "/users/me/events/{$user_event_id}",
                "{$user->getUserId()} has deleted a user event with id '{$user_event_id}'"
            );
            return $response;
        });
    }

    public function getUserEvent(Request $request, Response $response, string $user_event_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $user_event_id) {
            $user = $request->getAttribute("user");

            $userEvent = $this->userEventDao->getUserEventById($user_event_id);
            if (
                empty($userEvent)
                || $userEvent->getUserId() !== $user->getUserId()
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $event = $this->eventsDao->getEventById($userEvent->getEventId());
            if (empty($event)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $userEventDto = new UserEventDto($userEvent, $event);
            $response->getBody()->write(json_encode($userEventDto));

            return $response;
        });
    }

    public function getUpcomingEvents(Request $request, Response $response): Response {
        return $this->handleErrors($request, function() use ($request, $response) {
            $user = $request->getAttribute("user");
            
            $userEvents = $this->userEventDao->getUpcomingUserEvents($user->getUserId());

            if(\count($userEvents) === 0){
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $response->getBody()->write(json_encode($userEvents));
            LogService::info("/users/me/events/upcoming", "Upcoming user events fetched for: $user");
            return $response;
        });
    }
}
