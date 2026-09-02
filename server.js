import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-Memory Seed Data
const DEPARTMENTS = [
  { id: 1, name: "Technical Support", description: "Handles software, app bugs, system outages", headEmail: "tech.head@company.com" },
  { id: 2, name: "Finance", description: "Handles payment deductions, refunds, failed transactions", headEmail: "fin.head@company.com" },
  { id: 3, name: "Billing", description: "Handles invoices, overcharges, subscription plans", headEmail: "billing.head@company.com" },
  { id: 4, name: "Customer Care", description: "General inquiries, staff service quality", headEmail: "care.head@company.com" },
  { id: 5, name: "Logistics", description: "Shipping delays, damaged packages, delivery tracking", headEmail: "logistics.head@company.com" }
];

const SLA_RULES = [
  { id: 1, priority: "CRITICAL", resolutionHours: 4, warningPercentage: 80, description: "System down, payment deducted without order, fraud alert" },
  { id: 2, priority: "HIGH", resolutionHours: 24, warningPercentage: 80, description: "Severe bug, billing error, urgent shipping delay" },
  { id: 3, priority: "MEDIUM", resolutionHours: 48, warningPercentage: 80, description: "Standard feature issue, invoice inquiry" },
  { id: 4, priority: "LOW", resolutionHours: 72, warningPercentage: 80, description: "General feedback, minor cosmetic issue" }
];

const AGENTS = [
  { id: 1, fullName: "System Administrator", email: "admin@company.com", role: "ADMIN", departmentId: 1, available: true },
  { id: 2, fullName: "Sarah Supervisor", email: "supervisor@company.com", role: "SUPERVISOR", departmentId: 2, available: true },
  { id: 3, fullName: "John Tech", email: "john.tech@company.com", role: "AGENT", departmentId: 1, available: true },
  { id: 4, fullName: "Sarah Finance", email: "sarah.fin@company.com", role: "AGENT", departmentId: 2, available: true },
  { id: 5, fullName: "Mike Billing", email: "mike.billing@company.com", role: "AGENT", departmentId: 3, available: true },
  { id: 6, fullName: "Emily Care", email: "emily.care@company.com", role: "AGENT", departmentId: 4, available: true }
];

