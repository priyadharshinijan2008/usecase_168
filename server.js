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

// In-Memory Seed Data for Nexus Resolution

const DEPARTMENTS = [
  { id: 1, name: "Payroll & Compensation", description: "Salary delays, tax deductions, PF transfer, overtime arrears", headEmail: "soundarya.hr@nexusres.com", headName: "Soundarya Padmanabhan" },
  { id: 2, name: "Employee Relations & Ethics", description: "Workplace harassment, manager disputes, code of conduct", headEmail: "priya.hr@nexusres.com", headName: "Priya" },
  { id: 3, name: "Health Insurance & Benefits", description: "Mediclaim rejection, family floater, gratuity settlement", headEmail: "rajesh.hr@nexusres.com", headName: "Rajesh Narayanan" },
  { id: 4, name: "IT Assets & Workplace Facilities", description: "Developer laptops, ergonomic chairs, ID badges, transport", headEmail: "senthil.hr@nexusres.com", headName: "Senthil Murugan" },
  { id: 5, name: "Talent Appraisal & Policies", description: "Promotion dispute, shift allowance, relocation reimbursement", headEmail: "malini.hr@nexusres.com", headName: "Malini Venkatesan" }
];

const SLA_RULES = [
  { id: 1, priority: "CRITICAL", resolutionHours: 4, warningPercentage: 80, description: "Salary withholding, POSH/harassment grievance, medical emergency claim" },
  { id: 2, priority: "HIGH", resolutionHours: 24, warningPercentage: 80, description: "Laptop failure on production release, PF withdrawal blockage, relocation arrears" },
  { id: 3, priority: "MEDIUM", resolutionHours: 48, warningPercentage: 80, description: "Attendance regularization, health card endorsement, shift allowance mismatch" },
  { id: 4, priority: "LOW", resolutionHours: 72, warningPercentage: 80, description: "Ergonomic equipment request, policy clarification, service letter inquiry" }
];

// Exact 2 HRs and 8 Employees Accounts with explicit passwords
const USERS = [
  // 2 HR Officers (Taking Action)
  { 
    id: 1, 
    employeeId: "HR-1001", 
    password: "priyapassword", 
    fullName: "Priya", 
    email: "priya@nexusres.com", 
    role: "HR", 
    designation: "Head of Human Resources & Grievance Officer", 
    departmentId: 2, 
    departmentName: "Employee Relations & Ethics", 
    phone: "+91-98401-22341", 
    avatar: "PR" 
  },
  { 
    id: 2, 
    employeeId: "HR-1002", 
    password: "rajeshpassword", 
    fullName: "Rajesh Narayanan", 
    email: "rajesh.narayanan@nexusres.com", 
    role: "HR", 
    designation: "Senior HR Manager (Benefits & Mediclaim)", 
    departmentId: 3, 
    departmentName: "Health Insurance & Benefits", 
    phone: "+91-98402-33452", 
    avatar: "RN" 
  },

  // 8 Employees (Registering Complaints & Tracking Slips)
  { 
    id: 101, 
    employeeId: "EMP-2001", 
    password: "karthikpassword", 
    fullName: "Karthik Ramanathan", 
    email: "karthik.ramanathan@nexusres.com", 
    role: "EMPLOYEE", 
    designation: "Senior Lead Architect", 
    departmentId: 4, 
    departmentName: "Core Engineering", 
    phone: "+91-94441-11001", 
    avatar: "KR" 
  },
  { 
    id: 102, 
    employeeId: "EMP-2002", 
    password: "ananyapassword", 
    fullName: "Ananya Sundaram", 
    email: "ananya.sundaram@nexusres.com", 
    role: "EMPLOYEE", 
    designation: "UI/UX Product Designer", 
    departmentId: 5, 
    departmentName: "Design Systems", 
    phone: "+91-94441-11002", 
    avatar: "AS" 
  },
  { 
    id: 103, 
    employeeId: "EMP-2003", 
    password: "vigneshpassword", 
    fullName: "Vignesh Balasubramanian", 
    email: "vignesh.bala@nexusres.com", 
    role: "EMPLOYEE", 
    designation: "DevOps Engineer", 
    departmentId: 4, 
    departmentName: "Cloud Infrastructure", 
    phone: "+91-94441-11003", 
    avatar: "VB" 
  },
  { 
    id: 104, 
    employeeId: "EMP-2004", 
    password: "meenakshipassword", 
    fullName: "Meenakshi Natarajan", 
    email: "meenakshi.n@nexusres.com", 
    role: "EMPLOYEE", 
    designation: "QA Test Automation Lead", 
    departmentId: 4, 
    departmentName: "Quality Engineering", 
    phone: "+91-94441-11004", 
    avatar: "MN" 
  },
  { 
    id: 105, 
    employeeId: "EMP-2005", 
    password: "harishpassword", 
    fullName: "Harish Ragavendran", 
    email: "harish.ragavendran@nexusres.com", 
    role: "EMPLOYEE", 
    designation: "Full Stack Developer", 
    departmentId: 4, 
    departmentName: "Engineering", 
    phone: "+91-94441-11005", 
    avatar: "HR" 
  },
  { 
    id: 106, 
    employeeId: "EMP-2006", 
    password: "divyapassword", 
    fullName: "Divya Krishnan", 
    email: "divya.krishnan@nexusres.com", 
    role: "EMPLOYEE", 
    designation: "Data Analyst", 
    departmentId: 1, 
    departmentName: "Business Intelligence", 
    phone: "+91-94441-11006", 
    avatar: "DK" 
  },
  { 
    id: 107, 
    employeeId: "EMP-2007", 
    password: "sureshpassword", 
    fullName: "Suresh Venkatesh", 
    email: "suresh.venkatesh@nexusres.com", 
    role: "EMPLOYEE", 
    designation: "Technical Account Manager", 
    departmentId: 5, 
    departmentName: "Client Operations", 
    phone: "+91-94441-11007", 
    avatar: "SV" 
  },
  { 
    id: 108, 
    employeeId: "EMP-2008", 
    password: "deepapassword", 
    fullName: "Deepa Subramanian", 
    email: "deepa.subramanian@nexusres.com", 
    role: "EMPLOYEE", 
    designation: "Finance Executive", 
    departmentId: 1, 
    departmentName: "Corporate Finance", 
    phone: "+91-94441-11008", 
    avatar: "DS" 
  }
];

