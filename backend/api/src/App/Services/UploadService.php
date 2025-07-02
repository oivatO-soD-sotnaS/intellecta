<?php
declare(strict_types=1);

namespace App\Services;

class UploadService {
  private string $uploadDir;

  public function __construct(string $uploadDir = '/var/www/files.intellecta/') {
    $this->uploadDir = rtrim($uploadDir, '/') . '/';
  }

  /**
   * Uploads a file to the upload directory.
   *
   * @param string $path Relative path including filename
   * @param string $content The file content
   * @return void
   * @throws \RuntimeException If the upload fails
   */
  private function upload(string $path, string $content): void {
    $path = ltrim($path, '/');
    $targetPath = "{$this->uploadDir}{$path}";

    $dir = dirname($targetPath);
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
      throw new \RuntimeException(sprintf('Directory "%s" was not created', $dir));
    }

    $tempFile = tempnam($dir, 'tmp_');
    if ($tempFile === false) {
      throw new \RuntimeException('Failed to create a temporary file.');
    }

    if (file_put_contents($tempFile, $content) === false) {
      unlink($tempFile);
      throw new \RuntimeException('Failed to write content to temporary file.');
    }

    if (filesize($tempFile) !== strlen($content)) {
      unlink($tempFile);
      throw new \RuntimeException('Written file size does not match content length.');
    }

    if (!rename($tempFile, $targetPath)) {
      unlink($tempFile);
      throw new \RuntimeException('Failed to move temporary file to target location.');
    }

    chmod($targetPath, 0644);
  }

  public function avatar(string $ext, string $content): string {
    $fileName = bin2hex(random_bytes(32));
    $path = "users/avatar/{$fileName}.{$ext}";

    $this->upload($path, $content);
    return "http://files.intellecta:8080/{$path}";
  }
}