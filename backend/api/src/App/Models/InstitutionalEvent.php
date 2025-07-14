<?php
namespace App\Models;

class InstitutionalEvent implements \JsonSerializable {
    private $institutional_event_id;
    private $event_id;
    private $institution_id;

    public function __construct(array $data = []) {
        $this->institutional_event_id = $data['institutional_event_id'] ?? '';
        $this->event_id = $data['event_id'] ?? '';
        $this->institution_id = $data['institution_id'] ?? '';
    }

    private function toArray(): array {
        return [
            'institutional_event_id' => $this->institutional_event_id,
            'event_id' => $this->event_id,
            'institution_id' => $this->institution_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }

    public function __toString()
    {
        return "Institutional event ID: ".$this->institutional_event_id.", Event ID: ".$this->event_id.", Institution ID: ".$this->institution_id;
    }

    // Getters
    public function getInstitutionalEventId(): string { return $this->institutional_event_id; }
    public function getEventId(): string { return $this->event_id; }
    public function getInstitutionId(): string { return $this->institution_id; }
    public function setInstitutionalEventId(string $institutional_event_id): void {
        $this->institutional_event_id = $institutional_event_id;
    }

    public function setEventId(string $event_id): void {
        $this->event_id = $event_id;
    }

    public function setInstitutionId(string $institution_id): void {
        $this->institution_id = $institution_id;
    }
}