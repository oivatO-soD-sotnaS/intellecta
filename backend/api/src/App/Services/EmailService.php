<?php

declare(strict_types= 1);

namespace App\Services;

use App\Database;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService {
  public function __construct(private Database $database, private PHPMailer $mailer){
    $this->mailer = new PHPMailer(true);

    // Configurações do Gmail SMTP
    $this->mailer->isSMTP();
    $this->mailer->Host       = 'smtp.gmail.com';
    $this->mailer->SMTPAuth   = true;
    $this->mailer->Username   = 'otavio.santos.lima.tds.2022@gmail.com';
    $this->mailer->Password   = 'ksmq tpst gdzm bvzo';
    $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $this->mailer->Port       = 587;
    $this->mailer->CharSet    = 'UTF-8';
    $this->mailer->Encoding   = 'base64';
    
    // Remetente padrão
    $this->mailer->setFrom('otavio.santos.lima.tds.2022@gmail.com', 'Otavio dos Santos Lima');
  }

  public function sendMail(string $to, string $toName, string $subject, string $body, string $altBody = ''){
    $this->mailer->clearAddresses();
    $this->mailer->addAddress($to, $toName);
    $this->mailer->isHTML(true);
    $this->mailer->Subject = $subject;
    $this->mailer->Body    = $body;
    $this->mailer->AltBody = $altBody ?: strip_tags($body);

    $this->mailer->send();
    return "E-mail enviado com sucesso";
  }
  public function getVerificationEmailTemplate(string $userName, string $code): string
  {
    return "
    <html>
    <head>
      <meta charset='UTF-8'>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f2f0f8;
          padding: 40px 20px;
          color: #333;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background-color: #f5f5fa;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0px 8px 25px 0px rgba(126, 87, 194, 0.15);
          border-top: 6px solid #7e57c2;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #7e57c2;
          margin-bottom: 20px;
        }
        .title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #333;
        }
        .message {
          font-size: 15px;
          margin-bottom: 25px;
          color: #555;
          line-height: 1.6;
        }
        .code {
          font-size: 36px;
          font-weight: bold;
          color: #7e57c2;
          background-color: #f3eefe;
          display: inline-block;
          padding: 16px 32px;
          border-radius: 8px;
          letter-spacing: 6px;
          margin: 25px 0;
        }
        .info {
          font-size: 14px;
          color: #666;
          margin-top: 20px;
        }
        .footer {
          font-size: 12px;
          color: #aaa;
          margin-top: 40px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class='email-wrapper' style='margin-left: auto; margin-right: auto; text-align: center;'>
      <div class='logo'>Intellecta</div>
      <div class='title'>Olá, $userName!</div>
      <div class='message'>
        Seja bem-vindo(a) à nossa plataforma de ensino digital!<br>
        Para finalizar o seu cadastro, utilize o código abaixo:
      </div>
      <div class='code'>$code</div>
      <div class='info'>
        Este código é válido por 5 minutos.<br>
        Se você não solicitou este cadastro, pode ignorar esta mensagem com segurança.
      </div>
      <div class='footer'>
        &copy; " . date('Y') . " IFPR - Intellecta. Todos os direitos reservados.
      </div>
      </div>
    </body>
    </html>
    ";
  }

}