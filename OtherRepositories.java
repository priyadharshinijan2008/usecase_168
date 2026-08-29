package com.smartcomplaint.repository;

import com.smartcomplaint.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EscalationRepository extends JpaRepository<Escalation, Long> {
    List<Escalation> findByComplaintId(Long complaintId);
}

@Repository
interface EmailLogRepository extends JpaRepository<EmailLog, Long> {
    List<EmailLog> findByTicketNumberOrderByTimestampDesc(String ticketNumber);
    List<EmailLog> findAllByOrderByTimestampDesc();
}

@Repository
interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findByComplaintId(Long complaintId);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double findAverageRating();
}

@Repository
interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByOrderByCreatedAtDesc();
    List<Notification> findByRecipientRoleOrRecipientRoleOrderByCreatedAtDesc(String role, String all);
}

@Repository
interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByTicketNumberOrderByTimestampAsc(String ticketNumber);
    List<AuditLog> findAllByOrderByTimestampDesc();
}
