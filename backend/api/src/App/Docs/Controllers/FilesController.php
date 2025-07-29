<?php
declare(strict_types=1);

namespace App\Docs\Controllers;

use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Files',
    description: 'File upload and management operations'
)]
class FilesController
{
    #[OA\Post(
        path: '/files/upload-profile-assets',
        operationId: 'uploadProfileAsset',
        summary: 'Upload profile asset',
        description: 'Upload an image file to be used as a profile picture or banner',
        tags: ['Files'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            description: 'Profile image file',
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
                            description: 'Image file for profile (avatar, banner, etc.)'
                        )
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'File uploaded successfully',
                content: new OA\JsonContent(ref: '#/components/schemas/FileResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'No file provided or invalid file'
            ),
            new OA\Response(
                response: 415,
                description: 'Unsupported media type - must be an image'
            ),
            new OA\Response(
                response: 500,
                description: 'File upload failed'
            )
        ]
    )]
    public function uploadProfileAssets()
    {
    }

    #[OA\Post(
        path: '/files/upload-file',
        operationId: 'uploadFile',
        summary: 'Upload a generic file',
        description: 'Upload any type of file with automatic type detection',
        tags: ['Files'],
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            description: 'File to upload',
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
                            description: 'File to upload'
                        )
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'File uploaded successfully',
                content: new OA\JsonContent(ref: '#/components/schemas/FileResponse')
            ),
            new OA\Response(
                response: 400,
                description: 'No file provided'
            ),
            new OA\Response(
                response: 413,
                description: 'File too large'
            ),
            new OA\Response(
                response: 500,
                description: 'File upload failed'
            )
        ]
    )]
    public function uploadFile()
    {
    }
}