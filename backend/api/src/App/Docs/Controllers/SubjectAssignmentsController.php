<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Atribuições de Matéria',
    description: 'Gerencia as atribuições das matérias'
)]
#[OA\Schema(
    schema: 'AssignmentResponse',
    properties: [
        new OA\Property(property: 'assignment_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'title', type: 'string', description: 'Título da atribuição'),
        new OA\Property(property: 'description', type: 'string', description: 'Descrição da atribuição'),
        new OA\Property(property: 'deadline', type: 'string', format: 'date-time', description: 'Data de vencimento da atribuição'),
        new OA\Property(property: 'subject_id', type: 'string', format: 'uuid', description: 'ID da matéria'),
        new OA\Property(property: 'attachment_id', type: 'string', format: 'uuid', nullable: true, description: 'ID do arquivo anexo, se houver'),
        new OA\Property(
            property: 'attachment',
            ref: '#/components/schemas/FileResponse',
            nullable: true,
            description: 'Dados do arquivo anexo, se houver'
        )
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'CreateAssignmentRequest',
    required: ['title', 'description', 'deadline'],
    properties: [
        new OA\Property(
            property: 'title',
            type: 'string',
            minLength: 3,
            maxLength: 255,
            description: 'Título da atribuição'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            description: 'Descrição detalhada da atribuição'
        ),
        new OA\Property(
            property: 'deadline',
            type: 'string',
            format: 'date-time',
            description: 'Data de vencimento da atribuição'
        ),
        new OA\Property(
            property: 'attachment',
            type: 'string',
            format: 'binary',
            description: 'Arquivo anexo opcional',
            nullable: true
        )
    ]
)]
#[OA\Schema(
    schema: 'UpdateAssignmentRequest',
    required: ['title', 'description', 'deadline'],
    properties: [
        new OA\Property(
            property: 'title',
            type: 'string',
            minLength: 3,
            maxLength: 255,
            description: 'Título atualizado da atribuição'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            description: 'Descrição atualizada da atribuição'
        ),
        new OA\Property(
            property: 'deadline',
            type: 'string',
            format: 'date-time',
            description: 'Data de vencimento atualizada da atribuição'
        ),
        new OA\Property(
            property: 'attachment_id',
            type: 'string',
            format: 'uuid',
            description: 'ID do novo arquivo anexo, se houver',
            nullable: true
        )
    ]
)]
class SubjectAssignmentsController
{
    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments',
        operationId: 'getSubjectAssignments',
        summary: 'Obter todas as atribuições de uma matéria',
        tags: ['Atribuições de Matéria'],
        parameters: [
            new OA\Parameter(
                name: 'institution_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'subject_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Lista de atribuições da matéria',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/AssignmentResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Nenhuma atribuição encontrada para esta matéria'
            )
        ]
    )]
    public function getSubjectAssignments()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments',
        operationId: 'createSubjectAssignment',
        summary: 'Criar uma nova atribuição',
        description: 'Cria uma nova atribuição para a matéria especificada com arquivo anexo opcional',
        tags: ['Atribuições de Matéria'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'institution_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'subject_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        requestBody: new OA\RequestBody(
            description: 'Dados para criação da atribuição',
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/CreateAssignmentRequest')
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Atribuição criada com sucesso',
                content: new OA\JsonContent(ref: '#/components/schemas/AssignmentResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'Entrada inválida'
            ),
            new OA\Response(
                response: 404,
                description: 'Matéria não encontrada'
            )
        ]
    )]
    public function createSubjectAssignment()
    {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}',
        operationId: 'getSubjectAssignmentById',
        summary: 'Obter detalhes da atribuição',
        description: 'Recupera os detalhes de uma atribuição específica',
        tags: ['Atribuições de Matéria'],
        parameters: [
            new OA\Parameter(
                name: 'institution_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'subject_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'assignment_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Detalhes da atribuição',
                content: new OA\JsonContent(ref: '#/components/schemas/AssignmentResponse')
            ),
            new OA\Response(
                response: 404,
                description: 'Atribuição não encontrada'
            )
        ]
    )]
    public function getSubjectAssignmentById()
    {
    }

    #[OA\Patch(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}',
        operationId: 'updateSubjectAssignment',
        summary: 'Atualizar uma atribuição',
        description: 'Atualiza os detalhes de uma atribuição existente',
        tags: ['Atribuições de Matéria'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'institution_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'subject_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'assignment_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        requestBody: new OA\RequestBody(
            description: 'Dados para atualização da atribuição',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UpdateAssignmentRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Atribuição atualizada com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', description: 'Mensagem de sucesso'),
                        new OA\Property(
                            property: 'assignment',
                            ref: '#/components/schemas/AssignmentResponse',
                            description: 'Dados atualizados da atribuição'
                        )
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 400,
                description: 'Entrada inválida'
            ),
            new OA\Response(
                response: 404,
                description: 'Atribuição não encontrada'
            ),
            new OA\Response(
                response: 500,
                description: 'Erro interno do servidor'
            )
        ]
    )]
    public function patchSubjectAssignmentById()
    {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}',
        operationId: 'deleteSubjectAssignment',
        summary: 'Excluir uma atribuição',
        description: 'Remove permanentemente uma atribuição',
        tags: ['Atribuições de Matéria'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'institution_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'subject_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'assignment_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Atribuição excluída com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', description: 'Mensagem de confirmação')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Atribuição não encontrada'
            ),
            new OA\Response(
                response: 500,
                description: 'Erro interno do servidor'
            )
        ]
    )]
    public function deleteSubjectAssignmentById()
    {
    }
}