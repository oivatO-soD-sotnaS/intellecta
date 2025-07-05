<?php
declare(strict_types=1);

namespace App\Dao;

use App\Database;
use App\Models\File;
use PDO;

class FilesDao {
  public function __construct(
    private Database $database
  ) {}

  public function createFile (File $file): ?File {
    $sql = "INSERT INTO files (file_id, url, filename, mime_type, size, uploaded_at)
            VALUE (:file_id, :url, :filename, :mime_type, :size, :uploaded_at)";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':file_id', $file->getFileId(), PDO::PARAM_STR);
    $stmt->bindValue(':url', $file->getUrl(), PDO::PARAM_STR);
    $stmt->bindValue(':filename', $file->getFilename(), PDO::PARAM_STR);
    $stmt->bindValue(':mime_type', $file->getMimeType(), PDO::PARAM_STR);
    $stmt->bindValue(':size', $file->getSize(), PDO::PARAM_STR);
    $stmt->bindValue(':uploaded_at', $file->getUploadedAt(), PDO::PARAM_STR);

    $success = $stmt->execute();
    return $success ? $file : null;
  }

  public function getFileById(string $fileId): ?File {
    $sql = "SELECT * FROM files
            WHERE file_id LIKE :file_id";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':file_id', $fileId, PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    return $data ? new File($data) : null;
  }
}