package com.student.analytics.repository;

import com.student.analytics.entity.Marks;
import com.student.analytics.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findByStudent(Student student);
    List<Marks> findByStudentId(Long studentId);
    long countByStudentId(Long studentId);
    long countBySubjectId(Long subjectId);
}
