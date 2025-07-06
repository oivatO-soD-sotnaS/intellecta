<?php
namespace App\Models;

class SubjectClass implements \JsonSerializable {
    private $subject_classes_id;
    private $class_id;
    private $subject_id;

    public function __construct(array $data = []) {
        $this->subject_classes_id = $data['subject_classes_id'] ?? '';
        $this->class_id = $data['class_id'] ?? '';
        $this->subject_id = $data['subject_id'] ?? '';
    }

    private function toArray(): array {
        return [
            'subject_classes_id' => $this->subject_classes_id,
            'class_id' => $this->class_id,
            'subject_id' => $this->subject_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getSubjectClassesId(): string { return $this->subject_classes_id; }
    public function getClassId(): string { return $this->class_id; }
    public function getSubjectId(): string { return $this->subject_id; }
}