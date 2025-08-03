<?php
namespace App\Models;

class Submission implements \JsonSerializable {
    private $submission_id;
    private $submitted_at;
    private $concept;
    private $feedback;
    private $assignment_id;
    private $user_id;
    private $attachment_id;

    public function __construct(array $data = []) {
        $this->submission_id = $data['submission_id'] ?? '';
        $this->submitted_at = $data['submitted_at'] ?? date('Y-m-d H:i:s');
        $this->concept = $data['concept'] ?? null;
        $this->feedback = $data['feedback'] ?? null;
        $this->assignment_id = $data['assignment_id'] ?? '';
        $this->user_id = $data['user_id'] ?? null;
        $this->attachment_id = $data['attachment_id'] ?? null;
    }

    private function toArray(): array {
        return [
            'submission_id' => $this->submission_id,
            'submitted_at' => $this->submitted_at,
            'concept' => $this->concept,
            'feedback' => $this->feedback,
            'assignment_id' => $this->assignment_id,
            'user_id' => $this->user_id,
            'attachment_id' => $this->attachment_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getSubmissionId(): string { return $this->submission_id; }
    public function getSubmittedAt(): string { return $this->submitted_at; }
    public function getConcept(): ?string { return $this->concept; }
    public function getFeedback(): ?string { return $this->feedback; }
    public function getAssignmentId(): string { return $this->assignment_id; }
    public function getUserId(): ?string { return $this->user_id; }
    public function getAttachmentId(): ?string { return $this->attachment_id; }

    // Setters
    public function setSubmissionId(string $submission_id): void {
        $this->submission_id = $submission_id;
    }

    public function setSubmittedAt(string $submitted_at): void {
        $this->submitted_at = $submitted_at;
    }

    public function setConcept(?string $concept): void {
        $this->concept = $concept;
    }

    public function setFeedback(?string $feedback): void {
        $this->feedback = $feedback;
    }

    public function setAssignmentId(string $assignment_id): void {
        $this->assignment_id = $assignment_id;
    }

    public function setUserId(?string $user_id): void {
        $this->user_id = $user_id;
    }

    public function setAttachmentId(?string $attachment_id): void {
        $this->attachment_id = $attachment_id;
    }
}
