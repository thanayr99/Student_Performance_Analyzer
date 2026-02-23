CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    section VARCHAR(20) NOT NULL,
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    credits INT NOT NULL
);

CREATE TABLE marks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    marks DOUBLE NOT NULL,
    exam_type VARCHAR(30) NOT NULL,
    semester INT NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_marks_student FOREIGN KEY (student_id) REFERENCES students(id),
    CONSTRAINT fk_marks_subject FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL UNIQUE,
    attendance_percentage DOUBLE NOT NULL,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE performance_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL UNIQUE,
    gpa DOUBLE NOT NULL,
    predicted_score DOUBLE NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    improvement_index DOUBLE NOT NULL,
    CONSTRAINT fk_analytics_student FOREIGN KEY (student_id) REFERENCES students(id)
);
