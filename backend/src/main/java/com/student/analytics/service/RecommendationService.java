package com.student.analytics.service;

import com.student.analytics.dto.SubjectMarkDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationService {

    public String buildRecommendation(Double attendance, List<SubjectMarkDto> subjectAverages, Double trendSlope) {
        List<String> actions = new ArrayList<>();
        if (attendance != null && attendance < 60) {
            actions.add("Improve attendance with a weekly class participation target.");
        }
        boolean lowSubject = subjectAverages.stream().anyMatch(s -> s.getAverageMarks() < 50);
        if (lowSubject) {
            actions.add("Increase subject practice for weak subjects using daily revision blocks.");
        }
        if (trendSlope != null && trendSlope < 0) {
            actions.add("Book mentorship support to reverse downward performance trend.");
        }
        if (actions.isEmpty()) {
            return "Performance is stable. Maintain your study plan and continue mock tests.";
        }
        return String.join(" ", actions);
    }
}
