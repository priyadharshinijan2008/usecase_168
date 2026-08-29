package com.smartcomplaint.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sla_rules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SlaRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private Priority priority; // LOW, MEDIUM, HIGH, CRITICAL

    private int resolutionHours; // e.g. 72, 48, 24, 4

    private int warningPercentage = 80; // Warning trigger at 80% time elapsed

    private String description;

    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}
