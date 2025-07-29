<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\Assignment;
use PDO;

readonly class AssignmentsDao extends BaseDao {

    /**
     * Summary of getAssignmentsBySubjectId
     * @param string $subject_id
     * @return Assignment[]
     */
    public function getAssignmentsBySubjectId(string $subject_id): array {
        $sql = "SELECT * FROM assignments
                WHERE subject_id = :subject_id";
        
        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":subject_id", $subject_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $assignments = array_map(fn(array $row) => new Assignment($row), $data);

        return $assignments;
    }

    /**
     * Summary of createAssignment
     * @param \App\Models\Assignment $assignment
     * @return Assignment|null
     */
    public function createAssignment(Assignment $assignment): ?Assignment {
        $sql = "INSERT INTO assignments (assignment_id, title, description, deadline, subject_id, attachment_id)
                VALUES (:assignment_id, :title, :description, :deadline, :subject_id, :attachment_id)";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":assignment_id", $assignment->getAssignmentId(), PDO::PARAM_STR);
        $stmt->bindValue(":title", $assignment->getTitle(), PDO::PARAM_STR);
        $stmt->bindValue(":description", $assignment->getDescription(), PDO::PARAM_STR);
        $stmt->bindValue(":deadline", $assignment->getDeadline(), PDO::PARAM_STR);
        $stmt->bindValue(":subject_id", $assignment->getSubjectId(), PDO::PARAM_STR);
        $stmt->bindValue(":attachment_id", $assignment->getAttachmentId(), PDO::PARAM_STR);
        $success = $stmt->execute();

        return $success ? $assignment : null;
    }

    /**
     * Summary of updateAssignment
     * @param \App\Models\Assignment $assignment
     * @return Assignment|null
     */
    public function updateAssignment(Assignment $assignment): ?Assignment {
        $sql = "UPDATE assignments
                SET title = :title, description = :description, deadline = :deadline, attachment_id = :attachment_id
                WHERE assignment_id = :assignment_id";
        
        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":assignment_id", $assignment->getAssignmentId(), PDO::PARAM_STR);
        $stmt->bindValue(":title", $assignment->getTitle(), PDO::PARAM_STR);
        $stmt->bindValue(":description", $assignment->getDescription(), PDO::PARAM_STR);
        $stmt->bindValue(":deadline", $assignment->getDeadline(), PDO::PARAM_STR);
        $stmt->bindValue(":attachment_id", $assignment->getAttachmentId(), PDO::PARAM_STR);
        $success = $stmt->execute();

        return $success ? $assignment : null;
    }
    
    /**
     * Summary of getAssignmentByAssignemntId
     * @param string $assignment_id
     * @return Assignment|null
     */
    public function getAssignmentByAssignemntId(string $assignment_id): ?Assignment {
        $sql = "SELECT * FROM assignments
                WHERE assignment_id = :assignment_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":assignment_id", $assignment_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new Assignment($data) : null;
    }

     /**
      * Summary of getAssignmentByAssignemntIdAndSubjectId
      * @param string $assignment_id
      * @param string $subject_id
      * @return Assignment|null
      */
     public function getAssignmentByAssignemntIdAndSubjectId(string $assignment_id, string $subject_id): ?Assignment {
        $sql = "SELECT * FROM assignments
                WHERE assignment_id = :assignment_id
                AND subject_id = :subject_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":assignment_id", $assignment_id, PDO::PARAM_STR);
        $stmt->bindValue(":subject_id", $subject_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new Assignment($data) : null;
    }

    public function deleteAssignmentByAssignmentId(string $assignment_id): bool {
        $sql = "DELETE FROM assignments
                WHERE assignment_id = :assignment_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":assignment_id", $assignment_id, PDO::PARAM_STR);

        return $stmt->execute();
    }
}