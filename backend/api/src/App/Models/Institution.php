<?php
namespace App\Models;

class Institution implements \JsonSerializable {
    private $institution_id;
    private $name;
    private $email;
    private $description;
    private $thumbnail_id;
    private $banner_id;
    private $owner_id;

    public function __construct(array $data = []) {
        $this->institution_id = $data['institution_id'] ?? '';
        $this->owner_id = $data['owner_id'] ?? '';
        $this->name = $data['name'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->description = $data['description'] ?? null;
        $this->thumbnail_id = $data['thumbnail_id'] ?? null;
        $this->banner_id = $data['banner_id'] ?? null;
    }

    private function toArray(): array {
        return [
            'institution_id' => $this->institution_id,
            'owner_id' => $this->owner_id,
            'name' => $this->name,
            'email' => $this->email,
            'description' => $this->description,
            'thumbnail_id' => $this->thumbnail_id,
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
    public function getThumbnailId(): ?string { return $this->thumbnail_id; }
    public function getBannerId(): ?string { return $this->banner_id; }
    public function getOwnerId(): string { return $this->owner_id; }
}