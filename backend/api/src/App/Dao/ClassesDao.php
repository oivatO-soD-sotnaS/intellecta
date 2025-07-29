<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\ClassModel;
use PDO;

readonly class ClassesDao extends BaseDao {
    
    /**
     * Summary of getInstitutionclasses
     * @param string $institution_id
     * @return ClassModel[]
     */
    public function getClassesByInstitutionId(string $institution_id): array {
        $sql = "SELECT * FROM classes WHERE institution_id = :institution_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':institution_id', $institution_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $classes = array_map(fn(array $row) => new ClassModel($row), $data);

        return $classes;
    }

    /**
     * Summary of getClassByUserIdAndClassId
     * @param string $user_id
     * @param string $class_id
     * @return ClassModel|null
     */
    public function getClassByUserIdAndClassId(string $user_id, string $class_id): ?ClassModel {
        $sql = 'SELECT c.*
                FROM classes c
                JOIN class_users cu ON cu.class_id = c.class_id
                WHERE cu.class_id = :class_id AND cu.user_id = :user_id
                LIMIT 1
                ';

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':class_id', $class_id, PDO::PARAM_STR);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new ClassModel($data) : null;
    }

    /**
     * Summary of getClassesByUserAndInstitution
     * @param string $user_id
     * @param string $institution_id
     * @return ClassModel[]
     */
    public function getClassesByUserIdAndInstitutionId(string $user_id, string $institution_id): array {
        $sql = "SELECT c.*
                FROM classes c
                JOIN class_users cu ON cu.class_id = c.class_id
                WHERE cu.user_id = :user_id
                AND c.institution_id = :institution_id
                ";
        
        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":user_id", $user_id, PDO::PARAM_STR);
        $stmt->bindValue(':institution_id', $institution_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $classes = array_map(fn(array $row) => new ClassModel($row), $data);

        return $classes;
    }

    /**
     * Summary of getClassById
     * @param mixed $class_id
     * @return ClassModel|null
     */
    public function getClassById($class_id): ?ClassModel {
        $sql = "SELECT * FROM classes WHERE class_id = :class_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':class_id', $class_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new ClassModel($data) : null;
    }

    /**
     * Summary of createClass
     * @param \App\Models\ClassModel $classModel
     * @return ClassModel|null
     */
    public function createClass(ClassModel $classModel): ?ClassModel {
        $sql = 'INSERT INTO classes (class_id, name, description, profile_picture_id, banner_id, institution_id)
                VALUES (:class_id, :name, :description, :profile_picture_id, :banner_id, :institution_id)';

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(':class_id', $classModel->getClassId(), PDO::PARAM_STR);
        $stmt->bindValue(':name', $classModel->getName(), PDO::PARAM_STR);
        $stmt->bindValue(':description', $classModel->getDescription(), PDO::PARAM_STR);
        $stmt->bindValue(':profile_picture_id', $classModel->getProfilePictureId(), PDO::PARAM_STR);
        $stmt->bindValue(':banner_id', $classModel->getBannerId(), PDO::PARAM_STR);
        $stmt->bindValue(':institution_id', $classModel->getInstitutionId(), PDO::PARAM_STR);

        $success = $stmt->execute();
        
        return $success ? $classModel : null;
    }

    /**
     * Summary of updateClass
     * @param \App\Models\ClassModel $classModel
     * @return ClassModel|null
     */
    public function updateClass(ClassModel $classModel): ?ClassModel {
        $sql = "UPDATE classes
                SET name = :name, description = :description, profile_picture_id = :profile_picture_id, banner_id = :banner_id
                WHERE class_id = :class_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(':name', $classModel->getName(), PDO::PARAM_STR);
        $stmt->bindValue(':description', $classModel->getDescription(), PDO::PARAM_STR);
        $stmt->bindValue(':profile_picture_id', $classModel->getProfilePictureId(), PDO::PARAM_STR);
        $stmt->bindValue(':banner_id', $classModel->getBannerId(), PDO::PARAM_STR);
        $stmt->bindValue(':class_id', $classModel->getClassId(), PDO::PARAM_STR);

        $success = $stmt->execute();

        return $success ? $classModel : null;
    }

    /**
     * Summary of deleteClass
     * @param string $class_id
     * @return bool
     */
    public function deleteClass(string $class_id): bool {
        $sql = "DELETE FROM classes WHERE class_id = :class_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':class_id', $class_id, PDO::PARAM_STR);

        return $stmt->execute();
    }
}