package com.smartcomplaint.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints", indexes = {
    @Index(name = "idx_ticket_number", columnList = "ticketNumber"),
    @Index(name = "idx_customer_email", columnList = "customerEmail"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_priority", columnList = "priority"),
    @Index(name = "idx_created_at", columnList = "createdAt"),
    @Index(name = "idx_sla_deadline", columnList = "slaDeadline")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ticketNumber; // e.g. CMP-2026-000001

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerEmail;

    private String customerPhone;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlaRule.Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.NEW;

    @Enumerated(EnumType.STRING)
    private Sentiment predictedSentiment;

    private String predictedCategory;
    private String predictedPriority;
    private String predictedDepartment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private LocalDateTime slaDeadline;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private LocalDateTime lastCommunicationAt;

    private boolean slaBreached = false;
    private boolean escalated = false;
    private String escalationReason;

    private String attachmentName;
    private String attachmentUrl;

    @Column(columnDefinition = "TEXT")
    private String resolutionSummary;

    public enum Status {
        NEW, ASSIGNED, IN_PROGRESS, WAITING_FOR_CUSTOMER, RESOLVED, CLOSED
    }

    public enum Category {
        PAYMENT, BILLING, TECHNICAL, SERVICE_QUALITY, DELIVERY_LOGISTICS, ACCOUNT_ACCESS, OTHER
    }

    public enum Sentiment {
        POSITIVE, NEUTRAL, NEGATIVE
    }
}
