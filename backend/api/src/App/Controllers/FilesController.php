<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Enums\FileType;
use App\Models\File;
use App\Services\LogService;
use App\Services\UploadService;
use App\Services\ValidatorService;
use App\Vo\ProfileAssetVo;
use Psr\Http\Message\UploadedFileInterface;
use Ramsey\Uuid\Uuid;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Documented
readonly class FilesController extends BaseController
{
    public function __construct(
      private readonly UploadService $uploadService,
      private readonly FilesDao $fileDao,
      private ValidatorService $validatorService
    ) {}

    public function uploadProfileAssets(Request $request, Response $response): Response
    {
      return $this->handleErrors($request, function() use ($request, $response) {
        $uploadedFiles = $request->getUploadedFiles();
        
        $this->validatorService->validateRequired($uploadedFiles, ['profile-asset']);
        
        /** @var UploadedFileInterface|null $profileAsset */
        $profileAsset = $uploadedFiles['profile-asset'];

        $profileAsset = new ProfileAssetVo($profileAsset);
        $fileUrl = $this->uploadService->upload(
          $profileAsset->getExtension(), 
          $profileAsset->getContent()
        );

        $file = $this->fileDao->createFile(new File([
          "file_id" => Uuid::uuid4()->toString(),
          "url" => $fileUrl,
          "filename" => $profileAsset->getSafeFilename(),
          "mime_type" => $profileAsset->getMimeType(),
          "file_type" => FileType::Image->value, 
          "size" => $profileAsset->getSize(),
          "uploaded_at" => date('Y-m-d H:i:s')
        ]));

        $response->getBody()->write(json_encode($file));
        
        LogService::info('/files/upload-profile-assets', "Profile asset uploaded successfully!");
        return $response;
      });
    }
}