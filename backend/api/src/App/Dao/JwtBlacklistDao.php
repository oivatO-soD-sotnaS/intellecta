<?php

declare(strict_types= 1);

namespace App\Dao;

use PDO;

readonly class JwtBlacklistDao extends BaseDao {
  
  /**
   * Summary of addToken
   * @param string $token
   * @param \DateTimeInterface $expiresAt
   * @return void
   */
  public function addToken(string $token, \DateTimeInterface $expiresAt): void
  {
    $tokenHash = hash('sha256', $token);
    
    // Verifies if token exists
    $sql = "SELECT COUNT(*) FROM jwt_blacklists 
            WHERE token_hash = :token_hash";

    $pdo = $this->database->getConnection();
    
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':token_hash' => $tokenHash]);
    
    if ($stmt->fetchColumn() > 0) {
        return; // Already blacklisted
    }

    // Blacklist token
    $expiresAt = $expiresAt->format('Y-m-d H:i:s');
    
    $sql = "INSERT INTO jwt_blacklists 
            (jwt_blacklists_id, token_hash, expires_at) 
          VALUES 
            (UUID(), :token_hash, :expires_at)";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(":token_hash", $tokenHash, PDO::PARAM_STR);
    $stmt->bindValue(":expires_at", $expiresAt, PDO::PARAM_STR);

    $stmt->execute();
  }

  /**
   * Summary of isTokenBlacklisted
   * @param string $token
   * @return bool
   */
  public function isTokenBlacklisted(string $token): bool
  {
    $sql = "SELECT 1 FROM jwt_blacklists 
              WHERE token_hash = :token_hash 
              AND expires_at > :currentTime
            LIMIT 1";

    $pdo = $this->database->getConnection();
    $tokenHash = hash('sha256', $token);

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
      ':token_hash' => $tokenHash,
      ':currentTime' => date('Y-m-d H:i:s')
    ]);
    
    return (bool) $stmt->fetchColumn();
  }
}