const COMPLAINTS = [
  { id: 1, ticketNumber: "CMP-2026-000001", customerName: "Alice Smith", customerEmail: "alice.smith@example.com", customerPhone: "+1-555-0101", subject: "Money deducted from bank account but order was cancelled", description: "Payment deducted $149.99 for order #8492. Order cancelled.", category: "PAYMENT", priority: "CRITICAL", status: "RESOLVED", departmentName: "Finance", departmentId: 2, assignedAgentName: "Sarah Finance", assignedAgentId: 4, createdAt: "2026-08-27 10:30", slaRemainingMinutes: 120, slaBreached: false, resolutionSummary: "Refund issued TXN-99482", predictedSentiment: "NEGATIVE", predictedCategory: "PAYMENT", predictedPriority: "CRITICAL", predictedDepartment: "Finance" },
  { id: 2, ticketNumber: "CMP-2026-000002", customerName: "Robert Johnson", customerEmail: "robert.j@example.com", customerPhone: "+1-555-0102", subject: "Unable to login to mobile app after v2.4 update", description: "App crashes on Android 14 with Error 500 at login.", category: "TECHNICAL", priority: "HIGH", status: "IN_PROGRESS", departmentName: "Technical Support", departmentId: 1, assignedAgentName: "John Tech", assignedAgentId: 3, createdAt: "2026-08-28 07:15", slaRemainingMinutes: 720, slaBreached: false, predictedSentiment: "NEGATIVE", predictedCategory: "TECHNICAL", predictedPriority: "HIGH", predictedDepartment: "Technical Support" },
  { id: 3, ticketNumber: "CMP-2026-000003", customerName: "David Miller", customerEmail: "david.m@example.com", customerPhone: "+1-555-0103", subject: "Express shipment delayed by 5 days without tracking update", description: "Order #59201 delayed 5 days. Tracking frozen.", category: "DELIVERY_LOGISTICS", priority: "HIGH", status: "IN_PROGRESS", departmentName: "Logistics", departmentId: 5, assignedAgentName: "Emily Care", assignedAgentId: 6, createdAt: "2026-08-27 09:00", slaRemainingMinutes: -360, slaBreached: true, escalated: true, escalationReason: "SLA BREACHED: Deadline exceeded", predictedSentiment: "NEGATIVE", predictedCategory: "DELIVERY_LOGISTICS", predictedPriority: "HIGH", predictedDepartment: "Logistics" },
  { id: 4, ticketNumber: "CMP-2026-000004", customerName: "Elena Rostova", customerEmail: "elena.r@example.com", customerPhone: "+1-555-0104", subject: "Double charge on monthly subscription invoice #INV-492", description: "Two identical charges of $29.99 on my credit card.", category: "BILLING", priority: "MEDIUM", status: "NEW", departmentName: "Billing", departmentId: 3, assignedAgentName: "Mike Billing", assignedAgentId: 5, createdAt: "2026-08-28 17:00", slaRemainingMinutes: 2760, slaBreached: false, predictedSentiment: "NEGATIVE", predictedCategory: "BILLING", predictedPriority: "MEDIUM", predictedDepartment: "Billing" },
  { id: 5, ticketNumber: "CMP-2026-000005", customerName: "Michael Brown", customerEmail: "michael.b@example.com", customerPhone: "+1-555-0105", subject: "Rude staff behavior at central service center", description: "Staff refused assistance for warranty claim #WC-881.", category: "SERVICE_QUALITY", priority: "MEDIUM", status: "ASSIGNED", departmentName: "Customer Care", departmentId: 4, assignedAgentName: "Emily Care", assignedAgentId: 6, createdAt: "2026-08-28 11:30", slaRemainingMinutes: 2400, slaBreached: false, predictedSentiment: "NEGATIVE", predictedCategory: "SERVICE_QUALITY", predictedPriority: "MEDIUM", predictedDepartment: "Customer Care" },
  { id: 6, ticketNumber: "CMP-2026-000006", customerName: "Sophia Chen", customerEmail: "sophia.c@example.com", customerPhone: "+1-555-0106", subject: "API rate limit exceeding under legitimate enterprise load", description: "429 Too Many Requests error on key /v1/checkout API.", category: "TECHNICAL", priority: "CRITICAL", status: "IN_PROGRESS", departmentName: "Technical Support", departmentId: 1, assignedAgentName: "John Tech", assignedAgentId: 3, createdAt: "2026-08-28 16:30", slaRemainingMinutes: 60, slaBreached: false, predictedSentiment: "NEUTRAL", predictedCategory: "TECHNICAL", predictedPriority: "CRITICAL", predictedDepartment: "Technical Support" },
  { id: 7, ticketNumber: "CMP-2026-000007", customerName: "James Wilson", customerEmail: "james.w@example.com", customerPhone: "+1-555-0107", subject: "Damaged package received for order #ORD-9912", description: "Box severely crushed upon arrival. Product broken.", category: "DELIVERY_LOGISTICS", priority: "HIGH", status: "RESOLVED", departmentName: "Logistics", departmentId: 5, assignedAgentName: "Emily Care", assignedAgentId: 6, createdAt: "2026-08-27 15:00", slaRemainingMinutes: 1440, slaBreached: false, resolutionSummary: "Replacement package dispatched via priority express", predictedSentiment: "NEGATIVE", predictedCategory: "DELIVERY_LOGISTICS", predictedPriority: "HIGH", predictedDepartment: "Logistics" },
  { id: 8, ticketNumber: "CMP-2026-000008", customerName: "Olivia Davis", customerEmail: "olivia.d@example.com", customerPhone: "+1-555-0108", subject: "Account locked out after password reset email link expired", description: "Cannot access portal dashboard for account #ACC-331.", category: "ACCOUNT_ACCESS", priority: "HIGH", status: "WAITING_FOR_CUSTOMER", departmentName: "Technical Support", departmentId: 1, assignedAgentName: "John Tech", assignedAgentId: 3, createdAt: "2026-08-28 05:00", slaRemainingMinutes: 600, slaBreached: false, predictedSentiment: "NEGATIVE", predictedCategory: "ACCOUNT_ACCESS", predictedPriority: "HIGH", predictedDepartment: "Technical Support" },
  { id: 9, ticketNumber: "CMP-2026-000009", customerName: "Daniel Taylor", customerEmail: "daniel.t@example.com", customerPhone: "+1-555-0109", subject: "Incorrect tax calculation on Q3 corporate invoice", description: "Tax rate applied 18% instead of 12% tax exempt code.", category: "BILLING", priority: "MEDIUM", status: "RESOLVED", departmentName: "Billing", departmentId: 3, assignedAgentName: "Mike Billing", assignedAgentId: 5, createdAt: "2026-08-26 14:00", slaRemainingMinutes: 2880, slaBreached: false, resolutionSummary: "Revised tax exemption invoice generated", predictedSentiment: "NEUTRAL", predictedCategory: "BILLING", predictedPriority: "MEDIUM", predictedDepartment: "Billing" },
  { id: 10, ticketNumber: "CMP-2026-000010", customerName: "Emma White", customerEmail: "emma.w@example.com", customerPhone: "+1-555-0110", subject: "Unrecognized debit of $89.00 on subscription auto-renew", description: "Did not consent to auto-renewal of annual package.", category: "PAYMENT", priority: "HIGH", status: "IN_PROGRESS", departmentName: "Finance", departmentId: 2, assignedAgentName: "Sarah Finance", assignedAgentId: 4, createdAt: "2026-08-28 01:00", slaRemainingMinutes: 360, slaBreached: false, predictedSentiment: "NEGATIVE", predictedCategory: "PAYMENT", predictedPriority: "HIGH", predictedDepartment: "Finance" },
  { id: 11, ticketNumber: "CMP-2026-000011", customerName: "Christopher Martin", customerEmail: "chris.m@example.com", customerPhone: "+1-555-0111", subject: "Website checkout button unresponsive on iOS Safari browser", description: "Clicking pay now spins endlessly on Safari 17.2.", category: "TECHNICAL", priority: "MEDIUM", status: "ASSIGNED", departmentName: "Technical Support", departmentId: 1, assignedAgentName: "John Tech", assignedAgentId: 3, createdAt: "2026-08-28 13:00", slaRemainingMinutes: 2520, slaBreached: false, predictedSentiment: "NEUTRAL", predictedCategory: "TECHNICAL", predictedPriority: "MEDIUM", predictedDepartment: "Technical Support" },
  { id: 12, ticketNumber: "CMP-2026-000012", customerName: "Hannah Anderson", customerEmail: "hannah.a@example.com", customerPhone: "+1-555-0112", subject: "Wrong product item delivered for order #88412", description: "Received blue model instead of black stainless steel.", category: "DELIVERY_LOGISTICS", priority: "MEDIUM", status: "CLOSED", departmentName: "Logistics", departmentId: 5, assignedAgentName: "Emily Care", assignedAgentId: 6, createdAt: "2026-08-25 10:00", slaRemainingMinutes: 4320, slaBreached: false, resolutionSummary: "Exchange fulfilled successfully", predictedSentiment: "NEUTRAL", predictedCategory: "DELIVERY_LOGISTICS", predictedPriority: "MEDIUM", predictedDepartment: "Logistics" },
  { id: 13, ticketNumber: "CMP-2026-000013", customerName: "Matthew Thomas", customerEmail: "matthew.t@example.com", customerPhone: "+1-555-0113", subject: "Security alert: Unexpected login from unknown IP address", description: "Received email notification of login from Europe location.", category: "ACCOUNT_ACCESS", priority: "CRITICAL", status: "RESOLVED", departmentName: "Technical Support", departmentId: 1, assignedAgentName: "John Tech", assignedAgentId: 3, createdAt: "2026-08-28 14:00", slaRemainingMinutes: 240, slaBreached: false, resolutionSummary: "Account credentials revoked & 2FA enforced", predictedSentiment: "NEGATIVE", predictedCategory: "ACCOUNT_ACCESS", predictedPriority: "CRITICAL", predictedDepartment: "Technical Support" },
  { id: 14, ticketNumber: "CMP-2026-000014", customerName: "Ava Jackson", customerEmail: "ava.j@example.com", customerPhone: "+1-555-0114", subject: "Promo code DISCOUNT20 not applying at payment gateway", description: "Coupon code shows invalid even though valid until Dec.", category: "BILLING", priority: "LOW", status: "NEW", departmentName: "Billing", departmentId: 3, assignedAgentName: "Mike Billing", assignedAgentId: 5, createdAt: "2026-08-28 15:30", slaRemainingMinutes: 4080, slaBreached: false, predictedSentiment: "NEUTRAL", predictedCategory: "BILLING", predictedPriority: "LOW", predictedDepartment: "Billing" },
  { id: 15, ticketNumber: "CMP-2026-000015", customerName: "Andrew Harris", customerEmail: "andrew.h@example.com", customerPhone: "+1-555-0115", subject: "Customer support agent hung up phone call abruptly", description: "Agent cut call while transferring to supervisor.", category: "SERVICE_QUALITY", priority: "HIGH", status: "IN_PROGRESS", departmentName: "Customer Care", departmentId: 4, assignedAgentName: "Emily Care", assignedAgentId: 6, createdAt: "2026-08-27 23:00", slaRemainingMinutes: 240, slaBreached: false, predictedSentiment: "NEGATIVE", predictedCategory: "SERVICE_QUALITY", predictedPriority: "HIGH", predictedDepartment: "Customer Care" },
  { id: 16, ticketNumber: "CMP-2026-000016", customerName: "Isabella Clark", customerEmail: "isabella.c@example.com", customerPhone: "+1-555-0116", subject: "Refund not credited back to original payment method after 14 days", description: "Approved refund #RF-102 not visible in bank account.", category: "PAYMENT", priority: "CRITICAL", status: "IN_PROGRESS", departmentName: "Finance", departmentId: 2, assignedAgentName: "Sarah Finance", assignedAgentId: 4, createdAt: "2026-08-28 09:00", slaRemainingMinutes: -360, slaBreached: true, escalated: true, escalationReason: "SLA BREACHED: Resolution deadline passed", predictedSentiment: "NEGATIVE", predictedCategory: "PAYMENT", predictedPriority: "CRITICAL", predictedDepartment: "Finance" },
  { id: 17, ticketNumber: "CMP-2026-000017", customerName: "Joshua Lewis", customerEmail: "joshua.l@example.com", customerPhone: "+1-555-0117", subject: "Feature request: Dark mode toggle in user settings", description: "Would appreciate dark theme option for night viewing.", category: "OTHER", priority: "LOW", status: "NEW", departmentName: "Customer Care", departmentId: 4, assignedAgentName: "Emily Care", assignedAgentId: 6, createdAt: "2026-08-28 17:30", slaRemainingMinutes: 4200, slaBreached: false, predictedSentiment: "POSITIVE", predictedCategory: "OTHER", predictedPriority: "LOW", predictedDepartment: "Customer Care" },
  { id: 18, ticketNumber: "CMP-2026-000018", customerName: "Mia Robinson", customerEmail: "mia.r@example.com", customerPhone: "+1-555-0118", subject: "Package marked as delivered but not received at address", description: "Courier left package outside without signature.", category: "DELIVERY_LOGISTICS", priority: "HIGH", status: "IN_PROGRESS", departmentName: "Logistics", departmentId: 5, assignedAgentName: "Emily Care", assignedAgentId: 6, createdAt: "2026-08-28 04:00", slaRemainingMinutes: 540, slaBreached: false, predictedSentiment: "NEGATIVE", predictedCategory: "DELIVERY_LOGISTICS", predictedPriority: "HIGH", predictedDepartment: "Logistics" },
  { id: 19, ticketNumber: "CMP-2026-000019", customerName: "Ethan Walker", customerEmail: "ethan.w@example.com", customerPhone: "+1-555-0119", subject: "SaaS dashboard failing to generate export PDF report", description: "PDF download returns 0 byte corrupt file.", category: "TECHNICAL", priority: "MEDIUM", status: "RESOLVED", departmentName: "Technical Support", departmentId: 1, assignedAgentName: "John Tech", assignedAgentId: 3, createdAt: "2026-08-27 06:00", slaRemainingMinutes: 2880, slaBreached: false, resolutionSummary: "PDF generation library patch applied", predictedSentiment: "NEUTRAL", predictedCategory: "TECHNICAL", predictedPriority: "MEDIUM", predictedDepartment: "Technical Support" },
  { id: 20, ticketNumber: "CMP-2026-000020", customerName: "Charlotte Young", customerEmail: "charlotte.y@example.com", customerPhone: "+1-555-0120", subject: "Overcharged subscription fee due to duplicate seat count", description: "Billed for 10 seats instead of 5 active team members.", category: "BILLING", priority: "HIGH", status: "RESOLVED", departmentName: "Billing", departmentId: 3, assignedAgentName: "Mike Billing", assignedAgentId: 5, createdAt: "2026-08-27 20:00", slaRemainingMinutes: 1440, slaBreached: false, resolutionSummary: "Seat adjustment and credit memo issued", predictedSentiment: "NEGATIVE", predictedCategory: "BILLING", predictedPriority: "HIGH", predictedDepartment: "Billing" }
];

