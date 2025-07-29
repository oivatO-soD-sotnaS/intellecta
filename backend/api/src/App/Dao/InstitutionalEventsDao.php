<?php

declare(strict_types=1);

namespace App\Dao;

use App\Models\InstitutionalEvent;
use PDO;

readonly class InstitutionalEventsDao extends BaseDao {

  /**
   * Summary of getInstitutionalEventById
   * @param string $institutionalEventId
   * @return InstitutionalEvent|null
   */
  public function getInstitutionalEventById(string $institutionalEventId): ?InstitutionalEvent {
    $sql = 'SELECT * FROM institutional_events 
            WHERE institutional_event_id = :institutional_event_id';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':institutional_event_id', $institutionalEventId, PDO::PARAM_STR);

    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
      return new InstitutionalEvent($data); 
    }

    return null;
  }

  /**
   * Summary of getAllInstitutionalEventsById
   * @param string $institutionId
   * @return InstitutionalEvent[]
   */
  public function getInstitutionalEventsByInstitutionId(string $institutionId): ?array {
    $sql = 'SELECT * FROM institutional_events
            WHERE institution_id = :institution_id';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':institution_id', $institutionId, PDO::PARAM_STR);

    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $userEvents = [];
    
    foreach ($data as $row) {
      $userEvents[] = new InstitutionalEvent($row); 
    }

    return $userEvents;
  } 

  /**
   * Summary of createInstitutionalEvent
   * @param \App\Models\InstitutionalEvent $institutionalEvent
   * @return InstitutionalEvent|null
   */
  public function createInstitutionalEvent(InstitutionalEvent $institutionalEvent): ?InstitutionalEvent {
    $sql = 'INSERT INTO institutional_events (institutional_event_id, institution_id, event_id) 
            VALUES (:institutional_event_id, :institution_id, :event_id)';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(':institutional_event_id', $institutionalEvent->getInstitutionalEventId(), PDO::PARAM_STR);
    $stmt->bindValue(':institution_id', $institutionalEvent->getInstitutionId(), PDO::PARAM_STR);
    $stmt->bindValue(':event_id', $institutionalEvent->getEventId(), PDO::PARAM_STR);

    if ($stmt->execute()) {
      return $institutionalEvent;
    }

    return null;
  }
}