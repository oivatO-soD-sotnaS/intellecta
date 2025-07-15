<?php
namespace App\Docs\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "UserDto",
    description: "Data Transfer Object for user information",
    properties: [
        new OA\Property(
            property: "user_id",
            type: "string",
            format: "uuid",
            description: "Unique identifier for the user",
            example: "550e8400-e29b-41d4-a716-446655440000"
        ),
        new OA\Property(
            property: "full_name",
            type: "string",
            description: "Full name of the user",
            example: "João da Silva",
            maxLength: 255
        ),
        new OA\Property(
            property: "email",
            type: "string",
            format: "email",
            description: "User's email address",
            example: "joao@example.com"
        ),
        new OA\Property(
            property: "created_at",
            type: "string",
            format: "date-time",
            description: "When the user account was created",
            example: "2023-01-01T12:00:00Z"
        ),
        new OA\Property(
            property: "changed_at",
            type: "string",
            format: "date-time",
            description: "When the user account was last updated",
            example: "2023-01-02T13:30:00Z"
        ),
        new OA\Property(
            property: "profile_picture",
            ref: "#/components/schemas/File",
            description: "User's profile picture",
            nullable: true
        )
    ],
    type: "object"
)]
class UserDto {}