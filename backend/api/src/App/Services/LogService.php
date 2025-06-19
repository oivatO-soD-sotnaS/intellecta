<?php

declare(strict_types=1);

namespace App\Services;

class LogService {
  static public function error(string $route, string $message) {
    error_log("[ERROR] ($route): $message");
  }
  static public function info(string $route, string $message) {
    error_log("[INFO] ($route): $message");
  }
  static public function warn(string $route, string $message) {
    error_log("[WARN] ($route): $message");
  }
}