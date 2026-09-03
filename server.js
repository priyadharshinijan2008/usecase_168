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

// =========================================================================
// 1. OMNICHANNEL CHANNELS
// =========================================================================
const CHANNELS = [
  { id: 'EMAIL', name: 'Email Inbound', icon: 'mail', description: 'Parsed from support@nexusresolution.com and automated tickets', color: 'indigo' },
  { id: 'WEB_PORTAL', name: 'Web Self-Service Portal', icon: 'globe', description: 'Registered directly by customers via corporate portal', color: 'blue' },
  { id: 'PHONE', name: 'Phone / Contact Center', icon: 'phone-call', description: 'Logged by 24x7 voice helpline agents (Toll-Free: 1800-425-9000)', color: 'emerald' },
  { id: 'LIVE_CHAT', name: 'Live Chat & Web Desk', icon: 'message-square', description: 'Transferred from website interactive chat widget and AI concierge', color: 'amber' },
  { id: 'MOBILE_APP', name: 'Mobile App SDK', icon: 'smartphone', description: 'In-app crash and incident tickets submitted via iOS/Android apps', color: 'purple' },
  { id: 'SOCIAL_MEDIA', name: 'Social Media & WhatsApp', icon: 'share-2', description: 'Ingested from @NexusSupport on X (Twitter) and WhatsApp Enterprise', color: 'rose' },
  { id: 'IN_PERSON', name: 'Branch / In-Person Desk', icon: 'map-pin', description: 'Walk-in customer service centers and regional branch offices', color: 'cyan' }
];

// =========================================================================
// 2. SUPPORT DEPARTMENTS & QUEUES
// =========================================================================
const DEPARTMENTS = [
  { id: 1, name: "Billing, Payments & Invoicing", description: "Disputed charges, double debits, GST invoice correction, refund delays", headEmail: "rajesh.support@nexusres.com", headName: "Rajesh Narayanan" },
  { id: 2, name: "Technical Support & Platform Systems", description: "API latency, software outages, developer hardware, security credentials", headEmail: "soundarya.support@nexusres.com", headName: "Soundarya Padmanabhan" },
  { id: 3, name: "Customer Success & Operations", description: "Account management, SLA compliance, onboarding, service quality complaints", headEmail: "priya.support@nexusres.com", headName: "Priya" },
  { id: 4, name: "Logistics, Shipping & Order Fulfillment", description: "Damaged transit shipments, delayed courier consignments, lost parcels", headEmail: "senthil.support@nexusres.com", headName: "Senthil Murugan" },
  { id: 5, name: "Executive Escalations Desk", description: "High-value VIP accounts, breach of contract, regulatory & legal inquiries", headEmail: "priya.support@nexusres.com", headName: "Priya" }
];

// =========================================================================
// 3. SLA POLICIES
// =========================================================================
const SLA_RULES = [
  { id: 1, priority: "CRITICAL", resolutionHours: 4, warningPercentage: 80, description: "Total service outage, unauthorized payment debit, security breach, VIP account blockage" },
  { id: 2, priority: "HIGH", resolutionHours: 24, warningPercentage: 80, description: "Major platform feature degraded, delayed high-value shipment, invoice withholding" },
  { id: 3, priority: "MEDIUM", resolutionHours: 48, warningPercentage: 80, description: "Intermittent portal glitch, billing statement discrepancy, account permission update" },
  { id: 4, priority: "LOW", resolutionHours: 72, warningPercentage: 80, description: "Product feature request, documentation clarification, receipt re-issuance inquiry" }
];

// =========================================================================
// 4. USERS (Support Officers & Customer Accounts)
// =========================================================================
const USERS = [
  // Support Officers / Operations Managers
  {
    id: 1,
    employeeId: "HR-1001",
    altId: "AGT-1001",
    password: "priyapassword",
    fullName: "Priya",
    email: "priya@nexusres.com",
    role: "HR",
    designation: "Head of Operations & Chief Grievance Officer",
    departmentId: 3,
    departmentName: "Customer Success & Operations",
    phone: "+91-98401-22341",
    avatar: "PR",
    activeTicketsCount: 3
  },
  {
    id: 2,
    employeeId: "HR-1002",
    altId: "AGT-1002",
    password: "rajeshpassword",
    fullName: "Rajesh Narayanan",
    email: "rajesh.narayanan@nexusres.com",
    role: "HR",
    designation: "Senior Support Lead (Billing & Payments)",
    departmentId: 1,
    departmentName: "Billing, Payments & Invoicing",
    phone: "+91-98402-33452",
    avatar: "RN",
    activeTicketsCount: 4
  },
  {
    id: 3,
    employeeId: "AGT-1003",
    altId: "HR-1003",
    password: "soundaryapassword",
    fullName: "Soundarya Padmanabhan",
    email: "soundarya.support@nexusres.com",
    role: "HR",
    designation: "Lead Systems Engineer & Technical Triage",
    departmentId: 2,
    departmentName: "Technical Support & Platform Systems",
    phone: "+91-98403-44563",
    avatar: "SP",
    activeTicketsCount: 2
  },
  {
    id: 4,
    employeeId: "AGT-1004",
    altId: "HR-1004",
    password: "senthilpassword",
    fullName: "Senthil Murugan",
    email: "senthil.support@nexusres.com",
    role: "HR",
    designation: "Logistics & Fulfillment Resolution Specialist",
    departmentId: 4,
    departmentName: "Logistics, Shipping & Order Fulfillment",
    phone: "+91-98404-55674",
    avatar: "SM",
    activeTicketsCount: 3
  },

  // Customer Accounts (Enterprise VIP, Corporate & Business Clients)
  {
    id: 101,
    employeeId: "EMP-2001",
    customerId: "CUST-2001",
    accountTier: "Enterprise VIP",
    companyName: "TechNova Cloud Systems Ltd.",
    password: "karthikpassword",
    fullName: "Karthik Ramanathan",
    email: "karthik.ramanathan@nexusres.com",
    role: "EMPLOYEE",
    designation: "VP of Enterprise Infrastructure",
    phone: "+91-94441-11001",
    avatar: "KR"
  },
  {
    id: 102,
    employeeId: "EMP-2002",
    customerId: "CUST-2002",
    accountTier: "Corporate Business",
    companyName: "Horizon Digital Studios",
    password: "ananyapassword",
    fullName: "Ananya Sundaram",
    email: "ananya.sundaram@nexusres.com",
    role: "EMPLOYEE",
    designation: "Head of Product Design & CX",
    phone: "+91-94441-11002",
    avatar: "AS"
  },
  {
    id: 103,
    employeeId: "EMP-2003",
    customerId: "CUST-2003",
    accountTier: "Corporate Business",
    companyName: "CloudScale DevOps Inc.",
    password: "vigneshpassword",
    fullName: "Vignesh Balasubramanian",
    email: "vignesh.bala@nexusres.com",
    role: "EMPLOYEE",
    designation: "Principal Site Reliability Engineer",
    phone: "+91-94441-11003",
    avatar: "VB"
  },
  {
    id: 104,
    employeeId: "EMP-2004",
    customerId: "CUST-2004",
    accountTier: "Enterprise VIP",
    companyName: "Apex Global FinTech",
    password: "meenakshipassword",
    fullName: "Meenakshi Natarajan",
    email: "meenakshi.n@nexusres.com",
    role: "EMPLOYEE",
    designation: "Chief Quality Officer",
    phone: "+91-94441-11004",
    avatar: "MN"
  },
  {
    id: 105,
    employeeId: "EMP-2005",
    customerId: "CUST-2005",
    accountTier: "Standard Client",
    companyName: "Zenith Retail & Logistics",
    password: "harishpassword",
    fullName: "Harish Ragavendran",
    email: "harish.ragavendran@nexusres.com",
    role: "EMPLOYEE",
    designation: "Operations Lead",
    phone: "+91-94441-11005",
    avatar: "HR"
  },
  {
    id: 106,
    employeeId: "EMP-2006",
    customerId: "CUST-2006",
    accountTier: "Corporate Business",
    companyName: "Omnex Analytics Corp.",
    password: "divyapassword",
    fullName: "Divya Krishnan",
    email: "divya.krishnan@nexusres.com",
    role: "EMPLOYEE",
    designation: "Director of Data Analytics",
    phone: "+91-94441-11006",
    avatar: "DK"
  },
  {
    id: 107,
    employeeId: "EMP-2007",
    customerId: "CUST-2007",
    accountTier: "Enterprise VIP",
    companyName: "Vanguard Systems Global",
    password: "sureshpassword",
    fullName: "Suresh Venkatesh",
    email: "suresh.venkatesh@nexusres.com",
    role: "EMPLOYEE",
    designation: "Technical Alliance Director",
    phone: "+91-94441-11007",
    avatar: "SV"
  },
  {
    id: 108,
    employeeId: "EMP-2008",
    customerId: "CUST-2008",
    accountTier: "Corporate Business",
    companyName: "Meridian Financial Services",
    password: "deepapassword",
    fullName: "Deepa Subramanian",
    email: "deepa.subramanian@nexusres.com",
    role: "EMPLOYEE",
    designation: "Senior Treasury Manager",
    phone: "+91-94441-11008",
    avatar: "DS"
  }
];

