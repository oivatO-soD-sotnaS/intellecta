<?php
namespace App\Dto;

use App\Dto\UserDto;
use App\Models\ForumMessage;

readonly class ForumMessageDto implements \JsonSerializable {
    private string $forum_messages_id;
    private string $content;
    private string $created_at;
    private string $changed_at;
    private ?UserDto $sent_by;
    private string $subject_id;

    public function __construct(ForumMessage $forumMessage, ?UserDto $sentBy) {
        $this->forum_messages_id = $forumMessage->getForumMessagesId();
        $this->content = $forumMessage->getContent();
        $this->created_at = $forumMessage->getCreatedAt();
        $this->changed_at = $forumMessage->getChangedAt();
        $this->sent_by = $sentBy;
        $this->subject_id = $forumMessage->getSubjectId();
    }

    private function toArray(): array {
        return [
            'forum_messages_id' => $this->forum_messages_id,
            'content' => $this->content,
            'created_at' => $this->created_at,
            'changed_at' => $this->changed_at,
            'sent_by' => $this->sent_by,
            'subject_id' => $this->subject_id
        ];
    }

    public function jsonSerialize(): array {
        return $this->toArray();
    }
}