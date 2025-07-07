<?php

namespace App\OpenApi\Schemas;

use OpenApi\Attributes as OA;


// Schemas podem ser definidos em um arquivo separado ou como classes
#[OA\Schema(
    schema: "InstitutionalEventResponse",
    properties: [
        new OA\Property(property: "institutional_event_id", type: "string", format: "uuid"),
        new OA\Property(property: "institution_id", type: "string", format: "uuid"),
        new OA\Property(property: "event_id", type: "string", format: "uuid"),
        new OA\Property(property: "title", type: "string"),
        new OA\Property(property: "description", type: "string"),
        new OA\Property(property: "event_date", type: "string", format: "date-time"),
        new OA\Property(property: "event_type", type: "string")
    ]
)]
#[OA\Schema(
    schema: "CreateInstitutionalEventRequest",
    required: ["title", "description", "event_date", "event_type"],
    properties: [
        new OA\Property(property: "title", type: "string", minLength: 3, maxLength: 255),
        new OA\Property(property: "description", type: "string"),
        new OA\Property(property: "event_date", type: "string", format: "date-time"),
        new OA\Property(property: "event_type", type: "string")
    ]
)]
#[OA\Schema(
    schema: "UpdateInstitutionalEventRequest",
    properties: [
        new OA\Property(property: "title", type: "string", minLength: 3, maxLength: 255, nullable: true),
        new OA\Property(property: "description", type: "string", nullable: true),
        new OA\Property(property: "event_date", type: "string", format: "date-time", nullable: true),
        new OA\Property(property: "event_type", type: "string", nullable: true)
    ]
)]
#[OA\Schema(
    schema: "InstitutionalEventCreatedResponse",
    properties: [
        new OA\Property(property: "Message", type: "string", example: "Institutional event created successfully"),
        new OA\Property(
            property: "institutional_event",
            ref: "#/components/schemas/InstitutionalEventResponse"
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
class InstitutionalEventControllerSchemas {}