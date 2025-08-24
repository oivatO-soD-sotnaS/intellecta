<?php

declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class SubmissionConceptVo
{
  private string $value;

  public function __construct(string $grade)
  {
    $grade = trim($grade);
    $grade = strip_tags($grade);
    $length = strlen($grade);
    
    if ($length < 1 || $length > 64) {
      throw new InvalidArgumentException('Submission concept must be between 1 and 64 characters.');
    }

    $this->value = $grade;
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
