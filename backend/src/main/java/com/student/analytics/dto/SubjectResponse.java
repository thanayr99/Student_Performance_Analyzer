package com.student.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SubjectResponse {
    private Long id;
    private String name;
    private Integer credits;
}
