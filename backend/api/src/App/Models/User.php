<?php
namespace App\Models;

class User implements \JsonSerializable {
    private $user_id;
    private $full_name;
    private $email;
    private $password_hash;
    private $email_verified;
    private $created_at;
    private $changed_at;
    private $profile_picture_id;

    public function __construct(array $data = []) {
        $this->user_id = $data['user_id'] ?? '';
        $this->full_name = $data['full_name'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->password_hash = $data['password_hash'] ?? '';
        $this->email_verified = isset($data['email_verified']) ? (bool) $data['email_verified'] : false;
        $this->created_at = $data['created_at'] ?? date('Y-m-d H:i:s');
        $this->changed_at = $data['changed_at'] ?? date('Y-m-d H:i:s');
        $this->profile_picture_id = $data['profile_picture_id'] ?? null;
    }

    private function toArray(): array {
        return [
            'user_id' => $this->user_id,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'email_verified' => $this->email_verified,
            'created_at' => $this->created_at,
            'changed_at' => $this->changed_at,
            'profile_picture_id' => $this->profile_picture_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    public function __tostring(): string {
        return "Username: ".$this->getFullName().", E-mail: ".$this->getEmail().", Created at: ".$this->getCreatedAt();
    }
    // Getters
    public function getUserId(): string { return $this->user_id; }
    public function getFullName(): string { return $this->full_name; }
    public function getEmail(): string { return $this->email; }
    public function getPasswordHash(): string { return $this->password_hash; }
    public function isEmailVerified(): bool { return $this->email_verified; }
    public function getCreatedAt(): string { return $this->created_at; }
    public function getChangedAt(): string { return $this->changed_at; }
    public function getProfilePictureId(): ?string { return $this->profile_picture_id; }

    // Setters
    public function setUserId(string $user_id): self {
        $this->user_id = $user_id;
        return $this;
    }

    public function setFullName(string $full_name): self {
        $this->full_name = $full_name;
        return $this;
    }

    public function setEmail(string $email): self {
        $this->email = $email;
        return $this;
    }

    public function setPasswordHash(string $password_hash): self {
        $this->password_hash = $password_hash;
        return $this;
    }

    public function setEmailVerified(bool $email_verified): self {
        $this->email_verified = $email_verified;
        return $this;
    }

    public function setCreatedAt(string $created_at): self {
        $this->created_at = $created_at;
        return $this;
    }

    public function setChangedAt(string $changed_at): self {
        $this->changed_at = $changed_at;
        return $this;
    }

    public function setProfilePictureId(?string $profile_picture_id): self {
        $this->profile_picture_id = $profile_picture_id;
        return $this;
    }
}