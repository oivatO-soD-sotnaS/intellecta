<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\ClassUser;
use PDO;

class ClassUsersDao extends BaseDao {
    /**
     * Summary of isUserMemberOfClass
     * @param string $user_id
     * @param string $class_id
     * @return bool
     */
    public function isUserMemberOfClass(string $user_id, string $class_id): bool {
        $sql = "SELECT EXISTS (
                SELECT 1
                FROM class_users
                WHERE class_id = :class_id
                    AND user_id = :user_id
                ) AS is_member
                ";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":user_id", $user_id, PDO::PARAM_STR);
        $stmt->bindValue(":class_id", $class_id, PDO::PARAM_STR);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return (bool) $result['is_member'];
    }

    /**
     * Summary of getClassUsersByClassId
     * @param string $class_id
     * @return ClassUser[]
     */
    public function getClassUsersByClassId(string $class_id): array {
        $sql = 'SELECT * FROM class_users
                WHERE class_id = :class_id';

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':class_id', $class_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        
        $classUsers = array_map(fn(array $row) => new ClassUser($row), $data);

        return $classUsers;
    }

    /**
     * Summary of createClassUser
     * @param \App\Models\ClassUser $classUser
     * @return ClassUser|null
     */
    public function createClassUser(ClassUser $classUser): ?ClassUser {
        $sql = "INSERT INTO class_users (class_users_id, joined_at, class_id, user_id)
                VALUES (:class_users_id, :joined_at, :class_id, :user_id)";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":class_users_id", $classUser->getClassUsersId(), PDO::PARAM_STR);
        $stmt->bindValue(":joined_at", $classUser->getJoinedAt(), PDO::PARAM_STR);
        $stmt->bindValue(":class_id", $classUser->getClassId(), PDO::PARAM_STR);
        $stmt->bindValue(":user_id", $classUser->getUserId(), PDO::PARAM_STR);
        $success = $stmt->execute();

        return $success ? $classUser : null;
    }

    /**
     * Inserts multiple ClassUser records in a single query.
     * 
     * @param ClassUser[] $classUsers
     * @return int Number of successfully inserted users
     */
    public function createMultipleClassUsers(array $classUsers): int {
        if (empty($classUsers)) return 0;

        $sql = "INSERT INTO class_users (class_users_id, joined_at, class_id, user_id) VALUES ";
        $placeholders = [];
        $values = [];

        foreach ($classUsers as $index => $classUser) {
            $placeholders[] = "(?, ?, ?, ?)";
            $values[] = $classUser->getClassUsersId();
            $values[] = $classUser->getJoinedAt();
            $values[] = $classUser->getClassId();
            $values[] = $classUser->getUserId();
        }

        $sql .= implode(', ', $placeholders);

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);

        return $stmt->rowCount();
    }

    /**
     * Summary of getClassUserByClassUserIdAndClassId
     * @param string $classUserId
     * @param string $classId
     * @return ClassUser|null
     */
    public function getClassUserByClassUserIdAndClassId(string $classUserId, string $classId): ?ClassUser {
        $sql = "SELECT * FROM class_users
                WHERE class_users_id = :class_users_id AND class_id = :class_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":class_users_id", $classUserId, PDO::PARAM_STR);
        $stmt->bindValue(":class_id", $classId, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new ClassUser($data) : null;
    }

    /**
     * Summary of deleteClassUser
     * @param \App\Models\ClassUser $classUser
     * @return bool
     */
    public function deleteClassUser(ClassUser $classUser): bool {
        $sql = "DELETE FROM class_users 
                WHERE class_users_id = :class_users_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(":class_users_id", $classUser->getClassUsersId(), PDO::PARAM_STR);
        return $stmt->execute();
    }
}