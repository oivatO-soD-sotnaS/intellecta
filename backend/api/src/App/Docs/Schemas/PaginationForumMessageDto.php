<?php

namespace App\Docs\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "PaginationDto_ForumMessageDto",
    type: "object",
    title: "Paginated Forum Messages",
    description: "Paginated list of forum messages with metadata.",
    properties: [
        new OA\Property(
            property: "paging",
            type: "object",
            properties: [
                new OA\Property(property: "page", type: "integer", example: 1, description: "Current page number"),
                new OA\Property(property: "total_pages", type: "integer", example: 10, description: "Total number of pages"),
                new OA\Property(property: "total_records", type: "integer", example: 95, description: "Total number of available records")
            ],
            required: ["page", "total_pages", "total_records"]
        ),
        new OA\Property(
            property: "records",
            type: "array",
            description: "List of forum messages for the current page",
            items: new OA\Items(ref: "#/components/schemas/ForumMessageDto")
        )
    ],
    required: ["paging", "records"]
)]

class PaginationForumMessageDto {}