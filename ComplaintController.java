package com.smartcomplaint.controller;

import com.smartcomplaint.dto.Dtos.*;
import com.smartcomplaint.entity.*;
import com.smartcomplaint.repository.*;
import com.smartcomplaint.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired private ComplaintService complaintService;
    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private ComplaintMessageRepository complaintMessageRepository;
    @Autowired private AuditLogRepository auditLogRepository;

    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(@RequestBody ComplaintRequest request) {
        Complaint complaint = complaintService.createComplaint(request);
        return ResponseEntity.ok(complaintService.mapToResponse(complaint));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long agentId,
            @RequestParam(required = false) String search) {

        List<Complaint> list = complaintRepository.findAll();

        if (status != null && !status.isEmpty()) {
            list = list.stream().filter(c -> c.getStatus().name().equalsIgnoreCase(status)).collect(Collectors.toList());
        }
        if (priority != null && !priority.isEmpty()) {
            list = list.stream().filter(c -> c.getPriority().name().equalsIgnoreCase(priority)).collect(Collectors.toList());
        }
        if (departmentId != null) {
            list = list.stream().filter(c -> c.getDepartment() != null && c.getDepartment().getId().equals(departmentId)).collect(Collectors.toList());
        }
        if (agentId != null) {
            list = list.stream().filter(c -> c.getAssignedAgent() != null && c.getAssignedAgent().getId().equals(agentId)).collect(Collectors.toList());
        }
        if (search != null && !search.isEmpty()) {
            String q = search.toLowerCase();
            list = list.stream().filter(c ->
                c.getTicketNumber().toLowerCase().contains(q) ||
                c.getCustomerName().toLowerCase().contains(q) ||
                c.getCustomerEmail().toLowerCase().contains(q) ||
                c.getSubject().toLowerCase().contains(q)
            ).collect(Collectors.toList());
        }

        list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        List<ComplaintResponse> response = list.stream()
                .map(complaintService::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable Long id) {
        Complaint complaint = complaintRepository.findById(id).orElse(null);
        if (complaint == null) return ResponseEntity.notFound().build();

        List<ComplaintMessage> messages = complaintMessageRepository.findByComplaintIdOrderByCreatedAtAsc(id);
        List<AuditLog> auditLogs = auditLogRepository.findByTicketNumberOrderByTimestampAsc(complaint.getTicketNumber());

        Map<String, Object> body = new HashMap<>();
        body.put("ticket", complaintService.mapToResponse(complaint));
        body.put("messages", messages);
        body.put("auditTimeline", auditLogs);

        return ResponseEntity.ok(body);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(defaultValue = "Admin") String performedBy,
            @RequestParam(required = false) String notes) {
        Complaint updated = complaintService.updateStatus(id, Complaint.Status.valueOf(status), performedBy, notes);
        return ResponseEntity.ok(complaintService.mapToResponse(updated));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<ComplaintResponse> assignAgent(
            @PathVariable Long id,
            @RequestParam Long agentId,
            @RequestParam(defaultValue = "Admin") String performedBy) {
        Complaint updated = complaintService.assignAgent(id, agentId, performedBy);
        return ResponseEntity.ok(complaintService.mapToResponse(updated));
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<?> sendReply(
            @PathVariable Long id,
            @RequestBody EmailReplyRequest replyRequest,
            @RequestParam(defaultValue = "Agent") String senderName,
            @RequestParam(defaultValue = "support@company.com") String senderEmail) {
        ComplaintMessage msg = complaintService.addReply(id, replyRequest, senderName, senderEmail);
        return ResponseEntity.ok(msg);
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ComplaintResponse> resolveAndNotify(
            @PathVariable Long id,
            @RequestBody ResolutionRequest request,
            @RequestParam(defaultValue = "Support Agent") String agentName) {
        Complaint complaint = complaintService.resolveAndNotify(id, request.getResolutionSummary(), agentName);
        return ResponseEntity.ok(complaintService.mapToResponse(complaint));
    }

    @PostMapping("/simulate-inbound-email")
    public ResponseEntity<ComplaintResponse> simulateInboundEmail(
            @RequestParam String senderEmail,
            @RequestParam String subject,
            @RequestParam String body) {
        Complaint complaint = complaintService.handleInboundEmail(senderEmail, subject, body);
        return ResponseEntity.ok(complaintService.mapToResponse(complaint));
    }
}