// =========================================================================
// 5. SEED COMPLAINTS (Multi-Channel Centralized Ingestion)
// =========================================================================
let ticketSequence = 101;

const COMPLAINTS = [
  {
    id: 1,
    ticketNumber: "TKT-2026-000101",
    employeeId: "EMP-2001",
    customerId: "CUST-2001",
    customerName: "Karthik Ramanathan",
    customerEmail: "karthik.ramanathan@nexusres.com",
    customerPhone: "+91-94441-11001",
    customerAccountTier: "Enterprise VIP",
    companyName: "TechNova Cloud Systems Ltd.",
    channel: "EMAIL",
    channelReference: "Parsed from inbound support email (Message-ID: <msg-99214@technova.com>)",
    subject: "Double-debit of ₹14,800 annual API subscription renewal with duplicate invoice",
    description: "Our corporate debit card was billed twice on August 26 for the production API tier renewal. Two separate charge slips #TXN-77821 and #TXN-77822 were generated under account CUST-2001.",
    category: "BILLING",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "Billing, Payments & Invoicing",
    departmentId: 1,
    assignedAgentName: "Rajesh Narayanan",
    assignedAgentId: 2,
    actionTakenBy: "Rajesh Narayanan (Senior Support Lead - Billing)",
    actionTimestamp: "2026-08-27 14:15",
    actionNotes: "Verified Stripe gateway duplicate charge anomaly. Triggered instant reverse reversal voucher to HDFC Corporate Card ending 4892.",
    claimedAmount: "₹14,800",
    originalClaimedAmount: "₹14,800",
    hrApprovedAmount: "₹14,800 credited in payroll cycle",
    isAmountAdjusted: false,
    amountAdjustmentReason: null,
    resolvedAmount: "₹14,800 refund voucher credited",
    resolutionSummary: "Duplicate charge reversed at gateway level; ₹14,800 refunded with zero processing fee and tax credit note issued.",
    createdAt: "2026-08-26 09:30",
    slaRemainingMinutes: 120,
    slaBreached: false,
    escalated: false,
    escalationTier: null,
    feedback: {
      rating: 5,
      npsScore: 10,
      fcr: true,
      comments: "Exceptional response speed! Refund hit our bank account within 3 hours. Great centralized tracking.",
      submittedAt: "2026-08-27 16:30"
    }
  },
  {
    id: 2,
    ticketNumber: "TKT-2026-000102",
    employeeId: "EMP-2002",
    customerId: "CUST-2002",
    customerName: "Ananya Sundaram",
    customerEmail: "ananya.sundaram@nexusres.com",
    customerPhone: "+91-94441-11002",
    customerAccountTier: "Corporate Business",
    companyName: "Horizon Digital Studios",
    channel: "PHONE",
    channelReference: "Contact Center IVR recording ref #CALL-48902 (Agent: Priya logged)",
    subject: "Emergency hospital cashless desk rejected corporate mediclaim guarantee letter",
    description: "Apollo Greams Road TPA desk refused cashless admission citing missing policy endorsement for corporate group account #GRP-8812. Emergency pre-op procedure stalled.",
    category: "CUSTOMER_SERVICE",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "Customer Success & Operations",
    departmentId: 3,
    assignedAgentName: "Priya",
    assignedAgentId: 1,
    actionTakenBy: "Priya (Chief Grievance Officer)",
    actionTimestamp: "2026-08-27 11:45",
    actionNotes: "Coordinated emergency hotline with Star Health TPA chief underwriter. Issued corporate guarantee undertaking.",
    claimedAmount: "₹1,25,000",
    originalClaimedAmount: "₹1,25,000",
    hrApprovedAmount: "₹1,25,000 cashless claim approved",
    isAmountAdjusted: false,
    amountAdjustmentReason: null,
    resolvedAmount: "₹1,25,000 cashless pre-authorization issued",
    resolutionSummary: "Direct corporate guarantee letter delivered to hospital TPA desk within 45 minutes; cashless pre-authorization active.",
    createdAt: "2026-08-27 08:15",
    slaRemainingMinutes: 180,
    slaBreached: false,
    escalated: false,
    escalationTier: null,
    feedback: {
      rating: 5,
      npsScore: 9,
      fcr: true,
      comments: "Life-saving escalation! Priya handled the hospital desk directly when automated systems failed.",
      submittedAt: "2026-08-27 18:00"
    }
  },
  {
    id: 3,
    ticketNumber: "TKT-2026-000103",
    employeeId: "EMP-2003",
    customerId: "CUST-2003",
    customerName: "Vignesh Balasubramanian",
    customerEmail: "vignesh.bala@nexusres.com",
    customerPhone: "+91-94441-11003",
    customerAccountTier: "Corporate Business",
    companyName: "CloudScale DevOps Inc.",
    channel: "WEB_PORTAL",
    channelReference: "Customer self-service portal web submission form (IP: 103.21.144.9)",
    subject: "Enterprise relocation logistics freight invoice unsettled past 45-day SLA",
    description: "Inter-city server migration freight bill of ₹42,500 submitted with transporter lorry waybills and security gate clearance remains in pending state.",
    category: "LOGISTICS",
    priority: "HIGH",
    status: "ESCALATED",
    departmentName: "Logistics, Shipping & Order Fulfillment",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Priya (Chief Grievance Officer)",
    actionTimestamp: "2026-08-28 16:20",
    actionNotes: "Tier-3 Escalation triggered due to SLA breach. Audited vendor receipts and authorized priority clearance.",
    claimedAmount: "₹42,500",
    originalClaimedAmount: "₹42,500",
    hrApprovedAmount: "₹32,000",
    isAmountAdjusted: true,
    amountAdjustmentReason: "Employee inflated claim unwantedly: transport bill audited and capped at ₹32,000 policy limit",
    resolvedAmount: "₹32,000",
    resolutionSummary: "Audited transporter bill capped at ₹32,000 verified; sent to treasury for batch disbursement.",
    createdAt: "2026-08-25 10:00",
    slaRemainingMinutes: -240,
    slaBreached: true,
    escalated: true,
    escalationTier: "TIER_3",
    escalationReason: "SLA Deadline Exceeded for Relocation Settlement (Contractual Penalty Risk)",
    escalatedTo: "Priya (Chief Grievance Officer)",
    escalatedAt: "2026-08-28 12:00",
    feedback: null
  },
  {
    id: 4,
    ticketNumber: "TKT-2026-000104",
    employeeId: "EMP-2004",
    customerId: "CUST-2004",
    customerName: "Meenakshi Natarajan",
    customerEmail: "meenakshi.n@nexusres.com",
    customerPhone: "+91-94441-11004",
    customerAccountTier: "Enterprise VIP",
    companyName: "Apex Global FinTech",
    channel: "LIVE_CHAT",
    channelReference: "Live Chat widget chat transcript #CHAT-77201 (Handed off from bot)",
    subject: "Enterprise developer hardware battery swelling causing emergency thermal shutdown",
    description: "MacBook Pro M2 Max developer machine battery swollen warping the aluminum chassis during CI/CD test automation run. Critical hazard to office environment.",
    category: "TECHNICAL",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "Technical Support & Platform Systems",
    departmentId: 2,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (Lead Systems Engineer)",
    actionTimestamp: "2026-08-28 14:00",
    actionNotes: "Hardware safely quarantined at OMR Chennai tech lab. Brand new M3 Pro 36GB workstation configured and deployed within 90 minutes.",
    claimedAmount: "₹2,10,000",
    originalClaimedAmount: "₹2,10,000",
    hrApprovedAmount: "100% Asset Replacement (₹2,10,000 hardware)",
    isAmountAdjusted: false,
    amountAdjustmentReason: null,
    resolvedAmount: "100% Asset Replacement (₹2,10,000 hardware)",
    resolutionSummary: "Swollen hardware quarantined; brand new M3 Pro workstation provisioned and SSH keys restored.",
    createdAt: "2026-08-28 09:30",
    slaRemainingMinutes: 150,
    slaBreached: false,
    escalated: false,
    escalationTier: null,
    feedback: {
      rating: 5,
      npsScore: 10,
      fcr: true,
      comments: "Astounding turnaround time. Within 90 minutes I had a replacement workstation and zero lost sprint work.",
      submittedAt: "2026-08-28 16:45"
    }
  },
  {
    id: 5,
    ticketNumber: "TKT-2026-000105",
    employeeId: "EMP-2005",
    customerId: "CUST-2005",
    customerName: "Harish Ragavendran",
    customerEmail: "harish.ragavendran@nexusres.com",
    customerPhone: "+91-94441-11005",
    customerAccountTier: "Standard Client",
    companyName: "Zenith Retail & Logistics",
    channel: "SOCIAL_MEDIA",
    channelReference: "Ingested from Twitter/X DM (@NexusSupport handle ref #X-90124)",
    subject: "Biometric attendance turnstile RFID outage caused false Loss-of-Pay deduction",
    description: "Gate-4 turnstile server was down on August 12-14. Central payroll marked 3 days as LOP resulting in an unwarranted ₹7,200 salary deduction.",
    category: "BILLING",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Billing, Payments & Invoicing",
    departmentId: 1,
    assignedAgentName: "Rajesh Narayanan",
    assignedAgentId: 2,
    actionTakenBy: "Rajesh Narayanan (Senior Support Lead - Billing)",
    actionTimestamp: "2026-08-28 17:10",
    actionNotes: "Cross-checked CCTV security turnstile tape and GitHub commits. Attendance records regularized.",
    claimedAmount: "₹7,200",
    originalClaimedAmount: "₹7,200",
    hrApprovedAmount: "₹7,200 LOP deduction reversed",
    isAmountAdjusted: false,
    amountAdjustmentReason: null,
    resolvedAmount: "₹7,200 LOP deduction reversed",
    resolutionSummary: "Attendance records regularized; LOP flags cleared in ERP; ₹7,200 credited in payroll adjustment.",
    createdAt: "2026-08-27 11:00",
    slaRemainingMinutes: 720,
    slaBreached: false,
    escalated: false,
    escalationTier: null,
    feedback: {
      rating: 4,
      npsScore: 8,
      fcr: true,
      comments: "Resolved accurately. Reversal was processed smoothly once CCTV proof was checked.",
      submittedAt: "2026-08-28 19:10"
    }
  },
  {
    id: 6,
    ticketNumber: "TKT-2026-000106",
    employeeId: "EMP-2006",
    customerId: "CUST-2006",
    customerName: "Divya Krishnan",
    customerEmail: "divya.krishnan@nexusres.com",
    customerPhone: "+91-94441-11006",
    customerAccountTier: "Corporate Business",
    companyName: "Omnex Analytics Corp.",
    channel: "MOBILE_APP",
    channelReference: "Nexus Resolution Mobile App for Android (v3.4.1 build #4092)",
    subject: "Client analytics dashboard API latency spiking above 8000ms on production endpoints",
    description: "Production API endpoint /v1/analytics/query is timing out with 504 Gateway errors for our European clients. SLA specifies sub-200ms p95 latency.",
    category: "TECHNICAL",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    departmentName: "Technical Support & Platform Systems",
    departmentId: 2,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (Lead Systems Engineer)",
    actionTimestamp: "2026-08-28 15:30",
    actionNotes: "Identified Postgres connection pool exhaustion on eu-west-1 cluster. Auto-scaling replica group and warm cache invalidation underway.",
    claimedAmount: "₹50,000 SLA penalty credit",
    originalClaimedAmount: "₹50,000 SLA penalty credit",
    hrApprovedAmount: "Under technical audit",
    isAmountAdjusted: false,
    amountAdjustmentReason: null,
    resolvedAmount: "Under active investigation",
    resolutionSummary: "Engineers patched database connection pool; testing p95 latency before final closure.",
    createdAt: "2026-08-28 08:45",
    slaRemainingMinutes: 45,
    slaBreached: false,
    escalated: false,
    escalationTier: null,
    feedback: null
  },
  {
    id: 7,
    ticketNumber: "TKT-2026-000107",
    employeeId: "EMP-2007",
    customerId: "CUST-2007",
    customerName: "Suresh Venkatesh",
    customerEmail: "suresh.venkatesh@nexusres.com",
    customerPhone: "+91-94441-11007",
    customerAccountTier: "Enterprise VIP",
    companyName: "Vanguard Systems Global",
    channel: "IN_PERSON",
    channelReference: "OMR Chennai Customer Redressal Lounge walk-in desk receipt #BR-0042",
    subject: "Consignment delivery damaged during transit with water damage to server chassis",
    description: "Consignment shipment #CON-8891 delivered to Vanguard campus had severe box puncture and water ingress. 2 high-density rack modules corrupted.",
    category: "LOGISTICS",
    priority: "HIGH",
    status: "ESCALATED",
    departmentName: "Logistics, Shipping & Order Fulfillment",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Priya (Chief Grievance Officer)",
    actionTimestamp: "2026-08-28 16:50",
    actionNotes: "Escalated to Tier-2 logistics leadership. Insurance claim filed with BlueDart logistics under marine inland transit policy.",
    claimedAmount: "₹1,85,000",
    originalClaimedAmount: "₹1,85,000",
    hrApprovedAmount: "₹1,85,000 replacement voucher",
    isAmountAdjusted: false,
    amountAdjustmentReason: null,
    resolvedAmount: "Under logistics replacement",
    resolutionSummary: "Transit insurance claim approved; replacement units scheduled for dispatch.",
    createdAt: "2026-08-27 15:00",
    slaRemainingMinutes: -120,
    slaBreached: true,
    escalated: true,
    escalationTier: "TIER_2",
    escalationReason: "High Financial Loss & VIP Customer Impact (Cargo Transit Damage)",
    escalatedTo: "Senthil Murugan (Logistics Lead)",
    escalatedAt: "2026-08-28 14:00",
    feedback: null
  },
  {
    id: 8,
    ticketNumber: "TKT-2026-000108",
    employeeId: "EMP-2008",
    customerId: "CUST-2008",
    customerName: "Deepa Subramanian",
    customerEmail: "deepa.subramanian@nexusres.com",
    customerPhone: "+91-94441-11008",
    customerAccountTier: "Corporate Business",
    companyName: "Meridian Financial Services",
    channel: "EMAIL",
    channelReference: "Direct email from CFO office: deepa.subramanian@nexusres.com",
    subject: "GST Input Tax Credit mismatch in quarterly electronic invoice portal",
    description: "GSTR-2B filing does not reflect ₹36,400 tax paid for Q1 infrastructure hosting due to incorrect GSTIN punch by vendor invoicing team.",
    category: "BILLING",
    priority: "MEDIUM",
    status: "NEW",
    departmentName: "Billing, Payments & Invoicing",
    departmentId: 1,
    assignedAgentName: "Rajesh Narayanan",
    assignedAgentId: 2,
    actionTakenBy: "Pending Initial Triage",
    actionTimestamp: null,
    actionNotes: null,
    claimedAmount: "₹36,400",
    originalClaimedAmount: "₹36,400",
    hrApprovedAmount: "Pending Tax Audit",
    isAmountAdjusted: false,
    amountAdjustmentReason: null,
    resolvedAmount: "In Review",
    resolutionSummary: null,
    createdAt: "2026-08-28 14:30",
    slaRemainingMinutes: 2400,
    slaBreached: false,
    escalated: false,
    escalationTier: null,
    feedback: null
  }
];

