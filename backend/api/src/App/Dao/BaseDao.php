<?php
declare(strict_types=1);

namespace App\Dao;

use App\Database;

class BaseDao {
    public function __construct(
        protected Database $database
    ){}
}