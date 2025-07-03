<?php
namespace App\Models;

class Submission implements \JsonSerializable {
    private $submission_id;
    private $submitted_at;
    private $grade;
    private $concept;
    private $feedback;
    private $assignment_id;
    private $user_id;
    private $file_id;

    public function __construct(array $data = []) {
        $this->submission_id = $data['submission_id'] ?? '';
        $this->submitted_at = $data['submitted_at'] ?? date('Y-m-d H:i:s');
        $this->grade = $data['grade'] ?? null;
        $this->concept = $data['concept'] ?? null;
        $this->feedback = $data['feedback'] ?? null;
        $this->assignment_id = $data['assignment_id'] ?? '';
        $this->user_id = $data['user_id'] ?? null;
        $this->file_id = $data['file_id'] ?? null;
    }

    private function toArray(): array {
        return [
            'submission_id' => $this->submission_id,
            'submitted_at' => $this->submitted_at,
            'grade' => $this->grade,
            'concept' => $this->concept,
            'feedback' => $this->feedback,
            'assignment_id' => $this->assignment_id,
            'user_id' => $this->user_id,
            'file_id' => $this->file_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getSubmissionId(): string { return $this->submission_id; }
    public function getSubmittedAt(): string { return $this->submitted_at; }
    public function getGrade(): ?float { return $this->grade; }
    public function getConcept(): ?string { return $this->concept; }
    public function getFeedback(): ?string { return $this->feedback; }
    public function getAssignmentId(): string { return $this->assignment_id; }
    public function getUserId(): ?string { return $this->user_id; }
    public function getFileId(): ?string { return $this->file_id; }
}