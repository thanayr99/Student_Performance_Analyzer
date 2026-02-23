package com.student.analytics.util;

import java.util.List;

public final class AnalyticsMathUtil {
    private AnalyticsMathUtil() {
    }

    public static double average(List<Double> values) {
        if (values == null || values.isEmpty()) {
            return 0.0;
        }
        return values.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    public static double slopeOfLastN(List<Double> values) {
        if (values == null || values.size() < 2) {
            return 0.0;
        }
        int n = values.size();
        double sumX = 0;
        double sumY = 0;
        double sumXY = 0;
        double sumXX = 0;
        for (int i = 0; i < n; i++) {
            double x = i + 1;
            double y = values.get(i);
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        }
        double denominator = n * sumXX - sumX * sumX;
        if (denominator == 0) {
            return 0.0;
        }
        return (n * sumXY - sumX * sumY) / denominator;
    }
}
