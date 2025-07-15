<?php
namespace App\Dto;

use App\Dto\InstitutionDto;
use App\Dto\UserDto;
use App\Models\Invitation;

readonly class InvitationDto implements \JsonSerializable {
    private string $invitation_id;
    private string $email;
    private string $role;
    private string $expires_at;
    private ?string $accepted_at;
    private string $created_at;
    private InstitutionDto $institution;
    private UserDto $invitedBy;

    public function __construct(Invitation $invitation, InstitutionDto $institution, UserDto $invitedBy) {
        $this->invitation_id = $invitation->getInvitationId();
        $this->email = $invitation->getEmail();
        $this->role = $invitation->getRole();
        $this->expires_at = $invitation->getExpiresAt();
        $this->accepted_at = $invitation->getAcceptedAt();
        $this->created_at = $invitation->getCreatedAt();
        $this->institution = $institution;
        $this->invitedBy = $invitedBy;
    }

    private function toArray(): array {
        return [
            'invitation_id' => $this->invitation_id,
            'email' => $this->email,
            'role' => $this->role,
            'expires_at' => $this->expires_at,
            'accepted_at' => $this->accepted_at,
            'created_at' => $this->created_at,
            'institution' => $this->institution,
            'invited_by' => $this->invitedBy
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }
}