const MESSAGES = [
  { id: 1, complaintId: 1, senderName: "System", senderEmail: "support@company.com", body: "Ticket registered and assigned to Finance.", createdAt: "2026-08-27 10:30", isInternal: true },
  { id: 2, complaintId: 1, senderName: "Sarah Finance", senderEmail: "sarah.fin@company.com", body: "Hello Alice, we verified the charge and the refund of $149.99 has been initiated.", createdAt: "2026-08-27 11:15", isInternal: false }
];

const AUDIT_LOGS = [
  { id: 1, ticketNumber: "CMP-2026-000001", action: "CREATED", performedBy: "Customer (Web)", details: "Ticket submitted via web portal", timestamp: "2026-08-27 10:30" },
  { id: 2, ticketNumber: "CMP-2026-000001", action: "ASSIGNED", performedBy: "System", details: "Assigned to Sarah Finance", timestamp: "2026-08-27 10:31" },
  { id: 3, ticketNumber: "CMP-2026-000001", action: "RESOLVED", performedBy: "Sarah Finance", details: "Refund issued TXN-99482", timestamp: "2026-08-27 12:00" }
];

const EMAIL_LOGS = [
  { id: 1, recipient: "alice.smith@example.com", subject: "Your Complaint [CMP-2026-000001] has been resolved", body: "Dear Alice, refund TXN-99482 has been issued.", ticketNumber: "CMP-2026-000001", status: "SENT", timestamp: "2026-08-27 12:05" },
  { id: 2, recipient: "james.w@example.com", subject: "Replacement Shipped [CMP-2026-000007]", body: "Dear James, replacement package is in transit.", ticketNumber: "CMP-2026-000007", status: "SENT", timestamp: "2026-08-27 16:00" }
];