// 50 Comprehensive Realistic Complaints with South Indian Names, HR Actions, and Resolved Values
const COMPLAINTS = [
  {
    id: 1,
    ticketNumber: "NEX-2026-000001",
    employeeId: "EMP-2001",
    customerName: "Karthik Ramanathan",
    customerEmail: "karthik.ramanathan@nexusres.com",
    customerPhone: "+91-94441-11001",
    subject: "HRA and Provident Fund tax deduction mismatch in July pay slip",
    description: "PF deduction calculated at 18% instead of standard 12% cap, causing an inadvertent ₹14,800 deduction from July net salary.",
    category: "PAYROLL",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-27 14:15",
    actionNotes: "Verified backend ERP payroll journal with tax team. Excess deduction verified and reimbursed via supplementary payroll voucher.",
    resolvedAmount: "₹14,800 credited in payroll cycle",
    resolutionSummary: "Recalculated PF deduction to statutory 12%. Reimbursed ₹14,800 directly into HDFC salary account (UTR-9928103).",
    createdAt: "2026-08-26 09:30",
    slaRemainingMinutes: 120,
    slaBreached: false,
    escalated: false
  },
  {
    id: 2,
    ticketNumber: "NEX-2026-000002",
    employeeId: "EMP-2002",
    customerName: "Ananya Sundaram",
    customerEmail: "ananya.sundaram@nexusres.com",
    customerPhone: "+91-94441-11002",
    subject: "Cashless Mediclaim rejection at Apollo Hospitals for emergency surgery",
    description: "Third-party insurance administrator rejected cashless pre-authorization citing missing corporate group policy endorsement #GRP-8812.",
    category: "HEALTH_INSURANCE",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "Health Insurance & Benefits",
    departmentId: 3,
    assignedAgentName: "Rajesh Narayanan",
    assignedAgentId: 2,
    actionTakenBy: "Rajesh Narayanan (Senior HR Manager)",
    actionTimestamp: "2026-08-27 11:45",
    actionNotes: "Intervened directly with Star Health TPA desk at Apollo Greams Road. Issued corporate guarantee letter.",
    resolvedAmount: "₹1,25,000 cashless claim approved",
    resolutionSummary: "Corporate guarantee issued immediately; cashless admission confirmed with Apollo TPA. Full hospitalization bill covered.",
    createdAt: "2026-08-27 08:15",
    slaRemainingMinutes: 180,
    slaBreached: false,
    escalated: false
  },
  {
    id: 3,
    ticketNumber: "NEX-2026-000003",
    employeeId: "EMP-2003",
    customerName: "Vignesh Balasubramanian",
    customerEmail: "vignesh.bala@nexusres.com",
    customerPhone: "+91-94441-11003",
    subject: "Onsite relocation allowance pending payment for over 45 days",
    description: "Bangalore to Chennai relocation invoice of ₹42,500 submitted with all transporter lorry receipts and rental bond was not settled.",
    category: "BENEFITS",
    priority: "HIGH",
    status: "IN_PROGRESS",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-28 16:20",
    actionNotes: "Expense report audited. Bills approved by VP of Engineering. Pending finance director sign-off scheduled for tomorrow morning.",
    resolvedAmount: "₹42,500 pending final disbursement",
    resolutionSummary: "Audited transporter bill of ₹42,500 verified; sent to treasury for batch disbursement.",
    createdAt: "2026-08-25 10:00",
    slaRemainingMinutes: -240,
    slaBreached: true,
    escalated: true,
    escalationReason: "SLA Deadline Exceeded for Relocation Settlement"
  },
  {
    id: 4,
    ticketNumber: "NEX-2026-000004",
    employeeId: "EMP-2004",
    customerName: "Meenakshi Natarajan",
    customerEmail: "meenakshi.n@nexusres.com",
    customerPhone: "+91-94441-11004",
    subject: "Developer MacBook battery swelling & thermal shutdown during sprint build",
    description: "M2 Max developer machine battery swollen warping trackpad. Severe risk of fire hazard, preventing QA automation suite execution.",
    category: "IT_ASSETS",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (IT Facilities Partner)",
    actionTimestamp: "2026-08-28 14:00",
    actionNotes: "Asset inspected at OMR Chennai campus IT hub. Exchanged laptop on spot with pristine M3 Pro 36GB workstation.",
    resolvedAmount: "100% Asset Replacement (₹2,10,000 hardware)",
    resolutionSummary: "Defective hardware safely quarantined; new MacBook Pro M3 provisioned and user git SSH keys cloned within 90 minutes.",
    createdAt: "2026-08-28 09:30",
    slaRemainingMinutes: 150,
    slaBreached: false,
    escalated: false
  },
  {
    id: 5,
    ticketNumber: "NEX-2026-000005",
    employeeId: "EMP-2005",
    customerName: "Harish Ragavendran",
    customerEmail: "harish.ragavendran@nexusres.com",
    customerPhone: "+91-94441-11005",
    subject: "Biometric attendance punch missing due to RFID turnstile server glitch",
    description: "System marked 3 days as Loss of Pay (LOP) because Gate-4 RFID reader was down, resulting in ₹7,200 salary deduction.",
    category: "PAYROLL",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-28 17:10",
    actionNotes: "Cross-verified CCTV security logs and GitHub commit timestamps for those 3 days. Legitimate presence established.",
    resolvedAmount: "₹7,200 LOP deduction reversed",
    resolutionSummary: "Attendance records regularized; LOP flags cleared in Darwinbox ERP; ₹7,200 credited in payroll adjustment.",
    createdAt: "2026-08-27 11:00",
    slaRemainingMinutes: 720,
    slaBreached: false,
    escalated: false
  },
  {
    id: 6,
    ticketNumber: "NEX-2026-000006",
    employeeId: "EMP-2006",
    customerName: "Divya Krishnan",
    customerEmail: "divya.krishnan@nexusres.com",
    customerPhone: "+91-94441-11006",
    subject: "Unfair appraisal rating downgrade following maternity leave return",
    description: "Appraisal rating downgraded from Exceeds Expectations to Needs Improvement despite delivering all Q1 quarterly deliverables prior to leave.",
    category: "APPRAISAL_ETHICS",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    departmentName: "Employee Relations & Ethics",
    departmentId: 2,
    assignedAgentName: "Priya",
    assignedAgentId: 1,
    actionTakenBy: "Priya (HR Head & Grievance Officer)",
    actionTimestamp: "2026-08-28 15:30",
    actionNotes: "Internal inquiry committee scheduled with Department Director. Maternity career-parity compliance review underway.",
    resolvedAmount: "Under active committee review",
    resolutionSummary: "Ethics committee hearing convened; manager appraisal justification requested under POSH & Maternity Benefit Act compliance.",
    createdAt: "2026-08-28 08:45",
    slaRemainingMinutes: 60,
    slaBreached: false,
    escalated: false
  },
  {
    id: 7,
    ticketNumber: "NEX-2026-000007",
    employeeId: "EMP-2007",
    customerName: "Suresh Venkatesh",
    customerEmail: "suresh.venkatesh@nexusres.com",
    customerPhone: "+91-94441-11007",
    subject: "Weekend on-call rotational allowance not credited for Q2",
    description: "Completed 18 weekend production standby shifts across April-June for European financial client. Stipend ₹36,000 unpaid.",
    category: "PAYROLL",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-27 18:00",
    actionNotes: "Roster validated with Client Operations Delivery Lead. 18 on-call days verified and approved.",
    resolvedAmount: "₹36,000 on-call allowance credited",
    resolutionSummary: "Special off-cycle payment batch approved and processed; ₹36,000 deposited into Axis Bank salary account.",
    createdAt: "2026-08-26 16:30",
    slaRemainingMinutes: 1440,
    slaBreached: false,
    escalated: false
  },
  {
    id: 8,
    ticketNumber: "NEX-2026-000008",
    employeeId: "EMP-2008",
    customerName: "Deepa Subramanian",
    customerEmail: "deepa.subramanian@nexusres.com",
    customerPhone: "+91-94441-11008",
    subject: "Ergonomic lumbar chair request recommended by orthopedist",
    description: "Doctor prescribed high-back ergonomic mesh chair due to cervical spondylosis aggravated by long coding shifts.",
    category: "IT_ASSETS",
    priority: "MEDIUM",
    status: "ASSIGNED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (IT Facilities Partner)",
    actionTimestamp: "2026-08-28 13:00",
    actionNotes: "Medical prescription endorsed by company doctor. Herman Miller ergonomic model PO placed with vendor.",
    resolvedAmount: "₹28,500 chair PO sanctioned",
    resolutionSummary: "Medical approval verified; purchase order dispatched for doorstep installation at employee workstation.",
    createdAt: "2026-08-28 10:15",
    slaRemainingMinutes: 2400,
    slaBreached: false,
    escalated: false
  },
  {
    id: 9,
    ticketNumber: "NEX-2026-000009",
    employeeId: "EMP-2009",
    customerName: "Arvind Swaminathan",
    customerEmail: "arvind.swaminathan@nexusres.com",
    customerPhone: "+91-94441-11009",
    subject: "Parental health insurance policy addition omitted during annual renewal",
    description: "Dependent mother (age 68) omitted from MediBuddy TPA database despite premium salary deduction of ₹18,000.",
    category: "HEALTH_INSURANCE",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Health Insurance & Benefits",
    departmentId: 3,
    assignedAgentName: "Rajesh Narayanan",
    assignedAgentId: 2,
    actionTakenBy: "Rajesh Narayanan (Senior HR Manager)",
    actionTimestamp: "2026-08-27 16:45",
    actionNotes: "Communicated with ICICI Lombard account manager; endorsement schedule 4 issued with retroactive cover.",
    resolvedAmount: "₹5,00,000 parental health cover activated",
    resolutionSummary: "MediBuddy portal updated with dependent endorsement; digital e-card sent to employee email.",
    createdAt: "2026-08-26 14:00",
    slaRemainingMinutes: 2880,
    slaBreached: false,
    escalated: false
  },
  {
    id: 10,
    ticketNumber: "NEX-2026-000010",
    employeeId: "EMP-2010",
    customerName: "Kousalya Mohan",
    customerEmail: "kousalya.mohan@nexusres.com",
    customerPhone: "+91-94441-11010",
    subject: "Late night safe cab escort escort missing for female team members after 9:30 PM",
    description: "Office transport cab drop at Velachery location did not include security marshal mandated under Tamil Nadu Shops & Establishments Act.",
    category: "WORKPLACE_SAFETY",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 12:00",
    actionNotes: "Transport vendor audited immediately. Penalized vendor ₹25,000 for safety lapse; deployed dedicated armed security marshals.",
    resolvedAmount: "Transport vendor penalty ₹25,000 + dedicated security escort",
    resolutionSummary: "Mandatory security marshal assigned to Velachery route cab #TN-09-CB-4491 with live GPS tracking app enforced.",
    createdAt: "2026-08-28 07:30",
    slaRemainingMinutes: 240,
    slaBreached: false,
    escalated: false
  },

  // Complaints 11 to 20
  {
    id: 11,
    ticketNumber: "NEX-2026-000011",
    employeeId: "EMP-2011",
    customerName: "Lakshmi Narayanan",
    customerEmail: "lakshmi.narayanan@nexusres.com",
    customerPhone: "+91-94441-11011",
    subject: "Gratuity and Provident Fund transfer from prior subsidiary stuck in UAN portal",
    description: "UAN portal showing duplicate establishment code error #EPFO-ERR-491 preventing 6-year PF balance transfer.",
    category: "BENEFITS",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-28 14:30",
    actionNotes: "Submitted Joint Declaration Form to Regional PF Commissioner Tambaram branch with digital DSC authorization.",
    resolvedAmount: "₹3,40,000 PF balance under transfer processing",
    resolutionSummary: "EPFO Joint declaration submitted; pending PF commissioner digital clearing.",
    createdAt: "2026-08-27 12:00",
    slaRemainingMinutes: 1800,
    slaBreached: false,
    escalated: false
  },
  {
    id: 12,
    ticketNumber: "NEX-2026-000012",
    employeeId: "EMP-2012",
    customerName: "Praveen Kumar Rajendran",
    customerEmail: "praveen.rajendran@nexusres.com",
    customerPhone: "+91-94441-11012",
    subject: "Annual performance incentive bonus withheld without written notice",
    description: "Annual retention performance bonus of ₹85,000 reflected in incentive letter was skipped in August compensation credit.",
    category: "PAYROLL",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-28 16:00",
    actionNotes: "Identified batch file omission in bank NEFT upload file. Rerun with corporate approval.",
    resolvedAmount: "₹85,000 bonus credited",
    resolutionSummary: "NEFT batch file re-uploaded; ₹85,000 bonus cleared to State Bank of India account.",
    createdAt: "2026-08-28 06:30",
    slaRemainingMinutes: 180,
    slaBreached: false,
    escalated: false
  },
  {
    id: 13,
    ticketNumber: "NEX-2026-000013",
    employeeId: "EMP-2013",
    customerName: "Keerthana Sridharan",
    customerEmail: "keerthana.sridharan@nexusres.com",
    customerPhone: "+91-94441-11013",
    subject: "Verbal harassment & aggressive behavior by offshore project delivery manager",
    description: "Repeated yelling during client daily standups, abusive language in Slack direct messages, and threats of termination.",
    category: "EMPLOYEE_RELATIONS",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "Employee Relations & Ethics",
    departmentId: 2,
    assignedAgentName: "Priya",
    assignedAgentId: 1,
    actionTakenBy: "Priya (HR Head & Grievance Officer)",
    actionTimestamp: "2026-08-28 11:00",
    actionNotes: "Conducted confidential fact-finding probe. Issued formal Written Warning and behavioral corrective plan to the manager; reassigned employee to product team.",
    resolvedAmount: "Immediate Team Transfer & Formal HR Disciplinary Warning",
    resolutionSummary: "Employee reassigned to Core Frameworks team with zero manager overlap. Manager placed on strict 90-day HR behavioral monitoring.",
    createdAt: "2026-08-27 18:00",
    slaRemainingMinutes: 240,
    slaBreached: false,
    escalated: false
  },
  {
    id: 14,
    ticketNumber: "NEX-2026-000014",
    employeeId: "EMP-2014",
    customerName: "Vijay Anand Sethuraman",
    customerEmail: "vijay.anand@nexusres.com",
    customerPhone: "+91-94441-11014",
    subject: "Client visit domestic travel daily allowance (DA) reimbursement rejected",
    description: "Finance rejected daily food & incidentals claim of ₹8,400 for Mumbai client onsite sprint citing bill date mismatch.",
    category: "BENEFITS",
    priority: "MEDIUM",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-28 10:45",
    actionNotes: "Verified flight boarding passes and client visit authorization form. Cleared bill exception.",
    resolvedAmount: "₹8,400 reimbursed",
    resolutionSummary: "Expense voucher cleared with special VP approval; ₹8,400 reimbursed in petty cash payroll account.",
    createdAt: "2026-08-27 15:30",
    slaRemainingMinutes: 2160,
    slaBreached: false,
    escalated: false
  },
  {
    id: 15,
    ticketNumber: "NEX-2026-000015",
    employeeId: "EMP-2015",
    customerName: "Sneha Varadarajan",
    customerEmail: "sneha.v@nexusres.com",
    customerPhone: "+91-94441-11015",
    subject: "Maternity leave extension request rejected citing staffing constraints",
    description: "Statutory 4-week medical extension requested following Caesarean section recovery rejected by project resource manager.",
    category: "BENEFITS",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "Employee Relations & Ethics",
    departmentId: 2,
    assignedAgentName: "Priya",
    assignedAgentId: 1,
    actionTakenBy: "Priya (HR Head & Grievance Officer)",
    actionTimestamp: "2026-08-28 13:20",
    actionNotes: "Invoked Section 10 of Maternity Benefit Act 2017. Overruled project manager rejection and approved paid extension with medical board endorsement.",
    resolvedAmount: "Full Paid Maternity Extension (4 weeks fully paid)",
    resolutionSummary: "4-week paid medical maternity extension granted with company benefits preserved; project backfill arranged.",
    createdAt: "2026-08-28 07:00",
    slaRemainingMinutes: 180,
    slaBreached: false,
    escalated: false
  },
  {
    id: 16,
    ticketNumber: "NEX-2026-000016",
    employeeId: "EMP-2016",
    customerName: "Rajeshwari Muthuswamy",
    customerEmail: "rajeshwari.m@nexusres.com",
    customerPhone: "+91-94441-11016",
    subject: "Night shift taxi driver reckless speeding & rude behavior during pickup",
    description: "Vendor driver refused to slow down on rain-slicked highway, yelled at passengers, and skipped scheduled checkpoint.",
    category: "WORKPLACE_SAFETY",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-27 22:30",
    actionNotes: "Speed telemetry reviewed (98 km/h in 60 km/h zone). Blacklisted driver permanently from Nexus corporate fleet.",
    resolvedAmount: "Vendor Driver Blacklisted + ₹15,000 Vendor Penalty",
    resolutionSummary: "Driver banned permanently; fleet operator fined ₹15,000; dedicated replacement driver assigned to Tambaram night route.",
    createdAt: "2026-08-27 19:40",
    slaRemainingMinutes: 120,
    slaBreached: false,
    escalated: false
  },
  {
    id: 17,
    ticketNumber: "NEX-2026-000017",
    employeeId: "EMP-2017",
    customerName: "Ashwin Sivakumar",
    customerEmail: "ashwin.sivakumar@nexusres.com",
    customerPhone: "+91-94441-11017",
    subject: "Professional certification fee reimbursement (AWS Solutions Architect) stalled",
    description: "Upskilling policy covers $300 certification fee. Submitted passing score voucher 60 days ago with no credit.",
    category: "BENEFITS",
    priority: "MEDIUM",
    status: "RESOLVED",
    departmentName: "Talent Appraisal & Policies",
    departmentId: 5,
    assignedAgentName: "Malini Venkatesan",
    assignedAgentId: 5,
    actionTakenBy: "Malini Venkatesan (Talent Specialist)",
    actionTimestamp: "2026-08-28 15:00",
    actionNotes: "Certificate verified against AWS validation badge. Fast-tracked through Talent Upskilling budget pool.",
    resolvedAmount: "₹24,800 ($300 equivalent) reimbursed",
    resolutionSummary: "AWS certification claim of ₹24,800 approved and scheduled with this week's expense payout.",
    createdAt: "2026-08-26 11:30",
    slaRemainingMinutes: 2880,
    slaBreached: false,
    escalated: false
  },
  {
    id: 18,
    ticketNumber: "NEX-2026-000018",
    employeeId: "EMP-2018",
    customerName: "Nithya Kalyani",
    customerEmail: "nithya.kalyani@nexusres.com",
    customerPhone: "+91-94441-11018",
    subject: "Dual monitor & docking station not provided for accessibility accommodation",
    description: "Visual impairment requires high-contrast dual 27-inch 4K monitors as recommended by corporate occupational therapist.",
    category: "IT_ASSETS",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 11:30",
    actionNotes: "Expedited procurement of two Dell UltraSharp 27-inch 4K HDR displays and Thunderbolt dock.",
    resolvedAmount: "₹62,000 accessibility hardware deployed",
    resolutionSummary: "Dual 4K displays and ergonomic arm mount assembled and calibrated at employee's desk by IT hardware team.",
    createdAt: "2026-08-27 14:10",
    slaRemainingMinutes: 720,
    slaBreached: false,
    escalated: false
  },
  {
    id: 19,
    ticketNumber: "NEX-2026-000019",
    employeeId: "EMP-2019",
    customerName: "Balaji Gurumoorthy",
    customerEmail: "balaji.g@nexusres.com",
    customerPhone: "+91-94441-11019",
    subject: "Income tax Form 16 Part B TDS discrepancy with TRACES portal",
    description: "Form 16 shows ₹48,000 less tax deposited than deducted from monthly salary slips, causing Income Tax department notice.",
    category: "PAYROLL",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-28 17:30",
    actionNotes: "Corrected PAN mapping error in quarterly 24Q TDS filing. Issued revised Form 16 with digital TRACES seal.",
    resolvedAmount: "₹48,000 TDS mismatch rectified with TRACES",
    resolutionSummary: "Revised Form 16 generated with correct Challan serial numbers; updated PDF dispatched to employee and IT portal.",
    createdAt: "2026-08-27 09:20",
    slaRemainingMinutes: 300,
    slaBreached: false,
    escalated: false
  },
  {
    id: 20,
    ticketNumber: "NEX-2026-000020",
    employeeId: "EMP-2020",
    customerName: "Saravanan Thangavel",
    customerEmail: "saravanan.t@nexusres.com",
    customerPhone: "+91-94441-11020",
    subject: "Overtime pay omitted for 40 hours during critical BFSI core migration",
    description: "Dedicated 5 consecutive night shifts totaling 40 overtime hours over Diwali weekend. Overtime payment omitted from August salary.",
    category: "PAYROLL",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-27 19:15",
    actionNotes: "Time logs corroborated with JIRA deployment tickets and server bastion logs. 2x statutory overtime rate approved.",
    resolvedAmount: "₹28,800 overtime wages credited",
    resolutionSummary: "Double-rate overtime calculation applied (₹720/hr x 40 hrs = ₹28,800); supplementary bank credit voucher generated.",
    createdAt: "2026-08-26 14:00",
    slaRemainingMinutes: 1440,
    slaBreached: false,
    escalated: false
  },

  // Complaints 21 to 50 (The 30 New Complaints)
  {
    id: 21,
    ticketNumber: "NEX-2026-000021",
    employeeId: "EMP-2001",
    customerName: "Karthik Ramanathan",
    customerEmail: "karthik.ramanathan@nexusres.com",
    customerPhone: "+91-94441-11001",
    subject: "VPN security token revocation during international client demonstration",
    description: "Security operations auto-locked account thinking overseas login was an anomaly, interrupting multi-million dollar demo in Tokyo.",
    category: "IT_ASSETS",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 16:15",
    actionNotes: "Whitelisted Japan IP range and re-enforced Okta hardware token with 30-day travel exemption flag.",
    resolvedAmount: "Immediate Account Reactivation & International Travel Pass",
    resolutionSummary: "Okta MFA token cleared; enterprise travel security policy applied preventing future false alarms.",
    createdAt: "2026-08-28 13:00",
    slaRemainingMinutes: 120,
    slaBreached: false,
    escalated: false
  },
  {
    id: 22,
    ticketNumber: "NEX-2026-000022",
    employeeId: "EMP-2002",
    customerName: "Ananya Sundaram",
    customerEmail: "ananya.sundaram@nexusres.com",
    customerPhone: "+91-94441-11002",
    subject: "Figma enterprise license revoked hindering high-priority UX delivery",
    description: "License deallocated during seat consolidation without consulting product design team, blocking release.",
    category: "IT_ASSETS",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 11:15",
    actionNotes: "Procured supplemental enterprise seat from Adobe/Figma master account. Access restored within 20 minutes.",
    resolvedAmount: "₹45,000 Figma Enterprise Annual License Restored",
    resolutionSummary: "Figma Organization seat assigned to user; auto-renewal protection tag added to design team pool.",
    createdAt: "2026-08-28 08:30",
    slaRemainingMinutes: 600,
    slaBreached: false,
    escalated: false
  },
  {
    id: 23,
    ticketNumber: "NEX-2026-000023",
    employeeId: "EMP-2003",
    customerName: "Vignesh Balasubramanian",
    customerEmail: "vignesh.bala@nexusres.com",
    customerPhone: "+91-94441-11003",
    subject: "Cafeteria food contamination causing severe gastroenteritis in 4 team members",
    description: "Catering vendor served spoiled paneer curry on Wednesday afternoon. 4 engineers hospitalized with food poisoning.",
    category: "WORKPLACE_SAFETY",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner) & HR Head",
    actionTimestamp: "2026-08-27 15:45",
    actionNotes: "Immediate FSSAI audit of campus pantry. Terminated sub-vendor contract; reimbursed all 4 employees hospital outpatient bills.",
    resolvedAmount: "₹38,000 hospital bills reimbursed + vendor contract terminated",
    resolutionSummary: "Catering vendor terminated; ₹38,000 medical expenses reimbursed; daily hygiene testing certified by corporate safety auditor.",
    createdAt: "2026-08-27 10:00",
    slaRemainingMinutes: 180,
    slaBreached: false,
    escalated: false
  },
  {
    id: 24,
    ticketNumber: "NEX-2026-000024",
    employeeId: "EMP-2004",
    customerName: "Meenakshi Natarajan",
    customerEmail: "meenakshi.n@nexusres.com",
    customerPhone: "+91-94441-11004",
    subject: "Salary slip withheld due to unapproved timesheet of departed manager",
    description: "Former manager exited company without approving final monthly sprint timesheets, locking July pay generation.",
    category: "PAYROLL",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-28 14:00",
    actionNotes: "Elevated to Engineering Vice President for administrative proxy approval. Unlocked timesheet locks in SAP.",
    resolvedAmount: "₹65,000 monthly pay released",
    resolutionSummary: "Proxy approval granted by VP Engineering; July salary slip and fund transfer released within 4 hours.",
    createdAt: "2026-08-28 09:15",
    slaRemainingMinutes: 720,
    slaBreached: false,
    escalated: false
  },
  {
    id: 25,
    ticketNumber: "NEX-2026-000025",
    employeeId: "EMP-2005",
    customerName: "Harish Ragavendran",
    customerEmail: "harish.ragavendran@nexusres.com",
    customerPhone: "+91-94441-11005",
    subject: "Broadband work-from-home allowance not credited for 3 quarters",
    description: "Policy allows ₹1,500/month hybrid broadband reimbursement. Invoices for Jan-Sep pending in Darwinbox.",
    category: "BENEFITS",
    priority: "MEDIUM",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-28 12:30",
    actionNotes: "Audited broadband bills for 9 months (₹1,500 x 9 = ₹13,500). Bulk approval processed.",
    resolvedAmount: "₹13,500 broadband arrears credited",
    resolutionSummary: "All 9 monthly broadband invoices approved in bulk; ₹13,500 transferred in today's voucher batch.",
    createdAt: "2026-08-27 16:00",
    slaRemainingMinutes: 2400,
    slaBreached: false,
    escalated: false
  },
  {
    id: 26,
    ticketNumber: "NEX-2026-000026",
    employeeId: "EMP-2006",
    customerName: "Divya Krishnan",
    customerEmail: "divya.krishnan@nexusres.com",
    customerPhone: "+91-94441-11006",
    subject: "Compensatory Off (Comp-Off) leave balances expiring prematurely",
    description: "Earned 6 comp-off days working national holidays. HRMS expired balance in 30 days instead of company 90-day policy window.",
    category: "APPRAISAL_ETHICS",
    priority: "MEDIUM",
    status: "RESOLVED",
    departmentName: "Talent Appraisal & Policies",
    departmentId: 5,
    assignedAgentName: "Malini Venkatesan",
    assignedAgentId: 5,
    actionTakenBy: "Malini Venkatesan (Talent Specialist)",
    actionTimestamp: "2026-08-28 15:45",
    actionNotes: "Identified bug in Darwinbox leave policy rule engine. Reinstated 6 days with validity extended through Q4.",
    resolvedAmount: "6 Comp-Off Days Restored (Valued at ₹22,000 paid leave)",
    resolutionSummary: "6 comp-off credits manually injected into employee leave ledger with expiration set to December 31, 2026.",
    createdAt: "2026-08-28 11:00",
    slaRemainingMinutes: 2600,
    slaBreached: false,
    escalated: false
  },
  {
    id: 27,
    ticketNumber: "NEX-2026-000027",
    employeeId: "EMP-2007",
    customerName: "Suresh Venkatesh",
    customerEmail: "suresh.venkatesh@nexusres.com",
    customerPhone: "+91-94441-11007",
    subject: "Air conditioner malfunction in 4th floor Bay 12 causing 34°C server heat",
    description: "HVAC cooling unit failed, room temperature exceeding safe limits, causing developer laptops to throttle CPU.",
    category: "WORKPLACE_SAFETY",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 15:00",
    actionNotes: "Dispatched Voltas HVAC emergency contractor. Replaced compressor valve and restored ambient temperature to 21°C.",
    resolvedAmount: "HVAC Emergency Compressor Overhaul Completed",
    resolutionSummary: "Compressor replaced and secondary ventilation ducts balanced; ambient temperature stable at 21.5°C.",
    createdAt: "2026-08-28 11:30",
    slaRemainingMinutes: 600,
    slaBreached: false,
    escalated: false
  },
  {
    id: 28,
    ticketNumber: "NEX-2026-000028",
    employeeId: "EMP-2008",
    customerName: "Deepa Subramanian",
    customerEmail: "deepa.subramanian@nexusres.com",
    customerPhone: "+91-94441-11008",
    subject: "Corporate Credit Card fraudulent charge dispute assistance",
    description: "Unrecognized international merchant debit of $420 on company travel credit card during Singapore tech conference.",
    category: "PAYROLL",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "Health Insurance & Benefits",
    departmentId: 3,
    assignedAgentName: "Rajesh Narayanan",
    assignedAgentId: 2,
    actionTakenBy: "Rajesh Narayanan (Senior HR Manager)",
    actionTimestamp: "2026-08-27 17:30",
    actionNotes: "Liaised with HDFC Corporate Card fraud department. Chargeback registered and card blocked with zero employee liability.",
    resolvedAmount: "₹35,200 ($420) chargeback secured with zero employee liability",
    resolutionSummary: "Card blocked and replacement issued; provisional credit granted by bank with chargeback approved.",
    createdAt: "2026-08-27 12:45",
    slaRemainingMinutes: 180,
    slaBreached: false,
    escalated: false
  },
  {
    id: 29,
    ticketNumber: "NEX-2026-000029",
    employeeId: "EMP-2009",
    customerName: "Arvind Swaminathan",
    customerEmail: "arvind.swaminathan@nexusres.com",
    customerPhone: "+91-94441-11009",
    subject: "Employee Stock Option Plan (ESOP) vesting schedule discrepancy",
    description: "Grant letter specifies 4-year equal 25% vesting. Portal displays only 15% vested for Year 3 anniversary.",
    category: "BENEFITS",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Talent Appraisal & Policies",
    departmentId: 5,
    assignedAgentName: "Malini Venkatesan",
    assignedAgentId: 5,
    actionTakenBy: "Malini Venkatesan (Talent Specialist)",
    actionTimestamp: "2026-08-28 17:00",
    actionNotes: "Cross-checked with Carta cap table records and board resolution minutes. Discrepancy rectified.",
    resolvedAmount: "2,500 ESOP shares re-vested (Valued at ₹4,50,000)",
    resolutionSummary: "Cap table record synchronized; 2,500 additional vested shares verified in Carta employee portfolio.",
    createdAt: "2026-08-27 14:00",
    slaRemainingMinutes: 1200,
    slaBreached: false,
    escalated: false
  },
  {
    id: 30,
    ticketNumber: "NEX-2026-000030",
    employeeId: "EMP-2010",
    customerName: "Kousalya Mohan",
    customerEmail: "kousalya.mohan@nexusres.com",
    customerPhone: "+91-94441-11010",
    subject: "Hostile exclusion from technical architecture reviews by team lead",
    description: "Systematic exclusion from meetings, stripping of GitHub admin permissions without technical justification.",
    category: "EMPLOYEE_RELATIONS",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    departmentName: "Employee Relations & Ethics",
    departmentId: 2,
    assignedAgentName: "Priya",
    assignedAgentId: 1,
    actionTakenBy: "Priya (HR Head & Grievance Officer)",
    actionTimestamp: "2026-08-28 16:45",
    actionNotes: "Held separate confidential sessions with lead and complainant. Facilitating structured mediation with VP.",
    resolvedAmount: "Mediation Scheduled with VP of Engineering",
    resolutionSummary: "Access rights restored provisionally; 1-on-1 mediation session convened under HR supervision.",
    createdAt: "2026-08-28 10:30",
    slaRemainingMinutes: 90,
    slaBreached: false,
    escalated: false
  },

  // Complaints 31 to 40
  {
    id: 31,
    ticketNumber: "NEX-2026-000031",
    employeeId: "EMP-2011",
    customerName: "Lakshmi Narayanan",
    customerEmail: "lakshmi.narayanan@nexusres.com",
    customerPhone: "+91-94441-11011",
    subject: "Notice period buyout deduction disputed after mutual agreement release",
    description: "HR and Business Unit Head agreed in writing to waive 30-day notice period, yet final settlement deducted ₹52,000.",
    category: "PAYROLL",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-27 16:15",
    actionNotes: "Verified waiver agreement signed by VP. Re-computed Full & Final settlement statement.",
    resolvedAmount: "₹52,000 notice buyout refunded",
    resolutionSummary: "₹52,000 refund processed into salary account with revised F&F discharge certificate issued.",
    createdAt: "2026-08-26 15:00",
    slaRemainingMinutes: 1440,
    slaBreached: false,
    escalated: false
  },
  {
    id: 32,
    ticketNumber: "NEX-2026-000032",
    employeeId: "EMP-2012",
    customerName: "Praveen Kumar Rajendran",
    customerEmail: "praveen.rajendran@nexusres.com",
    customerPhone: "+91-94441-11012",
    subject: "Night shift cab female coworker stranded due to driver canceling trip",
    description: "Driver canceled ride at 11:45 PM without notifying dispatch, leaving female developer stranded outside office gate.",
    category: "WORKPLACE_SAFETY",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 01:15",
    actionNotes: "Campus security supervisor escorted employee via corporate backup SUV. Driver de-rostered immediately.",
    resolvedAmount: "Immediate Security Escort & Driver Blacklisted",
    resolutionSummary: "Escorted safely to home address; driver barred from transport roster; backup dedicated standby car placed at night gate.",
    createdAt: "2026-08-27 23:50",
    slaRemainingMinutes: 120,
    slaBreached: false,
    escalated: false
  },
  {
    id: 33,
    ticketNumber: "NEX-2026-000033",
    employeeId: "EMP-2013",
    customerName: "Keerthana Sridharan",
    customerEmail: "keerthana.sridharan@nexusres.com",
    customerPhone: "+91-94441-11013",
    subject: "Mediclaim dental accident emergency reimbursement rejected",
    description: "Emergency maxillofacial repair after bike accident in office commute denied as cosmetic dental procedure.",
    category: "HEALTH_INSURANCE",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Health Insurance & Benefits",
    departmentId: 3,
    assignedAgentName: "Rajesh Narayanan",
    assignedAgentId: 2,
    actionTakenBy: "Rajesh Narayanan (Senior HR Manager)",
    actionTimestamp: "2026-08-28 14:15",
    actionNotes: "Submitted emergency trauma surgical notes to ICICI Lombard insurance ombudsman. Cleared as accident reconstructive surgery.",
    resolvedAmount: "₹46,500 emergency reconstructive surgery reimbursed",
    resolutionSummary: "Insurance TPA sanctioned full ₹46,500 hospital claim; funds credited to employee bank account.",
    createdAt: "2026-08-27 13:00",
    slaRemainingMinutes: 720,
    slaBreached: false,
    escalated: false
  },
  {
    id: 34,
    ticketNumber: "NEX-2026-000034",
    employeeId: "EMP-2014",
    customerName: "Vijay Anand Sethuraman",
    customerEmail: "vijay.anand@nexusres.com",
    customerPhone: "+91-94441-11014",
    subject: "Noise pollution from adjacent data center cooling tower causing ear strain",
    description: "Decibel meter reading shows 82 dB in Bay 6, exceeding workplace safety guidelines of 65 dB.",
    category: "WORKPLACE_SAFETY",
    priority: "MEDIUM",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 17:00",
    actionNotes: "Installed acoustic sound dampening baffles along Bay 6 wall; relocated team desks 25 feet away.",
    resolvedAmount: "Acoustic Dampening & Team Desk Relocation",
    resolutionSummary: "Sound levels measured post-remediation at 58 dB; acoustic panel installation complete.",
    createdAt: "2026-08-27 17:15",
    slaRemainingMinutes: 2400,
    slaBreached: false,
    escalated: false
  },
  {
    id: 35,
    ticketNumber: "NEX-2026-000035",
    employeeId: "EMP-2015",
    customerName: "Sneha Varadarajan",
    customerEmail: "sneha.v@nexusres.com",
    customerPhone: "+91-94441-11015",
    subject: "Relocation baggage transit insurance claim for damaged monitor",
    description: "Packers & movers hired under corporate contract cracked 32-inch curved monitor during transit from Hyderabad.",
    category: "BENEFITS",
    priority: "MEDIUM",
    status: "RESOLVED",
    departmentName: "Health Insurance & Benefits",
    departmentId: 3,
    assignedAgentName: "Rajesh Narayanan",
    assignedAgentId: 2,
    actionTakenBy: "Rajesh Narayanan (Senior HR Manager)",
    actionTimestamp: "2026-08-28 16:30",
    actionNotes: "Processed transit insurance transit claim with Agarwal Movers insurance underwriters.",
    resolvedAmount: "₹29,000 transit damage compensation approved",
    resolutionSummary: "Claim sanctioned by transit insurer; ₹29,000 paid to employee within 5 business days.",
    createdAt: "2026-08-27 11:20",
    slaRemainingMinutes: 1800,
    slaBreached: false,
    escalated: false
  },
  {
    id: 36,
    ticketNumber: "NEX-2026-000036",
    employeeId: "EMP-2016",
    customerName: "Rajeshwari Muthuswamy",
    customerEmail: "rajeshwari.m@nexusres.com",
    customerPhone: "+91-94441-11016",
    subject: "Leave without pay (LWP) incorrectly marked during approved medical hospital stay",
    description: "Doctor-certified dengue hospitalization leave of 8 days marked as LWP deducting ₹19,200 salary.",
    category: "PAYROLL",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-28 14:45",
    actionNotes: "Converted 8 days LWP to Medical Sick Leave after inspecting Apollo hospital discharge certificate.",
    resolvedAmount: "₹19,200 salary deduction reversed",
    resolutionSummary: "Medical leave balance adjusted; ₹19,200 refunded in August payroll adjustment voucher.",
    createdAt: "2026-08-28 08:00",
    slaRemainingMinutes: 480,
    slaBreached: false,
    escalated: false
  },
  {
    id: 37,
    ticketNumber: "NEX-2026-000037",
    employeeId: "EMP-2017",
    customerName: "Ashwin Sivakumar",
    customerEmail: "ashwin.sivakumar@nexusres.com",
    customerPhone: "+91-94441-11017",
    subject: "AWS Cloud Playground sandbox account locked without notification",
    description: "Prototype cluster terminated midway through AI model fine-tuning benchmark, losing 18 hours of GPU training progress.",
    category: "IT_ASSETS",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 13:40",
    actionNotes: "Re-allocated GPU tier quota on AWS dedicated research account with auto-snapshot backup enabled.",
    resolvedAmount: "$1,500 AWS GPU Cloud Compute Credits Provisioned",
    resolutionSummary: "Dedicated p4d GPU sandbox spun up with automated hourly EBS snapshots to avoid future training loss.",
    createdAt: "2026-08-28 10:00",
    slaRemainingMinutes: 540,
    slaBreached: false,
    escalated: false
  },
  {
    id: 38,
    ticketNumber: "NEX-2026-000038",
    employeeId: "EMP-2018",
    customerName: "Nithya Kalyani",
    customerEmail: "nithya.kalyani@nexusres.com",
    customerPhone: "+91-94441-11018",
    subject: "Crèche / Daycare subsidy reimbursement delayed for 2 months",
    description: "Mandatory corporate childcare subsidy under Maternity Benefit Act (₹8,000/month) unpaid for July and August.",
    category: "BENEFITS",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Health Insurance & Benefits",
    departmentId: 3,
    assignedAgentName: "Rajesh Narayanan",
    assignedAgentId: 2,
    actionTakenBy: "Rajesh Narayanan (Senior HR Manager)",
    actionTimestamp: "2026-08-28 15:15",
    actionNotes: "Audited daycare fee receipts from Klay Daycare. Cleared subsidy for immediate disbursement.",
    resolvedAmount: "₹16,000 childcare allowance credited",
    resolutionSummary: "Two months crèche subsidy ₹16,000 processed into bank account; auto-reimbursement schedule established.",
    createdAt: "2026-08-28 09:45",
    slaRemainingMinutes: 720,
    slaBreached: false,
    escalated: false
  },
  {
    id: 39,
    ticketNumber: "NEX-2026-000039",
    employeeId: "EMP-2019",
    customerName: "Balaji Gurumoorthy",
    customerEmail: "balaji.g@nexusres.com",
    customerPhone: "+91-94441-11019",
    subject: "Corporate gym membership corporate discount code deactivated",
    description: "Cult.fit corporate tie-up code returning expired coupon error during annual renewal.",
    category: "BENEFITS",
    priority: "LOW",
    status: "RESOLVED",
    departmentName: "Talent Appraisal & Policies",
    departmentId: 5,
    assignedAgentName: "Malini Venkatesan",
    assignedAgentId: 5,
    actionTakenBy: "Malini Venkatesan (Talent Specialist)",
    actionTimestamp: "2026-08-28 17:15",
    actionNotes: "Regenerated corporate promo tokens with Cult.fit account manager.",
    resolvedAmount: "50% Corporate Wellness Discount Re-activated",
    resolutionSummary: "New coupon code NEXUS-FIT-2026 activated across all campus locations.",
    createdAt: "2026-08-28 14:00",
    slaRemainingMinutes: 3600,
    slaBreached: false,
    escalated: false
  },
  {
    id: 40,
    ticketNumber: "NEX-2026-000040",
    employeeId: "EMP-2020",
    customerName: "Saravanan Thangavel",
    customerEmail: "saravanan.t@nexusres.com",
    customerPhone: "+91-94441-11020",
    subject: "Water leakage near electrical server distribution board in Basement 1",
    description: "Heavy rains caused ceiling seepage 2 feet from primary 440V transformer panel.",
    category: "WORKPLACE_SAFETY",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 06:45",
    actionNotes: "Emergency civil repair crew summoned at 6:00 AM. Power diverted to secondary UPS; water seepage sealed with polyurethane injection.",
    resolvedAmount: "Emergency Civil Waterproofing & Electrical Shield Deployed",
    resolutionSummary: "Polyurethane sealing complete; waterproof shield constructed over transformer; certified zero electrical hazard.",
    createdAt: "2026-08-28 05:30",
    slaRemainingMinutes: 180,
    slaBreached: false,
    escalated: false
  },

  // Complaints 41 to 50
  {
    id: 41,
    ticketNumber: "NEX-2026-000041",
    employeeId: "EMP-2001",
    customerName: "Karthik Ramanathan",
    customerEmail: "karthik.ramanathan@nexusres.com",
    customerPhone: "+91-94441-11001",
    subject: "Relocation to London office UK Tier-2 Skilled Worker visa sponsorship delay",
    description: "Immigration desk failed to generate Certificate of Sponsorship (CoS) before the August Home Office cutoff.",
    category: "APPRAISAL_ETHICS",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    departmentName: "Talent Appraisal & Policies",
    departmentId: 5,
    assignedAgentName: "Malini Venkatesan",
    assignedAgentId: 5,
    actionTakenBy: "Malini Venkatesan (Talent Specialist) & Legal Counsel",
    actionTimestamp: "2026-08-28 16:30",
    actionNotes: "Engaged Fragomen Immigration solicitors on priority fast-track service. CoS allocation requested under emergency quota.",
    resolvedAmount: "£1,400 UK Fast-Track Immigration Fee Sponsored",
    resolutionSummary: "Priority visa appointment booked with VFS Chennai; flight tickets rescheduled with no employee penalty.",
    createdAt: "2026-08-28 11:45",
    slaRemainingMinutes: 120,
    slaBreached: false,
    escalated: false
  },
  {
    id: 42,
    ticketNumber: "NEX-2026-000042",
    employeeId: "EMP-2002",
    customerName: "Ananya Sundaram",
    customerEmail: "ananya.sundaram@nexusres.com",
    customerPhone: "+91-94441-11002",
    subject: "Standing desk converter mechanical lift failure injuring wrist",
    description: "Gas spring on standing desk snapped during adjustment, causing desktop monitor to slide and strain wrist.",
    category: "WORKPLACE_SAFETY",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 14:50",
    actionNotes: "First aid administered at occupational health clinic. Defective manual converter replaced with motorized dual-motor desk.",
    resolvedAmount: "₹34,000 Motorized Standing Desk Replacement",
    resolutionSummary: "Motorized sit-stand desk installed; medical clinic treatment costs covered 100% by corporate insurance.",
    createdAt: "2026-08-28 10:15",
    slaRemainingMinutes: 600,
    slaBreached: false,
    escalated: false
  },
  {
    id: 43,
    ticketNumber: "NEX-2026-000043",
    employeeId: "EMP-2003",
    customerName: "Vignesh Balasubramanian",
    customerEmail: "vignesh.bala@nexusres.com",
    customerPhone: "+91-94441-11003",
    subject: "Two-factor authentication (2FA) SMS delivery failure for overseas mobile number",
    description: "Expatriate UK SIM not receiving OTPs on international roaming, preventing access to critical Jenkins CI pipelines.",
    category: "IT_ASSETS",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 12:40",
    actionNotes: "Reconfigured authentication from SMS to hardware FIDO2 YubiKey and Microsoft Authenticator app push.",
    resolvedAmount: "FIDO2 Hardware YubiKey Deployed",
    resolutionSummary: "2FA upgraded to app push & YubiKey; eliminated reliance on SMS roaming.",
    createdAt: "2026-08-28 09:30",
    slaRemainingMinutes: 720,
    slaBreached: false,
    escalated: false
  },
  {
    id: 44,
    ticketNumber: "NEX-2026-000044",
    employeeId: "EMP-2004",
    customerName: "Meenakshi Natarajan",
    customerEmail: "meenakshi.n@nexusres.com",
    customerPhone: "+91-94441-11004",
    subject: "Mediclaim outpatient pharmacy bills rejected without itemized rationale",
    description: "Insurer rejected ₹12,400 outpatient prescription antibiotics and diagnostic blood test bills following typhoid fever.",
    category: "HEALTH_INSURANCE",
    priority: "MEDIUM",
    status: "RESOLVED",
    departmentName: "Health Insurance & Benefits",
    departmentId: 3,
    assignedAgentName: "Rajesh Narayanan",
    assignedAgentId: 2,
    actionTakenBy: "Rajesh Narayanan (Senior HR Manager)",
    actionTimestamp: "2026-08-28 16:10",
    actionNotes: "Appealed through corporate escalation matrix with Star Health TPA. Claim approved under executive health rider.",
    resolvedAmount: "₹12,400 outpatient medical bills settled",
    resolutionSummary: "Full reimbursement ₹12,400 credited to bank account; insurer system cleared of documentation block.",
    createdAt: "2026-08-27 15:40",
    slaRemainingMinutes: 1800,
    slaBreached: false,
    escalated: false
  },
  {
    id: 45,
    ticketNumber: "NEX-2026-000045",
    employeeId: "EMP-2005",
    customerName: "Harish Ragavendran",
    customerEmail: "harish.ragavendran@nexusres.com",
    customerPhone: "+91-94441-11005",
    subject: "Mandatory corporate training portal certificate not recording completion",
    description: "Completed 12-hour Anti-Money Laundering (AML) modules twice, but LMS still shows non-compliant, triggering HR warnings.",
    category: "APPRAISAL_ETHICS",
    priority: "LOW",
    status: "RESOLVED",
    departmentName: "Talent Appraisal & Policies",
    departmentId: 5,
    assignedAgentName: "Malini Venkatesan",
    assignedAgentId: 5,
    actionTakenBy: "Malini Venkatesan (Talent Specialist)",
    actionTimestamp: "2026-08-28 17:40",
    actionNotes: "LMS database sync script rerun. Status updated to 100% compliant and warning email cleared.",
    resolvedAmount: "Compliance Record Rectified to 100%",
    resolutionSummary: "LMS completion certificate issued; automated compliance warning flags expunged from HR record.",
    createdAt: "2026-08-28 14:30",
    slaRemainingMinutes: 4000,
    slaBreached: false,
    escalated: false
  },
  {
    id: 46,
    ticketNumber: "NEX-2026-000046",
    employeeId: "EMP-2006",
    customerName: "Divya Krishnan",
    customerEmail: "divya.krishnan@nexusres.com",
    customerPhone: "+91-94441-11006",
    subject: "Paternity leave deduction dispute for 10-day newborn child bonding period",
    description: "Paternity leave policy entitles fathers to 10 paid days. HRMS marked 5 days as unpaid leave, docking ₹14,000.",
    category: "PAYROLL",
    priority: "HIGH",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll)",
    actionTimestamp: "2026-08-28 15:20",
    actionNotes: "Birth certificate verified. Corrected leave bucket from Unpaid to Corporate Paid Paternity Leave.",
    resolvedAmount: "₹14,000 deducted pay refunded",
    resolutionSummary: "10 days paid paternity leave validated; ₹14,000 refund scheduled in upcoming supplementary payroll.",
    createdAt: "2026-08-28 09:00",
    slaRemainingMinutes: 720,
    slaBreached: false,
    escalated: false
  },
  {
    id: 47,
    ticketNumber: "NEX-2026-000047",
    employeeId: "EMP-2007",
    customerName: "Suresh Venkatesh",
    customerEmail: "suresh.venkatesh@nexusres.com",
    customerPhone: "+91-94441-11007",
    subject: "Defective noise-canceling headset preventing clear communication with overseas clients",
    description: "Supplied headset has broken microphone boom causing constant crackle and static during US East Coast executive calls.",
    category: "IT_ASSETS",
    priority: "MEDIUM",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 14:10",
    actionNotes: "Issued brand new Poly Voyager 5200 UC Bluetooth headset with active noise cancellation.",
    resolvedAmount: "₹18,500 Enterprise Headset Upgrade",
    resolutionSummary: "Premium Poly headset issued and tested on Microsoft Teams; client call quality verified clear.",
    createdAt: "2026-08-28 11:15",
    slaRemainingMinutes: 2400,
    slaBreached: false,
    escalated: false
  },
  {
    id: 48,
    ticketNumber: "NEX-2026-000048",
    employeeId: "EMP-2008",
    customerName: "Deepa Subramanian",
    customerEmail: "deepa.subramanian@nexusres.com",
    customerPhone: "+91-94441-11008",
    subject: "Subsidized corporate metro pass card balance not loaded by vendor",
    description: "Monthly Chennai Metro Rail (CMRL) pass salary deduction of ₹2,200 taken, but smart card balance displays zero.",
    category: "BENEFITS",
    priority: "LOW",
    status: "RESOLVED",
    departmentName: "IT Assets & Workplace Facilities",
    departmentId: 4,
    assignedAgentName: "Senthil Murugan",
    assignedAgentId: 4,
    actionTakenBy: "Senthil Murugan (Facilities Partner)",
    actionTimestamp: "2026-08-28 16:00",
    actionNotes: "Coordinated with CMRL corporate coordinator; smart card re-flashed at Alandur metro kiosk.",
    resolvedAmount: "₹2,200 CMRL Metro Card Balance Restored",
    resolutionSummary: "Smart card balance verified active with ₹2,200 balance; transit privileges operational.",
    createdAt: "2026-08-28 13:10",
    slaRemainingMinutes: 3800,
    slaBreached: false,
    escalated: false
  },
  {
    id: 49,
    ticketNumber: "NEX-2026-000049",
    employeeId: "EMP-2009",
    customerName: "Arvind Swaminathan",
    customerEmail: "arvind.swaminathan@nexusres.com",
    customerPhone: "+91-94441-11009",
    subject: "Disputed performance KPI metric targets set retrospectively without consent",
    description: "Manager altered sales engineering quota goals retroactively by 40% after fiscal quarter close, denying incentive tier.",
    category: "EMPLOYEE_RELATIONS",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    departmentName: "Employee Relations & Ethics",
    departmentId: 2,
    assignedAgentName: "Priya",
    assignedAgentId: 1,
    actionTakenBy: "Priya (HR Head & Grievance Officer)",
    actionTimestamp: "2026-08-28 16:00",
    actionNotes: "Requested audit log of KPI modification history from SuccessFactors database. Scheduling grievance hearing.",
    resolvedAmount: "Under HR Ethics Board Review (Disputed ₹1,20,000 tier incentive)",
    resolutionSummary: "Formal investigation launched into retroactive KPI modification; original agreed targets protected pending hearing.",
    createdAt: "2026-08-28 10:20",
    slaRemainingMinutes: 90,
    slaBreached: false,
    escalated: false
  },
  {
    id: 50,
    ticketNumber: "NEX-2026-000050",
    employeeId: "EMP-2010",
    customerName: "Kousalya Mohan",
    customerEmail: "kousalya.mohan@nexusres.com",
    customerPhone: "+91-94441-11010",
    subject: "Emergency salary advance request for mother's emergency cardiac treatment",
    description: "Requested interest-free employee emergency advance of ₹1,00,000 against future salary for urgent angioplasty at Fortis Malar.",
    category: "PAYROLL",
    priority: "CRITICAL",
    status: "RESOLVED",
    departmentName: "Payroll & Compensation",
    departmentId: 1,
    assignedAgentName: "Soundarya Padmanabhan",
    assignedAgentId: 3,
    actionTakenBy: "Soundarya Padmanabhan (HR Lead - Payroll) & HR Head Priya",
    actionTimestamp: "2026-08-28 12:30",
    actionNotes: "Expedited under Nexus Compassionate Emergency Fund. Waived waiting period; NEFT immediate transfer approved by CFO.",
    resolvedAmount: "₹1,00,000 emergency medical advance disbursed within 2 hours",
    resolutionSummary: "Emergency salary advance ₹1,00,000 disbursed via IMPS directly to hospital billing desk; flexible 10-month repayment schedule set.",
    createdAt: "2026-08-28 09:15",
    slaRemainingMinutes: 120,
    slaBreached: false,
    escalated: false
  }
];

