<?php
namespace App\Models;

class Invitation implements \JsonSerializable {
    private $invitation_id;
    private $email;
    private $role;
    private $expires_at;
    private $accepted_at;
    private $created_at;
    private $institution_id;
    private $invited_by;

    public function __construct(array $data = []) {
        $this->invitation_id = $data['invitation_id'] ?? '';
        $this->email = $data['email'] ?? '';
        $this->role = $data['role'] ?? 'student';
        $this->expires_at = $data['expires_at'] ?? '';
        $this->accepted_at = $data['accepted_at'] ?? null;
        $this->created_at = $data['created_at'] ?? date('Y-m-d H:i:s');
        $this->institution_id = $data['institution_id'] ?? '';
        $this->invited_by = $data['invited_by'] ?? '';
    }

    private function toArray(): array {
        return [
            'invitation_id' => $this->invitation_id,
            'email' => $this->email,
            'role' => $this->role,
            'expires_at' => $this->expires_at,
            'accepted_at' => $this->accepted_at,
            'created_at' => $this->created_at,
            'institution_id' => $this->institution_id,
            'invited_by' => $this->invited_by
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    public function isExpired(): bool {
       if (empty($this->expires_at)) {
            return false;
        }
        
        $expirationDate = new \DateTime($this->expires_at);
        $currentDate = new \DateTime();
        
        return $currentDate > $expirationDate;
    }
    public function isAccepted(): bool {
        return $this->accepted_at !== null;
    }
    // Getters
    public function getInvitationId(): string { return $this->invitation_id; }
    public function getEmail(): string { return $this->email; }
    public function getRole(): string { return $this->role; }
    public function getExpiresAt(): string { return $this->expires_at; }
    public function getAcceptedAt(): ?string { return $this->accepted_at; }
    public function getCreatedAt(): string { return $this->created_at; }
    public function getInstitutionId(): string { return $this->institution_id; }
    public function getInvitedBy(): string { return $this->invited_by; }

    // Setters
    public function setInvitationId(string $invitation_id): void {
        $this->invitation_id = $invitation_id;
    }

    public function setEmail(string $email): void {
        $this->email = $email;
    }

    public function setRole(string $role): void {
        $this->role = $role;
    }

    public function setExpiresAt(string $expires_at): void {
        $this->expires_at = $expires_at;
    }

    public function setAcceptedAt(?string $accepted_at): void {
        $this->accepted_at = $accepted_at;
    }

    public function setCreatedAt(string $created_at): void {
        $this->created_at = $created_at;
    }

    public function setInstitutionId(string $institution_id): void {
        $this->institution_id = $institution_id;
    }

    public function setInvitedBy(string $invited_by): void {
        $this->invited_by = $invited_by;
    }
}