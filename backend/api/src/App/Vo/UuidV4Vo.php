<?php

declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class UuidV4Vo
{
    private const REGEX = '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';

    private string $value;

    public function __construct(string $uuid)
    {
        $uuid = trim(strtolower($uuid));

        if (!preg_match(self::REGEX, $uuid)) {
            throw new InvalidArgumentException("Invalid UUIDv4 format: {$uuid}");
        }

        $this->value = $uuid;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function equals(UuidV4Vo $other): bool
    {
        return $this->value === $other->getValue();
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
