<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\Submission;
use PDO;

readonly class SubmissionsDao extends BaseDao
{

    /**
     * Summary of getSubmissionsByAssignmentIdAndSubjectId
     * @param string $assignment_id
     * @param string $subject_id
     * @return Submission[]
     */
    public function getSubmissionsByAssignmentIdAndSubjectId(string $assignment_id, string $subject_id): array
    {
        $sql = "SELECT s.*
                FROM submissions s
                JOIN assignments a ON s.assignment_id = a.assignment_id
                WHERE a.subject_id = :subject_id
                AND s.assignment_id = :assignment_id;
                ";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":assignment_id", $assignment_id, PDO::PARAM_STR);
        $stmt->bindValue(":subject_id", $subject_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $submissions = array_map(fn(array $row) => new Submission($row), $data);

        return $submissions;
    }

    /**
     * Summary of createSubmission
     * @param \App\Models\Submission $submission
     * @return Submission|null
     */
    public function createSubmission(Submission $submission): ?Submission
    {
        $sql = "INSERT INTO submissions (submission_id, submitted_at, concept, feedback, assignment_id, user_id, attachment_id)
                VALUES (:submission_id, :submitted_at, :concept, :feedback, :assignment_id, :user_id, :attachment_id)";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(':submission_id', $submission->getSubmissionId(), PDO::PARAM_STR);
        $stmt->bindValue(':submitted_at', $submission->getSubmittedAt(), PDO::PARAM_STR);
        $stmt->bindValue(':concept', $submission->getConcept(), PDO::PARAM_STR);
        $stmt->bindValue(':feedback', $submission->getFeedback(), PDO::PARAM_STR);
        $stmt->bindValue(':assignment_id', $submission->getAssignmentId(), PDO::PARAM_STR);
        $stmt->bindValue(':user_id', $submission->getUserId(), PDO::PARAM_STR);
        $stmt->bindValue(':attachment_id', $submission->getAttachmentId(), PDO::PARAM_STR);
        $success = $stmt->execute();

        return $success ? $submission : null;
    }


    /**
     * Summary of updateSubmissionAttachmentId
     * @param \App\Models\Submission $submission
     * @return Submission|null
     */
    public function updateSubmissionAttachmentId(Submission $submission): ?Submission {
        $sql = "UPDATE submissions
                SET attachment_id = :attachment_id
                WHERE submission_id = :submission_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":submission_id", $submission->getSubmissionId(), PDO::PARAM_STR);
        $stmt->bindValue(":attachment_id", $submission->getAttachmentId(), PDO::PARAM_STR);
        $success = $stmt->execute();

        return $success ? $submission : null;
    }

    /**
     * Summary of updateSubmissionConceptAndFeedback
     * @param \App\Models\Submission $submission
     * @return Submission|null
     */
    public function updateSubmissionConceptAndFeedback(Submission $submission): ?Submission {
        $sql = "UPDATE submissions
                SET concept = :concept, feedback = :feedback
                WHERE submission_id = :submission_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":submission_id", $submission->getSubmissionId(), PDO::PARAM_STR);
        $stmt->bindValue(":concept", $submission->getConcept(), PDO::PARAM_STR);
        $stmt->bindValue(":feedback", $submission->getFeedback(), PDO::PARAM_STR);

        $success = $stmt->execute();

        return $success ? $submission : null;
    }

    /**
     * Summary of getSubmissionBySubmissionIdAndAssignmentId
     * @param string $stmt
     * @param int $assignmentId
     * @return Submission|null
     */
    public function getSubmissionBySubmissionIdAndAssignmentId(string $submission_id, string $assignmentId): ?Submission {
        $sql = "SELECT * FROM submissions
                WHERE submission_id = :submission_id
                AND assignment_id = :assignment_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":submission_id", $submission_id, PDO::PARAM_STR);
        $stmt->bindValue(":assignment_id", $assignmentId, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new Submission($data) : null;
    }

    public function deleteSubmissionBySubmissionId(string $submission_id): bool {
        $sql = "DELETE FROM submission
                WHERE submission_id = :submission_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':submission_id', $submission_id, PDO::PARAM_STR);
        
        return $stmt->execute();
    }
}
