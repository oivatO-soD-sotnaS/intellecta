<?php
namespace App\Models;

class SubjectUser implements \JsonSerializable {
    private $subject_id;
    private $user_id;

    public function __construct(array $data = []) {
        $this->subject_id = $data['subject_id'] ?? '';
        $this->user_id = $data['user_id'] ?? '';
    }

    private function toArray(): array {
        return [
            'subject_id' => $this->subject_id,
            'user_id' => $this->user_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getSubjectId(): string { return $this->subject_id; }
    public function getUserId(): string { return $this->user_id; }
}