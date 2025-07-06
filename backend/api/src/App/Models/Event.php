<?php
namespace App\Models;

use App\Enums\EventType;

class Event implements \JsonSerializable {
    private $event_id;
    private $title;
    private $description;
    private EventType $type;
    private $event_date;
    private $created_at;
    private $changed_at;

    public function __construct(array $data = []) {
        $this->event_id = $data['event_id'] ?? '';
        $this->title = $data['title'] ?? '';
        $this->description = $data['description'] ?? null;
        $this->type = EventType::tryFrom($data['type'] ?? 'other') ?? EventType::Other;
        $this->event_date = $data['event_date'] ?? '';
        $this->created_at = $data['created_at'] ?? date('Y-m-d H:i:s');
        $this->changed_at = $data['changed_at'] ?? date('Y-m-d H:i:s');
    }

    private function toArray(): array {
        return [
            'event_id' => $this->event_id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'event_date' => $this->event_date,
            'created_at' => $this->created_at,
            'changed_at' => $this->changed_at
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getEventId(): string { return $this->event_id; }
    public function getTitle(): string { return $this->title; }
    public function getDescription(): ?string { return $this->description; }
    public function getType(): string { return $this->type->value; }
    public function getEventDate(): string { return $this->event_date; }
    public function getCreatedAt(): string { return $this->created_at; }
    public function getChangedAt(): string { return $this->changed_at; }

    // Setters
    public function setEventId(string $event_id): void { $this->event_id = $event_id; }
    public function setTitle(string $title): void { $this->title = $title; }
    public function setDescription(?string $description): void { $this->description = $description; }
    public function setType(?string $type): void {
        $this->type = EventType::tryFrom($type ?? 'other') ?? EventType::Other;
    }
    public function setEventDate(string $event_date): void { $this->event_date = $event_date; }
    public function setCreatedAt(string $created_at): void { $this->created_at = $created_at; }
    public function setChangedAt(string $changed_at): void { $this->changed_at = $changed_at; }
    
}