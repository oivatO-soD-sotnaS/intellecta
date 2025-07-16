<?php
namespace App\Models;

class Assignment implements \JsonSerializable {
    private $assignment_id;
    private $title;
    private $description;
    private $deadline;
    private $subject_id;
    private $attachment_id;

    public function __construct(array $data = []) {
        $this->assignment_id = $data['assignment_id'] ?? '';
        $this->title = $data['title'] ?? '';
        $this->description = $data['description'] ?? '';
        $this->deadline = $data['deadline'] ?? '';
        $this->subject_id = $data['subject_id'] ?? '';
        $this->attachment_id = $data['attachment_id'] ?? null;
    }

    private function toArray(): array {
        return [
            'assignment_id' => $this->assignment_id,
            'title' => $this->title,
            'description' => $this->description,
            'deadline' => $this->deadline,
            'subject_id' => $this->subject_id,
            'attachment_id' => $this->attachment_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getAssignmentId(): string { return $this->assignment_id; }
    public function getTitle(): string { return $this->title; }
    public function getDescription(): string { return $this->description; }
    public function getDeadline(): string { return $this->deadline; }
    public function getSubjectId(): string { return $this->subject_id; }
    public function getAttachmentId(): ?string { return $this->attachment_id; }
}