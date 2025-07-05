<?php
namespace App\Models;

class Institution implements \JsonSerializable {
    private $institution_id;
    private $name;
    private $email;
    private $description;
    private $profile_picture_id;
    private $banner_id;
    private $user_id;

    public function __construct(array $data = []) {
        $this->institution_id = $data['institution_id'] ?? '';
        $this->user_id = $data['user_id'] ?? '';
        $this->name = $data['name'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->description = $data['description'] ?? null;
        $this->profile_picture_id = $data['profile_picture_id'] ?? null;
        $this->banner_id = $data['banner_id'] ?? null;
    }

    private function toArray(): array {
        return [
            'institution_id' => $this->institution_id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'email' => $this->email,
            'description' => $this->description,
            'profile_picture_id' => $this->profile_picture_id,
            'banner_id' => $this->banner_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getInstitutionId(): string { return $this->institution_id; }
    public function getName(): string { return $this->name; }
    public function getEmail(): string { return $this->email; }
    public function getDescription(): ?string { return $this->description; }
    public function getThumbnailId(): ?string { return $this->profile_picture_id; }
    public function getBannerId(): ?string { return $this->banner_id; }
    public function getOwnerId(): string { return $this->user_id; }
}