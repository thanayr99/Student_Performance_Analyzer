package com.student.analytics.dto;

import com.student.analytics.entity.enums.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class TeacherStudentPerformanceResponse {
    private Long studentId;
    private String username;
    private String name;
    private String className;
    private String section;
    private Double cgpa;
    private Double attendancePercentage;
    private Double predictedScore;
    private RiskLevel riskLevel;
    private List<SubjectMarkDto> subjectAverages;
    private String recommendation;
}