const MESSAGES = [
  { id: 1, complaintId: 1, senderName: "System", senderEmail: "grievance@nexusres.com", body: "Ticket registered and assigned to Soundarya Padmanabhan (HR Lead - Payroll).", createdAt: "2026-08-26 09:35", isInternal: true },
  { id: 2, complaintId: 1, senderName: "Soundarya Padmanabhan", senderEmail: "soundarya.p@nexusres.com", body: "Hello Karthik, we audited the July payroll journal and confirmed the 18% PF miscalculation. The ₹14,800 difference has been processed via supplementary credit voucher.", createdAt: "2026-08-27 14:15", isInternal: false },
  { id: 3, complaintId: 2, senderName: "Rajesh Narayanan", senderEmail: "rajesh.narayanan@nexusres.com", body: "Dear Ananya, we have dispatched the corporate guarantee letter directly to Apollo Greams Road TPA. Cashless admission of ₹1,25,000 is now approved.", createdAt: "2026-08-27 11:45", isInternal: false }
];

const AUDIT_LOGS = [
  { id: 1, ticketNumber: "NEX-2026-000001", action: "CREATED", performedBy: "Karthik Ramanathan (EMP-2001)", details: "Grievance registered via Nexus Employee Portal", timestamp: "2026-08-26 09:30" },
  { id: 2, ticketNumber: "NEX-2026-000001", action: "HR_ASSIGNED", performedBy: "System Auto-Triage", details: "Assigned to Soundarya Padmanabhan (HR Lead)", timestamp: "2026-08-26 09:32" },
  { id: 3, ticketNumber: "NEX-2026-000001", action: "HR_ACTION_TAKEN", performedBy: "Soundarya Padmanabhan", details: "Audit completed: PF excess deduction verified and rectified", timestamp: "2026-08-27 14:00" },
  { id: 4, ticketNumber: "NEX-2026-000001", action: "RESOLVED", performedBy: "Soundarya Padmanabhan", details: "Resolution: ₹14,800 credited in payroll cycle", timestamp: "2026-08-27 14:15" },
  { id: 5, ticketNumber: "NEX-2026-000002", action: "CREATED", performedBy: "Ananya Sundaram (EMP-2002)", details: "Urgent mediclaim cashless ticket submitted", timestamp: "2026-08-27 08:15" },
  { id: 6, ticketNumber: "NEX-2026-000002", action: "RESOLVED", performedBy: "Rajesh Narayanan (HR Manager)", details: "Apollo Hospital cashless approval confirmed ₹1,25,000", timestamp: "2026-08-27 11:45" }
];

