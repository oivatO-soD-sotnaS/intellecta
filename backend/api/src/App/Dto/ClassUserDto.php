<?php
namespace App\Dto;

use App\Dto\UserDto;
use App\Models\ClassUser;

readonly class ClassUserDto implements \JsonSerializable {
    private string $class_users_id;
    private string $joined_at;
    private string $class_id;
    private UserDto $user;

    public function __construct(ClassUser $classUser, UserDto $user) {
        $this->class_users_id = $classUser->getClassUsersId();
        $this->joined_at = $classUser->getJoinedAt();
        $this->class_id = $classUser->getClassId();
        $this->user = $user;
    }

    private function toArray(): array {
        return [
            'class_users_id' => $this->class_users_id,
            'joined_at' => $this->joined_at,
            'class_id' => $this->class_id,
            'user' => $this->user
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }
}