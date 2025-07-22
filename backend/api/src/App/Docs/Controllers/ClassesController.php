<?php
namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: "Classes",
    description: "Operations related to class management"
)]
class ClassesController
{
    #[OA\Get(
        path: "/institutions/{institution_id}/classes",
        tags: ["Classes"],
        summary: "Get institution classes",
        description: "Retrieve classes for an institution (all classes for admins, only participating classes for others)",
        operationId: "getInstitutionClasses",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID of the institution",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of classes",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/ClassModelDto")
                )
            ),
            new OA\Response(
                response: 404,
                description: "No classes found",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function getInstitutionClasses(){}

    #[OA\Post(
        path: "/institutions/{institution_id}/classes",
        tags: ["Classes"],
        summary: "Create a new class",
        description: "Create a new class in the specified institution",
        operationId: "createClass",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID of the institution",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        requestBody: new OA\RequestBody(
            description: "Class creation data",
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["name", "description"],
                    properties: [
                        new OA\Property(
                            property: "name",
                            type: "string",
                            description: "Name of the class",
                            minLength: 3,
                            maxLength: 255
                        ),
                        new OA\Property(
                            property: "description",
                            type: "string",
                            description: "Detailed description of the class"
                        ),
                        new OA\Property(
                            property: "profile-picture",
                            type: "string",
                            format: "binary",
                            description: "Profile picture file",
                            nullable: true
                        ),
                        new OA\Property(
                            property: "banner",
                            type: "string",
                            format: "binary",
                            description: "Banner image file",
                            nullable: true
                        )
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Created class details",
                content: new OA\JsonContent(ref: "#/components/schemas/ClassModelDto")
            ),
            new OA\Response(
                response: 400,
                description: "Invalid input",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function createClass()
    {
    }

    #[OA\Get(
        path: "/institutions/{institution_id}/classes/{class_id}",
        tags: ["Classes"],
        summary: "Get class details",
        description: "Retrieve details of a specific class",
        operationId: "getClassById",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID of the institution",
                schema: new OA\Schema(type: "string", format: "uuid")
            ),
            new OA\Parameter(
                name: "class_id",
                in: "path",
                required: true,
                description: "ID of the class",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Class details",
                content: new OA\JsonContent(ref: "#/components/schemas/ClassModelDto")
            ),
            new OA\Response(
                response: 404,
                description: "Class not found",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function getClassById()
    {
    }

    #[OA\Put(
        path: "/institutions/{institution_id}/classes/{class_id}",
        tags: ["Classes"],
        summary: "Update a class",
        description: "Update details of an existing class",
        operationId: "updateClass",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID of the institution",
                schema: new OA\Schema(type: "string", format: "uuid")
            ),
            new OA\Parameter(
                name: "class_id",
                in: "path",
                required: true,
                description: "ID of the class",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        requestBody: new OA\RequestBody(
            description: "Class update data",
            required: true,
            content: new OA\JsonContent(
                required: ["name", "description"],
                properties: [
                    new OA\Property(
                        property: "name",
                        type: "string",
                        description: "Updated name of the class",
                        minLength: 3,
                        maxLength: 255
                    ),
                    new OA\Property(
                        property: "description",
                        type: "string",
                        description: "Updated description of the class"
                    ),
                    new OA\Property(
                        property: "profile_picture_id",
                        type: "string",
                        format: "uuid",
                        description: "ID of the new profile picture",
                        nullable: true
                    ),
                    new OA\Property(
                        property: "banner_id",
                        type: "string",
                        format: "uuid",
                        description: "ID of the new banner image",
                        nullable: true
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Updated class details",
                content: new OA\JsonContent(ref: "#/components/schemas/ClassModelDto")
            ),
            new OA\Response(
                response: 400,
                description: "Invalid input",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Class or file not found",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function updateClass()
    {
    }

    #[OA\Delete(
        path: "/institutions/{institution_id}/classes/{class_id}",
        tags: ["Classes"],
        summary: "Delete a class",
        description: "Permanently delete a class",
        operationId: "deleteClass",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID of the institution",
                schema: new OA\Schema(type: "string", format: "uuid")
            ),
            new OA\Parameter(
                name: "class_id",
                in: "path",
                required: true,
                description: "ID of the class to delete",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Class deleted successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: "message",
                            type: "string",
                            description: "Confirmation message"
                        )
                    ],
                    type: "object"
                )
            ),
            new OA\Response(
                response: 404,
                description: "Class not found",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Internal server error",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
    public function deleteClass()
    {
    }
}