<?php
declare(strict_types=1);

namespace App\Dto;

use App\Models\InstitutionUser;

readonly class InstitutionUserDto implements \JsonSerializable {
  private string $institution_user_id;
  private string $role;
  private string $joined_at;
  private string $institution_id;
  private UserDto $user;

  public function __construct(InstitutionUser $institutionUser, UserDto $user) {
    $this->institution_user_id = $institutionUser->getInstitutionUsersId();
    $this->role = $institutionUser->getRole();
    $this->joined_at = $institutionUser->getJoinedAt();
    $this->institution_id = $institutionUser->getInstitutionId();
    $this->user = $user;
  }

  public function toArray(): array {
    return [
      'institution_user_id' => $this->institution_user_id,
      'role' => $this->role,
      'joined_at' => $this->joined_at,
      'institution_id' => $this->institution_id,
      'user' => $this->user
    ];
  }

  public function jsonSerialize(): mixed {
    return $this->toArray();
  }
}