<?php

declare(strict_types=1);

namespace App\Dao;

use App\Database;
use App\Models\Event;

class EventDao {
  public function __construct(
    private Database $database
  ) {}

  /**
   * Summary of getEventById
   * @param string $eventId
   * @return Event|null
   */
  public function getEventById(string $eventId): Event {
    $sql = 'SELECT * FROM events WHERE event_id = :event_id';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':event_id', $eventId, \PDO::PARAM_STR);

    $stmt->execute();
    $data = $stmt->fetch(\PDO::FETCH_ASSOC);

    return new Event($data);
  }

  /**
   * Summary of createEvent
   * @param \App\Models\Event $event
   * @return Event|null
   */
  public function createEvent(Event $event): Event {
    $sql = 'INSERT INTO events (event_id, title, description, type, event_date, created_at, changed_at) 
            VALUES (:event_id, :title, :description, :type, :event_date, :created_at, :changed_at)';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(':event_id', $event->getEventId(), \PDO::PARAM_STR);
    $stmt->bindValue(':title', $event->getTitle(), \PDO::PARAM_STR);
    $stmt->bindValue(':description', $event->getDescription(), \PDO::PARAM_STR);
    $stmt->bindValue(':type', $event->getType(), \PDO::PARAM_STR);
    $stmt->bindValue(':event_date', $event->getEventDate(), \PDO::PARAM_STR);
    $stmt->bindValue(':created_at', $event->getCreatedAt(), \PDO::PARAM_STR);
    $stmt->bindValue(':changed_at', $event->getChangedAt(), \PDO::PARAM_STR);

    $stmt->execute();
    return $event;
  }

  /**
   * Summary of deleteEventById
   * @param string $eventId
   * @return bool
   */
  public function deleteEventById(string $eventId): bool {
    $sql = 'DELETE FROM events WHERE event_id = :event_id';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':event_id', $eventId, \PDO::PARAM_STR);

    return $stmt->execute();
  }

  /**
   * Summary of updateEvent
   * @param \App\Models\Event $event
   * @return Event|null
   */
  public function updateEvent(Event $event): Event {
    $sql = 'UPDATE events 
            SET title = :title, description = :description, type = :type, event_date = :event_date, changed_at = :changed_at 
            WHERE event_id = :event_id';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(':event_id', $event->getEventId(), \PDO::PARAM_STR);
    $stmt->bindValue(':title', $event->getTitle(), \PDO::PARAM_STR);
    $stmt->bindValue(':description', $event->getDescription(), \PDO::PARAM_STR);
    $stmt->bindValue(':type', $event->getType(), \PDO::PARAM_STR);
    $stmt->bindValue(':event_date', $event->getEventDate(), \PDO::PARAM_STR);
    $stmt->bindValue(':changed_at', date('Y-m-d H:i:s'), \PDO::PARAM_STR);
    
    $stmt->execute();
    
    return $event;
  }
}