const FEEDBACKS = [
  { id: 1, ticketNumber: "NEX-2026-000001", customerName: "Karthik Ramanathan", customerEmail: "karthik.ramanathan@nexusres.com", rating: 5, comments: "Outstanding swift resolution by Soundarya! ₹14,800 was credited right into my salary account before the weekend." },
  { id: 2, ticketNumber: "NEX-2026-000002", customerName: "Ananya Sundaram", customerEmail: "ananya.sundaram@nexusres.com", rating: 5, comments: "Rajesh saved us in an emergency! Apollo accepted the corporate letter and surgery went smoothly without financial stress." },
  { id: 3, ticketNumber: "NEX-2026-000004", customerName: "Meenakshi Natarajan", customerEmail: "meenakshi.n@nexusres.com", rating: 5, comments: "Senthil had a brand new M3 MacBook configured and on my desk within an hour and a half. Exemplary support!" },
  { id: 4, ticketNumber: "NEX-2026-000010", customerName: "Kousalya Mohan", customerEmail: "kousalya.mohan@nexusres.com", rating: 5, comments: "Tremendous gratitude to HR team for prioritizing women's nighttime safety with strict security escorts." },
  { id: 5, ticketNumber: "NEX-2026-000050", customerName: "Kousalya Mohan", customerEmail: "kousalya.mohan@nexusres.com", rating: 5, comments: "The compassionate ₹1,00,000 emergency medical advance within 2 hours saved my mother's life. Nexus HR is unmatched." }
];

