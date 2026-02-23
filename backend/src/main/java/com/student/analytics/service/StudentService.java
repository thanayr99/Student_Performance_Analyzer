package com.student.analytics.service;

import com.student.analytics.dto.MarksResponse;
import com.student.analytics.dto.StudentAnalyticsResponse;
import com.student.analytics.dto.StudentProfileResponse;
import com.student.analytics.entity.Marks;
import com.student.analytics.entity.Student;
import com.student.analytics.entity.User;
import com.student.analytics.exception.ResourceNotFoundException;
import com.student.analytics.repository.MarksRepository;
import com.student.analytics.repository.StudentRepository;
import com.student.analytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final MarksRepository marksRepository;
    private final AnalyticsService analyticsService;

    public StudentProfileResponse getProfile(String username) {
        Student student = getStudentByUsername(username);
        return new StudentProfileResponse(
                student.getId(),
                student.getUser().getUsername(),
                student.getName(),
                student.getClassName(),
                student.getSection()
        );
    }

    public List<MarksResponse> getMarks(String username) {
        Student student = getStudentByUsername(username);
        List<Marks> marks = marksRepository.findByStudent(student);
        return marks.stream()
                .sorted(Comparator.comparing(Marks::getDate).reversed())
                .map(m -> MarksResponse.builder()
                        .id(m.getId())
                        .subject(m.getSubject().getName())
                        .marks(m.getMarks())
                        .examType(m.getExamType())
                        .semester(m.getSemester())
                        .date(m.getDate())
                        .build()
                )
                .toList();
    }

    @Transactional
    public StudentAnalyticsResponse getAnalytics(String username) {
        Student student = getStudentByUsername(username);
        return analyticsService.buildAnalyticsForStudent(student);
    }

    private Student getStudentByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
    }
}
