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

  public function getUserEventById(string $userId, string $eventId): ?Event {
    $sql = 'SELECT 
              e.event_id,
              e.title,
              e.description,
              e.type,
              e.event_date,
              e.created_at,
              e.changed_at
            FROM user_events ue
            JOIN events e ON ue.event_id = e.event_id
            WHERE ue.user_id = :user_id AND ue.event_id = :event_id';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_STR);
    $stmt->bindValue(':event_id', $eventId, PDO::PARAM_STR);

    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        return new Event($data); 
    }

    return null;
  }

  public function getAllUserEventsById(string $userId): ?array {
    $sql = 'SELECT 
              e.event_id,
              e.title,
              e.description,
              e.type,
              e.event_date,
              e.created_at,
              e.changed_at
            FROM user_events ue
            JOIN events e ON ue.event_id = e.event_id
            WHERE ue.user_id = :user_id';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_STR);

    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $userEvents = [];
    
    foreach ($data as $row) {
        $userEvents[] = new Event($row); 
    }

    return $userEvents;
  } 
}