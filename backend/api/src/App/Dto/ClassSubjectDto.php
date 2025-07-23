<?php
namespace App\Dto;

use App\Models\ClassSubject;

readonly class ClassSubjectDto implements \JsonSerializable {
    private string $class_subjects_id;
    private string $class_id;
    private SubjectDto $subject;

    public function __construct(ClassSubject $classSubject, SubjectDto $subjectDto) {
        $this->class_subjects_id = $classSubject->getClassSubjectsId();
        $this->class_id = $classSubject->getClassId();
        $this->subject = $subjectDto;
    }

    private function toArray(): array {
        return [
            'class_subjects_id' => $this->class_subjects_id,
            'class_id' => $this->class_id,
            'subject' => $this->subject
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }
}