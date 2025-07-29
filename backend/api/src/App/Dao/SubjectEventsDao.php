<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\SubjectEvent;
use PDO;

readonly class SubjectEventsDao extends BaseDao {
 
    /**
     * Summary of getSubjectEventById
     * @param string $subject_id
     * @return SubjectEvent|null
     */
    public function getSubjectEventById(string $subject_event_id): ?SubjectEvent {
        $sql = "SELECT * FROM subject_events
                WHERE subject_event_id = :subject_event_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":subject_event_id", $subject_event_id, PDO::PARAM_STR);
        $stmt->execute();
        
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new SubjectEvent($data) : null;
    }

    /**
     * Summary of getAllSubjectEventsBySubjectId
     * @param string $subject_id
     * @return SubjectEvent[]
     */
    public function getAllSubjectEventsBySubjectId(string $subject_id): array {
        $sql = "SELECT * FROM subject_events
                WHERE subject_id = :subject_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":subject_id", $subject_id, PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $subjectEvents = array_map(fn(array $row) => new SubjectEvent($row), $data);

        return $subjectEvents;
    }

    /**
     * Summary of createSubjectEvent
     * @param \App\Models\SubjectEvent $subject_event
     * @return SubjectEvent|null
     */
    public function createSubjectEvent(SubjectEvent $subject_event): ?SubjectEvent {
        $sql = "INSERT INTO subject_events (subject_event_id, subject_id, event_id)
                VALUES (:subject_event_id, :subject_id, :event_id)";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":subject_event_id", $subject_event->getSubjectEventId(), PDO::PARAM_STR);
        $stmt->bindValue(":subject_id", $subject_event->getSubjectId(), PDO::PARAM_STR);
        $stmt->bindValue(":event_id", $subject_event->getEventId(), PDO::PARAM_STR);
        $success = $stmt->execute();

        return $success ? $subject_event : null;
    }
}