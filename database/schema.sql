USE `intellecta`;

CREATE TABLE `files` (
  `file_id` CHAR(36) PRIMARY KEY,
  `url` TEXT NOT NULL,
  `filename` VARCHAR(128) NOT NULL,
  `mime_type` VARCHAR(100),
  `type` ENUM('image', 'video', 'audio', 'document', 'other') NOT NULL DEFAULT 'other',
  `size` INT UNSIGNED, -- Tamanho em bytes
  `uploaded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de usuário
CREATE TABLE `users` (
  `user_id` CHAR(36) PRIMARY KEY,
  `full_name` VARCHAR(64) NOT NULL,
  `email` VARCHAR(64) UNIQUE NOT NULL,
  `password_hash` VARCHAR(512) NOT NULL,
  `email_verified` BOOL NOT NULL DEFAULT false, -- 'true' significa que o usuário verificou o e-mail que utilizou ao criar a conta e 'false' o contrário.
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `changed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `profile_picture_id` CHAR(36),
  FOREIGN KEY (`profile_picture_id`) REFERENCES `files`(`file_id`) ON DELETE SET NULL
);

CREATE TABLE verification_codes (
  `verification_code_id` CHAR(36) PRIMARY KEY,
  `code` VARCHAR(6),
  `is_pending` BOOL NOT NULL DEFAULT true,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `user_id` CHAR(36),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- Tabela de instituição
CREATE TABLE `institutions` (
  `institution_id` CHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `profile_picture_id` CHAR(36),
  `banner_id` CHAR(36),
  `user_id` CHAR(36) NOT NULL, -- ID do usuário que criou a instituição
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`profile_picture_id`) REFERENCES `files`(`file_id`) ON DELETE SET NULL,
  FOREIGN KEY (`banner_id`) REFERENCES `files`(`file_id`) ON DELETE SET NULL
);

-- Tabela de relação MxN entre users e institutions
CREATE TABLE `institution_users` (
  `institution_user_id` CHAR(36) PRIMARY KEY,
  `role` ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  `joined_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `institution_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`institution_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  UNIQUE (`institution_id`, `user_id`)
);

-- Tabela que armazena os convites de participação de uma instituição
CREATE TABLE `invitations` (
  `invitation_id` CHAR(36) NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  `expires_at` TIMESTAMP NOT NULL,
  `accepted_at` TIMESTAMP DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `institution_id` CHAR(36) NOT NULL,
  `invited_by` CHAR(36) NOT NULL,
  FOREIGN KEY (`invited_by`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`institution_id`) ON DELETE CASCADE
);

-- Tabela de turma
CREATE TABLE `classes` (
  `class_id` CHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `profile_picture_id` CHAR(36),
  `banner_id` CHAR(36),
  `institution_id` CHAR(36) NOT NULL, -- ID da instituição à qual a turma pertence
  FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`institution_id`) ON DELETE CASCADE,
  FOREIGN KEY (`profile_picture_id`) REFERENCES `files`(`file_id`) ON DELETE SET NULL,
  FOREIGN KEY (`banner_id`) REFERENCES `files`(`file_id`) ON DELETE SET NULL
);

-- Tabela de relação entre usuário e turma
CREATE TABLE `class_users` (
  `class_users_id` CHAR(36) PRIMARY KEY,
  `joined_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `class_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL, -- ID do usuário participante da turma -- aluno.
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- Tabela de Disciplina
CREATE TABLE `subjects` (
  `subject_id` CHAR(36) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `profile_picture_id` CHAR(36),
  `banner_id` CHAR(36),
  `institution_id` CHAR(36) NOT NULL, -- ID da instituição à qual a disciplina pertence
  `professor_id` CHAR(36), -- ID do usuário que criou a disciplina -- Professor da disciplina.
  FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`institution_id`) ON DELETE CASCADE,
  FOREIGN KEY (`professor_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL,
  FOREIGN KEY (`profile_picture_id`) REFERENCES `files`(`file_id`) ON DELETE SET NULL,
  FOREIGN KEY (`banner_id`) REFERENCES `files`(`file_id`) ON DELETE SET NULL
);

-- Tabela de relação entre turma e disciplina
CREATE TABLE `subject_classes` (
  `subject_classes_id` CHAR(36) PRIMARY KEY,
  `class_id` CHAR(36) NOT NULL,
  `subject_id` CHAR(36) NOT NULL,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE,
  UNIQUE(`subject_id`, `class_id`)
);

