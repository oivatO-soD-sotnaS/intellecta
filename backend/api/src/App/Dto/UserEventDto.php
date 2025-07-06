<?php
declare(strict_types=1);

namespace App\Dto;

use App\Models\Event;
use App\Models\UserEvent;

readonly class UserEventDto implements \JsonSerializable {
  private string $user_id;
  private string $user_event_id;
  private Event $event;

  public function __construct(UserEvent $userEvent, Event $event) {
    $this->user_id = $userEvent->getUserId();
    $this->user_event_id = $userEvent->getUserEventId();
    $this->event = $event;
  }

  public function toArray(): array {
    return [
      'user_event_id' => $this->user_event_id,
      'user_id' => $this->user_id,
      'event' => $this->event
    ];
  }

  public function jsonSerialize(): mixed {
    return $this->toArray();
  }
}