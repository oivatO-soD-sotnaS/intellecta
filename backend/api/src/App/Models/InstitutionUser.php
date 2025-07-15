<?php

namespace App\Models;

use App\Enums\InstitutionUserType;

class InstitutionUser implements \JsonSerializable {
    private $institution_user_id;
    private $role;
    private $joined_at;
    private $institution_id;
    private $user_id;

    public function __construct(array $data = []) {
        $this->institution_user_id = $data['institution_user_id'] ?? '';
        $this->role = InstitutionUserType::tryFrom($data["role"] ?? 'student') ?? InstitutionUserType::Student;
        $this->joined_at = $data['joined_at'] ?? date('Y-m-d H:i:s');
        $this->institution_id = $data['institution_id'] ?? '';
        $this->user_id = $data['user_id'] ?? '';
    }

    private function toArray(): array {
        return [
            'institution_user_id' => $this->institution_user_id,
            'role' => $this->role,
            'joined_at' => $this->joined_at,
            'institution_id' => $this->institution_id,
            'user_id' => $this->user_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getInstitutionUsersId(): string { return $this->institution_user_id; }
    public function getRole(): string { return $this->role->value; }
    public function getJoinedAt(): string { return $this->joined_at; }
    public function getInstitutionId(): string { return $this->institution_id; }
    public function getUserId(): string { return $this->user_id; }

    // Setters
    public function setInstitutionUsersId(string $institution_user_id): void {
        $this->institution_user_id = $institution_user_id;
    }

    public function setRole(InstitutionUserType $role): void {
        $this->role = $role;
    }

    public function setJoinedAt(string $joined_at): void {
        // You might want to add validation here to ensure $joined_at is a valid date/time string
        $this->joined_at = $joined_at;
    }

    public function setInstitutionId(string $institution_id): void {
        $this->institution_id = $institution_id;
    }

    public function setUserId(string $user_id): void {
        $this->user_id = $user_id;
    }
}