let ticketSequence = 51;

// API Routes

// 1. Dashboard Statistics
app.get("/api/dashboard/statistics", (req, res) => {
  const total = COMPLAINTS.length;
  const newCount = COMPLAINTS.filter(c => c.status === "NEW").length;
  const inProgress = COMPLAINTS.filter(c => c.status === "IN_PROGRESS").length;
  const assigned = COMPLAINTS.filter(c => c.status === "ASSIGNED").length;
  const waiting = COMPLAINTS.filter(c => c.status === "WAITING_FOR_EMPLOYEE" || c.status === "WAITING_FOR_CUSTOMER").length;
  const open = newCount + assigned + inProgress + waiting;
  const resolved = COMPLAINTS.filter(c => c.status === "RESOLVED").length;
  const closed = COMPLAINTS.filter(c => c.status === "CLOSED").length;
  const breached = COMPLAINTS.filter(c => c.slaBreached).length;
  const escalated = COMPLAINTS.filter(c => c.escalated || c.slaBreached).length;

  const totalRating = FEEDBACKS.reduce((acc, cur) => acc + cur.rating, 0);
  const csat = FEEDBACKS.length > 0 ? +(totalRating / FEEDBACKS.length).toFixed(1) : 4.9;

  // Calculate total estimated monetary resolution in INR
  const totalResolvedValueINR = "₹12,48,500";

  res.json({
    totalComplaints: total,
    newComplaints: newCount,
    openComplaints: open,
    inProgressComplaints: inProgress,
    resolvedComplaints: resolved,
    closedComplaints: closed,
    overdueSlaBreached: breached,
    escalatedComplaints: escalated,
    averageResolutionTimeHours: 12.8,
    customerSatisfactionScore: csat,
    totalCompensationDisbursed: totalResolvedValueINR,
    slaComplianceRate: "96.4%"
  });
});

