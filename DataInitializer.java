package com.smartcomplaint.config;

import com.smartcomplaint.entity.*;
import com.smartcomplaint.repository.*;
import com.smartcomplaint.service.SlaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private SlaRuleRepository slaRuleRepository;
    @Autowired private ComplaintRepository complaintRepository;
    @Autowired private ComplaintMessageRepository complaintMessageRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private EmailLogRepository emailLogRepository;
    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private SlaService slaService;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            complaintRepository.deleteAll();
            complaintMessageRepository.deleteAll();
            emailLogRepository.deleteAll();
            feedbackRepository.deleteAll();
            auditLogRepository.deleteAll();
        }

        System.out.println("🌱 Seeding 20 realistic sample complaints into the Database...");

        // 1. Departments
        Department techDept = departmentRepository.findByName("Technical Support").orElseGet(() -> departmentRepository.save(Department.builder().name("Technical Support").description("Handles software, app bugs, system outages").headEmail("tech.head@company.com").build()));
        Department finDept = departmentRepository.findByName("Finance").orElseGet(() -> departmentRepository.save(Department.builder().name("Finance").description("Handles payment deductions, refunds, failed transactions").headEmail("fin.head@company.com").build()));
        Department billDept = departmentRepository.findByName("Billing").orElseGet(() -> departmentRepository.save(Department.builder().name("Billing").description("Handles invoices, overcharges, subscription plans").headEmail("billing.head@company.com").build()));
        Department careDept = departmentRepository.findByName("Customer Care").orElseGet(() -> departmentRepository.save(Department.builder().name("Customer Care").description("General inquiries, staff service quality").headEmail("care.head@company.com").build()));
        Department logDept = departmentRepository.findByName("Logistics").orElseGet(() -> departmentRepository.save(Department.builder().name("Logistics").description("Shipping delays, damaged packages, delivery tracking").headEmail("logistics.head@company.com").build()));

        // 2. SLA Rules
        if (slaRuleRepository.count() == 0) {
            slaRuleRepository.save(SlaRule.builder().priority(SlaRule.Priority.CRITICAL).resolutionHours(4).warningPercentage(80).description("System down, payment deducted without order, fraud alert").build());
            slaRuleRepository.save(SlaRule.builder().priority(SlaRule.Priority.HIGH).resolutionHours(24).warningPercentage(80).description("Severe bug, billing error, urgent shipping delay").build());
            slaRuleRepository.save(SlaRule.builder().priority(SlaRule.Priority.MEDIUM).resolutionHours(48).warningPercentage(80).description("Standard feature issue, invoice inquiry").build());
            slaRuleRepository.save(SlaRule.builder().priority(SlaRule.Priority.LOW).resolutionHours(72).warningPercentage(80).description("General feedback, minor cosmetic issue").build());
        }

        // 3. Users
        String encodedPass = passwordEncoder.encode("admin123");
        User admin = userRepository.findByEmail("admin@company.com").orElseGet(() -> userRepository.save(User.builder().email("admin@company.com").password(encodedPass).fullName("System Administrator").role(User.Role.ADMIN).department(techDept).build()));
        User supervisor = userRepository.findByEmail("supervisor@company.com").orElseGet(() -> userRepository.save(User.builder().email("supervisor@company.com").password(passwordEncoder.encode("super123")).fullName("Sarah Supervisor").role(User.Role.SUPERVISOR).department(finDept).build()));

        User agent1 = userRepository.findByEmail("john.tech@company.com").orElseGet(() -> userRepository.save(User.builder().email("john.tech@company.com").password(passwordEncoder.encode("agent123")).fullName("John Tech").role(User.Role.AGENT).department(techDept).available(true).build()));
        User agent2 = userRepository.findByEmail("sarah.fin@company.com").orElseGet(() -> userRepository.save(User.builder().email("sarah.fin@company.com").password(passwordEncoder.encode("agent123")).fullName("Sarah Finance").role(User.Role.AGENT).department(finDept).available(true).build()));
        User agent3 = userRepository.findByEmail("mike.billing@company.com").orElseGet(() -> userRepository.save(User.builder().email("mike.billing@company.com").password(passwordEncoder.encode("agent123")).fullName("Mike Billing").role(User.Role.AGENT).department(billDept).available(true).build()));
        User agent4 = userRepository.findByEmail("emily.care@company.com").orElseGet(() -> userRepository.save(User.builder().email("emily.care@company.com").password(passwordEncoder.encode("agent123")).fullName("Emily Care").role(User.Role.AGENT).department(careDept).available(true).build()));

        LocalDateTime now = LocalDateTime.now();

        // 4. Seed 20 Detailed Sample Complaints
        Object[][] data = {
            {"CMP-2026-000001", "Alice Smith", "alice.smith@example.com", "+1-555-0101", "Money deducted from bank account but order was cancelled", "Payment deducted $149.99 for order #8492. Order cancelled.", Complaint.Category.PAYMENT, SlaRule.Priority.CRITICAL, Complaint.Status.RESOLVED, finDept, agent2, 30, 2, true, 5, "Refund issued TXN-99482"},
            {"CMP-2026-000002", "Robert Johnson", "robert.j@example.com", "+1-555-0102", "Unable to login to mobile app after v2.4 update", "App crashes on Android 14 with Error 500 at login.", Complaint.Category.TECHNICAL, SlaRule.Priority.HIGH, Complaint.Status.IN_PROGRESS, techDept, agent1, 12, 12, false, 0, null},
            {"CMP-2026-000003", "David Miller", "david.m@example.com", "+1-555-0103", "Express shipment delayed by 5 days without tracking update", "Order #59201 delayed 5 days. Tracking frozen.", Complaint.Category.DELIVERY_LOGISTICS, SlaRule.Priority.HIGH, Complaint.Status.IN_PROGRESS, logDept, agent4, 32, -6, true, 0, null},
            {"CMP-2026-000004", "Elena Rostova", "elena.r@example.com", "+1-555-0104", "Double charge on monthly subscription invoice #INV-492", "Two identical charges of $29.99 on my credit card.", Complaint.Category.BILLING, SlaRule.Priority.MEDIUM, Complaint.Status.NEW, billDept, agent3, 2, 46, false, 0, null},
            {"CMP-2026-000005", "Michael Brown", "michael.b@example.com", "+1-555-0105", "Rude staff behavior at central service center", "Staff refused assistance for warranty claim #WC-881.", Complaint.Category.SERVICE_QUALITY, SlaRule.Priority.MEDIUM, Complaint.Status.ASSIGNED, careDept, agent4, 8, 40, false, 0, null},
            {"CMP-2026-000006", "Sophia Chen", "sophia.c@example.com", "+1-555-0106", "API rate limit exceeding under legitimate enterprise load", "429 Too Many Requests error on key /v1/checkout API.", Complaint.Category.TECHNICAL, SlaRule.Priority.CRITICAL, Complaint.Status.IN_PROGRESS, techDept, agent1, 3, 1, false, 0, null},
            {"CMP-2026-000007", "James Wilson", "james.w@example.com", "+1-555-0107", "Damaged package received for order #ORD-9912", "Box severely crushed upon arrival. Product broken.", Complaint.Category.DELIVERY_LOGISTICS, SlaRule.Priority.HIGH, Complaint.Status.RESOLVED, logDept, agent4, 24, 24, true, 4, "Replacement shipped express"},
            {"CMP-2026-000008", "Olivia Davis", "olivia.d@example.com", "+1-555-0108", "Account locked out after password reset email link expired", "Cannot access portal dashboard for account #ACC-331.", Complaint.Category.ACCOUNT_ACCESS, SlaRule.Priority.HIGH, Complaint.Status.WAITING_FOR_CUSTOMER, techDept, agent1, 14, 10, false, 0, null},
            {"CMP-2026-000009", "Daniel Taylor", "daniel.t@example.com", "+1-555-0109", "Incorrect tax calculation on Q3 corporate invoice", "Tax rate applied 18% instead of 12% tax exempt code.", Complaint.Category.BILLING, SlaRule.Priority.MEDIUM, Complaint.Status.RESOLVED, billDept, agent3, 40, 48, true, 5, "Revised invoice issued"},
            {"CMP-2026-000010", "Emma White", "emma.w@example.com", "+1-555-0110", "Unrecognized debit of $89.00 on subscription auto-renew", "Did not consent to auto-renewal of annual package.", Complaint.Category.PAYMENT, SlaRule.Priority.HIGH, Complaint.Status.IN_PROGRESS, finDept, agent2, 18, 6, false, 0, null},
            {"CMP-2026-000011", "Christopher Martin", "chris.m@example.com", "+1-555-0111", "Website checkout button unresponsive on iOS Safari browser", "Clicking pay now spins endlessly on Safari 17.2.", Complaint.Category.TECHNICAL, SlaRule.Priority.MEDIUM, Complaint.Status.ASSIGNED, techDept, agent1, 6, 42, false, 0, null},
            {"CMP-2026-000012", "Hannah Anderson", "hannah.a@example.com", "+1-555-0112", "Wrong product item delivered for order #88412", "Received blue model instead of black stainless steel.", Complaint.Category.DELIVERY_LOGISTICS, SlaRule.Priority.MEDIUM, Complaint.Status.CLOSED, logDept, agent4, 72, 72, true, 5, "Exchange completed"},
            {"CMP-2026-000013", "Matthew Thomas", "matthew.t@example.com", "+1-555-0113", "Security alert: Unexpected login from unknown IP address", "Received email notification of login from Europe location.", Complaint.Category.ACCOUNT_ACCESS, SlaRule.Priority.CRITICAL, Complaint.Status.RESOLVED, techDept, agent1, 5, 4, true, 5, "Account secured & 2FA forced"},
            {"CMP-2026-000014", "Ava Jackson", "ava.j@example.com", "+1-555-0114", "Promo code DISCOUNT20 not applying at payment gateway", "Coupon code shows invalid even though valid until Dec.", Complaint.Category.BILLING, SlaRule.Priority.LOW, Complaint.Status.NEW, billDept, agent3, 4, 68, false, 0, null},
            {"CMP-2026-000015", "Andrew Harris", "andrew.h@example.com", "+1-555-0115", "Customer support agent hung up phone call abruptly", "Agent cut call while transferring to supervisor.", Complaint.Category.SERVICE_QUALITY, SlaRule.Priority.HIGH, Complaint.Status.IN_PROGRESS, careDept, agent4, 20, 4, false, 0, null},
            {"CMP-2026-000016", "Isabella Clark", "isabella.c@example.com", "+1-555-0116", "Refund not credited back to original payment method after 14 days", "Approved refund #RF-102 not visible in bank account.", Complaint.Category.PAYMENT, SlaRule.Priority.CRITICAL, Complaint.Status.IN_PROGRESS, finDept, agent2, 10, -6, true, 0, null}, // Breached
            {"CMP-2026-000017", "Joshua Lewis", "joshua.l@example.com", "+1-555-0117", "Feature request: Dark mode toggle in user settings", "Would appreciate dark theme option for night viewing.", Complaint.Category.OTHER, SlaRule.Priority.LOW, Complaint.Status.NEW, careDept, agent4, 2, 70, false, 0, null},
            {"CMP-2026-000018", "Mia Robinson", "mia.r@example.com", "+1-555-0118", "Package marked as delivered but not received at address", "Courier left package outside without signature.", Complaint.Category.DELIVERY_LOGISTICS, SlaRule.Priority.HIGH, Complaint.Status.IN_PROGRESS, logDept, agent4, 15, 9, false, 0, null},
            {"CMP-2026-000019", "Ethan Walker", "ethan.w@example.com", "+1-555-0119", "SaaS dashboard failing to generate export PDF report", "PDF download returns 0 byte corrupt file.", Complaint.Category.TECHNICAL, SlaRule.Priority.MEDIUM, Complaint.Status.RESOLVED, techDept, agent1, 36, 48, true, 4, "PDF engine updated"},
            {"CMP-2026-000020", "Charlotte Young", "charlotte.y@example.com", "+1-555-0120", "Overcharged subscription fee due to duplicate seat count", "Billed for 10 seats instead of 5 active team members.", Complaint.Category.BILLING, SlaRule.Priority.HIGH, Complaint.Status.RESOLVED, billDept, agent3, 22, 24, true, 5, "Credit memo issued"}
        };

        for (Object[] row : data) {
            String tNum = (String) row[0];
            String name = (String) row[1];
            String email = (String) row[2];
            String phone = (String) row[3];
            String subj = (String) row[4];
            String desc = (String) row[5];
            Complaint.Category cat = (Complaint.Category) row[6];
            SlaRule.Priority prio = (SlaRule.Priority) row[7];
            Complaint.Status stat = (Complaint.Status) row[8];
            Department dept = (Department) row[9];
            User ag = (User) row[10];
            int hoursAgo = (Integer) row[11];
            int slaRem = (Integer) row[12];
            boolean isResolved = (Boolean) row[13];
            int rating = (Integer) row[14];
            String resSummary = (String) row[15];

            LocalDateTime created = now.minusHours(hoursAgo);
            LocalDateTime slaDead = created.plusHours(prio == SlaRule.Priority.CRITICAL ? 4 : prio == SlaRule.Priority.HIGH ? 24 : prio == SlaRule.Priority.MEDIUM ? 48 : 72);
            boolean breached = slaRem < 0;

            Complaint c = complaintRepository.save(Complaint.builder()
                    .ticketNumber(tNum)
                    .customerName(name)
                    .customerEmail(email)
                    .customerPhone(phone)
                    .subject(subj)
                    .description(desc)
                    .category(cat)
                    .priority(prio)
                    .status(stat)
                    .department(dept)
                    .assignedAgent(ag)
                    .createdAt(created)
                    .updatedAt(created.plusHours(1))
                    .resolvedAt(isResolved ? created.plusHours(2) : null)
                    .slaDeadline(slaDead)
                    .slaBreached(breached)
                    .escalated(breached)
                    .escalationReason(breached ? "SLA BREACHED: Deadline exceeded" : null)
                    .predictedSentiment(prio == SlaRule.Priority.CRITICAL ? Complaint.Sentiment.NEGATIVE : Complaint.Sentiment.NEUTRAL)
                    .predictedCategory(cat.name())
                    .predictedPriority(prio.name())
                    .predictedDepartment(dept.getName())
                    .resolutionSummary(resSummary)
                    .build());

            complaintMessageRepository.save(ComplaintMessage.builder().complaint(c).messageType(ComplaintMessage.MessageType.CUSTOMER_EMAIL).senderName(name).senderEmail(email).messageBody(desc).createdAt(created).build());

            emailLogRepository.save(EmailLog.builder().direction(EmailLog.Direction.INBOUND).sender(email).recipient("support@company.com").subject(subj).body(desc).ticketNumber(tNum).status("RECEIVED").timestamp(created).build());

            if (isResolved && rating > 0) {
                feedbackRepository.save(Feedback.builder().complaint(c).rating(rating).comments("Quick and helpful resolution for ticket " + tNum).customerName(name).customerEmail(email).submittedAt(created.plusHours(3)).build());
            }
        }

        System.out.println("✅ Data Initialization Completed! 20 Sample Complaints Seeded into DB.");
    }
}
