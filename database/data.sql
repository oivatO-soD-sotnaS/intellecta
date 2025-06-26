INSERT INTO `files` (`file_id`, `url`, `filename`, `mime_type`, `size`, `uploaded_at`) VALUES
('f7dcef54-c374-4ea3-af0c-24f19bda74b8', 'https://example.com/files/1', 'profile1.jpg', 'image/jpeg', 102400, '2023-01-01 10:00:00'),
('9b317eae-e4c4-4de0-a244-2eef9558e2e7', 'https://example.com/files/2', 'document.pdf', 'application/pdf', 512000, '2023-01-02 11:00:00'),
('e27d83a7-4329-43d9-b011-e1289cf2b5f9', 'https://example.com/files/3', 'presentation.pptx', 'application/vnd.ms-powerpoint', 2048000, '2023-01-03 12:00:00');

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `email_verified`, `created_at`, `changed_at`, `profile_picture_id`) VALUES
('e41acf37-cf82-44ea-b979-d0b3244d6cd6', 'John Doe', 'john@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, '2023-01-01 10:00:00', '2023-01-01 10:00:00', 'f7dcef54-c374-4ea3-af0c-24f19bda74b8'),
-- Senha: Password1!
('65fe5128-3fbd-424c-86e9-6d8e42ef9286', 'Jane Smith', 'jane@example.com', '$2y$10$Ip9dAuCvrUcAKJh3mUFbLOZ.gTf3Q/bvXC4fFcuFP33IkzZQBLSte', TRUE, '2023-01-02 11:00:00', '2023-01-02 11:00:00', NULL),
-- Senha: Password2!
('bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e', 'Bob Johnson', 'bob@example.com', '$2y$10$pvkDbaG812rhWDboJBkgn.2N03PZJORmC83/3xLwLFEhNbG1aCXly', FALSE, '2023-01-03 12:00:00', '2023-01-03 12:00:00', NULL);
-- Senha: Password3!
INSERT INTO `institutions` (`institution_id`, `name`, `email`, `phone_number`, `description`, `thumbnail_id`, `banner_id`, `owner_id`) VALUES
('2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', 'Harvard University', 'contact@harvard.edu', '+15551234567', 'Ivy League university', NULL, NULL, 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('c7579a48-cddb-43f3-af78-d0f26edb327c', 'MIT', 'info@mit.edu', '+15552345678', 'Technology institute', NULL, NULL, '65fe5128-3fbd-424c-86e9-6d8e42ef9286'),
('f6989a00-0032-4068-a2d0-efd8b1085aad', 'Stanford University', 'admin@stanford.edu', '+15553456789', 'Private research university', NULL, NULL, 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e');

INSERT INTO `institution_users` (`institution_users_id`, `role`, `joined_at`, `institution_id`, `user_id`) VALUES
('f256ae5c-694f-4766-bd3b-3614c0d511c1', 'admin', '2023-01-01 10:00:00', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('d58cbc3d-0d46-40fd-9b29-9ba5edaaa92f', 'teacher', '2023-01-02 11:00:00', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '65fe5128-3fbd-424c-86e9-6d8e42ef9286'),
('014a55e8-e20f-44d9-91f9-c58096704d27', 'student', '2023-01-03 12:00:00', 'c7579a48-cddb-43f3-af78-d0f26edb327c', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e');

INSERT INTO `invitations` (`invitation_id`, `email`, `role`, `token`, `expires_at`, `accepted_at`, `created_at`, `institution_id`, `invited_by`) VALUES
('e9c22b07-4d63-40fb-b9fd-b212575fabf6', 'newuser1@example.com', 'teacher', 'token1abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuv', '2023-02-01 10:00:00', NULL, '2023-01-01 10:00:00', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('99ee192f-fa77-4925-8307-9c3c69115e44', 'newuser2@example.com', 'student', 'token2abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuv', '2023-02-02 11:00:00', '2023-01-15 11:00:00', '2023-01-02 11:00:00', 'c7579a48-cddb-43f3-af78-d0f26edb327c', '65fe5128-3fbd-424c-86e9-6d8e42ef9286'),
('8e3ac162-1095-4915-99c5-79c2f87abe56', 'newuser3@example.com', 'admin', 'token3abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuv', '2023-02-03 12:00:00', NULL, '2023-01-03 12:00:00', 'f6989a00-0032-4068-a2d0-efd8b1085aad', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6');

INSERT INTO `classes` (`class_id`, `name`, `description`, `thumbnail_id`, `banner_id`, `institution_id`) VALUES
('7bae5f09-48fd-47d6-958d-26809f97a2e0', 'Computer Science 101', 'Intro to Computer Science', NULL, NULL, '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072'),
('3827894f-2c54-412a-aa2c-f178511d0553', 'Mathematics 201', 'Advanced Calculus', NULL, NULL, 'c7579a48-cddb-43f3-af78-d0f26edb327c'),
('3d95fee9-b1c7-417b-a8ac-7f1ce1dfcaed', 'Physics 301', 'Quantum Mechanics', NULL, NULL, 'f6989a00-0032-4068-a2d0-efd8b1085aad');

INSERT INTO `class_users` (`class_users_id`, `joined_at`, `class_id`, `user_id`) VALUES
('e3652e53-e6e6-4e63-a609-0d91b03bca5e', '2023-01-01 10:00:00', '7bae5f09-48fd-47d6-958d-26809f97a2e0', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('5e58f6f7-4a0c-4673-a3a4-a326ac69628a', '2023-01-02 11:00:00', '7bae5f09-48fd-47d6-958d-26809f97a2e0', '65fe5128-3fbd-424c-86e9-6d8e42ef9286'),
('9bce115a-a1ef-4ceb-9e9c-68b327c1b77b', '2023-01-03 12:00:00', '3827894f-2c54-412a-aa2c-f178511d0553', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e');

INSERT INTO `subjects` (`subject_id`, `name`, `description`, `thumbnail_id`, `banner_id`, `institution_id`, `professor_id`) VALUES
('5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd', 'Programming Fundamentals', 'Learn basic programming concepts', NULL, NULL, '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '65fe5128-3fbd-424c-86e9-6d8e42ef9286'),
('df4b74b3-4bff-460e-aa77-14bb84435b33', 'Linear Algebra', 'Matrix operations and vector spaces', NULL, NULL, 'c7579a48-cddb-43f3-af78-d0f26edb327c', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('8b046b6f-1fa2-462c-84ba-1c7b88450c87', 'Thermodynamics', 'Study of heat and energy transfer', NULL, NULL, 'f6989a00-0032-4068-a2d0-efd8b1085aad', '65fe5128-3fbd-424c-86e9-6d8e42ef9286');

INSERT INTO `subject_classes` (`subject_classes_id`, `class_id`, `subject_id`) VALUES
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

INSERT INTO `submissions` (`submission_id`, `submitted_at`, `grade`, `concept`, `feedback`, `assignment_id`, `user_id`, `file_id`) VALUES
('73cce72b-2c86-44dd-b6d9-c4f8c5aa7f9a', '2023-01-25 10:00:00', 9.5, 'Excellent', 'Great work!', '9d583a3b-6d4c-4f2a-819b-7120130e70ec', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', 'e27d83a7-4329-43d9-b011-e1289cf2b5f9'),
('3319c4e0-9271-4d80-9664-c2b0e09d959a', '2023-01-30 11:00:00', 7.0, 'Good', 'Needs more explanation', '3d7e4c1f-be71-4898-9791-edc3d0a4d9e1', '65fe5128-3fbd-424c-86e9-6d8e42ef9286', '9b317eae-e4c4-4de0-a244-2eef9558e2e7'),
('4422b6cf-eb79-4b02-8a1f-eb7256dba44f', '2023-02-28 12:00:00', NULL, NULL, NULL, '54e4a6aa-9e20-46ee-a827-84691260f1f2', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e', NULL);

INSERT INTO `forum_messages` (`forum_messages_id`, `content`, `created_at`, `changed_at`, `sent_by`, `subject_id`) VALUES
('79b77a40-4c33-484a-826c-ac085ef8e12f', 'When is the project due?', '2023-01-10 10:00:00', '2023-01-10 10:00:00', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('2fd3861b-c9f9-4d0b-970e-2b0e1a752168', 'The deadline is February 1st', '2023-01-10 11:00:00', '2023-01-10 11:00:00', '65fe5128-3fbd-424c-86e9-6d8e42ef9286', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('cedeaaf4-58dc-4e30-a0f0-d873ccfdea19', 'Can we use NumPy for the matrix operations?', '2023-01-15 12:00:00', '2023-01-15 12:00:00', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e', 'df4b74b3-4bff-460e-aa77-14bb84435b33');

INSERT INTO `events` (`event_id`, `title`, `description`, `type`, `event_date`, `created_at`, `changed_at`) VALUES
('81708416-9c20-4eea-af06-b54e1061d736', 'Final Exam', 'Comprehensive final exam', 'exam', '2023-05-15 09:00:00', '2023-01-01 10:00:00', '2023-01-01 10:00:00'),
('97d32fa5-38ea-4e6e-a6c3-2a03537204a5', 'Guest Lecture', 'Industry expert on AI', 'lecture', '2023-04-10 14:00:00', '2023-01-02 11:00:00', '2023-01-02 11:00:00'),
('71c1a651-77c7-45c7-b17e-0e6913987138', 'Spring Break', 'No classes this week', 'holiday', '2023-03-13 00:00:00', '2023-01-03 12:00:00', '2023-01-03 12:00:00');

INSERT INTO `institutional_events` (`institutional_event_id`, `event_id`, `institution_id`) VALUES
('ee778b97-0d7b-4648-aced-b3447c8298fc', '81708416-9c20-4eea-af06-b54e1061d736', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072'),
('527e7f0f-35a2-44c1-9f0d-a5dc3b5d56f0', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', 'c7579a48-cddb-43f3-af78-d0f26edb327c'),
('e5832ce8-4218-4787-b52a-436f5327f51d', '71c1a651-77c7-45c7-b17e-0e6913987138', 'f6989a00-0032-4068-a2d0-efd8b1085aad');

INSERT INTO `subject_events` (`subject_event_id`, `event_id`, `subject_id`) VALUES
('71b4b51d-38f1-4b71-8a3c-a4c7cd344557', '81708416-9c20-4eea-af06-b54e1061d736', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('4fbd511c-9424-4592-b708-c488d7d4e53e', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', 'df4b74b3-4bff-460e-aa77-14bb84435b33'),
('b22541fc-50d6-4992-8981-f5d93791423e', '71c1a651-77c7-45c7-b17e-0e6913987138', '8b046b6f-1fa2-462c-84ba-1c7b88450c87');

INSERT INTO `user_events` (`user_event_id`, `event_id`, `user_id`) VALUES
('845ea193-81d1-4bc4-adb1-63cbde1d7b06', '81708416-9c20-4eea-af06-b54e1061d736', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6'),
('f8005825-3dfe-4daf-bbda-3f4c60d340a9', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', '65fe5128-3fbd-424c-86e9-6d8e42ef9286'),
('1dbe4824-259a-4c8a-b3d6-55d436b6a9e7', '71c1a651-77c7-45c7-b17e-0e6913987138', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e');

INSERT INTO `notifications` (`notification_id`, `user_id`, `event_id`, `seen`, `created_at`) VALUES
('df76ac50-ba4b-4f73-9081-b09be374a618', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '81708416-9c20-4eea-af06-b54e1061d736', FALSE, '2023-01-01 10:00:00'),
('3920c30f-2429-4e54-ba5d-2840337bd192', '65fe5128-3fbd-424c-86e9-6d8e42ef9286', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', TRUE, '2023-01-02 11:00:00'),
('5f9885fa-fe21-48e3-9321-01bcae7bb24c', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e', '71c1a651-77c7-45c7-b17e-0e6913987138', FALSE, '2023-01-03 12:00:00');