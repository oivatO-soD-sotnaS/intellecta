<?php
declare(strict_types=1);

namespace App\Dto;

use App\Models\File;
use App\Models\Institution;

readonly class InstitutionDto implements \JsonSerializable {
  private string $institution_id;
  private string $name;
  private string $email;
  private string $description;
  private ?File $profilePicture;
  private ?File $banner;


  public function __construct(Institution $institution, ?File $banner, ?File $profilePicture) {
    $this->institution_id = $institution->getInstitutionId();
    $this->name = $institution->getName();
    $this->email = $institution->getEmail();
    $this->description = $institution->getDescription();
    $this->profilePicture = $profilePicture;
    $this->banner = $banner;
  }

  public function toArray(): array {
    return [
      'institution_id' => $this->institution_id,
      'name' => $this->name,
      'email' => $this->email,
      'description' => $this->description,
      'profilePicture' => $this->profilePicture,
      'banner' => $this->banner
    ];
  }

  public function jsonSerialize(): mixed {
    return $this->toArray();
  }
}