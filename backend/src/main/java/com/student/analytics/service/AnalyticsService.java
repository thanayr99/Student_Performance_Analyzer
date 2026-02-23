package com.student.analytics.service;

import com.student.analytics.dto.StudentAnalyticsResponse;
import com.student.analytics.dto.SubjectMarkDto;
import com.student.analytics.entity.*;
import com.student.analytics.entity.enums.RiskLevel;
import com.student.analytics.repository.AttendanceRepository;
import com.student.analytics.repository.MarksRepository;
import com.student.analytics.repository.PerformanceAnalyticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final MarksRepository marksRepository;
    private final AttendanceRepository attendanceRepository;
    private final PerformanceAnalyticsRepository performanceAnalyticsRepository;
    private final PredictionService predictionService;
    private final RecommendationService recommendationService;

    @Transactional
    public StudentAnalyticsResponse buildAnalyticsForStudent(Student student) {
        List<Marks> marks = marksRepository.findByStudent(student);
        marks.sort(Comparator.comparing(Marks::getDate));

        List<SubjectMarkDto> subjectAverages = computeSubjectAverages(marks);
        Double gpa = calculateCreditWeightedGpa(marks);
        Double attendance = attendanceRepository.findByStudent(student)
                .map(Attendance::getAttendancePercentage)
                .orElse(0.0);
        List<Double> last3Scores = marks.stream()
                .skip(Math.max(0, marks.size() - 3))
                .map(Marks::getMarks)
                .toList();
        Double trendSlope = computeTrendSlope(last3Scores);
        Double previousGpa = calculateSemesterGpa(marks, getCurrentSemester(marks) - 1);
        Double currentGpa = calculateSemesterGpa(marks, getCurrentSemester(marks));
        Double improvementIndex = currentGpa - previousGpa;

        PredictionService.PredictionResult prediction = predictionService.predict(attendance, last3Scores, previousGpa);
        RiskLevel riskLevel = classifyRisk(gpa, attendance);
        String recommendation = recommendationService.buildRecommendation(attendance, subjectAverages, trendSlope);

        upsertAnalytics(student, gpa, prediction.getPredictedScore(), riskLevel, improvementIndex);

        return StudentAnalyticsResponse.builder()
                .gpa(gpa)
                .attendancePercentage(attendance)
                .predictedScore(prediction.getPredictedScore())
                .riskLevel(riskLevel)
                .improvementIndex(improvementIndex)
                .trendSlope(trendSlope)
                .subjectAverages(subjectAverages)
                .recommendation(recommendation)
                .build();
    }

    public RiskLevel classifyRisk(Double gpa, Double attendance) {
        if (gpa < 5 || attendance < 60) {
            return RiskLevel.HIGH;
        }
        if (gpa <= 7) {
            return RiskLevel.MEDIUM;
        }
        return RiskLevel.LOW;
    }

    private List<SubjectMarkDto> computeSubjectAverages(List<Marks> marks) {
        return marks.stream()
                .collect(Collectors.groupingBy(m -> m.getSubject().getName(),
                        Collectors.averagingDouble(Marks::getMarks)))
                .entrySet()
                .stream()
                .map(e -> new SubjectMarkDto(e.getKey(), round2(e.getValue())))
                .sorted(Comparator.comparing(SubjectMarkDto::getSubject))
                .toList();
    }

    private Double calculateCreditWeightedGpa(List<Marks> marks) {
        if (marks.isEmpty()) {
            return 0.0;
        }
        Map<Subject, Double> subjectAverage = marks.stream()
                .collect(Collectors.groupingBy(Marks::getSubject, Collectors.averagingDouble(Marks::getMarks)));
        double weightedScoreSum = 0;
        double totalCredits = 0;
        for (Map.Entry<Subject, Double> entry : subjectAverage.entrySet()) {
            double credits = entry.getKey().getCredits();
            weightedScoreSum += (entry.getValue() / 10.0) * credits;
            totalCredits += credits;
        }
        return totalCredits == 0 ? 0.0 : round2(weightedScoreSum / totalCredits);
    }

    private int getCurrentSemester(List<Marks> marks) {
        return marks.stream().map(Marks::getSemester).max(Integer::compareTo).orElse(1);
    }

    private Double calculateSemesterGpa(List<Marks> marks, int semester) {
        if (semester <= 0) {
            return 0.0;
        }
        List<Marks> semesterMarks = marks.stream().filter(m -> m.getSemester() == semester).toList();
        return calculateCreditWeightedGpa(semesterMarks);
    }

    private Double computeTrendSlope(List<Double> last3Scores) {
        if (last3Scores.size() < 2) {
            return 0.0;
        }
        int n = last3Scores.size();
        double sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (int i = 0; i < n; i++) {
            double x = i + 1;
            double y = last3Scores.get(i);
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        }
        double denominator = n * sumXX - sumX * sumX;
        if (denominator == 0) {
            return 0.0;
        }
        return round2((n * sumXY - sumX * sumY) / denominator);
    }

    private void upsertAnalytics(Student student, Double gpa, Double predictedScore, RiskLevel risk, Double improvementIndex) {
        PerformanceAnalytics analytics = performanceAnalyticsRepository.findByStudent(student).orElseGet(PerformanceAnalytics::new);
        analytics.setStudent(student);
        analytics.setGpa(gpa);
        analytics.setPredictedScore(round2(predictedScore));
        analytics.setRiskLevel(risk);
        analytics.setImprovementIndex(round2(improvementIndex));
        performanceAnalyticsRepository.save(analytics);
    }

    private Double round2(Double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
