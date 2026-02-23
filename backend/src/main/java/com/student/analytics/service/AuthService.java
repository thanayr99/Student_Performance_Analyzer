package com.student.analytics.service;

import com.student.analytics.dto.AuthRequest;
import com.student.analytics.dto.AuthResponse;
import com.student.analytics.dto.RegisterRequest;
import com.student.analytics.entity.Student;
import com.student.analytics.entity.User;
import com.student.analytics.entity.enums.Role;
import com.student.analytics.exception.BadRequestException;
import com.student.analytics.repository.StudentRepository;
import com.student.analytics.repository.UserRepository;
import com.student.analytics.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        userRepository.save(user);

        if (request.getRole() == Role.STUDENT) {
            Student student = new Student();
            student.setUser(user);
            student.setName(request.getName() == null ? request.getUsername() : request.getName());
            student.setClassName(request.getClassName() == null ? "10" : request.getClassName());
            student.setSection(request.getSection() == null ? "A" : request.getSection());
            studentRepository.save(student);
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }
}
