package com.student.analytics.entity;

import com.student.analytics.entity.enums.ExamType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "marks")
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false)
    private Double marks;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamType examType;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false)
    private LocalDate date;
}
