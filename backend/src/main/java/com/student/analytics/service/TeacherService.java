package com.student.analytics.service;

import com.student.analytics.dto.StudentAnalyticsResponse;
import com.student.analytics.dto.TeacherStudentPerformanceResponse;
import com.student.analytics.entity.Student;
import com.student.analytics.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final StudentRepository studentRepository;
    private final AnalyticsService analyticsService;

    @Transactional
    public List<TeacherStudentPerformanceResponse> getStudentPerformance() {
        return studentRepository.findAll().stream()
                .sorted(Comparator.comparing(Student::getName))
                .map(this::toPerformanceResponse)
                .toList();
    }

    private TeacherStudentPerformanceResponse toPerformanceResponse(Student student) {
        StudentAnalyticsResponse analytics = analyticsService.buildAnalyticsForStudent(student);
        return new TeacherStudentPerformanceResponse(
                student.getId(),
                student.getUser().getUsername(),
                student.getName(),
                student.getClassName(),
                student.getSection(),
                analytics.getGpa(),
                analytics.getAttendancePercentage(),
                analytics.getPredictedScore(),
                analytics.getRiskLevel(),
                analytics.getSubjectAverages(),
                analytics.getRecommendation()
        );
    }
}
