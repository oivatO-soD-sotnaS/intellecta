-- Datas base para cálculo (hoje)
SET @today := NOW();
SET @tomorrow := DATE_ADD(@today, INTERVAL 1 DAY);
SET @yesterday := DATE_SUB(@today, INTERVAL 1 DAY);


INSERT INTO `files` (`file_id`, `url`, `filename`, `mime_type`, `file_type`, `size`, `uploaded_at`) VALUES
('f7dcef54-c374-4ea3-af0c-24f19bda74b8', 'https://example.com/files/1', 'profile1.jpg', 'image/jpeg', 'image', 102400, @today),
('9b317eae-e4c4-4de0-a244-2eef9558e2e7', 'https://example.com/files/2', 'document.pdf', 'application/pdf', 'document', 512000, @today),
('e27d83a7-4329-43d9-b011-e1289cf2b5f9', 'https://example.com/files/3', 'presentation.pptx', 'application/vnd.ms-powerpoint', 'document', 2048000, @today);

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `email_verified`, `created_at`, `changed_at`, `profile_picture_id`) VALUES
('e41acf37-cf82-44ea-b979-d0b3244d6cd6', 'John Doe', 'john@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, 'f7dcef54-c374-4ea3-af0c-24f19bda74b8'),
('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'Alice Wonderland', 'alice@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, NULL),
('c56a4180-65aa-42ec-a945-5fd21dec0538', 'Charlie Brown', 'charlie@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, NULL),
('21ec2020-3aea-4069-a2dd-08002b30309d', 'David Gilmour', 'david@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, NULL),
('920a3a86-a3ad-4811-82e5-3df143c36512', 'Eve Polastri', 'eve@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, NULL),
('927ef8b8-fb55-4d18-8714-600d050ed336', 'Frank Underwood', 'frank@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, NULL),
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Grace Hopper', 'grace@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, NULL),
('9c858901-8a57-4791-81fe-4c455b099bc9', 'Hannah Baker', 'hannah@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, NULL),
('16fd2706-8baf-433b-82eb-8c7fada847da', 'Ian Curtis', 'ian@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, NULL),
('d1c9a7f2-6000-40ae-840e-3c24da6d80db', 'Julia Roberts', 'julia@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, NULL),
('7c9e6679-7425-40de-944b-e07fc1f90ae7', 'Kevin Spacey', 'kevin@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, NULL),
('7bae5f09-48fd-47d6-958d-26809f97a2e0', 'Blibs Blobs', 'bblobs@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, @today, @today, NULL),
('65fe5128-3fbd-424c-86e9-6d8e42ef9286', 'Otávio dos Santos Lima', 'otavio@unix.com.br', '$2y$10$Ip9dAuCvrUcAKJh3mUFbLOZ.gTf3Q/bvXC4fFcuFP33IkzZQBLSte', TRUE, @today, @today, NULL),
('bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e', 'Bob Johnson', 'bob@example.com', '$2y$10$pvkDbaG812rhWDboJBkgn.2N03PZJORmC83/3xLwLFEhNbG1aCXly', FALSE, @today, @today, NULL);

INSERT INTO `institutions` (`institution_id`, `name`, `email`, `description`, `profile_picture_id`, `banner_id`, `user_id`) VALUES
('2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', 'Harvard University', 'contact@harvard.edu', 'Ivy League university', NULL, NULL, 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('c7579a48-cddb-43f3-af78-d0f26edb327c', 'MIT', 'info@mit.edu', 'Technology institute', NULL, NULL, '65fe5128-3fbd-424c-86e9-6d8e42ef9286'),
('f6989a00-0032-4068-a2d0-efd8b1085aad', 'Stanford University', 'admin@stanford.edu', 'Private research university', NULL, NULL, 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e');

INSERT INTO `institution_users` (`institution_user_id`, `role`, `joined_at`, `institution_id`, `user_id`) VALUES
('f256ae5c-694f-4766-bd3b-3614c0d511c1', 'admin', '2023-01-01 10:00:00', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('3827894f-2c54-412a-aa2c-f178511d0553', 'student', '2023-01-01 10:00:00', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '7bae5f09-48fd-47d6-958d-26809f97a2e0'),
('d58cbc3d-0d46-40fd-9b29-9ba5edaaa92f', 'teacher', '2023-01-02 11:00:00', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '65fe5128-3fbd-424c-86e9-6d8e42ef9286'),
('014a55e8-e20f-44d9-91f9-c58096704d27', 'student', '2023-01-03 12:00:00', 'c7579a48-cddb-43f3-af78-d0f26edb327c', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e'),
('3fa85f64-5717-4562-b3fc-2c963f66afa7', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '3fa85f64-5717-4562-b3fc-2c963f66afa6'),
('c56a4180-65aa-42ec-a945-5fd21dec0539', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', 'c56a4180-65aa-42ec-a945-5fd21dec0538'),
('21ec2020-3aea-4069-a2dd-08002b30309d', 'teacher', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '21ec2020-3aea-4069-a2dd-08002b30309d'),
('7d444840-9dc0-4f1a-b245-5ffdce74fad3', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '920a3a86-a3ad-4811-82e5-3df143c36512'),
('e02fd0e4-00fd-4f0a-ba30-0d00a0038ba1', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '927ef8b8-fb55-4d18-8714-600d050ed336'),
('f47ac10b-58cc-4372-a567-0e02b2c3d470', 'teacher', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('9c858901-8a57-4791-81fe-4c455b099bca', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '9c858901-8a57-4791-81fe-4c455b099bc9'),
('16fd2706-8baf-433b-82eb-8c7fada847db', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '16fd2706-8baf-433b-82eb-8c7fada847da'),
('6fa459ea-ee8a-4ca4-894e-db77e160355f', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', 'd1c9a7f2-6000-40ae-840e-3c24da6d80db'),
('7c9e6679-7425-40de-944b-e07fc1f90ae8', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '7c9e6679-7425-40de-944b-e07fc1f90ae7');

INSERT INTO `invitations` (`invitation_id`, `email`, `role`, `expires_at`, `accepted_at`, `created_at`, `institution_id`, `invited_by`) VALUES
('e9c22b07-4d63-40fb-b9fd-b212575fabf6', 'newuser1@example.com', 'teacher', '2023-02-01 10:00:00', NULL, '2023-01-01 10:00:00', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('99ee192f-fa77-4925-8307-9c3c69115e44', 'newuser2@example.com', 'student', '2023-02-02 11:00:00', '2023-01-15 11:00:00', '2023-01-02 11:00:00', 'c7579a48-cddb-43f3-af78-d0f26edb327c', '65fe5128-3fbd-424c-86e9-6d8e42ef9286'),
('8e3ac162-1095-4915-99c5-79c2f87abe56', 'newuser3@example.com', 'admin', '2023-02-03 12:00:00', NULL, '2023-01-03 12:00:00', 'f6989a00-0032-4068-a2d0-efd8b1085aad', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6');

INSERT INTO `classes` (`class_id`, `name`, `description`, `profile_picture_id`, `banner_id`, `institution_id`) VALUES
('7bae5f09-48fd-47d6-958d-26809f97a2e0', 'Computer Science 101', 'Intro to Computer Science', NULL, NULL, '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072'),
('3827894f-2c54-412a-aa2c-f178511d0553', 'Mathematics 201', 'Advanced Calculus', NULL, NULL, 'c7579a48-cddb-43f3-af78-d0f26edb327c'),
('3d95fee9-b1c7-417b-a8ac-7f1ce1dfcaed', 'Physics 301', 'Quantum Mechanics', NULL, NULL, 'f6989a00-0032-4068-a2d0-efd8b1085aad');

INSERT INTO `class_users` (`class_users_id`, `joined_at`, `class_id`, `user_id`) VALUES
('e3652e53-e6e6-4e63-a609-0d91b03bca5e', '2023-01-01 10:00:00', '7bae5f09-48fd-47d6-958d-26809f97a2e0', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('5e58f6f7-4a0c-4673-a3a4-a326ac69628a', '2023-01-02 11:00:00', '7bae5f09-48fd-47d6-958d-26809f97a2e0', '65fe5128-3fbd-424c-86e9-6d8e42ef9286'),
('9bce115a-a1ef-4ceb-9e9c-68b327c1b77b', '2023-01-03 12:00:00', '3827894f-2c54-412a-aa2c-f178511d0553', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e');

INSERT INTO `subjects` (`subject_id`, `name`, `description`, `profile_picture_id`, `banner_id`, `institution_id`, `teacher_id`) VALUES
('5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', 'Programming Fundamentals', 'Learn basic programming concepts', NULL, NULL, '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '65fe5128-3fbd-424c-86e9-6d8e42ef9286'),
('df4b74b3-4bff-460e-aa77-14bb84435b33', 'Linear Algebra', 'Matrix operations and vector spaces', NULL, NULL, 'c7579a48-cddb-43f3-af78-d0f26edb327c', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('8b046b6f-1fa2-462c-84ba-1c7b88450c87', 'Thermodynamics', 'Study of heat and energy transfer', NULL, NULL, 'f6989a00-0032-4068-a2d0-efd8b1085aad', '65fe5128-3fbd-424c-86e9-6d8e42ef9286');

INSERT INTO `class_subjects` (`class_subjects_id`, `class_id`, `subject_id`) VALUES
('fadcaaa1-1cae-404c-aa50-8a38af51fd76', '7bae5f09-48fd-47d6-958d-26809f97a2e0', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('9d3693f5-5426-4619-9be6-5b176c3a9482', '3827894f-2c54-412a-aa2c-f178511d0553', 'df4b74b3-4bff-460e-aa77-14bb84435b33'),
('43ada8b6-c4dc-40d8-9c49-35423a42e8d2', '3d95fee9-b1c7-417b-a8ac-7f1ce1dfcaed', '8b046b6f-1fa2-462c-84ba-1c7b88450c87');

INSERT INTO `materials` (`material_id`, `title`, `created_at`, `changed_at`, `subject_id`, `file_id`) VALUES
('b505ce16-1016-4824-b3a8-a45239c07804', 'Introduction to Python', '2023-01-01 10:00:00', '2023-01-01 10:00:00', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', '9b317eae-e4c4-4de0-a244-2eef9558e2e7'),
('0ced1760-d37a-4d03-88e0-8180dcc166f0', 'Matrix Operations', '2023-01-02 11:00:00', '2023-01-02 11:00:00', 'df4b74b3-4bff-460e-aa77-14bb84435b33', 'e27d83a7-4329-43d9-b011-e1289cf2b5f9'),
('e5baf683-25aa-48ff-8013-f8d3c79173c3', 'Thermodynamics Laws', '2023-01-03 12:00:00', '2023-01-03 12:00:00', '8b046b6f-1fa2-462c-84ba-1c7b88450c87', '9b317eae-e4c4-4de0-a244-2eef9558e2e7');

INSERT INTO `assignments` (`assignment_id`, `title`, `description`, `deadline`, `subject_id`, `attachment_id`) VALUES
('9d583a3b-6d4c-4f2a-819b-7120130e70ec', 'Python Project', 'Create a simple calculator', '2023-02-01', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', NULL),
('3d7e4c1f-be71-4898-9791-edc3d0a4d9e1', 'Matrix Quiz', 'Solve matrix problems', '2023-02-15', 'df4b74b3-4bff-460e-aa77-14bb84435b33', NULL),
('54e4a6aa-9e20-46ee-a827-84691260f1f2', 'Thermo Lab Report', 'Report on heat transfer experiment', '2023-03-01', '8b046b6f-1fa2-462c-84ba-1c7b88450c87', NULL);

-- Novos Assignments para Programming Fundamentals
INSERT INTO `assignments` (`assignment_id`, `title`, `description`, `deadline`, `subject_id`, `attachment_id`) VALUES
('a1f82d6e-40f3-4491-b41c-5c0f2ed7e901', 'Variables & Data Types', 'Write examples using different data types in Python.', DATE_ADD(@today, INTERVAL 2 DAY), '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', NULL),
('b2d993a4-02af-4b77-9b34-2a49d5d3c002', 'Control Structures', 'Implement if/else and loops in simple programs.', DATE_ADD(@today, INTERVAL 5 DAY), '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', NULL),
('c3eaa4b2-19c2-4cd4-89e3-7f8b2a4bb103', 'Functions Practice', 'Create reusable functions to process numbers and strings.', DATE_ADD(@today, INTERVAL 7 DAY), '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', NULL),
('d4fab5c3-29c8-4cc3-9fa4-8ab3c4fbc204', 'List Operations', 'Write algorithms that manipulate lists in Python.', DATE_ADD(@today, INTERVAL 9 DAY), '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', NULL),
('e50bc6d4-3ad0-46ed-9afb-91c4d5acc305', 'Dictionary Challenges', 'Use dictionaries to store and process structured data.', DATE_ADD(@today, INTERVAL 11 DAY), '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', NULL),
('f61cd7e5-4be2-4b5c-905e-a2d6e6bdd406', 'Loops & Algorithms', 'Solve exercises using while and for loops.', DATE_ADD(@today, INTERVAL 13 DAY), '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', NULL),
('a72de8f6-5cf1-47e3-b02b-b3e7f7ced507', 'Mini Project: Text Analyzer', 'Build a script that counts words, characters and sentences.', DATE_ADD(@today, INTERVAL 15 DAY), '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', NULL),
('b83ef907-6d01-4ed8-8e3c-c4f808def608', 'Debugging Practice', 'Fix bugs in a provided Python script.', DATE_ADD(@today, INTERVAL 17 DAY), '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', NULL),
('c94f0a18-7e12-4df9-934d-d5f919f0f709', 'File I/O Basics', 'Read and write files using Python.', DATE_ADD(@today, INTERVAL 19 DAY), '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', NULL),
('da50fa29-8f23-4c0e-a34e-e6fa2af10710', 'Final Project: Student Manager', 'Build a CRUD system for students using Python structures.', DATE_ADD(@today, INTERVAL 25 DAY), '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', NULL);

INSERT INTO `submissions` (`submission_id`, `submitted_at`, `concept`, `feedback`, `assignment_id`, `user_id`, `attachment_id`) VALUES
('73cce72b-2c86-44dd-b6d9-c4f8c5aa7f9a', '2023-01-25 10:00:00', 'Excellent', 'Great work!', '9d583a3b-6d4c-4f2a-819b-7120130e70ec', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', 'e27d83a7-4329-43d9-b011-e1289cf2b5f9'),
('3319c4e0-9271-4d80-9664-c2b0e09d959a', '2023-01-30 11:00:00', 'Good', 'Needs more explanation', '3d7e4c1f-be71-4898-9791-edc3d0a4d9e1', '65fe5128-3fbd-424c-86e9-6d8e42ef9286', '9b317eae-e4c4-4de0-a244-2eef9558e2e7'),
('4422b6cf-eb79-4b02-8a1f-eb7256dba44f', '2023-02-28 12:00:00', NULL, NULL, '54e4a6aa-9e20-46ee-a827-84691260f1f2', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e', NULL);

INSERT INTO `forum_messages` (`forum_messages_id`, `content`, `created_at`, `changed_at`, `sent_by`, `subject_id`) VALUES
('79b77a40-4c33-484a-826c-ac085ef8e12f', 'When is the project due?', '2023-01-10 10:00:00', '2023-01-10 10:00:00', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('2fd3861b-c9f9-4d0b-970e-2b0e1a752168', 'The deadline is February 1st', '2023-01-10 11:00:00', '2023-01-10 11:00:00', '65fe5128-3fbd-424c-86e9-6d8e42ef9286', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('cedeaaf4-58dc-4e30-a0f0-d873ccfdea19', 'Can we use NumPy for the matrix operations?', '2023-01-15 12:00:00', '2023-01-15 12:00:00', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e', 'df4b74b3-4bff-460e-aa77-14bb84435b33');

INSERT INTO `events` 
(`event_id`, `title`, `description`, `type`, `event_start`, `event_end`, `created_at`, `changed_at`) VALUES
-- Eventos com datas calculadas corretamente
('81708416-9c20-4eea-af06-b54e1061d736', 'Final Exam', 'Comprehensive final exam', 'exam',
 DATE_ADD(@today, INTERVAL 10 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 10 DAY), INTERVAL 1 HOUR),
 @today, @today),

('97d32fa5-38ea-4e6e-a6c3-2a03537204a5', 'Guest Lecture', 'Industry expert on AI', 'lecture',
 DATE_ADD(@today, INTERVAL 3 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 3 DAY), INTERVAL 1 HOUR),
 @today, @today),

('71c1a651-77c7-45c7-b17e-0e6913987138', 'Spring Break', 'No classes this week', 'holiday',
 DATE_ADD(@today, INTERVAL 5 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 5 DAY), INTERVAL 23 HOUR),
 @today, @today),

('2f3b8cc5-76eb-4bd7-9c31-2c6f58bf9f9d', 'Assignment 1 Released', 'Your first assignment is now available.', 'assignment',
 DATE_ADD(@today, INTERVAL 2 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 2 DAY), INTERVAL 1 HOUR),
 @today, @today),

('8f5c1e22-bf45-4ca8-86c3-a2b92b4cf9a7', 'Upcoming Exam', 'Midterm exam scheduled.', 'exam',
 DATE_ADD(@today, INTERVAL 15 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 15 DAY), INTERVAL 1 HOUR),
 @today, @today),

('e4edd013-1dc5-48fd-b1ec-73cf244c2a14', 'Pop Quiz', 'A surprise quiz is available today.', 'quiz',
 @today, DATE_ADD(@today, INTERVAL 1 HOUR),
 @today, @today),

('31c6b05e-6c5b-44a3-a8d8-a924ceb4e12f', 'Important Announcement', 'Class schedule changes posted.', 'announcement',
 @yesterday, DATE_ADD(@yesterday, INTERVAL 1 HOUR),
 @today, @today),

('c8d6f917-eb72-4001-9342-c4ed2f709b8e', 'Assignment Deadline', 'Deadline for Assignment 1 is approaching.', 'deadline',
 DATE_ADD(@today, INTERVAL 7 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 7 DAY), INTERVAL 1 HOUR),
 @today, @today),

('87f2ad44-8bf2-4f14-bad1-2bfc2fb3d241', 'Guest Lecture', 'Guest speaker will present a topic.', 'lecture',
 DATE_ADD(@today, INTERVAL 12 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 12 DAY), INTERVAL 1 HOUR),
 @today, @today),

('7cb9fcd8-8550-4a37-8dad-c31d18b9bdb9', 'Workshop: AI Tools', 'Hands-on workshop on AI productivity.', 'workshop',
 DATE_ADD(@today, INTERVAL 20 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 20 DAY), INTERVAL 2 HOUR),
 @today, @today);


INSERT INTO `user_events` (`user_event_id`, `event_id`, `user_id`) VALUES
('3e0f7c62-4b55-4b74-9fd1-8cdf947e5b18', '81708416-9c20-4eea-af06-b54e1061d736', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('0c7fa9d1-3f95-4da4-a95a-fb61b0f90a57', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('c2a8e1b7-0d3e-4a43-9e2b-0df7f7e5b6d3', '71c1a651-77c7-45c7-b17e-0e6913987138', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('6c50bdde-b5a8-4dae-96c0-bb0c3c289e81', '2f3b8cc5-76eb-4bd7-9c31-2c6f58bf9f9d', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('4e8cbdea-dadb-4e7c-8c8a-893f064f13f8', '8f5c1e22-bf45-4ca8-86c3-a2b92b4cf9a7', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('9fc8d6b3-4078-4a0c-ae63-0c59954a58e2', 'e4edd013-1dc5-48fd-b1ec-73cf244c2a14', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('f4d178ce-3291-4ed3-9f2d-7cc91343d88c', '31c6b05e-6c5b-44a3-a8d8-a924ceb4e12f', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('b5334a2d-6b76-4c89-917e-e0b549b766d5', 'c8d6f917-eb72-4001-9342-c4ed2f709b8e', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('89e0871f-ffce-4dde-926d-242afd9f2b82', '87f2ad44-8bf2-4f14-bad1-2bfc2fb3d241', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('e76f28c4-8acc-4a0f-afad-9ff74a7c34f0', '7cb9fcd8-8550-4a37-8dad-c31d18b9bdb9', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6');

-- Corrigir os eventos com tipos válidos do ENUM
INSERT INTO `events` 
(`event_id`, `title`, `description`, `type`, `event_start`, `event_end`, `created_at`, `changed_at`) VALUES
-- Eventos Institucionais Adicionais
('a1b2c3d4-e5f6-4780-abcd-ef1234567890', 'Orientation Week', 'Welcome event for new students', 'seminar',
 DATE_ADD(@today, INTERVAL 1 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 1 DAY), INTERVAL 3 HOUR),
 @today, @today),

('b2c3d4e5-f6a7-4801-bcde-f23456789012', 'Career Fair', 'Annual career fair with top companies', 'seminar',
 DATE_ADD(@today, INTERVAL 8 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 8 DAY), INTERVAL 6 HOUR),
 @today, @today),

('c3d4e5f6-a7b8-4902-cdef-345678901234', 'Research Symposium', 'Showcase of student research projects', 'seminar',
 DATE_ADD(@today, INTERVAL 18 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 18 DAY), INTERVAL 4 HOUR),
 @today, @today),

('d4e5f6a7-b8c9-4a23-def4-456789012345', 'Faculty Meeting', 'Monthly faculty development meeting', 'seminar',
 DATE_ADD(@today, INTERVAL 6 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 6 DAY), INTERVAL 2 HOUR),
 @today, @today),

('e5f6a7b8-c9d0-4b34-ef56-567890123456', 'Sports Tournament', 'Inter-department sports competition', 'sports',
 DATE_ADD(@today, INTERVAL 14 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 14 DAY), INTERVAL 8 HOUR),
 @today, @today),

-- Eventos de Disciplina Adicionais
('f6a7b8c9-d0e1-4c45-f678-678901234567', 'Chapter 2 Quiz', 'Quiz covering chapter 2 materials', 'quiz',
 DATE_ADD(@today, INTERVAL 4 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 4 DAY), INTERVAL 1 HOUR),
 @today, @today),

('a7b8c9d0-e1f2-4d56-789a-789012345678', 'Group Project Presentation', 'Final group project presentations', 'presentation',
 DATE_ADD(@today, INTERVAL 16 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 16 DAY), INTERVAL 3 HOUR),
 @today, @today),

('b8c9d0e1-f2a3-4e67-89ab-890123456789', 'Lab Session 3', 'Hands-on laboratory session', 'workshop',
 DATE_ADD(@today, INTERVAL 5 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 5 DAY), INTERVAL 2 HOUR),
 @today, @today),

('c9d0e1f2-a3b4-4f78-9abc-901234567890', 'Midterm Review', 'Review session for midterm exam', 'lecture',
 DATE_ADD(@today, INTERVAL 13 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 13 DAY), INTERVAL 2 HOUR),
 @today, @today),

('d0e1f2a3-b4c5-4a89-0def-012345678901', 'Assignment 2 Deadline', 'Submission deadline for assignment 2', 'deadline',
 DATE_ADD(@today, INTERVAL 11 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 11 DAY), INTERVAL 1 HOUR),
 @today, @today),

('e1f2a3b4-c5d6-4b90-1ef2-123456789012', 'Final Project Proposal', 'Submit final project proposals', 'assignment',
 DATE_ADD(@today, INTERVAL 9 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 9 DAY), INTERVAL 1 HOUR),
 @today, @today),

('f2a3b4c5-d6e7-4c01-2f34-234567890123', 'Office Hours Special', 'Extended office hours for questions', 'seminar',
 DATE_ADD(@today, INTERVAL 7 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 7 DAY), INTERVAL 3 HOUR),
 @today, @today),

('a3b4c5d6-e7f8-4d12-3f45-345678901234', 'Case Study Discussion', 'Discussion of weekly case study', 'seminar',
 DATE_ADD(@today, INTERVAL 3 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 3 DAY), INTERVAL 1.5 HOUR),
 @today, @today),

('b4c5d6e7-f8a9-4e23-4f56-456789012345', 'Practical Exam', 'Hands-on practical examination', 'exam',
 DATE_ADD(@today, INTERVAL 19 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 19 DAY), INTERVAL 2 HOUR),
 @today, @today),

('c5d6e7f8-a9b0-4f34-5f67-567890123456', 'Reading Week', 'No classes - dedicated reading time', 'holiday',
 DATE_ADD(@today, INTERVAL 21 DAY), DATE_ADD(DATE_ADD(@today, INTERVAL 21 DAY), INTERVAL 24 HOUR),
 @today, @today);
-- Institutional Events (UUIDv4 corrigidos)
INSERT INTO `institutional_events` (`institutional_event_id`, `event_id`, `institution_id`) VALUES
('133e4567-e89b-42d3-a456-426614174000', 'a1b2c3d4-e5f6-4780-abcd-ef1234567890', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072'),
('233e4567-e89b-42d3-a456-426614174001', 'b2c3d4e5-f6a7-4801-bcde-f23456789012', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072'),
('333e4567-e89b-42d3-a456-426614174002', 'c3d4e5f6-a7b8-4902-cdef-345678901234', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072'),
('433e4567-e89b-42d3-a456-426614174003', 'd4e5f6a7-b8c9-4a23-def4-456789012345', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072'),
('533e4567-e89b-42d3-a456-426614174004', 'e5f6a7b8-c9d0-4b34-ef56-567890123456', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072');

-- Subject Events (UUIDv4 corrigidos)
INSERT INTO `subject_events` (`subject_event_id`, `event_id`, `subject_id`) VALUES
('143e4567-e89b-42d3-a456-426614174000', 'f6a7b8c9-d0e1-4c45-f678-678901234567', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('243e4567-e89b-42d3-a456-426614174001', 'a7b8c9d0-e1f2-4d56-789a-789012345678', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('343e4567-e89b-42d3-a456-426614174002', 'b8c9d0e1-f2a3-4e67-89ab-890123456789', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('443e4567-e89b-42d3-a456-426614174003', 'c9d0e1f2-a3b4-4f78-9abc-901234567890', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('543e4567-e89b-42d3-a456-426614174004', 'd0e1f2a3-b4c5-4a89-0def-012345678901', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('643e4567-e89b-42d3-a456-426614174005', 'e1f2a3b4-c5d6-4b90-1ef2-123456789012', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('743e4567-e89b-42d3-a456-426614174006', 'f2a3b4c5-d6e7-4c01-2f34-234567890123', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('843e4567-e89b-42d3-a456-426614174007', 'a3b4c5d6-e7f8-4d12-3f45-345678901234', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('943e4567-e89b-42d3-a456-426614174008', 'b4c5d6e7-f8a9-4e23-4f56-456789012345', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('a43e4567-e89b-42d3-a456-426614174009', 'c5d6e7f8-a9b0-4f34-5f67-567890123456', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd');INSERT INTO `notifications` (`notification_id`, `user_id`, `event_id`, `seen`, `created_at`) VALUES
-- Notificações para eventos recentes/passados (algumas vistas, outras não)
('3a1f5c5a-4a5e-4cb1-b7ec-6fd3fb37f2b9', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '81708416-9c20-4eea-af06-b54e1061d736', FALSE, @today),
('8b6a4d10-d9df-4f63-a1a5-33e52315a6f1', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '81708416-9c20-4eea-af06-b54e1061d736', TRUE, @today),
('9e84a8ba-7b74-49d2-80c8-73974df3ee24', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '81708416-9c20-4eea-af06-b54e1061d736', FALSE, @today),

-- Notificações para eventos que acontecem hoje/amanhã
('1a0f0e8b-7b31-4b45-9e42-7f53b2d84797', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '2f3b8cc5-76eb-4bd7-9c31-2c6f58bf9f9d', FALSE, @today),
('b5d1a9c3-4e83-4b90-948b-4d17c6fd97a2', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '8f5c1e22-bf45-4ca8-86c3-a2b92b4cf9a7', FALSE, @today),
('7f2de43c-7b52-4c3b-988d-22eb8e13fd9a', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', 'e4edd013-1dc5-48fd-b1ec-73cf244c2a14', TRUE, @today),
('a8b90720-176a-4d94-8a4d-31133e5502e3', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '31c6b05e-6c5b-44a3-a8d8-a924ceb4e12f', TRUE, @today),
('0c60aa39-35e5-49ae-b232-2be6ab0b63fc', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', 'c8d6f917-eb72-4001-9342-c4ed2f709b8e', FALSE, @today),
('71cd0f57-d2e3-4887-b109-e18961a4c4fa', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '87f2ad44-8bf2-4f14-bad1-2bfc2fb3d241', FALSE, @today),
('3e7df4eb-a225-4f13-8d57-e18dbb7d2a17', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '7cb9fcd8-8550-4a37-8dad-c31d18b9bdb9', TRUE, @today);