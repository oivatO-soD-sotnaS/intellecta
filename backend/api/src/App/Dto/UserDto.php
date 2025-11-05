<?php

declare(strict_types=1);

namespace App\Dto;

use App\Models\File;
use App\Models\User;

readonly class UserDto implements \JsonSerializable {
  
  private User $user;
  private ?File $profile_picture;

  public function __construct(User $user, ?File $profilePicture){
    $this->user = $user;
    $this->profile_picture = $profilePicture;
  }

  private function toArray() {
    return [
      'user_id' => $this->user->getUserId(),
      'full_name' => $this->user->getFullName(),
      'email' => $this->user->getEmail(),
      'created_at' => $this->user->getCreatedAt(),
      'changed_at' => $this->user->getChangedAt(),
      'profile_picture' => $this->profile_picture
    ];
  }

  public function jsonSerialize(): mixed {
    return $this->toArray();
  }

  public function getUser(): User {
    return $this->user;
  }
}