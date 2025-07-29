<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Subject Assignments',
    description: 'Manage assignments for subjects'
)]
#[OA\Schema(
    schema: 'AssignmentResponse',
    properties: [
        new OA\Property(property: 'assignment_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'title', type: 'string'),
        new OA\Property(property: 'description', type: 'string'),
        new OA\Property(property: 'deadline', type: 'string', format: 'date-time'),
        new OA\Property(property: 'subject_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'attachment_id', type: 'string', format: 'uuid', nullable: true),
        new OA\Property(
            property: 'attachment',
            ref: '#/components/schemas/FileResponse',
            nullable: true
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
            description: 'Title of the assignment'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            description: 'Detailed description of the assignment'
        ),
        new OA\Property(
            property: 'deadline',
            type: 'string',
            format: 'date-time',
            description: 'Due date for the assignment'
        ),
        new OA\Property(
            property: 'attachment',
            type: 'string',
            format: 'binary',
            description: 'Optional attachment file',
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
            description: 'Updated title of the assignment'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            description: 'Updated description of the assignment'
        ),
        new OA\Property(
            property: 'deadline',
            type: 'string',
            format: 'date-time',
            description: 'Updated due date for the assignment'
        ),
        new OA\Property(
            property: 'attachment_id',
            type: 'string',
            format: 'uuid',
            description: 'ID of the new attachment file',
            nullable: true
        )
    ]
)]
class SubjectAssignmentsController
{
    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments',
        operationId: 'getSubjectAssignments',
        summary: 'Get all assignments for a subject',
        tags: ['Subject Assignments'],
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
                description: 'List of subject assignments',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/AssignmentResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'No assignments found for this subject'
            )
        ]
    )]
    public function getSubjectAssignments()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments',
        operationId: 'createSubjectAssignment',
        summary: 'Create a new assignment',
        description: 'Create a new assignment for the specified subject with optional attachment',
        tags: ['Subject Assignments'],
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
            description: 'Assignment creation data',
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/CreateAssignmentRequest')
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Assignment created successfully',
                content: new OA\JsonContent(ref: '#/components/schemas/AssignmentResponse')
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
    public function createSubjectAssignment()
    {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}',
        operationId: 'getSubjectAssignmentById',
        summary: 'Get assignment details',
        description: 'Retrieve details of a specific assignment',
        tags: ['Subject Assignments'],
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
                description: 'Assignment details',
                content: new OA\JsonContent(ref: '#/components/schemas/AssignmentResponse')
            ),
            new OA\Response(
                response: 404,
                description: 'Assignment not found'
            )
        ]
    )]
    public function getSubjectAssignmentById()
    {
    }

    #[OA\Patch(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}',
        operationId: 'updateSubjectAssignment',
        summary: 'Update an assignment',
        description: 'Update details of an existing assignment',
        tags: ['Subject Assignments'],
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
            description: 'Assignment update data',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UpdateAssignmentRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Assignment updated successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string'),
                        new OA\Property(
                            property: 'assignment',
                            ref: '#/components/schemas/AssignmentResponse'
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
                description: 'Assignment not found'
            ),
            new OA\Response(
                response: 500,
                description: 'Internal server error'
            )
        ]
    )]
    public function patchSubjectAssignmentById()
    {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}',
        operationId: 'deleteSubjectAssignment',
        summary: 'Delete an assignment',
        description: 'Permanently remove an assignment',
        tags: ['Subject Assignments'],
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
                description: 'Assignment deleted successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Assignment not found'
            ),
            new OA\Response(
                response: 500,
                description: 'Internal server error'
            )
        ]
    )]
    public function deleteSubjectAssignmentById()
    {
    }
}