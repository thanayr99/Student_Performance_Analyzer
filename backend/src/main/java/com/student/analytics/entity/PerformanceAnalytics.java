package com.student.analytics.entity;

import com.student.analytics.entity.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "performance_analytics")
public class PerformanceAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @Column(nullable = false)
    private Double gpa;

    @Column(nullable = false)
    private Double predictedScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel riskLevel;

    @Column(nullable = false)
    private Double improvementIndex;
}
