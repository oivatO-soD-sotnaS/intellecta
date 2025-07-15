<?php
namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(name: "Eventos Institucionais", description: "Operações relacionadas a eventos institucionais")]
class InstitutionalEventController {
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
  public function getInstitutionalEvents() {}

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
  public function createInstitutionalEvent() {}

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
  public function updateInstitutionalEvent() {}

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
  public function deleteInstitutionalEvent() {}

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
  public function getInstitutionalEvent() {}
}
