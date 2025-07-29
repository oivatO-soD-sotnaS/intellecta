<?php

declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class AssignmentDescriptionVo
{
  private string $value;

  public function __construct(string $description)
  {
    $description = trim($description);
    
    $length = strlen($description);
    if ($length > 1024) {
      throw new InvalidArgumentException('Assignment description cannot have more than 1024 characters.');
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
