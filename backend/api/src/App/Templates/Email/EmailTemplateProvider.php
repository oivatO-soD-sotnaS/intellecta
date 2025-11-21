<?php

declare(strict_types= 1);

namespace App\Templates\Email;

use App\Models\Event;
use App\Models\ForumMessage;

readonly class EmailTemplateProvider {

  private string $platformUrl;
  
  public function __construct() {
      $this->platformUrl = "https://localhost:3000";
  }

  public function getVerificationEmailTemplate(
    string $userName, 
    string $code
  ): string
  {
    $currentYear = date('Y');
    
    return "
    <html>
    <head>
      <meta charset='UTF-8'>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8fafc;
          padding: 40px 20px;
          color: #334155;
          line-height: 1.6;
        }
        .email-wrapper {
          max-width: 680px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, #16a34a, #138c3e);
          padding: 40px 30px 30px 30px;
          text-align: center;
          color: white;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 15px;
          letter-spacing: -0.5px;
        }
        .header-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
          opacity: 0.95;
        }
        .header-subtitle {
          font-size: 15px;
          opacity: 0.85;
          font-weight: 400;
        }
        .content {
          padding: 40px;
        }
        .greeting {
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 25px;
          font-weight: 500;
        }
        .message {
          font-size: 16px;
          color: #475569;
          margin-bottom: 25px;
          line-height: 1.6;
          text-align: center;
        }
        .verification-card {
          background-color: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 40px 30px;
          margin: 30px 0;
          position: relative;
          text-align: center;
        }
        .verification-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #16a34a;
          border-radius: 4px 0 0 4px;
        }
        .code {
          font-size: 42px;
          font-weight: bold;
          color: #16a34a;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          display: inline-block;
          padding: 20px 40px;
          border-radius: 12px;
          letter-spacing: 8px;
          margin: 25px 0;
          border: 2px solid #bbf7d0;
          font-family: 'Courier New', monospace;
        }
        .info {
          background-color: #f1f5f9;
          border-radius: 10px;
          padding: 20px;
          margin: 25px 0;
          text-align: center;
        }
        .info-title {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-detail {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 4px;
        }
        .action-section {
          text-align: center;
          margin: 35px 0 25px 0;
          padding-top: 25px;
          border-top: 1px solid #f1f5f9;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #16a34a, #138c3e);
          color: #ffffff !important;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none !important;
          text-align: center;
          box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(22, 163, 74, 0.4);
        }
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 8px;
        }
        .security-notice {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class='email-wrapper'>
        <div class='header'>
          <div class='logo'>Intellecta</div>
          <div class='header-title'>Verificação de E-mail</div>
          <div class='header-subtitle'>Ativação da Conta</div>
        </div>
        
        <div class='content'>
          <div class='greeting'>
            Olá, <strong>{$userName}</strong>!
          </div>
          
          <div class='message'>
            Seja bem-vindo(a) à nossa plataforma de ensino digital!<br>
            Para finalizar o seu cadastro, utilize o código de verificação abaixo:
          </div>
          
          <div class='verification-card'>
            <div class='code'>{$code}</div>
          </div>
          
          <div class='info'>
            <div class='info-title'>Informações Importantes</div>
            <div class='info-detail'>Este código é válido por 5 minutos</div>
            <div class='info-detail'>Mantenha seu código em segredo</div>
            <div class='info-detail'>Não compartilhe com outras pessoas</div>
          </div>
          
          <div class='action-section'>
            <div class='message'>
              Copie o código acima e cole na tela de verificação da plataforma.
            </div>
            <a href='{$this->platformUrl}' class='button'>
              Acessar Plataforma
            </a>
          </div>
        </div>
        
        <div class='footer'>
          <div class='footer-text'>
            &copy; {$currentYear} IFPR - Intellecta. Todos os direitos reservados.
          </div>
          <div class='security-notice'>
            Se você não solicitou este cadastro, pode ignorar esta mensagem com segurança.
          </div>
        </div>
      </div>
    </body>
    </html>
    ";
  }

  public function getInstitutionInvitationEmailTemplate(
    string $institutionName, 
    string $acceptLink
  ): string {
    $currentYear = date('Y');
    
    return "
    <html>
    <head>
      <meta charset='UTF-8'>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8fafc;
          padding: 40px 20px;
          color: #334155;
          line-height: 1.6;
        }
        .email-wrapper {
          max-width: 680px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, #16a34a, #138c3e);
          padding: 40px 30px 30px 30px;
          text-align: center;
          color: white;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 15px;
          letter-spacing: -0.5px;
        }
        .header-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
          opacity: 0.95;
        }
        .header-subtitle {
          font-size: 15px;
          opacity: 0.85;
          font-weight: 400;
        }
        .content {
          padding: 40px;
        }
        .message {
          font-size: 16px;
          color: #475569;
          margin-bottom: 25px;
          line-height: 1.6;
          text-align: center;
        }
        .institution-card {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          border-radius: 12px;
          padding: 30px;
          margin: 25px 0;
          border-left: 5px solid #16a34a;
          text-align: center;
        }
        .institution-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .institution-name {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 15px;
        }
        .institution-message {
          font-size: 16px;
          color: #475569;
          line-height: 1.6;
        }
        .benefits {
          background-color: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 25px;
          margin: 30px 0;
          position: relative;
        }
        .benefits::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #16a34a;
          border-radius: 4px 0 0 4px;
        }
        .benefits-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 15px;
          text-align: center;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
          color: #475569;
        }
        .benefit-icon {
          margin-right: 12px;
          font-size: 16px;
        }
        .action-section {
          text-align: center;
          margin: 35px 0 25px 0;
          padding-top: 25px;
          border-top: 1px solid #f1f5f9;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #16a34a, #138c3e);
          color: #ffffff !important;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none !important;
          text-align: center;
          box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(22, 163, 74, 0.4);
        }
        .security-info {
          background-color: #f1f5f9;
          border-radius: 10px;
          padding: 20px;
          margin: 25px 0;
          text-align: center;
        }
        .security-title {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .security-detail {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 4px;
        }
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 8px;
        }
        .security-notice {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class='email-wrapper'>
        <div class='header'>
          <div class='logo'>Intellecta</div>
          <div class='header-title'>Convite para Instituição</div>
          <div class='header-subtitle'>Junte-se à nossa comunidade educacional</div>
        </div>
        
        <div class='content'>
          <div class='message'>
            Você recebeu um convite para fazer parte de uma instituição em nossa plataforma.
          </div>
          
          <div class='institution-card'>
            <div class='institution-icon'>🏫</div>
            <div class='institution-name'>{$institutionName}</div>
            <div class='institution-message'>
              Clique no botão abaixo para aceitar o convite e se juntar a esta instituição.
            </div>
          </div>
          
          <div class='action-section'>
            <a href='{$acceptLink}' class='button'>
              Aceitar Convite
            </a>
          </div>
        </div>
        
        <div class='footer'>
          <div class='footer-text'>
            &copy; {$currentYear} IFPR - Intellecta. Todos os direitos reservados.
          </div>
          <div class='security-notice'>
            Caso você não reconheça esta instituição ou não queira aceitar o convite, 
            basta ignorar este e-mail.
          </div>
        </div>
      </div>
    </body>
    </html>
    ";
  }


  /**
   * Institutional Event Notification
   */
  public function getInstitutionalNotificationEmailTemplate(
    string $userName,
    Event $event,
    string $institutionName,
    string $institutionEmail,
  ): string {
      $eventStart = date('d/m/Y \à\s H:i', strtotime($event->getEventStart()));
      $eventEnd = date('d/m/Y \à\s H:i', strtotime($event->getEventEnd()));
      $notificationDate = date('d/m/Y \à\s H:i');
      $currentYear = date('Y');

      $eventDescription = trim($event->getDescription() ?? '');
      $descriptionSection = $eventDescription
        ? "<strong>Descrição:</strong> {$eventDescription}<br>"
        : "";

      $institutionDetails = "
        <div class='source-block'>
          <div class='source-header'>Instituição Organizadora</div>
          <div class='source-name'>{$institutionName}</div>
          <div class='source-detail'><strong>E-mail:</strong> {$institutionEmail}</div>
        </div>";

      return $this->buildNotificationTemplate([
        'userName' => $userName,
        'title' => 'Novo Evento Institucional',
        'intro' => "Você recebeu uma notificação sobre um <strong>evento institucional</strong> na plataforma Intellecta.",
        'accentColor' => '#16a34a',
        'eventTitle' => $event->getTitle(),
        'eventStart' => $eventStart,
        'eventEnd' => $eventEnd,
        'eventTypeLabel' => $event->getType(),
        'descriptionSection' => $descriptionSection,
        'notificationDate' => $notificationDate,
        'currentYear' => $currentYear,
        'sourceInfo' => $institutionDetails,
      ]);
  }

  /**
   * Institutional Event Updated Notification
   */
  public function getInstitutionalNotificationUpdatedEmailTemplate(
    string $userName,
    Event $event,
    string $institutionName,
    ?string $institutionEmail = null,
  ): string {
    $eventStart = date('d/m/Y \à\s H:i', strtotime($event->getEventStart()));
    $eventEnd = date('d/m/Y \à\s H:i', strtotime($event->getEventEnd()));
    $notificationDate = date('d/m/Y \à\s H:i');
    $currentYear = date('Y');

    $eventDescription = trim($event->getDescription() ?? '');
    $descriptionSection = $eventDescription
      ? "<strong>Descrição:</strong> {$eventDescription}<br>"
      : "";

    $institutionDetails = "
      <div class='source-block'>
        <div class='source-header'>Instituição Organizadora</div>
        <div class='source-name'>{$institutionName}</div>"
        . ($institutionEmail ? "<div class='source-detail'><strong>E-mail:</strong> {$institutionEmail}</div>" : "") .
      "</div>";

    return $this->buildNotificationTemplate([
      'userName' => $userName,
      'title' => 'Atualização de Evento Institucional',
      'intro' => "O seguinte <strong>evento institucional</strong> na plataforma Intellecta foi atualizado.",
      'accentColor' => '#f59e0b',
      'eventTitle' => $event->getTitle(),
      'eventStart' => $eventStart,
      'eventEnd' => $eventEnd,
      'eventTypeLabel' => $event->getType(),
      'descriptionSection' => $descriptionSection,
      'notificationDate' => $notificationDate,
      'currentYear' => $currentYear,
      'sourceInfo' => $institutionDetails,
    ]);
  }

  /**
   * Institutional Event Deleted Notification
   */
  public function getInstitutionalNotificationDeletedEmailTemplate(
    string $userName,
    Event $event,
    string $institutionName,
    string $institutionEmail,
  ): string {
    $eventStart = date('d/m/Y \à\s H:i', strtotime($event->getEventStart()));
    $eventEnd = date('d/m/Y \à\s H:i', strtotime($event->getEventEnd()));
    $notificationDate = date('d/m/Y \à\s H:i');
    $currentYear = date('Y');

    $institutionDetails = "
      <div class='source-block'>
        <div class='source-header'>Instituição Organizadora</div>
        <div class='source-name'>{$institutionName}</div>"
        . ($institutionEmail ? "<div class='source-detail'><strong>E-mail:</strong> {$institutionEmail}</div>" : "") .
      "</div>";

    return $this->buildNotificationTemplate([
      'userName' => $userName,
      'title' => 'Evento Institucional Removido',
      'intro' => "O seguinte <strong>evento institucional</strong> na plataforma Intellecta foi removido.",
      'accentColor' => '#dc2626',
      'eventTitle' => $event->getTitle(),
      'eventStart' => $eventStart,
      'eventEnd' => $eventEnd,
      'eventTypeLabel' => $event->getType(),
      'descriptionSection' => '',
      'notificationDate' => $notificationDate,
      'currentYear' => $currentYear,
      'sourceInfo' => $institutionDetails,
    ]);
  }

  /**
   * Subject Event Notification
   */
  public function getSubjectNotificationEmailTemplate(
    string $userName,
    Event $event,
    string $subjectName,
    string $professorName,
    string $professorEmail
  ): string {
    $eventStart = date('d/m/Y \à\s H:i', strtotime($event->getEventStart()));
    $eventEnd = date('d/m/Y \à\s H:i', strtotime($event->getEventEnd()));
    $notificationDate = date('d/m/Y \à\s H:i');
    $currentYear = date('Y');

    $eventDescription = trim($event->getDescription() ?? '');
    $descriptionSection = $eventDescription
      ? "<strong>Descrição:</strong> {$eventDescription}<br>"
      : "";

    $subjectDetails = "
      <div class='source-block subject'>
        <div class='source-header'>Evento de Disciplina</div>
        <div class='source-name'>{$subjectName}</div>
        <div class='source-detail'>
          <p><span><strong>Professor:</strong> {$professorName}</span></p>
          <p><span><strong>E-mail:</strong> {$professorEmail}</span></p>
        </div>
      </div>";

    return $this->buildNotificationTemplate([
      'userName' => $userName,
      'title' => 'Novo Evento de Disciplina',
      'intro' => "Você recebeu uma notificação sobre um <strong>evento de disciplina</strong> na plataforma Intellecta.",
      'accentColor' => '#2563eb',
      'eventTitle' => $event->getTitle(),
      'eventStart' => $eventStart,
      'eventEnd' => $eventEnd,
      'eventTypeLabel' => $event->getType(),
      'descriptionSection' => $descriptionSection,
      'notificationDate' => $notificationDate,
      'currentYear' => $currentYear,
      'sourceInfo' => $subjectDetails,
    ]);
  }

  /**
   * Subject Event Updated Notification
   */
  public function getSubjectNotificationUpdatedEmailTemplate(
    string $userName,
    Event $event,
    string $subjectName,
    string $professorName,
    string $professorEmail
  ): string {
    $eventStart = date('d/m/Y \à\s H:i', strtotime($event->getEventStart()));
    $eventEnd = date('d/m/Y \à\s H:i', strtotime($event->getEventEnd()));
    $notificationDate = date('d/m/Y \à\s H:i');
    $currentYear = date('Y');

    $eventDescription = trim($event->getDescription() ?? '');
    $descriptionSection = $eventDescription
      ? "<strong>Descrição:</strong> {$eventDescription}<br>"
      : "";

    $subjectDetails = "
      <div class='source-block subject'>
        <div class='source-header'>Evento de Disciplina</div>
        <div class='source-name'>{$subjectName}</div>
        <div class='source-detail'>
          <p><span><strong>Professor:</strong> {$professorName}</span></p>
          <p><span><strong>E-mail:</strong> {$professorEmail}</span></p>
        </div>
      </div>";

    return $this->buildNotificationTemplate([
      'userName' => $userName,
      'title' => 'Evento de Disciplina Atualizado',
      'intro' => "O seguinte <strong>evento de disciplina</strong> na plataforma Intellecta foi atualizado.",
      'accentColor' => '#f59e0b',
      'eventTitle' => $event->getTitle(),
      'eventStart' => $eventStart,
      'eventEnd' => $eventEnd,
      'eventTypeLabel' => $event->getType(),
      'descriptionSection' => $descriptionSection,
      'notificationDate' => $notificationDate,
      'currentYear' => $currentYear,
      'sourceInfo' => $subjectDetails,
    ]);
  }

  /**
   * Subject Event Deleted Notification
   */
  public function getSubjectNotificationDeletedEmailTemplate(
    string $userName,
    Event $event,
    string $subjectName,
    string $professorName,
    string $professorEmail
  ): string {
    $eventStart = date('d/m/Y \à\s H:i', strtotime($event->getEventStart()));
    $eventEnd = date('d/m/Y \à\s H:i', strtotime($event->getEventEnd()));
    $notificationDate = date('d/m/Y \à\s H:i');
    $currentYear = date('Y');

    $subjectDetails = "
      <div class='source-block subject'>
        <div class='source-header'>Evento de Disciplina</div>
        <div class='source-name'>{$subjectName}</div>
        <div class='source-detail'>
          <p><span><strong>Professor:</strong> {$professorName}</span></p>
          <p><span><strong>E-mail:</strong> {$professorEmail}</span></p>
        </div>
      </div>";

    return $this->buildNotificationTemplate([
      'userName' => $userName,
      'title' => 'Evento de Disciplina Removido',
      'intro' => "O seguinte <strong>evento de disciplina</strong> na plataforma Intellecta foi removido.",
      'accentColor' => '#dc2626',
      'eventTitle' => $event->getTitle(),
      'eventStart' => $eventStart,
      'eventEnd' => $eventEnd,
      'eventTypeLabel' => $event->getType(),
      'descriptionSection' => '',
      'notificationDate' => $notificationDate,
      'currentYear' => $currentYear,
      'sourceInfo' => $subjectDetails,
    ]);
  }

  /**
   * Shared base HTML structure for notifications (updated style)
   */
  private function buildNotificationTemplate(array $data): string
  {
      extract($data);
      $platformUrl = $this->platformUrl;
      
      // Format date information based on whether it's a single day or multi-day event
      $dateInfo = '';
      if ($eventStart === $eventEnd) {
          $dateInfo = "<div class='event-date'><strong>Data do Evento:</strong> {$eventStart}</div>";
      } else {
          $dateInfo = "
            <div class='event-date'><strong>Início:</strong> {$eventStart}</div>
            <div class='event-date'><strong>Término:</strong> {$eventEnd}</div>
          ";
      }
      
      return "
      <html>
      <head>
        <meta charset='UTF-8'>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            padding: 40px 20px;
            color: #334155;
            line-height: 1.6;
          }
          .email-wrapper {
            max-width: 680px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          }
          .header {
            background: linear-gradient(135deg, {$accentColor}, {$this->adjustColorBrightness($accentColor, -0.1)});
            padding: 40px 30px 30px 30px;
            text-align: center;
            color: white;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 15px;
            letter-spacing: -0.5px;
          }
          .header-title {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 8px;
            opacity: 0.95;
          }
          .header-subtitle {
            font-size: 15px;
            opacity: 0.85;
            font-weight: 400;
          }
          .content {
            padding: 40px;
          }
          .greeting {
            font-size: 18px;
            color: #1e293b;
            margin-bottom: 25px;
            font-weight: 500;
          }
          .intro-message {
            font-size: 16px;
            color: #475569;
            margin-bottom: 25px;
            line-height: 1.6;
          }
          .source-block {
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            border-left: 5px solid {$accentColor};
          }
          .source-header {
            font-size: 14px;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 8px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }
          .source-name {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 12px;
          }
          .source-detail {
            font-size: 14px;
            color: #475569;
            background-color: #ffffff;
            padding: 16px;
            border-radius: 8px;
            margin-top: 12px;
          }
          .source-detail p {
            margin: 8px 0;
          }
          .event-card {
            background-color: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            position: relative;
          }
          .event-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: {$accentColor};
            border-radius: 4px 0 0 4px;
          }
          .event-title {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 15px;
          }
          .event-details {
            font-size: 15px;
            color: #475569;
            line-height: 1.7;
          }
          .event-meta {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            border: 1px solid #f1f5f9;
          }
          .event-date {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 8px;
          }
          .event-type {
            display: inline-block;
            background: linear-gradient(135deg, {$accentColor}, {$this->adjustColorBrightness($accentColor, -0.1)});
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 15px;
            text-transform: capitalize;
            letter-spacing: 0.5px;
          }
          .action-section {
            text-align: center;
            margin: 35px 0 25px 0;
            padding-top: 25px;
            border-top: 1px solid #f1f5f9;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, {$accentColor}, {$this->adjustColorBrightness($accentColor, -0.1)});
            color: #ffffff !important;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            text-decoration: none !important;
            text-align: center;
            box-shadow: 0 4px 15px {$accentColor}40;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px {$accentColor}60;
          }
          .notification-info {
            font-size: 14px;
            color: #64748b;
            text-align: center;
            margin-top: 20px;
          }
          .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer-text {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 8px;
          }
          .security-notice {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class='email-wrapper'>
          <div class='header'>
            <div class='logo'>Intellecta</div>
            <div class='header-title'>{$title}</div>
            <div class='header-subtitle'>Notificação do Sistema</div>
          </div>
          
          <div class='content'>
            <div class='greeting'>
              Olá, <strong>{$userName}</strong>!
            </div>
            
            <div class='intro-message'>
              {$intro}
            </div>
            
            {$sourceInfo}
            
            <div class='event-card'>
              <div class='event-title'>{$eventTitle}</div>
              <div class='event-details'>
                {$descriptionSection}
              </div>
              
              <div class='event-meta'>
                {$dateInfo}
              </div>
              
              <div class='event-type'>{$this->formatEventType($eventTypeLabel)}</div>
            </div>
            
            <div class='action-section'>
              <a href='{$platformUrl}' class='button'>
                Acessar Plataforma
              </a>
            </div>
            
            <div class='notification-info'>
              Esta notificação foi enviada em {$notificationDate}.
            </div>
          </div>
          
          <div class='footer'>
            <div class='footer-text'>
              &copy; {$currentYear} IFPR - Intellecta. Todos os direitos reservados.
            </div>
            <div class='security-notice'>
              Esta é uma notificação automática. Por favor, não responda este e-mail.
            </div>
          </div>
        </div>
      </body>
      </html>
      ";
  }

  /**
   * Professor Forum Post Created Notification
   */
  public function getProfessorForumPostCreatedEmailTemplate(
    string $userName,
    ForumMessage $message,
    string $subjectName,
    string $professorName,
    string $professorEmail
  ): string {
    $messageDate = date('d/m/Y \à\s H:i', strtotime($message->getCreatedAt()));
    $currentYear = date('Y');
    
    return $this->buildForumMessageTemplate([
      'userName' => $userName,
      'title' => 'Nova Publicação no Fórum',
      'intro' => "O professor <strong>{$professorName}</strong> publicou uma nova mensagem no fórum da disciplina <strong>{$subjectName}</strong>.",
      'accentColor' => '#16a34a',
      'messageContent' => $message->getContent(),
      'messageDate' => $messageDate,
      'subjectName' => $subjectName,
      'professorName' => $professorName,
      'professorEmail' => $professorEmail,
      'currentYear' => $currentYear,
      'actionType' => 'created',
    ]);
  }

  /**
   * Professor Forum Post Updated Notification
   */
  public function getProfessorForumPostUpdatedEmailTemplate(
    string $userName,
    ForumMessage $message,
    string $subjectName,
    string $professorName,
    string $professorEmail
  ): string {
    $messageDate = date('d/m/Y \à\s H:i', strtotime($message->getCreatedAt()));
    $updatedDate = date('d/m/Y \à\s H:i', strtotime($message->getChangedAt()));
    $currentYear = date('Y');
    
    return $this->buildForumMessageTemplate([
      'userName' => $userName,
      'title' => 'Publicação Atualizada no Fórum',
      'intro' => "O professor <strong>{$professorName}</strong> atualizou uma mensagem no fórum da disciplina <strong>{$subjectName}</strong>.",
      'accentColor' => '#f59e0b',
      'messageContent' => $message->getContent(),
      'messageDate' => $messageDate,
      'updatedDate' => $updatedDate,
      'subjectName' => $subjectName,
      'professorName' => $professorName,
      'professorEmail' => $professorEmail,
      'currentYear' => $currentYear,
      'actionType' => 'updated',
    ]);
  }

  /**
   * Shared base template for forum messages
   */
  private function buildForumMessageTemplate(array $data): string
  {
    extract($data);
    $platformUrl = $this->platformUrl;
    
    // Build date information based on action type
    $dateInfo = '';
    if ($actionType === 'created') {
      $dateInfo = "<div class='message-date'><strong>Publicado em:</strong> {$messageDate}</div>";
    } else {
      $dateInfo = "
        <div class='message-date'><strong>Publicado originalmente em:</strong> {$messageDate}</div>
        <div class='message-date'><strong>Atualizado em:</strong> {$updatedDate}</div>
      ";
    }

    return "
    <html>
    <head>
      <meta charset='UTF-8'>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8fafc;
          padding: 40px 20px;
          color: #334155;
          line-height: 1.6;
        }
        .email-wrapper {
          max-width: 680px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        .header {
          background: linear-gradient(135deg, {$accentColor}, {$this->adjustColorBrightness($accentColor, -0.1)});
          padding: 40px 30px 30px 30px;
          text-align: center;
          color: white;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 15px;
          letter-spacing: -0.5px;
        }
        .header-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
          opacity: 0.95;
        }
        .header-subtitle {
          font-size: 15px;
          opacity: 0.85;
          font-weight: 400;
        }
        .content {
          padding: 40px;
        }
        .greeting {
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 25px;
          font-weight: 500;
        }
        .subject-card {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
          border-left: 5px solid {$accentColor};
        }
        .subject-name {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }
        .professor-info {
          font-size: 14px;
          color: #475569;
        }
        .message-card {
          background-color: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
          position: relative;
        }
        .message-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: {$accentColor};
          border-radius: 4px 0 0 4px;
        }
        .message-content {
          font-size: 15px;
          color: #475569;
          line-height: 1.7;
          white-space: pre-wrap;
        }
        .message-meta {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          border: 1px solid #f1f5f9;
        }
        .message-date {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
        }
        .action-section {
          text-align: center;
          margin: 35px 0 25px 0;
          padding-top: 25px;
          border-top: 1px solid #f1f5f9;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, {$accentColor}, {$this->adjustColorBrightness($accentColor, -0.1)});
          color: #ffffff !important;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none !important;
          text-align: center;
          box-shadow: 0 4px 15px {$accentColor}40;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px {$accentColor}60;
        }
        .contact-info {
          background-color: #f1f5f9;
          border-radius: 10px;
          padding: 20px;
          margin: 25px 0;
          text-align: center;
        }
        .contact-title {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .contact-detail {
          font-size: 15px;
          color: #334155;
          margin-bottom: 4px;
        }
        .footer {
          background-color: #f8fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-text {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 8px;
        }
        .security-notice {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class='email-wrapper'>
        <div class='header'>
          <div class='logo'>Intellecta</div>
          <div class='header-title'>{$title}</div>
          <div class='header-subtitle'>Fórum de Disciplina</div>
        </div>
        
        <div class='content'>
          <div class='greeting'>
            Olá, <strong>{$userName}</strong>!
          </div>
          
          <div class='subject-card'>
            <div class='subject-name'>{$subjectName}</div>
            <div class='professor-info'>
              Professor: <strong>{$professorName}</strong>
            </div>
          </div>
          
          <div class='message-card'>
            <div class='message-content'>{$messageContent}</div>
            
            <div class='message-meta'>
              {$dateInfo}
            </div>
          </div>
          
          <div class='contact-info'>
            <div class='contact-title'>Informações de Contato</div>
            <div class='contact-detail'><strong>Professor:</strong> {$professorName}</div>
            <div class='contact-detail'><strong>E-mail:</strong> {$professorEmail}</div>
          </div>
          
          <div class='action-section'>
            <a href='{$platformUrl}/subjects/" . ($data['subjectId'] ?? '') . "' class='button'>
              Acessar Fórum da Disciplina
            </a>
          </div>
        </div>
        
        <div class='footer'>
          <div class='footer-text'>
            &copy; {$currentYear} IFPR - Intellecta. Todos os direitos reservados.
          </div>
          <div class='security-notice'>
            Esta é uma notificação automática. Por favor, não responda este e-mail.
          </div>
        </div>
      </div>
    </body>
    </html>
    ";
  }

  /**
   * Método auxiliar para formatar os tipos de evento em português
   */
  private function formatEventType(string $eventType): string {
    $typeMap = [
      'exam' => 'prova',
      'quiz' => 'questionário',
      'assignment' => 'trabalho',
      'lecture' => 'aula',
      'workshop' => 'workshop',
      'seminar' => 'seminário',
      'presentation' => 'apresentação',
      'deadline' => 'prazo',
      'holiday' => 'feriado',
      'announcement' => 'anúncio',
      'cultural' => 'evento cultural',
      'sports' => 'evento esportivo',
      'other' => 'outro'
    ];
    
    return $typeMap[$eventType] ?? $eventType;
  }

  /**
   * Ajusta a luminosidade de uma cor hexadecimal.
   * $percent < 0 escurece, > 0 clareia.
   */
  private function adjustColorBrightness(string $hex, float $percent): string {
    $hex = ltrim($hex, '#');

    if (strlen($hex) === 3) {
        $hex = preg_replace('/(.)/', '$1$1', $hex);
    }

    $r = hexdec(substr($hex, 0, 2));
    $g = hexdec(substr($hex, 2, 2));
    $b = hexdec(substr($hex, 4, 2));

    $r = max(0, min(255, $r + ($r * $percent)));
    $g = max(0, min(255, $g + ($g * $percent)));
    $b = max(0, min(255, $b + ($b * $percent)));

    return sprintf("#%02x%02x%02x", $r, $g, $b);
  }
}
