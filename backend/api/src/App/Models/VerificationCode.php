<?php
namespace App\Models;

class VerificationCode implements \JsonSerializable {
  private $verification_code_id;
  private $code;
  private $is_pending;
  private $expires_at;
  private $created_at;
  private $user_id;

  public function __construct(array $data = []) {
    $this->verification_code_id = $data['verification_code_id'] ?? null;
    $this->code = $data['code'] ?? '';
    $this->is_pending = $data['is_pending'] ?? true;
    $this->expires_at = $data['expires_at'] ?? date('Y-m-d H:i:s');
    $this->created_at = $data['created_at'] ?? date('Y-m-d H:i:s');
    $this->user_id = $data['user_id'] ?? '';
  }

  public function toArray(): array {
    return [
      'verification_code_id' => $this->verification_code_id,
      'code' => $this->code,
      'is_pending' => $this->is_pending,
      'expires_at' => $this->expires_at,
      'created_at' => $this->created_at,
      'user_id' => $this->user_id
    ];
  }

  public function jsonSerialize(): array {
    return $this->toArray();
  }
  
  public function getVerificationCodeId() { 
    return $this->verification_code_id;
  }
  
  public function getCode(): string { 
    return $this->code;
  }
  
  public function isPending(): bool { 
    return $this->is_pending;
  }
  
  public function getExpiresAt(): string { 
    return $this->expires_at;
  }
  
  public function getCreatedAt(): string { 
    return $this->created_at;
  }
  
  public function getUserId(): string { 
    return $this->user_id;
  }

  // Setters
  
  public function setVerificationCodeId($verification_code_id): void {
    $this->verification_code_id = $verification_code_id;
  }
  
  public function setCode(string $code): void {
    $this->code = $code;
  }
  
  public function setIsPending(bool $is_pending): void {
    $this->is_pending = $is_pending;
  }
  
  public function setExpiresAt(string $expires_at): void {
    $this->expires_at = $expires_at;
  }
  
  public function setCreatedAt(string $created_at): void {
    $this->created_at = $created_at;
  }
  
  public function setUserId(string $user_id): void {
    $this->user_id = $user_id;
  }
}