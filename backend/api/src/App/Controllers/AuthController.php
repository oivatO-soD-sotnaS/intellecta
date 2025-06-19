<?php

declare(strict_types= 1);

namespace App\Controllers;

use App\Models\User;
use App\Models\VerificationCode;
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
use App\Services\ValidationService;
use Exception;
use PDOException;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpNotFoundException;

class AuthController {

  public function __construct(
    private UserDao $userDao,
    private VerificationCodeDao $verificationCodeDao,
    private JwtService $jwtService,
    private EmailService $emailService,
    private ValidationService $validationService
  ){}

  public function signUp(Request $request, Response $response) {
    $body = $request->getParsedBody();
    
    if(
      empty($body['full_name']) || 
      empty($body['email'])     || 
      empty($body['password'])
      ){
        LogService::error("/auth/sign-up", "Unprocessable entity, missing POST parameters: 'full_name', 'email' and 'password'");
        throw new HttpException(
          $request, 
          "'full_name, 'email' and 'password' are required",
          422
        );
    }

    $fullName = trim($body['full_name']);
    $email = trim($body['email']);
    $password = trim($body['password']);
    
    
    // Verifica as regras de negócio
    if(!$this->validationService->isValidUsername($fullName)){
      LogService::error("/auth/sign-up", "Unprocessable entity, invalid username: $fullName");
      throw new HttpException($request, 'Full name must be between 5 and 64 characters', 422);
    }
    if(!$this->validationService->isValidEmail($email)){
      LogService::error("/auth/sign-up", "Unprocessable entity, invalid e-mail: $email");
      throw new HttpException($request, 'Invalid e-mail format', 422);
    }
    if(!$this->validationService->isValidPassword($password)){
      LogService::error("/auth/sign-up", "Unprocessable entity, invalid password: $password");
      throw new HttpException($request, 'Password must be between 8 and 64 characters, and must contain at least one uppercase letter, one lowercase letter, one number, and one special character', 422);
    }

    try{
      // Verifica se já existe alguma conta pendente com o mesmo e-mail
      // Se houver atualiza os dados cadastrais do cliente, se não, cria a conta
      $user = $this->userDao->getByEmail($email);
      if(empty($user)){
        $user = $this->userDao->create(new User([
          "user_id" => Uuid::uuid4()->toString(),
          "full_name" => $fullName,
          "email" => $email,
          "password_hash" => password_hash($password, PASSWORD_BCRYPT),
        ]));
        LogService::info("/auth/sign-up", "Unverified user CREATED: $user");
      }else if (! $user->isEmailVerified()){
        $user = $user->setFullName($fullName);
        $user->setEmail($email);
        $user->setPasswordHash(password_hash($password, PASSWORD_BCRYPT));
        $this->userDao->update($user);
        LogService::info("/auth/sign-up", "Unverified user UPDATED: $user");
      }else {
        throw new HttpException($request, 'E-mail already registered', 409);
      }

      // Cria código de uso único
      $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
  
      $this->emailService->sendMail(
        to: $email,
        toName: $fullName,
        subject: "$code - Seu código de sign-in da Intellecta",
        body: $this->emailService->getVerificationEmailTemplate(userName: $fullName, code: $code), 
        altBody: "$code - Seu código de sign-in da Intellecta"
      );

      // Insere código de verificação na base de dados
      $this->verificationCodeDao->create(new VerificationCode([
        'verification_code_id' => Uuid::uuid4()->toString(),
        'code' => $code,
        'expires_at' => date('Y-m-d H:i:s', strtotime('+10 minutes')),
        'user_id' => $user->getUserId()
      ]));
      
      $response->getBody()->write(json_encode([
        "message"=> 'User account created. Verify your e-mail to continue the sign-up proccess'
      ]));
      
      LogService::info("/auth/sign-up", "Verification code sent to: ".$user->getEmail());
      return $response->withStatus(201);
    }catch (Exception $e){
      switch (true) {
        case $e instanceof PDOException && $e->getCode() === 23000:
          LogService::error("/auth/sign-up", "Could not create user due to database error: ".$e->getMessage());
          throw new HttpException(
            $request,
            'E-mail already registered',
            409
          );
          case $e instanceof PDOException:
            LogService::error("/auth/sign-up", "Could not create user due to database error: ".$e->getMessage());
          throw new HttpInternalServerErrorException($request, "Could not sign-up the user due to database errors");
        case $e instanceof HttpException:
          throw $e;
        default:
          throw new HttpInternalServerErrorException($request, $e->getMessage());
      }
    }
  }

