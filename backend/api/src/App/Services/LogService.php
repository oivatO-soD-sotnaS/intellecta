<?php

declare(strict_types=1);

namespace App\Services;

class LogService {
  public static function error(string $route, string $message): void {
    $timestamp = date('Y-m-d H:i:s');
    error_log("[$timestamp] [ERROR] ($route): $message");
  }

  public static function warn(string $route, string $message): void {
    $timestamp = date('Y-m-d H:i:s');
    error_log("[$timestamp] [WARN] ($route): $message");
  }

  public static function info(string $route, string $message): void {
    $timestamp = date('Y-m-d H:i:s');
    error_log("[$timestamp] [INFO] ($route): $message");
  }

  public const DB_ERROR = "Could not complete request due to the following database error: ";
  public const UNK_ERROR = "Could not complete request due to the following unknown error: ";

 // HTTP error constants
  public const HTTP_400 = "400 Bad Request: The server could not understand the request due to invalid syntax.";
  public const HTTP_401 = "401 Unauthorized: The client must authenticate itself to get the requested response.";
  public const HTTP_403 = "403 Forbidden: The client does not have access rights to the content.";
  public const HTTP_404 = "404 Not Found: The server can not find the requested resource.";
  public const HTTP_409 = "409 Conflict: The request conflicts with the current state of the server.";
  public const HTTP_422 = "422 Unprocessable Entity: The request was well-formed but was unable to be followed due to semantic errors.";
  public const HTTP_500 = "500 Internal Server Error: The server has encountered a situation it doesn't know how to handle.";

  // Methods for logging HTTP errors
  public static function http400(string $route, ?string $additionalMessage = null): void {
    self::error($route, self::HTTP_400 . self::appendMessage($additionalMessage));
  }

  public static function http401(string $route, ?string $additionalMessage = null): void {
    self::error($route, self::HTTP_401 . self::appendMessage($additionalMessage));
  }

  public static function http403(string $route, ?string $additionalMessage = null): void {
    self::error($route, self::HTTP_403 . self::appendMessage($additionalMessage));
  }

  public static function http404(string $route, ?string $additionalMessage = null): void {
    self::error($route, self::HTTP_404 . self::appendMessage($additionalMessage));
  }

  public static function http409(string $route, ?string $additionalMessage = null): void {
    self::error($route, self::HTTP_409 . self::appendMessage($additionalMessage));
  }

  public static function http422(string $route, ?string $additionalMessage = null): void {
    self::error($route, self::HTTP_422 . self::appendMessage($additionalMessage));
  }

  public static function http500(string $route, ?string $additionalMessage = null): void {
    self::error($route, self::HTTP_500 . self::appendMessage($additionalMessage));
  }

  /**
   * Generic HTTP error logger for custom codes/messages.
   * 
   * @param string $route Route or context where the error happened
   * @param int $code HTTP status code
   * @param string $message Custom message describing the error
   * @param string|null $additionalMessage Optional extra info to append
   */
  public static function httpCustom(string $route, int $code, string $message, ?string $additionalMessage = null): void {
      $fullMessage = "{$code} {$message}" . self::appendMessage($additionalMessage);
      self::error($route, $fullMessage);
  }

  // Private helper to append optional message
  private static function appendMessage(?string $message): string {
      return $message !== null ? " Additional info: $message" : "";
  }
}
