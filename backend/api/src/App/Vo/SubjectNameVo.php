<?php

declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class SubjectNameVo
{
  private string $value;

  public function __construct(string $title)
  {
    $title = trim($title);

    $length = strlen($title);
    if ($length < 5 || $length > 128) {
      throw new InvalidArgumentException('Subject name must be between 5 and 128 characters.');
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
