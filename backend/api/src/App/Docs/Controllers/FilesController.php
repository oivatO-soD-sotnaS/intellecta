<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Files',
    description: 'Operações de upload e gerenciamento de arquivos'
)]
class FilesController
{
    #[OA\Post(
        path: '/files/upload-profile-assets',
        operationId: 'uploadProfileAsset',
        summary: 'Fazer upload de ativo de perfil',
        description: 'Fazer upload de um arquivo de imagem para ser usado como foto do perfil ou banner',
        tags: ['Files'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            description: 'Arquivo de imagem de perfil',
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    required: ['profile-asset'],
                    properties: [
                        new OA\Property(
                            property: 'profile-asset',
                            type: 'string',
                            format: 'binary',
                            description: 'Arquivo de imagem para o perfil (avatar, banner, etc.)'
                        )
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Arquivo enviado com sucesso',
                content: new OA\JsonContent(ref: '#/components/schemas/FileResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'Nenhum arquivo fornecido ou arquivo inválido'
            ),
            new OA\Response(
                response: 415,
                description: 'Tipo de mídia não suportado - deve ser uma imagem'
            ),
            new OA\Response(
                response: 500,
                description: 'Falha ao enviar o arquivo'
            )
        ]
    )]
    public function uploadProfileAssets()
    {
    }

    #[OA\Post(
        path: '/files/upload-file',
        operationId: 'uploadFile',
        summary: 'Fazer upload de um arquivo genérico',
        description: 'Enviar um arquivo de qualquer tipo com detecção automática de tipo',
        tags: ['Files'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            description: 'Arquivo a ser enviado',
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    required: ['file'],
                    properties: [
                        new OA\Property(
                            property: 'file',
                            type: 'string',
                            format: 'binary',
                            description: 'Arquivo a ser enviado'
                        )
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Arquivo enviado com sucesso',
                content: new OA\JsonContent(ref: '#/components/schemas/FileResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'Nenhum arquivo fornecido'
            ),
            new OA\Response(
                response: 413,
                description: 'Arquivo muito grande'
            ),
            new OA\Response(
                response: 500,
                description: 'Falha ao enviar o arquivo'
            )
        ]
    )]
    public function uploadFile()
    {
    }
}