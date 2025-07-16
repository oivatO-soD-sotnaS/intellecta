<?php
namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: "Invitations",
    description: "Operations related to institution invitations"
)]
class InvitationsController
{
    // ... constructor remains the same ...

    #[OA\Post(
        path: "/invitations/{invitation_id}/accept",
        tags: ["Invitations"],
        summary: "Accept an invitation",
        description: "Accept an invitation to join an institution",
        operationId: "acceptInvitation",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "invitation_id",
                in: "path",
                required: true,
                description: "ID of the invitation to accept",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Invitation accepted successfully",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionUserDto")
            ),
            new OA\Response(
                response: 403,
                description: "Forbidden (invitation expired, already accepted, or email mismatch)",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Invitation not found",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Internal server error",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function acceptInvitation()
    {
        // ... implementation remains the same ...
    }

    #[OA\Get(
        path: "/invitations/{invitation_id}",
        tags: ["Invitations"],
        summary: "Get invitation details",
        description: "Retrieve details of a specific invitation",
        operationId: "getInvitation",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "invitation_id",
                in: "path",
                required: true,
                description: "ID of the invitation",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Invitation details",
                content: new OA\JsonContent(ref: "#/components/schemas/InvitationDto")
            ),
            new OA\Response(
                response: 403,
                description: "Forbidden (email mismatch)",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Invitation not found",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Internal server error",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function getInvitation()
    {
        // ... implementation remains the same ...
    }

    #[OA\Get(
        path: "/invitations",
        tags: ["Invitations"],
        summary: "Get all invitations",
        description: "Retrieve all invitations for the authenticated user",
        operationId: "getAllInvitations",
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of invitations",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/InvitationDto")
                )
            ),
            new OA\Response(
                response: 500,
                description: "Internal server error",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function getAllInvitations()
    {
        // ... implementation remains the same ...
    }
}

// Schema definitions (would typically be in a separate file)
#[OA\Schema(
    schema: "InvitationDto",
    properties: [
        new OA\Property(property: "invitation_id", type: "string", format: "uuid"),
        new OA\Property(property: "email", type: "string", format: "email"),
        new OA\Property(property: "role", type: "string", enum: ["admin", "teacher", "student"]),
        new OA\Property(property: "expires_at", type: "string", format: "date-time"),
        new OA\Property(property: "accepted_at", type: "string", format: "date-time", nullable: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "institution_id", type: "string", format: "uuid"),
        new OA\Property(property: "invited_by", type: "string", format: "uuid"),
        new OA\Property(
            property: "institution",
            ref: "#/components/schemas/InstitutionDto"
        ),
        new OA\Property(
            property: "invited_by_user",
            ref: "#/components/schemas/UserDto"
        )
    ]
)]

class InvitationsSchemas {}