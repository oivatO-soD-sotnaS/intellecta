<?php
namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(name: "Eventos de Usuário", description: "Operações relacionadas a eventos de usuários")]
class UserEventController {
    #[OA\Get(
        path: "/users/events",
        tags: ["Eventos de Usuário"],
        summary: "Listar eventos do usuário",
        description: "Retorna todos os eventos associados ao usuário autenticado",
        operationId: "getUserEvents",
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de eventos do usuário",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/UserEventResponse")
                )
            ),
            new OA\Response(
                response: 401,
                description: "Não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Nenhum evento encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function getUserEvents() {}

    #[OA\Post(
        path: "/users/events",
        tags: ["Eventos de Usuário"],
        summary: "Criar novo evento",
        description: "Cria um novo evento associado ao usuário autenticado",
        operationId: "createUserEvent",
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Dados do evento a ser criado",
            content: new OA\JsonContent(ref: "#/components/schemas/CreateUserEventRequest")
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Evento criado com sucesso",
                content: new OA\JsonContent(ref: "#/components/schemas/UserEventCreatedResponse")
            ),
            new OA\Response(
                response: 400,
                description: "Dados inválidos",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 401,
                description: "Não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 422,
                description: "Validação falhou",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function createUserEvent() {}

    #[OA\Put(
        path: "/users/events/{event_id}",
        tags: ["Eventos de Usuário"],
        summary: "Atualizar evento",
        description: "Atualiza um evento existente do usuário autenticado",
        operationId: "updateUserEvent",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "event_id",
                in: "path",
                required: true,
                description: "ID do evento do usuário",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Dados do evento a serem atualizados",
            content: new OA\JsonContent(ref: "#/components/schemas/UpdateUserEventRequest")
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Evento atualizado com sucesso",
                content: new OA\JsonContent(ref: "#/components/schemas/UserEventUpdatedResponse")
            ),
            new OA\Response(
                response: 400,
                description: "Dados inválidos",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 401,
                description: "Não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Evento não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 422,
                description: "Validação falhou",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function updateUserEvent() {}

    #[OA\Delete(
        path: "/users/events/{event_id}",
        tags: ["Eventos de Usuário"],
        summary: "Excluir evento",
        description: "Remove um evento do usuário autenticado",
        operationId: "deleteUserEvent",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "event_id",
                in: "path",
                required: true,
                description: "ID do evento do usuário",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Evento excluído com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "Message", type: "string", example: "User event deleted successfully")
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: "Não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Evento não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function deleteUserEvent() {}

    #[OA\Get(
        path: "/users/events/{event_id}",
        tags: ["Eventos de Usuário"],
        summary: "Obter detalhes de um evento",
        description: "Retorna os detalhes de um evento específico do usuário autenticado",
        operationId: "getUserEvent",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "event_id",
                in: "path",
                required: true,
                description: "ID do evento do usuário",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Detalhes do evento",
                content: new OA\JsonContent(ref: "#/components/schemas/UserEventResponse")
            ),
            new OA\Response(
                response: 401,
                description: "Não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Evento não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function getUserEvent() {}
}
