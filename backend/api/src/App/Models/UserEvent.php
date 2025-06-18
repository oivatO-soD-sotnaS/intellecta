<?php
namespace App\Models;

class UserEvent implements \JsonSerializable {
    private $user_event_id;
    private $event_id;
    private $user_id;

    public function __construct(array $data = []) {
        $this->user_event_id = $data['user_event_id'] ?? '';
        $this->event_id = $data['event_id'] ?? '';
        $this->user_id = $data['user_id'] ?? '';
    }

    public function toArray(): array {
        return [
            'user_event_id' => $this->user_event_id,
            'event_id' => $this->event_id,
            'user_id' => $this->user_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getUserEventId(): string { return $this->user_event_id; }
    public function getEventId(): string { return $this->event_id; }
    public function getUserId(): string { return $this->user_id; }
    // Setters
    public function setUserEventId(string $user_event_id): void { $this->user_event_id = $user_event_id; }
    public function setEventId(string $event_id): void { $this->event_id = $event_id; }
    public function setUserId(string $user_id): void { $this->user_id = $user_id; }
}