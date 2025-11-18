INSERT INTO `files` (`file_id`, `url`, `filename`, `mime_type`, `file_type`, `size`, `uploaded_at`) VALUES
('f7dcef54-c374-4ea3-af0c-24f19bda74b8', 'https://example.com/files/1', 'profile1.jpg', 'image/jpeg', 'image', 102400, '2023-01-01 10:00:00'),
('9b317eae-e4c4-4de0-a244-2eef9558e2e7', 'https://example.com/files/2', 'document.pdf', 'application/pdf', 'document', 512000, '2023-01-02 11:00:00'),
('e27d83a7-4329-43d9-b011-e1289cf2b5f9', 'https://example.com/files/3', 'presentation.pptx', 'application/vnd.ms-powerpoint', 'document', 2048000, '2023-01-03 12:00:00');

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `email_verified`, `created_at`, `changed_at`, `profile_picture_id`) VALUES
-- Senha: Password1!
('e41acf37-cf82-44ea-b979-d0b3244d6cd6', 'John Doe', 'john@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, '2023-01-01 10:00:00', '2023-01-01 10:00:00', 'f7dcef54-c374-4ea3-af0c-24f19bda74b8'),
('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'Alice Wonderland', 'alice@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, NOW(), NOW(), NULL),
('c56a4180-65aa-42ec-a945-5fd21dec0538', 'Charlie Brown', 'charlie@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, NOW(), NOW(), NULL),
('21ec2020-3aea-4069-a2dd-08002b30309d', 'David Gilmour', 'david@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, NOW(), NOW(), NULL),
('7d444840-9dc0-11d1-b245-5ffdce74fad2', 'Eve Polastri', 'eve@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, NOW(), NOW(), NULL),
('e02fd0e4-00fd-090A-ca30-0d00a0038ba0', 'Frank Underwood', 'frank@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, NOW(), NOW(), NULL),
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Grace Hopper', 'grace@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, NOW(), NOW(), NULL),
('9c858901-8a57-4791-81fe-4c455b099bc9', 'Hannah Baker', 'hannah@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, NOW(), NOW(), NULL),
('16fd2706-8baf-433b-82eb-8c7fada847da', 'Ian Curtis', 'ian@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, NOW(), NOW(), NULL),
('6fa459ea-ee8a-3ca4-894e-db77e160355e', 'Julia Roberts', 'julia@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, NOW(), NOW(), NULL),
('7c9e6679-7425-40de-944b-e07fc1f90ae7', 'Kevin Spacey', 'kevin@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, NOW(), NOW(), NULL),
('7bae5f09-48fd-47d6-958d-26809f97a2e0', 'Blibs Blobs', 'bblobs@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, '2023-01-01 10:00:00', '2023-01-01 10:00:00', NULL),
-- Senha: Password2!
('65fe5128-3fbd-424c-86e9-6d8e42ef9286', 'Otávio dos Santos Lima', 'otavio@unix.com.br', '$2y$10$Ip9dAuCvrUcAKJh3mUFbLOZ.gTf3Q/bvXC4fFcuFP33IkzZQBLSte', TRUE, '2023-01-02 11:00:00', '2023-01-02 11:00:00', NULL),
-- Senha: Password3!
('bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e', 'Bob Johnson', 'bob@example.com', '$2y$10$pvkDbaG812rhWDboJBkgn.2N03PZJORmC83/3xLwLFEhNbG1aCXly', FALSE, '2023-01-03 12:00:00', '2023-01-03 12:00:00', NULL);

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
('21ec2020-3aea-4069-a2dd-08002b30309e', 'teacher', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '21ec2020-3aea-4069-a2dd-08002b30309d'),
('7d444840-9dc0-11d1-b245-5ffdce74fad3', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '7d444840-9dc0-11d1-b245-5ffdce74fad2'),
('e02fd0e4-00fd-090A-ca30-0d00a0038ba1', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', 'e02fd0e4-00fd-090A-ca30-0d00a0038ba0'),
('f47ac10b-58cc-4372-a567-0e02b2c3d470', 'teacher', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('9c858901-8a57-4791-81fe-4c455b099bca', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '9c858901-8a57-4791-81fe-4c455b099bc9'),
('16fd2706-8baf-433b-82eb-8c7fada847db', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '16fd2706-8baf-433b-82eb-8c7fada847da'),
('6fa459ea-ee8a-3ca4-894e-db77e160355f', 'student', NOW(), '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072', '6fa459ea-ee8a-3ca4-894e-db77e160355e'),
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

INSERT INTO `submissions` (`submission_id`, `submitted_at`, `concept`, `feedback`, `assignment_id`, `user_id`, `attachment_id`) VALUES
('73cce72b-2c86-44dd-b6d9-c4f8c5aa7f9a', '2023-01-25 10:00:00', 'Excellent', 'Great work!', '9d583a3b-6d4c-4f2a-819b-7120130e70ec', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', 'e27d83a7-4329-43d9-b011-e1289cf2b5f9'),
('3319c4e0-9271-4d80-9664-c2b0e09d959a', '2023-01-30 11:00:00', 'Good', 'Needs more explanation', '3d7e4c1f-be71-4898-9791-edc3d0a4d9e1', '65fe5128-3fbd-424c-86e9-6d8e42ef9286', '9b317eae-e4c4-4de0-a244-2eef9558e2e7'),
('4422b6cf-eb79-4b02-8a1f-eb7256dba44f', '2023-02-28 12:00:00', NULL, NULL, '54e4a6aa-9e20-46ee-a827-84691260f1f2', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e', NULL);

INSERT INTO `forum_messages` (`forum_messages_id`, `content`, `created_at`, `changed_at`, `sent_by`, `subject_id`) VALUES
('79b77a40-4c33-484a-826c-ac085ef8e12f', 'When is the project due?', '2023-01-10 10:00:00', '2023-01-10 10:00:00', 'e41acf37-cf82-44ea-b979-d0b3244d6cd6', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('2fd3861b-c9f9-4d0b-970e-2b0e1a752168', 'The deadline is February 1st', '2023-01-10 11:00:00', '2023-01-10 11:00:00', '65fe5128-3fbd-424c-86e9-6d8e42ef9286', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('cedeaaf4-58dc-4e30-a0f0-d873ccfdea19', 'Can we use NumPy for the matrix operations?', '2023-01-15 12:00:00', '2023-01-15 12:00:00', 'bccdcd1a-1263-4315-8cb5-1fa2fcb4d56e', 'df4b74b3-4bff-460e-aa77-14bb84435b33');

INSERT INTO `events` (`event_id`, `title`, `description`, `type`, `event_date`, `created_at`, `changed_at`) VALUES
('81708416-9c20-4eea-af06-b54e1061d736', 'Final Exam', 'Comprehensive final exam', 'exam', '2026-05-15 09:00:00', '2023-01-01 10:00:00', '2023-01-01 10:00:00'),
('97d32fa5-38ea-4e6e-a6c3-2a03537204a5', 'Guest Lecture', 'Industry expert on AI', 'lecture', '2026-04-10 14:00:00', '2023-01-02 11:00:00', '2023-01-02 11:00:00'),
('71c1a651-77c7-45c7-b17e-0e6913987138', 'Spring Break', 'No classes this week', 'holiday', '2026-03-13 00:00:00', '2023-01-03 12:00:00', '2023-01-03 12:00:00');

INSERT INTO `institutional_events` (`institutional_event_id`, `event_id`, `institution_id`) VALUES
('ee778b97-0d7b-4648-aced-b3447c8298fc', '81708416-9c20-4eea-af06-b54e1061d736', '2dcdcdc1-cf6e-4e8a-9253-57d01ec69072'),
('527e7f0f-35a2-44c1-9f0d-a5dc3b5d56f0', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', 'c7579a48-cddb-43f3-af78-d0f26edb327c'),
('e5832ce8-4218-4787-b52a-436f5327f51d', '71c1a651-77c7-45c7-b17e-0e6913987138', 'f6989a00-0032-4068-a2d0-efd8b1085aad');

INSERT INTO `subject_events` (`subject_event_id`, `event_id`, `subject_id`) VALUES
('71b4b51d-38f1-4b71-8a3c-a4c7cd344557', '81708416-9c20-4eea-af06-b54e1061d736', '5a88c02b-83a2-4ffe-9d9f-b4ab689ebffd'),
('4fbd511c-9424-4592-b708-c488d7d4e53e', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', 'df4b74b3-4bff-460e-aa77-14bb84435b33'),
('b22541fc-50d6-4992-8981-f5d93791423e', '71c1a651-77c7-45c7-b17e-0e6913987138', '8b046b6f-1fa2-462c-84ba-1c7b88450c87');

INSERT INTO `user_events` (`user_event_id`, `event_id`, `user_id`) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '81708416-9c20-4eea-af06-b54e1061d736', '3fa85f64-5717-4562-b3fc-2c963f66afa6'),
('b2c3d4e5-f6a7-8901-bcde-f23456789012', '81708416-9c20-4eea-af06-b54e1061d736', 'c56a4180-65aa-42ec-a945-5fd21dec0538'),
('c3d4e5f6-a7b8-9012-cdef-345678901234', '81708416-9c20-4eea-af06-b54e1061d736', '21ec2020-3aea-4069-a2dd-08002b30309d'),
('d4e5f6a7-b8c9-0123-def4-456789012345', '81708416-9c20-4eea-af06-b54e1061d736', '7d444840-9dc0-11d1-b245-5ffdce74fad2'),
('e5f6a7b8-c9d0-1234-ef56-567890123456', '81708416-9c20-4eea-af06-b54e1061d736', 'e02fd0e4-00fd-090A-ca30-0d00a0038ba0'),
('f6a7b8c9-d0e1-2345-f678-678901234567', '81708416-9c20-4eea-af06-b54e1061d736', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('a7b8c9d0-e1f2-3456-789a-789012345678', '81708416-9c20-4eea-af06-b54e1061d736', '9c858901-8a57-4791-81fe-4c455b099bc9'),
('b8c9d0e1-f2a3-4567-89ab-890123456789', '81708416-9c20-4eea-af06-b54e1061d736', '16fd2706-8baf-433b-82eb-8c7fada847da'),
('c9d0e1f2-a3b4-5678-9abc-901234567890', '81708416-9c20-4eea-af06-b54e1061d736', '6fa459ea-ee8a-3ca4-894e-db77e160355e'),
('d0e1f2a3-b4c5-6789-abcd-012345678901', '81708416-9c20-4eea-af06-b54e1061d736', '7c9e6679-7425-40de-944b-e07fc1f90ae7'),
('e1f2a3b4-c5d6-7890-bcde-123456789012', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', '3fa85f64-5717-4562-b3fc-2c963f66afa6'),
('f2a3b4c5-d6e7-8901-cdef-234567890123', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', 'c56a4180-65aa-42ec-a945-5fd21dec0538'),
('a3b4c5d6-e7f8-9012-def0-345678901234', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', '21ec2020-3aea-4069-a2dd-08002b30309d'),
('b4c5d6e7-f8a9-0123-ef01-456789012345', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', '7d444840-9dc0-11d1-b245-5ffdce74fad2'),
('c5d6e7f8-a9b0-1234-f012-567890123456', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', 'e02fd0e4-00fd-090A-ca30-0d00a0038ba0'),
('d6e7f8a9-b0c1-2345-0123-678901234567', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('e7f8a9b0-c1d2-3456-1234-789012345678', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', '9c858901-8a57-4791-81fe-4c455b099bc9'),
('f8a9b0c1-d2e3-4567-2345-890123456789', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', '16fd2706-8baf-433b-82eb-8c7fada847da'),
('a9b0c1d2-e3f4-5678-3456-901234567890', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', '6fa459ea-ee8a-3ca4-894e-db77e160355e'),
('b0c1d2e3-f4a5-6789-4567-012345678901', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', '7c9e6679-7425-40de-944b-e07fc1f90ae7'),
('c1d2e3f4-a5b6-7890-5678-123456789012', '71c1a651-77c7-45c7-b17e-0e6913987138', '3fa85f64-5717-4562-b3fc-2c963f66afa6'),
('d2e3f4a5-b6c7-8901-6789-234567890123', '71c1a651-77c7-45c7-b17e-0e6913987138', 'c56a4180-65aa-42ec-a945-5fd21dec0538'),
('e3f4a5b6-c7d8-9012-7890-345678901234', '71c1a651-77c7-45c7-b17e-0e6913987138', '21ec2020-3aea-4069-a2dd-08002b30309d'),
('f4a5b6c7-d8e9-0123-8901-456789012345', '71c1a651-77c7-45c7-b17e-0e6913987138', '7d444840-9dc0-11d1-b245-5ffdce74fad2'),
('a5b6c7d8-e9f0-1234-9012-567890123456', '71c1a651-77c7-45c7-b17e-0e6913987138', 'e02fd0e4-00fd-090A-ca30-0d00a0038ba0');

INSERT INTO `notifications` (`notification_id`, `user_id`, `event_id`, `seen`, `created_at`) VALUES
('12345678-1234-5678-1234-567812345678', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '81708416-9c20-4eea-af06-b54e1061d736', FALSE, '2023-01-04 10:00:00'),
('23456789-2345-6789-2345-678923456789', 'c56a4180-65aa-42ec-a945-5fd21dec0538', '81708416-9c20-4eea-af06-b54e1061d736', TRUE, '2023-01-04 11:00:00'),
('34567890-3456-7890-3456-789034567890', '21ec2020-3aea-4069-a2dd-08002b30309d', '81708416-9c20-4eea-af06-b54e1061d736', FALSE, '2023-01-04 12:00:00'),
('45678901-4567-8901-4567-890145678901', '7d444840-9dc0-11d1-b245-5ffdce74fad2', '81708416-9c20-4eea-af06-b54e1061d736', TRUE, '2023-01-04 13:00:00'),
('56789012-5678-9012-5678-901256789012', 'e02fd0e4-00fd-090A-ca30-0d00a0038ba0', '81708416-9c20-4eea-af06-b54e1061d736', FALSE, '2023-01-04 14:00:00'),
('67890123-6789-0123-6789-012367890123', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '81708416-9c20-4eea-af06-b54e1061d736', TRUE, '2023-01-04 15:00:00'),
('78901234-7890-1234-7890-123478901234', '9c858901-8a57-4791-81fe-4c455b099bc9', '81708416-9c20-4eea-af06-b54e1061d736', FALSE, '2023-01-04 16:00:00'),
('89012345-8901-2345-8901-234589012345', '16fd2706-8baf-433b-82eb-8c7fada847da', '81708416-9c20-4eea-af06-b54e1061d736', TRUE, '2023-01-04 17:00:00'),
('90123456-9012-3456-9012-345690123456', '6fa459ea-ee8a-3ca4-894e-db77e160355e', '81708416-9c20-4eea-af06-b54e1061d736', FALSE, '2023-01-04 18:00:00'),
('01234567-0123-4567-0123-456701234567', '7c9e6679-7425-40de-944b-e07fc1f90ae7', '81708416-9c20-4eea-af06-b54e1061d736', TRUE, '2023-01-04 19:00:00'),
('11223344-5566-7788-9900-aabbccddeeff', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', FALSE, '2023-01-05 10:00:00'),
('22334455-6677-8899-0011-bbccddeeff00', 'c56a4180-65aa-42ec-a945-5fd21dec0538', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', TRUE, '2023-01-05 11:00:00'),
('33445566-7788-9900-1122-ccddeeff0011', '21ec2020-3aea-4069-a2dd-08002b30309d', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', FALSE, '2023-01-05 12:00:00'),
('44556677-8899-0011-2233-ddeeff001122', '7d444840-9dc0-11d1-b245-5ffdce74fad2', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', TRUE, '2023-01-05 13:00:00'),
('55667788-9900-1122-3344-eeff00112233', 'e02fd0e4-00fd-090A-ca30-0d00a0038ba0', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', FALSE, '2023-01-05 14:00:00'),
('66778899-0011-2233-4455-ff0011223344', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', TRUE, '2023-01-05 15:00:00'),
('77889900-1122-3344-5566-001122334455', '9c858901-8a57-4791-81fe-4c455b099bc9', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', FALSE, '2023-01-05 16:00:00'),
('88990011-2233-4455-6677-112233445566', '16fd2706-8baf-433b-82eb-8c7fada847da', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', TRUE, '2023-01-05 17:00:00'),
('99001122-3344-5566-7788-223344556677', '6fa459ea-ee8a-3ca4-894e-db77e160355e', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', FALSE, '2023-01-05 18:00:00'),
('00112233-4455-6677-8899-334455667788', '7c9e6679-7425-40de-944b-e07fc1f90ae7', '97d32fa5-38ea-4e6e-a6c3-2a03537204a5', TRUE, '2023-01-05 19:00:00'),
('aabbccdd-eeff-0011-2233-445566778899', '3fa85f64-5717-4562-b3fc-2c963f66afa6', '71c1a651-77c7-45c7-b17e-0e6913987138', FALSE, '2023-01-06 10:00:00'),
('bbccddee-ff00-1122-3344-556677889900', 'c56a4180-65aa-42ec-a945-5fd21dec0538', '71c1a651-77c7-45c7-b17e-0e6913987138', TRUE, '2023-01-06 11:00:00'),
('ccddeeff-0011-2233-4455-667788990011', '21ec2020-3aea-4069-a2dd-08002b30309d', '71c1a651-77c7-45c7-b17e-0e6913987138', FALSE, '2023-01-06 12:00:00'),
('ddeeff00-1122-3344-5566-778899001122', '7d444840-9dc0-11d1-b245-5ffdce74fad2', '71c1a651-77c7-45c7-b17e-0e6913987138', TRUE, '2023-01-06 13:00:00'),
('eeff0011-2233-4455-6677-889900112233', 'e02fd0e4-00fd-090A-ca30-0d00a0038ba0', '71c1a651-77c7-45c7-b17e-0e6913987138', FALSE, '2023-01-06 14:00:00');