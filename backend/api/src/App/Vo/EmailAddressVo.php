<?php
declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class EmailAddressVo {
    private string $email;

    public function __construct(string $email)
    {
        $email = trim($email);
        $email = strtolower($email);
        $email = strip_tags($email);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email format: $email");
        }

        $length = strlen($email);
        if ($length < 5 || $length > 64) {
            throw new InvalidArgumentException('Email must be between 5 and 64 characters.');
        }

        $this->email = $email;
    }

    public function getValue(): string
    {
        return $this->email;
    }

    public function equals(EmailAddressVo $other): bool
    {
        return $this->email === $other->email;
    }

    public function __toString(): string
    {
        return $this->email;
    }
}
