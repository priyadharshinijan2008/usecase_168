package com.smartcomplaint.controller;

import com.smartcomplaint.dto.Dtos.*;
import com.smartcomplaint.entity.*;
import com.smartcomplaint.repository.*;
import com.smartcomplaint.service.DashboardService;
import com.smartcomplaint.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class OtherControllers {

    @Autowired private DashboardService dashboardService;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private SlaRuleRepository slaRuleRepository;
    @Autowired private EmailLogRepository emailLogRepository;
    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;

    // --- Dashboard ---
    @GetMapping("/dashboard/statistics")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    // --- Departments ---
    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @PostMapping("/departments")
    public ResponseEntity<Department> createDepartment(@RequestBody Department dept) {
        return ResponseEntity.ok(departmentRepository.save(dept));
    }

    // --- Agents ---
    @GetMapping("/agents")
    public ResponseEntity<List<User>> getAgents() {
        return ResponseEntity.ok(userRepository.findByRole(User.Role.AGENT));
    }

    // --- SLA Rules ---
    @GetMapping("/sla/rules")
    public ResponseEntity<List<SlaRule>> getSlaRules() {
        return ResponseEntity.ok(slaRuleRepository.findAll());
    }

    @PutMapping("/sla/rules/{id}")
    public ResponseEntity<SlaRule> updateSlaRule(@PathVariable Long id, @RequestBody SlaRule rule) {
        rule.setId(id);
        return ResponseEntity.ok(slaRuleRepository.save(rule));
    }

    // --- Emails ---
    @GetMapping("/emails")
    public ResponseEntity<List<EmailLog>> getEmailLogs() {
        return ResponseEntity.ok(emailLogRepository.findAllByOrderByTimestampDesc());
    }

    @PostMapping("/emails/send")
    public ResponseEntity<EmailLog> sendEmail(@RequestParam String recipient, @RequestParam String subject, @RequestParam String body, @RequestParam(required = false) String ticketNumber) {
        EmailLog log = emailService.logOutgoingEmail(recipient, subject, body, ticketNumber);
        return ResponseEntity.ok(log);
    }

    // --- Feedback ---
    @PostMapping("/feedback")
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackRequest req) {
        Complaint complaint = complaintRepository.findByTicketNumber(req.getTicketNumber()).orElse(null);
        if (complaint == null) return ResponseEntity.badRequest().body("Invalid ticket number");

        Feedback fb = Feedback.builder()
                .complaint(complaint)
                .rating(req.getRating())
                .comments(req.getComments())
                .customerName(complaint.getCustomerName())
                .customerEmail(complaint.getCustomerEmail())
                .build();

        Feedback saved = feedbackRepository.save(fb);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackRepository.findAll());
    }
}
