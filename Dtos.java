package com.smartcomplaint.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class Dtos {

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class AuthRequest {
        private String email;
        private String password;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AuthResponse {
        private String token;
        private String email;
        private String fullName;
        private String role;
        private Long departmentId;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ComplaintRequest {
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private String subject;
        private String description;
        private String category;
        private String priority;
        private Long departmentId;
        private String attachmentName;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ComplaintResponse {
        private Long id;
        private String ticketNumber;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private String subject;
        private String description;
        private String category;
        private String priority;
        private String status;
        private String departmentName;
        private Long departmentId;
        private String assignedAgentName;
        private Long assignedAgentId;
        private String createdAt;
        private String updatedAt;
        private String slaDeadline;
        private Long slaRemainingMinutes;
        private boolean slaBreached;
        private boolean escalated;
        private String escalationReason;
        private String predictedSentiment;
        private String predictedCategory;
        private String predictedPriority;
        private String predictedDepartment;
        private String resolutionSummary;
        private String attachmentName;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ResolutionRequest {
        private String resolutionSummary;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class EmailReplyRequest {
        private String recipientEmail;
        private String subject;
        private String message;
        private boolean isInternalNote;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class FeedbackRequest {
        private String ticketNumber;
        private int rating;
        private String comments;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AiPredictionDto {
        private String category;
        private String priority;
        private String sentiment;
        private String recommendedDepartment;
        private double confidenceScore;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DashboardStatsDto {
        private long totalComplaints;
        private long newComplaints;
        private long openComplaints;
        private long inProgressComplaints;
        private long resolvedComplaints;
        private long closedComplaints;
        private long overdueSlaBreached;
        private long escalatedComplaints;
        private double averageResolutionTimeHours;
        private double customerSatisfactionScore;
    }
}
