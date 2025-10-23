<?php
namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: "Convites",
    description: "Operações relacionadas aos convites de instituição"
)]
class InvitationsController
{
    #[OA\Post(
        path: "/invitations/{invitation_id}/accept",
        tags: ["Convites"],
        summary: "Aceitar um convite",
        description: "Aceitar um convite para ingressar em uma instituição",
        operationId: "acceptInvitation",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "invitation_id",
                in: "path",
                required: true,
                description: "ID do convite a ser aceito",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Convite aceito com sucesso",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionUserDto")
            ),
            new OA\Response(
                response: 403,
                description: "Proibido (convite expirado, já aceito ou email não correspondente)",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Convite não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function acceptInvitation()
    {
        // ... a implementação permanece igual ...
    }

    #[OA\Get(
        path: "/invitations/{invitation_id}",
        tags: ["Convites"],
        summary: "Obter detalhes do convite",
        description: "Recuperar detalhes de um convite específico",
        operationId: "getInvitation",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "invitation_id",
                in: "path",
                required: true,
                description: "ID do convite",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Detalhes do convite",
                content: new OA\JsonContent(ref: "#/components/schemas/InvitationDto")
            ),
            new OA\Response(
                response: 403,
                description: "Proibido (email não correspondente)",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Convite não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function getInvitation()
    {
        // ... a implementação permanece igual ...
    }

    #[OA\Get(
        path: "/invitations",
        tags: ["Convites"],
        summary: "Obter todos os convites",
        description: "Recuperar todos os convites para o usuário autenticado",
        operationId: "getAllInvitations",
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de convites",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/InvitationDto")
                )
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function getAllInvitations()
    {
        // ... a implementação permanece igual ...
    }
}

// Definições de esquema (geralmente em um arquivo separado)
#[OA\Schema(
    schema: "InvitationDto",
    properties: [
        new OA\Property(property: "invitation_id", type: "string", format: "uuid"),
        new OA\Property(property: "email", type: "string", format: "email"),
        new OA\Property(property: "role", type: "string", enum: ["admin", "teacher", "student"]),
        new OA\Property(property: "expires_at", type: "string", format: "date-time"),
        new OA\Property(property: "accepted_at", type: "string", format: "date-time", nullable: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "institution_id", type: "string", format: "uuid"),
        new OA\Property(property: "invited_by", type: "string", format: "uuid"),
        new OA\Property(
            property: "institution",
            ref: "#/components/schemas/InstitutionDto"
        ),
        new OA\Property(
            property: "invited_by_user",
            ref: "#/components/schemas/UserDto"
        )
    ]
)]
class InvitationsSchemas {}
