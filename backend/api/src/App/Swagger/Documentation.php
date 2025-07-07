<?php

namespace App\Swagger;

use OpenApi\Attributes as OA;

#[OA\SecurityScheme(
  securityScheme: "bearerAuth",
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT"
)]
#[OA\Info(title: 'Documentação de API da aplicação Intellecta', version: '0.1')]
class Documentation {}
