package com.student.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TopPerformerDto {
    private Long studentId;
    private String studentName;
    private Double gpa;
}
