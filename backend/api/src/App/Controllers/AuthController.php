<?php
declare(strict_types= 1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\UsersDao;
use App\Dao\VerificationCodesDao;
use App\Dto\UserDto;
use App\Models\User;
use App\Models\VerificationCode;
use App\Vo\EmailAddressVo;
use App\Vo\PasswordVo;
use App\Vo\UsernameVo;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Psr7\Response;
use Slim\Psr7\Request;
use App\Queue\RedisEmailQueue;
use App\Services\EmailService;
use App\Services\JwtService;
use App\Services\LogService;
use App\Services\ValidatorService;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpNotFoundException;

// Documented
readonly class AuthController extends BaseController {
  public function __construct(
    private UsersDao $usersDao,
    private VerificationCodesDao $verificationCodesDao,
    private FilesDao $filesDao,
    private JwtService $jwtService,
    private EmailService $emailService,
    private ValidatorService $validatorService,
    private RedisEmailQueue $emailQueue
  ){}

  public function signUp(Request $request, Response $response): Response 
  {
    return $this->handleErrors($request, function() use ($request, $response) {
      $body = $request->getParsedBody();
      
      $this->validatorService->validateRequired($body, ['full_name', 'email', 'password']);

      $fullName = new UsernameVo($body['full_name']);
      $email = new EmailAddressVo($body['email']);
      $password = new PasswordVo($body['password']);

      $user = $this->usersDao->getUserByEmail($email->getValue());

      $passwordHash = password_hash($password->getValue(), PASSWORD_BCRYPT);
      if (empty($user)) {
        $user = $this->usersDao->createUser(new User([
          "user_id" => Uuid::uuid4()->toString(),
          "full_name" => $fullName->getValue(),
          "email" => $email->getValue(),
          "password_hash" => $passwordHash,
        ]));
        LogService::info("/auth/sign-up", "Unverified user CREATED: $user");
      } else if (!$user->isEmailVerified()) {
        $user = $user->setFullName($fullName->getValue());
        $user->setEmail($email->getValue());
        $user->setPasswordHash($passwordHash);
        $this->usersDao->updateUser($user);
        LogService::info("/auth/sign-up", "Unverified user UPDATED: $user");
      } else {
        throw new HttpException($request, LogService::HTTP_409 . 'E-mail already registered', 409);
      }

      // Create a unique verification code
      $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);

      $this->emailQueue->push([
        'to' => $email->getValue(),
        'toName' => $fullName->getValue(),
        'subject' => "$code - Seu código de sign-in da Intellecta",
        'body' => $this->emailService->getVerificationEmailTemplate(
          userName: $fullName->getValue(),
          code: $code
        ),
        'altBody' => "$code - Seu código de sign-in da Intellecta"
      ]);

      // Insert verification code into DB
      $expiresAt = date('Y-m-d H:i:s', strtotime('+5 minutes'));

      $this->verificationCodesDao->createVerificationCode(new VerificationCode([
        'verification_code_id' => Uuid::uuid4()->toString(),
        'code' => $code,
        'expires_at' => $expiresAt,
        'user_id' => $user->getUserId(),
      ]));

      $response->getBody()->write(json_encode([
        "message" => 'User account created. Verify your e-mail to continue the sign-up process',
      ]));

      LogService::info("/auth/sign-up", "Verification code sent to: " . $user->getEmail());
      return $response->withStatus(201);
    });
  }

  public function verifyEmail(Request $request, Response $response): Response{
    return $this->handleErrors($request, function() use ($request, $response) {   
      $body = $request->getParsedBody();
  
      $this->validatorService->validateRequired($body, ['email', 'verification_code']);
      
      $email = new EmailAddressVo($body['email']);
      $code = trim($body['verification_code']);
  
      
      $user = $this->usersDao->getUserByEmail($email->getValue());
      
      if(empty($user)){
        LogService::http404("/auth/verify-code", "e-mail: $email does not correspond to any user");
        throw new HttpNotFoundException($request,LogService::HTTP_404);
      } 
  
      if($user->isEmailVerified()){
        LogService::http409("/auth/verify-code", "user account already registred and verified");
        throw new HttpException(
          $request,
          LogService::HTTP_409 . 'User account already verified. No additional actions required.',
          409
        );
      } 
      $verificationCode = $this->verificationCodesDao->getLatestVerificationCode($user->getUserId(), $code);
      if(empty($verificationCode)) {
        LogService::http422("/auth/verify-code", "No verification code found for: $user");
        throw new HttpException($request,LogService::HTTP_422 . 'Verification code expired or invalid', 422);
      }

      $verificationCode->setIsPending(false);
      $this->verificationCodesDao->updateVerificationCode($verificationCode);

      $user->setEmailVerified(true);
      $user = $this->usersDao->updateUser($user);

      $jwt = $this->jwtService->generateToken(
        userId: $user->getUserId(),
        email: $user->getEmail(),
      );

      $userDto = new UserDto($user, null);

      $response->getBody()->write(json_encode([
        'message' => "User account successfully verified!",
        'token' => $jwt,
        'user' => $userDto
      ]));

      LogService::info("/auth/verify-code", "User account verified: $user");
      return $response;
    });
  }

  public function signIn(Request $request, Response $response): Response {
    return $this->handleErrors($request, function() use ($request, $response) {
      $body = $request->getParsedBody();
      
      $this->validatorService->validateRequired($body, ['email', 'password']);
  
      $email = new EmailAddressVo($body['email']);
      $password = new PasswordVo($body['password']);
  
      $user = $this->usersDao->getUserByEmail($email->getValue());

      if (empty($user)) {
        LogService::http404("/auth/sign-in", "No user found with email: {$email->getValue()}");
        throw new HttpNotFoundException($request, LogService::HTTP_404);
      }

      if (!$user->isEmailVerified()) {
        LogService::http401("/auth/sign-in", "User not verified, sign-in denied: $user");
        throw new HttpUnauthorizedException($request, LogService::HTTP_401 . 'Incorrect e-mail or password');
      }

      if (!password_verify($password->getValue(), $user->getPasswordHash())) {
        LogService::http401("/auth/sign-in", "Password incorrect for: $user");
        throw new HttpUnauthorizedException($request, LogService::HTTP_401 . 'Incorrect e-mail or password');
      }
      
      if(!empty($user->getProfilePictureId())) {
        $profilePicture = $this->filesDao->getFileById($user->getProfilePictureId());
      }

      $userDto = new UserDto($user, $profilePicture);

      $jwt = $this->jwtService->generateToken(
        userId: $user->getUserId(),
        email: $user->getEmail(),
      );

      $response->getBody()->write(json_encode([
        'token' => $jwt,
        'user' => $userDto
      ]));
      
      LogService::info("/auth/sign-in", "User signed-in: $user");
      return $response;
    });
  }

  public function signOut(Request $request, Response $response): Response {
    return $this->handleErrors($request, function() use ($request, $response) {
      $authHeader = $request->getHeaderLine("Authorization");
      preg_match('/Bearer\s(\S+)/', $authHeader, $matches);
      $token = $matches[1];
  
      if (! $this->jwtService->blacklistJwt($token)) {
        LogService::http500("/auth/sign-out", "Could not blacklist token: $token");
        throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
      }
      
      $response->getBody()->write(json_encode([
        'message' => 'Token blacklisted with success'
      ]));

      LogService::info("/auth/sign-out", "Blacklisted token: $token");
      return $response;
    });
  }
}