const FEEDBACKS = [
  { id: 1, ticketNumber: "CMP-2026-000001", customerName: "Alice Smith", customerEmail: "alice.smith@example.com", rating: 5, comments: "Excellent and fast refund resolution by Sarah! The refund reflected in 2 hours." },
  { id: 2, ticketNumber: "CMP-2026-000007", customerName: "James Wilson", customerEmail: "james.w@example.com", rating: 4, comments: "Replacement item shipped promptly." },
  { id: 3, ticketNumber: "CMP-2026-000009", customerName: "Daniel Taylor", customerEmail: "daniel.t@example.com", rating: 5, comments: "Tax exemption invoice updated correctly." },
  { id: 4, ticketNumber: "CMP-2026-000013", customerName: "Matthew Thomas", customerEmail: "matthew.t@example.com", rating: 5, comments: "Great security action resetting account credentials." }
];

// Helper: AI Classification
function predictComplaint(subject, description) {
  const text = `${subject} ${description}`.toLowerCase();
  let category = "OTHER";
  let priority = "MEDIUM";
  let sentiment = "NEUTRAL";
  let recommendedDepartment = "Customer Care";

  if (text.includes("furious") || text.includes("terrible") || text.includes("scam") || text.includes("horrible") || text.includes("unacceptable") || text.includes("money deducted") || text.includes("legal action") || text.includes("immediately")) {
    sentiment = "NEGATIVE";
  } else if (text.includes("thank") || text.includes("appreciate") || text.includes("helpful")) {
    sentiment = "POSITIVE";
  }

  if (text.includes("payment") || text.includes("deducted") || text.includes("charged") || text.includes("refund") || text.includes("transaction")) {
    category = "PAYMENT";
    recommendedDepartment = "Finance";
    priority = "HIGH";
  } else if (text.includes("invoice") || text.includes("billing") || text.includes("receipt") || text.includes("charge")) {
    category = "BILLING";
    recommendedDepartment = "Billing";
    priority = "MEDIUM";
  } else if (text.includes("error") || text.includes("bug") || text.includes("crash") || text.includes("login") || text.includes("access") || text.includes("server")) {
    category = "TECHNICAL";
    recommendedDepartment = "Technical Support";
    priority = text.includes("down") || text.includes("cannot login") ? "HIGH" : "MEDIUM";
  } else if (text.includes("shipping") || text.includes("delivery") || text.includes("package") || text.includes("tracking") || text.includes("delay")) {
    category = "DELIVERY_LOGISTICS";
    recommendedDepartment = "Logistics";
    priority = "MEDIUM";
  } else if (text.includes("rude") || text.includes("behavior") || text.includes("service quality") || text.includes("staff")) {
    category = "SERVICE_QUALITY";
    recommendedDepartment = "Customer Care";
    priority = "HIGH";
  }

  if (text.includes("urgent") || text.includes("critical") || text.includes("fraud") || text.includes("system down") || text.includes("lawsuit")) {
    priority = "CRITICAL";
  }

  return { category, priority, sentiment, recommendedDepartment };
}

