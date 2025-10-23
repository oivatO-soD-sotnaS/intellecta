<?php
namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(name: "Usuários", description: "Operações relacionadas a gestão de usuários")]
class UserController { 
  #[OA\Get(
        path: "/users/me",
        tags: ["Usuários"],
        summary: "Obter dados do usuário",
        description: "Retorna os dados completos de um usuário específico (requer autenticação do próprio usuário)",
        operationId: "getUser",
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Dados do usuário",
                content: new OA\JsonContent(ref: "#/components/schemas/UserResponse")
            ),
            new OA\Response(
                response: 401,
                description: "Não autorizado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Usuário não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getUser() {}

  #[OA\Put(
        path: "/users/me",
        tags: ["Usuários"],
        summary: "Atualizar usuário",
        description: "Atualiza os dados de um usuário (requer autenticação do próprio usuário)",
        operationId: "updateUser",
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Dados do usuário para atualização",
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "full_name", type: "string", nullable: true, minLength: 3, maxLength: 255),
                    new OA\Property(property: "password", type: "string", format: "password", nullable: true, minLength: 8),
                    new OA\Property(property: "profile_picture_id", type: "string", format: "uuid", nullable: true)
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Usuário atualizado com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "User updated successfully"),
                        new OA\Property(property: "user", ref: "#/components/schemas/UserResponse")
                    ]
                )
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
                description: "Usuário não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function updateUser() {}

  #[OA\Delete(
        path: "/users/me",
        tags: ["Usuários"],
        summary: "Excluir usuário",
        description: "Remove permanentemente um usuário (requer autenticação do próprio usuário)",
        operationId: "deleteUser",
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Usuário excluído com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "User deleted successfully")
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
                description: "Usuário não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function deleteUser() {}
}