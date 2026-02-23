package com.student.analytics.service;

import com.student.analytics.dto.*;
import com.student.analytics.entity.Attendance;
import com.student.analytics.entity.Marks;
import com.student.analytics.entity.Student;
import com.student.analytics.entity.Subject;
import com.student.analytics.entity.User;
import com.student.analytics.entity.enums.Role;
import com.student.analytics.entity.enums.RiskLevel;
import com.student.analytics.exception.BadRequestException;
import com.student.analytics.exception.ResourceNotFoundException;
import com.student.analytics.repository.AttendanceRepository;
import com.student.analytics.repository.MarksRepository;
import com.student.analytics.repository.StudentRepository;
import com.student.analytics.repository.SubjectRepository;
import com.student.analytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final MarksRepository marksRepository;
    private final AttendanceRepository attendanceRepository;
    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<StudentSummaryResponse> getStudents() {
        return studentRepository.findAll().stream()
                .map(s -> new StudentSummaryResponse(
                        s.getId(),
                        s.getUser().getUsername(),
                        s.getName(),
                        s.getClassName(),
                        s.getSection()))
                .toList();
    }

    public List<SubjectResponse> getSubjects() {
        return subjectRepository.findAll().stream()
                .sorted(Comparator.comparing(Subject::getName))
                .map(s -> new SubjectResponse(s.getId(), s.getName(), s.getCredits()))
                .toList();
    }

    public List<UserSummaryResponse> getRegistrations() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getUsername))
                .map(this::toUserSummary)
                .toList();
    }

    @Transactional
    public StudentSummaryResponse createStudent(StudentCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STUDENT);

        Student student = new Student();
        student.setUser(user);
        student.setName(request.getName());
        student.setClassName(request.getClassName());
        student.setSection(request.getSection());
        user.setStudent(student);

        User saved = userRepository.save(user);
        Student savedStudent = saved.getStudent();
        return new StudentSummaryResponse(
                savedStudent.getId(),
                saved.getUsername(),
                savedStudent.getName(),
                savedStudent.getClassName(),
                savedStudent.getSection()
        );
    }

    @Transactional
    public StudentSummaryResponse updateStudent(Long studentId, StudentUpdateRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        if (request.getUsername() != null && !request.getUsername().isBlank()
                && !request.getUsername().equals(student.getUser().getUsername())
                && userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        student.setName(request.getName());
        student.setClassName(request.getClassName());
        student.setSection(request.getSection());
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            student.getUser().setUsername(request.getUsername());
        }

        Student saved = studentRepository.save(student);
        return new StudentSummaryResponse(
                saved.getId(),
                saved.getUser().getUsername(),
                saved.getName(),
                saved.getClassName(),
                saved.getSection()
        );
    }

    @Transactional
    public void deleteStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        User user = student.getUser();
        userRepository.delete(user);
    }

    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {
        String normalizedName = request.getName().trim();
        if (subjectRepository.existsByName(normalizedName)) {
            throw new BadRequestException("Subject already exists");
        }
        Subject subject = new Subject();
        subject.setName(normalizedName);
        subject.setCredits(request.getCredits());
        Subject saved = subjectRepository.save(subject);
        return new SubjectResponse(saved.getId(), saved.getName(), saved.getCredits());
    }

    @Transactional
    public SubjectResponse updateSubject(Long subjectId, SubjectRequest request) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        String normalizedName = request.getName().trim();
        if (!normalizedName.equalsIgnoreCase(subject.getName())
                && subjectRepository.existsByName(normalizedName)) {
            throw new BadRequestException("Subject name already exists");
        }
        subject.setName(normalizedName);
        subject.setCredits(request.getCredits());
        Subject saved = subjectRepository.save(subject);
        return new SubjectResponse(saved.getId(), saved.getName(), saved.getCredits());
    }

    @Transactional
    public void deleteSubject(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        if (marksRepository.countBySubjectId(subjectId) > 0) {
            throw new BadRequestException("Cannot delete subject with existing marks");
        }
        subjectRepository.delete(subject);
    }

    @Transactional
    public UserSummaryResponse createRegistration(UserRegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        if (request.getRole() == Role.STUDENT) {
            Student student = new Student();
            student.setUser(user);
            student.setName(getOrDefault(request.getName(), request.getUsername()));
            student.setClassName(getOrDefault(request.getClassName(), "10"));
            student.setSection(getOrDefault(request.getSection(), "A"));
            user.setStudent(student);
        }

        User saved = userRepository.save(user);
        return toUserSummary(saved);
    }

    @Transactional
    public UserSummaryResponse updateRegistration(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!request.getUsername().equals(user.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        user.setUsername(request.getUsername());
        user.setRole(request.getRole());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() == Role.STUDENT) {
            Student student = user.getStudent();
            if (student == null) {
                student = new Student();
                student.setUser(user);
                user.setStudent(student);
            }
            student.setName(getOrDefault(request.getName(), user.getUsername()));
            student.setClassName(getOrDefault(request.getClassName(), "10"));
            student.setSection(getOrDefault(request.getSection(), "A"));
        } else if (user.getStudent() != null) {
            studentRepository.delete(user.getStudent());
            user.setStudent(null);
        }

        User saved = userRepository.save(user);
        return toUserSummary(saved);
    }

    @Transactional
    public void deleteRegistration(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }

    @Transactional
    public MarksResponse addMarks(MarksRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        Marks marks = new Marks();
        marks.setStudent(student);
        marks.setSubject(subject);
        marks.setMarks(request.getMarks());
        marks.setExamType(request.getExamType());
        marks.setSemester(request.getSemester());
        marks.setDate(request.getDate());
        Marks saved = marksRepository.save(marks);
        analyticsService.buildAnalyticsForStudent(student);
        return MarksResponse.builder()
                .id(saved.getId())
                .subject(saved.getSubject().getName())
                .marks(saved.getMarks())
                .examType(saved.getExamType())
                .semester(saved.getSemester())
                .date(saved.getDate())
                .build();
    }

    @Transactional
    public void addOrUpdateAttendance(AttendanceRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Attendance attendance = attendanceRepository.findByStudent(student).orElseGet(Attendance::new);
        attendance.setStudent(student);
        attendance.setAttendancePercentage(request.getAttendancePercentage());
        attendanceRepository.save(attendance);
        analyticsService.buildAnalyticsForStudent(student);
    }

    @Transactional
    public AdminAnalyticsResponse getAdminAnalytics() {
        List<Student> students = studentRepository.findAll();
        if (students.isEmpty()) {
            return AdminAnalyticsResponse.builder()
                    .totalStudents(0L)
                    .classAverageGpa(0.0)
                    .highRiskStudents(0L)
                    .subjectDifficultyIndex(Map.of())
                    .topPerformers(List.of())
                    .build();
        }

        List<StudentAnalyticsResponse> analyticsList = students.stream()
                .map(analyticsService::buildAnalyticsForStudent)
                .toList();

        long highRisk = analyticsList.stream().filter(a -> a.getRiskLevel() == RiskLevel.HIGH).count();
        double classAvgGpa = analyticsList.stream().mapToDouble(StudentAnalyticsResponse::getGpa).average().orElse(0);

        Map<String, Double> subjectDifficulty = marksRepository.findAll().stream()
                .collect(Collectors.groupingBy(m -> m.getSubject().getName(),
                        Collectors.averagingDouble(Marks::getMarks)))
                .entrySet()
                .stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> round2(100 - e.getValue())
                ));

        List<TopPerformerDto> topPerformers = students.stream()
                .map(s -> {
                    StudentAnalyticsResponse analytics = analyticsService.buildAnalyticsForStudent(s);
                    return new TopPerformerDto(s.getId(), s.getName(), analytics.getGpa());
                })
                .sorted(Comparator.comparing(TopPerformerDto::getGpa).reversed())
                .limit(5)
                .toList();

        return AdminAnalyticsResponse.builder()
                .totalStudents((long) students.size())
                .classAverageGpa(round2(classAvgGpa))
                .highRiskStudents(highRisk)
                .subjectDifficultyIndex(subjectDifficulty)
                .topPerformers(topPerformers)
                .build();
    }

    @Transactional
    public List<RiskReportRow> getRiskReport() {
        return studentRepository.findAll().stream()
                .map(student -> {
                    StudentAnalyticsResponse analytics = analyticsService.buildAnalyticsForStudent(student);
                    Double attendance = attendanceRepository.findByStudent(student)
                            .map(Attendance::getAttendancePercentage)
                            .orElse(0.0);
                    return new RiskReportRow(
                            student.getId(),
                            student.getName(),
                            analytics.getGpa(),
                            attendance,
                            analytics.getRiskLevel()
                    );
                })
                .filter(r -> r.getRiskLevel() != RiskLevel.LOW)
                .toList();
    }

    @Transactional
    public byte[] exportRiskReportCsv() {
        StringBuilder builder = new StringBuilder();
        builder.append("student_id,name,gpa,attendance,risk_level\n");
        for (RiskReportRow row : getRiskReport()) {
            builder.append(row.getStudentId()).append(",")
                    .append(row.getName()).append(",")
                    .append(row.getGpa()).append(",")
                    .append(row.getAttendance()).append(",")
                    .append(row.getRiskLevel()).append("\n");
        }
        return builder.toString().getBytes(StandardCharsets.UTF_8);
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private UserSummaryResponse toUserSummary(User user) {
        Student student = user.getStudent();
        return new UserSummaryResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                student != null ? student.getId() : null,
                student != null ? student.getName() : null,
                student != null ? student.getClassName() : null,
                student != null ? student.getSection() : null
        );
    }

    private String getOrDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
