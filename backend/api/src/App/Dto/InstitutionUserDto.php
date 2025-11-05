<?php
declare(strict_types=1);

namespace App\Dto;

use App\Models\InstitutionUser;

readonly class InstitutionUserDto implements \JsonSerializable {
  private InstitutionUser $institutionUser;
  private UserDto $userDto;

  public function __construct(InstitutionUser $institutionUser, UserDto $user) {
    $this->institutionUser = $institutionUser;
    $this->userDto = $user;
  }

  public function toArray(): array {
    return [
      'institution_user_id' => $this->institutionUser->getInstitutionUsersId(),
      'role' => $this->institutionUser->getRole(),
      'joined_at' => $this->institutionUser->getJoinedAt(),
      'institution_id' => $this->institutionUser->getInstitutionId(),
      'user' => $this->userDto
    ];
  }

  public function jsonSerialize(): mixed {
    return $this->toArray();
  }

  public function getInstitutionUser(): InstitutionUser {
    return $this->institutionUser;
  }

  public function getUserDto(): UserDto {
    return $this->userDto;
  }
}