let ticketSequence = 21;

// API Routes

// 1. Dashboard Statistics
app.get("/api/dashboard/statistics", (req, res) => {
  const total = COMPLAINTS.length;
  const newCount = COMPLAINTS.filter(c => c.status === "NEW").length;
  const inProgress = COMPLAINTS.filter(c => c.status === "IN_PROGRESS").length;
  const assigned = COMPLAINTS.filter(c => c.status === "ASSIGNED").length;
  const waiting = COMPLAINTS.filter(c => c.status === "WAITING_FOR_CUSTOMER").length;
  const open = newCount + assigned + inProgress + waiting;
  const resolved = COMPLAINTS.filter(c => c.status === "RESOLVED").length;
  const closed = COMPLAINTS.filter(c => c.status === "CLOSED").length;
  const breached = COMPLAINTS.filter(c => c.slaBreached).length;
  const escalated = COMPLAINTS.filter(c => c.escalated || c.slaBreached).length;

  const totalRating = FEEDBACKS.reduce((acc, cur) => acc + cur.rating, 0);
  const csat = FEEDBACKS.length > 0 ? +(totalRating / FEEDBACKS.length).toFixed(1) : 4.8;

  res.json({
    totalComplaints: total,
    newComplaints: newCount,
    openComplaints: open,
    inProgressComplaints: inProgress,
    resolvedComplaints: resolved,
    closedComplaints: closed,
    overdueSlaBreached: breached,
    escalatedComplaints: escalated,
    averageResolutionTimeHours: 16.4,
    customerSatisfactionScore: csat
  });
});

