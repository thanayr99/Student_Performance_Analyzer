package com.student.analytics.repository;

import com.student.analytics.entity.PerformanceAnalytics;
import com.student.analytics.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerformanceAnalyticsRepository extends JpaRepository<PerformanceAnalytics, Long> {
    Optional<PerformanceAnalytics> findByStudent(Student student);
}
