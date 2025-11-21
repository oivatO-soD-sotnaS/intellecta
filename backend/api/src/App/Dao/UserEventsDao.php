<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\UserEvent;
use PDO;

readonly class UserEventsDao extends BaseDao {
  
  /**
   * Summary of getUserEventById
   * @param string $userEventId
   * @return UserEvent|null
   */
  public function getUserEventById(string $userEventId): ?UserEvent {
    $sql = 'SELECT * FROM user_events 
            WHERE user_event_id = :user_event_id';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':user_event_id', $userEventId, PDO::PARAM_STR);

    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $data ? new UserEvent($data) : null; 
  }

  /**
   * Summary of getAllInstitutionalEventsById
   * @param string $userId
   * @return UserEvent[]
   */
  public function getAllUserEventsByUserId(string $userId): array {
    $sql = 'SELECT * FROM user_events
            WHERE user_id = :user_id';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_STR);

    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $userEvents = [];
    
    foreach ($data as $row) {
      $userEvents[] = new UserEvent($row); 
    }

    return $userEvents;
  } 

  /**
   * Summary of createInstitutionalEvent
   * @param \App\Models\UserEvent $userEvent
   * @return UserEvent|null
   */
  public function createUserEvent(UserEvent $userEvent): ?UserEvent {
    $sql = 'INSERT INTO user_events (user_event_id, user_id, event_id) 
            VALUES (:user_event_id, :user_id, :event_id)';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(':user_event_id', $userEvent->getUserEventId(), PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $userEvent->getUserId(), PDO::PARAM_STR);
    $stmt->bindValue(':event_id', $userEvent->getEventId(), PDO::PARAM_STR);

    $success = $stmt->execute();
    return $success ? $userEvent : null;
  }

  /**
   * Get all upcoming events for a user
   * Includes user events, institutional events, and subject events
   * 
   * @param string $userId
   * @return array
   */
  public function getUpcomingUserEvents(string $userId): array {
    $sql = '
      -- User Events
      SELECT 
        e.*,
        ue.user_event_id,
        ue.user_id,
        "user" as event_source,
        NULL as institution_id,
        NULL as institution_name,
        NULL as subject_id,
        NULL as subject_name,
        NULL as subject_code
      FROM user_events ue
      JOIN events e ON ue.event_id = e.event_id
      WHERE ue.user_id = :user_id
        AND e.event_start >= NOW()
      
      UNION ALL
      
      -- Institutional Events
      SELECT 
        e.*,
        ie.institutional_event_id AS user_event_id,
        iu.user_id,
        "institution" as event_source,
        i.institution_id,
        i.name as institution_name,
        NULL as subject_id,
        NULL as subject_name,
        NULL as subject_code
      FROM institutional_events ie
      JOIN events e ON ie.event_id = e.event_id
      JOIN institution_users iu ON ie.institution_id = iu.institution_id
      JOIN institutions i ON ie.institution_id = i.institution_id
      WHERE iu.user_id = :user_id
        AND e.event_start >= NOW()
      
      UNION ALL
      
      -- Subject Events
      SELECT 
        e.*,
        se.subject_event_id as user_event_id,
        su.user_id,
        "subject" as event_source,
        s.institution_id,
        i.name as institution_name,
        s.subject_id,
        s.name as subject_name,
        NULL as subject_code
      FROM subject_events se
      JOIN events e ON se.event_id = e.event_id
      JOIN subjects s ON se.subject_id = s.subject_id
      JOIN institution_users iu ON s.institution_id = iu.institution_id
      JOIN institutions i ON s.institution_id = i.institution_id
      JOIN subject_users su ON se.subject_id = su.subject_id
      WHERE su.user_id = :user_id
        AND iu.user_id = :user_id
        AND e.event_start >= NOW()
      
      ORDER BY event_start ASC
    ';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_STR);
    
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}