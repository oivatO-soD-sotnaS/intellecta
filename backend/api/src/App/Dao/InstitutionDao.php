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
  public function getInstitutionById(string $id): Institution {
    $sql = "SELECT * FROM institutions
            WHERE institution_id LIKE :institution_id";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':institution_id', $id, PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return new Institution($data);
  }

  /**
   * Summary of getInstitutionsSummary
   * @param string $userId
   * @return InstitutionSummary[]
   */
  public function getInstitutionsSummary(string $userId): array {
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

  public function getInstitutionSummaryById(string $userId, string $institutionId): InstitutionSummary {
    $sql = 'SELECT * FROM institution_summary 
            WHERE user_id LIKE :user_id
            AND institution_id LIKE :institution_id';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_STR);
    $stmt->bindValue(':institution_id', $institutionId, PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return new InstitutionSummary($data);
  }

  public function createInstitution(Institution $institution): Institution {
    $sql = "INSERT INTO institutions (institution_id, owner_id, name, email, description, thumbnail_id, banner_id)
            VALUES (:institution_id, :owner_id, :name, :email, :description, :thumbnail_id, :banner_id)";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':institution_id', $institution->getInstitutionId(), PDO::PARAM_STR);
    $stmt->bindValue(':owner_id', $institution->getOwnerId(), PDO::PARAM_STR);
    $stmt->bindValue(':name', $institution->getName(), PDO::PARAM_STR);
    $stmt->bindValue(':email', $institution->getEmail(), PDO::PARAM_STR);
    $stmt->bindValue(':description', $institution->getDescription(), PDO::PARAM_STR);
    $stmt->bindValue(':thumbnail_id', $institution->getThumbnailId(), PDO::PARAM_STR);
    $stmt->bindValue(':banner_id', $institution->getBannerId(), PDO::PARAM_STR);

    $stmt->execute();

    return $institution;
  }
  
  /**
   * Summary of getOwnedInstitutions
   * @param string $user_id
   * @return Institution[]
   */
  public function getOwnedInstitutions(string $user_id): array {
    $sql = "SELECT * FROM institutions
            WHERE owner_id LIKE :owner_id";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':owner_id', $user_id, PDO::PARAM_STR);

    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $institutions = [];

    foreach($data as $row) {
      $institutions[] = new Institution($row);
    }

    return $institutions;
  }
}