package com.student.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentCreateRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotBlank
    private String name;
    @NotBlank
    private String className;
    @NotBlank
    private String section;
}
