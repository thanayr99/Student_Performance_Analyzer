package com.student.analytics.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceRequest {
    @NotNull
    private Long studentId;
    @NotNull
    @Min(0)
    @Max(100)
    private Double attendancePercentage;
}
