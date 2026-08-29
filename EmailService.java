package com.smartcomplaint.service;

import com.smartcomplaint.entity.EmailLog;
import com.smartcomplaint.repository.EmailLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EmailService {

    @Autowired
    private EmailLogRepository emailLogRepository;

    private static final Pattern TICKET_PATTERN = Pattern.compile("CMP-\\d{4}-\\d{6}", Pattern.CASE_INSENSITIVE);

    public String extractTicketNumber(String subject, String body) {
        if (subject != null) {
            Matcher matcher = TICKET_PATTERN.matcher(subject);
            if (matcher.find()) {
                return matcher.group().toUpperCase();
            }
        }
        if (body != null) {
            Matcher matcher = TICKET_PATTERN.matcher(body);
            if (matcher.find()) {
                return matcher.group().toUpperCase();
            }
        }
        return null;
    }

    public EmailLog logOutgoingEmail(String recipient, String subject, String body, String ticketNumber) {
        EmailLog log = EmailLog.builder()
                .direction(EmailLog.Direction.OUTBOUND)
                .sender("support@company.com")
                .recipient(recipient)
                .subject(subject)
                .body(body)
                .ticketNumber(ticketNumber)
                .status("SENT")
                .timestamp(LocalDateTime.now())
                .build();
        return emailLogRepository.save(log);
    }

    public EmailLog logInboundEmail(String sender, String subject, String body, String ticketNumber) {
        EmailLog log = EmailLog.builder()
                .direction(EmailLog.Direction.INBOUND)
                .sender(sender)
                .recipient("support@company.com")
                .subject(subject)
                .body(body)
                .ticketNumber(ticketNumber)
                .status("RECEIVED")
                .timestamp(LocalDateTime.now())
                .build();
        return emailLogRepository.save(log);
    }

    public String populateTemplate(String templateText, Map<String, String> variables) {
        String result = templateText;
        if (variables != null) {
            for (Map.Entry<String, String> entry : variables.entrySet()) {
                result = result.replace("{{" + entry.getKey() + "}}", entry.getValue() != null ? entry.getValue() : "");
            }
        }
        return result;
    }

    public String getAcknowledgementTemplate() {
        return "Dear {{customerName}},\n\n" +
               "Thank you for contacting customer support. We have received your complaint regarding '{{complaintSubject}}'.\n\n" +
               "Ticket Number: {{ticketNumber}}\n" +
               "Status: NEW\n" +
               "SLA Resolution Target: {{slaTarget}}\n\n" +
               "Our team is currently reviewing your issue and will get back to you shortly.\n\n" +
               "Best regards,\n" +
               "Smart Support Team";
    }

    public String getResolutionTemplate() {
        return "Dear {{customerName}},\n\n" +
               "We are pleased to inform you that your complaint (Ticket Number: {{ticketNumber}}) has been RESOLVED.\n\n" +
               "Resolution Details:\n" +
               "{{resolution}}\n\n" +
               "Resolved by: {{agentName}}\n\n" +
               "We value your experience! Please rate our service and provide feedback using the link below:\n" +
               "{{feedbackLink}}\n\n" +
               "Thank you for your patience.\n\n" +
               "Best regards,\n" +
               "Smart Support Team";
    }
}
