package com.student.analytics.controller;

import com.student.analytics.dto.MarksResponse;
import com.student.analytics.dto.StudentAnalyticsResponse;
import com.student.analytics.dto.StudentProfileResponse;
import com.student.analytics.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(studentService.getProfile(authentication.getName()));
    }

    @GetMapping("/marks")
    public ResponseEntity<List<MarksResponse>> getMarks(Authentication authentication) {
        return ResponseEntity.ok(studentService.getMarks(authentication.getName()));
    }

    @GetMapping("/analytics")
    public ResponseEntity<StudentAnalyticsResponse> getAnalytics(Authentication authentication) {
        return ResponseEntity.ok(studentService.getAnalytics(authentication.getName()));
    }
}