// Audit trail
const AUDIT_LOGS = [
  { id: 1, ticketNumber: "TKT-2026-000101", action: "CHANNEL_INGESTION", performedBy: "Nexus Omnichannel Parser (Email)", details: "Ticket parsed from support@nexusresolution.com. Priority CRITICAL (4h SLA).", timestamp: "2026-08-26 09:30" },
  { id: 2, ticketNumber: "TKT-2026-000101", action: "TICKET_ASSIGNED", performedBy: "Auto-Routing Engine", details: "Assigned to Rajesh Narayanan (Billing Queue) based on category: BILLING.", timestamp: "2026-08-26 09:32" },
  { id: 3, ticketNumber: "TKT-2026-000101", action: "RESOLVED", performedBy: "Rajesh Narayanan", details: "Duplicate charge reversed at gateway level; ₹14,800 refund voucher credited.", timestamp: "2026-08-27 14:15" },
  { id: 4, ticketNumber: "TKT-2026-000101", action: "CUSTOMER_FEEDBACK_RECORDED", performedBy: "Karthik Ramanathan (CUST-2001)", details: "Customer submitted CSAT rating: 5/5 Stars, NPS: 10/10. Remarks: 'Exceptional response speed!'", timestamp: "2026-08-27 16:30" },
  { id: 5, ticketNumber: "TKT-2026-000103", action: "CHANNEL_INGESTION", performedBy: "Customer Web Portal", details: "Complaint registered via online portal by Vignesh Balasubramanian (CUST-2003).", timestamp: "2026-08-25 10:00" },
  { id: 6, ticketNumber: "TKT-2026-000103", action: "SLA_BREACH_DETECTED", performedBy: "SLA Watchdog Daemon", details: "Resolution window of 24 hours exceeded by 240 minutes. Alert generated.", timestamp: "2026-08-28 11:30" },
  { id: 7, ticketNumber: "TKT-2026-000103", action: "ESCALATION_TRIGGERED", performedBy: "Senthil Murugan (Logistics Lead)", details: "Escalated to Tier-3 (Operations Management). Reason: SLA Deadline Exceeded for Relocation Settlement.", timestamp: "2026-08-28 12:00" },
  { id: 8, ticketNumber: "TKT-2026-000103", action: "COMPENSATION_AMOUNT_ADJUSTED_BY_HR", performedBy: "Priya (Chief Grievance Officer)", details: "Claimed amount of ₹42,500 capped at policy limit ₹32,000. Anti-inflation deduction: ₹10,500.", timestamp: "2026-08-28 16:20" }
];

