<?php

declare(strict_types=1);

namespace App\Dao;

use App\Models\Institution;
use App\Models\InstitutionSummary;
use PDO;

readonly class InstitutionsDao extends BaseDao {
  
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
  public function getInstitutionsSummaryByUserId(string $userId): array {
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

  /**
   * Summary of getInstitutionSummaryById
   * @param string $userId
   * @param string $institutionId
   * @return InstitutionSummary|null
   */
  public function getInstitutionSummaryByUserIdAndInstitutionId(string $userId, string $institutionId): ?InstitutionSummary {
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

  /**
   * Summary of createInstitution
   * @param \App\Models\Institution $institution
   * @return Institution|null
   */
  public function createInstitution(Institution $institution): ?Institution {
    $sql = "INSERT INTO institutions (institution_id, user_id, name, email, description, profile_picture_id, banner_id)
            VALUES (:institution_id, :user_id, :name, :email, :description, :profile_picture_id, :banner_id)";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':institution_id', $institution->getInstitutionId(), PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $institution->getUserId(), PDO::PARAM_STR);
    $stmt->bindValue(':name', $institution->getName(), PDO::PARAM_STR);
    $stmt->bindValue(':email', $institution->getEmail(), PDO::PARAM_STR);
    $stmt->bindValue(':description', $institution->getDescription(), PDO::PARAM_STR);
    $stmt->bindValue(':profile_picture_id', $institution->getProfilePictureId(), PDO::PARAM_STR);
    $stmt->bindValue(':banner_id', $institution->getBannerId(), PDO::PARAM_STR);

    $success = $stmt->execute();

    return $success ? $institution : null;
  }
  
  /**
   * Summary of getOwnedInstitutions
   * @param string $user_id
   * @return Institution[]
   */
  public function getUserOwnedInstitutions(string $user_id): array {
    $sql = "SELECT * FROM institutions
            WHERE user_id LIKE :user_id";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);

    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $institutions = [];

    foreach($data as $row) {
      $institutions[] = new Institution($row);
    }

    return $institutions;
  }

  /**
   * Summary of getInstitutionsByUserId
   * @param string $userId
   * @return Institution[]
   */
  public function getInstitutionsByUserId(string $userId): array {
    $sql = "SELECT DISTINCT
              i.institution_id,
              i.name,
              i.email,
              i.description
            FROM 
              institutions i
            JOIN 
              institution_users iu ON i.institution_id = iu.institution_id
            WHERE 
              iu.user_id = :user_id";
              
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':user_id', $userId, PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $institutions = [];

    foreach($data as $row) {
      $institutions[] = new Institution($row);
    }

    return $institutions;
  }

  public function updateInstitution(Institution $institution): ?Institution {
    $sql = "UPDATE institutions
            SET name = :name, description = :description, profile_picture_id = :profile_picture_id, banner_id = :banner_id
            WHERE institution_id = :institution_id";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':name', $institution->getName(), PDO::PARAM_STR);
    $stmt->bindValue(':description', $institution->getDescription(), PDO::PARAM_STR);
    $stmt->bindValue(':profile_picture_id', $institution->getProfilePictureId(), PDO::PARAM_STR);
    $stmt->bindValue(':banner_id', $institution->getBannerId(), PDO::PARAM_STR);
    $stmt->bindValue(':institution_id', $institution->getInstitutionId(), PDO::PARAM_STR);

    $success = $stmt->execute();

    return $success ? $institution : null;
  }

  public function deleteInstitution(string $institutionId): bool {
    $sql = "DELETE FROM institutions
            WHERE institution_id = :institution_id";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':institution_id', $institutionId, PDO::PARAM_STR);

    return $stmt->execute();
  }
}