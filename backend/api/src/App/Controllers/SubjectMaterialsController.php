<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\SubjectMaterialsDao;
use App\Dao\SubjectsDao;
use App\Dto\MaterialDto;
use App\Enums\FileType;
use App\Models\File;
use App\Models\Material;
use App\Services\LogService;
use App\Services\UploadService;
use App\Services\ValidatorService;
use App\Vo\FileVo;
use App\Vo\MaterialTitleVo;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

readonly class SubjectMaterialsController extends BaseController {
    public function __construct(
        private SubjectsDao $subjectsDao,
        private SubjectMaterialsDao $subjectMaterialsDao,
        private FilesDao $filesDao,
        private ValidatorService $validatorService,
        private UploadService $uploadService
    ) {}

    public function getSubjectMaterials(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            $subjectMaterials = $this->subjectMaterialsDao->getMaterialsBySubjectId($subject_id);
            
            if(count($subjectMaterials) === 0) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $subjectMaterialsDtos = array_map(function(Material $material) {
                $file = $this->filesDao->getFileById($material->getFileId());
                return new MaterialDto($material, $file);
            }, $subjectMaterials);

            $response->getBody()->write(json_encode($subjectMaterialsDtos));
            return $response;
        });
    }

    public function createSubjectMaterial(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            $token = $request->getAttribute('token');

            $body = $request->getParsedBody();
            $uploadedFiles = $request->getUploadedFiles();

            $this->validatorService->validateRequired($body, ['title']);
            $this->validatorService->validateRequired($uploadedFiles, ['material_file']);

            $materialTitle = new MaterialTitleVo($body['title']);
            $materialFile = new FileVo($uploadedFiles['material_file']);

            $timestamp = date('Y-m-d H:i:s');

            $fileUrl = $this->uploadService->upload(
                $materialFile->getExtension(),
                $materialFile->getContent()
            );

            $file = $this->filesDao->createFile(new File([
                "file_id" => Uuid::uuid4()->toString(),
                "url" => $fileUrl,
                "filename" => $materialFile->getSafeFilename(),
                "mime_type" => $materialFile->getMimeType(),
                "file_type" => FileType::tryFrom($materialFile->getType())->value,
                "size" => $materialFile->getSize(),
                "uploaded_at" => $timestamp,
            ]));

            $subjectMaterial = $this->subjectMaterialsDao->createMaterial(new Material([
                "material_id" => Uuid::uuid4()->toString(),
                "title" => $materialTitle->getValue(),
                "created_at" => $timestamp,
                "changed_at" => $timestamp,
                "subject_id" => $subject_id,
                "file_id" => $file->getFileId()
            ]));

            $subjectMaterialDto = new MaterialDto($subjectMaterial, $file);

            $response->getBody()->write(json_encode($subjectMaterialDto));

            LogService::info("/institutions/{$institution_id}/subjects/{$subject_id}/materials", "{$token['email']} created a new '{$subjectMaterial->getTitle()}' material for the {$subject_id} subject");
            return $response;
        });
    }

    public function getMaterialById(Request $request, Response $response, string $institution_id, string $subject_id, string $material_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $material_id) {
            $material = $this->subjectMaterialsDao->getMaterialById($material_id);
            
            if(
                empty($material)
                || $material->getSubjectId() !== $subject_id
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $file = $this->filesDao->getFileById($material->getFileId());

            $subjectMaterialDto = new MaterialDto($material, $file);

            $response->getBody()->write(json_encode($subjectMaterialDto));

            return $response;
        });   
    }

    public function updateMaterial(Request $request, Response $response, string $institution_id, string $subject_id, string $material_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $material_id) {
            $token = $request->getAttribute('token');

            $material = $this->subjectMaterialsDao->getMaterialById($material_id);
            
            if(
                empty($material)
                || $material->getSubjectId() !== $subject_id
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $body = $request->getParsedBody();
            $this->validatorService->validateRequired($body, ["title"]);

            $newTitle = new MaterialTitleVo($body["title"]);
            $timestamp = date('Y-m-d H:i:s');
            $material->setTitle($newTitle->getValue());
            $material->setChangedAt($timestamp);

            $material = $this->subjectMaterialsDao->updateMaterial($material);

            if(empty($material)) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $file = $this->filesDao->getFileById($material->getFileId());

            $subjectMaterialDto = new MaterialDto($material, $file);

            $response->getBody()->write(json_encode($subjectMaterialDto));

            LogService::info("/institutions/{$institution_id}/subjects/{$subject_id}/materials/{$material_id}", "{$token['email']} update the {$material->getTitle()} material");
            return $response;
        });
    }

    public function deleteMaterial(Request $request, Response $response, string $institution_id, string $subject_id, string $material_id): Response {
         return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $material_id) {
            $token = $request->getAttribute('token');

            $material = $this->subjectMaterialsDao->getMaterialById($material_id);
            
            if(
                empty($material)
                || $material->getSubjectId() !== $subject_id
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $success = $this->subjectMaterialsDao->deleteMaterialById($material->getMaterialId());
            
            if(!$success) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $response->getBody()->write(json_encode([
                "message" => "Material '{$material->getTitle()}' deleted successfully!"
            ]));

            LogService::info("/institutions/{$institution_id}/subjects/{$subject_id}/materials/{$material_id}", "{$token['email']} deleted the material '{$material->getTitle()}'");
            return $response;
        });
    }
}