<?php
namespace App\Docs\Schemas;

use OpenApi\Attributes as OA;

// Schemas podem ser definidos em um arquivo separado
#[OA\Schema(
    schema: "UserEventResponse",
    properties: [
        new OA\Property(property: "user_event_id", type: "string", format: "uuid"),
        new OA\Property(property: "user_id", type: "string", format: "uuid"),
        new OA\Property(property: "event_id", type: "string", format: "uuid"),
        new OA\Property(property: "title", type: "string"),
        new OA\Property(property: "description", type: "string"),
        new OA\Property(property: "event_date", type: "string", format: "date-time"),
        new OA\Property(property: "type", type: "string")
    ]
)]
#[OA\Schema(
    schema: "CreateUserEventRequest",
    required: ["title", "description", "event_date", "event_type"],
    properties: [
        new OA\Property(property: "title", type: "string", minLength: 3, maxLength: 255),
        new OA\Property(property: "description", type: "string"),
        new OA\Property(property: "event_date", type: "string", format: "date-time"),
        new OA\Property(property: "event_type", type: "string")
    ]
)]
#[OA\Schema(
    schema: "UpdateUserEventRequest",
    properties: [
        new OA\Property(property: "title", type: "string", minLength: 3, maxLength: 255, nullable: true),
        new OA\Property(property: "description", type: "string", nullable: true),
        new OA\Property(property: "event_date", type: "string", format: "date-time", nullable: true),
        new OA\Property(property: "event_type", type: "string", nullable: true)
    ]
)]
#[OA\Schema(
    schema: "UserEventCreatedResponse",
    properties: [
        new OA\Property(property: "Message", type: "string", example: "User event created successfully"),
        new OA\Property(
            property: "user_event",
            ref: "#/components/schemas/UserEventResponse"
        )
    ]
)]
#[OA\Schema(
    schema: "UserEventUpdatedResponse",
    properties: [
        new OA\Property(property: "Message", type: "string", example: "User event updated successfully"),
        new OA\Property(
            property: "user_event",
            ref: "#/components/schemas/UserEventResponse"
        )
    ]
)]
class UserEventControllerSchemas {}