<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\Notification;
use App\Vo\PaginationVo;
use PDO;
use Ramsey\Uuid\Uuid;

readonly class NotificationsDao extends BaseDao {
    public function setNotificationAsSeen(string $notification_id): bool {
        $sql = "UPDATE notifications
                SET seen = TRUE
                WHERE notification_id = :notification_id";
        
        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":notification_id", $notification_id, PDO::PARAM_STR);
        
        return $stmt->execute(); 
    }

    public function getNotificationById(string $notification_id): ?Notification {
        $sql = "SELECT * FROM notifications WHERE notification_id = :notification_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":notification_id", $notification_id, PDO::PARAM_STR);
        $success = $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $success ? new Notification($data) : null;
    }
    
    public function createNotification(Notification $notification): ?Notification {
        $sql = "INSERT INTO notifications (notification_id, user_id, event_id, seen, created_at)
                VALUES (:notification_id, :user_id, :event_id, :seen, :created_at)";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":notification_id", $notification->getNotificationId(), PDO::PARAM_STR);
        $stmt->bindValue(":user_id", $notification->getUserId(), PDO::PARAM_STR);
        $stmt->bindValue(":event_id", $notification->getEventId(), PDO::PARAM_STR);
        $stmt->bindValue(":seen", $notification->isSeen(), PDO::PARAM_BOOL);
        $stmt->bindValue(":created_at", $notification->getCreatedAt(), PDO::PARAM_STR);
        
        if($stmt->execute()) {
            return $notification;
        }

        return null;
    }

    /**
     * Creates notifications for multiple users for the same event (bulk insert).
     *
     * @param string[] $userIds
     * @param string $eventId
     * @return int Number of notifications created
     */
    public function createNotificationsForUsers(array $userIds, string $eventId): int {
        if (empty($userIds)) {
            return 0;
        }

        $pdo = $this->database->getConnection();

        // Build bulk INSERT
        $values = [];
        $params = [];
        $timestamp = date('Y-m-d H:i:s');

        foreach ($userIds as $index => $userId) {
            $notificationId = Uuid::uuid4()->toString();
            $values[] = "(?, ?, ?, ?, ?)";
            $params[] = $notificationId;
            $params[] = $userId;
            $params[] = $eventId;
            $params[] = 0; // seen = false
            $params[] = $timestamp;
        }

        $sql = "
            INSERT INTO notifications (notification_id, user_id, event_id, seen, created_at)
            VALUES 
        " . implode(',', $values);

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return $stmt->rowCount();
    }


    public function countUserNotifications(string $user_id, array $filters): int {
        $sql = "
            SELECT COUNT(*) as total
            FROM notifications n
            INNER JOIN events e ON n.event_id = e.event_id
            WHERE n.user_id = :user_id
        ";

        $params = [
            ':user_id' => $user_id,
        ];

        // aplica os mesmos filtros com alias 'e'
        $this->setFilters($filters, $sql, $params);

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value, PDO::PARAM_STR);
        }

        $stmt->execute();
        return (int) $stmt->fetchColumn();
    }


    public function getUserNotificationsPaginated(
        string $user_id,
        PaginationVo $pagination,
        array $filters
    ): array {
        $sql = "
            SELECT 
                n.*, 
                e.title, 
                e.description, 
                e.type AS event_type, 
                e.event_date 
            FROM notifications n
            INNER JOIN events e ON n.event_id = e.event_id
            WHERE n.user_id = :user_id
        ";
        
        $params = [
            ':user_id' => $user_id, 
        ];

        // aplica filtros dinâmicos
        $this->setFilters($filters, $sql, $params);

        // paginação
        $sql .= " ORDER BY n.created_at DESC LIMIT :limit OFFSET :offset";
        $params[':limit'] = $pagination->getLimit();
        $params[':offset'] = $pagination->getOffset();

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        
        foreach ($params as $key => $value) {
            $type = in_array($key, [':limit', ':offset']) ? PDO::PARAM_INT : PDO::PARAM_STR;
            $stmt->bindValue($key, $value, $type);
        }

        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $notifications = array_map(fn(array $row) => new Notification($row), $data);
        
        return $notifications;
    }


    private function setFilters(array $filters, string &$sql, array &$params) {
        if (isset($filters['event_description'])) {
            $sql .= ' AND e.description LIKE :event_description';
            $params[':event_description'] = "%{$filters['event_description']}%";
        }
        
        if (isset($filters['title'])) {
            $sql .= ' AND e.title LIKE :title';
            $params[':title'] = "%{$filters['title']}%";
        }
        
        if (isset($filters['event_type'])) {
            $sql .= ' AND e.type = :event_type';
            $params[':event_type'] = $filters['event_type'];
        }
        
        if (isset($filters['event_date'])) {
            $sql .= ' AND DATE(e.event_date) = :event_date';
            $params[':event_date'] = $filters['event_date'];
        }
        
        if (isset($filters['seen'])) {
            $sql .= ' AND n.seen = :seen';
            $params[':seen'] = $filters['seen'] ? 1 : 0;
        }
        
        if(isset($filters["created_at_from"])) {
            $sql .= ' AND n.created_at >= :created_at_from';
            $params[':created_at_from'] = $filters['created_at_from'];
        }
        
        if(isset($filters["created_at_to"])) {
            $sql .= ' AND n.created_at <= :created_at_to';
            $params[':created_at_to'] = $filters['created_at_to'];
        }
    }
}