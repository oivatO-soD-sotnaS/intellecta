<?php
declare(strict_types=1);

namespace App\Dto;

use App\Models\Event;
use App\Models\InstitutionalEvent;

readonly class InstitutionalEventDto implements \JsonSerializable {
  private string $institution_id;
  private string $institutional_event_id;
  private Event $event;

  public function __construct(InstitutionalEvent $institutionalEvent, Event $event) {
    $this->institution_id = $institutionalEvent->getInstitutionId();
    $this->institutional_event_id = $institutionalEvent->getInstitutionalEventId();
    $this->event = $event;
  }

  public function toArray(): array {
    return [
      'institutional_event_id' => $this->institutional_event_id,
      'institution_id' => $this->institution_id,
      'event' => $this->event
    ];
  }

  public function jsonSerialize(): mixed {
    return $this->toArray();
  }
}