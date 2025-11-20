<?php
namespace App\Models;

use App\Enums\EventType;

class Event implements \JsonSerializable {
    private string $event_id;
    private string $title;
    private ?string $description;
    private EventType $type;
    private string $event_start;
    private string $event_end;
    private string $created_at;
    private string $changed_at;

    public function __construct(array $data = []) {
        $this->event_id    = $data['event_id'] ?? '';
        $this->title       = $data['title'] ?? '';
        $this->description = $data['description'] ?? null;

        $this->type        = EventType::tryFrom($data['type'] ?? 'other') ?? EventType::Other;

        // Novo esquema
        $this->event_start = $data['event_start'] ?? '';
        $this->event_end   = $data['event_end'] ?? '';

        $this->created_at  = $data['created_at'] ?? date('Y-m-d H:i:s');
        $this->changed_at  = $data['changed_at'] ?? date('Y-m-d H:i:s');
    }

    private function toArray(): array {
        return [
            'event_id'    => $this->event_id,
            'title'       => $this->title,
            'description' => $this->description,
            'type'        => $this->type,
            'event_start' => $this->event_start,
            'event_end'   => $this->event_end,
            'created_at'  => $this->created_at,
            'changed_at'  => $this->changed_at,
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    // Getters
    public function getEventId(): string        { return $this->event_id; }
    public function getTitle(): string          { return $this->title; }
    public function getDescription(): ?string   { return $this->description; }
    public function getType(): string           { return $this->type->value; }
    public function getEventStart(): string     { return $this->event_start; }
    public function getEventEnd(): string       { return $this->event_end; }
    public function getCreatedAt(): string      { return $this->created_at; }
    public function getChangedAt(): string      { return $this->changed_at; }

    // Setters
    public function setEventId(string $event_id): void { 
        $this->event_id = $event_id; 
    }

    public function setTitle(string $title): void { 
        $this->title = $title; 
    }

    public function setDescription(?string $description): void { 
        $this->description = $description; 
    }

    public function setType(?string $type): void {
        $this->type = EventType::tryFrom($type ?? 'other') ?? EventType::Other;
    }

    public function setEventStart(string $event_start): void { 
        $this->event_start = $event_start; 
    }

    public function setEventEnd(string $event_end): void { 
        $this->event_end = $event_end; 
    }

    public function setCreatedAt(string $created_at): void { 
        $this->created_at = $created_at; 
    }

    public function setChangedAt(string $changed_at): void { 
        $this->changed_at = $changed_at; 
    }
}