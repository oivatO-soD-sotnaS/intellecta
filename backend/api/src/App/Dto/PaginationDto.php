<?php
declare(strict_types=1);

namespace App\Dto;

use JsonSerializable;

readonly class PaginationDto implements JsonSerializable {
    private int $page;
    private int $total_pages;
    private int $total_records;

    private mixed $records;

    public function __construct(int $page, int $total_pages, int $total_records, mixed $records) {
        $this->page = $page;
        $this->total_pages = $total_pages;
        $this->total_records = $total_records;
        $this->records = $records;
    }
    
    public function toArray(): array {
        return [
            "paging" => [
                'page' => $this->page,
                'total_pages' => $this->total_pages,
                'total_records' => $this->total_records,
            ],
            'records' => $this->records
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }
}