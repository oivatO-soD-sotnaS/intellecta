<?php

declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class InstitutionDescriptionVo
{
  private string $value;

  public function __construct(string $description)
  {
    $description = trim($description);

    $length = strlen($description);
    if ($length > 500) {
      throw new InvalidArgumentException('Event title must be between 5 and 64 characters.');
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
