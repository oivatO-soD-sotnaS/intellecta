<?php

declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class PasswordVo
{
  private string $value;

  public function __construct(string $password)
  {
    $password = trim($password);
    $password = strip_tags($password);
    $length = strlen($password);

    if ($length < 8 || $length > 64) {
      throw new InvalidArgumentException('Password must be between 8 and 64 characters.');
    }

    if (
      !preg_match('@[A-Z]@', $password) ||
      !preg_match('@[a-z]@', $password) ||
      !preg_match('@[0-9]@', $password) ||
      !preg_match('@[^\w]@', $password)
    ) {
      throw new InvalidArgumentException('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
    }

    $this->value = $password;
  }

  public function getValue(): string
  {
    return $this->value;
  }
}
