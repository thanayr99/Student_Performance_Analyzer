package com.student.analytics.dto;

import com.student.analytics.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private Role role;
}
