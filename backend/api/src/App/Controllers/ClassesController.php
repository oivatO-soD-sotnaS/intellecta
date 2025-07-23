<?php
declare(strict_types= 1);

namespace App\Controllers;

use App\Dao\ClassDao;
use App\Dao\FilesDao;
use App\Dto\ClassModelDto;
use App\Enums\FileType;
use App\Enums\InstitutionUserType;
use App\Models\ClassModel;
use App\Models\File;
use App\Models\InstitutionUser;
use App\Services\LogService;
use App\Services\UploadService;
use App\Services\ValidatorService;
use App\Vo\ClassDescriptionVo;
use App\Vo\ClassNameVo;
use App\Vo\ProfileAssetVo;
use App\Vo\UuidV4Vo;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Documented
class ClassesController extends BaseController {
    public function __construct(
        private ClassDao $classDao,
        private FilesDao $filesDao,
        private UploadService $uploadService,
        private ValidatorService $validatorService
    ) {}

    public function getInstitutionclasses(Request $request, Response $response, string $institution_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
            /** @var InstitutionUser $membership */
            $membership = $request->getAttribute('membership');
            $token = $request->getAttribute('token');

            // If admin: fetches all classes, else; only the ones the user participates. 
            $classes = $membership->getRole() === InstitutionUserType::Admin->value
                ? $this->classDao->getAllInstitutionclasses($institution_id)
                : $this->classDao->getClassesByUserIdAndInstitutionId($token['sub'], $institution_id);

            if(count($classes) === 0) {
                throw new HttpNotFoundException($request, "There are no classes to be fetched");
            }
            
            $classesDto = array_map(function(ClassModel $classModel) {
                $profilePicture = $classModel->getProfilePictureId()
                    ? $this->filesDao->getFileById($classModel->getProfilePictureId())
                    : null;
                $banner = $classModel->getBannerId()
                    ? $this->filesDao->getFileById($classModel->getBannerId())
                    : null;

                return new ClassModelDto($classModel, $profilePicture, $banner);
            }, $classes);

            $response->getBody()->write(json_encode($classesDto));

            return $response;
        });
    }

    public function createClass(Request $request, Response $response, string $institution_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
            $token = $request->getAttribute('token');

            $body = $request->getParsedBody();
            $uploadedFiles = $request->getUploadedFiles();

            $this->validatorService->validateRequired($body, ['name', 'description']);

            // Required parameters
            $name = new ClassNameVo($body["name"]);
            $description = new ClassDescriptionVo($body["description"]);

            // Optional parameters
            $profilePicture = !empty($uploadedFiles['profile-picture']) 
                ? new ProfileAssetVo($uploadedFiles['profile-picture'])
                : null;

            $banner = !empty($uploadedFiles['banner'])
                ? new ProfileAssetVo($uploadedFiles['banner'])
                : null;

            $timestamp = date('Y-m-d H:i:s');
            
            if($profilePicture !== null) {
                $fileUrl = $this->uploadService->upload(
                    $profilePicture->getExtension(), 
                    $profilePicture->getContent()
                );

                $profilePictureFile = $this->filesDao->createFile(new File([
                    "file_id" => Uuid::uuid4()->toString(),
                    "url" => $fileUrl,
                    "filename" => $profilePicture->getSafeFilename(),
                    "mime_type" => $profilePicture->getMimeType(),
                    "size" => $profilePicture->getSize(),
                    "file_type" => FileType::Image->value,
                    "uploaded_at" => $timestamp
                ]));
            }
            if($banner !== null) {
                $fileUrl = $this->uploadService->upload(
                    $banner->getExtension(), 
                    $banner->getContent()
                );

                $bannerFile = $this->filesDao->createFile(new File([
                    "file_id" => Uuid::uuid4()->toString(),
                    "url" => $fileUrl,
                    "filename" => $banner->getSafeFilename(),
                    "mime_type" => $banner->getMimeType(),
                    "size" => $banner->getSize(),
                    "file_type" => FileType::Image->value,
                    "uploaded_at" => $timestamp
                ]));
            }

            $class = $this->classDao->createClass(new ClassModel([
                "class_id" => Uuid::uuid4()->toString(),
                "name" => $name->getValue(),
                "description" => $description->getValue(),
                "profile_picture_id" => $profilePictureFile?->getFileId(),
                "banner_id" => $bannerFile?->getFileId(),
                "institution_id" => $institution_id
            ]));
            
            $classDto = new ClassModelDto($class, $profilePictureFile, $bannerFile);
            $response->getBody()->write(json_encode($classDto, JSON_PRETTY_PRINT));

            LogService::info("/institutions/{$institution_id}/classes", "User {$token['email']} create the {$class->getName()} class");
            return $response;
        });
    }

    public function getClassById(Request $request, Response $response, string $institution_id, string $class_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $class_id) {
             /** @var InstitutionUser $membership */
            $membership = $request->getAttribute('membership');
            $token = $request->getAttribute('token');
            
            $class = $membership->getRole() !== InstitutionUserType::Admin->value
                ? $this->classDao->getClassByUserIdAndClassId($token['sub'], $class_id)
                : $this->classDao->getClassById($class_id);

            if(empty($class)) {
                throw new HttpNotFoundException($request, "Class not found");
            }
            
            if($class->getInstitutionId() !== $institution_id) {
                LogService::warn("/institutions/{$institution_id}/classes/{$class_id}", "{$token['email']} tried to fetch a class of another institution.");
                throw new HttpNotFoundException($request, "Class not found");
            }

            $classProfilePicture = $class->getProfilePictureId()
                ? $this->filesDao->getFileById($class->getProfilePictureId())
                : null;
            $classBanner = $class->getBannerId()
                ? $this->filesDao->getFileById($class->getBannerId())
                : null;

            $classDto = new ClassModelDto($class, $classProfilePicture, $classBanner);
            $response->getBody()->write(json_encode($classDto));

            return $response;
        });
    }
    public function updateClass(Request $request, Response $response, string $institution_id, string $class_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $class_id) {
            $token= $request->getAttribute('token');

            $body = $request->getParsedBody();
            $this->validatorService->validateRequired($body, ['name', 'description']);

            // Required parameters
            $name = new ClassNameVo($body["name"]);
            $description = new ClassDescriptionVo($body["description"]);            
            
            // Optional parameters
            $profilePictureId = !empty($body["profile_picture_id"]) 
                ? new UuidV4Vo($body["profile_picture_id"])
                : null;

            $bannerId = !empty($body["banner_id"])
                ? new UuidV4Vo($body["banner_id"])
                : null;

            $class = $this->classDao->getClassById($class_id);
            
            if (empty($class)) {
                throw new HttpNotFoundException($request, "Class not found");
            }

            if($class->getInstitutionId() !== $institution_id) {
                LogService::warn("/institutions/{$institution_id}/classes/{$class_id}", "{$token['email']} tried to update a class of another institution.");
                throw new HttpNotFoundException($request, "Class not found");
            }

            if($profilePictureId !== null) {
                $profilePicture = $this->filesDao->getFileById($profilePictureId->getValue());
                
                if (empty($profilePicture)) {
                    throw new HttpNotFoundException($request, "Profile picture not found");
                }
                if ($profilePicture->getFileType()->value !== 'image') {
                    throw new HttpException($request, "Profile picture must be an image", 422);
                }

                $class->setProfilePictureId($profilePicture->getFileId());
            }
            
            if($bannerId !== null) {
                $banner = $this->filesDao->getFileById($bannerId->getValue());
                
                if (empty($banner)) {
                    throw new HttpNotFoundException($request, "Banner not found");
                }
                if ($banner->getFileType()->value !== 'image') {
                    throw new HttpException($request, "Banner must be an image", 422);
                }

                $class->setBannerId($banner->getFileId());
            }
            
            $class->setName($name->getValue());
            $class->setDescription($description->getValue());

            $this->classDao->updateClass($class);

            $classProfilePicture = $class->getProfilePictureId()
                ? $this->filesDao->getFileById($class->getProfilePictureId())
                : null;
            $classBanner = $class->getBannerId()
                ? $this->filesDao->getFileById($class->getBannerId())
                : null;

            $classDto = new ClassModelDto($class, $classProfilePicture, $classBanner);
            $response->getBody()->write(json_encode($classDto));

            LogService::info("/institutions/{$institution_id}/classes/{$class_id}","{$token['email']} altered the {$class->getName()} class");
            return $response;
        });

    }

    public function deleteClass(Request $request, Response $response, string $institution_id, string $class_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $class_id) {
            $token = $request->getAttribute('token');
            
            $class = $this->classDao->getClassById($class_id);
            if (empty($class)) {
                throw new HttpNotFoundException($request, "Class not found");
            }

            if($class->getInstitutionId() !== $institution_id) {
                LogService::warn("/institutions/{$institution_id}/classes/{$class_id}", "{$token['email']} tried to delete a class of another institution.");
                throw new HttpNotFoundException($request, "Class not found");
            }

            $success = $this->classDao->deleteClass($class->getClassId());

            if(!$success) {
                throw new HttpInternalServerErrorException($request, "Could not delete class due to an unknown error.");
            }

            $response->getBody()->write(json_encode([
                "message" => "Class {$class->getName()} deleted successfully!"
            ]));

            LogService::info("/institutions/{$institution_id}/classes/{$class_id}", "{$token['email']} deleted the class {$class->getName()}");
            return $response;
        });
    }
}