// Messages
const MESSAGES = [
  { id: 1, complaintId: 1, senderName: "Rajesh Narayanan", senderEmail: "rajesh.narayanan@nexusres.com", body: "Hello Karthik, I have cross-verified the gateway transaction logs. The duplicate debit has been canceled and ₹14,800 is initiated back to your card.", isInternal: false, createdAt: "2026-08-26 11:00" },
  { id: 2, complaintId: 1, senderName: "Karthik Ramanathan", senderEmail: "karthik.ramanathan@nexusres.com", body: "Thank you Rajesh! I received the bank reversal SMS just now. Great speed.", isInternal: false, createdAt: "2026-08-26 12:15" },
  { id: 3, complaintId: 3, senderName: "Senthil Murugan", senderEmail: "senthil.support@nexusres.com", body: "Vignesh, your relocation file has been audited. Premium courier charges exceeded allowable standard rates so the final sanctioned total is ₹32,000.", isInternal: false, createdAt: "2026-08-28 13:10" }
];

// Customer Feedbacks
const FEEDBACKS = [
  { id: 1, ticketNumber: "TKT-2026-000101", customerName: "Karthik Ramanathan", customerEmail: "karthik.ramanathan@nexusres.com", rating: 5, npsScore: 10, fcr: true, comments: "Exceptional response speed! Refund hit our bank account within 3 hours. Great centralized tracking.", channel: "EMAIL", submittedAt: "2026-08-27 16:30" },
  { id: 2, ticketNumber: "TKT-2026-000102", customerName: "Ananya Sundaram", customerEmail: "ananya.sundaram@nexusres.com", rating: 5, npsScore: 9, fcr: true, comments: "Life-saving escalation! Priya handled the hospital desk directly when automated systems failed.", channel: "PHONE", submittedAt: "2026-08-27 18:00" },
  { id: 3, ticketNumber: "TKT-2026-000104", customerName: "Meenakshi Natarajan", customerEmail: "meenakshi.n@nexusres.com", rating: 5, npsScore: 10, fcr: true, comments: "Astounding turnaround time. Within 90 minutes I had a replacement workstation and zero lost sprint work.", channel: "LIVE_CHAT", submittedAt: "2026-08-28 16:45" },
  { id: 4, ticketNumber: "TKT-2026-000105", customerName: "Harish Ragavendran", customerEmail: "harish.ragavendran@nexusres.com", rating: 4, npsScore: 8, fcr: true, comments: "Resolved accurately. Reversal was processed smoothly once CCTV proof was checked.", channel: "SOCIAL_MEDIA", submittedAt: "2026-08-28 19:10" }
];

