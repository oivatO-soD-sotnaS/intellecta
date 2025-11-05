<?php
declare(strict_types=1);

namespace App\Vo;

use DateTimeImmutable;
use App\Vo\ForumMessageContentVo;
use InvalidArgumentException;

final class ForumMessagesFiltersVo {
    private ?ForumMessageContentVo $content;
    private ?DateTimeImmutable $createdAtFrom;
    private ?DateTimeImmutable $createdAtTo;

    public function __construct(array $queryParameters) {
        $this->content = !empty($queryParameters["content"])
            ? new ForumMessageContentVo($queryParameters["content"])
            : null;

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

        if($this->content !== null) 
            $filters['content']            = $this->content->getValue();
        if($this->createdAtFrom !== null) 
            $filters['created_at_from']    = $this->createdAtFrom->format('Y-m-d');
        if($this->createdAtTo !== null) 
            $filters['created_at_to']      = $this->createdAtTo->format('Y-m-d');

        return $filters;
    }
}
