<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Usuários da Turma',
    description: 'Gerencia usuários dentro de uma turma em uma instituição'
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
        summary: 'Obter todos os usuários em uma turma',
        tags: ['Usuários da Turma'],
        parameters: [
            new OA\Parameter(name: 'institution_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid'))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Lista de usuários da turma',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/ClassUserResponse')
                )
            ),
            new OA\Response(response: 404, description: 'Instituição ou turma não encontrada'),
            new OA\Response(response: 500, description: 'Erro interno no servidor')
        ]
    )]
    public function getClassUsers(){
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/classes/{class_id}/users',
        operationId: 'createClassUsers',
        summary: 'Adicionar usuários em uma turma',
        tags: ['Usuários da Turma'],
        parameters: [
            new OA\Parameter(name: 'institution_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid'))
        ],
        requestBody: new OA\RequestBody(
            description: 'IDs dos usuários a serem adicionados na turma',
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
                description: 'Usuários adicionados com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'mensagem', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 400, description: 'Entrada inválida'),
            new OA\Response(response: 404, description: 'Instituição ou turma não encontrada'),
            new OA\Response(response: 500, description: 'Erro interno no servidor')
        ],
        security: [['BearerAuth' => []]]
    )]
    public function createClassUsers(){
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/classes/{class_id}/users/{class_users_id}',
        operationId: 'getClassUserById',
        summary: 'Obter detalhes de um usuário específico em uma turma',
        tags: ['Usuários da Turma'],
        parameters: [
            new OA\Parameter(name: 'institution_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_users_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid'))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Detalhes do usuário na turma',
                content: new OA\JsonContent(ref: '#/components/schemas/ClassUserResponse')
            ),
            new OA\Response(response: 404, description: 'Usuário não encontrado na turma'),
            new OA\Response(response: 500, description: 'Erro interno no servidor')
        ]
    )]
    public function getClassUserById() {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/classes/{class_id}/users/{class_users_id}',
        operationId: 'removeClassUser',
        summary: 'Remover um usuário de uma turma',
        tags: ['Usuários da Turma'],
        parameters: [
            new OA\Parameter(name: 'institution_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'class_users_id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid'))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Usuário removido com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'mensagem', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(response: 404, description: 'Usuário não encontrado na turma'),
            new OA\Response(response: 500, description: 'Erro interno no servidor')
        ],
        security: [["bearerAuth" => []]]
    )]
    public function removeClassUser(){
    }
}