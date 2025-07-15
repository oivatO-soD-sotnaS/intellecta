<?php
namespace App\Docs\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "File",
    description: "Represents a file in the system",
    properties: [
        new OA\Property(
            property: "file_id",
            type: "string",
            format: "uuid",
            description: "Unique identifier for the file",
            example: "550e8400-e29b-41d4-a716-446655440000"
        ),
        new OA\Property(
            property: "url",
            type: "string",
            format: "uri",
            description: "URL to access the file",
            example: "https://storage.example.com/files/profile.jpg"
        ),
        new OA\Property(
            property: "filename",
            type: "string",
            description: "Original filename",
            example: "profile.jpg",
            maxLength: 255
        ),
        new OA\Property(
            property: "mime_type",
            type: "string",
            description: "MIME type of the file",
            example: "image/jpeg",
            nullable: true
        ),
        new OA\Property(
            property: "size",
            type: "integer",
            description: "File size in bytes",
            example: 102400,
            nullable: true
        ),
        new OA\Property(
            property: "uploaded_at",
            type: "string",
            format: "date-time",
            description: "When the file was uploaded",
            example: "2023-01-01T12:00:00Z"
        ),
        new OA\Property(
            property: "file_type",
            ref: "#/components/schemas/FileType",
            description: "Type classification of the file"
        )
    ],
    type: "object"
)]

#[OA\Schema(
    schema: "FileType",
    description: "Type classification of files",
    type: "string",
    enum: ["image", "document", "video", "audio", "archive", "other"],
    example: "image"
)]
class File{}