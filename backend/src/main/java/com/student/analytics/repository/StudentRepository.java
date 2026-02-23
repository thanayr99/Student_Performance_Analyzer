package com.student.analytics.repository;

import com.student.analytics.entity.Student;
import com.student.analytics.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
}
