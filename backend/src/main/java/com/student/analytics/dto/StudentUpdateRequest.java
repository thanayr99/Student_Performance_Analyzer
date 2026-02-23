package com.student.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentUpdateRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String className;
    @NotBlank
    private String section;
    private String username;
}