// =========================================================================
// 6. HELPER FUNCTIONS
// =========================================================================
function calculateSLA(complaint) {
  const priority = complaint.priority || 'MEDIUM';
  const rule = SLA_RULES.find(r => r.priority === priority) || SLA_RULES[2];
  const maxHours = rule.resolutionHours;
  const created = new Date(complaint.createdAt);
  const now = new Date();
  
  const elapsedMinutes = Math.floor((now - created) / (1000 * 60));
  const totalMinutes = maxHours * 60;
  const remaining = totalMinutes - elapsedMinutes;
  
  const isBreached = remaining <= 0;
  const isWarning = remaining > 0 && remaining <= (totalMinutes * 0.2);
  
  return {
    remainingMinutes: remaining,
    totalMinutes,
    isBreached,
    isWarning,
    statusText: isBreached ? 'BREACHED' : isWarning ? 'WARNING' : 'ON_TRACK',
    deadline: new Date(created.getTime() + totalMinutes * 60000).toISOString().replace('T', ' ').substring(0, 16)
  };
}

// =========================================================================
// 7. API ENDPOINTS
// =========================================================================

// 7.1 Dashboard Overview & Omnichannel Service Quality Metrics
app.get("/api/dashboard/statistics", (req, res) => {
  const total = COMPLAINTS.length;
  const resolved = COMPLAINTS.filter(c => c.status === "RESOLVED" || c.status === "CLOSED").length;
  const inProgress = COMPLAINTS.filter(c => c.status === "IN_PROGRESS" || c.status === "ASSIGNED").length;
  const escalated = COMPLAINTS.filter(c => c.escalated || c.status === "ESCALATED").length;
  const newTickets = COMPLAINTS.filter(c => c.status === "NEW").length;

  let breached = 0;
  let warning = 0;
  let onTrack = 0;

  COMPLAINTS.forEach(c => {
    if (c.status !== "RESOLVED" && c.status !== "CLOSED") {
      const sla = calculateSLA(c);
      if (sla.isBreached) breached++;
      else if (sla.isWarning) warning++;
      else onTrack++;
    }
  });

  // Channel Distribution
  const channelCounts = {};
  CHANNELS.forEach(ch => { channelCounts[ch.id] = 0; });
  COMPLAINTS.forEach(c => {
    const ch = c.channel || 'WEB_PORTAL';
    channelCounts[ch] = (channelCounts[ch] || 0) + 1;
  });

  // CSAT & NPS calculation
  const totalFeedbacks = FEEDBACKS.length;
  const avgCsat = totalFeedbacks > 0 
    ? (FEEDBACKS.reduce((acc, f) => acc + (f.rating || 5), 0) / totalFeedbacks).toFixed(1)
    : "4.8";

  const promoters = FEEDBACKS.filter(f => (f.npsScore || 9) >= 9).length;
  const detractors = FEEDBACKS.filter(f => (f.npsScore || 9) <= 6).length;
  const npsScore = totalFeedbacks > 0 
    ? Math.round(((promoters - detractors) / totalFeedbacks) * 100)
    : 75;

  const fcrCount = FEEDBACKS.filter(f => f.fcr !== false).length;
  const fcrRate = totalFeedbacks > 0 ? Math.round((fcrCount / totalFeedbacks) * 100) : 85;

  const slaComplianceRate = total > 0 ? Math.round(((total - breached) / total) * 100) : 94;

  res.json({
    totalTickets: total,
    resolvedTickets: resolved,
    inProgressTickets: inProgress,
    escalatedTickets: escalated,
    newTickets,
    slaBreachedTickets: breached,
    slaWarningTickets: warning,
    slaOnTrackTickets: onTrack,
    slaComplianceRate,
    avgCsat: parseFloat(avgCsat),
    npsScore,
    fcrRate,
    avgResolutionHours: "3.4h",
    channelCounts,
    channels: CHANNELS.map(ch => ({
      ...ch,
      count: channelCounts[ch.id] || 0,
      percentage: total > 0 ? Math.round(((channelCounts[ch.id] || 0) / total) * 100) : 0
    }))
  });
});

// 7.2 Get All Channels
app.get("/api/channels", (req, res) => {
  res.json(CHANNELS);
});