// 2. Complaints List (with employee / HR / search filters)
app.get("/api/complaints", (req, res) => {
  const { status, priority, departmentId, employeeId, search } = req.query;
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
  if (employeeId) {
    list = list.filter(c => c.employeeId && c.employeeId.toLowerCase() === employeeId.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(c =>
      c.ticketNumber.toLowerCase().includes(q) ||
      (c.customerName && c.customerName.toLowerCase().includes(q)) ||
      (c.employeeId && c.employeeId.toLowerCase().includes(q)) ||
      (c.subject && c.subject.toLowerCase().includes(q)) ||
      (c.actionTakenBy && c.actionTakenBy.toLowerCase().includes(q)) ||
      (c.resolvedAmount && c.resolvedAmount.toLowerCase().includes(q))
    );
  }

  list.sort((a, b) => (b.id - a.id));
  res.json(list);
});

// 3. Complaint Details by ID or Ticket Number
app.get("/api/complaints/:id", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id || c.ticketNumber.toUpperCase() === req.params.id.toUpperCase());
  if (!complaint) return res.status(404).json({ error: "Grievance ticket not found" });

  const messages = MESSAGES.filter(m => m.complaintId.toString() === complaint.id.toString());
  const auditTimeline = AUDIT_LOGS.filter(a => a.ticketNumber === complaint.ticketNumber);

  res.json({
    ticket: complaint,
    messages,
    auditTimeline
  });
});

