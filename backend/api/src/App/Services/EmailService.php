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
    try {
      $this->mailer->clearAddresses();
      $this->mailer->addAddress($to, $toName);
      $this->mailer->isHTML(true);
      $this->mailer->Subject = $subject;
      $this->mailer->Body    = $body;
      $this->mailer->AltBody = $altBody ?: strip_tags($body);

      $this->mailer->send();
      return "E-mail enviado com sucesso";
    } catch (Exception $e) {
      return $this->mailer->ErrorInfo;
    }
  }
  public function getVerificationEmailTemplate(string $userName, string $code): string
  {
    return "
    <html>
    <head>
      <meta charset='UTF-8'>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 500px;
          background-color: #ffffff;
          padding: 30px;
          margin: auto;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
          text-align: center;
        }
        .code {
          font-size: 32px;
          font-weight: bold;
          color: #2c3e50;
          letter-spacing: 4px;
          background-color: #f0f0f0;
          display: inline-block;
          padding: 10px 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          color: #999;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class='container'>
        <h2>Olá, {$userName}!</h2>
        <p>Use o código abaixo para continuar com sua criação de conta de usuário:</p>
        <div class='code'>{$code}</div>
        <p>Este código é válido por 5 minutos. Se você não solicitou isso, ignore este e-mail.</p>
        <div class='footer'>
          &copy; " . date('Y') . " IFPR - Intellecta. Todos os direitos reservados.
        </div>
      </div>
    </body>
    </html>
    ";
  }
}