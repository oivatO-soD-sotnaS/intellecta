<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: "Notificações",
    description: "Endpoints para gerenciar notificações do usuário."
)]
class NotificationsController {
    #[OA\Get(
        path: "/users/me/notifications",
        summary: "Obter notificações do usuário",
        description: "Recupera as notificações para o usuário autenticado, opcionalmente filtradas e paginadas.",
        tags: ["Notificações"],
        parameters: [
            new OA\Parameter(name: "limit", in: "query", required: true, schema: new OA\Schema(type: "integer", enum: [10, 15, 20, 25, 30, 35, 40, 45, 50]), description: "Número de resultados por página"),
            new OA\Parameter(name: "offset", in: "query", required: true, schema: new OA\Schema(type: "integer", minimum: 0), description: "Deslocamento para paginação"),
            new OA\Parameter(name: "event_description", in: "query", required: false, schema: new OA\Schema(type: "string"), description: "Filtrar pela substring de descrição do evento"),
            new OA\Parameter(name: "seen", in: "query", required: false, schema: new OA\Schema(type: "boolean"), description: "Filtrar pelo status de visualização"),
            new OA\Parameter(name: "title", in: "query", required: false, schema: new OA\Schema(type: "string"), description: "Filtrar pela substring do título"),
            new OA\Parameter(name: "event_type", in: "query", required: false, schema: new OA\Schema(type: "string"), description: "Filtrar por tipo de evento"),
            new OA\Parameter(name: "event_date", in: "query", required: false, schema: new OA\Schema(type: "string", format: "date"), description: "Filtrar por data do evento"),
            new OA\Parameter(name: "created_at_from", in: "query", required: false, schema: new OA\Schema(type: "string", format: "date"), description: "Filtrar pela data de criação (a partir de)"),
            new OA\Parameter(name: "created_at_to", in: "query", required: false, schema: new OA\Schema(type: "string", format: "date"), description: "Filtrar pela data de criação (até)")
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista paginada de notificações",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "page", type: "integer", example: 1),
                        new OA\Property(property: "total_pages", type: "integer", example: 5),
                        new OA\Property(property: "total_records", type: "integer", example: 42),
                        new OA\Property(
                            property: "data",
                            type: "array",
                            items: new OA\Items(
                                type: "object",
                                properties: [
                                    new OA\Property(property: "id", type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000"),
                                    new OA\Property(property: "title", type: "string", example: "Nova mensagem recebida"),
                                    new OA\Property(property: "content", type: "string", example: "Você tem uma nova mensagem no fórum"),
                                    new OA\Property(property: "seen", type: "boolean", example: false),
                                    new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2024-01-15T10:30:00Z"),
                                    new OA\Property(property: "event_type", type: "string", example: "FORUM_MESSAGE")
                                ]
                            )
                        )
                    ]
                )
            ),
            new OA\Response(response: 404, description: "Nenhuma notificação encontrada"),
            new OA\Response(response: 400, description: "Parâmetros inválidos")
        ]
    )]
    public function getUserNotifications() {
    }

    #[OA\Patch(
        path: "/users/me/notifications/{notification_id}/set-as-seen",
        summary: "Marcar notificação como vista",
        description: "Marcar uma notificação específica como vista para o usuário autenticado.",
        tags: ["Notificações"],
        parameters: [
            new OA\Parameter(name: "notification_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "UUID da notificação")
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Notificação marcada como vista",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Notificação marcada como vista.")
                    ]
                )
            ),
            new OA\Response(response: 404, description: "Notificação não encontrada")
        ]
    )]
    public function setNotificationAsSeen() {
    }
}