-- Tabela de material da disciplina
CREATE TABLE `materials` (
  `material_id` CHAR(36) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `changed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subject_id` CHAR(36) NOT NULL,
  `file_id` CHAR(36) NOT NULL,
  FOREIGN KEY (`file_id`) REFERENCES `files`(`file_id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE
);

-- Tabela de atividade avaliativa
CREATE TABLE `assignments` (
  `assignment_id` CHAR(36) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `deadline` DATE NOT NULL,
  `subject_id` CHAR(36) NOT NULL,
  `attachment_id` CHAR(36),
  FOREIGN KEY (`attachment_id`) REFERENCES `files`(`file_id`) ON DELETE SET NULL,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE
);

-- Tabela de entrega de atividade avaliativa
CREATE TABLE `submissions` (
  `submission_id` CHAR(36) PRIMARY KEY,
  `submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `grade` DECIMAL,
  `concept` VARCHAR(255),
  `feedback` TEXT,
  `assignment_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36),
  `file_id` CHAR(36),
  FOREIGN KEY (`file_id`) REFERENCES `files`(`file_id`) ON DELETE SET NULL,
  FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`assignment_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL
);

-- Tabela de mensgens do fórum de disciplina
CREATE TABLE `forum_messages` (
  `forum_messages_id` CHAR(36) PRIMARY KEY,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `changed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sent_by` CHAR(36),
  `subject_id` CHAR(36) NOT NULL,
  FOREIGN KEY (`sent_by`) REFERENCES `users`(`user_id`) ON DELETE SET NULL,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE
);

-- Tabela 'pai' dos eventos. As outras 'herdam' dessa via padrão de composição.
CREATE TABLE `events` (
  `event_id` CHAR(36) PRIMARY KEY,
  `title` VARCHAR(64) NOT NULL,
  `description` TEXT,
  `type` ENUM(
    'exam', 'quiz', 'assignment', 'lecture', 'workshop',
    'seminar', 'presentation', 'deadline',
    'holiday', 'announcement', 'cultural', 'sports', 'other'
  ) DEFAULT 'other', -- Tipos de evento, mais detalhes podem ser encontados em ./README.md
  `event_date` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `changed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Eventos globais da instituição
CREATE TABLE `institutional_events` (
  `institutional_event_id` CHAR(36) PRIMARY KEY,
  `event_id` CHAR(36) NOT NULL,
  `institution_id` CHAR(36) NOT NULL,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`event_id`) ON DELETE CASCADE, 
  FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`institution_id`) ON DELETE CASCADE
);

-- Eventos específicos de disciplina
CREATE TABLE `subject_events` (
  `subject_event_id` CHAR(36) PRIMARY KEY,
  `event_id` CHAR(36) NOT NULL,
  `subject_id` CHAR(36) NOT NULL,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`event_id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE
);

-- Eventos específicos de usuário
CREATE TABLE `user_events` (
  `user_event_id` CHAR(36) PRIMARY KEY,
  `event_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`event_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
);

-- Tabela de notificações
CREATE TABLE `notifications` (
  `notification_id` CHAR(36) PRIMARY KEY,
  `user_id` CHAR(36) NOT NULL,
  `event_id` CHAR(36) NOT NULL,
  `seen` BOOLEAN NOT NULL DEFAULT FALSE, -- Indica se o usuário já viu a notificação
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`event_id`) ON DELETE CASCADE
);

-- Tabela de tokens JWT invalidados
CREATE TABLE `jwt_blacklists` (
  `jwt_blacklists_id` CHAR(36) NOT NULL PRIMARY KEY,
  `token_hash` TEXT,
  `expires_at` DATETIME NOT NULL
);

CREATE VIEW `institution_summary` AS
SELECT
  i.institution_id,
  i.name,
  i.email,
  i.banner_id,
  i.profile_picture_id,
  i.description,
  iu.user_id,
  iu.role,
  COUNT(DISTINCT iu2.user_id) AS active_user_count,
  COUNT(DISTINCT e.event_id) AS upcoming_event_count
FROM institutions i

-- Join to get role of each user in the institution
JOIN institution_users iu ON iu.institution_id = i.institution_id

-- Count active users in the same institution
LEFT JOIN institution_users iu2 ON iu2.institution_id = i.institution_id

-- Left join to institutional_events with upcoming events
LEFT JOIN institutional_events ie ON ie.institution_id = i.institution_id
LEFT JOIN events e ON e.event_id = ie.event_id 
                   AND e.event_date >= CURRENT_TIMESTAMP 
                   AND e.event_date <= CURRENT_TIMESTAMP + INTERVAL 7 DAY

GROUP BY i.institution_id, i.name, i.email, iu.user_id, iu.role;