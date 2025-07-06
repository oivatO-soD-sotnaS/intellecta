<?php

declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class UsernameVo
{
  private string $value;

  public function __construct(string $fullName)
  {
    $fullName = trim($fullName);

    $length = strlen($fullName);
    if ($length < 5 || $length > 64) {
      throw new InvalidArgumentException('Full name must be between 5 and 64 characters.');
    }

    $this->value = $fullName;
  }

  public function getValue(): string
  {
    return $this->value;
  }

  public function __toString(): string
  {
    return $this->value;
  }
}
