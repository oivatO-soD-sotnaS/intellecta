<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\AssignmentsDao;
use App\Dao\FilesDao;
use App\Dto\AssignmentDto;
use App\Enums\FileType;
use App\Models\Assignment;
use App\Models\File;
use App\Services\LogService;
use App\Services\UploadService;
use App\Services\ValidatorService;
use App\Vo\AssignmentDeadlineVo;
use App\Vo\AssignmentDescriptionVo;
use App\Vo\AssignmentTitleVo;
use App\Vo\FileVo;
use App\Vo\UuidV4Vo;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

readonly class AssignmentsController extends BaseController {
    public function __construct(
        private AssignmentsDao $assignmentsDao,
        private FilesDao $filesDao,
        private ValidatorService $validatorService,
        private UploadService $uploadService
    ) {}

    public function getSubjectAssignments(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            $subjectAssignments = $this->assignmentsDao->getAssignmentsBySubjectId($subject_id);

            if(count($subjectAssignments) === 0) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $subjectAssignmentsDtos = array_map(function(Assignment $assignment) {
                $attachment = $assignment->getAttachmentId()
                    ? $this->filesDao->getFileById($assignment->getAttachmentId())
                    : null;

                return new AssignmentDto($assignment, $attachment);
            }, $subjectAssignments);

            $response->getBody()->write(json_encode($subjectAssignmentsDtos));
            return $response;
        });
    }

    public function createSubjectAssignment(Request $request, Response $response, string $institution_id, string $subject_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id) {
            $user = $request->getAttribute('user');

            $body = $request->getParsedBody();
            $uploadedFiles = $request->getUploadedFiles();

            $this->validatorService->validateRequired($body, ["title", "description", "deadline"]);
            $title = new AssignmentTitleVo($body['title']);
            $description = new AssignmentDescriptionVo($body['description']);
            $deadline = new AssignmentDeadlineVo($body['deadline']);

            $attachment = !empty($uploadedFiles['attachment'])
                ? new FileVo($uploadedFiles['attachment'])
                : null;

            $timestamp = date('Y-m-d H:i:s');

            if($attachment !== null) {
                $attachmentUrl = $this->uploadService->upload(
                    $attachment->getExtension(),
                    $attachment->getContent(),
                );

                $attachmentFile = $this->filesDao->createFile(new File([
                    "file_id" => Uuid::uuid4()->toString(),
                    "url" => $attachmentUrl,
                    "filename" => $attachment->getSafeFilename(),
                    "mime_type" => $attachment->getMimeType(),
                    "file_type" => FileType::tryFrom($attachment->getType())->value,
                    "size" => $attachment->getSize(),
                    "uploaded_at" => $timestamp
                ]));
            }

            $assignment = $this->assignmentsDao->createAssignment(new Assignment([
                "assignment_id" => Uuid::uuid4()->toString(),
                "title" => $title->getValue(),
                "description" => $description->getValue(),
                "deadline" => $deadline->toString(),
                "subject_id" => $subject_id,
                "attachment_id" => $attachmentFile?->getFileId()
            ]));

            $assignmentDto = new AssignmentDto($assignment, $attachmentFile);
            $response->getBody()->write(json_encode($assignmentDto));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/assignments", 
                "{$user->getUserId()} created an assignment for the $subject_id subject"
            );
            return $response;
        });
    }

    public function getSubjectAssignmentById(Request $request, Response $response, string $institution_id, string $subject_id, string $assignment_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $assignment_id) {
            $assignment = $this->assignmentsDao->getAssignmentByAssignmentIdAndSubjectId($assignment_id, $subject_id);

            if(empty($assignment)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $attachment = !empty($assignment->getAttachmentId())
                ? $this->filesDao->getFileById($assignment->getAttachmentId())
                : null;

            $assignmentDto = new AssignmentDto($assignment, $attachment);
            $response->getBody()->write(json_encode($assignmentDto));

            return $response;
        });
    }

    public function patchSubjectAssignmentById(Request $request, Response $response, string $institution_id, string $subject_id, string $assignment_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $assignment_id) {
            $user = $request->getAttribute('user');

            $body = $request->getParsedBody();

            $this->validatorService->validateRequired($body, ["title", "description", "deadline"]);
            $title = new AssignmentTitleVo($body['title']);
            $description = new AssignmentDescriptionVo($body['description']);
            $deadline = new AssignmentDeadlineVo($body['deadline']);

            $attachmentId = !empty($body['attachment_id'])
                ? new UuidV4Vo($body['attachment_id'])
                : null;

            $assignment = $this->assignmentsDao->getAssignmentByAssignmentIdAndSubjectId($assignment_id, $subject_id);

            if(empty($assignment)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $assignment->setTitle($title->getValue());
            $assignment->setDescription($description->getValue());
            $assignment->setDeadline($deadline->toString());
            $assignment->setAttachmentId($attachmentId?->getValue());

            $assignment = $this->assignmentsDao->updateAssignment($assignment);
            if(empty($assignment)) throw new HttpInternalServerErrorException($request, LogService::HTTP_500);

            $attachment = !empty($assignment->getAttachmentId())
                ? $this->filesDao->getFileById($assignment->getAttachmentId())
                : null;

            $assignmentDto = new AssignmentDto($assignment, $attachment);

            $response->getBody()->write(json_encode([
                "message" => "Assignment updated successfully!",
                "assignment" => $assignmentDto
            ]));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/assignments/{$assignment_id}",
                "{$user->getUserId()} updated the {$assignment->getTitle()} assignment"
            );
            return $response;
        });
    }

    public function deleteSubjectAssignmentById(Request $request, Response $response, string $institution_id, string $subject_id, string $assignment_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $assignment_id) {
            $user = $request->getAttribute('user');

            $assignment = $this->assignmentsDao->getAssignmentByAssignmentIdAndSubjectId($assignment_id, $subject_id);

            if(empty($assignment)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $success = $this->assignmentsDao->deleteAssignmentByAssignmentId($assignment->getAssignmentId());

            if(! $success) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $response->getBody()->write(json_encode([
                "message" => "Assignment deleted successfully!"
            ]));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/assignments/{$assignment_id}",
                "{$user->getUserId()} deleted the {$assignment->getTitle()} assignment"
            );
            return $response;
        });
    }
}
