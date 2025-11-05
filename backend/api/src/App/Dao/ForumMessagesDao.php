<?php
declare(strict_types=1);

namespace App\Dao;

use App\Models\ForumMessage;
use App\Vo\PaginationVo;
use PDO;

readonly class ForumMessagesDao extends BaseDao {

    /**
     * Summary of getForumMessagesBySubjectIdPaginated
     * @param string $subject_id
     * @param \App\Vo\PaginationVo $pagination
     * @param array $filters
     * @return ForumMessage[]
     */
    public function getForumMessagesBySubjectIdPaginated(
        string $subject_id,
        PaginationVo $pagination,
        array $filters
    ): array {
        $sql = "SELECT * FROM forum_messages WHERE subject_id = :subject_id";
        $params = [
            ':subject_id' => $subject_id, 
            ':limit' => $pagination->getLimit(), 
            ':offset' => $pagination->getOffset()
        ];

       
        $this->setFilters($filters, $sql, $params);

        $sql .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);

        foreach($params as $key => $value) {
            $type = in_array($key, [':limit', ':offset']) ? PDO::PARAM_INT : PDO::PARAM_STR;
            $stmt->bindValue($key, $value, $type);
        }

        $stmt->execute();
        
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $forumMessages = array_map(fn(array $row) => new ForumMessage($row), $data);

        return $forumMessages;
    }

    /**
     * Summary of countForumMessagesBySubjectId
     * @param string $subject_id
     * @return int
     */
    public function countForumMessagesBySubjectId(
        string $subject_id,
        array $filters
    ): int {
        $sql = "SELECT COUNT(*) FROM forum_messages WHERE subject_id = :subject_id";
        $params = [
            ':subject_id' => $subject_id
        ];

        $this->setFilters($filters, $sql, $params);

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);

        foreach($params as $key => $value) {
            $stmt->bindValue($key, $value, PDO::PARAM_STR);
        }

        $stmt->execute();

        return (int) $stmt->fetchColumn();
    }

    /**
     * Summary of createForumMessage
     * @param \App\Models\ForumMessage $forumMessage
     * @return ForumMessage|string
     */
    public function createForumMessage(ForumMessage $forumMessage): ForumMessage {
        $sql = "INSERT INTO forum_messages (forum_messages_id, content, created_at, changed_at, sent_by, subject_id)
                VALUES (:forum_messages_id, :content, :created_at, :changed_at, :sent_by, :subject_id)";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':forum_messages_id', $forumMessage->getForumMessagesId(), PDO::PARAM_STR);
        $stmt->bindValue(':content', $forumMessage->getContent(), PDO::PARAM_STR);
        $stmt->bindValue(':created_at', $forumMessage->getCreatedAt(), PDO::PARAM_STR);
        $stmt->bindValue(':changed_at', $forumMessage->getChangedAt(), PDO::PARAM_STR);
        $stmt->bindValue(':sent_by', $forumMessage->getSentBy(), PDO::PARAM_STR);
        $stmt->bindValue(':subject_id', $forumMessage->getSubjectId(), PDO::PARAM_STR);

        $success = $stmt->execute();
         
        return $success ? $forumMessage : '';
    }

    /**
     * Summary of getForumMessageByForumMessageId
     * @param string $forum_message_id
     * @return ForumMessage|null
     */
    public function getForumMessageByForumMessageId(string $forum_message_id): ?ForumMessage {
        $sql = "SELECT * FROM forum_messages WHERE forum_messages_id = :forum_messages_id";
        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':forum_messages_id', $forum_message_id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? new ForumMessage($data) : null;
    }

    /**
     * Summary of updateForumMessage
     * @param \App\Models\ForumMessage $forumMessage
     * @return ForumMessage|null
     */
    public function updateForumMessage(ForumMessage $forumMessage): ?ForumMessage {
        $sql = "UPDATE forum_messages 
                SET 
                    content = :content, 
                    changed_at = :changed_at 
                WHERE forum_messages_id = :forum_messages_id";

        $pdo = $this->database->getConnection();
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':content', $forumMessage->getContent(), PDO::PARAM_STR);
        $stmt->bindValue(':changed_at', $forumMessage->getChangedAt(), PDO::PARAM_STR);
        $stmt->bindValue(':forum_messages_id', $forumMessage->getForumMessagesId(), PDO::PARAM_STR);

        $success = $stmt->execute();
        return $success ? $forumMessage : null;
    }

    private function setFilters(array $filters, string &$sql, array &$params) {
        if (isset($filters['content'])) {
            $sql .= ' AND content LIKE :content';
            $params[':content'] = "%{$filters['content']}%";
        }
        if(isset($filters["created_at_from"])) {
            $sql .= ' AND created_at >= :created_at_from';
            $params[':created_at_from'] = $filters['created_at_from'];
        }
        if(isset($filters["created_at_to"])) {
            $sql .= ' AND created_at <= :created_at_to';
            $params[':created_at_to'] = $filters['created_at_to'];
        }
    }
}