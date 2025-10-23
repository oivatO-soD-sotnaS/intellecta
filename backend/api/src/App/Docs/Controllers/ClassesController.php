<?php
namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: "Turmas",
    description: "Operações relacionadas ao gerenciamento de turmas"
)]
class ClassesController
{
    #[OA\Get(
        path: "/institutions/{institution_id}/classes",
        tags: ["Turmas"],
        summary: "Obter turmas da instituição",
        description: "Recupera turmas para uma instituição (todas as turmas para administradores, apenas turmas participantes para outros)",
        operationId: "getInstitutionClasses",
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
                description: "Lista de turmas",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/ClassModelDto")
                )
            ),
            new OA\Response(
                response: 404,
                description: "Nenhuma turma encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function getInstitutionClasses(){}

    #[OA\Post(
        path: "/institutions/{institution_id}/classes",
        tags: ["Turmas"],
        summary: "Criar uma nova turma",
        description: "Cria uma nova turma na instituição especificada",
        operationId: "createClass",
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
            description: "Dados para criação da turma",
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["name", "description"],
                    properties: [
                        new OA\Property(
                            property: "name",
                            type: "string",
                            description: "Nome da turma",
                            minLength: 3,
                            maxLength: 255
                        ),
                        new OA\Property(
                            property: "description",
                            type: "string",
                            description: "Descrição detalhada da turma"
                        ),
                        new OA\Property(
                            property: "profile-picture",
                            type: "string",
                            format: "binary",
                            description: "Arquivo de foto de perfil",
                            nullable: true
                        ),
                        new OA\Property(
                            property: "banner",
                            type: "string",
                            format: "binary",
                            description: "Arquivo de imagem do banner",
                            nullable: true
                        )
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Detalhes da turma criada",
                content: new OA\JsonContent(ref: "#/components/schemas/ClassModelDto")
            ),
            new OA\Response(
                response: 400,
                description: "Entrada inválida",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function createClass()
    {
    }

    #[OA\Get(
        path: "/institutions/{institution_id}/classes/{class_id}",
        tags: ["Turmas"],
        summary: "Obter detalhes da turma",
        description: "Recupera os detalhes de uma turma específica",
        operationId: "getClassById",
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
                name: "class_id",
                in: "path",
                required: true,
                description: "ID da turma",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Detalhes da turma",
                content: new OA\JsonContent(ref: "#/components/schemas/ClassModelDto")
            ),
            new OA\Response(
                response: 404,
                description: "Turma não encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function getClassById()
    {
    }

    #[OA\Put(
        path: "/institutions/{institution_id}/classes/{class_id}",
        tags: ["Turmas"],
        summary: "Atualizar uma turma",
        description: "Atualiza os detalhes de uma turma existente",
        operationId: "updateClass",
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
                name: "class_id",
                in: "path",
                required: true,
                description: "ID da turma",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        requestBody: new OA\RequestBody(
            description: "Dados para atualização da turma",
            required: true,
            content: new OA\JsonContent(
                required: ["name", "description"],
                properties: [
                    new OA\Property(
                        property: "name",
                        type: "string",
                        description: "Nome atualizado da turma",
                        minLength: 3,
                        maxLength: 255
                    ),
                    new OA\Property(
                        property: "description",
                        type: "string",
                        description: "Descrição atualizada da turma"
                    ),
                    new OA\Property(
                        property: "profile_picture_id",
                        type: "string",
                        format: "uuid",
                        description: "ID da nova foto de perfil",
                        nullable: true
                    ),
                    new OA\Property(
                        property: "banner_id",
                        type: "string",
                        format: "uuid",
                        description: "ID da nova imagem do banner",
                        nullable: true
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Detalhes da turma atualizada",
                content: new OA\JsonContent(ref: "#/components/schemas/ClassModelDto")
            ),
            new OA\Response(
                response: 400,
                description: "Entrada inválida",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Turma ou arquivo não encontrado",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function updateClass()
    {
    }

    #[OA\Delete(
        path: "/institutions/{institution_id}/classes/{class_id}",
        tags: ["Turmas"],
        summary: "Excluir uma turma",
        description: "Exclui permanentemente uma turma",
        operationId: "deleteClass",
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
                name: "class_id",
                in: "path",
                required: true,
                description: "ID da turma a ser excluída",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Turma excluída com sucesso",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: "message",
                            type: "string",
                            description: "Mensagem de confirmação"
                        )
                    ],
                    type: "object"
                )
            ),
            new OA\Response(
                response: 404,
                description: "Turma não encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function deleteClass()
    {
    }
}