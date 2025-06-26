<?php

declare(strict_types=1);

namespace App\Dao;

use App\Database;
use App\Models\Institution;
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

}