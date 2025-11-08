<?php
namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(name: "Instituições", description: "Operações relacionadas a instituições")]
class InstitutionsController {

  #[OA\Get(
    path: "/institutions/owned",
    tags: ["Instituições"],
    summary: "Obter instituições do usuário",
    description: "Retorna todas as instituições que o usuário autenticado é proprietário",
    operationId: "getUserInstitutions",
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(
            response: 200,
            description: "Lista de instituições do usuário",
            content: new OA\JsonContent(
                type: "array",
                items: new OA\Items(ref: "#/components/schemas/InstitutionResponse")
            )
        ),
        new OA\Response(
            response: 401,
            description: "Não autorizado",
            content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
        ),
        new OA\Response(
            response: 404,
            description: "Usuário não é dono de nenhuma instituição",
            content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
        ),
        new OA\Response(
            response: 500,
            description: "Erro interno do servidor",
            content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
        )
    ]
  )]
  public function getUserInstitutions() {}

  #[OA\Get(
        path: "/institutions/summaries",
        tags: ["Instituições"],
        summary: "Listar resumos de instituições",
        description: "Retorna resumos de todas as instituições do usuário autenticado",
        operationId: "getInstitutionsSummary",
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de resumos de instituições",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/InstitutionSummaryResponse")
                )
            ),
            new OA\Response(
                response: 404,
                description: "Nenhuma instituição encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getInstitutionsSummary() {}

  #[OA\Get(
        path: "/institutions/{institution_id}/summary",
        tags: ["Instituições"],
        summary: "Obter resumo de uma instituição",
        description: "Retorna o resumo de uma instituição específica do usuário autenticado",
        operationId: "getInstitutionSummaryById",
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID da instituição",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Resumo da instituição",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionSummaryResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Instituição não encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getInstitutionSummaryById() {}

  #[OA\Get(
        path: "/institutions",
        tags: ["Instituições"],
        summary: "Listar instituições do usuário",
        description: "Retorna todas as instituições em que o usuário autenticado participa",
        operationId: "getInstitutions",
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Lista de instituições",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/InstitutionResponse")
                )
            ),
            new OA\Response(
                response: 404,
                description: "Nenhuma instituição encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getInstitutions() {}

  #[OA\Get(
        path: "/institutions/{institution_id}",
        tags: ["Instituições"],
        summary: "Obter detalhes de uma instituição",
        description: "Retorna os detalhes completos de uma instituição específica",
        operationId: "getInstitutionById",
        parameters: [
            new OA\Parameter(
                name: "institution_id",
                in: "path",
                required: true,
                description: "ID da instituição",
                schema: new OA\Schema(type: "string", format: "uuid")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Detalhes da instituição",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionResponse")
            ),
            new OA\Response(
                response: 404,
                description: "Instituição não encontrada",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function getInstitutionById() {}

  #[OA\Post(
        path: "/institutions",
        tags: ["Instituições"],
        summary: "Criar nova instituição",
        description: "Cria uma nova instituição para o usuário autenticado (limite de 3 instituições por usuário)",
        operationId: "createInstitution",
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Dados da instituição e arquivos de imagem",
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["name", "description"],
                    properties: [
                        new OA\Property(property: "name", type: "string", minLength: 3, maxLength: 255),
                        new OA\Property(property: "description", type: "string"),
                        new OA\Property(
                            property: "profile-picture",
                            type: "string",
                            format: "binary",
                            description: "Imagem de perfil da instituição"
                        ),
                        new OA\Property(
                            property: "banner",
                            type: "string",
                            format: "binary",
                            description: "Banner da instituição"
                        )
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Instituição criada com sucesso",
                content: new OA\JsonContent(ref: "#/components/schemas/InstitutionResponse")
            ),
            new OA\Response(
                response: 400,
                description: "Dados inválidos",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 403,
                description: "Limite de instituições atingido",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function createInstitution() {}

  #[OA\Put(
    path: "/institutions/{institution_id}",
    tags: ["Instituições"],
    summary: "Atualizar instituição",
    description: "Atualiza os dados de uma instituição. Apenas administradores podem atualizar.",
    operationId: "updateInstitution",
    security: [["bearerAuth" => []]],
    parameters: [
      new OA\Parameter(
        name: "institution_id",
        in: "path",
        required: true,
        description: "ID da instituição",
        schema: new OA\Schema(type: "string", format: "uuid")
      )
    ],
    requestBody: new OA\RequestBody(
      required: true,
      description: "Dados da instituição e arquivos de imagem (ao menos um campo deve ser enviado)",
      content: new OA\MediaType(
        mediaType: "multipart/form-data",
        schema: new OA\Schema(
          properties: [
            new OA\Property(property: "name", type: "string", minLength: 3, maxLength: 255),
            new OA\Property(property: "description", type: "string"),
            new OA\Property(
              property: "profile-picture",
              type: "string",
              format: "binary",
              description: "Imagem de perfil da instituição"
            ),
            new OA\Property(
              property: "banner",
              type: "string",
              format: "binary",
              description: "Banner da instituição"
            )
          ]
        )
      )
    ),
    responses: [
      new OA\Response(
        response: 200,
        description: "Instituição atualizada com sucesso",
        content: new OA\JsonContent(ref: "#/components/schemas/InstitutionResponse")
      ),
      new OA\Response(
        response: 403,
        description: "Usuário não é administrador da instituição",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      ),
      new OA\Response(
        response: 404,
        description: "Instituição não encontrada",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      ),
      new OA\Response(
        response: 422,
        description: "Dados inválidos ou ausentes",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      ),
      new OA\Response(
        response: 500,
        description: "Erro interno do servidor",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      )
    ]
  )]
  public function updateInstitution() {}

  #[OA\Delete(
    path: "/institutions/{institution_id}",
    tags: ["Instituições"],
    summary: "Excluir instituição",
    description: "Exclui uma instituição. Apenas administradores podem excluir.",
    operationId: "deleteInstitution",
    security: [["bearerAuth" => []]],
    parameters: [
      new OA\Parameter(
        name: "institution_id",
        in: "path",
        required: true,
        description: "ID da instituição",
        schema: new OA\Schema(type: "string", format: "uuid")
      )
    ],
    responses: [
      new OA\Response(
        response: 204,
        description: "Instituição excluída com sucesso"
      ),
      new OA\Response(
        response: 403,
        description: "Usuário não é administrador da instituição",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      ),
      new OA\Response(
        response: 404,
        description: "Instituição não encontrada",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      ),
      new OA\Response(
        response: 500,
        description: "Erro interno do servidor",
        content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
      )
    ]
  )]
  public function deleteInstitution() {}
}