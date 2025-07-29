<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\ClassSubject;
use PDO;

readonly class ClassSubjectsDao extends BaseDao {

    /**
     * Summary of createClassSubject
     * @param \App\Models\ClassSubject $subject_class
     * @return ClassSubject|null
     */
    public function createClassSubject(ClassSubject $subject_class): ?ClassSubject { 
        $sql = "INSERT INTO class_subjects (class_subjects_id, class_id, subject_id)
                VALUES (:class_subjects_id, :class_id, :subject_id)";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":class_subjects_id", $subject_class->getClassSubjectsId(), PDO::PARAM_STR);
        $stmt->bindValue(":class_id", $subject_class->getClassId(), PDO::PARAM_STR);
        $stmt->bindValue(":subject_id", $subject_class->getSubjectId(), PDO::PARAM_STR);
        $success = $stmt->execute();

        return $success ?$subject_class : null;
    }

    /**
     * Summary of getClassSubjectsByClassId
     * @param string $classId
     * @return ClassSubject[]
     */
    public function getClassSubjectsByClassId(string $classId): array {
        $sql = "SELECT * FROM class_subjects
                WHERE class_id = :class_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":class_id", $classId, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $classSubjects = array_map(fn(array $row) => new ClassSubject($row), $data);

        return $classSubjects;
    }

    /**
     * Summary of getClassSubjectByid
     * @param string $class_subject_id
     * @return ClassSubject|null
     */
    public function getClassSubjectByClassSubjectIdAndClassId(string $class_subject_id, string $class_id): ?ClassSubject {
        $sql = "SELECT * FROM class_subjects
                WHERE class_subjects_id = :class_subject_id AND class_id = :class_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":class_subject_id", $class_subject_id, PDO::PARAM_STR);
        $stmt->bindValue(":class_id", $class_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new ClassSubject($data) : null;
    }

    public function deleteClassSubjectById(string $class_subject_id): bool {
        $sql = "DELETE FROM class_subjects WHERE class_subjects_id = :class_subject_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":class_subject_id", $class_subject_id, PDO::PARAM_STR);
        
        return $stmt->execute();
    }
}