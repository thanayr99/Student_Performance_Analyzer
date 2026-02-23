package com.student.analytics.dto;

import com.student.analytics.entity.enums.ExamType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MarksRequest {
    @NotNull
    private Long studentId;
    @NotNull
    private Long subjectId;
    @NotNull
    @Min(0)
    @Max(100)
    private Double marks;
    @NotNull
    private ExamType examType;
    @NotNull
    private Integer semester;
    @NotNull
    private LocalDate date;
}
