<?php
declare(strict_types=1);

namespace App\Dto;

use App\Models\File;
use App\Models\Submission;
use App\Models\User;
use JsonSerializable;

readonly class SubmissionsDto implements JsonSerializable
{
    private string $submission_id;
    private string $submitted_at;
    private ?string $concept;
    private ?string $feedback;
    private string $assignment_id;
    private User $user;
    private ?File $attachment;

    public function __construct(Submission $submission, User $user, ?File $attachment) {
        $this->submission_id = $submission->getSubmissionId();
        $this->submitted_at = $submission->getSubmittedAt();
        $this->concept = $submission->getConcept();
        $this->feedback = $submission->getFeedback();
        $this->assignment_id = $submission->getAssignmentId();
        $this->user = $user;
        $this->attachment = $attachment;
    }

    private function toArray(): array {
        return [
            'submission_id' => $this->submission_id,
            'submitted_at' => $this->submitted_at,
            'concept' => $this->concept,
            'feedback' => $this->feedback,
            'assignment_id' => $this->assignment_id,
            'user' => $this->user,
            'attachment' => $this->attachment
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }
}
