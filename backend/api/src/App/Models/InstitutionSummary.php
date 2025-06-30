<?php
namespace App\Models;

use App\Enums\InstitutionUserType;

class InstitutionSummary implements \JsonSerializable {

  private string $institution_id;
  private string $name;
  private string $email;
  private string $phoneNumber;
  private string $userId;
  private string $description;
  private string $bannerId;
  private InstitutionUserType $role;
  private int $activeUserCount;
  private int $upcomingEventCount;

  public function __construct(array $data = []) {
    $this->institution_id = $data['institution_id'] ?? "";
    $this->name = $data['name'] ?? "";
    $this->email = $data['email'] ?? "";
    $this->phoneNumber = $data['phone_number'] ?? "";
    $this->userId = $data['user_id'] ?? "";
    $this->description = $data['description'] ?? "";
    $this->bannerId = $data['banner_id'] ?? "";
    $this->role = InstitutionUserType::tryFrom($data["role"] ?? 'student') ?? InstitutionUserType::Student;
    $this->activeUserCount = isset($data['active_user_count']) ? (int)$data['active_user_count'] : 0;
    $this->upcomingEventCount = isset($data['upcoming_event_count']) ? (int)$data['upcoming_event_count'] : 0;
  }

  public function toArray(): array {
    return [
      'institution_id' => $this->institution_id,
      'name' => $this->name,
      'email' => $this->email,
      'phone_number' => $this->phoneNumber,
      'user_id' => $this->userId,
      'description' => $this->description,
      'banner_id' => $this->bannerId,
      'role' => $this->role->value,
      'active_user_count' => $this->activeUserCount,
      'upcoming_event_count' => $this->upcomingEventCount,
    ];
  }

  public function jsonSerialize(): array {
    return $this->toArray();
  }

  public function getInstitutionId(): string {
    return $this->institution_id;
  }

  public function setInstitutionId(string $institution_id): void {
    $this->institution_id = $institution_id;
  }

  public function getName(): string {
    return $this->name;
  }

  public function setName(string $name): void {
    $this->name = $name;
  }

  public function getEmail(): string {
    return $this->email;
  }

  public function setEmail(string $email): void {
    $this->email = $email;
  }

  public function getPhoneNumber(): string {
    return $this->phoneNumber;
  }

  public function setPhoneNumber(string $phoneNumber): void {
    $this->phoneNumber = $phoneNumber;
  }

  public function getUserId(): string {
    return $this->userId;
  }

  public function setUserId(string $userId): void {
    $this->userId = $userId;
  }

  public function getDescription(): string {
    return $this->description;
  }

  public function getBannerId(): string {
    return $this->bannerId;
  }
  public function getRole(): InstitutionUserType {
    return $this->role;
  }

  public function setDescription(string $description): void {
    $this->description = $description;
  }

  public function setBannerId(string $bannerId): void {
    $this->bannerId = $bannerId;
  }
  public function setRole(InstitutionUserType $role): void {
    $this->role = $role;
  }

  public function getActiveUserCount(): int {
    return $this->activeUserCount;
  }

  public function setActiveUserCount(int $activeUserCount): void {
    $this->activeUserCount = $activeUserCount;
  }

  public function getUpcomingEventCount(): int {
    return $this->upcomingEventCount;
  }

  public function setUpcomingEventCount(int $upcomingEventCount): void {
    $this->upcomingEventCount = $upcomingEventCount;
  }
}