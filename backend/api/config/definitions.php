<?php

use App\Database;

return [
  Database::class => function() {
    return new Database(
      host: 'database_container',
      name: getenv('MYSQL_DATABASE'),
      user: getenv('MYSQL_USER'),
      password:getenv('MYSQL_PASSWORD')
    );
  }
];