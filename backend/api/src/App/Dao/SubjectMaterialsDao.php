<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\Material;
use PDO;

class SubjectMaterialsDao extends BaseDao {

    /**
     * Summary of getMaterialsBySubjectId
     * @param string $subject_id
     * @return Material[]
     */
    public function getMaterialsBySubjectId(string $subject_id): array {
        $sql = "SELECT * FROM materials WHERE subject_id = :subject_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":subject_id", $subject_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $materials = array_map(fn(array $row) => new Material($row), $data);

        return $materials;
    }

    /**
     * Summary of createMaterial
     * @param \App\Models\Material $material
     * @return Material|null
     */
    public function createMaterial(Material $material): ?Material {
        $sql = "INSERT INTO materials (material_id, title, created_at, changed_at, subject_id, file_id)
                VALUES (:material_id, :title, :created_at, :changed_at, :subject_id, :file_id)";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":material_id", $material->getMaterialId(), PDO::PARAM_STR);
        $stmt->bindValue(":title", $material->getTitle(), PDO::PARAM_STR);
        $stmt->bindValue(":created_at", $material->getCreatedAt(), PDO::PARAM_STR);
        $stmt->bindValue(":changed_at", $material->getChangedAt(), PDO::PARAM_STR);
        $stmt->bindValue(":subject_id", $material->getSubjectId(), PDO::PARAM_STR);
        $stmt->bindValue(":file_id", $material->getFileId(), PDO::PARAM_STR);
        $success = $stmt->execute();

        return $success ? $material : null;
    }

    /**
     * Summary of getMaterialById
     * @param string $materia_id
     * @return Material|null
     */
    public function getMaterialById(string $materia_id): ?Material {
        $sql = "SELECT * FROM materials
                WHERE material_id = :material_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":material_id", $materia_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new Material($data) : null;
    }

    /**
     * Summary of updateMaterial
     * @param \App\Models\Material $material
     * @return Material|null
     */
    public function updateMaterial(Material $material): ?Material {
        $sql = "UPDATE materials
                SET title = :title, created_at = :created_at, changed_at = :changed_at, subject_id = :subject_id, file_id = :file_id
                WHERE material_id = :material_id";
    
        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":material_id", $material->getMaterialId(), PDO::PARAM_STR);
        $stmt->bindValue(":title", $material->getTitle(), PDO::PARAM_STR);
        $stmt->bindValue(":created_at", $material->getCreatedAt(), PDO::PARAM_STR);
        $stmt->bindValue(":changed_at", $material->getChangedAt(), PDO::PARAM_STR);
        $stmt->bindValue(":subject_id", $material->getSubjectId(), PDO::PARAM_STR);
        $stmt->bindValue(":file_id", $material->getFileId(), PDO::PARAM_STR);
        $success = $stmt->execute();

        return $success ? $material : null;
    }

    public function deleteMaterialById(string $material_id): bool {
        $sql = "DELETE FROM materials WHERE material_id = :material_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":material_id", $material_id, PDO::PARAM_STR);

        return $stmt->execute();
    }
}