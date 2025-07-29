<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\Subject;
use PDO;

readonly class SubjectsDao extends BaseDao {

    /**
     * Check if a user is related to a subject using the subject_users view
     * or if the user is the teacher of the subject.
     * @param string $userId
     * @param string $subjectId
     * @return bool
     */
    public function isUserRelatedToSubject(string $userId, string $subjectId): bool {
        $sql = "(
                    SELECT 1
                    FROM subject_users
                    WHERE user_id = :user_id AND subject_id = :subject_id
                )
                UNION
                (
                    SELECT 1
                    FROM subjects
                    WHERE subject_id = :subject_id_2 AND teacher_id = :user_id_2
                )
                LIMIT 1
                ";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':subject_id', $subjectId);
        $stmt->bindParam(':user_id_2', $userId);
        $stmt->bindParam(':subject_id_2', $subjectId);

        $stmt->execute();

        return $stmt->fetchColumn() !== false;
    }

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
                SET name = :name, description = :description, profile_picture_id = :profile_picture_id, banner_id = :banner_id, teacher_id = :teacher_id
                WHERE subject_id = :subject_id
                ";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        
        $stmt->bindValue(':name', $subject->getName(), PDO::PARAM_STR);
        $stmt->bindValue(':description', $subject->getDescription(), PDO::PARAM_STR);
        $stmt->bindValue(':profile_picture_id', $subject->getProfilePictureId(), PDO::PARAM_STR);
        $stmt->bindValue(':banner_id', $subject->getBannerId(), PDO::PARAM_STR);
        $stmt->bindValue(':teacher_id', $subject->getTeacherId(), PDO::PARAM_STR);
        $stmt->bindValue(':subject_id', $subject->getSubjectId(), PDO::PARAM_STR);
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