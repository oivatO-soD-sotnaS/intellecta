<?php
namespace App\Models;

class JwtBlacklist implements \JsonSerializable {
    private $jwt_blacklists_id;
    private $token_hash;
    private $expires_at;

    public function __construct(array $data = []) {
        $this->jwt_blacklists_id = $data['jwt_blacklists_id'] ?? '';
        $this->token_hash = $data['token'] ?? '';
        $this->expires_at = $data['expires_at'] ?? '';
    }

    private function toArray(): array {
        return [
            'jwt_blacklists_id' => $this->jwt_blacklists_id,
            'token_hash' => $this->token_hash,
            'expires_at' => $this->expires_at
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getJwtBlacklistsId(): string { return $this->jwt_blacklists_id; }
    public function getTokenHash(): string { return $this->token_hash; }
    public function getExpiresAt(): string { return $this->expires_at; }

    public function isExpired(): bool {
        return strtotime($this->expires_at) < time();
    }
}