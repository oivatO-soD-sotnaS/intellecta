<?php
declare(strict_types= 1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: "Forum Messages",
    description: "Endpoints for managing forum messages related to a subject."
)]
readonly class ForumMessagesController {

    #[OA\Get(
        path: "/institutions/{institution_id}/subjects/{subject_id}/forum/messages",
        summary: "Get forum messages for a subject",
        description: "Retrieve forum messages for a subject, optionally filtered and paginated.",
        tags: ["Forum Messages"],
        parameters: [
            new OA\Parameter(name: "institution_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "Institution UUID"),
            new OA\Parameter(name: "subject_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "Subject UUID"),
            new OA\Parameter(name: "content", in: "query", required: false, schema: new OA\Schema(type: "string"), description: "Filter by content substring"),
            new OA\Parameter(name: "created_at_from", in: "query", required: false, schema: new OA\Schema(type: "string", format: "date"), description: "Filter by creation date (from)"),
            new OA\Parameter(name: "created_at_to", in: "query", required: false, schema: new OA\Schema(type: "string", format: "date"), description: "Filter by creation date (to)"),
            new OA\Parameter(name: "limit", in: "query", required: false, schema: new OA\Schema(type: "integer", enum: [10, 15, 20, 25, 30, 35, 40, 45, 50]), description: "Number of results per page"),
            new OA\Parameter(name: "offset", in: "query", required: false, schema: new OA\Schema(type: "integer", minimum: 0), description: "Offset for pagination")
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Paginated list of forum messages",
                content: new OA\JsonContent(ref: "#/components/schemas/PaginationDto_ForumMessageDto")
            ),
            new OA\Response(response: 404, description: "No forum messages found"),
            new OA\Response(response: 400, description: "Invalid parameters")
        ]
    )]
    
    public function getSubjectForumMessages() { /* ... */ }

    #[OA\Get(
        path: "/institutions/{institution_id}/subjects/{subject_id}/forum/messages/count",
        summary: "Count forum messages for a subject",
        description: "Returns the total number of forum messages for a subject, optionally filtered.",
        tags: ["Forum Messages"],
        parameters: [
            new OA\Parameter(name: "institution_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "Institution UUID"),
            new OA\Parameter(name: "subject_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "Subject UUID"),
            new OA\Parameter(name: "content", in: "query", required: false, schema: new OA\Schema(type: "string"), description: "Filter by content substring"),
            new OA\Parameter(name: "created_at_from", in: "query", required: false, schema: new OA\Schema(type: "string", format: "date"), description: "Filter by creation date (from)"),
            new OA\Parameter(name: "created_at_to", in: "query", required: false, schema: new OA\Schema(type: "string", format: "date"), description: "Filter by creation date (to)")
        ],
        responses: [
            new OA\Response(response: 200, description: "Count of forum messages", content: new OA\JsonContent(
                type: "object",
                properties: [
                    new OA\Property(property: "count", type: "integer", example: 5)
                ]
            ))
        ]
    )]
    public function countSubjectForumMessages() { /* ... */ }

    #[OA\Post(
        path: "/institutions/{institution_id}/subjects/{subject_id}/forum/messages",
        summary: "Create a forum message",
        description: "Creates a new forum message for a subject.",
        tags: ["Forum Messages"],
        parameters: [
            new OA\Parameter(name: "institution_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "Institution UUID"),
            new OA\Parameter(name: "subject_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "Subject UUID")
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["content"],
                properties: [
                    new OA\Property(property: "content", type: "string", example: "This is a forum message content")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Forum message created", content: new OA\JsonContent(ref: "#/components/schemas/ForumMessageDto")),
            new OA\Response(response: 500, description: "Failed to create forum message")
        ]
    )]
    public function createSubjectForumMessage() { /* ... */ }

    #[OA\Put(
        path: "/institutions/{institution_id}/subjects/{subject_id}/forum/messages/{forum_message_id}",
        summary: "Update a forum message",
        description: "Updates a forum message if it is less than 15 minutes old.",
        tags: ["Forum Messages"],
        parameters: [
            new OA\Parameter(name: "institution_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "Institution UUID"),
            new OA\Parameter(name: "subject_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "Subject UUID"),
            new OA\Parameter(name: "forum_message_id", in: "path", required: true, schema: new OA\Schema(type: "string", format: "uuid"), description: "Forum message UUID")
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["content"],
                properties: [
                    new OA\Property(property: "content", type: "string", example: "Updated forum message content")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Forum message updated", content: new OA\JsonContent(ref: "#/components/schemas/ForumMessageDto")),
            new OA\Response(response: 403, description: "Forum message cannot be updated after 15 minutes"),
            new OA\Response(response: 404, description: "Forum message not found"),
            new OA\Response(response: 500, description: "Failed to update forum message")
        ]
    )]
    public function updateForumMessage() { /* ... */ }
}