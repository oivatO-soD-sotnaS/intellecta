<?php

declare(strict_types=1);

namespace App\Dao;

use App\Dto\InstitutionUserDto;
use App\Dto\UserDto;
use App\Models\File;
use App\Models\InstitutionUser;
use App\Models\User;
use PDO;

readonly class InstitutionUsersDao extends BaseDao {
  
  /**
   * Summary of getInstitutionUserById
   * @param string $institution_user_id
   * @return InstitutionUser|null
   */
  public function getInstitutionUserById(string $institution_user_id): ?InstitutionUser {
    $sql = "SELECT * FROM institution_users
            WHERE institution_user_id LIKE :institution_user_id";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':institution_user_id', $institution_user_id, PDO::PARAM_STR);
    $stmt->execute();
    
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $data ? new InstitutionUser($data) : null;
  }

  /**
   * Summary of getInstitutionUserByIds
   * @param string $institution_id
   * @param string $user_id
   * @return InstitutionUser|null
   */
  public function getInstitutionUserByInstitutionIdAndUserId(string $institution_id, string $user_id): ?InstitutionUser {
    $sql = "SELECT * FROM institution_users
            WHERE user_id = :user_id
            AND institution_id = :institution_id";
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':institution_id', $institution_id, PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);
    $stmt->execute();
    

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $data ? new InstitutionUser($data) : null;
  }

  /**
   * Summary of createInstitutionUser
   * @param \App\Models\InstitutionUser $institutionUser
   * @return InstitutionUser|null
   */
  public function createInstitutionUser(InstitutionUser $institutionUser): ?InstitutionUser {
    $sql = "INSERT INTO institution_users (institution_user_id, role, joined_at, institution_id, user_id)
            VALUES (:institution_user_id, :role, :joined_at, :institution_id, :user_id)";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':institution_user_id', $institutionUser->getInstitutionUsersId(), PDO::PARAM_STR);
    $stmt->bindValue(':role', $institutionUser->getRole(), PDO::PARAM_STR);
    $stmt->bindValue(':joined_at', $institutionUser->getJoinedAt(), PDO::PARAM_STR);
    $stmt->bindValue(':institution_id', $institutionUser->getInstitutionId(), PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $institutionUser->getUserId(), PDO::PARAM_STR);

    $success = $stmt->execute();

    return $success ? $institutionUser : null;
  }

  /**
   * Summary of getUsersByInstitutionId
   * @param string $institution_id
   * @return InstitutionUser[]
   */
  public function getInstitutionUsersByInstitutionId(string $institution_id): array {
    $sql = "SELECT * FROM institution_users WHERE institution_id = :institution_id";
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':institution_id', $institution_id, PDO::PARAM_STR);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return array_map(fn($item) => new InstitutionUser($item), $data);
  }

  /**
   * Summary of updateInstitutionUserRole
   * @param \App\Models\InstitutionUser $institutionUser
   * @return InstitutionUser|null
   */
  public function updateInstitutionUserRole(InstitutionUser $institutionUser) {
    $sql = "UPDATE institution_users SET
              role = :role
            WHERE user_id = :user_id
            AND institution_id = :institution_id";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':role', $institutionUser->getRole(), PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $institutionUser->getUserId(), PDO::PARAM_STR);
    $stmt->bindValue(':institution_id', $institutionUser->getInstitutionId(), PDO::PARAM_STR);
    $success = $stmt->execute();
    
    return $success ? $institutionUser : null;
  }

  /**
   * Summary of deleteInstitutionUser
   * @param \App\Models\InstitutionUser $institutionUser
   * @return bool
   */
  public function deleteInstitutionUser(InstitutionUser $institutionUser): bool {
    $sql = 'DELETE FROM institution_users 
            WHERE user_id = :user_id
            AND institution_id = :institution_id';
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(':user_id', $institutionUser->getUserId(), PDO::PARAM_STR);
    $stmt->bindValue(':institution_id', $institutionUser->getInstitutionId(), PDO::PARAM_STR);

    return $stmt->execute();
  }

  /**
   * Summary of mapToInstitutionUserDtos
   * Converts a list of InstitutionUser[] into InstitutionUserDto[] with a single SQL query (no N+1).
   *
   * @param InstitutionUser[] $institutionUsers
   * @return InstitutionUserDto[]
   */
  public function mapInstitutionUsersToUsers(array $institutionUsers): array {
    if (empty($institutionUsers)) {
      return [];
    }

    // Extract IDs for the WHERE clause
    $institutionUserIds = array_map(fn($iu) => $iu->getInstitutionUsersId(), $institutionUsers);

    // Prepare placeholders for the IN (...) clause
    $placeholders = implode(',', array_fill(0, count($institutionUserIds), '?'));

    $sql = "
      SELECT 
        iu.institution_user_id,
        iu.role,
        iu.joined_at,
        iu.institution_id,
        u.user_id,
        u.full_name,
        u.email,
        u.created_at AS user_created_at,
        u.changed_at AS user_changed_at,
        f.file_id AS profile_picture_id,
        f.url AS profile_picture_url,
        f.filename AS profile_picture_filename,
        f.mime_type AS profile_picture_mime_type
      FROM institution_users iu
      JOIN users u ON u.user_id = iu.user_id
      LEFT JOIN files f ON f.file_id = u.profile_picture_id
      WHERE iu.institution_user_id IN ($placeholders)
    ";

    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->execute($institutionUserIds);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $dtos = [];

    foreach ($rows as $row) {
      // Build File model (if any)
      $profilePicture = null;
      if (!empty($row['profile_picture_id'])) {
        $profilePicture = new File([
          'file_id' => $row['profile_picture_id'],
          'url' => $row['profile_picture_url'],
          'filename' => $row['profile_picture_filename'],
          'mime_type' => $row['profile_picture_mime_type'],
        ]);
      }

      // Build User model
      $user = new User([
        'user_id' => $row['user_id'],
        'full_name' => $row['full_name'],
        'email' => $row['email'],
        'created_at' => $row['user_created_at'],
        'changed_at' => $row['user_changed_at'],
        'profile_picture_id' => $row['profile_picture_id'],
      ]);

      // Build InstitutionUser model
      $institutionUser = new InstitutionUser([
        'institution_user_id' => $row['institution_user_id'],
        'role' => $row['role'],
        'joined_at' => $row['joined_at'],
        'institution_id' => $row['institution_id'],
        'user_id' => $row['user_id'],
      ]);

      // Compose DTOs
      $userDto = new UserDto($user, $profilePicture);
      $institutionUserDto = new InstitutionUserDto($institutionUser, $userDto);

      $dtos[] = $institutionUserDto;
    }

    return $dtos;
  }

}