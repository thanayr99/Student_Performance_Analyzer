package com.student.analytics.dto;

import com.student.analytics.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserSummaryResponse {
    private Long id;
    private String username;
    private Role role;
    private Long studentId;
    private String studentName;
    private String className;
    private String section;
}
