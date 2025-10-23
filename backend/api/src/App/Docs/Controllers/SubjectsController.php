<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Disciplinas',
    description: 'Operações relacionadas à gestão de disciplinas'
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
            description: 'Nome da disciplina'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            description: 'Descrição detalhada da disciplina'
        ),
        new OA\Property(
            property: 'teacher_id',
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'ID do professor (necessário se for admin, opcional para professores)'
        ),
        new OA\Property(
            property: 'profile-picture',
            type: 'string',
            format: 'binary',
            description: 'Arquivo da foto de perfil',
            nullable: true
        ),
        new OA\Property(
            property: 'banner',
            type: 'string',
            format: 'binary',
            description: 'Arquivo da imagem de banner',
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
            description: 'Nome atualizado da disciplina'
        ),
        new OA\Property(
            property: 'description',
            type: 'string',
            description: 'Descrição atualizada da disciplina'
        ),
        new OA\Property(
            property: 'teacher_id',
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'ID do professor atualizado (apenas para administradores)'
        ),
        new OA\Property(
            property: 'profile_picture_id',
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'ID da nova foto de perfil'
        ),
        new OA\Property(
            property: 'banner_id',
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'ID da nova imagem de banner'
        )
    ],
    type: 'object'
)]
class SubjectsController {
    #[OA\Get(
        path: '/institutions/{institution_id}/subjects',
        operationId: 'getInstitutionSubjects',
        summary: 'Obter todas as disciplinas de uma instituição',
        tags: ['Disciplinas'],
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
                description: 'Lista de disciplinas',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/SubjectResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Instituição não encontrada'
            )
        ]
    )]
    public function getInstitutionSubjects() {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects',
        operationId: 'createSubject',
        summary: 'Criar uma nova disciplina',
        description: 'Crie uma nova disciplina na instituição especificada. Administradores podem criar disciplinas para qualquer professor; professores podem criar somente para si mesmos.',
        tags: ['Disciplinas'],
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
            description: 'Dados para criação da disciplina',
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/CreateSubjectRequest')
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Disciplina criada com sucesso',
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
                description: 'Entrada inválida'
            ),
            new OA\Response(
                response: 403,
                description: 'Proibido - apenas administradores e professores podem criar disciplinas'
            )
        ]
    )]
    public function createSubject() {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}',
        operationId: 'getSubjectById',
        summary: 'Obter detalhes da disciplina',
        description: 'Recupere os detalhes de uma disciplina específica. Acessível apenas por administradores e pelo professor da disciplina.',
        tags: ['Disciplinas'],
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
                description: 'Detalhes da disciplina',
                content: new OA\JsonContent(ref: '#/components/schemas/SubjectResponse')
            ),
            new OA\Response(
                response: 403,
                description: 'Proibido - não é administrador ou professor da disciplina'
            ),
            new OA\Response(
                response: 404,
                description: 'Disciplina não encontrada'
            )
        ]
    )]
    public function getSubjectById() {
    }

    #[OA\Put(
        path: '/institutions/{institution_id}/subjects/{subject_id}',
        operationId: 'updateSubjectById',
        summary: 'Atualizar uma disciplina',
        description: 'Atualize os detalhes de uma disciplina existente. Apenas administradores podem alterar o professor.',
        tags: ['Disciplinas'],
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
            description: 'Dados para atualização da disciplina',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UpdateSubjectRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Detalhes da disciplina atualizados',
                content: new OA\JsonContent(ref: '#/components/schemas/SubjectResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'Entrada inválida'
            ),
            new OA\Response(
                response: 403,
                description: 'Proibido - não é administrador ou professor da disciplina'
            ),
            new OA\Response(
                response: 404,
                description: 'Disciplina ou arquivo não encontrado'
            ),
            new OA\Response(
                response: 422,
                description: 'Tipo de arquivo inválido (deve ser imagem)'
            )
        ]
    )]
    public function updateSubjectById() {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/subjects/{subject_id}',
        operationId: 'deleteSubjectById',
        summary: 'Excluir uma disciplina',
        description: 'Exclua permanentemente uma disciplina. Acessível apenas por administradores e pelo professor da disciplina.',
        tags: ['Disciplinas'],
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
                description: 'Disciplina excluída com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 403,
                description: 'Proibido - não é administrador ou professor da disciplina'
            ),
            new OA\Response(
                response: 404,
                description: 'Disciplina não encontrada'
            ),
            new OA\Response(
                response: 500,
                description: 'Erro interno do servidor'
            )
        ]
    )]
    public function deleteSubjectById(){
    }
}