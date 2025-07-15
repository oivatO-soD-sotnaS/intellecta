<?php
namespace App\Docs\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "InstitutionDto",
    description: "Data Transfer Object for institution information",
    properties: [
        new OA\Property(
            property: "institution_id",
            type: "string",
            format: "uuid",
            description: "Unique identifier for the institution",
            example: "550e8400-e29b-41d4-a716-446655440000"
        ),
        new OA\Property(
            property: "name",
            type: "string",
            description: "Name of the institution",
            example: "Universidade Federal de Minas Gerais",
            maxLength: 255
        ),
        new OA\Property(
            property: "email",
            type: "string",
            format: "email",
            description: "Institution's contact email",
            example: "contato@ufmg.br"
        ),
        new OA\Property(
            property: "description",
            type: "string",
            description: "Detailed description of the institution",
            example: "Universidade pública brasileira sediada em Belo Horizonte"
        ),
        new OA\Property(
            property: "profilePicture",
            ref: "#/components/schemas/File",
            description: "Institution's profile picture",
            nullable: true
        ),
        new OA\Property(
            property: "banner",
            ref: "#/components/schemas/File",
            description: "Institution's banner image",
            nullable: true
        )
    ],
    type: "object"
)]
class InstitutionDto {}