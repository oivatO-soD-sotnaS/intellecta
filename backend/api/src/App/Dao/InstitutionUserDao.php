<?php

declare(strict_types=1);

namespace App\Dao;

use App\Database;
use App\Models\InstitutionUser;
use PDO;

class InstitutionUserDao {
  public function __construct(
    private Database $database
  ) {}

  /**
   * Summary of getInstitutionUserByIds
   * @param string $institution_id
   * @param string $user_id
   * @return InstitutionUser|null
   */
  public function getInstitutionUserByIds(string $institution_id, string $user_id): ?InstitutionUser {
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
}