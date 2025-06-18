INSERT INTO `files` (`file_id`, `url`, `filename`, `mime_type`, `size`, `uploaded_at`) VALUES
('11111111-1111-1111-1111-111111111111', 'https://example.com/files/1', 'profile1.jpg', 'image/jpeg', 102400, '2023-01-01 10:00:00'),
('22222222-2222-2222-2222-222222222222', 'https://example.com/files/2', 'document.pdf', 'application/pdf', 512000, '2023-01-02 11:00:00'),
('33333333-3333-3333-3333-333333333333', 'https://example.com/files/3', 'presentation.pptx', 'application/vnd.ms-powerpoint', 2048000, '2023-01-03 12:00:00');

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `email_verified`, `created_at`, `changed_at`, `profile_picture_id`) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'John Doe', 'john@example.com', '$2y$10$9tzFNIkMGNBLXeBssS1Kje/v03Gdk7qKiwrIFqBwHkFSv.GW/GII2', TRUE, '2023-01-01 10:00:00', '2023-01-01 10:00:00', '11111111-1111-1111-1111-111111111111'),
-- Senha: Password1!
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jane Smith', 'jane@example.com', '$2y$10$Ip9dAuCvrUcAKJh3mUFbLOZ.gTf3Q/bvXC4fFcuFP33IkzZQBLSte', TRUE, '2023-01-02 11:00:00', '2023-01-02 11:00:00', NULL),
-- Senha: Password2!
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Bob Johnson', 'bob@example.com', '$2y$10$pvkDbaG812rhWDboJBkgn.2N03PZJORmC83/3xLwLFEhNbG1aCXly', FALSE, '2023-01-03 12:00:00', '2023-01-03 12:00:00', NULL);
-- Senha: Password3!
INSERT INTO `institutions` (`institution_id`, `name`, `email`, `phone_number`, `description`, `thumbnail_id`, `banner_id`, `owner_id`) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Harvard University', 'contact@harvard.edu', '+15551234567', 'Ivy League university', NULL, NULL, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'MIT', 'info@mit.edu', '+15552345678', 'Technology institute', NULL, NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Stanford University', 'admin@stanford.edu', '+15553456789', 'Private research university', NULL, NULL, 'cccccccc-cccc-cccc-cccc-cccccccccccc');

INSERT INTO `institution_users` (`institution_users_id`, `role`, `joined_at`, `institution_id`, `user_id`) VALUES
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'admin', '2023-01-01 10:00:00', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'teacher', '2023-01-02 11:00:00', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'student', '2023-01-03 12:00:00', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

