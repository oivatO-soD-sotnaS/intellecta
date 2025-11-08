<?php
namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: "Usuários da Instituição",
    description: "Operações relacionadas à gestão de usuários de instituições"
)]
class InstitutionUsersController
{
    // ... construtor permanece o mesmo ...

    #[OA\Get(
        path: "/institutions/{institution_id}/users",
        tags: ["Usuários da Instituição"],
        summary: "Obter usuários da instituição",
        description: "Retorna todos os usuários pertencentes a uma instituição específica",
        operationId: "getInstitutionUsers",
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
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de usuários da instituição",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/InstitutionUserDto")
                )
            ),
            new OA\Response(
                response: 401,
                description: "Não autorizado",
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
    public function getInstitutionUsers()
    {
        // ... implementação permanece a mesma ...
    }

    #[OA\Post(
        path: "/institutions/{institution_id}/users/invite",
        tags: ["Usuários da Instituição"],
        summary: "Convidar usuários para instituição",
        description: "Envia convites para usuários se juntarem à instituição",
        operationId: "inviteUsers",
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
            description: "Detalhes do convite",
            content: new OA\JsonContent(
                required: ["invites"],
                properties: [
                    new OA\Property(
                        property: "invites",
                        type: "array",
                        description: "Lista de e-mails para convidar",
                        items: new OA\Items(
                            type: "string",
                            format: "email",
                            example: "usuario@exemplo.com"
                        )
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Convites enviados com sucesso",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/InvitationResponse")
                )
            ),
            new OA\Response(
                response: 400,
                description: "Entrada inválida",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 401,
                description: "Não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 403,
                description: "Acesso negado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 422,
                description: "Erro de validação",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function inviteUsers()
    {
        // ... implementação permanece a mesma ...
    }

    #[OA\Patch(
        path: "/institutions/{institution_id}/users/{institution_user_id}/change-role",
        tags: ["Usuários da Instituição"],
        summary: "Alterar cargo do usuário na instituição",
        description: "Atualiza o cargo de um usuário dentro da instituição (apenas administradores)",
        operationId: "changeUserRole",
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
                name: "institution_user_id",
                in: "path",
                required: true,
                description: "ID do vínculo usuário-instituição",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Novo cargo para o usuário",
            content: new OA\JsonContent(
                required: ["new_role"],
                properties: [
                    new OA\Property(
                        property: "new_role",
                        type: "string",
                        enum: ["admin", "teacher", "student"],
                        description: "Novo cargo do usuário",
                        example: "teacher"
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Cargo alterado com sucesso",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionUserDto")
            ),
            new OA\Response(
                response: 400,
                description: "Dados inválidos",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 403,
                description: "Acesso negado - apenas administradores podem alterar cargos",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Usuário não encontrado na instituição",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 422,
                description: "Cargo inválido",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno ao atualizar cargo",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function changeUserRole()
    {
        // ... implementation ...
    }

    #[OA\Delete(
        path: "/institutions/{institution_id}/users/{institution_user_id}",
        tags: ["Usuários da Instituição"],
        summary: "Remover usuário da instituição",
        description: "Remove um usuário da instituição (apenas administradores ou o próprio usuário)",
        operationId: "removeUser",
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
                name: "institution_user_id",
                in: "path",
                required: true,
                description: "ID do vínculo usuário-instituição",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Usuário removido com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: "message",
                            type: "string",
                            example: "Usuário removido da instituição com sucesso"
                        )
                    ]
                )
            ),
            new OA\Response(
                response: 403,
                description: "Acesso negado - apenas administradores ou o próprio usuário podem remover",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Vínculo usuário-instituição não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno ao remover usuário",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function removeUser()
    {
        // ... implementation ...
    }
}

// Definições de esquemas (normalmente em arquivo separado)
#[OA\Schema(
    schema: "InstitutionUserDto",
    description: "DTO de usuário da instituição",
    properties: [
        new OA\Property(property: "institution_user_id", type: "string", format: "uuid", description: "ID do relacionamento"),
        new OA\Property(property: "institution_id", type: "string", format: "uuid", description: "ID da instituição"),
        new OA\Property(property: "user_id", type: "string", format: "uuid", description: "ID do usuário"),
        new OA\Property(property: "role", type: "string", enum: ["admin", "teacher", "student"], description: "Cargo do usuário"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", description: "Data de criação"),
        new OA\Property(
            property: "user",
            ref: "#/components/schemas/UserDto",
            description: "Dados do usuário"
        )
    ]
)]

#[OA\Schema(
    schema: "InvitationResponse",
    description: "Resposta de convite",
    properties: [
        new OA\Property(property: "invitation_id", type: "string", format: "uuid", description: "ID do convite"),
        new OA\Property(property: "email", type: "string", format: "email", description: "E-mail convidado"),
        new OA\Property(property: "role", type: "string", enum: ["admin", "teacher", "student"], description: "Cargo proposto"),
        new OA\Property(property: "token", type: "string", description: "Token de convite"),
        new OA\Property(property: "expires_at", type: "string", format: "date-time", description: "Data de expiração"),
        new OA\Property(property: "institution_id", type: "string", format: "uuid", description: "ID da instituição"),
        new OA\Property(property: "invited_by", type: "string", format: "uuid", description: "ID do usuário que convidou")
    ]
)]
class InstitutionUsersSchemas {}