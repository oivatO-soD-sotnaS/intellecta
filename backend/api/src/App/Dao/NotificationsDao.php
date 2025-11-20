<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\Notification;
use App\Vo\PaginationVo;
use PDO;
use Ramsey\Uuid\Uuid;

readonly class NotificationsDao extends BaseDao {

    /** Marca notificação como vista */
    public function setNotificationAsSeen(string $notification_id): bool {
        $sql = "UPDATE notifications
                SET seen = TRUE
                WHERE notification_id = :notification_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":notification_id", $notification_id);

        return $stmt->execute();
    }

    /** Busca notificação pelo ID */
    public function getNotificationById(string $notification_id): ?Notification {
        $sql = "SELECT * FROM notifications WHERE notification_id = :notification_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":notification_id", $notification_id);

        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new Notification($data) : null;
    }

    /** Cria uma notificação */
    public function createNotification(Notification $notification): ?Notification {
        $sql = "INSERT INTO notifications (notification_id, user_id, event_id, seen, created_at)
                VALUES (:notification_id, :user_id, :event_id, :seen, :created_at)";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(":notification_id", $notification->getNotificationId());
        $stmt->bindValue(":user_id", $notification->getUserId());
        $stmt->bindValue(":event_id", $notification->getEventId());
        $stmt->bindValue(":seen", $notification->isSeen(), PDO::PARAM_BOOL);
        $stmt->bindValue(":created_at", $notification->getCreatedAt());

        return $stmt->execute() ? $notification : null;
    }

    /**
     * Criar notificações em massa para vários usuários
     */
    public function createNotificationsForUsers(array $userIds, string $eventId): int {
        if (empty($userIds)) return 0;

        $pdo = $this->database->getConnection();
        $values = [];
        $params = [];
        $timestamp = date('Y-m-d H:i:s');

        foreach ($userIds as $userId) {
            $values[] = "(?, ?, ?, ?, ?)";
            $params[] = Uuid::uuid4()->toString();
            $params[] = $userId;
            $params[] = $eventId;
            $params[] = 0;
            $params[] = $timestamp;
        }

        $sql = "
            INSERT INTO notifications (notification_id, user_id, event_id, seen, created_at)
            VALUES " . implode(',', $values);

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return $stmt->rowCount();
    }

    /** Conta notificações com filtros */
    public function countUserNotifications(string $user_id, array $filters): int {
        $sql = "
            SELECT COUNT(*) AS total
            FROM notifications n
            INNER JOIN events e ON n.event_id = e.event_id
            WHERE n.user_id = :user_id
        ";

        $params = [":user_id" => $user_id];

        $this->setFilters($filters, $sql, $params);

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);

        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }

        $stmt->execute();
        return (int) $stmt->fetchColumn();
    }

    /** Lista notificações paginadas com filtros */
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
                e.event_start,
                e.event_end
            FROM notifications n
            INNER JOIN events e ON n.event_id = e.event_id
            WHERE n.user_id = :user_id
        ";

        $params = [
            ":user_id" => $user_id,
        ];

        $this->setFilters($filters, $sql, $params);

        $sql .= " ORDER BY n.created_at DESC LIMIT :limit OFFSET :offset";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(":user_id", $user_id);

        $stmt->bindValue(":limit", $pagination->getLimit(), PDO::PARAM_INT);
        $stmt->bindValue(":offset", $pagination->getOffset(), PDO::PARAM_INT);

        foreach ($params as $key => $val) {
            if ($key === ":limit" || $key === ":offset") continue;
            $stmt->bindValue($key, $val);
        }

        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map(fn($row) => new Notification($row), $data);
    }

    /** Atualiza filtros para o novo modelo com event_start/event_end */
    private function setFilters(array $filters, string &$sql, array &$params) {

        if (isset($filters['event_description'])) {
            $sql .= " AND e.description LIKE :event_description";
            $params[':event_description'] = "%" . $filters['event_description'] . "%";
        }

        if (isset($filters['title'])) {
            $sql .= " AND e.title LIKE :title";
            $params[':title'] = "%" . $filters['title'] . "%";
        }

        if (isset($filters['event_type'])) {
            $sql .= " AND e.type = :event_type";
            $params[':event_type'] = $filters['event_type'];
        }

        /** atualizado: agora filtra por event_start */
        if (isset($filters['event_date'])) {
            $sql .= " AND DATE(e.event_start) = :event_date";
            $params[':event_date'] = $filters['event_date'];
        }

        if (isset($filters['seen'])) {
            $sql .= " AND n.seen = :seen";
            $params[':seen'] = $filters['seen'] ? 1 : 0;
        }

        if (isset($filters['created_at_from'])) {
            $sql .= " AND n.created_at >= :created_at_from";
            $params[':created_at_from'] = $filters['created_at_from'];
        }

        if (isset($filters['created_at_to'])) {
            $sql .= " AND n.created_at <= :created_at_to";
            $params[':created_at_to'] = $filters['created_at_to'];
        }
    }
}
