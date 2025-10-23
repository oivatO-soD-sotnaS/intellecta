<?php
declare(strict_types= 1);

namespace App\Controllers;

use App\Dao\ClassesDao;
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
use InvalidArgumentException;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Documented
readonly class ClassesController extends BaseController {
    public function __construct(
        private ClassesDao $classesDao,
        private FilesDao $filesDao,
        private UploadService $uploadService,
        private ValidatorService $validatorService
    ) {}

    public function getInstitutionclasses(Request $request, Response $response, string $institution_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
            /** @var InstitutionUser $membership */
            $membership = $request->getAttribute('membership');
            $user = $request->getAttribute('user');

            // If admin: fetches all classes, else; only the ones the user participates. 
            $classes = $membership->getRole() === InstitutionUserType::Admin->value
                ? $this->classesDao->getClassesByInstitutionId($institution_id)
                : $this->classesDao->getClassesByUserIdAndInstitutionId($user->getUserId(), $institution_id);

            if(count($classes) === 0) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
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
            $user = $request->getAttribute('user');

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

            $class = $this->classesDao->createClass(new ClassModel([
                "class_id" => Uuid::uuid4()->toString(),
                "name" => $name->getValue(),
                "description" => $description->getValue(),
                "profile_picture_id" => $profilePictureFile?->getFileId(),
                "banner_id" => $bannerFile?->getFileId(),
                "institution_id" => $institution_id
            ]));
            
            $classDto = new ClassModelDto($class, $profilePictureFile, $bannerFile);
            $response->getBody()->write(json_encode($classDto, JSON_PRETTY_PRINT));

            LogService::info(
                "/institutions/{$institution_id}/classes", 
                "User {$user->getUserId()} create the {$class->getName()} class"
            );
            return $response;
        });
    }

    public function getClassById(Request $request, Response $response, string $institution_id, string $class_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $class_id) {
             /** @var InstitutionUser $membership */
            $membership = $request->getAttribute('membership');
            $user = $request->getAttribute('user');
            
            $class = $membership->getRole() !== InstitutionUserType::Admin->value
                ? $this->classesDao->getClassByUserIdAndClassId($user->getUserId(), $class_id)
                : $this->classesDao->getClassById($class_id);

            if(empty($class)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }
            
            if($class->getInstitutionId() !== $institution_id) {
                LogService::warn("/institutions/{$institution_id}/classes/{$class_id}", "{$user->getUserId()} tried to fetch a class of another institution.");
                throw new HttpNotFoundException($request, LogService::HTTP_404);
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
            $user = $request->getAttribute('user');

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

            $class = $this->classesDao->getClassById($class_id);
            
            if (empty($class)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            if($class->getInstitutionId() !== $institution_id) {
                LogService::warn("/institutions/{$institution_id}/classes/{$class_id}", "{$user->getUserId()} tried to update a class of another institution.");
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            if($profilePictureId !== null) {
                $profilePicture = $this->filesDao->getFileById($profilePictureId->getValue());
                
                if (empty($profilePicture)) {
                    throw new HttpNotFoundException($request, LogService::HTTP_404 . "Profile picture not found");
                }
                if ($profilePicture->getFileType()->value !== FileType::Image->value) {
                    throw new InvalidArgumentException("Profile picture must be an image");
                }

                $class->setProfilePictureId($profilePicture->getFileId());
            }
            
            if($bannerId !== null) {
                $banner = $this->filesDao->getFileById($bannerId->getValue());
                
                if (empty($banner)) {
                    throw new HttpNotFoundException($request, LogService::HTTP_404 . "Banner not found");
                }
                if ($banner->getFileType()->value !== FileType::Image->value) {
                    throw new InvalidArgumentException("Banner must be an image");
                }

                $class->setBannerId($banner->getFileId());
            }
            
            $class->setName($name->getValue());
            $class->setDescription($description->getValue());

            $this->classesDao->updateClass($class);

            $classProfilePicture = $class->getProfilePictureId()
                ? $this->filesDao->getFileById($class->getProfilePictureId())
                : null;
            $classBanner = $class->getBannerId()
                ? $this->filesDao->getFileById($class->getBannerId())
                : null;

            $classDto = new ClassModelDto($class, $classProfilePicture, $classBanner);
            $response->getBody()->write(json_encode($classDto));

            LogService::info("/institutions/{$institution_id}/classes/{$class_id}","{$user->getUserId()} altered the {$class->getName()} class");
            return $response;
        });

    }

    public function deleteClass(Request $request, Response $response, string $institution_id, string $class_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $class_id) {
            $user = $request->getAttribute('user');
            
            $class = $this->classesDao->getClassById($class_id);
            if (empty($class)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            if($class->getInstitutionId() !== $institution_id) {
                LogService::warn("/institutions/{$institution_id}/classes/{$class_id}", "{$user->getUserId()} tried to delete a class of another institution.");
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $success = $this->classesDao->deleteClass($class->getClassId());

            if(!$success) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $response->getBody()->write(json_encode([
                "message" => "Class {$class->getName()} deleted successfully!"
            ]));

            LogService::info("/institutions/{$institution_id}/classes/{$class_id}", "{$user->getUserId()} deleted the class {$class->getName()}");
            return $response;
        });
    }
}