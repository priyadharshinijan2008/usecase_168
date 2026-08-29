package com.smartcomplaint.service;

import com.smartcomplaint.entity.Complaint;
import com.smartcomplaint.entity.SlaRule;
import com.smartcomplaint.repository.SlaRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Duration;

@Service
public class SlaService {

    @Autowired
    private SlaRuleRepository slaRuleRepository;

    public LocalDateTime calculateSlaDeadline(SlaRule.Priority priority, LocalDateTime createdAt) {
        int hours = 48; // Default fallback
        if (priority != null) {
            SlaRule rule = slaRuleRepository.findByPriority(priority).orElse(null);
            if (rule != null) {
                hours = rule.getResolutionHours();
            } else {
                switch (priority) {
                    case LOW -> hours = 72;
                    case MEDIUM -> hours = 48;
                    case HIGH -> hours = 24;
                    case CRITICAL -> hours = 4;
                }
            }
        }
        return createdAt.plusHours(hours);
    }

    public long getRemainingMinutes(LocalDateTime slaDeadline) {
        if (slaDeadline == null) return 0;
        return Duration.between(LocalDateTime.now(), slaDeadline).toMinutes();
    }

    public boolean isApproachingWarning(Complaint complaint) {
        if (complaint.getSlaDeadline() == null || complaint.getCreatedAt() == null) return false;
        long totalMinutes = Duration.between(complaint.getCreatedAt(), complaint.getSlaDeadline()).toMinutes();
        long elapsedMinutes = Duration.between(complaint.getCreatedAt(), LocalDateTime.now()).toMinutes();
        if (totalMinutes <= 0) return true;
        double elapsedPercentage = ((double) elapsedMinutes / totalMinutes) * 100.0;
        return elapsedPercentage >= 80.0 && elapsedPercentage < 100.0;
    }

    public boolean isBreached(Complaint complaint) {
        if (complaint.getSlaDeadline() == null) return false;
        return LocalDateTime.now().isAfter(complaint.getSlaDeadline());
    }
}
