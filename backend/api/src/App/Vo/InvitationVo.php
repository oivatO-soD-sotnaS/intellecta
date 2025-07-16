<?php

namespace App\Vo;

use App\Enums\InstitutionUserType;
use InvalidArgumentException;

final class InvitationVo
{
    private string $email;
    private InstitutionUserType $role;

    public function __construct(array $data)
    {
        if (!isset($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid or missing email");
        }

        if (!isset($data['role']) || !InstitutionUserType::tryFrom($data['role'])) {
            throw new InvalidArgumentException("Invalid or missing role");
        }

        $this->email = $data['email'];
        $this->role = InstitutionUserType::from($data['role']);
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getRole(): InstitutionUserType
    {
        return $this->role;
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'role' => $this->role->value,
        ];
    }
}
