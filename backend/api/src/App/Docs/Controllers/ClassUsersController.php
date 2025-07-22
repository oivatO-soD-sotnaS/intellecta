<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Class Users',
    description: 'Manage users within a class in an institution'
)]
#[OA\Schema(
    schema: 'ClassUserResponse',
    properties: [
        new OA\Property(property: 'class_users_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'joined_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'class_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'user_id', type: 'string', format: 'uuid'),
        new OA\Property(
            property: 'user',
            ref: '#/components/schemas/UserResponse'
        )
    ],
    type: 'object'
)]
class ClassUsersController {
    #[OA\Get(
        path: '/institutions/{institution_id}/classes/{class_id}/users',
        operationId: 'getClassUsers',
        summary: 'Get all users in a class',
        tags: ['Class Users'],
        parameters: [
            new OA\Parameter(name: 'institution_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid'))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'List of class users',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/ClassUserResponse')
                )
            ),
            new OA\Response(response: 404, description: 'Institution or class not found'),
            new OA\Response(response: 500, description: 'Internal server error')
        ]
    )]
    public function getClassUsers(){
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/classes/{class_id}/users',
        operationId: 'createClassUsers',
        summary: 'Add users to a class',
        tags: ['Class Users'],
        parameters: [
            new OA\Parameter(name: 'institution_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid'))
        ],
        requestBody: new OA\RequestBody(
            description: 'User IDs to add to the class',
            required: true,
            content: new OA\JsonContent(
                required: ['user_ids'],
                properties: [
                    new OA\Property(
                        property: 'user_ids',
                        type: 'array',
                        items: new OA\Items(type: 'string', format: 'uuid')
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Users added successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 400, description: 'Invalid input'),
            new OA\Response(response: 404, description: 'Institution or class not found'),
            new OA\Response(response: 500, description: 'Internal server error')
        ],
        security: [['BearerAuth' => []]]
    )]
    public function createClassUsers(){
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/classes/{class_id}/users/{class_users_id}',
        operationId: 'getClassUserById',
        summary: 'Get a specific user in a class',
        tags: ['Class Users'],
        parameters: [
            new OA\Parameter(name: 'institution_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_users_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid'))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Class user details',
                content: new OA\JsonContent(ref: '#/components/schemas/ClassUserResponse')
            ),
            new OA\Response(response: 404, description: 'User not found in class'),
            new OA\Response(response: 500, description: 'Internal server error')
        ]
    )]
    public function getClassUserById() {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/classes/{class_id}/users/{class_users_id}',
        operationId: 'removeClassUser',
        summary: 'Remove a user from a class',
        tags: ['Class Users'],
        parameters: [
            new OA\Parameter(name: 'institution_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_users_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid'))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'User removed successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 404, description: 'User not found in class'),
            new OA\Response(response: 500, description: 'Internal server error')
        ],
        security: [["bearerAuth" => []]],
    )]
    public function removeClassUser(){
    }
}