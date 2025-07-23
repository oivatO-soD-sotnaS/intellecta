<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\Subject;
use PDO;

class SubjectsDao extends BaseDao {

    /**
     * Summary of getSubjectsByInstitutionId
     * @param string $institution_id
     * @return Subject[]
     */
    public function getSubjectsByInstitutionId(string $institution_id): array {
        $sql = "SELECT * FROM subjects
                WHERE institution_id = :institution_id";
    
        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":institution_id", $institution_id, PDO::PARAM_STR);
        $stmt->execute();
        
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $subjects = array_map(fn(array $row) => new Subject($row), $data);

        return $subjects;
    }

    /**
     * Summary of getSubjectsByClassId
     * @param string $class_id
     * @return Subject[]
     */
    public function getSubjectsByClassId(string $class_id): array {
        $sql = "SELECT s.*
                FROM subjects s
                JOIN subject_classes sc ON sc.subject_id = s.subject_id
                WHERE sc.class_id = :class_id;
                ";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':class_id', $class_id, PDO::PARAM_STR);
        $stmt ->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $subjects = array_map(fn(array $row) => new Subject($row), $data);

        return $subjects;
    }

    /**
     * Summary of getSubjectById
     * @param string $subject_id
     * @return Subject|null
     */
    public function getSubjectBySubjectIdAndInstitutionId(string $subject_id, string $institution_id): ?Subject {
        $sql = 'SELECT * FROM subjects
                WHERE subject_id = :subject_id AND institution_id = :institution_id';

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':subject_id', $subject_id, PDO::PARAM_STR);
        $stmt->bindValue(':institution_id', $institution_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new Subject($data) : null;
    }


    /**
     * Summary of createSubject
     * @param \App\Models\Subject $subject
     * @return Subject|null
     */
    public function createSubject(Subject $subject): ?Subject{
        $sql = 'INSERT INTO subjects (subject_id, name, description, profile_picture_id, banner_id, institution_id, teacher_id)
                VALUES (:subject_id, :name, :description, :profile_picture_id, :banner_id, :institution_id, :teacher_id)';
        
        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':subject_id', $subject->getSubjectId(), PDO::PARAM_STR);
        $stmt->bindValue(':name', $subject->getName(), PDO::PARAM_STR);
        $stmt->bindValue(':description', $subject->getDescription(), PDO::PARAM_STR);
        $stmt->bindValue(':profile_picture_id', $subject->getProfilePictureId(), PDO::PARAM_STR);
        $stmt->bindValue(':banner_id', $subject->getBannerId(), PDO::PARAM_STR);
        $stmt->bindValue(':institution_id', $subject->getInstitutionId(), PDO::PARAM_STR);
        $stmt->bindValue(':teacher_id', $subject->getTeacherId(), PDO::PARAM_STR);
        $success = $stmt->execute();

        return $success ? $subject : null;
    }

    /**
     * Summary of updateSubject
     * @param \App\Models\Subject $subject
     * @return Subject|null
     */
    public function updateSubject(Subject $subject): ?Subject {
        $sql = "UPDATE subjects
                SET name = :name, description = :description, profile_picture_id = :profile_picture_id, banner_id = :banner_id, teacher = :teacher_id
                WHERE subject_id = :subject_id
                ";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        
        $stmt->bindValue(':name', $subject->getName(), PDO::PARAM_STR);
        $stmt->bindValue(':description', $subject->getDescription(), PDO::PARAM_STR);
        $stmt->bindValue(':profile_picture_id', $subject->getProfilePictureId(), PDO::PARAM_STR);
        $stmt->bindValue(':banner_id', $subject->getBannerId(), PDO::PARAM_STR);
        $stmt->bindValue(':teacher_id', $subject->getTeacherId(), PDO::PARAM_STR);
     
        $success = $stmt->execute();

        return $success ? $subject : null;
    }

    public function deleteSubjectById(string $subject_id): bool {
        $sql = "DELETE FROM subjects WHERE subject_id = :subject_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":subject_id", $subject_id, PDO::PARAM_STR);
        
        return $stmt->execute();
    }
}