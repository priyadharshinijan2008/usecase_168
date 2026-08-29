package com.smartcomplaint.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientRole; // "ADMIN", "AGENT", "ALL"
    private String recipientEmail;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    private String ticketNumber;
    private String type; // NEW_TICKET, SLA_WARNING, SLA_BREACH, ESCALATION, FEEDBACK

    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
