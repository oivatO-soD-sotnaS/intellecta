<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Dao\EventDao;
use App\Dao\UserDao;
use App\Dao\UserEventDao;
use App\Models\Event;
use App\Models\UserEvent;
use App\Services\EmailService;
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

    public function getUserEvents(Request $request,Response $response) {
      $token = $request->getAttribute("token");

      $user = $this->userDao->getById($token["sub"]);
      
      if(empty($user)) {
        throw new HttpUnauthorizedException($request, 'User not found');
      }

      $userEvents = $this->userEventDao->getAllUserEventsById($user->getUserId());

      if(empty($userEvents)) {
        throw new HttpNotFoundException($request, 'No events found for this user');
      }

      $data = [];
      foreach ($userEvents as $event) {
        $row = [
          "user_event_id" => $event->getUserEventId(),
          "user_id" => $event->getUserId(),
          "event" => $this->eventDao->getEventById($event->getEventId())
        ];
        $data[] = $row;
      }

      $response->getBody()->write(json_encode($data));
      return $response;
    }

    public function createUserEvent(Request $request, Response $response) {
      $token = $request->getAttribute("token");

      $user = $this->userDao->getById($token["sub"]);

      if(!$user) {
        throw new HttpNotFoundException($request, 'User not found');
      }

      $body = $request->getParsedBody();
      $title = $body['title'] ?? null;
      $description = $body['description'] ?? null;
      $eventDate = $body['event_date'] ?? null;
      $eventType = $body['event_type'] ?? null;

      if(
        empty($title) || 
        empty($description) || 
        empty($eventDate) || 
        empty($eventType)
      ) {
        throw new HttpException($request, "'title', 'description', 'event_date' and 'event_type' are required", 422);
      }
      try{
        $event = $this->eventDao->createEvent(
        new Event([
          'event_id' => Uuid::uuid4()->toString(),
          'title' => $title,
          'description' => $description,
          'event_date' => $eventDate,
          'type' => $eventType
          ])
        );

        if(empty($event)) {
          throw new HttpException($request, 'Failed to create event', 500);
        }

        $userEvent = $this->userEventDao->createUserEvent(new UserEvent([
          'user_event_id' => Uuid::uuid4()->toString(),
          'user_id' => $user->getUserId(),
          'event_id' => $event->getEventId()
          ])
        );

        if(empty($userEvent)) {
          $this->eventDao->deleteEventById($event->getEventId());
          throw new HttpException($request,  'Failed to create user event', 500);
        }

        $response->getBody()->write(json_encode([
          "Message" => "User event created successfully",
          "user_event" => [
            'user_event_id' => $userEvent->getUserEventId(),
            'user_id' => $userEvent->getUserId(),
            'event' => $event
          ]
        ]));

        return $response->withStatus(201);
      }catch (\Exception $e) {
        switch($e) {
          case $e instanceof PDOException:
            throw new HttpException($request, 'Database error: ' . $e->getMessage(), 500);
          default:
            throw new HttpInternalServerErrorException($request, 'An unexpected error occurred: ' . $e->getMessage());
        }
      }
    }

    public function updateUserEvent(Request $request, Response $response, string $id) {
      $body = $request->getParsedBody();

      $title = $body['title'] ?? null;
      $description = $body['description'] ?? null;
      $eventDate = $body['event_date'] ?? null;
      $eventType = $body['event_type'] ?? null;

      if(
        empty($title) &&
        empty($description) && 
        empty($eventDate) &&
        empty($eventType)
      ) {
        throw new HttpException($request, "'title', 'description', 'event_date' or 'event_type' are required", 422);
      }
      try{
        $userEvent = $this->userEventDao->getUserEventById($id);
        
        
        if(empty($userEvent)) {
          throw new HttpNotFoundException($request, 'User event not found');
        }
  
        $token = $request->getAttribute("token");
  
        if($userEvent->getUserId() !== $token["sub"]) {
          throw new HttpUnauthorizedException($request, 'You do not have permission to update this event');
        }
        $event = $this->eventDao->getEventById($userEvent->getEventId());
        
        if(empty($event)) {
          throw new HttpNotFoundException($request, 'Event not found');
        }

        if(!empty($title)) {
          $event->setTitle($title);
        }
        if(!empty($description)) {
          $event->setDescription($description);
        }
        if(!empty($eventDate)) {
          $event->setEventDate($eventDate);
        }
        if(!empty($eventType)) {
          $event->setType($eventType);
        }
        $event = $this->eventDao->updateEvent($event);
        
        if(empty($event)) {
          throw new HttpInternalServerErrorException($request, 'Failed to update event');
        }
        
        $response->getBody()->write(json_encode([
          "Message" => "User event updated successfully",
          "user_event" => [
            'user_event_id' => $userEvent->getUserEventId(),
            'user_id' => $userEvent->getUserId(),
            'event' => $event
          ]
        ]));

        return $response;
      }catch (\Exception $e) {
        switch($e) {
          case $e instanceof PDOException:
            throw new HttpInternalServerErrorException($request, 'Database error: ' . $e->getMessage());
          case $e instanceof HttpException:
            throw $e; // Re-throw HttpExceptions to maintain status code
          default:
            throw new HttpInternalServerErrorException($request, 'An unexpected error occurred: ' . $e->getMessage());
        }
      }
    }

    public function deleteUserEvent(Request $request, Response $response, string $id) {
      $userEvent = $this->userEventDao->getUserEventById($id);
      
      if(empty($userEvent)) {
        throw new HttpNotFoundException($request, 'User event not found');
      }
      $token = $request->getAttribute("token");
      if($userEvent->getUserId() !== $token["sub"]) {
        throw new HttpUnauthorizedException($request, 'You do not have permission to delete this event');
      }
      $event = $this->eventDao->getEventById($userEvent->getEventId());
      if(empty($event)) {
        throw new HttpNotFoundException($request, 'Event not found');
      }
      $deleted = $this->eventDao->deleteEventById($event->getEventId());
      if(!$deleted) {
        throw new HttpInternalServerErrorException($request, 'Failed to delete event');
      }

      $response->getBody()->write(json_encode([
        "Message" => "User event deleted successfully",
      ]));

      return $response;
    }

    public function getUserEvent(Request $request, Response $response, string $id) {
      $userEvent = $this->userEventDao->getUserEventById($id);
      if(empty($userEvent)) {
        throw new HttpNotFoundException($request, 'User event not found');
      }
      $token = $request->getAttribute("token");
      if($userEvent->getUserId() !== $token["sub"]) {
        throw new HttpUnauthorizedException($request, 'You do not have permission to view this event');
      }
      $event = $this->eventDao->getEventById($userEvent->getEventId());
      if(empty($event)) {
        throw new HttpNotFoundException($request, 'Event not found');
      }
      $response->getBody()->write(json_encode([
        'user_event_id' => $userEvent->getUserEventId(),
        'user_id' => $userEvent->getUserId(),
        'event' => $event
      ]));
      return $response->withStatus(200);
    }
}