<?php

namespace App\Docs\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "ForumMessageDto",
    type: "object",
    title: "Forum Message",
    description: "Represents a forum message and its author information.",
    properties: [
        new OA\Property(property: "forum_messages_id", type: "string", format: "uuid", example: "d290f1ee-6c54-4b01-90e6-d701748f0851", description: "Unique identifier of the forum message"),
        new OA\Property(property: "content", type: "string", example: "This is the message content", description: "Content of the forum message"),
        new OA\Property(property: "created_at", type: "string", format: "date-time", example: "2025-08-13T14:30:00Z", description: "Message creation timestamp"),
        new OA\Property(property: "changed_at", type: "string", format: "date-time", example: "2025-08-13T14:40:00Z", description: "Last modification timestamp"),
        new OA\Property(property: "sent_by", ref: "#/components/schemas/UserDto", nullable: true, description: "User who sent the message"),
        new OA\Property(property: "subject_id", type: "string", format: "uuid", example: "2f3f6c1b-7f24-4a9c-9a8d-5b5f92e9c2e3", description: "Identifier of the subject related to this message")
    ],
    required: ["forum_messages_id", "content", "created_at", "changed_at", "subject_id"]
)]

class ForumMessageDto {}