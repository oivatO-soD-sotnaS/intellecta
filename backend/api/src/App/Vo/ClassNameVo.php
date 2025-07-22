<?php

declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class ClassNameVo
{
  private string $value;

  public function __construct(string $name)
  {
    $name = trim($name);
    $name = strip_tags($name);

    $length = strlen($name);
    if ($length < 5 || $length > 128) {
      throw new InvalidArgumentException('Class name must be between 5 and 128 characters.');
    }

    $this->value = $name;
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
