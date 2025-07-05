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
use App\Vo\EventDateVo;
use App\Vo\EventDescriptionVo;
use App\Vo\EventTitleVo;
use Exception;
use InvalidArgumentException;
use PDOException;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class UserEventController {
    public function __construct(
        private UserEventDao $userEventDao,
        private EventDao $eventDao,
        private UserDao $userDao,
        private EmailService $emailService
    ) {}

    public function getUserEvents(Request $request, Response $response) {
        $token = $request->getAttribute("token");

        try {
            $user = $this->userDao->getById($token["sub"]);
            if (empty($user)) {
                LogService::http401("/users/events", "User not found: " . $token["sub"]);
                throw new HttpUnauthorizedException($request, 'User not found');
            }

            $userEvents = $this->userEventDao->getAllUserEventsById($user->getUserId());
            if (empty($userEvents)) {
                LogService::http404("/users/events", "No events found for user: ".$user->getEmail());
                throw new HttpNotFoundException($request, 'No events found for this user');
            }

            $userEventsDto = array_map(function (UserEvent $userEvent) {
                return new UserEventDto($userEvent, $this->eventDao->getEventById($userEvent->getEventId()));
            }, $userEvents);

            $response->getBody()->write(json_encode($userEventsDto));
            LogService::info("/users/events", "User events fetched for: $user");
            return $response;
        } catch (PDOException $e) {
            LogService::http500("/users/events", $e->getMessage());
            throw new HttpInternalServerErrorException($request, "Database error");
        } catch (HttpException $e) {
            throw $e;
        } catch (Exception $e) {
            LogService::http500("/users/events", $e->getMessage());
            throw new HttpInternalServerErrorException($request, "Unexpected error");
        }
    }

    public function createUserEvent(Request $request, Response $response) {
        $token = $request->getAttribute("token");
        $body = $request->getParsedBody();

        $title = $body['title'] ?? null;
        $description = $body['description'] ?? null;
        $eventDate = $body['event_date'] ?? null;
        $eventType = $body['event_type'] ?? null;

        if (empty($title) || empty($description) || empty($eventDate) || empty($eventType)) {
            LogService::http422("/users/events", "Missing parameters");
            throw new HttpException($request, "'title', 'description', 'event_date' and 'event_type' are required", 422);
        }

        try {
            $title = new EventTitleVo($title);
            $description = new EventDescriptionVo($description);
            $eventDate = new EventDateVo($eventDate);
        } catch (InvalidArgumentException $e) {
            LogService::http422("/users/events", $e->getMessage());
            throw new HttpException($request, $e->getMessage(), 422);
        }

        try {
            $user = $this->userDao->getById($token["sub"]);
            if (!$user) {
                LogService::http404("/users/events", "User not found: " . $token["sub"]);
                throw new HttpNotFoundException($request, 'User not found');
            }

            $event = $this->eventDao->createEvent(new Event([
                'event_id' => Uuid::uuid4()->toString(),
                'title' => $title->getValue(),
                'description' => $description->getValue(),
                'event_date' => $eventDate->toString(),
                'type' => $eventType
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
        } catch (PDOException $e) {
            LogService::http500("/users/events", $e->getMessage());
            throw new HttpInternalServerErrorException($request, "Database error");
        } catch (HttpException $e) {
            throw $e;
        } catch (Exception $e) {
            LogService::http500("/users/events", $e->getMessage());
            throw new HttpInternalServerErrorException($request, "Unexpected error");
        }
    }

    public function updateUserEvent(Request $request, Response $response, string $event_id) {
        $body = $request->getParsedBody();

        $title = $body['title'] ?? null;
        $description = $body['description'] ?? null;
        $eventDate = $body['event_date'] ?? null;
        $eventType = $body['event_type'] ?? null;

        if (empty($title) && empty($description) && empty($eventDate) && empty($eventType)) {
            LogService::http422("/users/events/$event_id", "No valid fields to update");
            throw new HttpException($request, "At least one field is required for update", 422);
        }

        try {
            if(!empty($title)) $title = new EventTitleVo($title);
            if(!empty($description)) $description = new EventDescriptionVo($description);
            if(!empty($eventDate)) $eventDate = new EventDateVo($eventDate);
        } catch (InvalidArgumentException $e) {
            LogService::http422("/users/events", $e->getMessage());
            throw new HttpException($request, $e->getMessage(), 422);
        }

        try {
            $userEvent = $this->userEventDao->getUserEventById($event_id);
            if (empty($userEvent)) {
                LogService::http404("/users/events/$event_id", "User event not found");
                throw new HttpNotFoundException($request, 'User event not found');
            }

            $token = $request->getAttribute("token");
            if ($userEvent->getUserId() !== $token["sub"]) {
                LogService::http401("/users/events/$event_id", "User not authorized to update");
                throw new HttpUnauthorizedException($request, 'Unauthorized');
            }

            $event = $this->eventDao->getEventById($userEvent->getEventId());
            if (empty($event)) {
                LogService::http404("/users/events/$event_id", "Event not found");
                throw new HttpNotFoundException($request, 'Event not found');
            }

            if(!empty($title)) {
                $event->setTitle($title->getValue());
            }
            if(!empty($description)) {
                $event->setDescription($description->getValue());
            }
            if(!empty($eventDate)) {
                $event->setEventDate($eventDate->toString());
            }

            $event->setType($eventType ?? $event->getType());

            $this->eventDao->updateEvent($event);

            $userEventDto = new userEventDto($userEvent, $event);
            $response->getBody()->write(json_encode([
                "Message" => "User event updated successfully",
                "user_event" => $userEventDto
            ]));

            LogService::info("/users/events/$event_id", "User event updated: $userEvent");
            return $response;
        } catch (PDOException $e) {
            LogService::http500("/users/events/$event_id", $e->getMessage());
            throw new HttpInternalServerErrorException($request, "Database error");
        } catch (HttpException $e) {
            throw $e;
        } catch (Exception $e) {
            LogService::http500("/users/events/$event_id", $e->getMessage());
            throw new HttpInternalServerErrorException($request, "Unexpected error");
        }
    }

    public function deleteUserEvent(Request $request, Response $response, string $event_id) {
        try {
            $userEvent = $this->userEventDao->getUserEventById($event_id);
            if (empty($userEvent)) {
                LogService::http404("/users/events/$event_id", "User event not found");
                throw new HttpNotFoundException($request, 'User event not found');
            }

            $token = $request->getAttribute("token");
            if ($userEvent->getUserId() !== $token["sub"]) {
                LogService::http401("/users/events/$event_id", "Unauthorized delete attempt");
                throw new HttpUnauthorizedException($request, 'Unauthorized');
            }

            $event = $this->eventDao->getEventById($userEvent->getEventId());
            if (empty($event)) {
                LogService::http404("/users/events/$event_id", "Event not found");
                throw new HttpNotFoundException($request, 'Event not found');
            }

            $this->eventDao->deleteEventById($event->getEventId());

            $response->getBody()->write(json_encode(["Message" => "User event deleted successfully"]));
            return $response;
        } catch (PDOException $e) {
            LogService::http500("/users/events/$event_id", $e->getMessage());
            throw new HttpInternalServerErrorException($request, "Database error");
        } catch (HttpException $e) {
            throw $e;
        } catch (Exception $e) {
            LogService::http500("/users/events/$event_id", $e->getMessage());
            throw new HttpInternalServerErrorException($request, "Unexpected error");
        }
    }

    public function getUserEvent(Request $request, Response $response, string $event_id) {
        try {
            $userEvent = $this->userEventDao->getUserEventById($event_id);
            if (empty($userEvent)) {
                LogService::http404("/users/events/$event_id", "User event not found");
                throw new HttpNotFoundException($request, 'User event not found');
            }

            $token = $request->getAttribute("token");
            if ($userEvent->getUserId() !== $token["sub"]) {
                LogService::http401("/users/events/$event_id", "Unauthorized read attempt");
                throw new HttpUnauthorizedException($request, 'Unauthorized');
            }

            $event = $this->eventDao->getEventById($userEvent->getEventId());
            if (empty($event)) {
                LogService::http404("/users/events/$event_id", "Event not found");
                throw new HttpNotFoundException($request, 'Event not found');
            }

            $userEventDto = new UserEventDto($userEvent, $event);
            $response->getBody()->write(json_encode($userEventDto));

            return $response;
        } catch (PDOException $e) {
            LogService::http500("/users/events/$event_id", $e->getMessage());
            throw new HttpInternalServerErrorException($request, "Database error");
        } catch (HttpException $e) {
            throw $e;
        } catch (Exception $e) {
            LogService::http500("/users/events/$event_id", $e->getMessage());
            throw new HttpInternalServerErrorException($request, "Unexpected error");
        }
    }
}
