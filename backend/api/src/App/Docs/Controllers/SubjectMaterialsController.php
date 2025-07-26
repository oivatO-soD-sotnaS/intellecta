<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Subject Materials',
    description: 'Manage learning materials for subjects'
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
            description: 'Title of the material'
        ),
        new OA\Property(
            property: 'material_file',
            type: 'string',
            format: 'binary',
            description: 'Material file to upload'
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
            description: 'Updated title of the material'
        )
    ]
)]
class SubjectMaterialsController
{
    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/materials',
        operationId: 'getSubjectMaterials',
        summary: 'Get all materials for a subject',
        tags: ['Subject Materials'],
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
                description: 'List of subject materials',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/MaterialResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'No materials found for this subject'
            )
        ]
    )]
    public function getSubjectMaterials()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects/{subject_id}/materials',
        operationId: 'createSubjectMaterial',
        summary: 'Create a new material for a subject',
        description: 'Upload a new learning material for the specified subject',
        tags: ['Subject Materials'],
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
            description: 'Material creation data',
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/CreateMaterialRequest')
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Material created successfully',
                content: new OA\JsonContent(ref: '#/components/schemas/MaterialResponse')
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
    public function createSubjectMaterial()
    {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/materials/{material_id}',
        operationId: 'getMaterialById',
        summary: 'Get material details',
        description: 'Retrieve details of a specific learning material',
        tags: ['Subject Materials'],
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
                description: 'Material details',
                content: new OA\JsonContent(ref: '#/components/schemas/MaterialResponse')
            ),
            new OA\Response(
                response: 404,
                description: 'Material not found'
            )
        ]
    )]
    public function getMaterialById()
    {
    }

    #[OA\Put(
        path: '/institutions/{institution_id}/subjects/{subject_id}/materials/{material_id}',
        operationId: 'updateMaterial',
        summary: 'Update material details',
        description: 'Update the title of a learning material',
        tags: ['Subject Materials'],
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
            description: 'Material update data',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UpdateMaterialRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Material updated successfully',
                content: new OA\JsonContent(ref: '#/components/schemas/MaterialResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'Invalid input'
            ),
            new OA\Response(
                response: 404,
                description: 'Material not found'
            ),
            new OA\Response(
                response: 500,
                description: 'Internal server error'
            )
        ]
    )]
    public function updateMaterial()
    {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/subjects/{subject_id}/materials/{material_id}',
        operationId: 'deleteMaterial',
        summary: 'Delete a material',
        description: 'Permanently remove a learning material',
        tags: ['Subject Materials'],
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
                description: 'Material deleted successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Material not found'
            ),
            new OA\Response(
                response: 500,
                description: 'Internal server error'
            )
        ]
    )]
    public function deleteMaterial()
    {
    }
}