<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Dao\AssignmentsDao;
use App\Dao\FilesDao;
use App\Dao\SubjectsDao;
use App\Dao\SubmissionsDao;
use App\Dao\UsersDao;
use App\Dto\SubmissionsDto;
use App\Models\File;
use App\Models\Submission;
use App\Services\LogService;
use App\Services\UploadService;
use App\Services\ValidatorService;
use App\Vo\FileVo;
use App\Vo\SubmissionFeedbackVo;
use App\Vo\SubmissionConceptVo;
use App\Vo\UuidV4Vo;
use DateTimeImmutable;
use Ramsey\Uuid\Uuid;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpInternalServerErrorException;
use Slim\Exception\HttpNotFoundException;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

readonly class SubmissionsController extends BaseController
{
    public function __construct(
        private SubmissionsDao $submissionsDao,
        private AssignmentsDao $assignmentsDao,
        private SubjectsDao $subjectsDao,
        private FilesDao $filesDao,
        private UsersDao $usersDao,
        private ValidatorService $validatorService,
        private UploadService $uploadService
    ) {}

    public function getAssignmentSubmissions(Request $request, Response $response, string $institution_id, string $subject_id, string $assignment_id): Response
    {
        return $this->handleErrors($request, function () use ($request, $response, $institution_id, $subject_id, $assignment_id) {
            $assignmentSubmissions = $this->submissionsDao->getSubmissionsByAssignmentIdAndSubjectId($assignment_id, $subject_id);

            if (count($assignmentSubmissions) === 0) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $assignmentSubmissionsDtos = array_map(function (Submission $submission) {
                $user = $this->usersDao->getUserById($submission->getUserId());
                $file = !empty($submission->getAttachmentId())
                    ? $this->filesDao->getFileById($submission->getAttachmentId())
                    : null;
                return new SubmissionsDto($submission, $user, $file);
            }, $assignmentSubmissions);

            $response->getBody()->write(json_encode($assignmentSubmissionsDtos));
            return $response;
        });
    }

    public function createAssignmentSubmission(Request $request, Response $response, string $institution_id, string $subject_id, string $assignment_id): Response
    {
        return $this->handleErrors($request, function () use ($request, $response, $institution_id, $subject_id, $assignment_id) {
            $token = $request->getAttribute('token');

            $uploadedFiles = $request->getUploadedFiles();
            $this->validatorService->validateRequired($uploadedFiles, ["attachment"]);
            $attachment = new FileVo($uploadedFiles["attachment"]);

            $timestamp = date('Y-m-d H:i:s');

            $attachmentUrl = $this->uploadService->upload(
                $attachment->getExtension(),
                $attachment->getContent()
            );

            $attachment = $this->filesDao->createFile(new File([
                "file_id" => Uuid::uuid4()->toString(),
                "url" => $attachmentUrl,
                "filename" => $attachment->getSafeFilename(),
                "mime_type" => $attachment->getMimeType(),
                "file_type" => $attachment->getType(),
                "size" => $attachment->getSize(),
                "uploaded_at" => $timestamp
            ]));

            if (empty($attachment)) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500 . ' Failed to submit attachment');
            }

            $submission = $this->submissionsDao->createSubmission(new Submission([
                "submission_id" => Uuid::uuid4()->toString(),
                "submitted_at" => $timestamp,
                "concept" => null,
                "feedback" => null,
                "assignment_id" => $assignment_id,
                "user_id" => $token['sub'],
                "attachment_id" => $attachment->getFileId()
            ]));

            if (empty($submission)) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500 . ' Failed to create submission');
            }

            $user = $this->usersDao->getUserById($token['sub']);

            $submissionDto = new SubmissionsDto($submission, $user, $attachment);

            $response->getBody()->write(json_encode($submissionDto));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/assignments/{$assignment_id}/submissions",
                "{$token['email']} has made a submission to the assignment with ID: {$assignment_id}"
            );
            return $response;
        });
    }

    public function getSubmissionById(Request $request, Response $response, string $institution_id, string $subject_id, string $assignment_id, string $submission_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $assignment_id, $submission_id) {
            $token = $request->getAttribute('token');

            $subject = $this->subjectsDao->getSubjectBySubjectIdAndInstitutionId($subject_id, $institution_id);
            $submission = $this->submissionsDao->getSubmissionBySubmissionIdAndAssignmentId($submission_id, $assignment_id);

            if(
                empty($submission) || 
                empty($subject) || 
                (
                    $submission->getUserId() !== $token['sub'] && 
                    $subject->getTeacherId() !== $token['sub']
                )
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $user = $this->usersDao->getUserById($submission->getUserId());
            $file = !empty($submission->getAttachmentId())
                ? $this->filesDao->getFileById($submission->getAttachmentId())
                : null;

            $submissionDto = new SubmissionsDto($submission, $user, $file);            
        
            $response->getBody()->write(json_encode($submissionDto));

            return $response;
        });
    }

    public function updateSubmissionAttachment(Request $request, Response $response, string $institution_id, string $subject_id, string $assignment_id, string $submission_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $assignment_id, $submission_id) {
            $token = $request->getAttribute('token');

            $submission = $this->submissionsDao->getSubmissionBySubmissionIdAndAssignmentId($submission_id, $assignment_id);

            if(
                empty($submission) || 
                $submission->getUserId() !== $token['sub'] 
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $body = $request->getParsedBody();
            $this->validatorService->validateRequired($body, ["attachment_id"]);

            $attachmentId = new UuidV4Vo($body["attachment_id"]);

            $attachment = $this->filesDao->getFileById($attachmentId->getValue());

            if(empty($attachment)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $submission->setAttachmentId($attachment->getFileId());

            $success = $this->submissionsDao->updateSubmissionAttachmentId($submission);

            if(! $success) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

           $user = $this->usersDao->getUserById($submission->getUserId());
            $file = !empty($submission->getAttachmentId())
                ? $this->filesDao->getFileById($submission->getAttachmentId())
                : null;

            $submissionDto = new SubmissionsDto($submission, $user, $file);            
        
            $response->getBody()->write(json_encode([
                "message" => "Submission attachment updated successfully",
                "submission" => $submissionDto
            ]));

            LogService::info(
                "/institutions/{$institution_id}/subjects/{$subject_id}/assignments/{$assignment_id}/submissions/{$submission_id}",
                "{$token['email']} has updated a submission with ID: {$submission_id}"
            );
            return $response; 
        });
    }

    public function deleteSubmissionById(Request $request, Response $response, string $institution_id, string $subject_id, string $assignment_id, string $submission_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $assignment_id, $submission_id) {
            $token = $request->getAttribute('token');

            $submission = $this->submissionsDao->getSubmissionBySubmissionIdAndAssignmentId($submission_id, $assignment_id);

            if(
                empty($submission) || 
                $submission->getUserId() !== $token['sub'] 
            ) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $assignment = $this->assignmentsDao->getAssignmentByAssignmentIdAndSubjectId($assignment_id, $subject_id);

            if(empty($assignment)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $timestamp = new DateTimeImmutable();
            $deadline = new DateTimeImmutable($assignment->getDeadline());

            if($timestamp > $deadline) {
                throw new HttpForbiddenException($request, LogService::HTTP_403 . ' The deadline of the assignment has already passed, submission delete is forbidden');
            }

            $success = $this->submissionsDao->deleteSubmissionBySubmissionId($submission->getSubmissionId());

            if(! $success) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $response->getBody()->write(json_encode([
                "message" => "Submission deleted successfully"
            ]));

            return $response;
        });
    }

    public function evaluateSubmissionById(Request $request, Response $response, string $institution_id, string $subject_id, string $assignment_id, string $submission_id): Response {
        return $this->handleErrors($request, function() use ($request, $response, $institution_id, $subject_id, $assignment_id, $submission_id) {
            $body = $request->getParsedBody();
            $this->validatorService->validateRequired($body, ["concept", "feedback"]);

            $concept = new SubmissionConceptVo($body['concept']);
            $feedback = new SubmissionFeedbackVo($body['feedback']);            

            $submission = $this->submissionsDao->getSubmissionBySubmissionIdAndAssignmentId($submission_id, $assignment_id);

            if(empty($submission)) {
                throw new HttpNotFoundException($request, LogService::HTTP_404);
            }

            $submission->setConcept($concept->getValue());
            $submission->setFeedback($feedback->getValue());

            $submission = $this->submissionsDao->updateSubmissionConceptAndFeedback($submission);

            if(empty($submission)) {
                throw new HttpInternalServerErrorException($request, LogService::HTTP_500);
            }

            $user = $this->usersDao->getUserById($submission->getUserId());
            $file = !empty($submission->getAttachmentId())
                ? $this->filesDao->getFileById($submission->getAttachmentId())
                : null;

            $submissionDto = new SubmissionsDto($submission, $user, $file);            
        
            $response->getBody()->write(json_encode($submissionDto));

            return $response;
        });
    }
}
