package com.student.analytics.repository;

import com.student.analytics.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    boolean existsByName(String name);
    Optional<Subject> findByName(String name);
}
