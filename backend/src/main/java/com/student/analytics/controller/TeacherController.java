package com.student.analytics.controller;

import com.student.analytics.dto.AttendanceRequest;
import com.student.analytics.dto.MarksRequest;
import com.student.analytics.dto.MarksResponse;
import com.student.analytics.dto.StudentCreateRequest;
import com.student.analytics.dto.StudentSummaryResponse;
import com.student.analytics.dto.SubjectResponse;
import com.student.analytics.dto.TeacherStudentPerformanceResponse;
import com.student.analytics.service.AdminService;
import com.student.analytics.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final AdminService adminService;
    private final TeacherService teacherService;

    @GetMapping("/students")
    public ResponseEntity<List<StudentSummaryResponse>> getStudents() {
        return ResponseEntity.ok(adminService.getStudents());
    }

    @PostMapping("/students")
    public ResponseEntity<StudentSummaryResponse> createStudent(@Valid @RequestBody StudentCreateRequest request) {
        return ResponseEntity.ok(adminService.createStudent(request));
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

    @PostMapping("/marks")
    public ResponseEntity<MarksResponse> addMarks(@Valid @RequestBody MarksRequest request) {
        return ResponseEntity.ok(adminService.addMarks(request));
    }

    @PostMapping("/attendance")
    public ResponseEntity<Void> addAttendance(@Valid @RequestBody AttendanceRequest request) {
        adminService.addOrUpdateAttendance(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/performance")
    public ResponseEntity<List<TeacherStudentPerformanceResponse>> getStudentPerformance() {
        return ResponseEntity.ok(teacherService.getStudentPerformance());
    }
}
