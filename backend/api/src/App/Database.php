<?php

declare(strict_types= 1);

namespace App;

use PDO;
use SensitiveParameter;

class Database
{
  public function __construct(
    #[SensitiveParameter] private string $host,
    #[SensitiveParameter] private string $name,
    #[SensitiveParameter] private string $user,
    #[SensitiveParameter] private string $password,
  ){}

  public function getConnection(): PDO {
    $dsn = "mysql:host=$this->host;port=3306;dbname=$this->name;charset=utf8mb4";
    
    $pdo = new PDO($dsn, $this->user, $this->password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    return $pdo; 
  }
}