<?php

declare(strict_types=1);

namespace App\Dao;

use App\Database;
use App\Models\Institution;
use App\Models\InstitutionSummary;
use PDO;

class InstitutionDao {
  public function __construct(
    private Database $database
  ) {}

  /**
   * Summary of getInstitutionById
   * @param string $id
   * @return Institution|null
   */
  public function getInstitutionById(string $id): ?Institution {
    $sql = "SELECT * FROM institutions
            WHERE institution_id LIKE :institution_id";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':institution_id', $id, PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $data ? new Institution($data) : null;
  }

  /**
   * Summary of getInstitutionsSummary
   * @param string $userId
   * @return InstitutionSummary[]
   */
  public function getInstitutionsSummary(string $userId): ?array {
    $sql = 'SELECT * FROM institution_summary WHERE user_id LIKE :user_id';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $institutionSummaries = [];

    foreach($data as $row) {
      $institutionSummaries[] = new InstitutionSummary($row);
    }

    return $institutionSummaries;
  }

  public function getInstitutionSummaryById(string $userId, string $institutionId): ?InstitutionSummary {
    $sql = 'SELECT * FROM institution_summary 
            WHERE user_id LIKE :user_id
            AND institution_id LIKE :institution_id';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_STR);
    $stmt->bindValue(':institution_id', $institutionId, PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $data ? new InstitutionSummary($data) : null;
  }
}