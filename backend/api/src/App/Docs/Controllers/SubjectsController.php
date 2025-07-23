<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Subjects',
    description: 'Operations related to subject management'
)]
#[OA\Schema(
    schema: 'SubjectResponse',
    properties: [
        new OA\Property(property: 'subject_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'name', type: 'string'),
        new OA\Property(property: 'description', type: 'string'),
        new OA\Property(property: 'institution_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'teacher_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'profile_picture_id', type: 'string', format: 'uuid', nullable: true),
        new OA\Property(property: 'banner_id', type: 'string', format: 'uuid', nullable: true),
        new OA\Property(
            property: 'teacher',
            ref: '#/components/schemas/UserResponse'
        ),
        new OA\Property(property: 'profile_picture', type: 'string', nullable: true),
        new OA\Property(property: 'banner', type: 'string', nullable: true)
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'CreateSubjectRequest',
    required: ['name', 'description'],
    properties: [
        new OA\Property(
            property: 'name',
            type: 'string',
            minLength: 3,
            maxLength: 255,
            description: 'Name of the subject'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            description: 'Detailed description of the subject'
        ),
        new OA\Property(
            property: 'teacher_id',
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'ID of the teacher (required if admin, optional for teachers)'
        ),
        new OA\Property(
            property: 'profile-picture',
            type: 'string',
            format: 'binary',
            description: 'Profile picture file',
            nullable: true
        ),
        new OA\Property(
            property: 'banner',
            type: 'string',
            format: 'binary',
            description: 'Banner image file',
            nullable: true
        )
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'UpdateSubjectRequest',
    required: ['name', 'description'],
    properties: [
        new OA\Property(
            property: 'name',
            type: 'string',
            minLength: 3,
            maxLength: 255,
            description: 'Updated name of the subject'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            description: 'Updated description of the subject'
        ),
        new OA\Property(
            property: 'teacher_id',
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'Updated teacher ID (admin only)'
        ),
        new OA\Property(
            property: 'profile_picture_id',
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'ID of the new profile picture'
        ),
        new OA\Property(
            property: 'banner_id',
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'ID of the new banner image'
        )
    ],
    type: 'object'
)]
class SubjectsController {
    #[OA\Get(
        path: '/institutions/{institution_id}/subjects',
        operationId: 'getInstitutionSubjects',
        summary: 'Get all subjects for an institution',
        tags: ['Subjects'],
        parameters: [
            new OA\Parameter(
                name: 'institution_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'List of subjects',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/SubjectResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Institution not found'
            )
        ]
    )]
    public function getInstitutionSubjects() {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects',
        operationId: 'createSubject',
        summary: 'Create a new subject',
        description: 'Create a new subject in the specified institution. Admins can create subjects for any teacher, teachers can only create subjects for themselves.',
        tags: ['Subjects'],
        security: [['bearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'institution_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        requestBody: new OA\RequestBody(
            description: 'Subject creation data',
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/CreateSubjectRequest')
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Subject created successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string'),
                        new OA\Property(
                            property: 'subject',
                            ref: '#/components/schemas/SubjectResponse'
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
                response: 403,
                description: 'Forbidden - only admins and teachers can create subjects'
            )
        ]
    )]
    public function createSubject() {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}',
        operationId: 'getSubjectById',
        summary: 'Get subject details',
        description: 'Retrieve details of a specific subject. Only accessible by admins and the subject teacher.',
        tags: ['Subjects'],
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
        responses: [
            new OA\Response(
                response: 200,
                description: 'Subject details',
                content: new OA\JsonContent(ref: '#/components/schemas/SubjectResponse')
            ),
            new OA\Response(
                response: 403,
                description: 'Forbidden - not admin or subject teacher'
            ),
            new OA\Response(
                response: 404,
                description: 'Subject not found'
            )
        ]
    )]
    public function getSubjectById() {
    }

    #[OA\Put(
        path: '/institutions/{institution_id}/subjects/{subject_id}',
        operationId: 'updateSubjectById',
        summary: 'Update a subject',
        description: 'Update details of an existing subject. Only admins can change the teacher.',
        tags: ['Subjects'],
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
            description: 'Subject update data',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UpdateSubjectRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Updated subject details',
                content: new OA\JsonContent(ref: '#/components/schemas/SubjectResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'Invalid input'
            ),
            new OA\Response(
                response: 403,
                description: 'Forbidden - not admin or subject teacher'
            ),
            new OA\Response(
                response: 404,
                description: 'Subject or file not found'
            ),
            new OA\Response(
                response: 422,
                description: 'Invalid file type (must be image)'
            )
        ]
    )]
    public function updateSubjectById() {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/subjects/{subject_id}',
        operationId: 'deleteSubjectById',
        summary: 'Delete a subject',
        description: 'Permanently delete a subject. Only accessible by admins and the subject teacher.',
        tags: ['Subjects'],
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
        responses: [
            new OA\Response(
                response: 200,
                description: 'Subject deleted successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 403,
                description: 'Forbidden - not admin or subject teacher'
            ),
            new OA\Response(
                response: 404,
                description: 'Subject not found'
            ),
            new OA\Response(
                response: 500,
                description: 'Internal server error'
            )
        ]
    )]
    public function deleteSubjectById(){
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/classes/{class_id}/subjects',
        operationId: 'getClassSubjects',
        summary: 'Get subjects for a class',
        tags: ['Subjects'],
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
                description: 'List of subjects for the class',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/SubjectResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Class not found'
            )
        ]
    )]
    public function getClassSubjects() {
    }
}