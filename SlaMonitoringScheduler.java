package com.smartcomplaint.scheduler;

import com.smartcomplaint.entity.*;
import com.smartcomplaint.repository.*;
import com.smartcomplaint.service.SlaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SlaMonitoringScheduler {

    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private EscalationRepository escalationRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private SlaService slaService;

    @Scheduled(fixedRate = 60000) // Run every 60 seconds
    public void monitorSlaAndEscalate() {
        List<Complaint> openComplaints = complaintRepository.findOpenTicketsForSlaMonitoring();

        for (Complaint complaint : openComplaints) {
            LocalDateTime now = LocalDateTime.now();

            // 1. SLA Breach Check
            if (slaService.isBreached(complaint)) {
                complaint.setSlaBreached(true);
                complaint.setEscalated(true);
                complaint.setEscalationReason("SLA BREACHED: Ticket exceeded deadline of " + complaint.getSlaDeadline());
                complaintRepository.save(complaint);

                // Log Escalation
                Escalation escalation = Escalation.builder()
                        .complaint(complaint)
                        .escalatedBy("SLA_AUTOMATED_SCHEDULER")
                        .escalationReason("Resolution deadline breached.")
                        .status("PENDING")
                        .createdAt(now)
                        .build();
                escalationRepository.save(escalation);

                // Create Breach Notification
                Notification notif = Notification.builder()
                        .recipientRole("SUPERVISOR")
                        .recipientEmail(complaint.getAssignedAgent() != null ? complaint.getAssignedAgent().getEmail() : null)
                        .title("🚨 SLA BREACH ALERT: Ticket " + complaint.getTicketNumber())
                        .message("Ticket " + complaint.getTicketNumber() + " has breached SLA deadline!")
                        .ticketNumber(complaint.getTicketNumber())
                        .type("SLA_BREACH")
                        .createdAt(now)
                        .build();
                notificationRepository.save(notif);

                // Audit Log
                AuditLog audit = AuditLog.builder()
                        .ticketNumber(complaint.getTicketNumber())
                        .performedBy("SYSTEM_SLA_ENGINE")
                        .action("SLA_BREACH_ESCALATED")
                        .previousValue(complaint.getStatus().name())
                        .newValue("ESCALATED")
                        .notes("Automated SLA breach escalation trigger")
                        .timestamp(now)
                        .build();
                auditLogRepository.save(audit);

            } else if (slaService.isApproachingWarning(complaint)) {
                // 2. 80% SLA Warning Alert
                Notification warning = Notification.builder()
                        .recipientRole("AGENT")
                        .recipientEmail(complaint.getAssignedAgent() != null ? complaint.getAssignedAgent().getEmail() : null)
                        .title("⚠️ SLA Warning (80% Elapsed): " + complaint.getTicketNumber())
                        .message("Ticket " + complaint.getTicketNumber() + " is approaching its SLA deadline.")
                        .ticketNumber(complaint.getTicketNumber())
                        .type("SLA_WARNING")
                        .createdAt(now)
                        .build();
                notificationRepository.save(warning);
            }
        }
    }
}
