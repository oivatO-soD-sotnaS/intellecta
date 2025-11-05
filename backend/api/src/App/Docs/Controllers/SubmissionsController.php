<?php

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Submissions',
    description: 'Gerenciar submissões de tarefas e avaliações'
)]
#[OA\Schema(
    schema: 'SubmissionResponse',
    properties: [
        new OA\Property(property: 'submission_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'submitted_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'concept', type: 'string', nullable: true),
        new OA\Property(property: 'feedback', type: 'string', nullable: true),
        new OA\Property(property: 'assignment_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'user_id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'attachment_id', type: 'string', format: 'uuid', nullable: true),
        new OA\Property(
            property: 'user',
            ref: '#/components/schemas/UserResponse'
        ),
        new OA\Property(
            property: 'attachment',
            ref: '#/components/schemas/FileResponse',
            nullable: true
        )
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'CreateSubmissionRequest',
    required: ['attachment'],
    properties: [
        new OA\Property(
            property: 'attachment',
            type: 'string',
            format: 'binary',
            description: 'Arquivo de submissão da tarefa'
        )
    ]
)]
#[OA\Schema(
    schema: 'UpdateAttachmentRequest',
    required: ['attachment_id'],
    properties: [
        new OA\Property(
            property: 'attachment_id',
            type: 'string',
            format: 'uuid',
            description: 'ID do novo arquivo de anexo'
        )
    ]
)]
#[OA\Schema(
    schema: 'EvaluateSubmissionRequest',
    required: ['concept', 'feedback'],
    properties: [
        new OA\Property(
            property: 'concept',
            type: 'string',
            description: 'Conceito da avaliação (ex.: "aprovado", "rejeitado")'
        ),
        new OA\Property(
            property: 'feedback',
            type: 'string',
            description: 'Feedback detalhado para a submissão'
        )
    ]
)]
class SubmissionsController
{
    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions',
        operationId: 'getAssignmentSubmissions',
        summary: 'Obter todas as submissões para uma tarefa',
        description: 'Recupera todas as submissões para uma tarefa específica (visível para professores e o estudante que submeteu)',
        tags: ['Submissions'],
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
                description: 'Lista de submissões',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/SubmissionResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Nenhuma submissão encontrada'
            )
        ]
    )]
    public function getAssignmentSubmissions()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions',
        operationId: 'createSubmission',
        summary: 'Enviar uma tarefa',
        description: 'Criar uma nova submissão da tarefa com um arquivo anexado',
        tags: ['Submissions'],
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
            description: 'Arquivo de submissão',
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/CreateSubmissionRequest')
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Submissão criada com sucesso',
                content: new OA\JsonContent(ref: '#/components/schemas/SubmissionResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'Nenhum arquivo fornecido'
            ),
            new OA\Response(
                response: 404,
                description: 'Tarefa não encontrada'
            ),
            new OA\Response(
                response: 500,
                description: 'Falha ao criar submissão'
            )
        ]
    )]
    public function createAssignmentSubmission()
    {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions/{submission_id}',
        operationId: 'getSubmission',
        summary: 'Obter detalhes da submissão',
        description: 'Recupera os detalhes de uma submissão específica (visível para professores e o estudante que submeteu)',
        tags: ['Submissions'],
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
            ),
            new OA\Parameter(
                name: 'submission_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Detalhes da submissão',
                content: new OA\JsonContent(ref: '#/components/schemas/SubmissionResponse')
            ),
            new OA\Response(
                response: 403,
                description: 'Proibido - não é o proprietário ou professor'
            ),
            new OA\Response(
                response: 404,
                description: 'Submissão não encontrada'
            )
        ]
    )]
    public function getSubmissionById()
    {
    }

    #[OA\Patch(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions/{submission_id}/attachment',
        operationId: 'updateSubmissionAttachment',
        summary: 'Atualizar anexo da submissão',
        description: 'Substituir o arquivo de anexo de uma submissão (somente antes do prazo)',
        tags: ['Submissions'],
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
            ),
            new OA\Parameter(
                name: 'submission_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        requestBody: new OA\RequestBody(
            description: 'Novo ID do anexo',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UpdateAttachmentRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Anexo atualizado com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string'),
                        new OA\Property(
                            property: 'submission',
                            ref: '#/components/schemas/SubmissionResponse'
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
                description: 'Proibido - não é o proprietário ou após o prazo'
            ),
            new OA\Response(
                response: 404,
                description: 'Submissão ou arquivo não encontrado'
            ),
            new OA\Response(
                response: 500,
                description: 'Falha ao atualizar o anexo'
            )
        ]
    )]
    public function updateSubmissionAttachment()
    {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions/{submission_id}',
        operationId: 'deleteSubmission',
        summary: 'Excluir uma submissão',
        description: 'Excluir uma submissão (permitido somente antes do prazo da tarefa)',
        tags: ['Submissions'],
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
            ),
            new OA\Parameter(
                name: 'submission_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Submissão excluída com sucesso',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 403,
                description: 'Proibido - não é o proprietário ou após o prazo'
            ),
            new OA\Response(
                response: 404,
                description: 'Submissão não encontrada'
            ),
            new OA\Response(
                response: 500,
                description: 'Falha ao excluir a submissão'
            )
        ]
    )]
    public function deleteSubmissionById()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions/{submission_id}/evaluate',
        operationId: 'evaluateSubmission',
        summary: 'Avaliar uma submissão',
        description: 'Fornecer feedback e avaliação para uma submissão (somente para professores)',
        tags: ['Submissions'],
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
            ),
            new OA\Parameter(
                name: 'submission_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        requestBody: new OA\RequestBody(
            description: 'Dados da avaliação',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/EvaluateSubmissionRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Submissão avaliada com sucesso',
                content: new OA\JsonContent(ref: '#/components/schemas/SubmissionResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'Entrada inválida'
            ),
            new OA\Response(
                response: 403,
                description: 'Proibido - não é professor'
            ),
            new OA\Response(
                response: 404,
                description: 'Submissão não encontrada'
            ),
            new OA\Response(
                response: 500,
                description: 'Falha ao avaliar a submissão'
            )
        ]
    )]
    public function evaluateSubmissionById()
    {
    }
}