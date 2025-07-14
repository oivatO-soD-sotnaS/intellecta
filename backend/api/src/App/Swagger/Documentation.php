<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "ErrorResponse",
    properties: [
        new OA\Property(property: "error", type: "string"),
        new OA\Property(property: "code", type: "integer")
    ]
)]
#[OA\SecurityScheme(
  securityScheme: "bearerAuth",
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT"
)]
#[OA\Info(title: 'Documentação de API da aplicação Intellecta', version: '0.1')]
class Documentation {}
