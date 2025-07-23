<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Class Subjects',
    description: 'Manage subjects within a class'
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
            description: 'ID of the subject to add to the class'
        )
    ],
    type: 'object'
)]
class ClassSubjectsController
{
    #[OA\Get(
        path: '/institutions/{institution_id}/classes/{class_id}/subjects',
        operationId: 'getClassSubjects',
        summary: 'Get all subjects for a class',
        tags: ['Class Subjects'],
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
                description: 'List of class subjects',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/ClassSubjectResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Class not found'
            )
        ]
    )]
    public function getClassSubjects()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/classes/{class_id}/subjects',
        operationId: 'addSubjectToClass',
        summary: 'Add a subject to a class',
        description: 'Links a subject to a specific class',
        tags: ['Class Subjects'],
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
            description: 'Subject to add to class',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/AddSubjectToClassRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Subject linked successfully',
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
                description: 'Invalid input'
            ),
            new OA\Response(
                response: 404,
                description: 'Subject not found'
            )
        ]
    )]
    public function addSubjectToClass()
    {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/classes/{class_id}/subjects/{class_subject_id}',
        operationId: 'getClassSubjectById',
        summary: 'Get a specific class subject',
        description: 'Retrieve details of a specific subject-class relationship',
        tags: ['Class Subjects'],
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
                description: 'Class subject details',
                content: new OA\JsonContent(ref: '#/components/schemas/ClassSubjectResponse')
            ),
            new OA\Response(
                response: 404,
                description: 'Class subject not found'
            )
        ]
    )]
    public function getClassSubjectById()
    {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/classes/{class_id}/subjects/{class_subject_id}',
        operationId: 'removeSubjectFromClass',
        summary: 'Remove a subject from a class',
        description: 'Unlinks a subject from a specific class',
        tags: ['Class Subjects'],
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
                description: 'Subject removed successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Class subject not found'
            ),
            new OA\Response(
                response: 500,
                description: 'Internal server error'
            )
        ]
    )]
    public function removeSubjectFromClass()
    {

    }
}