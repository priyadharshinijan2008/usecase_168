package com.smartcomplaint.service;

import com.smartcomplaint.dto.Dtos.*;
import com.smartcomplaint.entity.*;
import com.smartcomplaint.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ComplaintMessageRepository complaintMessageRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private SlaService slaService;
    @Autowired private EmailService emailService;
    @Autowired private AiClassificationService aiClassificationService;

    private static final AtomicLong TICKET_SEQUENCE = new AtomicLong(100);

    public synchronized String generateTicketNumber() {
        long seq = TICKET_SEQUENCE.incrementAndGet();
        int year = LocalDateTime.now().getYear();
        return String.format("CMP-%d-%06d", year, seq);
    }

    @Transactional
    public Complaint createComplaint(ComplaintRequest request) {
        String ticketNumber = generateTicketNumber();

        // AI Predictions
        AiPredictionDto ai = aiClassificationService.predictComplaint(request.getSubject(), request.getDescription());

        // Category & Priority
        Complaint.Category category = Complaint.Category.OTHER;
        if (request.getCategory() != null) {
            try { category = Complaint.Category.valueOf(request.getCategory().toUpperCase()); } catch (Exception ignored) {}
        } else {
            try { category = Complaint.Category.valueOf(ai.getCategory()); } catch (Exception ignored) {}
        }

        SlaRule.Priority priority = SlaRule.Priority.MEDIUM;
        if (request.getPriority() != null) {
            try { priority = SlaRule.Priority.valueOf(request.getPriority().toUpperCase()); } catch (Exception ignored) {}
        } else {
            try { priority = SlaRule.Priority.valueOf(ai.getPriority()); } catch (Exception ignored) {}
        }

        // Department Assignment
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }
        if (department == null) {
            department = departmentRepository.findByName(ai.getRecommendedDepartment()).orElse(null);
        }
        if (department == null) {
            List<Department> deps = departmentRepository.findAll();
            if (!deps.isEmpty()) department = deps.get(0);
        }

        // Auto Agent Assignment based on Workload
        User assignedAgent = autoAssignAgent(department);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime slaDeadline = slaService.calculateSlaDeadline(priority, now);

        Complaint complaint = Complaint.builder()
                .ticketNumber(ticketNumber)
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .subject(request.getSubject())
                .description(request.getDescription())
                .category(category)
                .priority(priority)
                .status(assignedAgent != null ? Complaint.Status.ASSIGNED : Complaint.Status.NEW)
                .department(department)
                .assignedAgent(assignedAgent)
                .createdAt(now)
                .updatedAt(now)
                .lastCommunicationAt(now)
                .slaDeadline(slaDeadline)
                .predictedSentiment(Complaint.Sentiment.valueOf(ai.getSentiment()))
                .predictedCategory(ai.getCategory())
                .predictedPriority(ai.getPriority())
                .predictedDepartment(ai.getRecommendedDepartment())
                .attachmentName(request.getAttachmentName())
                .build();

        complaint = complaintRepository.save(complaint);

        // Initial Message Timeline
        ComplaintMessage message = ComplaintMessage.builder()
                .complaint(complaint)
                .messageType(ComplaintMessage.MessageType.CUSTOMER_EMAIL)
                .senderName(request.getCustomerName())
                .senderEmail(request.getCustomerEmail())
                .messageBody(request.getDescription())
                .attachmentName(request.getAttachmentName())
                .createdAt(now)
                .build();
        complaintMessageRepository.save(message);

        // Audit Log
        AuditLog audit = AuditLog.builder()
                .ticketNumber(ticketNumber)
                .performedBy(request.getCustomerName())
                .action("CREATED")
                .previousValue("NONE")
                .newValue(complaint.getStatus().name())
                .notes("Complaint registered via Web")
                .timestamp(now)
                .build();
        auditLogRepository.save(audit);

        // Acknowledgement Email Log
        Map<String, String> emailVars = new HashMap<>();
        emailVars.put("customerName", request.getCustomerName());
        emailVars.put("complaintSubject", request.getSubject());
        emailVars.put("ticketNumber", ticketNumber);
        emailVars.put("slaTarget", slaDeadline.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        String ackBody = emailService.populateTemplate(emailService.getAcknowledgementTemplate(), emailVars);
        emailService.logOutgoingEmail(request.getCustomerEmail(), "Acknowledgement: " + request.getSubject() + " [" + ticketNumber + "]", ackBody, ticketNumber);

        // Notification
        Notification notif = Notification.builder()
                .recipientRole("ADMIN")
                .recipientEmail(assignedAgent != null ? assignedAgent.getEmail() : null)
                .title("New Complaint Created: " + ticketNumber)
                .message("Complaint registered for " + request.getCustomerName() + " (" + priority + " priority).")
                .ticketNumber(ticketNumber)
                .type("NEW_TICKET")
                .createdAt(now)
                .build();
        notificationRepository.save(notif);

        return complaint;
    }

    private User autoAssignAgent(Department department) {
        if (department == null) return null;
        List<User> availableAgents = userRepository.findByDepartmentAndAvailableTrue(department);
        if (availableAgents.isEmpty()) {
            availableAgents = userRepository.findByRole(User.Role.AGENT);
        }
        if (availableAgents.isEmpty()) return null;

        List<Object[]> workload = complaintRepository.findActiveWorkloadPerAgent();
        Map<Long, Long> workloadMap = new HashMap<>();
        for (Object[] row : workload) {
            workloadMap.put((Long) row[0], (Long) row[1]);
        }

        User leastBusyAgent = availableAgents.get(0);
        long minCount = workloadMap.getOrDefault(leastBusyAgent.getId(), 0L);

        for (User agent : availableAgents) {
            long count = workloadMap.getOrDefault(agent.getId(), 0L);
            if (count < minCount) {
                minCount = count;
                leastBusyAgent = agent;
            }
        }
        return leastBusyAgent;
    }

    @Transactional
    public Complaint updateStatus(Long complaintId, Complaint.Status newStatus, String performedBy, String notes) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(() -> new RuntimeException("Complaint not found"));
        Complaint.Status prevStatus = complaint.getStatus();
        complaint.setStatus(newStatus);
        complaint.setUpdatedAt(LocalDateTime.now());

        if (newStatus == Complaint.Status.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        } else if (newStatus == Complaint.Status.CLOSED) {
            complaint.setClosedAt(LocalDateTime.now());
        }

        complaint = complaintRepository.save(complaint);

        AuditLog audit = AuditLog.builder()
                .ticketNumber(complaint.getTicketNumber())
                .performedBy(performedBy)
                .action("STATUS_CHANGE")
                .previousValue(prevStatus.name())
                .newValue(newStatus.name())
                .notes(notes)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(audit);

        return complaint;
    }

    @Transactional
    public Complaint assignAgent(Long complaintId, Long agentId, String performedBy) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(() -> new RuntimeException("Complaint not found"));
        User agent = userRepository.findById(agentId).orElseThrow(() -> new RuntimeException("Agent not found"));

        String prevAgent = complaint.getAssignedAgent() != null ? complaint.getAssignedAgent().getFullName() : "Unassigned";
        complaint.setAssignedAgent(agent);
        if (complaint.getStatus() == Complaint.Status.NEW) {
            complaint.setStatus(Complaint.Status.ASSIGNED);
        }
        complaint.setUpdatedAt(LocalDateTime.now());

        complaint = complaintRepository.save(complaint);

        AuditLog audit = AuditLog.builder()
                .ticketNumber(complaint.getTicketNumber())
                .performedBy(performedBy)
                .action("AGENT_ASSIGNMENT")
                .previousValue(prevAgent)
                .newValue(agent.getFullName())
                .notes("Reassigned agent")
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(audit);

        return complaint;
    }

    @Transactional
    public ComplaintMessage addReply(Long complaintId, EmailReplyRequest replyRequest, String senderName, String senderEmail) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(() -> new RuntimeException("Complaint not found"));

        ComplaintMessage.MessageType msgType = replyRequest.isInternalNote() ?
                ComplaintMessage.MessageType.INTERNAL_NOTE : ComplaintMessage.MessageType.AGENT_RESPONSE;

        ComplaintMessage msg = ComplaintMessage.builder()
                .complaint(complaint)
                .messageType(msgType)
                .senderName(senderName)
                .senderEmail(senderEmail)
                .messageBody(replyRequest.getMessage())
                .createdAt(LocalDateTime.now())
                .build();
        complaintMessageRepository.save(msg);

        complaint.setLastCommunicationAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());
        if (!replyRequest.isInternalNote() && complaint.getStatus() == Complaint.Status.ASSIGNED) {
            complaint.setStatus(Complaint.Status.IN_PROGRESS);
        }
        complaintRepository.save(complaint);

        if (!replyRequest.isInternalNote()) {
            emailService.logOutgoingEmail(replyRequest.getRecipientEmail(), replyRequest.getSubject(), replyRequest.getMessage(), complaint.getTicketNumber());
        }

        return msg;
    }

    @Transactional
    public Complaint resolveAndNotify(Long complaintId, String resolutionSummary, String agentName) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(Complaint.Status.RESOLVED);
        complaint.setResolutionSummary(resolutionSummary);
        complaint.setResolvedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());
        complaint = complaintRepository.save(complaint);

        // Resolution Timeline Message
        ComplaintMessage msg = ComplaintMessage.builder()
                .complaint(complaint)
                .messageType(ComplaintMessage.MessageType.RESOLUTION_NOTE)
                .senderName(agentName)
                .senderEmail(complaint.getAssignedAgent() != null ? complaint.getAssignedAgent().getEmail() : "support@company.com")
                .messageBody("RESOLUTION SUMMARY:\n" + resolutionSummary)
                .createdAt(LocalDateTime.now())
                .build();
        complaintMessageRepository.save(msg);

        // Dispatch Resolution Email
        Map<String, String> vars = new HashMap<>();
        vars.put("customerName", complaint.getCustomerName());
        vars.put("ticketNumber", complaint.getTicketNumber());
        vars.put("resolution", resolutionSummary);
        vars.put("agentName", agentName);
        vars.put("feedbackLink", "http://localhost:8080/#/feedback?ticket=" + complaint.getTicketNumber());
        String resBody = emailService.populateTemplate(emailService.getResolutionTemplate(), vars);

        emailService.logOutgoingEmail(complaint.getCustomerEmail(), "Resolved: " + complaint.getSubject() + " [" + complaint.getTicketNumber() + "]", resBody, complaint.getTicketNumber());

        AuditLog audit = AuditLog.builder()
                .ticketNumber(complaint.getTicketNumber())
                .performedBy(agentName)
                .action("RESOLVED")
                .previousValue("IN_PROGRESS")
                .newValue("RESOLVED")
                .notes(resolutionSummary)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(audit);

        return complaint;
    }

    @Transactional
    public Complaint handleInboundEmail(String senderEmail, String subject, String body) {
        String ticketNum = emailService.extractTicketNumber(subject, body);
        emailService.logInboundEmail(senderEmail, subject, body, ticketNum);

        if (ticketNum != null) {
            Optional<Complaint> existingOpt = complaintRepository.findByTicketNumber(ticketNum);
            if (existingOpt.isPresent()) {
                Complaint existing = existingOpt.get();
                ComplaintMessage msg = ComplaintMessage.builder()
                        .complaint(existing)
                        .messageType(ComplaintMessage.MessageType.CUSTOMER_EMAIL)
                        .senderName(senderEmail)
                        .senderEmail(senderEmail)
                        .messageBody(body)
                        .createdAt(LocalDateTime.now())
                        .build();
                complaintMessageRepository.save(msg);

                existing.setLastCommunicationAt(LocalDateTime.now());
                if (existing.getStatus() == Complaint.Status.WAITING_FOR_CUSTOMER) {
                    existing.setStatus(Complaint.Status.IN_PROGRESS);
                }
                existing.setUpdatedAt(LocalDateTime.now());
                return complaintRepository.save(existing);
            }
        }

        // Create new complaint if no ticket exists
        ComplaintRequest req = new ComplaintRequest();
        req.setCustomerEmail(senderEmail);
        req.setCustomerName(senderEmail.split("@")[0]);
        req.setSubject(subject);
        req.setDescription(body);
        return createComplaint(req);
    }

    public ComplaintResponse mapToResponse(Complaint c) {
        return ComplaintResponse.builder()
                .id(c.getId())
                .ticketNumber(c.getTicketNumber())
                .customerName(c.getCustomerName())
                .customerEmail(c.getCustomerEmail())
                .customerPhone(c.getCustomerPhone())
                .subject(c.getSubject())
                .description(c.getDescription())
                .category(c.getCategory().name())
                .priority(c.getPriority().name())
                .status(c.getStatus().name())
                .departmentName(c.getDepartment() != null ? c.getDepartment().getName() : "General")
                .departmentId(c.getDepartment() != null ? c.getDepartment().getId() : null)
                .assignedAgentName(c.getAssignedAgent() != null ? c.getAssignedAgent().getFullName() : "Unassigned")
                .assignedAgentId(c.getAssignedAgent() != null ? c.getAssignedAgent().getId() : null)
                .createdAt(c.getCreatedAt() != null ? c.getCreatedAt().toString() : "")
                .updatedAt(c.getUpdatedAt() != null ? c.getUpdatedAt().toString() : "")
                .slaDeadline(c.getSlaDeadline() != null ? c.getSlaDeadline().toString() : "")
                .slaRemainingMinutes(slaService.getRemainingMinutes(c.getSlaDeadline()))
                .slaBreached(c.isSlaBreached() || slaService.isBreached(c))
                .escalated(c.isEscalated())
                .escalationReason(c.getEscalationReason())
                .predictedSentiment(c.getPredictedSentiment() != null ? c.getPredictedSentiment().name() : "NEUTRAL")
                .predictedCategory(c.getPredictedCategory())
                .predictedPriority(c.getPredictedPriority())
                .predictedDepartment(c.getPredictedDepartment())
                .resolutionSummary(c.getResolutionSummary())
                .attachmentName(c.getAttachmentName())
                .build();
    }
}
