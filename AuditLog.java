package com.smartcomplaint.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ticketNumber;
    private String performedBy;
    private String action; // STATUS_CHANGE, AGENT_ASSIGNMENT, REPLIED, ESCALATED, RESOLVED

    private String previousValue;
    private String newValue;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime timestamp = LocalDateTime.now();
}
