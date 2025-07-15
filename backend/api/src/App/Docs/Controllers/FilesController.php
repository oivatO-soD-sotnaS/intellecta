<?php
namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(name: "Arquivos", description: "Operações relacionadas a arquivos de usuários, instituições, turmas e disciplinas")]
class FilesController {

  #[OA\Post(
        path: "/files/upload-profile-assets",
        tags: ["Arquivos"],
        summary: "Upload de foto de perfil/banner do usuário/instituição/etc",
        description: "Faz upload de um novo ativo de perfil (imagem de perfil ou banner)",
        operationId: "uploadProfilePicture",
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            description: "Arquivo de imagem para upload",
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(
                            property: "profile-asset",
                            type: "string",
                            format: "binary",
                            description: "Ativo de perfil (formatos: jpg, jpeg, png)"
                        )
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Upload realizado com sucesso",
                content: new OA\JsonContent(ref: "#/components/schemas/FileResponse")
            ),
            new OA\Response(
                response: 400,
                description: "Arquivo inválido ou ausente",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 422,
                description: "Validação falhou",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            ),
            new OA\Response(
                response: 500,
                description: "Erro interno do servidor",
                content: new OA\JsonContent(ref: "#/components/schemas/ErrorResponse")
            )
        ]
    )]
  public function uploadProfileAssets() {}
}