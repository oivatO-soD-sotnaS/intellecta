<?php

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Submissions',
    description: 'Manage assignment submissions and evaluations'
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
            description: 'Submission file attachment'
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
            description: 'ID of the new attachment file'
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
            description: 'Evaluation concept (e.g., "approved", "rejected")'
        ),
        new OA\Property(
            property: 'feedback',
            type: 'string',
            description: 'Detailed feedback for the submission'
        )
    ]
)]
class SubmissionsController
{
    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions',
        operationId: 'getAssignmentSubmissions',
        summary: 'Get all submissions for an assignment',
        description: 'Retrieve all submissions for a specific assignment (visible to teachers and the submitting student)',
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
                description: 'List of submissions',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(ref: '#/components/schemas/SubmissionResponse')
                )
            ),
            new OA\Response(
                response: 404,
                description: 'No submissions found'
            )
        ]
    )]
    public function getAssignmentSubmissions()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions',
        operationId: 'createSubmission',
        summary: 'Submit an assignment',
        description: 'Create a new assignment submission with an attached file',
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
            description: 'Submission file',
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(ref: '#/components/schemas/CreateSubmissionRequest')
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Submission created successfully',
                content: new OA\JsonContent(ref: '#/components/schemas/SubmissionResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'No file provided'
            ),
            new OA\Response(
                response: 404,
                description: 'Assignment not found'
            ),
            new OA\Response(
                response: 500,
                description: 'Failed to create submission'
            )
        ]
    )]
    public function createAssignmentSubmission()
    {
    }

    #[OA\Get(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions/{submission_id}',
        operationId: 'getSubmission',
        summary: 'Get submission details',
        description: 'Retrieve details of a specific submission (visible to teachers and the submitting student)',
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
                description: 'Submission details',
                content: new OA\JsonContent(ref: '#/components/schemas/SubmissionResponse')
            ),
            new OA\Response(
                response: 403,
                description: 'Forbidden - not owner or teacher'
            ),
            new OA\Response(
                response: 404,
                description: 'Submission not found'
            )
        ]
    )]
    public function getSubmissionById()
    {
    }

    #[OA\Patch(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions/{submission_id}/attachment',
        operationId: 'updateSubmissionAttachment',
        summary: 'Update submission attachment',
        description: 'Replace the attachment file for a submission (only before deadline)',
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
            description: 'New attachment ID',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/UpdateAttachmentRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Attachment updated successfully',
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
                description: 'Invalid input'
            ),
            new OA\Response(
                response: 403,
                description: 'Forbidden - not owner or after deadline'
            ),
            new OA\Response(
                response: 404,
                description: 'Submission or file not found'
            ),
            new OA\Response(
                response: 500,
                description: 'Failed to update attachment'
            )
        ]
    )]
    public function updateSubmissionAttachment()
    {
    }

    #[OA\Delete(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions/{submission_id}',
        operationId: 'deleteSubmission',
        summary: 'Delete a submission',
        description: 'Delete a submission (only allowed before assignment deadline)',
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
                description: 'Submission deleted successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string')
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 403,
                description: 'Forbidden - not owner or after deadline'
            ),
            new OA\Response(
                response: 404,
                description: 'Submission not found'
            ),
            new OA\Response(
                response: 500,
                description: 'Failed to delete submission'
            )
        ]
    )]
    public function deleteSubmissionById()
    {
    }

    #[OA\Post(
        path: '/institutions/{institution_id}/subjects/{subject_id}/assignments/{assignment_id}/submissions/{submission_id}/evaluate',
        operationId: 'evaluateSubmission',
        summary: 'Evaluate a submission',
        description: 'Provide feedback and evaluation for a submission (teacher only)',
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
            description: 'Evaluation data',
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/EvaluateSubmissionRequest')
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Submission evaluated successfully',
                content: new OA\JsonContent(ref: '#/components/schemas/SubmissionResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'Invalid input'
            ),
            new OA\Response(
                response: 403,
                description: 'Forbidden - not teacher'
            ),
            new OA\Response(
                response: 404,
                description: 'Submission not found'
            ),
            new OA\Response(
                response: 500,
                description: 'Failed to evaluate submission'
            )
        ]
    )]
    public function evaluateSubmissionById()
    {
    }
}