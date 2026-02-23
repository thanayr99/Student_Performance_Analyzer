package com.student.analytics.dto;

import com.student.analytics.entity.enums.RiskLevel;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class StudentAnalyticsResponse {
    private Double gpa;
    private Double attendancePercentage;
    private Double predictedScore;
    private RiskLevel riskLevel;
    private Double improvementIndex;
    private Double trendSlope;
    private List<SubjectMarkDto> subjectAverages;
    private String recommendation;
}
