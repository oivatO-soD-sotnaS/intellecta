<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\ClassSubjectsDao;
use App\Dao\FilesDao;
use App\Dao\SubjectsDao;
use App\Dao\UsersDao;
use App\Dto\ClassSubjectDto;
use App\Dto\SubjectDto;
use App\Dto\UserDto;
use App\Models\ClassSubject;
use App\Services\LogService;
use App\Services\ValidatorService;
use App\Vo\UuidV4Vo;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

readonly class ClassSubjectsController extends BaseController {
    public function __construct(
        private SubjectsDao $subjectsDao,
        private ClassSubjectsDao $classSubjectsDao,
        private UsersDao $usersDao,
        private FilesDao $filesDao,
        private ValidatorService $validatorService
    ) {}


    public function getClassSubjects(Request $request, Response $response, string $institution_id, string $class_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $class_id) {
            $classSubjects = $this->classSubjectsDao->getClassSubjectsByClassId($class_id);

            $subjectsDtos = array_map(function(ClassSubject $classSubject) use($institution_id) {
                $subject = $this->subjectsDao->getSubjectBySubjectIdAndInstitutionId($classSubject->getSubjectId(), $institution_id);

                $teacher = $this->usersDao->getUserById($subject->getTeacherId());
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

                $subjectDto = new SubjectDto(
                    $subject,
                    $teacherDto,
                    $profilePicture,
                    $banner
                );

                return new ClassSubjectDto($classSubject, $subjectDto);
            }, $classSubjects);

            $response->getBody()->write(json_encode($subjectsDtos));

            return $response;
        });
    }

    public function addSubjectToClass(Request $request, Response $response, string $institution_id, string $class_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $class_id) {
            $token = $request->getAttribute('token');

            $body = $request->getParsedBody();
            $this->validatorService->validateRequired($body, ["subject_id"]);

            $subjectId = new UuidV4Vo($body["subject_id"]);

            $subject = $this->subjectsDao->getSubjectBySubjectIdAndInstitutionId($subjectId->getValue(), $institution_id);

            if(empty($subject)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $classSubject = $this->classSubjectsDao->createClassSubject(new ClassSubject([
                "class_subjects_id" => Uuid::uuid4()->toString(),
                "class_id" => $class_id,
                "subject_id" => $subject->getSubjectId()
            ]));

            $teacher = $this->usersDao->getUserById($subject->getTeacherId());
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

            $subjectDto = new SubjectDto(
                $subject,
                $teacherDto,
                $profilePicture,
                $banner
            );

            $classSubjectDto = new ClassSubjectDto($classSubject, $subjectDto);

            $response->getBody()->write(json_encode([
                "message" => "Subject linked successfully!",
                "class_subject" => $classSubjectDto
            ]));

            LogService::info("/institutions/{$institution_id}/classes/{$class_id}/subjects", "{$token['email']} linked the {$subject->getName()} subject to the {$class_id} class");
            return $response;
        });
    }

    public function getClassSubjectById(Request $request, Response $response, string $institution_id, string $class_id, string $class_subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $class_id, $class_subject_id) {
            $classSubject = $this->classSubjectsDao->getClassSubjectByClassSubjectIdAndClassId($class_subject_id, $class_id);

            if(empty($classSubject)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $subject = $this->subjectsDao->getSubjectBySubjectIdAndInstitutionId($classSubject->getSubjectId(), $institution_id);

            $teacher = $this->usersDao->getUserById($subject->getTeacherId());
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

            $subjectDto = new SubjectDto(
                $subject,
                $teacherDto,
                $profilePicture,
                $banner
            );

            $classSubjectDto =  new ClassSubjectDto($classSubject, $subjectDto);

            $response->getBody()->write(json_encode($classSubjectDto));
            return $response;
        });
    }

    public function removeSubjectFromClass(Request $request, Response $response, string $institution_id, string $class_id, string $class_subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $class_id, $class_subject_id) {
            $token = $request->getAttribute('token');

            $classSubject = $this->classSubjectsDao->getClassSubjectByClassSubjectIdAndClassId($class_subject_id, $class_id);

            if(empty($classSubject)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $success = $this->classSubjectsDao->deleteClassSubjectById($classSubject->getClassSubjectsId());

            if(!$success) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $response->getBody()->write(json_encode([
                "message" => "Subject with Id {$classSubject->getClassId()} was removed from the class successfully!"
            ]));

            LogService::info("/institutions/{$institution_id}/classes/{$class_id}/subjects/{$class_subject_id}", "{$token['email']} removed the subject with id {$classSubject->getClassId()} from the class with id {$class_id}");
            return $response;
        });
    }
}
