<?php

declare(strict_types=1);

namespace App\Dao;

use App\Models\InstitutionUser;
use PDO;

readonly class InstitutionUsersDao extends BaseDao {
  
  /**
   * Summary of getInstitutionUserById
   * @param string $institution_user_id
   * @return InstitutionUser|null
   */
  public function getInstitutionUserById(string $institution_user_id): ?InstitutionUser {
    $sql = "SELECT * FROM institution_users
            WHERE institution_user_id LIKE :institution_user_id";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':institution_user_id', $institution_user_id, PDO::PARAM_STR);
    $stmt->execute();
    
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $data ? new InstitutionUser($data) : null;
  }

  /**
   * Summary of getInstitutionUserByIds
   * @param string $institution_id
   * @param string $user_id
   * @return InstitutionUser|null
   */
  public function getInstitutionUserByInstitutionIdAndUserId(string $institution_id, string $user_id): ?InstitutionUser {
    $sql = "SELECT * FROM institution_users
            WHERE user_id = :user_id
            AND institution_id = :institution_id";
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':institution_id', $institution_id, PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);
    $stmt->execute();
    

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $data ? new InstitutionUser($data) : null;
  }

  /**
   * Summary of createInstitutionUser
   * @param \App\Models\InstitutionUser $institutionUser
   * @return InstitutionUser|null
   */
  public function createInstitutionUser(InstitutionUser $institutionUser): ?InstitutionUser {
    $sql = "INSERT INTO institution_users (institution_user_id, role, joined_at, institution_id, user_id)
            VALUES (:institution_user_id, :role, :joined_at, :institution_id, :user_id)";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':institution_user_id', $institutionUser->getInstitutionUsersId(), PDO::PARAM_STR);
    $stmt->bindValue(':role', $institutionUser->getRole(), PDO::PARAM_STR);
    $stmt->bindValue(':joined_at', $institutionUser->getJoinedAt(), PDO::PARAM_STR);
    $stmt->bindValue(':institution_id', $institutionUser->getInstitutionId(), PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $institutionUser->getUserId(), PDO::PARAM_STR);

    $success = $stmt->execute();

    return $success ? $institutionUser : null;
  }

  /**
   * Summary of getUsersByInstitutionId
   * @param string $institution_id
   * @return InstitutionUser[]
   */
  public function getInstitutionUsersByInstitutionId(string $institution_id): array {
    $sql = "SELECT * FROM institution_users WHERE institution_id = :institution_id";
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':institution_id', $institution_id, PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return array_map(fn($item) => new InstitutionUser($item), $data);
  }

  /**
   * Summary of updateInstitutionUserRole
   * @param \App\Models\InstitutionUser $institutionUser
   * @return InstitutionUser|null
   */
  public function updateInstitutionUserRole(InstitutionUser $institutionUser) {
    $sql = "UPDATE institution_users SET
              role = :role
            WHERE user_id = :user_id
            AND institution_id = :institution_id";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':role', $institutionUser->getRole(), PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $institutionUser->getUserId(), PDO::PARAM_STR);
    $stmt->bindValue(':institution_id', $institutionUser->getInstitutionId(), PDO::PARAM_STR);
    $success = $stmt->execute();
    
    return $success ? $institutionUser : null;
  }

  /**
   * Summary of deleteInstitutionUser
   * @param \App\Models\InstitutionUser $institutionUser
   * @return bool
   */
  public function deleteInstitutionUser(InstitutionUser $institutionUser): bool {
    $sql = 'DELETE FROM institution_users 
            WHERE user_id = :user_id
            AND institution_id = :institution_id';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':user_id', $institutionUser->getUserId(), PDO::PARAM_STR);
    $stmt->bindValue(':institution_id', $institutionUser->getInstitutionId(), PDO::PARAM_STR);

    return $stmt->execute();
  }
}