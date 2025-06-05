<?php

declare(strict_types= 1);

namespace App\Controllers;

use App\Models\User;
use App\Models\VerificationCode;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Psr7\Response;
use Slim\Psr7\Request;
use App\Dao\UserDao;
use App\Dao\VerificationCodeDao;
use App\Services\EmailService;
use App\Services\JwtService;
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
  ){}

  public function signUp(Request $request, Response $response) {
    $body = $request->getParsedBody();
    if(
      !isset($body['full_name']) || 
      !isset($body['email'])     || 
      !isset($body['password'])
      ){
        throw new HttpBadRequestException($request, 'Full name, E-mail and password are required');
    }
    $fullName = $body['full_name'];
    $email = $body['email'];
    $password_hash = password_hash($body['password'], PASSWORD_BCRYPT);
    
    if(! $fullName){
      throw new HttpBadRequestException($request,'Full name is required');
    }
    if (! $email) {
      throw new HttpBadRequestException($request, message: 'E-mail is required');
    }
    if (! $password_hash) {
      throw new HttpBadRequestException($request, message: 'Password is required');
    }
    
    
    try{
      // Verifica se já existe alguma conta pendente com o mesmo e-mail
      // Se houver atualiza os dados cadastrais do cliente, se não, cria a conta
      $user = $this->userDao->getByEmail($email);
      if(! $user){
        $user = $this->userDao->create(new User([
          "user_id" => Uuid::uuid4()->toString(),
          "full_name" => $fullName,
          "email" => $email,
          "password_hash" => $password_hash,
        ]));
      }else if (! $user->isEmailVerified()){
        $user = $user->setFullName($fullName);
        $user->setEmail($email);
        $user->setPasswordHash($password_hash);
        $this->userDao->update($user);
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
        "message"=> 'User account created, verify your e-mail to continue the sign-in proccess'
      ]));

      return $response->withStatus(201);
    }catch (Exception $e){
      if($e instanceof PDOException){
        switch ($e->getCode()){
          case 23000:
            throw new HttpException(
              $request,
              'E-mail already registered',
              409
            );
          default:
            throw new HttpInternalServerErrorException($request, $e->getMessage());
        }
      }else if ($e instanceof HttpException){
        throw $e;
      }else {
        throw new HttpInternalServerErrorException($request, $e->getMessage());
      }
    }
  }

  public function verifyEmail(Request $request, Response $response): Response{
    $body = $request->getParsedBody();

    if(
      !isset($body['email']) ||
      !isset($body['verification_code'])
    ){
      throw new HttpBadRequestException($request, 'E-mail and verification code are required');
    }

    $email = $body['email'];
    $code = $body['verification_code'];

    if(! $email) throw new HttpBadRequestException($request,'E-mail is required');
    if(! $code) throw new HttpBadRequestException($request,'Verification code is required');

    $user = $this->userDao->getByEmail($email);
    if(! $user) throw new HttpNotFoundException($request,'User not found');
    if($user->isEmailVerified()) throw new HttpException(
      $request,
      'User account already verified. No additional actions required.',
      409
    );
    
    try{
      $verificationCode = $this->verificationCodeDao->getLatestVerificationCode($user->getUserId(), $code);
      if(! $verificationCode) {
        throw new HttpBadRequestException($request,'Verification code expired or invalid');
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

      return $response;
    } catch(Exception $e){
      if ($e instanceof HttpException){
        throw $e;
      }else {
        throw new HttpInternalServerErrorException($request, $e->getMessage());
      }  
    }   
  }

  public function login(Request $request, Response $response): Response {
    $body = $request->getParsedBody();
    
    if (!isset($body['email']) || !isset($body['password'])) {
      throw new HttpBadRequestException($request, 'Email and password are required');
    }
    
    $email = $body['email'];
    $password = $body['password'];

    if (! $email) {
      throw new HttpBadRequestException($request, message: 'E-mail is required');
    }
    if (! $password) {
      throw new HttpBadRequestException($request, message: 'Password is required');
    }

    $user = $this->userDao->getByEmail($email);
    
    if (! $user) {
      throw new HttpNotFoundException($request, message:'User not found');
    }else if (! $user->isEmailVerified()) {
      throw new HttpNotFoundException($request, message:'User not found');
    }

    if ($user->getPasswordHash() !== $password){
      throw new HttpUnauthorizedException($request, message:'Password doesnt match');
    }

    $jwt = $this->jwtService->generateToken(
      userId: $user->getUserId(),
      email: $user->getEmail(),
    );

    $response->getBody()->write(json_encode([
        'token' => $jwt
    ]));
    
    return $response;
  }

  public function logout(Request $request, Response $response): Response {
    $authHeader = $request->getHeaderLine("Authorization");
    
    if (empty($authHeader)) {
      throw new HttpUnauthorizedException($request, 'Authorization header is required');
    }

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
      throw new HttpUnauthorizedException($request, 'Malformed authorization header');
    }
    
    $token = $matches[1];
    
    if (empty($token) || count(explode('.', $token)) !== 3) {
      throw new HttpUnauthorizedException($request, 'Invalid token format');
    }

    try {
      $decoded = $this->jwtService->validateToken($token);
      
      if (!$decoded) {
        throw new HttpUnauthorizedException($request, 'Invalid token');
      }
      
      if (! $this->jwtService->blacklistJwt($token)){
        throw new HttpInternalServerErrorException($request, 'There was an error when trying to blacklist yout token.');
      }
      
      $response->getBody()->write(json_encode([
        'status' => 'success',
        'message' => 'Token blacklisted with success'
      ]));

      return $response;
    } catch (\Exception $e) {
      throw new HttpUnauthorizedException($request, 'Token validation failed: ' . $e->getMessage());
    }
  }
}