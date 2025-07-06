<?php

declare(strict_types= 1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dto\UserDto;
use App\Models\User;
use App\Models\VerificationCode;
use App\Vo\PasswordVo;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Psr7\Response;
use Slim\Psr7\Request;
use App\Dao\UserDao;
use App\Dao\VerificationCodeDao;
use App\Services\EmailService;
use App\Services\JwtService;
use App\Services\LogService;
use App\Vo\EmailAddressVo;
use App\Vo\UsernameVo;
use Exception;
use InvalidArgumentException;
use PDOException;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpNotFoundException;

class AuthController {

  public function __construct(
    private UserDao $userDao,
    private VerificationCodeDao $verificationCodeDao,
    private FilesDao $filesDao,
    private JwtService $jwtService,
    private EmailService $emailService,
  ){}

  public function signUp(Request $request, Response $response) {
    $body = $request->getParsedBody();

    if (
      empty($body['full_name']) ||
      empty($body['email']) ||
      empty($body['password'])
    ) {
      LogService::http422('/auth/sign-up', "missing POST parameters: 'full_name', 'email' and 'password'");
      throw new HttpException($request,"'full_name', 'email' and 'password' are required",422);
    }

    try {
      $fullName = new UsernameVo($body['full_name']);
      $email = new EmailAddressVo($body['email']);
      $password = new PasswordVo($body['password']);
    } catch (InvalidArgumentException $e) {
      LogService::http422('/auth/sign-up', $e->getMessage());
      throw new HttpException($request, $e->getMessage(), 422);
    }

    try {
      // Check if user exists by email (using VO value)
      $user = $this->userDao->getByEmail($email->getValue());

      if (empty($user)) {
        $user = $this->userDao->create(new User([
          "user_id" => Uuid::uuid4()->toString(),
          "full_name" => $fullName->getValue(),
          "email" => $email->getValue(),
          "password_hash" => password_hash($password->getValue(), PASSWORD_BCRYPT),
        ]));
        LogService::info("/auth/sign-up", "Unverified user CREATED: $user");
      } else if (!$user->isEmailVerified()) {
        $user = $user->setFullName($fullName->getValue());
        $user->setEmail($email->getValue());
        $user->setPasswordHash(password_hash($password->getValue(), PASSWORD_BCRYPT));
        $this->userDao->update($user);
        LogService::info("/auth/sign-up", "Unverified user UPDATED: $user");
      } else {
        throw new HttpException($request, 'E-mail already registered', 409);
      }

      // Create a unique verification code
      $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);

      // Send verification email
      $this->emailService->sendMail(
        to: $email->getValue(),
        toName: $fullName->getValue(),
        subject: "$code - Seu código de sign-in da Intellecta",
        body: $this->emailService->getVerificationEmailTemplate(
          userName: $fullName->getValue(),
          code: $code
        ),
        altBody: "$code - Seu código de sign-in da Intellecta"
      );

      // Insert verification code into DB
      $this->verificationCodeDao->create(new VerificationCode([
        'verification_code_id' => Uuid::uuid4()->toString(),
        'code' => $code,
        'expires_at' => date('Y-m-d H:i:s', strtotime('+5 minutes')),
        'user_id' => $user->getUserId(),
      ]));

      $response->getBody()->write(json_encode([
        "message" => 'User account created. Verify your e-mail to continue the sign-up process',
      ]));

      LogService::info("/auth/sign-up", "Verification code sent to: " . $user->getEmail());
      return $response->withStatus(201);

    } catch (PDOException $e) {
      LogService::http500("/auth/sign-up", $e->getMessage());
      if ($e->getCode() === 23000) {
        throw new HttpException($request,'E-mail already registered',409);
      }
      throw new HttpInternalServerErrorException($request,"Could not sign-up the user due to a database error. See logs for more detail");
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/auth/sign-up", $e->getMessage());
      throw new HttpInternalServerErrorException($request, $e->getMessage());
    }
  }

  public function verifyEmail(Request $request, Response $response): Response{
    $body = $request->getParsedBody();

    if(
      empty($body['email']) ||
      empty($body['verification_code'])
    ){
      LogService::http422("/auth/verify-code", "missing POST parameters: 'email' and 'verification_code'");
      throw new HttpException($request, "'email' and 'verification_code' are required", 422);
    }

    $email = trim($body['email']);
    $code = trim($body['verification_code']);

    
    try{
      $user = $this->userDao->getByEmail($email);
      
      if(empty($user)){
        LogService::http404("/auth/verify-code", "e-mail: $email does not correspond to any user");
        throw new HttpNotFoundException($request,'User not found');
      } 
  
      if($user->isEmailVerified()){
        LogService::http409("/auth/verify-code", "user account already registred and verified");
        throw new HttpException(
          $request,
          'User account already verified. No additional actions required.',
          409
        );
      } 
      $verificationCode = $this->verificationCodeDao->getLatestVerificationCode($user->getUserId(), $code);
      if(empty($verificationCode)) {
        LogService::http422("/auth/verify-code", "No verification code found for: $user");
        throw new HttpException($request,'Verification code expired or invalid', 422);
      }
      // Atualiza código de verificação para inválido
      $verificationCode->setIsPending(false);
      $this->verificationCodeDao->update($verificationCode);
      // Atualiza a conta de usuário para uma conta verifica
      $user->setEmailVerified(true);
      $user = $this->userDao->update($user);
      // Gera JWT
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
    }catch (PDOException $e) {
      LogService::http500("/auth/verify-code", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not verify the user due to a database error. See logs for more detail');
    }catch (HttpException $e) {
      throw $e;
    }catch(Exception $e){
      LogService::http500("/auth/verify-code", $e->getMessage());
      throw new HttpInternalServerErrorException($request, $e->getMessage());
    }   
  }

  public function signIn(Request $request, Response $response): Response {
    $body = $request->getParsedBody();
    
    if (
      empty($body['email']) || 
      empty($body['password'])
    ) {
      LogService::http422("/auth/sign-in", "missing POST parameters: 'email' and 'password'");
      throw new HttpException($request, "'email' and 'password' are required", 422);
    }

    $email = trim($body['email']);
    $password = trim($body['password']);

    try {
      $user = $this->userDao->getByEmail($email);

      if (empty($user)) {
        LogService::http404("/auth/sign-in", "No user found with email: $email");
        throw new HttpNotFoundException($request, 'Usuário não encontrado');
      }

      if (! $user->isEmailVerified()) {
        LogService::http403("/auth/sign-in", "User not verified, sign-in denied: $user");
        throw new HttpException($request, 'E-mail not verified', 403);
      }

      if (!password_verify($password, $user->getPasswordHash())) {
        LogService::http401("/auth/sign-in", "Password incorrect for: $user");
        throw new HttpUnauthorizedException($request, 'E-mail or Password incorrect');
      }
      $profilePicture = null;
      
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
    } catch (PDOException $e) {
      LogService::http500("/auth/sign-in", $e->getMessage());
      throw new HttpInternalServerErrorException($request, "Could not sign-in user due to database error.");
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/auth/sign-in", $e->getMessage());
      throw new HttpInternalServerErrorException($request, $e->getMessage());
    }
  }

  public function signOut(Request $request, Response $response): Response {
    $authHeader = $request->getHeaderLine("Authorization");
    preg_match('/Bearer\s(\S+)/', $authHeader, $matches);
    $token = $matches[1];

    try {
      if (! $this->jwtService->blacklistJwt($token)) {
        LogService::http500("/auth/sign-out", "Could not blacklist token: $token");
        throw new HttpInternalServerErrorException($request, 'There was an error in the sign-out process.');
      }
      
      $response->getBody()->write(json_encode([
        'status' => 'success',
        'message' => 'Token blacklisted with success'
      ]));

      LogService::info("/auth/sign-out", "Blacklisted token: $token");
      return $response;
    } catch (PDOException $e) {
      LogService::http500("/auth/sign-out", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Database error during sign-out');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/auth/sign-out", $e->getMessage());
      throw new HttpInternalServerErrorException($request, $e->getMessage());
    }
  }
}