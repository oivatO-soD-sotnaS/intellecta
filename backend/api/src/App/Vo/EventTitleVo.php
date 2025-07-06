<?php

declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class EventTitleVo
{
  private string $value;

  public function __construct(string $title)
  {
    $title = trim($title);

    $length = strlen($title);
    if ($length < 5 || $length > 64) {
      throw new InvalidArgumentException('Event title must be between 5 and 64 characters.');
    }

    $this->value = $title;
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
