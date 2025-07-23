<?php
namespace App\Models;

class Subject implements \JsonSerializable {
    private $subject_id;
    private $name;
    private $description;
    private $profile_picture_id;
    private $banner_id;
    private $institution_id;
    private $teacher_id;

    public function __construct(array $data = []) {
        $this->subject_id = $data['subject_id'] ?? '';
        $this->name = $data['name'] ?? '';
        $this->description = $data['description'] ?? null;
        $this->profile_picture_id = $data['profile_picture_id'] ?? null;
        $this->banner_id = $data['banner_id'] ?? null;
        $this->institution_id = $data['institution_id'] ?? '';
        $this->teacher_id = $data['teacher_id'] ?? null;
    }

    private function toArray(): array {
        return [
            'subject_id' => $this->subject_id,
            'name' => $this->name,
            'description' => $this->description,
            'profile_picture_id' => $this->profile_picture_id,
            'banner_id' => $this->banner_id,
            'institution_id' => $this->institution_id,
            'teacher_id' => $this->teacher_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getSubjectId(): string { return $this->subject_id; }
    public function getName(): string { return $this->name; }
    public function getDescription(): ?string { return $this->description; }
    public function getProfilePictureId(): ?string { return $this->profile_picture_id; }
    public function getBannerId(): ?string { return $this->banner_id; }
    public function getInstitutionId(): string { return $this->institution_id; }
    public function getTeacherId(): ?string { return $this->teacher_id; }

    // Setters
    public function setSubjectId(string $subject_id): void {
        $this->subject_id = $subject_id;
    }

    public function setName(string $name): void {
        $this->name = $name;
    }

    public function setDescription(?string $description): void {
        $this->description = $description;
    }

    public function setProfilePictureId(?string $profile_picture_id): void {
        $this->profile_picture_id = $profile_picture_id;
    }

    public function setBannerId(?string $banner_id): void {
        $this->banner_id = $banner_id;
    }

    public function setInstitutionId(string $institution_id): void {
        $this->institution_id = $institution_id;
    }

    public function setTeacherId(?string $teacher_id): void {
        $this->teacher_id = $teacher_id;
    }
}