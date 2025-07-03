<?php
namespace App\Models;

class ClassUser implements \JsonSerializable {
    private $class_users_id;
    private $joined_at;
    private $class_id;
    private $user_id;

    public function __construct(array $data = []) {
        $this->class_users_id = $data['class_users_id'] ?? '';
        $this->joined_at = $data['joined_at'] ?? date('Y-m-d H:i:s');
        $this->class_id = $data['class_id'] ?? '';
        $this->user_id = $data['user_id'] ?? '';
    }

    private function toArray(): array {
        return [
            'class_users_id' => $this->class_users_id,
            'joined_at' => $this->joined_at,
            'class_id' => $this->class_id,
            'user_id' => $this->user_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getClassUsersId(): string { return $this->class_users_id; }
    public function getJoinedAt(): string { return $this->joined_at; }
    public function getClassId(): string { return $this->class_id; }
    public function getUserId(): string { return $this->user_id; }
}