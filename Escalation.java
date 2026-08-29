package com.smartcomplaint.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "escalations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Escalation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    private String escalatedBy; // "SLA_MONITOR" or User FullName
    private String escalationReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_supervisor_id")
    private User assignedSupervisor;

    private String status = "PENDING"; // PENDING, REVIEWED, RESOLVED

    private LocalDateTime createdAt = LocalDateTime.now();
}
