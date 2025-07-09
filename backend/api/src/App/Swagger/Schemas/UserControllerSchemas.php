<?php

namespace App\Swagger\Schemas;

use OpenApi\Attributes as OA;

// Schemas podem ser definidos em um arquivo separado
#[OA\Schema(
    schema: "UserResponse",
    properties: [
        new OA\Property(property: "user_id", type: "string", format: "uuid"),
        new OA\Property(property: "full_name", type: "string"),
        new OA\Property(property: "email", type: "string", format: "email"),
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
        )
    ]
)]
#[OA\Schema(
    schema: "FileResponse",
    properties: [
        new OA\Property(property: "file_id", type: "string", format: "uuid"),
        new OA\Property(property: "url", type: "string", format: "uri"),
        new OA\Property(property: "filename", type: "string"),
        new OA\Property(property: "mime_type", type: "string"),
        new OA\Property(property: "size", type: "integer"),
        new OA\Property(property: "uploaded_at", type: "string", format: "date-time")
    ]
)]

class UserControllerSchemas {}