// 2. Complaints List
app.get("/api/complaints", (req, res) => {
  const { status, priority, departmentId, agentId, search } = req.query;
  let list = [...COMPLAINTS];

  if (status) {
    list = list.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }
  if (priority) {
    list = list.filter(c => c.priority.toLowerCase() === priority.toLowerCase());
  }
  if (departmentId) {
    list = list.filter(c => c.departmentId && c.departmentId.toString() === departmentId.toString());
  }
  if (agentId) {
    list = list.filter(c => c.assignedAgentId && c.assignedAgentId.toString() === agentId.toString());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(c =>
      c.ticketNumber.toLowerCase().includes(q) ||
      c.customerName.toLowerCase().includes(q) ||
      c.customerEmail.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => (b.id - a.id));
  res.json(list);
});

// 3. Complaint Details
app.get("/api/complaints/:id", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const messages = MESSAGES.filter(m => m.complaintId.toString() === req.params.id);
  const auditTimeline = AUDIT_LOGS.filter(a => a.ticketNumber === complaint.ticketNumber);

  res.json({
    ticket: complaint,
    messages,
    auditTimeline
  });
});

// 4. Create Complaint
app.post("/api/complaints", (req, res) => {
  const { customerName, customerEmail, customerPhone, subject, description, category, priority, departmentId } = req.body;
  const ai = predictComplaint(subject || "", description || "");

  const finalCategory = category || ai.category;
  const finalPriority = priority || ai.priority;
  const deptObj = DEPARTMENTS.find(d => d.id === departmentId) || DEPARTMENTS.find(d => d.name === ai.recommendedDepartment) || DEPARTMENTS[0];
  const agentObj = AGENTS.find(a => a.role === "AGENT" && a.departmentId === deptObj.id) || AGENTS[2];

  const now = new Date();
  const ticketNumber = `CMP-${now.getFullYear()}-${String(ticketSequence++).padStart(6, "0")}`;

  const hours = finalPriority === "CRITICAL" ? 4 : finalPriority === "HIGH" ? 24 : finalPriority === "MEDIUM" ? 48 : 72;

  const newTicket = {
    id: Date.now(),
    ticketNumber,
    customerName: customerName || "Customer",
    customerEmail: customerEmail || "customer@example.com",
    customerPhone: customerPhone || "",
    subject: subject || "New Complaint",
    description: description || "",
    category: finalCategory,
    priority: finalPriority,
    status: agentObj ? "ASSIGNED" : "NEW",
    departmentName: deptObj.name,
    departmentId: deptObj.id,
    assignedAgentName: agentObj ? agentObj.fullName : "Unassigned",
    assignedAgentId: agentObj ? agentObj.id : null,
    createdAt: now.toISOString().replace("T", " ").substring(0, 16),
    slaRemainingMinutes: hours * 60,
    slaBreached: false,
    escalated: false,
    predictedSentiment: ai.sentiment,
    predictedCategory: ai.category,
    predictedPriority: ai.priority,
    predictedDepartment: ai.recommendedDepartment
  };

  COMPLAINTS.unshift(newTicket);

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber,
    action: "CREATED",
    performedBy: customerName || "Customer",
    details: `Ticket registered under ${deptObj.name}`,
    timestamp: newTicket.createdAt
  });

  res.json(newTicket);
});

