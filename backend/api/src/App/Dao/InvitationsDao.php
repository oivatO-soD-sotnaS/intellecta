<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\Invitation;
use PDO;

readonly class InvitationsDao extends BaseDao {

  /**
   * Summary of getAllUserInvitations
   * @param string $email
   * @return Invitation[]
   */
  public function getAllUserInvitations(string $email): array {
    $sql = "SELECT * FROM invitations
            WHERE email LIKE :email";
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    $stmt->execute();

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $invitations = array_map(fn($row) => new Invitation($row), $rows);

    return $invitations;
  }

  public function createInvitation(Invitation $invitation): ?Invitation {
    $sql = "INSERT INTO invitations (invitation_id, email, role, expires_at, accepted_at, created_at, institution_id, invited_by)
            VALUES (:invitation_id, :email, :role, :expires_at, :accepted_at, :created_at, :institution_id, :invited_by)";
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':invitation_id', $invitation->getInvitationId(), \PDO::PARAM_STR);
    $stmt->bindValue(':email', $invitation->getEmail(), \PDO::PARAM_STR);
    $stmt->bindValue(':role', $invitation->getRole(), \PDO::PARAM_STR);
    $stmt->bindValue(':expires_at', $invitation->getExpiresAt(), \PDO::PARAM_STR);
    $stmt->bindValue(':accepted_at', $invitation->getAcceptedAt(), \PDO::PARAM_STR);
    $stmt->bindValue(':created_at', $invitation->getCreatedAt(), \PDO::PARAM_STR);
    $stmt->bindValue(':institution_id', $invitation->getInstitutionId(), \PDO::PARAM_STR);
    $stmt->bindValue(':invited_by', $invitation->getInvitedBy(), \PDO::PARAM_STR);
    $success = $stmt->execute();
    
    return $success ? $invitation : null;
  }

  public function getInvitationById(string $invitation_id): ?Invitation {
    $sql = "SELECT * FROM invitations
            WHERE invitation_id LIKE :invitation_id";
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':invitation_id', $invitation_id, PDO::PARAM_STR);
    $success = $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    return $success ? new Invitation($data) : null;
  }

  public function updateInvitation(Invitation $invitation): ?Invitation {
    $sql = "UPDATE invitations
            SET accepted_at = :accepted_at";
    
    $pdo = $this->database->getConnection();
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':accepted_at', $invitation->getAcceptedAt(), PDO::PARAM_STR);
    $success = $stmt->execute();

    return $success ? $invitation : null;
  }
}