// 7.3 Get All Complaints with Filtering
app.get("/api/complaints", (req, res) => {
  const { channel, status, priority, departmentId, search, employeeId, customerId, escalated, slaBreached } = req.query;
  let list = [...COMPLAINTS];

  if (channel && channel !== "ALL") {
    list = list.filter(c => c.channel === channel);
  }
  if (status && status !== "ALL") {
    if (status === "ESCALATED") {
      list = list.filter(c => c.escalated || c.status === "ESCALATED");
    } else {
      list = list.filter(c => c.status === status);
    }
  }
  if (priority && priority !== "ALL") {
    list = list.filter(c => c.priority === priority);
  }
  if (departmentId && departmentId !== "ALL") {
    list = list.filter(c => c.departmentId.toString() === departmentId.toString());
  }
  if (escalated === "true") {
    list = list.filter(c => c.escalated);
  }
  if (slaBreached === "true") {
    list = list.filter(c => calculateSLA(c).isBreached);
  }
  if (employeeId || customerId) {
    const idToMatch = (employeeId || customerId).toLowerCase();
    list = list.filter(c => 
      (c.employeeId && c.employeeId.toLowerCase() === idToMatch) ||
      (c.customerId && c.customerId.toLowerCase() === idToMatch)
    );
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(c =>
      c.ticketNumber.toLowerCase().includes(q) ||
      (c.customerName && c.customerName.toLowerCase().includes(q)) ||
      (c.customerEmail && c.customerEmail.toLowerCase().includes(q)) ||
      (c.companyName && c.companyName.toLowerCase().includes(q)) ||
      (c.subject && c.subject.toLowerCase().includes(q)) ||
      (c.channel && c.channel.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  }

  // Refresh dynamic SLA status before returning
  list = list.map(c => {
    const sla = calculateSLA(c);
    return {
      ...c,
      slaStatus: sla.statusText,
      slaRemainingMinutes: sla.remainingMinutes,
      slaDeadline: sla.deadline,
      slaBreached: sla.isBreached
    };
  });

  list.sort((a, b) => b.id - a.id);
  res.json(list);
});

// 7.4 Complaint Details by ID or Ticket Number
app.get("/api/complaints/:id", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id || c.ticketNumber.toUpperCase() === req.params.id.toUpperCase());
  if (!complaint) return res.status(404).json({ error: "Complaint ticket not found" });

  const sla = calculateSLA(complaint);
  const enrichedComplaint = {
    ...complaint,
    slaStatus: sla.statusText,
    slaRemainingMinutes: sla.remainingMinutes,
    slaDeadline: sla.deadline,
    slaBreached: sla.isBreached
  };

  const messages = MESSAGES.filter(m => m.complaintId.toString() === complaint.id.toString());
  const auditTimeline = AUDIT_LOGS.filter(a => a.ticketNumber === complaint.ticketNumber);

  res.json({
    ticket: enrichedComplaint,
    messages,
    auditTimeline
  });
});

// 7.5 Register New Complaint (Centralized Intake across all channels)
app.post("/api/complaints", (req, res) => {
  const {
    channel = "WEB_PORTAL",
    channelReference,
    customerName,
    customerEmail,
    customerPhone,
    customerId,
    employeeId,
    customerAccountTier = "Standard Client",
    companyName,
    subject,
    description,
    category = "BILLING",
    priority = "HIGH",
    departmentId,
    claimedAmount,
    monetaryValue
  } = req.body;

  const now = new Date();
  const ticketNumber = `TKT-${now.getFullYear()}-${String(ticketSequence++).padStart(6, "0")}`;
  
  const deptObj = DEPARTMENTS.find(d => d.id === Number(departmentId)) || DEPARTMENTS[0];
  const agentObj = USERS.find(u => u.role === "HR" && u.departmentId === deptObj.id) || USERS[0];

  const rule = SLA_RULES.find(r => r.priority === priority) || SLA_RULES[1];
  const maxHours = rule.resolutionHours;

  const rawClaimed = claimedAmount || monetaryValue;
  const claimedFormatted = rawClaimed 
    ? (String(rawClaimed).startsWith('₹') ? String(rawClaimed) : `₹${Number(String(rawClaimed).replace(/[^0-9.]/g, '')).toLocaleString('en-IN')}`) 
    : (() => {
        const match = (description || '').match(/(?:₹|Rs\.?|INR)\s*([\d,]+)/i);
        return match && match[1] ? `₹${match[1]}` : null;
      })();

  const newTicket = {
    id: Date.now(),
    ticketNumber,
    customerId: customerId || employeeId || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
    employeeId: employeeId || customerId || "EMP-2001",
    customerName: customerName || "Corporate Account Lead",
    customerEmail: customerEmail || "customer@nexusres.com",
    customerPhone: customerPhone || "+91-98000-11000",
    customerAccountTier,
    companyName: companyName || "Client Enterprise",
    channel,
    channelReference: channelReference || `Intake received via ${channel}`,
    subject: subject || "Customer Service Issue",
    description: description || "",
    category,
    priority,
    status: "ASSIGNED",
    departmentName: deptObj.name,
    departmentId: deptObj.id,
    assignedAgentName: agentObj.fullName,
    assignedAgentId: agentObj.id,
    actionTakenBy: "Auto-Triage Initial Routing",
    actionTimestamp: now.toISOString().replace("T", " ").substring(0, 16),
    actionNotes: `Ingested via ${channel} and routed to ${deptObj.name}. Assigned to ${agentObj.fullName}.`,
    claimedAmount: claimedFormatted,
    originalClaimedAmount: claimedFormatted,
    hrApprovedAmount: claimedFormatted,
    isAmountAdjusted: false,
    amountAdjustmentReason: null,
    resolvedAmount: claimedFormatted || "Under Investigation",
    resolutionSummary: null,
    createdAt: now.toISOString().replace("T", " ").substring(0, 16),
    slaRemainingMinutes: maxHours * 60,
    slaBreached: false,
    escalated: false,
    escalationTier: null,
    feedback: null
  };

  COMPLAINTS.unshift(newTicket);

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber,
    action: "CHANNEL_INGESTION",
    performedBy: `Centralized Intake (${channel})`,
    details: `Complaint registered via ${channel}. Priority: ${priority} (${maxHours}h SLA). Customer: ${newTicket.customerName} (${newTicket.companyName}).`,
    timestamp: newTicket.createdAt
  });

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber,
    action: "TICKET_ASSIGNED",
    performedBy: "Intelligent Routing Engine",
    details: `Assigned to ${agentObj.fullName} (${deptObj.name})`,
    timestamp: newTicket.createdAt
  });

  res.json(newTicket);
});

// 7.6 Assign / Re-route Ticket to Support Agent or Department
app.post("/api/complaints/:id/assign", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id || c.ticketNumber === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { assignedAgentId, departmentId, assignmentNotes, assignedBy } = req.body;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);

  const targetAgent = USERS.find(u => u.id === Number(assignedAgentId) || u.employeeId === assignedAgentId);
  const targetDept = DEPARTMENTS.find(d => d.id === Number(departmentId));

  if (targetAgent) {
    complaint.assignedAgentId = targetAgent.id;
    complaint.assignedAgentName = targetAgent.fullName;
  }
  if (targetDept) {
    complaint.departmentId = targetDept.id;
    complaint.departmentName = targetDept.name;
  }

  if (complaint.status === "NEW") {
    complaint.status = "ASSIGNED";
  }

  const assigner = assignedBy || "Operations Dispatcher";
  const note = assignmentNotes || `Reassigned to ${complaint.assignedAgentName} in ${complaint.departmentName}`;

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber: complaint.ticketNumber,
    action: "TICKET_ASSIGNED",
    performedBy: assigner,
    details: note,
    timestamp: now
  });

  MESSAGES.push({
    id: MESSAGES.length + 1,
    complaintId: complaint.id,
    senderName: "Assignment Dispatcher",
    senderEmail: "dispatch@nexusres.com",
    isInternal: true,
    body: `[ROUTING UPDATE] Ticket assigned to ${complaint.assignedAgentName} (${complaint.departmentName}). Note: ${note}`,
    createdAt: now
  });

  res.json(complaint);
});

