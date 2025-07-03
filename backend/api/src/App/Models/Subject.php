<?php
namespace App\Models;

class Subject implements \JsonSerializable {
    private $subject_id;
    private $name;
    private $description;
    private $thumbnail_id;
    private $banner_id;
    private $institution_id;
    private $professor_id;

    public function __construct(array $data = []) {
        $this->subject_id = $data['subject_id'] ?? '';
        $this->name = $data['name'] ?? '';
        $this->description = $data['description'] ?? null;
        $this->thumbnail_id = $data['thumbnail_id'] ?? null;
        $this->banner_id = $data['banner_id'] ?? null;
        $this->institution_id = $data['institution_id'] ?? '';
        $this->professor_id = $data['professor_id'] ?? null;
    }

    private function toArray(): array {
        return [
            'subject_id' => $this->subject_id,
            'name' => $this->name,
            'description' => $this->description,
            'thumbnail_id' => $this->thumbnail_id,
            'banner_id' => $this->banner_id,
            'institution_id' => $this->institution_id,
            'professor_id' => $this->professor_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getSubjectId(): string { return $this->subject_id; }
    public function getName(): string { return $this->name; }
    public function getDescription(): ?string { return $this->description; }
    public function getThumbnailId(): ?string { return $this->thumbnail_id; }
    public function getBannerId(): ?string { return $this->banner_id; }
    public function getInstitutionId(): string { return $this->institution_id; }
    public function getProfessorId(): ?string { return $this->professor_id; }
}