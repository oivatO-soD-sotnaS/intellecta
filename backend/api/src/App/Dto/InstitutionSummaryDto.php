<?php
declare(strict_types=1);

namespace App\Dto;

use App\Enums\InstitutionUserType;
use App\Models\File;
use App\Models\InstitutionSummary;

readonly class InstitutionSummaryDto implements \JsonSerializable {
  private string $institution_id;
  private string $name;
  private string $email;
  private string $description;
  private ?File $banner;
  private ?File $profilePicture;

  private InstitutionUserType $role;
  private int $activeUserCount;
  private int $upcomingEventCount;


  public function __construct(InstitutionSummary $institutionSummary, ?File $banner, ?File $profilePicture) {
    $this->institution_id = $institutionSummary->getInstitutionId();
    $this->name = $institutionSummary->getName();
    $this->email = $institutionSummary->getEmail();
    $this->description = $institutionSummary->getDescription();
    $this->banner = $banner;
    $this->profilePicture = $profilePicture;
    $this->role = $institutionSummary->getRole();
    $this->activeUserCount = $institutionSummary->getActiveUserCount();
    $this->upcomingEventCount = $institutionSummary->getUpcomingEventCount();
  }

  private function toArray(): array {
    return [
      'institution_id' => $this->institution_id,
      'name' => $this->name,
      'email' => $this->email,
      'description' => $this->description,
      'banner' => $this->banner,
      'profilePicture' => $this->profilePicture,
      'role' => $this->role->value,
      'active_user_count' => $this->activeUserCount,
      'upcoming_event_count' => $this->upcomingEventCount,
    ];
  }

  public function jsonSerialize(): mixed {
    return $this->toArray();
  }
}