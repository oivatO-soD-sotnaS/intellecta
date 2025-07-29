<?php
declare(strict_types=1);

namespace App\Dto;

use App\Models\Event;
use App\Models\SubjectEvent;
use App\Models\UserEvent;

readonly class SubjectEventDto implements \JsonSerializable {
  private string $subject_id;
  private string $subject_event_id;
  private Event $event;

  public function __construct(SubjectEvent $subjectEvent, Event $event) {
    $this->subject_id = $subjectEvent->getSubjectId();
    $this->subject_event_id = $subjectEvent->getSubjectEventId();
    $this->event = $event;
  }

  public function toArray(): array {
    return [
      'subject_event_id' => $this->subject_event_id,
      'subject_id' => $this->subject_id,
      'event' => $this->event
    ];
  }

  public function jsonSerialize(): mixed {
    return $this->toArray();
  }
}