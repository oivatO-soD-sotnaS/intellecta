<?php
namespace App\Models;

class Notification implements \JsonSerializable {
    private $notification_id;
    private $user_id;
    private $event_id;
    private $seen;
    private $created_at;

    public function __construct(array $data = []) {
        $this->notification_id = $data['notification_id'] ?? '';
        $this->user_id = $data['user_id'] ?? '';
        $this->event_id = $data['event_id'] ?? '';
        $this->seen = $data['seen'] ?? false;
        $this->created_at = $data['created_at'] ?? date('Y-m-d H:i:s');
    }

    private function toArray(): array {
        return [
            'notification_id' => $this->notification_id,
            'user_id' => $this->user_id,
            'event_id' => $this->event_id,
            'seen' => $this->seen,
            'created_at' => $this->created_at
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getNotificationId(): string { return $this->notification_id; }
    public function getUserId(): string { return $this->user_id; }
    public function getEventId(): string { return $this->event_id; }
    public function isSeen(): bool { return $this->seen; }
    public function getCreatedAt(): string { return $this->created_at; }

    public function markAsRead(): void {
        $this->seen = true;
    }
}