// 7.7 Escalate Complaint (Multi-Tier Escalation Workflow)
app.post("/api/complaints/:id/escalate", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id || c.ticketNumber === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { escalationTier = "TIER_2", escalationReason, escalatedTo, escalatedBy, notes } = req.body;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);

  complaint.escalated = true;
  complaint.status = "ESCALATED";
  complaint.escalationTier = escalationTier;
  complaint.escalationReason = escalationReason || "Service Level Agreement risk and client urgency";
  complaint.escalatedTo = escalatedTo || "Executive Operations Desk (Priya)";
  complaint.escalatedAt = now;

  // Elevate priority if not already critical
  if (escalationTier === "TIER_3" || escalationTier === "TIER_4") {
    complaint.priority = "CRITICAL";
  }

  const performer = escalatedBy || "Support Officer";

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber: complaint.ticketNumber,
    action: "ESCALATION_TRIGGERED",
    performedBy: performer,
    details: `Escalated to ${escalationTier} (${complaint.escalatedTo}). Reason: ${complaint.escalationReason}.${notes ? ` Notes: ${notes}` : ''}`,
    timestamp: now
  });

  MESSAGES.push({
    id: MESSAGES.length + 1,
    complaintId: complaint.id,
    senderName: "Escalations Management Desk",
    senderEmail: "escalations@nexusres.com",
    isInternal: false,
    body: `[HIGH-PRIORITY ESCALATION NOTICE] This complaint has been escalated to ${escalationTier} supervision (${complaint.escalatedTo}). Justification: ${complaint.escalationReason}. Immediate review is in progress.`,
    createdAt: now
  });

  res.json(complaint);
});

// 7.8 Support / HR Action Recorded
app.post("/api/complaints/:id/hr-action", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id || c.ticketNumber === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { hrName, hrEmployeeId, actionType, actionNotes, status, resolvedAmount, resolutionSummary, hrApprovedAmount, amountAdjustmentReason, isAmountAdjusted } = req.body;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);

  complaint.actionTakenBy = hrName ? `${hrName} (${hrEmployeeId || 'Support Officer'})` : "Support Officer";
  complaint.actionTimestamp = now;
  if (actionNotes) complaint.actionNotes = actionNotes;
  if (status) complaint.status = status;
  if (resolvedAmount) complaint.resolvedAmount = resolvedAmount;
  if (resolutionSummary) complaint.resolutionSummary = resolutionSummary;

  if (isAmountAdjusted || hrApprovedAmount) {
    complaint.isAmountAdjusted = true;
    complaint.hrApprovedAmount = hrApprovedAmount || resolvedAmount;
    if (amountAdjustmentReason) complaint.amountAdjustmentReason = amountAdjustmentReason;
    complaint.amountAdjustedBy = complaint.actionTakenBy;
    complaint.amountAdjustedAt = now;
  }

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber: complaint.ticketNumber,
    action: actionType || "SUPPORT_ACTION_RECORDED",
    performedBy: complaint.actionTakenBy,
    details: `${actionNotes || 'Action taken by support'}. Resolution: ${resolvedAmount || complaint.resolvedAmount || 'Pending'}`,
    timestamp: now
  });

  res.json(complaint);
});

// 7.9 Adjust Claim / Compensation Amount (Anti-Inflation Audit)
app.post("/api/complaints/:id/adjust-amount", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id || c.ticketNumber === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const newAmount = req.body.newAmount !== undefined ? req.body.newAmount : (req.body.approvedAmount !== undefined ? req.body.approvedAmount : req.body.amount);
  const adjustmentReason = req.body.adjustmentReason || req.body.reason;
  const { hrName, hrEmployeeId } = req.body;
  if (newAmount === undefined || newAmount === null || newAmount === '') {
    return res.status(400).json({ error: "New adjusted compensation amount is required" });
  }

  const now = new Date().toISOString().replace("T", " ").substring(0, 16);
  const rawNum = typeof newAmount === 'number' ? newAmount : parseFloat(String(newAmount).replace(/[^0-9.]/g, '')) || 0;
  const formattedAmount = String(newAmount).startsWith('₹') ? String(newAmount) : `₹${rawNum.toLocaleString('en-IN')}`;

  const previousAmount = complaint.hrApprovedAmount || complaint.claimedAmount || complaint.resolvedAmount || "₹0";
  if (!complaint.originalClaimedAmount) {
    complaint.originalClaimedAmount = complaint.claimedAmount || previousAmount;
  }

  complaint.hrApprovedAmount = formattedAmount;
  complaint.resolvedAmount = formattedAmount;
  complaint.isAmountAdjusted = true;
  complaint.amountAdjustmentReason = adjustmentReason || "Adjusted by support officer per verified corporate policy limits and invoice audit.";
  complaint.amountAdjustedBy = hrName ? `${hrName} (${hrEmployeeId || 'Support Lead'})` : "Support Lead";
  complaint.amountAdjustedAt = now;

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber: complaint.ticketNumber,
    action: "COMPENSATION_AMOUNT_ADJUSTED_BY_HR",
    performedBy: complaint.amountAdjustedBy,
    details: `Compensation amount changed from ${previousAmount} to ${formattedAmount}. Audit Note: ${complaint.amountAdjustmentReason}`,
    timestamp: now
  });

  MESSAGES.push({
    id: MESSAGES.length + 1,
    complaintId: complaint.id,
    senderName: hrName || "Financial Audit & Claims",
    senderEmail: "claims.audit@nexusres.com",
    isInternal: false,
    body: `[OFFICIAL COMPENSATION REVISION] Claimed figure has been reviewed and revised to ${formattedAmount} (Original: ${complaint.originalClaimedAmount || previousAmount}). Audit Justification: ${complaint.amountAdjustmentReason}`,
    createdAt: now
  });

  res.json(complaint);
});

