<?php
namespace App\Models;

use App\Enums\InstitutionUserType;

class InstitutionUser implements \JsonSerializable {
    private $institution_users_id;
    private $role;
    private $joined_at;
    private $institution_id;
    private $user_id;

    public function __construct(array $data = []) {
        $this->institution_users_id = $data['institution_users_id'] ?? '';
        $this->role = InstitutionUserType::tryFrom($data["role"] ?? 'student') ?? InstitutionUserType::Student;
        $this->joined_at = $data['joined_at'] ?? date('Y-m-d H:i:s');
        $this->institution_id = $data['institution_id'] ?? '';
        $this->user_id = $data['user_id'] ?? '';
    }

    public function toArray(): array {
        return [
            'institution_users_id' => $this->institution_users_id,
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
    public function getInstitutionUsersId(): string { return $this->institution_users_id; }
    public function getRole(): string { return $this->role->value; }
    public function getJoinedAt(): string { return $this->joined_at; }
    public function getInstitutionId(): string { return $this->institution_id; }
    public function getUserId(): string { return $this->user_id; }
}