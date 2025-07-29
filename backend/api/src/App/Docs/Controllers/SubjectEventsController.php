<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Subject Events',
    description: 'Manage events related to subjects'
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
            description: 'Title of the event'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            description: 'Detailed description of the event'
        ),
        new OA\Property(
            property: 'event_date',
            type: 'string',
            format: 'date-time',
            description: 'Date and time of the event'
        ),
        new OA\Property(
            property: 'event_type',
            type: 'string',
            enum: ['class', 'exam', 'assignment', 'holiday', 'other'],
            description: 'Type of the event'
        )
    ],
    type: 'object'
)]
class SubjectEventsController
{
    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/events',
        operationId: 'getSubjectEvents',
        summary: 'Get all events for a subject',
        tags: ['Subject Events'],
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
                description: 'List of subject events',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/SubjectEventResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'No events found for this subject'
            )
        ]
    )]
    public function getSubjectEvents()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects/{subject_id}/events',
        operationId: 'createSubjectEvent',
        summary: 'Create a new subject event',
        description: 'Create a new event associated with a subject',
        tags: ['Subject Events'],
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
            description: 'Event creation data',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/CreateSubjectEventRequest')
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Event created successfully',
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
                description: 'Invalid input'
            ),
            new OA\Response(
                response: 404,
                description: 'Subject not found'
            ),
            new OA\Response(
                response: 422,
                description: 'Invalid event type'
            )
        ]
    )]
    public function createSubjectEvent()
    {
    }

    #[OA\Put(
        path: '/institutions/{institution_id}/subjects/{subject_id}/events/{subject_event_id}',
        operationId: 'updateSubjectEvent',
        summary: 'Update a subject event',
        description: 'Update details of an existing subject event',
        tags: ['Subject Events'],
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
            description: 'Event update data',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/CreateSubjectEventRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Event updated successfully',
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
                description: 'Invalid input'
            ),
            new OA\Response(
                response: 404,
                description: 'Event not found'
            ),
            new OA\Response(
                response: 422,
                description: 'Invalid event type'
            )
        ]
    )]
    public function updateSubjectEvent()
    {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/subjects/{subject_id}/events/{subject_event_id}',
        operationId: 'deleteSubjectEvent',
        summary: 'Delete a subject event',
        description: 'Permanently remove a subject event',
        tags: ['Subject Events'],
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
                description: 'Event deleted successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'Message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Event not found'
            ),
            new OA\Response(
                response: 500,
                description: 'Internal server error'
            )
        ]
    )]
    public function deleteSubjectEvent()
    {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/events/{subject_event_id}',
        operationId: 'getSubjectEvent',
        summary: 'Get a specific subject event',
        description: 'Retrieve details of a specific subject event',
        tags: ['Subject Events'],
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
                description: 'Event details',
                content: new OA\JsonContent(ref: '#/components/schemas/SubjectEventResponse')
            ),
            new OA\Response(
                response: 404,
                description: 'Event not found'
            )
        ]
    )]
    public function getSubjectEvent()
    {
    }
}