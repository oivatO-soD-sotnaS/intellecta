<?php

declare(strict_types=1);

namespace App\Dao;

use App\Database;
use App\Models\Event;
use App\Models\UserEvent;
use PDO;

class UserEventDao {
  public function __construct(
    private Database $database
  ) {}

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

    if ($data) {
      return new UserEvent($data); 
    }

    return null;
  }

  /**
   * Summary of getAllInstitutionalEventsById
   * @param string $userId
   * @return UserEvent[]
   */
  public function getAllInstitutionalEventsById(string $userId): ?array {
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
  public function createInstitutionalEvent(UserEvent $userEvent): ?UserEvent {
    $sql = 'INSERT INTO user_events (user_event_id, user_id, event_id) 
            VALUES (:user_event_id, :user_id, :event_id)';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(':user_event_id', $userEvent->getUserEventId(), PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $userEvent->getUserId(), PDO::PARAM_STR);
    $stmt->bindValue(':event_id', $userEvent->getEventId(), PDO::PARAM_STR);

    $success = $stmt->execute();
    if ($success) {
      return $userEvent;
    }

    return null;
  }
}