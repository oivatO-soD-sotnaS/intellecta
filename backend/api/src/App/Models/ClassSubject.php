<?php
namespace App\Models;

class ClassSubject implements \JsonSerializable {
    private $class_subjects_id;
    private $class_id;
    private $subject_id;

    public function __construct(array $data = []) {
        $this->class_subjects_id = $data['class_subjects_id'] ?? '';
        $this->class_id = $data['class_id'] ?? '';
        $this->subject_id = $data['subject_id'] ?? '';
    }

    private function toArray(): array {
        return [
            'class_subjects_id' => $this->class_subjects_id,
            'class_id' => $this->class_id,
            'subject_id' => $this->subject_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getClassSubjectsId(): string { return $this->class_subjects_id; }
    public function getClassId(): string { return $this->class_id; }
    public function getSubjectId(): string { return $this->subject_id; }
}