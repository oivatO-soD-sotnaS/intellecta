<?php
namespace App\Dto;

use App\Models\Assignment;
use App\Models\File;

readonly class AssignmentDto implements \JsonSerializable {
    private string $assignment_id;
    private string $title;
    private string $description;
    private string $deadline;
    private string $subject_id;
    private ?File $attachment;

    public function __construct(Assignment $assignment, ?File $attachment) {
        $this->assignment_id = $assignment->getAssignmentId();
        $this->title = $assignment->getTitle();
        $this->description = $assignment->getDescription();
        $this->deadline = $assignment->getDeadline();
        $this->subject_id = $assignment->getSubjectId();
        $this->attachment = $attachment;
    }

    private function toArray(): array {
        return [
            'assignment_id' => $this->assignment_id,
            'title' => $this->title,
            'description' => $this->description,
            'deadline' => $this->deadline,
            'subject_id' => $this->subject_id,
            'attachment' => $this->attachment
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }
}