// 5. Update Status
app.put("/api/complaints/:id/status", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { status, performedBy, notes } = req.query;
  if (status) complaint.status = status;
  if (notes) complaint.notes = notes;

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber: complaint.ticketNumber,
    action: "STATUS_CHANGE",
    performedBy: performedBy || "Admin",
    details: `Status updated to ${status}${notes ? " - " + notes : ""}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
  });

  res.json(complaint);
});

// 6. Assign Agent
app.put("/api/complaints/:id/assign", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { agentId, performedBy } = req.query;
  const agent = AGENTS.find(a => a.id.toString() === agentId);
  if (agent) {
    complaint.assignedAgentName = agent.fullName;
    complaint.assignedAgentId = agent.id;
    if (complaint.status === "NEW") complaint.status = "ASSIGNED";

    AUDIT_LOGS.push({
      id: AUDIT_LOGS.length + 1,
      ticketNumber: complaint.ticketNumber,
      action: "ASSIGNED",
      performedBy: performedBy || "Admin",
      details: `Reassigned to agent ${agent.fullName}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    });
  }

  res.json(complaint);
});

// 7. Reply Message
app.post("/api/complaints/:id/reply", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { message, isInternal } = req.body;
  const senderName = req.query.senderName || "Agent";
  const senderEmail = req.query.senderEmail || "support@company.com";

  const msg = {
    id: MESSAGES.length + 1,
    complaintId: complaint.id,
    senderName,
    senderEmail,
    body: message || "",
    isInternal: !!isInternal,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
  };
  MESSAGES.push(msg);

  if (!isInternal) {
    EMAIL_LOGS.push({
      id: EMAIL_LOGS.length + 1,
      recipient: complaint.customerEmail,
      subject: `Re: [${complaint.ticketNumber}] ${complaint.subject}`,
      body: message || "",
      ticketNumber: complaint.ticketNumber,
      status: "SENT",
      timestamp: msg.createdAt
    });
  }

  res.json(msg);
});

