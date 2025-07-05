<?php

declare(strict_types=1);

namespace App\Dto;

use App\Models\File;
use App\Models\User;

readonly class UserDto implements \JsonSerializable {
  
  private string $user_id;
  private string $full_name;
  private string $email;
  private string $created_at;
  private string $changed_at;
  private ?File $profile_picture;

  public function __construct(User $user, ?File $profilePicture){
    $this->user_id = $user->getUserId();
    $this->full_name = $user->getFullName();
    $this->email = $user->getEmail();
    $this->created_at = $user->getCreatedAt();
    $this->changed_at = $user->getChangedAt();
    $this->profile_picture = $profilePicture;
  }

  private function toArray() {
    return [
      'user_id' => $this->user_id,
      'full_name' => $this->full_name,
      'email' => $this->email,
      'created_at' => $this->created_at,
      'changed_at' => $this->changed_at,
      'profile_picture' => $this->profile_picture
    ];
  }

  public function jsonSerialize(): mixed {
    return $this->toArray();
  }
}