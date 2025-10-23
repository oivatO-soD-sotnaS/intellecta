<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Materiais da Disciplina',
    description: 'Gerenciar materiais de aprendizagem para disciplinas'
)]
#[OA\Schema(
    schema: 'MaterialResponse',
    properties: [
        new OA\Property(property: 'material_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'title', type: 'string'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'changed_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'subject_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'file_id', type: 'string', format: 'uuid'),
        new OA\Property(
            property: 'file',
            ref: '#/components/schemas/FileResponse'
        )
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'CreateMaterialRequest',
    required: ['title'],
    properties: [
        new OA\Property(
            property: 'title',
            type: 'string',
            minLength: 3,
            maxLength: 255,
            description: 'Título do material'
        ),
        new OA\Property(
            property: 'material_file',
            type: 'string',
            format: 'binary',
            description: 'Arquivo do material para envio'
        )
    ]
)]
#[OA\Schema(
    schema: 'UpdateMaterialRequest',
    required: ['title'],
    properties: [
        new OA\Property(
            property: 'title',
            type: 'string',
            minLength: 3,
            maxLength: 255,
            description: 'Título atualizado do material'
        )
    ]
)]
class SubjectMaterialsController
{
    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/materials',
        operationId: 'getSubjectMaterials',
        summary: 'Obter todos os materiais de uma disciplina',
        tags: ['Materiais da Disciplina'],
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
                description: 'Lista de materiais da disciplina',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/MaterialResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Nenhum material encontrado para esta disciplina'
            )
        ]
    )]
    public function getSubjectMaterials()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects/{subject_id}/materials',
        operationId: 'createSubjectMaterial',
        summary: 'Criar um novo material para uma disciplina',
        description: 'Enviar um novo material de aprendizagem para a disciplina especificada',
        tags: ['Materiais da Disciplina'],
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
            description: 'Dados para criação do material',
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/CreateMaterialRequest')
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Material criado com sucesso',
                content: new OA\JsonContent(ref: '#/components/schemas/MaterialResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'Entrada inválida'
            ),
            new OA\Response(
                response: 404,
                description: 'Disciplina não encontrada'
            )
        ]
    )]
    public function createSubjectMaterial()
    {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/materials/{material_id}',
        operationId: 'getMaterialById',
        summary: 'Obter detalhes do material',
        description: 'Recuperar detalhes de um material de aprendizagem específico',
        tags: ['Materiais da Disciplina'],
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
                name: 'material_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Detalhes do material',
                content: new OA\JsonContent(ref: '#/components/schemas/MaterialResponse')
            ),
            new OA\Response(
                response: 404,
                description: 'Material não encontrado'
            )
        ]
    )]
    public function getMaterialById()
    {
    }

    #[OA\Put(
        path: '/institutions/{institution_id}/subjects/{subject_id}/materials/{material_id}',
        operationId: 'updateMaterial',
        summary: 'Atualizar detalhes do material',
        description: 'Atualizar o título de um material de aprendizagem',
        tags: ['Materiais da Disciplina'],
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
                name: 'material_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        requestBody: new OA\RequestBody(
            description: 'Dados para atualização do material',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UpdateMaterialRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Material atualizado com sucesso',
                content: new OA\JsonContent(ref: '#/components/schemas/MaterialResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'Entrada inválida'
            ),
            new OA\Response(
                response: 404,
                description: 'Material não encontrado'
            ),
            new OA\Response(
                response: 500,
                description: 'Erro interno do servidor'
            )
        ]
    )]
    public function updateMaterial()
    {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/subjects/{subject_id}/materials/{material_id}',
        operationId: 'deleteMaterial',
        summary: 'Excluir um material',
        description: 'Remover permanentemente um material de aprendizagem',
        tags: ['Materiais da Disciplina'],
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
                name: 'material_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Material excluído com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Material não encontrado'
            ),
            new OA\Response(
                response: 500,
                description: 'Erro interno do servidor'
            )
        ]
    )]
    public function deleteMaterial()
    {
    }
}