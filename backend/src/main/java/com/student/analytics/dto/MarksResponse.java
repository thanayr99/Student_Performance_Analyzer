package com.student.analytics.dto;

import com.student.analytics.entity.enums.ExamType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class MarksResponse {
    private Long id;
    private String subject;
    private Double marks;
    private ExamType examType;
    private Integer semester;
    private LocalDate date;
}
