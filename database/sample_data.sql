INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$8xVv.Q8Qn9ecxM4Q7v7FTeR3w7Q2xMlnM6tqWWj2m4stxSl4d/f4W', 'ADMIN'),
('student1', '$2a$10$8xVv.Q8Qn9ecxM4Q7v7FTeR3w7Q2xMlnM6tqWWj2m4stxSl4d/f4W', 'STUDENT');

INSERT INTO students (user_id, name, class_name, section) VALUES
(2, 'John Carter', '10', 'A');

INSERT INTO subjects (name, credits) VALUES
('Mathematics', 4),
('Science', 3),
('English', 3);

INSERT INTO marks (student_id, subject_id, marks, exam_type, semester, date) VALUES
(1, 1, 72, 'QUIZ', 1, '2025-08-01'),
(1, 2, 68, 'MIDTERM', 1, '2025-09-01'),
(1, 3, 75, 'FINAL', 1, '2025-10-01'),
(1, 1, 78, 'QUIZ', 2, '2025-11-01'),
(1, 2, 74, 'MIDTERM', 2, '2025-12-01'),
(1, 3, 80, 'FINAL', 2, '2026-01-01');

INSERT INTO attendance (student_id, attendance_percentage) VALUES
(1, 82);
