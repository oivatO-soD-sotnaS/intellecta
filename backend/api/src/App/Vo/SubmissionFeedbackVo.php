<?php

declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

final class SubmissionFeedbackVo
{
  private string $value;

  public function __construct(string $feedback)
  {
    $feedback = trim($feedback);
    $feedback = strip_tags($feedback);
    $length = strlen($feedback);
    
    if ($length < 1 || $length > 256) {
      throw new InvalidArgumentException('Submission feedback must be between 1 and 256 characters.');
    }

    $this->value = $feedback;
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