  public function verifyEmail(Request $request, Response $response): Response{
    $body = $request->getParsedBody();

    if(
      empty($body['email']) ||
      empty($body['verification_code'])
    ){
      LogService::error("/auth/verify-code", "Unprocessable entity, missing POST parameters: 'email' and 'verification_code'");
      throw new HttpException($request, "'email' and 'verification_code' are required", 422);
    }

    $email = trim($body['email']);
    $code = trim($body['verification_code']);

    
    try{
      $user = $this->userDao->getByEmail($email);
      
      if(empty($user)){
        LogService::error("/auth/verify-code", "Code verification failed: e-mail does not correspond to any user");
        throw new HttpNotFoundException($request,'User not found');
      } 
  
      if($user->isEmailVerified()){
        LogService::error("/auth/verify-code", "Code verification failed: user account already registred and verified");
        throw new HttpException(
          $request,
          'User account already verified. No additional actions required.',
          409
        );
      } 
      $verificationCode = $this->verificationCodeDao->getLatestVerificationCode($user->getUserId(), $code);
      if(empty($verificationCode)) {
        LogService::error("/auth/verify-code", "No verification code found for: $user");
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

      $response->getBody()->write(json_encode([
        'message' => "Conta de usuário verificada com sucesso!",
        'token' => $jwt,
        'user' => $user
      ]));

      LogService::info("/auth/verify-code", "User account verified: $user");
      return $response;
    } catch(Exception $e){
      switch(true){
        case $e instanceof PDOException:
          LogService::error("/auth/verify-code", "Could not verify user account due to database error: ".$e->getMessage());
          throw new HttpInternalServerErrorException($request, 'Could not verify the user due to a database error.');
        case $e instanceof HttpException:
          throw $e;
        default:
          throw new HttpInternalServerErrorException($request, $e->getMessage());
      }
    }   
  }

  public function signIn(Request $request, Response $response): Response {
    $body = $request->getParsedBody();
    
    if (
      empty($body['email']) || 
      empty($body['password'])
    ) {
      LogService::error("/auth/sign-in", "Unprocessable entity, missing POST parameters: 'email' and 'password'");
      throw new HttpException($request, "'email' and 'password' are required", 422);
    }
    
    $email = trim($body['email']);
    $password = trim($body['password']);

    try{
      $user = $this->userDao->getByEmail($email);
  
      if (empty($user)) {
        LogService::error("/auth/sign-in", "No user found with email: $email");
        throw new HttpNotFoundException($request, message:'Usuário não encontrado');
      }else if (! $user->isEmailVerified()) {
        LogService::error("/auth/sign-in", "User not verified, sign-in denied: $user");
        throw new HttpNotFoundException($request, message:'E-mail not verified');
      }
  
      if (!password_verify($password, $user->getPasswordHash())) {
        LogService::error("/auth/sign-in", "Password incorrect, sign-in denied for: $user");
        throw new HttpUnauthorizedException($request, message:'E-mail or Password incorrect');
      }
  
      $jwt = $this->jwtService->generateToken(
        userId: $user->getUserId(),
        email: $user->getEmail(),
      );
  
      $response->getBody()->write(json_encode([
          'token' => $jwt,
          'user' => $user
      ]));
      
      LogService::info("/auth/sign-in", "User signed-in: $user");
      return $response;
    }catch (Exception $e){
      switch(true){
        case $e instanceof PDOException:
          LogService::error("/auth/sign-in", "Could not sign-in user due to database error:".$e->getMessage());
          throw new HttpInternalServerErrorException($request, "Could not sign-in user due to database error.");
        case $e instanceof HttpException:
          throw $e;
        default:
          throw new HttpException($request, $e->getMessage());
      }
    }
  }

  public function signOut(Request $request, Response $response): Response {
    $authHeader = $request->getHeaderLine("Authorization");

    // No token validation necessary due to the route being protected by the token validation middlware. Token is guaranteed to be valid.
    preg_match('/Bearer\s(\S+)/', $authHeader, $matches);
    
    $token = $matches[1];

    try {
      if (! $this->jwtService->blacklistJwt($token)){
        LogService::error("/auth/sign-out", "Could not blacklist token: $token");
        throw new HttpInternalServerErrorException($request, 'There was an error in the sign-out process.');
      }
      
      $response->getBody()->write(json_encode([
        'status' => 'success',
        'message' => 'Token blacklisted with success'
      ]));

      LogService::info("/auth/sign-out", "Blacklisted token: $token");
      return $response;
    } catch (Exception $e) {
      throw new HttpUnauthorizedException($request, 'Token validation failed: ' . $e->getMessage());
    }
  }
}