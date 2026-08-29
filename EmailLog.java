package com.smartcomplaint.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmailLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Direction direction; // INBOUND, OUTBOUND

    private String sender;
    private String recipient;
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String body;

    private String ticketNumber;
    private String status; // SENT, RECEIVED, FAILED

    private LocalDateTime timestamp = LocalDateTime.now();

    public enum Direction {
        INBOUND, OUTBOUND
    }
}
