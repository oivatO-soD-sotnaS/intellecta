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
    public function getInstitutionId() {
        return $this->institution_id;
    }

    public function setInstitutionId($institution_id) {
        $this->institution_id = $institution_id;
    }

    public function getUserId() {
        return $this->user_id;
    }

    public function setUserId($user_id) {
        $this->user_id = $user_id;
    }

    public function getName() {
        return $this->name;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function getEmail() {
        return $this->email;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function getDescription() {
        return $this->description;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

    public function getProfilePictureId() {
        return $this->profile_picture_id;
    }

    public function setProfilePictureId($profile_picture_id) {
        $this->profile_picture_id = $profile_picture_id;
    }

    public function getBannerId() {
        return $this->banner_id;
    }

    public function setBannerId($banner_id) {
        $this->banner_id = $banner_id;
    }
}