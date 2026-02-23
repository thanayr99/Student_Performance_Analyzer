package com.student.analytics.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class PredictionService {

    private final RestTemplate restTemplate;

    @Value("${app.prediction.flask-enabled:false}")
    private boolean flaskEnabled;

    @Value("${app.prediction.flask-url:http://localhost:5000/predict}")
    private String flaskUrl;

    public PredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PredictionResult predict(Double attendance, List<Double> last3Scores, Double previousGpa) {
        if (flaskEnabled) {
            try {
                Map<String, Object> req = Map.of(
                        "attendance", attendance,
                        "last_3_scores", last3Scores,
                        "previous_gpa", previousGpa
                );
                FlaskPredictionResponse resp = restTemplate.postForObject(flaskUrl, req, FlaskPredictionResponse.class);
                if (resp != null) {
                    return new PredictionResult(resp.getPredictedScore(), resp.getRiskProbability());
                }
            } catch (Exception ignored) {
            }
        }
        return localPredict(attendance, last3Scores, previousGpa);
    }

    private PredictionResult localPredict(Double attendance, List<Double> last3Scores, Double previousGpa) {
        if (last3Scores == null || last3Scores.isEmpty()) {
            return new PredictionResult(0.0, 0.5);
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
        double slope = (n * sumXY - sumX * sumY) / Math.max((n * sumXX - sumX * sumX), 1.0);
        double intercept = (sumY - slope * sumX) / n;
        double predicted = slope * (n + 1) + intercept;
        double adjusted = predicted * 0.7 + attendance * 0.1 + previousGpa * 10 * 0.2;
        adjusted = Math.max(0, Math.min(100, adjusted));

        double riskProbability = 1.0 / (1.0 + Math.exp((adjusted - 50) / 10));
        return new PredictionResult(adjusted, riskProbability);
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class FlaskPredictionResponse {
        private Double predictedScore;
        private Double riskProbability;
    }

    @Getter
    @AllArgsConstructor
    public static class PredictionResult {
        private Double predictedScore;
        private Double riskProbability;
    }
}
