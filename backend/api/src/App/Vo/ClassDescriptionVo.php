<?php

declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class ClassDescriptionVo
{
  private string $value;

  public function __construct(string $description)
  {
    $description = trim($description);
    $description = strip_tags($description);

    $length = strlen($description);
    if ($length > 500) {
      throw new InvalidArgumentException('Class description cannot have more than 500 characters.');
    }

    $this->value = $description;
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
