<?php
namespace App\Models;

class ClassModel implements \JsonSerializable {
    private $class_id;
    private $name;
    private $description;
    private $profile_picture_id;
    private $banner_id;
    private $institution_id;

    public function __construct(array $data = []) {
        $this->class_id = $data['class_id'] ?? '';
        $this->name = $data['name'] ?? '';
        $this->description = $data['description'] ?? '';
        $this->profile_picture_id = $data['profile_picture_id'] ?? null;
        $this->banner_id = $data['banner_id'] ?? null;
        $this->institution_id = $data['institution_id'] ?? null;
    }

    private function toArray(): array {
        return [
            'class_id' => $this->class_id,
            'name' => $this->name,
            'description'=> $this->description,
            'profile_picture_id' => $this->profile_picture_id,
            'banner_id' => $this->banner_id,
            'institution_id' => $this->institution_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getClassId() {
        return $this->class_id;
    }

    public function getName() {
        return $this->name;
    }

    public function getDescription() {
        return $this->description;
    }

    public function getProfilePictureId() {
        return $this->profile_picture_id;
    }

    public function getBannerId() {
        return $this->banner_id;
    }

    public function getInstitutionId() {
        return $this->institution_id;
    }

    // Setters
    public function setClassId($class_id): void {
        $this->class_id = $class_id;
    }

    public function setName($name): void {
        $this->name = $name;
    }

    public function setDescription($description): void {
        $this->description = $description;
    }

    public function setProfilePictureId($profile_picture_id): void {
        $this->profile_picture_id = $profile_picture_id;
    }

    public function setBannerId($banner_id): void {
        $this->banner_id = $banner_id;
    }

    public function setInstitutionId($institution_id): void {
        $this->institution_id = $institution_id;
    }
}
