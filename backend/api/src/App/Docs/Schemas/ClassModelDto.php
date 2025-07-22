<?php

namespace App\Docs\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "ClassModelDto",
    description: "Data Transfer Object for class information",
    properties: [
        new OA\Property(
            property: "class_id",
            type: "string",
            format: "uuid",
            description: "Unique identifier for the class"
        ),
        new OA\Property(
            property: "name",
            type: "string",
            description: "Name of the class",
            maxLength: 255
        ),
        new OA\Property(
            property: "description",
            type: "string",
            description: "Detailed description of the class"
        ),
        new OA\Property(
            property: "institution_id",
            type: "string",
            format: "uuid",
            description: "ID of the institution this class belongs to"
        ),
        new OA\Property(
            property: "profile_picture",
            ref: "#/components/schemas/File",
            description: "Class profile picture",
            nullable: true
        ),
        new OA\Property(
            property: "banner",
            ref: "#/components/schemas/File",
            description: "Class banner image",
            nullable: true
        )
    ],
    type: "object"
)]
class ClassModelDto {}
