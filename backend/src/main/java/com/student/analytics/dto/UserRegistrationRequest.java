package com.student.analytics.dto;

import com.student.analytics.entity.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotNull
    private Role role;
    private String name;
    private String className;
    private String section;
}
