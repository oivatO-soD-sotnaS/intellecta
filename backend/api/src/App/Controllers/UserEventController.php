<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Dao\UserDao;
use App\Dao\UserEventDao;
use App\Services\EmailService;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class UserEventController {
    public function __construct(
      private UserEventDao $userEventDao,
      private UserDao $userDao,
      private EmailService $emailService
    ) {}

    public function getUserEvents(Request $request,Response $response, string $id) {
      $token = $request->getAttribute("token");

      if($token["sub"] !== $id) {
        throw new HttpUnauthorizedException($request, 'User not authorized');
      }

      $userEvents = $this->userEventDao->getAllUserEventsById($id);

      // if(empty($userEvents)) {
      //   throw new HttpNotFoundException($request, 'No events found for this user');
      // }

      $response->getBody()->write(json_encode($userEvents));
      return $response;
    }

    public function createUserEvent(Request $request, Response $response, string $id) {
     
    }

    public function updateUserEvent(Request $request, Response $response, string $id) {
      
    }


}