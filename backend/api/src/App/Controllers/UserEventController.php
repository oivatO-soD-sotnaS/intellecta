<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Dao\UserDao;
use App\Services\EmailService;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class UserEventController {
    public function __construct(
      private UserEventDao $userEventDao,
      private UserDao $userDao,
      private EmailService $emailService
    ) {}

    public function getUserEvents(Request $request,Response $response, string $id) {

    }

    public function createUserEvent(Request $request, Response $response, string $id) {
     
    }

    public function updateUserEvent(Request $request, Response $response, string $id) {
      
    }

    
}