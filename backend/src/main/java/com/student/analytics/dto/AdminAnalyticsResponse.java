package com.student.analytics.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class AdminAnalyticsResponse {
    private Long totalStudents;
    private Double classAverageGpa;
    private Long highRiskStudents;
    private Map<String, Double> subjectDifficultyIndex;
    private List<TopPerformerDto> topPerformers;
}
