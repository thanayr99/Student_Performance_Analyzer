package com.student.analytics.config;

import com.student.analytics.entity.*;
import com.student.analytics.entity.enums.ExamType;
import com.student.analytics.entity.enums.Role;
import com.student.analytics.repository.AttendanceRepository;
import com.student.analytics.repository.MarksRepository;
import com.student.analytics.repository.StudentRepository;
import com.student.analytics.repository.SubjectRepository;
import com.student.analytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final MarksRepository marksRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        User studentUser = new User();
        studentUser.setUsername("student1");
        studentUser.setPassword(passwordEncoder.encode("student123"));
        studentUser.setRole(Role.STUDENT);
        userRepository.save(studentUser);

        Student student = new Student();
        student.setUser(studentUser);
        student.setName("John Carter");
        student.setClassName("10");
        student.setSection("A");
        studentRepository.save(student);

        Subject math = new Subject();
        math.setName("Mathematics");
        math.setCredits(4);
        Subject science = new Subject();
        science.setName("Science");
        science.setCredits(3);
        Subject english = new Subject();
        english.setName("English");
        english.setCredits(3);
        subjectRepository.saveAll(List.of(math, science, english));

        marksRepository.saveAll(List.of(
                createMarks(student, math, 72.0, ExamType.QUIZ, 1, LocalDate.now().minusMonths(6)),
                createMarks(student, science, 68.0, ExamType.MIDTERM, 1, LocalDate.now().minusMonths(5)),
                createMarks(student, english, 75.0, ExamType.FINAL, 1, LocalDate.now().minusMonths(4)),
                createMarks(student, math, 78.0, ExamType.QUIZ, 2, LocalDate.now().minusMonths(3)),
                createMarks(student, science, 74.0, ExamType.MIDTERM, 2, LocalDate.now().minusMonths(2)),
                createMarks(student, english, 80.0, ExamType.FINAL, 2, LocalDate.now().minusMonths(1))
        ));

        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setAttendancePercentage(82.0);
        attendanceRepository.save(attendance);
    }

    private Marks createMarks(Student student, Subject subject, Double score, ExamType type, Integer semester, LocalDate date) {
        Marks marks = new Marks();
        marks.setStudent(student);
        marks.setSubject(subject);
        marks.setMarks(score);
        marks.setExamType(type);
        marks.setSemester(semester);
        marks.setDate(date);
        return marks;
    }
}
