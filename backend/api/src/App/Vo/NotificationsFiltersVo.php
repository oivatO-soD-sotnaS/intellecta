<?php
declare(strict_types=1);

namespace App\Vo;

use App\Enums\EventType;
use DateTimeImmutable;
use InvalidArgumentException;

final class NotificationsFiltersVo {

    private ?EventDescriptionVo $eventDescription;
    private ?bool $seen;
    private ?string $title;
    private ?EventType $eventType;
    private ?DateTimeImmutable $eventDate;
    private ?DateTimeImmutable $createdAtFrom;
    private ?DateTimeImmutable $createdAtTo;

    public function __construct(array $queryParameters) {
        $this->eventDescription = !empty($queryParameters["event_description"])
            ? new EventDescriptionVo($queryParameters["event_description"])
            : null;

        $this->seen = isset($queryParameters["seen"])
            ? filter_var($queryParameters["seen"], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE)
            : null;

        $this->title = !empty($queryParameters["title"])
            ? htmlspecialchars($queryParameters["title"], ENT_QUOTES | ENT_HTML5)
            : null;

        $this->eventType = !empty($queryParameters["event_type"])
            ? EventType::tryFrom($queryParameters["event_type"])
            : null;

        try {
            $this->eventDate = !empty($queryParameters["event_date"]) 
                ? new DateTimeImmutable($queryParameters['event_date'])
                : null;
        } catch (\Exception $e) {
            throw new InvalidArgumentException("Invalid 'event_date': " . $e->getMessage());
        }
        try {
            $this->createdAtFrom = !empty($queryParameters["created_at_from"]) 
                ? new DateTimeImmutable($queryParameters['created_at_from'])
                : null;
        } catch (\Exception $e) {
            throw new InvalidArgumentException("Invalid 'created_at_from': " . $e->getMessage());
        }

        try {
            $this->createdAtTo = !empty($queryParameters["created_at_to"]) 
                ? new DateTimeImmutable($queryParameters['created_at_to'])
                : null;
        } catch (\Exception $e) {
            throw new InvalidArgumentException("Invalid 'created_at_to': " . $e->getMessage());
        }
    }

    public function getDaoFilters(): array {
        $filters = [];

        if($this->eventDescription !== null) 
            $filters['event_description'] = $this->eventDescription->getValue();
        if($this->seen !== null) 
            $filters['seen']              = $this->seen;
        if($this->title !== null) 
            $filters['title']             = $this->title;
        if($this->eventType !== null) 
            $filters['event_type']        = $this->eventType->value;
        if($this->eventDate !== null) 
            $filters['event_date']        = $this->eventDate->format('Y-m-d');
        if($this->createdAtFrom !== null) 
            $filters['created_at_from']    = $this->createdAtFrom->format('Y-m-d');
        if($this->createdAtTo !== null) 
            $filters['created_at_to']      = $this->createdAtTo->format('Y-m-d');
        
        return $filters;
    }
}