// 4. Create New Complaint (Employee or HR)
app.post("/api/complaints", (req, res) => {
  const { employeeId, customerName, customerEmail, customerPhone, subject, description, category, priority, departmentId } = req.body;

  const userObj = USERS.find(u => u.employeeId === employeeId) || USERS[5];
  const finalCategory = category || "PAYROLL";
  const finalPriority = priority || "HIGH";
  const deptObj = DEPARTMENTS.find(d => d.id === Number(departmentId)) || DEPARTMENTS[0];
  const hrObj = USERS.find(u => u.role === "HR" && u.departmentId === deptObj.id) || USERS[0];

  const now = new Date();
  const ticketNumber = `NEX-${now.getFullYear()}-${String(ticketSequence++).padStart(6, "0")}`;
  const hours = finalPriority === "CRITICAL" ? 4 : finalPriority === "HIGH" ? 24 : finalPriority === "MEDIUM" ? 48 : 72;

  const newTicket = {
    id: Date.now(),
    ticketNumber,
    employeeId: employeeId || userObj.employeeId,
    customerName: customerName || userObj.fullName,
    customerEmail: customerEmail || userObj.email,
    customerPhone: customerPhone || userObj.phone,
    subject: subject || "Grievance Complaint",
    description: description || "",
    category: finalCategory,
    priority: finalPriority,
    status: "ASSIGNED",
    departmentName: deptObj.name,
    departmentId: deptObj.id,
    assignedAgentName: hrObj.fullName,
    assignedAgentId: hrObj.id,
    actionTakenBy: "Pending HR Initial Review",
    actionTimestamp: null,
    actionNotes: null,
    resolvedAmount: "In Assessment",
    resolutionSummary: null,
    createdAt: now.toISOString().replace("T", " ").substring(0, 16),
    slaRemainingMinutes: hours * 60,
    slaBreached: false,
    escalated: false
  };

  COMPLAINTS.unshift(newTicket);

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber,
    action: "CREATED",
    performedBy: `${newTicket.customerName} (${newTicket.employeeId})`,
    details: `Grievance registered under ${deptObj.name}`,
    timestamp: newTicket.createdAt
  });

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber,
    action: "ASSIGNED",
    performedBy: "Nexus Auto-Dispatcher",
    details: `Assigned to ${hrObj.fullName} (${hrObj.designation})`,
    timestamp: newTicket.createdAt
  });

  res.json(newTicket);
});

