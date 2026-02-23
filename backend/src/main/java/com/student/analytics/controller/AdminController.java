package com.student.analytics.controller;

import com.student.analytics.dto.*;
import com.student.analytics.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/students")
    public ResponseEntity<List<StudentSummaryResponse>> getStudents() {
        return ResponseEntity.ok(adminService.getStudents());
    }

    @PostMapping("/students")
    public ResponseEntity<StudentSummaryResponse> createStudent(@Valid @RequestBody StudentCreateRequest request) {
        return ResponseEntity.ok(adminService.createStudent(request));
    }

    @PutMapping("/students/{studentId}")
    public ResponseEntity<StudentSummaryResponse> updateStudent(
            @PathVariable Long studentId,
            @Valid @RequestBody StudentUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateStudent(studentId, request));
    }

    @DeleteMapping("/students/{studentId}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long studentId) {
        adminService.deleteStudent(studentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<SubjectResponse>> getSubjects() {
        return ResponseEntity.ok(adminService.getSubjects());
    }

    @PostMapping("/subjects")
    public ResponseEntity<SubjectResponse> createSubject(@Valid @RequestBody SubjectRequest request) {
        return ResponseEntity.ok(adminService.createSubject(request));
    }

    @PutMapping("/subjects/{subjectId}")
    public ResponseEntity<SubjectResponse> updateSubject(
            @PathVariable Long subjectId,
            @Valid @RequestBody SubjectRequest request) {
        return ResponseEntity.ok(adminService.updateSubject(subjectId, request));
    }

    @DeleteMapping("/subjects/{subjectId}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long subjectId) {
        adminService.deleteSubject(subjectId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/registrations")
    public ResponseEntity<List<UserSummaryResponse>> getRegistrations() {
        return ResponseEntity.ok(adminService.getRegistrations());
    }

    @PostMapping("/registrations")
    public ResponseEntity<UserSummaryResponse> createRegistration(@Valid @RequestBody UserRegistrationRequest request) {
        return ResponseEntity.ok(adminService.createRegistration(request));
    }

    @PutMapping("/registrations/{userId}")
    public ResponseEntity<UserSummaryResponse> updateRegistration(
            @PathVariable Long userId,
            @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(adminService.updateRegistration(userId, request));
    }

    @DeleteMapping("/registrations/{userId}")
    public ResponseEntity<Void> deleteRegistration(@PathVariable Long userId) {
        adminService.deleteRegistration(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAdminAnalytics());
    }

    @GetMapping("/risk-report")
    public ResponseEntity<List<RiskReportRow>> getRiskReport() {
        return ResponseEntity.ok(adminService.getRiskReport());
    }

    @GetMapping("/risk-report/export")
    public ResponseEntity<byte[]> exportRiskReport() {
        byte[] content = adminService.exportRiskReportCsv();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDisposition(ContentDisposition.attachment().filename("risk-report.csv").build());
        return ResponseEntity.ok().headers(headers).body(content);
    }

    @PostMapping("/marks")
    public ResponseEntity<MarksResponse> addMarks(@Valid @RequestBody MarksRequest request) {
        return ResponseEntity.ok(adminService.addMarks(request));
    }

    @PostMapping("/attendance")
    public ResponseEntity<Void> addAttendance(@Valid @RequestBody AttendanceRequest request) {
        adminService.addOrUpdateAttendance(request);
        return ResponseEntity.ok().build();
    }
}
