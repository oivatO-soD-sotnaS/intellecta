<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Dao\EventDao;
use App\Dao\InstitutionalEventDao;
use App\Dao\InstitutionDao;
use App\Dao\UserDao;
use App\Dto\InstitutionalEventDto;
use App\Models\Event;
use App\Models\InstitutionalEvent;
use App\Models\InstitutionUser;
use App\Services\EmailService;
use App\Services\LogService;
use App\Vo\EventDateVo;
use App\Vo\EventDescriptionVo;
use App\Vo\EventTitleVo;
use Exception;
use InvalidArgumentException;
use PDOException;
use Ramsey\Uuid\Nonstandard\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Eventos Institucionais", description: "Operações relacionadas a eventos institucionais")]
class InstitutionalEventController {
  public function __construct(
    private InstitutionalEventDao $institutionalEventDao,
    private EventDao $eventDao,
    private UserDao $userDao,
    private InstitutionDao $institutionDao,
    private EmailService $emailService
  ) {}

  #[OA\Get(
        path: "/institutions/{institution_id}/events",
        tags: ["Eventos Institucionais"],
        summary: "Listar eventos institucionais",
        description: "Retorna todos os eventos de uma instituição específica",
        operationId: "getInstitutionalEvents",
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID da instituição",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de eventos institucionais",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/InstitutionalEventResponse")
                )
            ),
            new OA\Response(
                response: 404,
                description: "Instituição não encontrada ou sem eventos",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getInstitutionalEvents(Request $request, Response $response, string $institution_id) {
    try {
      $institutionalEvents = $this->institutionalEventDao->getAllInstitutionalEventsById($institution_id);

      if (empty($institutionalEvents)) {
        LogService::http404("/institutions/$institution_id/events", "No institutional events found for $institution_id");
        throw new HttpNotFoundException($request, "Institution does not have any events");
      }

      $data = array_map(function ($institutionalEvent) {
        $event = $this->eventDao->getEventById($institutionalEvent->getEventId());
        return new InstitutionalEventDto($institutionalEvent, $event);
      }, $institutionalEvents);

      $response->getBody()->write(json_encode($data));
      LogService::info("/institutions/$institution_id/events", "Institutional events successfully fetched for $institution_id");
      return $response;
    } catch (PDOException $e) {
      LogService::http500("/institutions/$institution_id/events", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not fetch institutional events due to a database error. See logs for more detail');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/institutions/$institution_id/events", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not fetch institutional events due to an unknown error. See logs for more detail');
    }
  }

  #[OA\Post(
        path: "/institutions/{institution_id}/events",
        tags: ["Eventos Institucionais"],
        summary: "Criar evento institucional",
        description: "Cria um novo evento associado a uma instituição (requer privilégios de admin)",
        operationId: "createInstitutionalEvent",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID da instituição",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Dados do evento a ser criado",
            content: new OA\JsonContent(ref: "#/components/schemas/CreateInstitutionalEventRequest")
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Evento criado com sucesso",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionalEventCreatedResponse")
            ),
            new OA\Response(
                response: 400,
                description: "Dados inválidos",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 403,
                description: "Acesso não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Instituição não encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function createInstitutionalEvent(Request $request, Response $response, string $institution_id) {
    /**
     * @var InstitutionUser $membership
    */
    $membership = $request->getAttribute('membership');
    
    if($membership->getRole() !== "admin") {
      LogService::http403("/institutions/$institution_id/events", "User {$membership->getUserId()} is not admin");
      throw new HttpForbiddenException($request, 'User must be admin of the institution');
    }

    $body = $request->getParsedBody();

    $title = $body['title'] ?? null;
    $description = $body['description'] ?? null;
    $eventDate = $body['event_date'] ?? null;
    $eventType = $body['event_type'] ?? null;

    if (empty($title) || empty($description) || empty($eventDate) || empty($eventType)) {
      LogService::http422("/institutions/$institution_id/events", "Missing parameters");
      throw new HttpException($request, "'title', 'description', 'event_date' and 'event_type' are required", 422);
    }

    try {
      $title = new EventTitleVo($title);
      $description = new EventDescriptionVo($description);
      $eventDate = new EventDateVo($eventDate);
    } catch (InvalidArgumentException $e) {
      LogService::http422("/institutions/$institution_id/events", $e->getMessage());
      throw new HttpException($request, $e->getMessage(), 422);
    }

    try {
      $institution = $this->institutionDao->getInstitutionById($institution_id);
      if (!$institution) {
        LogService::http404("/institutions/$institution_id/events", "Institution not found: " . $institution_id);
        throw new HttpNotFoundException($request, 'Institution not found');
      }

      $event = $this->eventDao->createEvent(new Event([
        'event_id' => Uuid::uuid4()->toString(),
        'title' => $title->getValue(),
        'description' => $description->getValue(),
        'event_date' => $eventDate->toString(),
        'type' => $eventType
      ]));

      $institutionalEvent = $this->institutionalEventDao->createInstitutionalEvent(new InstitutionalEvent([
        "institutional_event_id" => Uuid::uuid4()->toString(),
        "institution_id" => $institution->getInstitutionId(),
        "event_id" => $event->getEventId()
      ]
      ));

      $institutionalEventDto = new InstitutionalEventDto($institutionalEvent, $event);
      
      $response->getBody()->write(json_encode([
        "Message" => "Institutional event created successfully",
        "institutional_event" => $institutionalEventDto
      ]));

      return $response;
    } catch (PDOException $e) {
      LogService::http500("/institutions/$institution_id/events", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not fetch institutional events due to a database error. See logs for more detail');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/institutions/$institution_id/events", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not fetch institutional events due to an unknown error. See logs for more detail');
    }
  }

  #[OA\Put(
        path: "/institutions/{institution_id}/events/{event_id}",
        tags: ["Eventos Institucionais"],
        summary: "Atualizar evento institucional",
        description: "Atualiza um evento existente (requer privilégios de admin)",
        operationId: "updateInstitutionalEvent",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID da instituição",
                schema: new OA\Schema(type: "string", format: "uuid")
            ),
            new OA\Parameter(
                name: "event_id",
                in: "path",
                required: true,
                description: "ID do evento institucional",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Dados do evento a serem atualizados",
            content: new OA\JsonContent(ref: "#/components/schemas/UpdateInstitutionalEventRequest")
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Evento atualizado com sucesso",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionalEventResponse")
            ),
            new OA\Response(
                response: 400,
                description: "Dados inválidos",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 403,
                description: "Acesso não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Evento ou instituição não encontrados",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function updateInstitutionalEvent(Request $request, Response $response, string $institution_id, string $event_id) {
    /**
     * @var InstitutionUser $membership
    */
    $membership = $request->getAttribute('membership');
    
    if($membership->getRole() !== "admin") {
      LogService::http403("/institutions/$institution_id/events", "User {$membership->getUserId()} is not admin");
      throw new HttpForbiddenException($request, 'User must be admin of the institution');
    }

    $body = $request->getParsedBody();

    $title = $body['title'] ?? null;
    $description = $body['description'] ?? null;
    $eventDate = $body['event_date'] ?? null;
    $eventType = $body['event_type'] ?? null;

    if (empty($title) && empty($description) && empty($eventDate) && empty($eventType)) {
      LogService::http422("/users/events/$event_id", "No valid fields to update");
      throw new HttpException($request, "At least one field is required for update", 422);
    }

    try {
      if(!empty($title)) $title = new EventTitleVo($title);
      if(!empty($description)) $description = new EventDescriptionVo($description);
      if(!empty($eventDate)) $eventDate = new EventDateVo($eventDate);
    } catch (InvalidArgumentException $e) {
      LogService::http422("/institutions/$institution_id/events", $e->getMessage());
      throw new HttpException($request, $e->getMessage(), 422);
    }

    try {
      $institutionalEvent = $this->institutionalEventDao->getInstitutionalEventById($event_id);
      if (empty($institutionalEvent)) {
        LogService::http404("/institutions/$institution_id/events/$event_id", "Institutional event not found");
        throw new HttpNotFoundException($request, 'Institutional event not found');
      }

      if($institutionalEvent->getInstitutionId() !== $institution_id) {
        LogService::http404("/institutions/$institution_id/events/$event_id", "Event $event_id does not belong to institution $institution_id");
        throw new HttpNotFoundException($request, 'Event does not belong to the institution');
      }

      $event = $this->eventDao->getEventById($institutionalEvent->getEventId());
      if (empty($event)) {
        LogService::http404("/institutions/$institution_id/events/$event_id", "Event not found");
        throw new HttpNotFoundException($request, 'Event not found');
      }
      
      if(!empty($title)) {
        $event->setTitle($title->getValue());
      }
      if(!empty($description)) {
        $event->setDescription($description->getValue());
      }
      if(!empty($eventDate)) {
        $event->setEventDate($eventDate->toString());
      }

      $event->setType($eventType ?? $event->getType());

      $event = $this->eventDao->updateEvent($event);

      $institutionalEventDto = new InstitutionalEventDto($institutionalEvent, $event);
      
      $response->getBody()->write(json_encode([
        "Message" => "User event updated successfully",
        "user_event" => $institutionalEventDto
      ]));
      
      LogService::info("/institutions/$institution_id/events/$event_id", "Institutional event updated: $institutionalEvent");
      return $response;
    } catch (PDOException $e) {
      LogService::http500("/institutions/$institution_id/events/$event_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not fetch institutional events due to a database error. See logs for more detail');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/institutions/$institution_id/events/$event_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not fetch institutional events due to an unknown error. See logs for more detail');
    }
  }

  #[OA\Delete(
    path: "/institutions/{institution_id}/events/{event_id}",
    tags: ["Eventos Institucionais"],
    summary: "Excluir evento institucional",
    description: "Remove um evento institucional (requer privilégios de admin)",
    operationId: "deleteInstitutionalEvent",
    security: [["bearerAuth" => []]],
    parameters: [
        new OA\Parameter(
            name: "institution_id",
            in: "path",
            required: true,
            description: "ID da instituição",
            schema: new OA\Schema(type: "string", format: "uuid")
        ),
        new OA\Parameter(
            name: "event_id",
            in: "path",
            required: true,
            description: "ID do evento institucional",
            schema: new OA\Schema(type: "string", format: "uuid")
        )
    ],
    responses: [
        new OA\Response(
            response: 200,
            description: "Evento excluído com sucesso",
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "message", type: "string", example: "Institutional event deleted successfully")
                ]
            )
        ),
        new OA\Response(
            response: 403,
            description: "Acesso não autorizado",
            content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
        ),
        new OA\Response(
            response: 404,
            description: "Evento ou instituição não encontrados",
            content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
        ),
        new OA\Response(
            response: 500,
            description: "Erro interno do servidor",
            content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
        )
    ]
  )]
  public function deleteInstitutionalEvent(Request $request, Response $response, string $institution_id, string $event_id) {
    /**
     * @var InstitutionUser $membership
    */
    $membership = $request->getAttribute('membership');
    
    if($membership->getRole() !== "admin") {
      LogService::http403("/institutions/$institution_id/events", "User {$membership->getUserId()} is not admin");
      throw new HttpForbiddenException($request, 'User must be admin of the institution');
    }
    try {
      $institutionalEvent = $this->institutionalEventDao->getInstitutionalEventById($event_id);
      if (empty($institutionalEvent)) {
        LogService::http404("/institutions/$institution_id/events/$event_id", "Institutional event not found");
        throw new HttpNotFoundException($request, 'Institutional event not found');
      }

      if($institutionalEvent->getInstitutionId() !== $institution_id) {
        LogService::http404("/institutions/$institution_id/events/$event_id", "Event $event_id does not belong to institution $institution_id");
        throw new HttpNotFoundException($request, 'Event does not belong to the institution');
      }

      $event = $this->eventDao->getEventById($institutionalEvent->getEventId());
      if (empty($event)) {
        LogService::http404("/institutions/$institution_id/events/$event_id", "Event not found");
        throw new HttpNotFoundException($request, 'Event not found');
      }

      $this->eventDao->deleteEventById($event->getEventId());
      
      $response->getBody()->write(json_encode(["Message" => "Institutional event deleted successfully"]));
      return $response;
    } catch (PDOException $e) {
      LogService::http500("/institutions/$institution_id/events/$event_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not fetch institutional events due to a database error. See logs for more detail');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/institutions/$institution_id/events/$event_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not fetch institutional events due to an unknown error. See logs for more detail');
    }
  }

  #[OA\Get(
        path: "/institutions/{institution_id}/events/{event_id}",
        tags: ["Eventos Institucionais"],
        summary: "Obter detalhes de um evento institucional",
        description: "Retorna os detalhes completos de um evento institucional específico",
        operationId: "getInstitutionalEvent",
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID da instituição",
                schema: new OA\Schema(type: "string", format: "uuid")
            ),
            new OA\Parameter(
                name: "event_id",
                in: "path",
                required: true,
                description: "ID do evento institucional",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Detalhes do evento",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionalEventResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Evento ou instituição não encontrados",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getInstitutionalEvent(Request $request, Response $response, string $institution_id, string $event_id) {
    try {
      $institutionalEvent = $this->institutionalEventDao->getInstitutionalEventById($event_id);
      if (empty($institutionalEvent)) {
        LogService::http404("/institutions/$institution_id/events/$event_id", "Institutional event not found");
        throw new HttpNotFoundException($request, 'Institutional event not found');
      }

      if($institutionalEvent->getInstitutionId() !== $institution_id) {
        LogService::http404("/institutions/$institution_id/events/$event_id", "Event $event_id does not belong to institution $institution_id");
        throw new HttpNotFoundException($request, 'Event does not belong to the institution');
      }

      $event = $this->eventDao->getEventById($institutionalEvent->getEventId());
      if (empty($event)) {
        LogService::http404("/institutions/$institution_id/events/$event_id", "Event not found");
        throw new HttpNotFoundException($request, 'Event not found');
      }

      $institutionalEventDto = new InstitutionalEventDto($institutionalEvent, $event);
      $response->getBody()->write(json_encode($institutionalEventDto));

      return $response;
    } catch (PDOException $e) {
      LogService::http500("/institutions/$institution_id/events/$event_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not fetch institutional events due to a database error. See logs for more detail');
    } catch (HttpException $e) {
      throw $e;
    } catch (Exception $e) {
      LogService::http500("/institutions/$institution_id/events/$event_id", $e->getMessage());
      throw new HttpInternalServerErrorException($request, 'Could not fetch institutional events due to an unknown error. See logs for more detail');
    }
  }
}
