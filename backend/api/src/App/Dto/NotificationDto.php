<?php
declare(strict_types=1);

namespace App\Dto;

use App\Models\Event;
use App\Models\Notification;

readonly class NotificationDto implements \JsonSerializable {
    private string $notification_id;
    private string $user_id;
    private Event $event;
    private bool $seen;
    private string $created_at;

    public function __construct(Notification $notification, Event $event) {
        $this->notification_id = $notification->getNotificationId();
        $this->user_id = $notification->getUserId();
        $this->event = $event;
        $this->seen = $notification->isSeen();
        $this->created_at = $notification->getCreatedAt();
    }

    public function toArray(): array {
        return [
            'notification_id' => $this->notification_id,
            'user_id' => $this->user_id,
            'event' => $this->event,
            'seen' => $this->seen,
            'created_at' => $this->created_at
        ];
    }

    public function jsonSerialize(): mixed {
        return $this->toArray();
    }
}