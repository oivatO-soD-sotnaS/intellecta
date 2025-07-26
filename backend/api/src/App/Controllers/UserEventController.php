<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\EventDao;
use App\Dao\UserDao;
use App\Dao\UserEventDao;
use App\Models\Event;
use App\Models\UserEvent;
use App\Services\EmailService;
use App\Services\LogService;
use App\Dto\UserEventDto;
use App\Enums\EventType;
use App\Services\ValidatorService;
use App\Vo\EventDateVo;
use App\Vo\EventDescriptionVo;
use App\Vo\EventTitleVo;
use InvalidArgumentException;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

readonly class UserEventController extends BaseController {
    public function __construct(
        private UserEventDao $userEventDao,
        private EventDao $eventDao,
        private UserDao $userDao,
        private EmailService $emailService,
        private ValidatorService $validatorService
    ) {}

    public function getUserEvents(Request $request, Response $response): Response {
        return $this->handleErrors($request, function() use ($request, $response) {
            $token = $request->getAttribute("token");
    
            $user = $this->userDao->getById($token["sub"]);
            if (empty($user)) {
                LogService::http401("/users/events", "User not found: {$token["sub"]}");
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $userEvents = $this->userEventDao->getAllUserEventsById($user->getUserId());
            
            if(count($userEvents) === 0){
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $userEventsDto = array_map(function (UserEvent $userEvent) {
                $event = $this->eventDao->getEventById($userEvent->getEventId());
                return new UserEventDto($userEvent, $event);
            }, $userEvents);

            $response->getBody()->write(json_encode($userEventsDto));
            LogService::info("/users/events", "User events fetched for: $user");
            return $response;
        });
    }

    public function createUserEvent(Request $request, Response $response): Response {
        return $this->handleErrors($request, function() use ($request, $response) {
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

            $user = $this->userDao->getById($token["sub"]);
            if (!$user) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $event = $this->eventDao->createEvent(new Event([
                'event_id' => Uuid::uuid4()->toString(),
                'title' => $title->getValue(),
                'description' => $description->getValue(),
                'event_date' => $eventDate->toString(),
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

            LogService::info("/users/events", "User event created: $userEvent");
            return $response->withStatus(201);
        });
    }

    public function updateUserEvent(Request $request, Response $response, string $event_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $event_id) {
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
                
            $userEvent = $this->userEventDao->getUserEventById($event_id);
            if (empty($userEvent)) {
                LogService::http404("/users/events/$event_id", "User event not found");
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            if ($userEvent->getUserId() !== $token["sub"]) {
                LogService::http401("/users/events/$event_id", "User not authorized to update");
                throw new HttpForbiddenException($request, LogService::HTTP_403);
            }

            $event = $this->eventDao->getEventById($userEvent->getEventId());
            if (empty($event)) {
                LogService::http404("/users/events/$event_id", "Event not found");
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $event->setTitle($title->getValue());
            $event->setDescription($description->getValue());
            $event->setEventDate($eventDate->toString());
            $event->setType($eventType->value);

            $this->eventDao->updateEvent($event);

            $userEventDto = new userEventDto($userEvent, $event);
            $response->getBody()->write(json_encode([
                "Message" => "User event updated successfully",
                "user_event" => $userEventDto
            ]));

            LogService::info("/users/events/$event_id", "User event updated: $userEvent");
            return $response;
        });
    }

    public function deleteUserEvent(Request $request, Response $response, string $event_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $event_id) {
            $token = $request->getAttribute("token");
            
            $userEvent = $this->userEventDao->getUserEventById($event_id);
            if (empty($userEvent)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            if ($userEvent->getUserId() !== $token["sub"]) {
                LogService::http401("/users/events/$event_id", "Unauthorized delete attempt");
                throw new HttpForbiddenException($request, LogService::HTTP_403);
            }

            $event = $this->eventDao->getEventById($userEvent->getEventId());
            if (empty($event)) {
                LogService::http404("/users/events/$event_id", "Event not found");
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $success = $this->eventDao->deleteEventById($event->getEventId());
            if(! $success) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $response->getBody()->write(json_encode([
                "Message" => "User event deleted successfully"
            ]));

            return $response;
        });
    }

    public function getUserEvent(Request $request, Response $response, string $event_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $event_id) {
            $userEvent = $this->userEventDao->getUserEventById($event_id);
            if (empty($userEvent)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $token = $request->getAttribute("token");
            if ($userEvent->getUserId() !== $token["sub"]) {
                throw new HttpForbiddenException($request, LogService::HTTP_403);
            }

            $event = $this->eventDao->getEventById($userEvent->getEventId());
            if (empty($event)) {
                LogService::http404("/users/events/$event_id", "Event not found");
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $userEventDto = new UserEventDto($userEvent, $event);
            $response->getBody()->write(json_encode($userEventDto));

            return $response;
        });
    }
}
