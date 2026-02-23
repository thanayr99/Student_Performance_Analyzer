package com.student.analytics.repository;

import com.student.analytics.entity.Attendance;
import com.student.analytics.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByStudent(Student student);
}
