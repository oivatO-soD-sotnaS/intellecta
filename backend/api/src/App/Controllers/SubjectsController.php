<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\FilesDao;
use App\Dao\InstitutionUsersDao;
use App\Dao\SubjectsDao;
use App\Dao\UsersDao;
use App\Dto\SubjectDto;
use App\Dto\UserDto;
use App\Enums\FileType;
use App\Enums\InstitutionUserType;
use App\Models\File;
use App\Models\InstitutionUser;
use App\Models\Subject;
use App\Services\LogService;
use App\Services\UploadService;
use App\Services\ValidatorService;
use App\Vo\ProfileAssetVo;
use App\Vo\SubjectDescriptionVo;
use App\Vo\SubjectNameVo;
use App\Vo\UuidV4Vo;
use InvalidArgumentException;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

// Documented
readonly class SubjectsController extends BaseController {
    public function __construct(
        private SubjectsDao $subjectsDao,
        private FilesDao $filesDao,
        private UsersDao $usersDao,
        private InstitutionUsersDao $institutionUsersDao,
        private ValidatorService $validatorService,
        private UploadService $uploadService
    ) {}

    public function getInstitutionSubjects(Request $request, Response $response, string $institution_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
            $subjects = $this->subjectsDao->getSubjectsByInstitutionId($institution_id);
    
            if(count($subjects) === 0) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $subjectsDtos = array_map(function(Subject $subject) {
                $teacher = $this->usersDao->getUserBydId($subject->getTeacherId());
                $teacherProfilePicture = $teacher->getProfilePictureId()
                    ? $this->filesDao->getFileById($teacher->getProfilePictureId())
                    : null;

                $teacherDto = new UserDto($teacher, $teacherProfilePicture);

                $profilePicture = $subject->getProfilePictureId()
                    ? $this->filesDao->getFileById($subject->getProfilePictureId())
                    : null;
                $banner = $subject->getBannerId()
                    ? $this->filesDao->getFileById($subject->getBannerId())
                    : null;
                
                return new SubjectDto(
                    $subject, 
                    $teacherDto, 
                    $profilePicture, 
                    $banner
                );
            }, $subjects);

            $response->getBody()->write(json_encode($subjectsDtos));
    
            return $response;
        });
        
    }

    public function createSubject(Request $request, Response $response, string $institution_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id) {
            /** @var InstitutionUser $membership */
            $membership = $request->getAttribute('membership');
            $token = $request->getAttribute('token');

            if (
                $membership->getRole() !== InstitutionUserType::Admin->value &&
                $membership->getRole() !== InstitutionUserType::Teacher->value
            ) {
                LogService::warn("/institutions/{$institution_id}/subjects", "{$token['email']} tried to create a class");
                throw new HttpForbiddenException($request, LogService::HTTP_403 . "Only admins and teachers can create subjects");
            }

            $body = $request->getParsedBody();
            $uploadedFiles = $request->getUploadedFiles();

            $this->validatorService->validateRequired($body, ["name", "description"]);

            // Required parameters
            $name = new SubjectNameVo($body["name"]);
            $description = new SubjectDescriptionVo($body["description"]);

            // Optional parameters
            $teacher_id = !empty($body["teacher_id"])
                ? new UuidV4Vo($body["teacher_id"])
                : null;

            if (
                $teacher_id !== null &&
                $membership->getRole() !== InstitutionUserType::Admin->value
            ) {
                throw new HttpForbiddenException($request, LogService::HTTP_403 . "Only admins can create subjects for other users");
            }

            $profilePicture = !empty($uploadedFiles['profile-picture']) 
                ? new ProfileAssetVo($uploadedFiles['profile-picture'])
                : null;

            $banner = !empty($uploadedFiles['banner'])
                ? new ProfileAssetVo($uploadedFiles['banner'])
                : null;

            $timestamp = date('Y-m-d H:i:s');

            if (!empty($profilePicture)) {
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

            if (!empty($banner)) {
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

            $teacher = null;

            if ($teacher_id !== null) {
                $teacher = $this->institutionUsersDao->getInstitutionUserByInstitutionIdAndUserId($institution_id, $teacher_id->getValue());

                if (empty($teacher)) {
                    throw new HttpNotFoundException($request, LogService::HTTP_404 . "User (teacher) with id {$teacher_id} was not found");
                }

                if (
                    $teacher->getRole() !== InstitutionUserType::Admin->value &&
                    $teacher->getRole() !== InstitutionUserType::Teacher->value
                ) {
                    LogService::http403("/institutions/{$institution_id}/subjects", "User with id {$teacher->getUserId()} is neither admin nor teacher.");
                    throw new HttpForbiddenException($request, LogService::HTTP_403 . "User (teacher) with id {$teacher->getUserId()} is neither admin nor teacher.");
                }
            }

            $subject = $this->subjectsDao->createSubject(new Subject([
                "subject_id" => Uuid::uuid4()->toString(),
                "name" => $name->getValue(),
                "description" => $description->getValue(),
                "profile_picture_id" => $profilePictureFile?->getFileId(),
                "banner_id" => $bannerFile?->getFileId(),
                "institution_id" => $institution_id,
                "teacher_id" => $teacher ? $teacher->getUserId() : $token["sub"],
            ]));

            $teacherUser = $this->usersDao->getUserBydId($teacher ? $teacher->getUserId() : $token['sub']);
            $teacherProfilePicture = $teacherUser->getProfilePictureId()
                ? $this->filesDao->getFileById($teacherUser->getProfilePictureId())
                : null;

            $teacherDto = new UserDto($teacherUser, $teacherProfilePicture);

            $subjectDto = new SubjectDto(
                $subject, 
                $teacherDto, 
                $profilePictureFile, 
                $bannerFile
            );

            $response->getBody()->write(json_encode([
                "message" => "Subject {$subject->getName()} added successfully!",
                "subject" => $subjectDto
            ]));

            LogService::info("/institutions/{$institution_id}/subjects", "{$token["email"]} created the {$subject->getName()} subject");
            return $response;
        });
    }

    public function getSubjectById(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            $subject = $this->subjectsDao->getSubjectBySubjectIdAndInstitutionId($subject_id, $institution_id);

            if(empty($subject)) { 
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $subjectProfilePicture = $subject->getProfilePictureId()
                ? $this->filesDao->getFileById($subject->getProfilePictureId())
                : null;
            $subjectBanner = $subject->getBannerId()
                ? $this->filesDao->getFileById($subject->getBannerId())
                : null;
            
            $teacher = $this->usersDao->getUserBydId($subject->getTeacherId());
            $teacherProfilePicture = $teacher->getProfilePictureId()
                ? $this->filesDao->getFileById($teacher->getProfilePictureId())
                : null;
            $teacherDto = new UserDto($teacher, $teacherProfilePicture);

            $subjectDto = new SubjectDto(
                $subject, 
                $teacherDto, 
                $subjectProfilePicture, 
                $subjectBanner
            );

            $response->getBody()->write(json_encode($subjectDto));

            return $response;
        });
    }

    public function updateSubjectById(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            /** @var InstitutionUser $membership */
            $membership = $request->getAttribute('membership');
            $token = $request->getAttribute('token');

            $subject = $this->subjectsDao->getSubjectBySubjectIdAndInstitutionId($subject_id, $institution_id);

            if(empty($subject)) { 
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            if(
                $membership->getRole() !== InstitutionUserType::Admin->value
                && $subject->getTeacherId() !== $token['sub']    
            ) {
                throw new HttpForbiddenException($request, LogService::HTTP_403 . "Only admins and the subject teacher can access this endpoint");
            }

            $body = $request->getParsedBody();
            $this->validatorService->validateRequired($body, ["name", "description"]);


            // Required parameters
            $name = new SubjectNameVo($body["name"]);
            $description = new SubjectDescriptionVo($body["description"]);            
            
            // Optional parameters
            $profilePictureId = !empty($body["profile_picture_id"]) 
                ? new UuidV4Vo($body["profile_picture_id"])
                : null;

            $bannerId = !empty($body["banner_id"])
                ? new UuidV4Vo($body["banner_id"])
                : null;
            
            $teacherId = !empty($body["teacher_id"])
                ? new UuidV4Vo($body["teacher_id"])
                : null;

            if(
                $teacherId !== null
                && $membership->getRole() !== InstitutionUserType::Admin->value
            ) {
                throw new HttpForbiddenException($request, LogService::HTTP_403 . "Only admins can change the subject teacher");
            }

            if($profilePictureId !== null) {
                $profilePicture = $this->filesDao->getFileById($profilePictureId->getValue());
                
                if (empty($profilePicture)) {
                    throw new HttpNotFoundException($request, LogService::HTTP_404 . "Profile picture not found");
                }
                if ($profilePicture->getFileType()->value !== FileType::Image->value) {
                    throw new InvalidArgumentException("Profile picture must be an image");
                }

                $subject->setProfilePictureId($profilePicture->getFileId());
            }
            
            if($bannerId !== null) {
                $banner = $this->filesDao->getFileById($bannerId->getValue());
                
                if (empty($banner)) {
                    throw new HttpNotFoundException($request, LogService::HTTP_404 . "Banner not found");
                }
                if ($banner->getFileType()->value !== FileType::Image->value) {
                    throw new InvalidArgumentException("Banner must be an image");
                }

                $subject->setBannerId($banner->getFileId());
            }

            $subject->setName($name->getValue());
            $subject->setDescription($description->getValue());
            $subject->setTeacherId($teacherId !== null ? $teacherId->getValue() : $subject->getTeacherId());

            $this->subjectsDao->updateSubject($subject);

            $subjectProfilePicture = $subject->getProfilePictureId()
                ? $this->filesDao->getFileById($subject->getProfilePictureId())
                : null;
            $subjectBanner = $subject->getBannerId()
                ? $this->filesDao->getFileById($subject->getBannerId())
                : null;
            $teacherUser = $this->usersDao->getUserBydId($subject->getTeacherId());
            $teacherUserProfilePictue = $teacherUser->getProfilePictureId()
                ? $this->filesDao->getFileById($teacherUser->getProfilePictureId())
                : null;
            $teacherUserDto = new UserDto($teacherUser, $teacherUserProfilePictue);

            $subjectDto = new SubjectDto(
                $subject,
                $teacherUserDto,
                $subjectProfilePicture,
                $subjectBanner
            );

            $response->getBody()->write(json_encode($subjectDto));

            LogService::info("/institutions/{$institution_id}/subjects/{$subject_id}", "{$token["email"]} has updated the {$subject->getName()} subject");
            return $response;
        });
    }
    
    public function deleteSubjectById(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            /** @var InstitutionUser $membership */
            $membership = $request->getAttribute('membership');
            $token = $request->getAttribute('token');

            $subject = $this->subjectsDao->getSubjectBySubjectIdAndInstitutionId($subject_id, $institution_id);

            if(empty($subject)) { 
                throw new HttpNotFoundException($request, "Subject with id {$subject_id} not found");
            }

            if(
                $membership->getRole() !== InstitutionUserType::Admin->value
                && $subject->getTeacherId() !== $token['sub']    
            ) {
                throw new HttpForbiddenException($request, LogService::HTTP_403 . "Only admins and the subject teacher can access this endpoint");
            }

            $success = $this->subjectsDao->deleteSubjectById($subject_id);

            if(!$success) {
                throw new HttpInternalServerErrorException($request, "Could not delete subject due to an unknown error.");
            }

            $response->getBody()->write(json_encode([
                "message" => "Subject {$subject->getName()} deleted successfully!"
            ]));

            LogService::info("/institutions/{$institution_id}/subjects/{$subject_id}", "{$token['email']} deleted the subject {$subject->getName()}");
            return $response;
        });
    }
}