package com.student.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StudentProfileResponse {
    private Long id;
    private String username;
    private String name;
    private String className;
    private String section;
}
