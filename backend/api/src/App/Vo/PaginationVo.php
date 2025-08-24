<?php
declare(strict_types=1);

namespace App\Vo;

use InvalidArgumentException;

class PaginationVo {
    private array $possibleLimits = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    private ?int $limit;
    private ?int $offset;

    public function __construct(array $queryParameters) {
        $limit = $queryParameters['limit'] ?? null;
        $offset = $queryParameters['offset'] ?? null;

        if ($limit !== null) {
            $limit = (int) $limit;
            if (!in_array($limit, $this->possibleLimits, true)) {
                throw new InvalidArgumentException(
                    'Invalid pagination limit. Possible values: ' . 
                    implode(', ', $this->possibleLimits) . '.'
                );
            }
        }

        $this->limit  = $limit;
        $this->offset = $offset !== null ? (int) $offset : null;
    }

    public function getLimit(): ?int {
        return $this->limit;
    }

    public function getOffset(): ?int {
        return $this->offset;
    }

    public function getTotalPages(int $rows): int {
        if ($this->limit === null || $this->limit === 0) {
            return 1; // Sem paginação, tudo em uma página
        }

        return (int) ceil($rows / $this->limit);
    }

    public function hasPagination(): bool {
        return $this->limit !== null && $this->offset !== null;
    }
}
