<?php

declare(strict_types=1);

namespace App\Services;

class ValidationService {

  public function isValidUsername(?string $username): bool {
    if (is_null($username)) return false;

    if(strlen($username) < 5 || strlen($username) > 64){
      return false;
    }
    return true;
  }
  public function isValidPassword(?string $password): bool {
    if (is_null($password)) return false;
    
    if(strlen($password) < 8 || strlen($password) > 64){
      return false;
    }
    
    $hasUppercase = preg_match('@[A-Z]@', $password);
    $hasLowercase = preg_match('@[a-z]@', $password);
    $hasNumber    = preg_match('@[0-9]@', $password);
    $hasSpecial   = preg_match('@[^\w]@', $password);

    if (!$hasUppercase || !$hasLowercase || !$hasNumber || !$hasSpecial){
      return false;
    }

    return true;
  }

  public function isValidEmail(?string $email): bool {
    if (is_null($email)) return false;

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      return false;
    }
    
    if (strlen($email) < 5 || strlen($email) > 64) {
      return false;
    }

    return true;
  }

  public function isValidURL(?string $url): bool {
    if (is_null($url)) return false;
    
    return filter_var($url, FILTER_VALIDATE_URL) !== false;
  }
}