INSERT INTO `invitations` (`invitation_id`, `email`, `role`, `token`, `expires_at`, `accepted_at`, `created_at`, `institution_id`, `invited_by`) VALUES
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'newuser1@example.com', 'teacher', 'token1abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuv', '2023-02-01 10:00:00', NULL, '2023-01-01 10:00:00', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'newuser2@example.com', 'student', 'token2abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuv', '2023-02-02 11:00:00', '2023-01-15 11:00:00', '2023-01-02 11:00:00', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('llllllll-llll-llll-llll-llllllllllll', 'newuser3@example.com', 'admin', 'token3abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuv', '2023-02-03 12:00:00', NULL, '2023-01-03 12:00:00', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

INSERT INTO `classes` (`class_id`, `name`, `description`, `thumbnail_id`, `banner_id`, `institution_id`) VALUES
('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'Computer Science 101', 'Intro to Computer Science', NULL, NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'Mathematics 201', 'Advanced Calculus', NULL, NULL, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('oooooooo-oooo-oooo-oooo-oooooooooooo', 'Physics 301', 'Quantum Mechanics', NULL, NULL, 'ffffffff-ffff-ffff-ffff-ffffffffffff');

INSERT INTO `class_users` (`class_users_id`, `joined_at`, `class_id`, `user_id`) VALUES
('pppppppp-pppp-pppp-pppp-pppppppppppp', '2023-01-01 10:00:00', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '2023-01-02 11:00:00', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', '2023-01-03 12:00:00', 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

INSERT INTO `subjects` (`subject_id`, `name`, `description`, `thumbnail_id`, `banner_id`, `institution_id`, `professor_id`) VALUES
('ssssssss-ssss-ssss-ssss-ssssssssssss', 'Programming Fundamentals', 'Learn basic programming concepts', NULL, NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('tttttttt-tttt-tttt-tttt-tttttttttttt', 'Linear Algebra', 'Matrix operations and vector spaces', NULL, NULL, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', 'Thermodynamics', 'Study of heat and energy transfer', NULL, NULL, 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

INSERT INTO `subject_classes` (`subject_classes_id`, `class_id`, `subject_id`) VALUES
('vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'ssssssss-ssss-ssss-ssss-ssssssssssss'),
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'tttttttt-tttt-tttt-tttt-tttttttttttt'),
('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'oooooooo-oooo-oooo-oooo-oooooooooooo', 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu');

INSERT INTO `materials` (`material_id`, `title`, `created_at`, `changed_at`, `subject_id`, `file_id`) VALUES
('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', 'Introduction to Python', '2023-01-01 10:00:00', '2023-01-01 10:00:00', 'ssssssss-ssss-ssss-ssss-ssssssssssss', '22222222-2222-2222-2222-222222222222'),
('zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz', 'Matrix Operations', '2023-01-02 11:00:00', '2023-01-02 11:00:00', 'tttttttt-tttt-tttt-tttt-tttttttttttt', '33333333-3333-3333-3333-333333333333'),
('11111111-1111-1111-1111-111111111112', 'Thermodynamics Laws', '2023-01-03 12:00:00', '2023-01-03 12:00:00', 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', '22222222-2222-2222-2222-222222222222');

INSERT INTO `assignments` (`assignment_id`, `title`, `description`, `deadline`, `subject_id`, `attachment_id`) VALUES
('22222222-2222-2222-2222-222222222223', 'Python Project', 'Create a simple calculator', '2023-02-01', 'ssssssss-ssss-ssss-ssss-ssssssssssss', NULL),
('33333333-3333-3333-3333-333333333334', 'Matrix Quiz', 'Solve matrix problems', '2023-02-15', 'tttttttt-tttt-tttt-tttt-tttttttttttt', NULL),
('44444444-4444-4444-4444-444444444445', 'Thermo Lab Report', 'Report on heat transfer experiment', '2023-03-01', 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', NULL);

INSERT INTO `submissions` (`submission_id`, `submitted_at`, `grade`, `concept`, `feedback`, `assignment_id`, `user_id`, `file_id`) VALUES
('55555555-5555-5555-5555-555555555555', '2023-01-25 10:00:00', 9.5, 'Excellent', 'Great work!', '22222222-2222-2222-2222-222222222223', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),
('66666666-6666-6666-6666-666666666666', '2023-01-30 11:00:00', 7.0, 'Good', 'Needs more explanation', '33333333-3333-3333-3333-333333333334', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),
('77777777-7777-7777-7777-777777777777', '2023-02-28 12:00:00', NULL, NULL, NULL, '44444444-4444-4444-4444-444444444445', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NULL);

INSERT INTO `forum_messages` (`forum_messages_id`, `content`, `created_at`, `changed_at`, `sent_by`, `subject_id`) VALUES
('88888888-8888-8888-8888-888888888888', 'When is the project due?', '2023-01-10 10:00:00', '2023-01-10 10:00:00', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ssssssss-ssss-ssss-ssss-ssssssssssss'),
('99999999-9999-9999-9999-999999999999', 'The deadline is February 1st', '2023-01-10 11:00:00', '2023-01-10 11:00:00', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ssssssss-ssss-ssss-ssss-ssssssssssss'),
('00000000-0000-0000-0000-000000000001', 'Can we use NumPy for the matrix operations?', '2023-01-15 12:00:00', '2023-01-15 12:00:00', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'tttttttt-tttt-tttt-tttt-tttttttttttt');

INSERT INTO `events` (`event_id`, `title`, `description`, `type`, `event_date`, `created_at`, `changed_at`) VALUES
('11111111-1111-1111-1111-111111111113', 'Final Exam', 'Comprehensive final exam', 'exam', '2023-05-15 09:00:00', '2023-01-01 10:00:00', '2023-01-01 10:00:00'),
('22222222-2222-2222-2222-222222222224', 'Guest Lecture', 'Industry expert on AI', 'lecture', '2023-04-10 14:00:00', '2023-01-02 11:00:00', '2023-01-02 11:00:00'),
('33333333-3333-3333-3333-333333333335', 'Spring Break', 'No classes this week', 'holiday', '2023-03-13 00:00:00', '2023-01-03 12:00:00', '2023-01-03 12:00:00');

INSERT INTO `institutional_events` (`institutional_event_id`, `event_id`, `institution_id`) VALUES
('44444444-4444-4444-4444-444444444446', '11111111-1111-1111-1111-111111111113', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('55555555-5555-5555-5555-555555555557', '22222222-2222-2222-2222-222222222224', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('66666666-6666-6666-6666-666666666668', '33333333-3333-3333-3333-333333333335', 'ffffffff-ffff-ffff-ffff-ffffffffffff');

INSERT INTO `subject_events` (`subject_event_id`, `event_id`, `subject_id`) VALUES
('77777777-7777-7777-7777-777777777779', '11111111-1111-1111-1111-111111111113', 'ssssssss-ssss-ssss-ssss-ssssssssssss'),
('88888888-8888-8888-8888-888888888880', '22222222-2222-2222-2222-222222222224', 'tttttttt-tttt-tttt-tttt-tttttttttttt'),
('99999999-9999-9999-9999-999999999990', '33333333-3333-3333-3333-333333333335', 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu');

INSERT INTO `user_events` (`user_event_id`, `event_id`, `user_id`) VALUES
('00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111113', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('00000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222224', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('00000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333335', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

INSERT INTO `notifications` (`notification_id`, `user_id`, `event_id`, `seen`, `created_at`) VALUES
('00000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111113', FALSE, '2023-01-01 10:00:00'),
('00000000-0000-0000-0000-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222224', TRUE, '2023-01-02 11:00:00'),
('00000000-0000-0000-0000-000000000007', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333335', FALSE, '2023-01-03 12:00:00');