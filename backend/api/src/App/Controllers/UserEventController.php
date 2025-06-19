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
use Exception;
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

      try{
        $user = $this->userDao->getById($token["sub"]);
        
        if(empty($user)) {
          LogService::error("/users/events", "Unable to find user by id: ".$token['sub']);
          throw new HttpUnauthorizedException($request, 'User not found');
        }
  
        $userEvents = $this->userEventDao->getAllUserEventsById($user->getUserId());
  
        if(empty($userEvents)) {
          LogService::warn("/users/events", "No user events found for the following user: ".$user->getEmail());
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
  
        LogService::info("/users/events", "User events fetched from $user");
        return $response;
      }catch(Exception $e){
        switch(true) {
          case $e instanceof PDOException:
            LogService::error("/users/events", "Unable to get user events due to database error: ".$e->getMessage());
            throw new HttpInternalServerErrorException($request, "Unable to get user events due to a database error");
          case $e instanceof HttpException:
            throw $e;
          default:
            LogService::error("/users/events", 'An unexpected error occurred: ' . $e->getMessage());
            throw new HttpInternalServerErrorException($request, "An unexpected error occured. See logs for more detail");
        }
      }
    }

    public function createUserEvent(Request $request, Response $response) {
      $token = $request->getAttribute("token");

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
        LogService::error("/users/events", "Unprocessable entity, missing POST parameters: 'title', 'description', 'event_date' and 'event_type'");
        throw new HttpException($request, "'title', 'description', 'event_date' and 'event_type' are required", 422);
      }
      
      try{
        $user = $this->userDao->getById($token["sub"]);
  
        if(!$user) {
          LogService::error("/users/events", "Unable to find user by id: ".$token["sub"]);
          throw new HttpNotFoundException($request, 'User not found');
        }

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
          LogService::error("/users/events", "Could not create event for: $user");
          throw new HttpException($request, 'Failed to create event', 500);
        }

        $userEvent = $this->userEventDao->createUserEvent(new UserEvent([
          'user_event_id' => Uuid::uuid4()->toString(),
          'user_id' => $user->getUserId(),
          'event_id' => $event->getEventId()
          ])
        );

        if(empty($userEvent)) {
          LogService::error("/users/events", "Could not create user event for: $user");
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

        LogService::info("/users/events", "User event created for $user. User event: $userEvent");
        return $response->withStatus(201);
      }catch (Exception $e) {
        switch($e) {
          case $e instanceof PDOException:
            LogService::error("/users/events", "Could not create event due to database error: $e->");
            throw new HttpException($request, 'Database error: ' . $e->getMessage(), 500);
          case $e instanceof HttpException:
            throw $e;
          default:
            LogService::error("/users/events", 'An unexpected error occurred: ' . $e->getMessage());
            throw new HttpInternalServerErrorException($request, 'An unexpected error occurred. See logs for more detail');
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
        LogService::error("/users/events/$id", "Unprocessable entity, missing PATCH parameters: 'title', 'description, 'event_data' and 'event_type'");
        throw new HttpException($request, "'title', 'description', 'event_date' or 'event_type' are required", 422);
      }
      try{
        $userEvent = $this->userEventDao->getUserEventById($id);
        
        
        if(empty($userEvent)) {
          LogService::error("/users/events/$id", "Could not find user event with the following ID: $id");
          throw new HttpNotFoundException($request, 'User event not found');
        }
  
        $token = $request->getAttribute("token");
  
        if($userEvent->getUserId() !== $token["sub"]) {
          LogService::error("/users/events/$id", "User event update denied, user does not own the event");
          throw new HttpUnauthorizedException($request, 'You do not have permission to update this event');
        }
        $event = $this->eventDao->getEventById($userEvent->getEventId());
        
        if(empty($event)) {
          LogService::error("/users/events/$id", "Could not find event with the following ID: ".$userEvent->getEventId());
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
          LogService::error("/users/events/$id", "Could not update the event");
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

        LogService::info("/users/events/$id", "Update the following user event successfully: $userEvent");
        return $response;
      }catch (Exception $e) {
        switch($e) {
          case $e instanceof PDOException:
            LogService::error("/users/events/$id", "Could not update user event to database error: ".$e->getMessage());
            throw new HttpInternalServerErrorException($request, 'Database error: ' . $e->getMessage());
          case $e instanceof HttpException:
            throw $e; // Re-throw HttpExceptions to maintain status code
          default:
            LogService::error("/users/events/$id", "An unexpected error occured: ".$e->getMessage());
            throw new HttpInternalServerErrorException($request, 'An unexpected error occurred. See the logs for more details');
        }
      }
    }

    public function deleteUserEvent(Request $request, Response $response, string $id) {
      try{
        $userEvent = $this->userEventDao->getUserEventById($id);
        
        if(empty($userEvent)) {
          LogService::error("/users/events/$id", "User event  with the following ID was not found: $id");
          throw new HttpNotFoundException($request, 'User event not found');
        }
        $token = $request->getAttribute("token");
        if($userEvent->getUserId() !== $token["sub"]) {
          LogService::error("/users/events/$id", "User event does not belong to user with ID: ".$token["sub"]);
          throw new HttpUnauthorizedException($request, 'You do not have permission to delete this event');
        }
        $event = $this->eventDao->getEventById($userEvent->getEventId());
        if(empty($event)) {
          LogService::error("/users/events/$id", "Event  with the following ID was not found: ".$userEvent->getEventId());
          throw new HttpNotFoundException($request, 'Event not found');
        }
        $deleted = $this->eventDao->deleteEventById($event->getEventId());
        if(!$deleted) {
          LogService::error("/users/events/$id", "Could not delete event with the following ID: ".$event->getEventId());
          throw new HttpInternalServerErrorException($request, 'Failed to delete event');
        }
  
        $response->getBody()->write(json_encode([
          "Message" => "User event deleted successfully",
        ]));
  
        return $response;
      }catch (Exception $e) {
        switch(true) {
          case $e instanceof PDOException:
            LogService::error("/users/events/$id", "Could not delete the user event due to database error: ".$e->getMessage());
            throw new HttpInternalServerErrorException($request, 'Could not delete the user event due to a database error');
          case $e instanceof HttpException:
            throw $e;
          default:
            LogService::error("/users/events/$id", "An unexpected error occured: ".$e->getMessage());
            throw new HttpInternalServerErrorException($request, 'An unexpected error occured. See the logs for more detail');
        }
      }
      
    }

    public function getUserEvent(Request $request, Response $response, string $id) {
      try{
        $userEvent = $this->userEventDao->getUserEventById($id);
        if(empty($userEvent)) {
          LogService::error("/users/events/$id", "User event  with the following ID was not found: $id");
          throw new HttpNotFoundException($request, 'User event not found');
        }
        $token = $request->getAttribute("token");
        if($userEvent->getUserId() !== $token["sub"]) {
          LogService::error("/users/events/$id", "User event does not belong to user with ID: ".$token["sub"]);
          throw new HttpUnauthorizedException($request, 'You do not have permission to view this event');
        }
        $event = $this->eventDao->getEventById($userEvent->getEventId());
        if(empty($event)) {
          LogService::error("/users/events/$id", "Event  with the following ID was not found: ".$userEvent->getEventId());
          throw new HttpNotFoundException($request, 'Event not found');
        }
        $response->getBody()->write(json_encode([
          'user_event_id' => $userEvent->getUserEventId(),
          'user_id' => $userEvent->getUserId(),
          'event' => $event
        ]));
        return $response->withStatus(200);
      }catch (Exception $e){
        switch(true) {
          case $e instanceof PDOException:
            LogService::error("/users/events/$id", "Could not get the user event due to database error: ".$e->getMessage());
            throw new HttpInternalServerErrorException($request, 'Could not get user event due to a database error');
          case $e instanceof HttpException:
            throw $e;
          default:
            LogService::error("/users/events/$id", "Could not delete the user event due to database error: ".$e->getMessage());
            throw new HttpInternalServerErrorException($request, 'An unexpected error occured. See the logs for more details');
        }
      }
    }
}