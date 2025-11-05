<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Eventos de Disciplina',
    description: 'Gerencia eventos relacionados às disciplinas'
)]
#[OA\Schema(
    schema: 'SubjectEventResponse',
    properties: [
        new OA\Property(property: 'subject_event_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'subject_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'event_id', type: 'string', format: 'uuid'),
        new OA\Property(
            property: 'event',
            ref: '#/components/schemas/EventResponse'
        )
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'EventResponse',
    properties: [
        new OA\Property(property: 'event_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'title', type: 'string'),
        new OA\Property(property: 'description', type: 'string'),
        new OA\Property(property: 'event_date', type: 'string', format: 'date-time'),
        new OA\Property(
            property: 'type',
            type: 'string',
            enum: ['class', 'exam', 'assignment', 'holiday', 'other']
        )
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'CreateSubjectEventRequest',
    required: ['title', 'description', 'event_date', 'event_type'],
    properties: [
        new OA\Property(
            property: 'title',
            type: 'string',
            minLength: 3,
            maxLength: 255,
            description: 'Título do evento'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            description: 'Descrição detalhada do evento'
        ),
        new OA\Property(
            property: 'event_date',
            type: 'string',
            format: 'date-time',
            description: 'Data e hora do evento'
        ),
        new OA\Property(
            property: 'event_type',
            type: 'string',
            enum: ['class', 'exam', 'assignment', 'holiday', 'other'],
            description: 'Tipo do evento'
        )
    ],
    type: 'object'
)]
class SubjectEventsController
{
    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/events',
        operationId: 'getSubjectEvents',
        summary: 'Obter todos os eventos de uma disciplina',
        tags: ['Eventos de Disciplina'],
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
                description: 'Lista de eventos de disciplina',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/SubjectEventResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Nenhum evento encontrado para esta disciplina'
            )
        ]
    )]
    public function getSubjectEvents()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects/{subject_id}/events',
        operationId: 'createSubjectEvent',
        summary: 'Criar um novo evento de disciplina',
        description: 'Cria um novo evento associado a uma disciplina',
        tags: ['Eventos de Disciplina'],
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
            description: 'Dados para criação do evento',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/CreateSubjectEventRequest')
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Evento criado com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'Message', type: 'string'),
                        new OA\Property(
                            property: 'subject_event',
                            ref: '#/components/schemas/SubjectEventResponse'
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
            ),
            new OA\Response(
                response: 422,
                description: 'Tipo do evento inválido'
            )
        ]
    )]
    public function createSubjectEvent()
    {
    }

    #[OA\Put(
        path: '/institutions/{institution_id}/subjects/{subject_id}/events/{subject_event_id}',
        operationId: 'updateSubjectEvent',
        summary: 'Atualizar um evento de disciplina',
        description: 'Atualiza os detalhes de um evento de disciplina existente',
        tags: ['Eventos de Disciplina'],
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
                name: 'subject_event_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        requestBody: new OA\RequestBody(
            description: 'Dados para atualização do evento',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/CreateSubjectEventRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Evento atualizado com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'Message', type: 'string'),
                        new OA\Property(
                            property: 'subject_event',
                            ref: '#/components/schemas/SubjectEventResponse'
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
                description: 'Evento não encontrado'
            ),
            new OA\Response(
                response: 422,
                description: 'Tipo do evento inválido'
            )
        ]
    )]
    public function updateSubjectEvent()
    {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/subjects/{subject_id}/events/{subject_event_id}',
        operationId: 'deleteSubjectEvent',
        summary: 'Excluir um evento de disciplina',
        description: 'Remove permanentemente um evento de disciplina',
        tags: ['Eventos de Disciplina'],
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
                name: 'subject_event_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Evento excluído com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'Message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Evento não encontrado'
            ),
            new OA\Response(
                response: 500,
                description: 'Erro interno do servidor'
            )
        ]
    )]
    public function deleteSubjectEvent()
    {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/events/{subject_event_id}',
        operationId: 'getSubjectEvent',
        summary: 'Obter um evento de disciplina específico',
        description: 'Recupera os detalhes de um evento de disciplina específico',
        tags: ['Eventos de Disciplina'],
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
                name: 'subject_event_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Detalhes do evento',
                content: new OA\JsonContent(ref: '#/components/schemas/SubjectEventResponse')
            ),
            new OA\Response(
                response: 404,
                description: 'Evento não encontrado'
            )
        ]
    )]
    public function getSubjectEvent()
    {
    }
}