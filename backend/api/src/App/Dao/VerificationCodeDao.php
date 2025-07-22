<?php

declare(strict_types= 1);

namespace App\Dao;

use App\Database;
use App\Models\VerificationCode;
use PDO;

class VerificationCodeDao extends BaseDao {
  /**
   * Summary of create
   * @param \App\Models\VerificationCode $verificationCode
   * @return VerificationCode|null
   */
  public function create(VerificationCode $verificationCode): ?VerificationCode {
    $sql = 'INSERT INTO verification_codes (verification_code_id, code, expires_at, user_id)
            VALUES (:verification_code_id, :code, :expires_at, :user_id)';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $success = $stmt->execute([
      ':verification_code_id' => $verificationCode->getVerificationCodeId(),
      ':code' => $verificationCode->getCode(),
      ':expires_at' => $verificationCode->getExpiresAt(),
      ':user_id' => $verificationCode->getUserId()
    ]);

    return $success ? $verificationCode : null;
  }
  /**
   * Summary of getLatestVerificationCode
   * @param string $user_id
   * @param string $code
   * @return VerificationCode|null
   */
  public function getLatestVerificationCode(string $user_id, string $code): ?VerificationCode {
    $sql = 'SELECT * FROM verification_codes
            WHERE user_id LIKE :user_id
              AND code LIKE :code
              AND is_pending LIKE true
              AND expires_at > :currentTime
            ORDER BY created_at DESC
            LIMIT 1';
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(param: ':user_id', value: $user_id, type: PDO::PARAM_STR);
    $stmt->bindValue(param: ':code', value: $code, type: PDO::PARAM_STR);
    $stmt->bindValue(param: ':currentTime', value: date('Y-m-d H:i:s'), type: PDO::PARAM_STR);
    
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $data ? new VerificationCode($data) : null;
  }

  /**
   * Summary of update
   * @param \App\Models\VerificationCode $verificationCode
   * @return VerificationCode|null
   */
  public function update(VerificationCode $verificationCode): ?VerificationCode {
    $sql = 'UPDATE verification_codes SET
              code = :code,
              is_pending = :is_pending,
              expires_at = :expires_at
            WHERE verification_code_id = :verification_code_id';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':code', $verificationCode->getCode(), PDO::PARAM_STR);
    $stmt->bindValue(':is_pending', $verificationCode->isPending() ? 1 : 0, PDO::PARAM_INT);
    $stmt->bindValue(':expires_at', $verificationCode->getExpiresAt(), PDO::PARAM_STR);
    $stmt->bindValue(':verification_code_id', $verificationCode->getVerificationCodeId(), PDO::PARAM_STR);
    $success = $stmt->execute();

    return $success ? $verificationCode : null;
  }
}