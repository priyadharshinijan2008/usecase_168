package com.smartcomplaint.service;

import com.smartcomplaint.dto.Dtos.AiPredictionDto;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AiClassificationService {

    public AiPredictionDto predictComplaint(String subject, String description) {
        String text = (subject + " " + description).toLowerCase(Locale.ROOT);

        String category = "OTHER";
        String priority = "MEDIUM";
        String sentiment = "NEUTRAL";
        String recommendedDepartment = "Customer Care";

        // Sentiment Prediction
        if (text.contains("furious") || text.contains("terrible") || text.contains("scam") 
            || text.contains("horrible") || text.contains("unacceptable") || text.contains("money deducted")
            || text.contains("legal action") || text.contains("immediately")) {
            sentiment = "NEGATIVE";
        } else if (text.contains("thank") || text.contains("appreciate") || text.contains("helpful")) {
            sentiment = "POSITIVE";
        } else {
            sentiment = "NEUTRAL";
        }

        // Category & Department Prediction
        if (text.contains("payment") || text.contains("deducted") || text.contains("charged") || text.contains("refund") || text.contains("transaction")) {
            category = "PAYMENT";
            recommendedDepartment = "Finance";
            priority = "HIGH";
        } else if (text.contains("invoice") || text.contains("billing") || text.contains("receipt") || text.contains("charge")) {
            category = "BILLING";
            recommendedDepartment = "Billing";
            priority = "MEDIUM";
        } else if (text.contains("error") || text.contains("bug") || text.contains("crash") || text.contains("login") || text.contains("access") || text.contains("server")) {
            category = "TECHNICAL";
            recommendedDepartment = "Technical Support";
            priority = text.contains("down") || text.contains("cannot login") ? "HIGH" : "MEDIUM";
        } else if (text.contains("shipping") || text.contains("delivery") || text.contains("package") || text.contains("tracking") || text.contains("delay")) {
            category = "DELIVERY_LOGISTICS";
            recommendedDepartment = "Logistics";
            priority = "MEDIUM";
        } else if (text.contains("rude") || text.contains("behavior") || text.contains("service quality") || text.contains("staff")) {
            category = "SERVICE_QUALITY";
            recommendedDepartment = "Customer Care";
            priority = "HIGH";
        }

        // Priority Escalation Rules
        if (text.contains("urgent") || text.contains("critical") || text.contains("fraud") || text.contains("system down") || text.contains("lawsuit")) {
            priority = "CRITICAL";
        }

        return AiPredictionDto.builder()
                .category(category)
                .priority(priority)
                .sentiment(sentiment)
                .recommendedDepartment(recommendedDepartment)
                .confidenceScore(0.92)
                .build();
    }
}
