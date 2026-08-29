package com.smartcomplaint.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ComplaintMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType messageType; // CUSTOMER_EMAIL, AGENT_RESPONSE, INTERNAL_NOTE, SYSTEM_EVENT, RESOLUTION_NOTE

    private String senderName;
    private String senderEmail;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String messageBody;

    private String attachmentName;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum MessageType {
        CUSTOMER_EMAIL, AGENT_RESPONSE, INTERNAL_NOTE, SYSTEM_EVENT, RESOLUTION_NOTE
    }
}