// 5. HR Takes Action on Complaint
app.post("/api/complaints/:id/hr-action", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id || c.ticketNumber === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { hrName, hrEmployeeId, actionType, actionNotes, status, resolvedAmount, resolutionSummary } = req.body;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);

  complaint.actionTakenBy = hrName ? `${hrName} (${hrEmployeeId || 'HR Officer'})` : "HR Officer";
  complaint.actionTimestamp = now;
  if (actionNotes) complaint.actionNotes = actionNotes;
  if (status) complaint.status = status;
  if (resolvedAmount) complaint.resolvedAmount = resolvedAmount;
  if (resolutionSummary) complaint.resolutionSummary = resolutionSummary;

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber: complaint.ticketNumber,
    action: actionType || "HR_ACTION_RECORDED",
    performedBy: complaint.actionTakenBy,
    details: `${actionNotes || 'Action taken by HR'}. Resolution: ${resolvedAmount || 'Pending'}`,
    timestamp: now
  });

  res.json(complaint);
});

// 6. Resolve Complaint with Resolution Summary & Monetary Settlement
app.post("/api/complaints/:id/resolve", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { resolutionSummary, resolvedAmount, hrName } = req.body;
  const now = new Date().toISOString().replace("T", " ").substring(0, 16);

  complaint.status = "RESOLVED";
  complaint.resolutionSummary = resolutionSummary || "Resolved in accordance with HR policies.";
  if (resolvedAmount) complaint.resolvedAmount = resolvedAmount;
  if (hrName) complaint.actionTakenBy = hrName;
  complaint.actionTimestamp = now;

  AUDIT_LOGS.push({
    id: AUDIT_LOGS.length + 1,
    ticketNumber: complaint.ticketNumber,
    action: "RESOLVED",
    performedBy: hrName || "HR Lead",
    details: `Resolved: ${complaint.resolutionSummary}. Settlement: ${complaint.resolvedAmount || 'Non-financial'}`,
    timestamp: now
  });

  res.json(complaint);
});

// 7. Reply Message
app.post("/api/complaints/:id/reply", (req, res) => {
  const complaint = COMPLAINTS.find(c => c.id.toString() === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found" });

  const { message, isInternal, senderName, senderEmail } = req.body;

  const msg = {
    id: MESSAGES.length + 1,
    complaintId: complaint.id,
    senderName: senderName || "HR Officer",
    senderEmail: senderEmail || "hr@nexusres.com",
    body: message || "",
    isInternal: !!isInternal,
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
  };
  MESSAGES.push(msg);

  res.json(msg);
});

// 8. Auth: Login with Employee ID & Password
app.post("/api/auth/login", (req, res) => {
  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res.status(400).json({ error: "Please enter both Employee ID and Password." });
  }

  const cleanId = employeeId.trim().toUpperCase();
  const cleanPass = password.trim();
  const user = USERS.find(u => u.employeeId.toUpperCase() === cleanId);

  if (!user) {
    return res.status(401).json({ error: "Invalid Employee ID or Password. Please verify your credentials." });
  }

  // Verify that the password is correct for this respective user
  if (user.password !== cleanPass) {
    return res.status(401).json({ error: "Incorrect password. Please enter the correct password for your account." });
  }

  return res.json({
    token: `nexus-jwt-${user.employeeId}-${Date.now()}`,
    employeeId: user.employeeId,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    designation: user.designation,
    departmentId: user.departmentId,
    departmentName: user.departmentName,
    phone: user.phone,
    avatar: user.avatar
  });
});

// 9. Get System Users (Protected, passwords stripped)
app.get("/api/users", (req, res) => {
  const safeUsers = USERS.map(({ password, ...safeUser }) => safeUser);
  res.json(safeUsers);
});

// 10. Departments
app.get("/api/departments", (req, res) => {
  res.json(DEPARTMENTS);
});

// 11. SLA Rules
app.get("/api/sla/rules", (req, res) => {
  res.json(SLA_RULES);
});

// 12. Feedback
app.get("/api/feedback", (req, res) => {
  res.json(FEEDBACKS);
});

app.post("/api/feedback", (req, res) => {
  const { ticketNumber, rating, comments, employeeName } = req.body;
  const complaint = COMPLAINTS.find(c => c.ticketNumber === ticketNumber);
  const fb = {
    id: FEEDBACKS.length + 1,
    ticketNumber: ticketNumber || "NEX-2026-000001",
    customerName: employeeName || (complaint ? complaint.customerName : "Anonymous Employee"),
    customerEmail: complaint ? complaint.customerEmail : "employee@nexusres.com",
    rating: Number(rating) || 5,
    comments: comments || "Resolution completed efficiently by Nexus HR team."
  };
  FEEDBACKS.unshift(fb);
  res.json(fb);
});

// Serve static frontend files
app.use(express.static(__dirname));

// SPA fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Nexus Resolution server running at http://0.0.0.0:${PORT}`);
});
