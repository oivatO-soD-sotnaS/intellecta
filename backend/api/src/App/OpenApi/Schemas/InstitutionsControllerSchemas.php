<?php

namespace App\OpenApi\Schemas;

use OpenApi\Attributes as OA;

// Schemas podem ser definidos em um arquivo separado
#[OA\Schema(
    schema: "InstitutionResponse",
    properties: [
        new OA\Property(property: "institution_id", type: "string", format: "uuid"),
        new OA\Property(property: "user_id", type: "string", format: "uuid"),
        new OA\Property(property: "name", type: "string"),
        new OA\Property(property: "email", type: "string", format: "email"),
        new OA\Property(property: "description", type: "string"),
        new OA\Property(
            property: "profile_picture",
            type: "object",
            nullable: true,
            properties: [
                new OA\Property(property: "file_id", type: "string", format: "uuid"),
                new OA\Property(property: "url", type: "string", format: "uri"),
                new OA\Property(property: "filename", type: "string"),
                new OA\Property(property: "mime_type", type: "string"),
                new OA\Property(property: "size", type: "integer")
            ]
        ),
        new OA\Property(
            property: "banner",
            type: "object",
            nullable: true,
            properties: [
                new OA\Property(property: "file_id", type: "string", format: "uuid"),
                new OA\Property(property: "url", type: "string", format: "uri"),
                new OA\Property(property: "filename", type: "string"),
                new OA\Property(property: "mime_type", type: "string"),
                new OA\Property(property: "size", type: "integer")
            ]
        )
    ]
)]
#[OA\Schema(
    schema: "InstitutionSummaryResponse",
    properties: [
        new OA\Property(property: "institution_id", type: "string", format: "uuid"),
        new OA\Property(property: "name", type: "string"),
        new OA\Property(property: "email", type: "string", format: "email"),
        new OA\Property(
            property: "thumbnail",
            type: "object",
            nullable: true,
            properties: [
                new OA\Property(property: "file_id", type: "string", format: "uuid"),
                new OA\Property(property: "url", type: "string", format: "uri"),
                new OA\Property(property: "filename", type: "string"),
                new OA\Property(property: "mime_type", type: "string"),
                new OA\Property(property: "size", type: "integer")
            ]
        ),
        new OA\Property(
            property: "banner",
            type: "object",
            nullable: true,
            properties: [
                new OA\Property(property: "file_id", type: "string", format: "uuid"),
                new OA\Property(property: "url", type: "string", format: "uri"),
                new OA\Property(property: "filename", type: "string"),
                new OA\Property(property: "mime_type", type: "string"),
                new OA\Property(property: "size", type: "integer")
            ]
        )
    ]
)]
#[OA\Schema(
    schema: "ErrorResponse",
    properties: [
        new OA\Property(property: "error", type: "string"),
        new OA\Property(property: "code", type: "integer")
    ]
)]
class InstitutionsControllerSchemas {}