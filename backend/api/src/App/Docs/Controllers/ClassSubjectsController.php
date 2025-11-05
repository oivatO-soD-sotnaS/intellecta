<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Disciplinas da Classe',
    description: 'Gerenciar disciplinas dentro de uma classe'
)]
#[OA\Schema(
    schema: 'ClassSubjectResponse',
    properties: [
        new OA\Property(property: 'class_subjects_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'class_id', type: 'string', format: 'uuid'),
        new OA\Property(
            property: 'subject',
            ref: '#/components/schemas/SubjectResponse'
        )
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'AddSubjectToClassRequest',
    required: ['subject_id'],
    properties: [
        new OA\Property(
            property: 'subject_id',
            type: 'string',
            format: 'uuid',
            description: 'ID da disciplina a ser adicionada à classe'
        )
    ],
    type: 'object'
)]
class ClassSubjectsController
{
    #[OA\Get(
        path: '/institutions/{institution_id}/classes/{class_id}/subjects',
        operationId: 'getClassSubjects',
        summary: 'Obter todas as disciplinas de uma classe',
        tags: ['Disciplinas da Classe'],
        parameters: [
            new OA\Parameter(
                name: 'institution_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'class_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Lista de disciplinas da classe',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/ClassSubjectResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Classe não encontrada'
            )
        ]
    )]
    public function getClassSubjects()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/classes/{class_id}/subjects',
        operationId: 'addSubjectToClass',
        summary: 'Adicionar uma disciplina a uma classe',
        description: 'Vincula uma disciplina a uma classe específica',
        tags: ['Disciplinas da Classe'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'institution_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'class_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        requestBody: new OA\RequestBody(
            description: 'Disciplina a ser adicionada à classe',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/AddSubjectToClassRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Disciplina vinculada com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string'),
                        new OA\Property(
                            property: 'class_subject',
                            ref: '#/components/schemas/ClassSubjectResponse'
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
                description: 'Disciplina não encontrada'
            )
        ]
    )]
    public function addSubjectToClass()
    {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/classes/{class_id}/subjects/{class_subject_id}',
        operationId: 'getClassSubjectById',
        summary: 'Obter uma disciplina específica da classe',
        description: 'Recuperar detalhes de um relacionamento específico entre disciplina e classe',
        tags: ['Disciplinas da Classe'],
        parameters: [
            new OA\Parameter(
                name: 'institution_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'class_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'class_subject_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Detalhes da disciplina da classe',
                content: new OA\JsonContent(ref: '#/components/schemas/ClassSubjectResponse')
            ),
            new OA\Response(
                response: 404,
                description: 'Disciplina da classe não encontrada'
            )
        ]
    )]
    public function getClassSubjectById()
    {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/classes/{class_id}/subjects/{class_subject_id}',
        operationId: 'removeSubjectFromClass',
        summary: 'Remover uma disciplina de uma classe',
        description: 'Desvincula uma disciplina de uma classe específica',
        tags: ['Disciplinas da Classe'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'institution_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'class_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'class_subject_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Disciplina removida com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Disciplina da classe não encontrada'
            ),
            new OA\Response(
                response: 500,
                description: 'Erro interno do servidor'
            )
        ]
    )]
    public function removeSubjectFromClass()
    {
    }
}
