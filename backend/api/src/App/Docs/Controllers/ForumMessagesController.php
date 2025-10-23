<?php
declare(strict_types= 1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: "Mensagens do Fórum",
    description: "Endpoints para gerenciar mensagens do fórum relacionadas a um assunto."
)]
readonly class ForumMessagesController {

    #[OA\Get(
        path: "/institutions/{institution_id}/subjects/{subject_id}/forum/messages",
        summary: "Obter mensagens do fórum para um assunto",
        description: "Recupera mensagens do fórum para um assunto, opcionalmente filtradas e paginadas.",
        tags: ["Mensagens do Fórum"],
        parameters: [
            new OA\Parameter(name: "institution_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "UUID da Instituição"),
            new OA\Parameter(name: "subject_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "UUID do Assunto"),
            new OA\Parameter(name: "content", in: "query", required: false, schema: new OA\Schema(type: "string"), description: "Filtrar por substring do conteúdo"),
            new OA\Parameter(name: "created_at_from", in: "query", required: false, schema: new OA\Schema(type: "string", format: "date"), description: "Filtrar pela data de criação (início)"),
            new OA\Parameter(name: "created_at_to", in: "query", required: false, schema: new OA\Schema(type: "string", format: "date"), description: "Filtrar pela data de criação (fim)"),
            new OA\Parameter(name: "limit", in: "query", required: false, schema: new OA\Schema(type: "integer", enum: [10, 15, 20, 25, 30, 35, 40, 45, 50]), description: "Número de resultados por página"),
            new OA\Parameter(name: "offset", in: "query", required: false, schema: new OA\Schema(type: "integer", minimum: 0), description: "Deslocamento para paginação")
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista paginada de mensagens do fórum",
                content: new OA\JsonContent(ref: "#/components/schemas/PaginationDto_ForumMessageDto")
            ),
            new OA\Response(response: 404, description: "Nenhuma mensagem do fórum encontrada"),
            new OA\Response(response: 400, description: "Parâmetros inválidos")
        ]
    )]
    public function getSubjectForumMessages() { /* ... */ }

    #[OA\Get(
        path: "/institutions/{institution_id}/subjects/{subject_id}/forum/messages/count",
        summary: "Contar mensagens do fórum para um assunto",
        description: "Retorna o número total de mensagens do fórum para um assunto, opcionalmente filtrado.",
        tags: ["Mensagens do Fórum"],
        parameters: [
            new OA\Parameter(name: "institution_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "UUID da Instituição"),
            new OA\Parameter(name: "subject_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "UUID do Assunto"),
            new OA\Parameter(name: "content", in: "query", required: false, schema: new OA\Schema(type: "string"), description: "Filtrar por substring do conteúdo"),
            new OA\Parameter(name: "created_at_from", in: "query", required: false, schema: new OA\Schema(type: "string", format: "date"), description: "Filtrar pela data de criação (início)"),
            new OA\Parameter(name: "created_at_to", in: "query", required: false, schema: new OA\Schema(type: "string", format: "date"), description: "Filtrar pela data de criação (fim)")
        ],
        responses: [
            new OA\Response(response: 200, description: "Contagem de mensagens do fórum", content: new OA\JsonContent(
                type: "object",
                properties: [
                    new OA\Property(property: "count", type: "integer", example: 5)
                ]
            ))
        ]
    )]
    public function countSubjectForumMessages() { /* ... */ }

    #[OA\Post(
        path: "/institutions/{institution_id}/subjects/{subject_id}/forum/messages",
        summary: "Criar uma mensagem do fórum",
        description: "Cria uma nova mensagem do fórum para um assunto.",
        tags: ["Mensagens do Fórum"],
        parameters: [
            new OA\Parameter(name: "institution_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "UUID da Instituição"),
            new OA\Parameter(name: "subject_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "UUID do Assunto")
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["content"],
                properties: [
                    new OA\Property(property: "content", type: "string", example: "Este é o conteúdo da mensagem do fórum")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Mensagem do fórum criada", content: new OA\JsonContent(ref: "#/components/schemas/ForumMessageDto")),
            new OA\Response(response: 500, description: "Falha ao criar a mensagem do fórum")
        ]
    )]
    public function createSubjectForumMessage() { /* ... */ }

    #[OA\Put(
        path: "/institutions/{institution_id}/subjects/{subject_id}/forum/messages/{forum_message_id}",
        summary: "Atualizar uma mensagem do fórum",
        description: "Atualiza uma mensagem do fórum se tiver menos de 15 minutos.",
        tags: ["Mensagens do Fórum"],
        parameters: [
            new OA\Parameter(name: "institution_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "UUID da Instituição"),
            new OA\Parameter(name: "subject_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "UUID do Assunto"),
            new OA\Parameter(name: "forum_message_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "UUID da mensagem do fórum")
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["content"],
                properties: [
                    new OA\Property(property: "content", type: "string", example: "Conteúdo atualizado da mensagem do fórum")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Mensagem do fórum atualizada", content: new OA\JsonContent(ref: "#/components/schemas/ForumMessageDto")),
            new OA\Response(response: 403, description: "A mensagem do fórum não pode ser atualizada após 15 minutos"),
            new OA\Response(response: 404, description: "Mensagem do fórum não encontrada"),
            new OA\Response(response: 500, description: "Falha ao atualizar a mensagem do fórum")
        ]
    )]
    public function updateForumMessage() { /* ... */ }
}
