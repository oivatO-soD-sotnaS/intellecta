<?php

declare(strict_types=1);

namespace App\Dao;

use App\Database;
use App\Models\User;
use PDO;

class UserDao {
  public function __construct(private Database $database) {}

  /**
   * Summary of getById
   * @param string $id
   * @return User|null
   */
  public function getById(string $id): User {
    $sql = 'SELECT * FROM users WHERE user_id = :id';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id', $id, PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    return new User($data);
  }

  /**
   * Summary of getByEmail
   * @param string $email
   * @return User|null
   */
  public function getByEmail(string $email): User {
    $sql = 'SELECT * FROM users WHERE email = :email';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    return new User($data);
  }

  /**
   * Summary of create
   * @param \App\Models\User $user
   * @return User|null
   */
  public function create(User $user): User {
    $sql = 'INSERT INTO users (user_id, full_name, email, password_hash, profile_picture_id) 
            VALUES (:user_id, :full_name, :email, :password_hash, :profile_picture_id)';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':user_id', $user->getUserId(), PDO::PARAM_STR);
    $stmt->bindValue(':full_name', $user->getFullName(), PDO::PARAM_STR);
    $stmt->bindValue(':email', $user->getEmail(), PDO::PARAM_STR);
    $stmt->bindValue(':password_hash', $user->getPasswordHash(), PDO::PARAM_STR);
    $stmt->bindValue(':profile_picture_id', $user->getProfilePictureId(), PDO::PARAM_STR);
    $stmt->execute();

    return $user;
  }

  /**
   * Summary of update
   * @param \App\Models\User $user
   * @return User|null
   */
  public function update(User $user): User {
    $sql = 'UPDATE users SET 
              full_name = :full_name,
              email = :email,
              password_hash = :password_hash,
              email_verified = :email_verified,
              profile_picture_id = :profile_picture_id
            WHERE user_id = :user_id';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(':user_id', $user->getUserId(), PDO::PARAM_STR);
    $stmt->bindValue(':full_name', $user->getFullName(), PDO::PARAM_STR);
    $stmt->bindValue(':email', $user->getEmail(), PDO::PARAM_STR);
    $stmt->bindValue(':password_hash', $user->getPasswordHash(), PDO::PARAM_STR);
    $stmt->bindValue(':email_verified', $user->isEmailVerified() ? 1 : 0, PDO::PARAM_INT);
    $stmt->bindValue(':profile_picture_id', $user->getProfilePictureId(), PDO::PARAM_STR);
    $stmt->execute();

    return $user;
  }

  /**
   * Summary of delete
   * @param string $userId
   * @return bool
   */
  public function delete(string $userId): bool {
    $sql = 'DELETE FROM users WHERE user_id = :user_id';

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    
    return $stmt->execute([':user_id' => $userId]);
  }
}