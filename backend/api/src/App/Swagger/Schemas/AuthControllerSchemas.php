<?php

namespace App\Swagger\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "SignUpRequest",
    required: ["full_name", "email", "password"],
    properties: [
        new OA\Property(property: "full_name", type: "string", example: "João da Silva", minLength: 3, maxLength: 255),
        new OA\Property(property: "email", type: "string", format: "email", example: "joao@example.com"),
        new OA\Property(property: "password", type: "string", format: "password", example: "SenhaSegura123!", minLength: 8)
    ]
)]
#[OA\Schema(
    schema: "SignUpResponse",
    properties: [
        new OA\Property(property: "message", type: "string", example: "User account created. Verify your e-mail to continue the sign-up process")
    ]
)]
#[OA\Schema(
    schema: "VerifyEmailRequest",
    required: ["email", "verification_code"],
    properties: [
        new OA\Property(property: "email", type: "string", format: "email", example: "joao@example.com"),
        new OA\Property(property: "verification_code", type: "string", example: "123456")
    ]
)]
#[OA\Schema(
    schema: "SignInRequest",
    required: ["email", "password"],
    properties: [
        new OA\Property(property: "email", type: "string", format: "email", example: "joao@example.com"),
        new OA\Property(property: "password", type: "string", format: "password", example: "SenhaSegura123!")
    ]
)]

#[OA\Schema(
    schema: "AuthResponse",
    properties: [
        new OA\Property(property: "token", type: "string", description: "JWT token for authenticated requests"),
        new OA\Property(property: "user", ref: "#/components/schemas/UserResponse")
    ]
)]
#[OA\Schema(
    schema: "VerifyEmailResponse",
    properties: [
        new OA\Property(property: "message", type: "string", example: "User account successfully verified!"),
        new OA\Property(property: "token", type: "string", description: "JWT token for authenticated requests"),
        new OA\Property(property: "user", ref: "#/components/schemas/UserResponse")
    ]
)]
#[OA\Schema(
    schema: "SignOutResponse",
    properties: [
        new OA\Property(property: "status", type: "string", example: "success"),
        new OA\Property(property: "message", type: "string", example: "Token blacklisted with success")
    ]
)]
class AuthControllerSchemas {}