// 8. Resolve Complaint
app.post("/api/complaints/:id/resolve", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { resolutionSummary } = req.body;
  const agentName = req.query.agentName || "Support Agent";

  complaint.status = "RESOLVED";
  complaint.resolutionSummary = resolutionSummary || "Resolved by agent.";

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber: complaint.ticketNumber,
    action: "RESOLVED",
    performedBy: agentName,
    details: `Resolved: ${complaint.resolutionSummary}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
  });

  EMAIL_LOGS.push({
    id: EMAIL_LOGS.length + 1,
    recipient: complaint.customerEmail,
    subject: `Resolved: [${complaint.ticketNumber}] ${complaint.subject}`,
    body: `Your complaint has been resolved: ${complaint.resolutionSummary}`,
    ticketNumber: complaint.ticketNumber,
    status: "SENT",
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
  });

  res.json(complaint);
});

// 9. Simulate Inbound Email
app.post("/api/complaints/simulate-inbound-email", (req, res) => {
  const { senderEmail, subject, body } = req.query;
  const ai = predictComplaint(subject || "", body || "");

  const ticketNumber = `CMP-${new Date().getFullYear()}-${String(ticketSequence++).padStart(6, "0")}`;
  const dept = DEPARTMENTS.find(d => d.name === ai.recommendedDepartment) || DEPARTMENTS[0];
  const agent = AGENTS.find(a => a.role === "AGENT" && a.departmentId === dept.id) || AGENTS[2];

  const newTicket = {
    id: Date.now(),
    ticketNumber,
    customerName: senderEmail ? senderEmail.split("@")[0] : "Customer",
    customerEmail: senderEmail || "customer@example.com",
    customerPhone: "",
    subject: subject || "Inbound Email Ticket",
    description: body || "",
    category: ai.category,
    priority: ai.priority,
    status: "NEW",
    departmentName: dept.name,
    departmentId: dept.id,
    assignedAgentName: agent ? agent.fullName : "Unassigned",
    assignedAgentId: agent ? agent.id : null,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    slaRemainingMinutes: 1440,
    slaBreached: false,
    escalated: false,
    predictedSentiment: ai.sentiment,
    predictedCategory: ai.category,
    predictedPriority: ai.priority,
    predictedDepartment: ai.recommendedDepartment
  };

  COMPLAINTS.unshift(newTicket);
  res.json(newTicket);
});

// 10. Departments
app.get("/api/departments", (req, res) => {
  res.json(DEPARTMENTS);
});

app.post("/api/departments", (req, res) => {
  const { name, description, headEmail } = req.body;
  const newDept = {
    id: DEPARTMENTS.length + 1,
    name: name || "New Department",
    description: description || "",
    headEmail: headEmail || "head@company.com"
  };
  DEPARTMENTS.push(newDept);
  res.json(newDept);
});

// 11. Agents
app.get("/api/agents", (req, res) => {
  res.json(AGENTS.filter(a => a.role === "AGENT"));
});

// 12. SLA Rules
app.get("/api/sla/rules", (req, res) => {
  res.json(SLA_RULES);
});

app.put("/api/sla/rules/:id", (req, res) => {
  const rule = SLA_RULES.find(r => r.id.toString() === req.params.id);
  if (!rule) return res.status(404).json({ error: "SLA Rule not found" });
  Object.assign(rule, req.body);
  res.json(rule);
});

// 13. Emails
app.get("/api/emails", (req, res) => {
  res.json([...EMAIL_LOGS].reverse());
});

app.post("/api/emails/send", (req, res) => {
  const { recipient, subject, body, ticketNumber } = req.query;
  const log = {
    id: EMAIL_LOGS.length + 1,
    recipient: recipient || "customer@example.com",
    subject: subject || "Update from Support",
    body: body || "",
    ticketNumber: ticketNumber || null,
    status: "SENT",
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
  };
  EMAIL_LOGS.push(log);
  res.json(log);
});

// 14. Feedback
app.get("/api/feedback", (req, res) => {
  res.json(FEEDBACKS);
});

app.post("/api/feedback", (req, res) => {
  const { ticketNumber, rating, comments } = req.body;
  const complaint = COMPLAINTS.find(c => c.ticketNumber === ticketNumber);
  const fb = {
    id: FEEDBACKS.length + 1,
    ticketNumber: ticketNumber || "CMP-2026-000001",
    customerName: complaint ? complaint.customerName : "Anonymous Customer",
    customerEmail: complaint ? complaint.customerEmail : "customer@example.com",
    rating: Number(rating) || 5,
    comments: comments || "Thank you for the resolution!"
  };
  FEEDBACKS.push(fb);
  res.json(fb);
});

// 15. Auth
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const agent = AGENTS.find(a => a.email === email);
  if (agent) {
    return res.json({
      token: "jwt-demo-token-" + agent.id,
      email: agent.email,
      fullName: agent.fullName,
      role: agent.role,
      departmentId: agent.departmentId
    });
  }
  // Default login fallback
  res.json({
    token: "jwt-demo-token-default",
    email: email || "admin@company.com",
    fullName: "System Administrator",
    role: "ADMIN",
    departmentId: 1
  });
});

app.post("/api/auth/register", (req, res) => {
  const { fullName, email, role, departmentId } = req.body;
  const newUser = {
    id: AGENTS.length + 1,
    fullName: fullName || "New User",
    email: email || `user${Date.now()}@company.com`,
    role: role || "CUSTOMER",
    departmentId: departmentId || 1,
    available: true
  };
  AGENTS.push(newUser);
  res.json(newUser);
});

// Serve static frontend files
app.use(express.static(__dirname));

// SPA fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
