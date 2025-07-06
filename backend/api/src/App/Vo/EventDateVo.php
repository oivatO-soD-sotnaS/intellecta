<?php
declare(strict_types=1);

namespace App\Vo;

use DateTimeImmutable;
use DateTimeInterface;
use Exception;
use InvalidArgumentException;

class EventDateVo
{
  private DateTimeImmutable $datetime;

  public function __construct(string $datetimeString)
  {
    $this->datetime = $this->validateAndCreateDateTime($datetimeString);
  }

  private function validateAndCreateDateTime(string $datetimeString): DateTimeImmutable
  {
    if (empty(trim($datetimeString))) {
      throw new InvalidArgumentException("Datetime string cannot be empty");
    }

    try {
      $datetime = new DateTimeImmutable($datetimeString);
    } catch (Exception $e) {
      throw new InvalidArgumentException(
        sprintf('Invalid datetime format "%s". Expected ISO 8601 format', $datetimeString)
      );
    }

    $now = new DateTimeImmutable();

    if ($datetime <= $now) {
      throw new InvalidArgumentException(
        sprintf('Event datetime "%s" must be in the future', $datetime->format('Y-m-d H:i:s'))
      );
    }

    return $datetime;
  }

  public function getDateTime(): DateTimeImmutable
  {
    return $this->datetime;
  }

  public function toString(): string
  {
    return $this->datetime->format(DateTimeInterface::ATOM); // ISO 8601 format
  }

  public function equals(EventDateVo $other): bool
  {
    return $this->datetime == $other->getDateTime();
  }

  public function __toString(): string
  {
    return $this->toString();
  }
}