// 7.10 Disburse Compensation / Refund Voucher & Mark Resolved
app.post("/api/complaints/:id/compensate", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id || c.ticketNumber === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const {
    amount,
    paymentMethod = "Corporate Instant IMPS / NEFT Gateway",
    beneficiaryAccount,
    settlementNotes,
    hrName,
    hrEmployeeId,
    transactionId,
    isAmountAdjusted,
    originalClaimedAmount,
    adjustmentReason
  } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Compensation amount is required" });
  }

  const now = new Date().toISOString().replace("T", " ").substring(0, 16);
  const txRef = transactionId || `TXN-NEX-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const rawNum = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 0;
  const formattedAmount = String(amount).startsWith('₹') ? String(amount) : `₹${rawNum.toLocaleString('en-IN')}`;

  const wasAdjusted = isAmountAdjusted || (originalClaimedAmount && originalClaimedAmount !== formattedAmount);
  if (wasAdjusted) {
    complaint.isAmountAdjusted = true;
    complaint.originalClaimedAmount = originalClaimedAmount || complaint.originalClaimedAmount || complaint.claimedAmount;
    complaint.amountAdjustmentReason = adjustmentReason || complaint.amountAdjustmentReason || "Sanctioned amount modified per policy limits.";
    complaint.amountAdjustedBy = hrName ? `${hrName} (${hrEmployeeId || 'Support Officer'})` : "Support Officer";
    complaint.amountAdjustedAt = now;
  }

  complaint.status = "RESOLVED";
  complaint.resolvedAmount = formattedAmount;
  complaint.hrApprovedAmount = formattedAmount;
  complaint.resolutionSummary = settlementNotes || `Official monetary settlement of ${formattedAmount} credited directly via corporate refund gateway (Ref: ${txRef}). Complaint resolved.`;
  complaint.actionTakenBy = hrName ? `${hrName} (${hrEmployeeId || 'Support Officer'})` : "Support Officer";
  complaint.actionTimestamp = now;
  complaint.actionNotes = `Settlement processed. Direct refund of ${formattedAmount} transferred to ${complaint.customerName} (${beneficiaryAccount || 'Bank A/c on file'}). Reference UTR: ${txRef}.`;

  complaint.compensationPayment = {
    paid: true,
    amount: formattedAmount,
    numericAmount: rawNum,
    transactionId: txRef,
    paymentMethod,
    beneficiaryName: complaint.customerName,
    beneficiaryEmployeeId: complaint.employeeId || complaint.customerId,
    beneficiaryAccount: beneficiaryAccount || `HDFC Corporate Salary A/C **${Math.floor(1000 + Math.random() * 9000)} (IFSC: HDFC0001242)`,
    paidAt: now,
    paidBy: complaint.actionTakenBy,
    settlementNotes: settlementNotes || "Assignment settlement processed through website portal",
    isAmountAdjusted: !!complaint.isAmountAdjusted,
    originalClaimedAmount: complaint.originalClaimedAmount || complaint.claimedAmount || formattedAmount,
    amountAdjustmentReason: complaint.amountAdjustmentReason || null
  };

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber: complaint.ticketNumber,
    action: "COMPENSATION_PAID_AND_RESOLVED",
    performedBy: complaint.actionTakenBy,
    details: `Settlement refund of ${formattedAmount}${wasAdjusted ? ` (Adjusted from ${complaint.originalClaimedAmount}: ${complaint.amountAdjustmentReason})` : ''} disbursed via (${paymentMethod}, UTR: ${txRef}). Ticket marked RESOLVED.`,
    timestamp: now
  });

  MESSAGES.push({
    id: MESSAGES.length + 1,
    complaintId: complaint.id,
    senderName: hrName || "Disbursements Authority",
    senderEmail: "refunds@nexusres.com",
    isInternal: false,
    body: `[SETTLEMENT CONFIRMATION] Monetary compensation of ${formattedAmount} has been disbursed to ${complaint.customerName}. Payment Mode: ${paymentMethod} | Reference UTR: ${txRef}. The complaint is officially RESOLVED.`,
    createdAt: now
  });

  res.json(complaint);
});

// 7.11 Resolve Complaint
app.post("/api/complaints/:id/resolve", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { resolutionSummary, resolvedAmount, hrName } = req.body;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);

  complaint.status = "RESOLVED";
  complaint.resolutionSummary = resolutionSummary || "Complaint resolved in accordance with corporate quality standards.";
  if (resolvedAmount) complaint.resolvedAmount = resolvedAmount;
  if (hrName) complaint.actionTakenBy = hrName;
  complaint.actionTimestamp = now;

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber: complaint.ticketNumber,
    action: "RESOLVED",
    performedBy: hrName || "Support Lead",
    details: `Resolved: ${complaint.resolutionSummary}. Settlement: ${complaint.resolvedAmount || 'Non-financial'}`,
    timestamp: now
  });

  res.json(complaint);
});

// 7.12 Add Thread Message
app.post("/api/complaints/:id/reply", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { message, isInternal, senderName, senderEmail } = req.body;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);

  const msg = {
    id: MESSAGES.length + 1,
    complaintId: complaint.id,
    senderName: senderName || "Support Representative",
    senderEmail: senderEmail || "support@nexusres.com",
    body: message || "",
    isInternal: !!isInternal,
    createdAt: now
  };
  MESSAGES.push(msg);

  res.json(msg);
});

// 7.13 Customer Feedback Submission (CSAT & NPS)
app.post("/api/complaints/:id/feedback", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id || c.ticketNumber === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { rating = 5, npsScore = 10, fcr = true, comments = "", customerName } = req.body;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);

  const fb = {
    id: FEEDBACKS.length + 1,
    ticketNumber: complaint.ticketNumber,
    customerName: customerName || complaint.customerName,
    customerEmail: complaint.customerEmail,
    channel: complaint.channel || "WEB_PORTAL",
    rating: Number(rating),
    npsScore: Number(npsScore),
    fcr: !!fcr,
    comments: comments || "Resolution was delivered promptly and effectively.",
    submittedAt: now
  };

  complaint.feedback = fb;
  FEEDBACKS.unshift(fb);

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber: complaint.ticketNumber,
    action: "CUSTOMER_FEEDBACK_RECORDED",
    performedBy: fb.customerName,
    details: `Customer Feedback: ${fb.rating}/5 Stars, NPS: ${fb.npsScore}/10, FCR: ${fb.fcr ? 'Yes' : 'No'}. Comments: "${fb.comments}"`,
    timestamp: now
  });

  res.json({ success: true, feedback: fb, complaint });
});

// 7.14 Get All Customer Feedback Records
app.get("/api/feedback", (req, res) => {
  res.json(FEEDBACKS);
});

// 7.15 Authentication (Login)
app.post("/api/auth/login", (req, res) => {
  const { employeeId, customerId, password } = req.body;
  const userIdentifier = (employeeId || customerId || '').trim().toUpperCase();
  const cleanPass = (password || '').trim();

  if (!userIdentifier || !cleanPass) {
    return res.status(400).json({ error: "Please enter your Account / Employee ID and Password." });
  }

  const user = USERS.find(u => 
    u.employeeId.toUpperCase() === userIdentifier || 
    (u.customerId && u.customerId.toUpperCase() === userIdentifier) ||
    (u.altId && u.altId.toUpperCase() === userIdentifier)
  );

  if (!user) {
    return res.status(401).json({ error: "Account ID not recognized. Please check your credentials or use the demo quick-login buttons." });
  }

  if (user.password !== cleanPass) {
    return res.status(401).json({ error: "Incorrect password for this account. Please verify and try again." });
  }

  return res.json({
    token: `nexus-jwt-${user.employeeId}-${Date.now()}`,
    employeeId: user.employeeId,
    customerId: user.customerId || user.employeeId,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    designation: user.designation,
    departmentId: user.departmentId,
    departmentName: user.departmentName,
    companyName: user.companyName || "Nexus Resolution",
    accountTier: user.accountTier || "Standard",
    phone: user.phone,
    avatar: user.avatar
  });
});

// 7.16 Get Users
app.get("/api/users", (req, res) => {
  const safeUsers = USERS.map(({ password, ...safeUser }) => safeUser);
  res.json(safeUsers);
});

// 7.17 Departments
app.get("/api/departments", (req, res) => {
  res.json(DEPARTMENTS);
});

// 7.18 SLA Rules
app.get("/api/sla/rules", (req, res) => {
  res.json(SLA_RULES);
});

// Serve static frontend files
app.use(express.static(__dirname));

// SPA fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Nexus Resolution Omnichannel Platform server running at http://0.0.0.0:${PORT}`);
});
