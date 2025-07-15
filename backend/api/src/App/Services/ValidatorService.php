<?php
declare(strict_types=1);

namespace App\Services;

use InvalidArgumentException;

class ValidatorService
{
  public function validateRequired(?array $input, array $fields): void
  {
    if(empty($input)) {
      throw new InvalidArgumentException("Missing request body");
    }
    foreach ($fields as $field) {
      if (empty($input[$field])) {
        throw new InvalidArgumentException("Missing required field: $field");
      }
    }
  }
}
