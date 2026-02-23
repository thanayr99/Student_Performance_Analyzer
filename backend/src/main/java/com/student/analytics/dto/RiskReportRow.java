package com.student.analytics.dto;

import com.student.analytics.entity.enums.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RiskReportRow {
    private Long studentId;
    private String name;
    private Double gpa;
    private Double attendance;
    private RiskLevel riskLevel;
}
