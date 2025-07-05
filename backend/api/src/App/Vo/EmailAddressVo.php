<?php
declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class EmailAddressVo {
    private string $value;

    public function __construct(string $value)
    {
        $value = trim(strtolower($value));

        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email format");
        }

        $length = strlen($value);
        if ($length < 5 || $length > 64) {
            throw new InvalidArgumentException('Email must be between 5 and 64 characters.');
        }

        $this->value = $value;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function equals(EmailAddressVo $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
