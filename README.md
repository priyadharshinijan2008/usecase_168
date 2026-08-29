# Smart Customer Complaint & Resolution Management System

An enterprise-grade, full-stack customer complaint management, SLA monitoring, email-to-ticket resolution, and CSAT analytics platform with a modern Light Theme UI.

---

## 🌟 Key Features & Innovations

1. **Enterprise Light Theme UI**: Professional SaaS dashboard aesthetic with clean white backgrounds, soft slate borders, royal blue/indigo accents, and responsive layouts.
2. **AI Classification & Sentiment Engine**: Auto-predicts **Category**, **Priority**, **Sentiment** (Positive/Neutral/Negative), and **Recommended Department** for incoming complaints from both Web and Email channels.
3. **Email-to-Ticket Integration**:
   - Monitored Support Mailbox (`support@company.com`).
   - Automatically detects existing ticket numbers (`CMP-2026-XXXXXX`) in incoming subject or body text to append replies to existing complaint timelines without creating duplicate tickets.
4. **Automated SLA Engine & Escalation Scheduler**:
   - Priority-based deadlines: `CRITICAL` (4h), `HIGH` (24h), `MEDIUM` (48h), `LOW` (72h).
   - Real-time SLA countdown timers.
   - Automated 80% SLA elapsed warnings and automatic supervisor escalations upon SLA breach.
5. **Interactive Email Response & Resolution Workflow**:
   - Reply directly to customer emails from complaint timeline.
   - **Resolve & Notify Customer**: Resolves complaint, logs summary, and dispatches automated resolution email with embedded customer feedback link.
6. **CSAT Customer Feedback Portal**: Public feedback rating page (`1` to `5` stars + comments) feeding real-time CSAT metrics directly into analytics.
7. **Pre-Populated Demo Data**: Comes seeded with realistic complaints, agents, departments, SLA rules, and email logs for immediate out-of-the-box demonstration.

---

## 🛠️ Stack & Architecture

- **Backend**: Java 17+ / Java 26, Spring Boot 3, Spring Data JPA, Spring Security, Spring Mail, JWT Authentication.
- **Database**: H2 In-Memory DB (default with console at `/h2-console`) / PostgreSQL compatible.
- **Frontend**: React 18, TypeScript, Tailwind CSS (Light Theme), Lucide Icons, Chart.js. Single-port embedded static delivery via Spring Boot Tomcat server (`http://localhost:8080`).

---

## 🚀 Quick Start Instructions

### Prerequisites
- **Java JDK 17+** (Java 26 detected on local system)
- **Maven** (or standard javac / spring boot wrapper)

### Running the Application

1. Open PowerShell / Command Prompt in the project folder:
   ```powershell
   cd C:\Users\ragha\.gemini\antigravity\scratch\smart-complaint-system
   ```

2. Compile and run Spring Boot application:
   ```powershell
   mvn spring-boot:run
   ```
   *(Or compile with Maven/javac and run `java -jar target/smart-complaint-system-1.0.0.jar`)*

3. Open your browser and navigate to:
   - **Application Dashboard**: [http://localhost:8080](http://localhost:8080)
   - **H2 Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:mem:complaintdb`, User: `sa`, Password: *[blank]*)

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@company.com` | `admin123` |
| **Supervisor** | `supervisor@company.com` | `super123` |
| **Tech Agent** | `john.tech@company.com` | `agent123` |
| **Finance Agent** | `sarah.fin@company.com` | `agent123` |
| **Customer** | `alice.smith@example.com` | `customer123` |

---

## 📋 REST API Endpoints

- `POST /api/auth/login` - User login & JWT issuance
- `POST /api/complaints` - Register new web complaint (Auto SLA & AI classification)
- `GET /api/complaints` - List complaints (with status, priority, search filters)
- `GET /api/complaints/{id}` - Fetch ticket details, messages & audit timeline
- `PUT /api/complaints/{id}/status` - Change complaint status (`NEW` -> `ASSIGNED` -> `IN_PROGRESS` -> `RESOLVED`)
- `PUT /api/complaints/{id}/assign` - Reassign ticket agent
- `POST /api/complaints/{id}/reply` - Send email response / add internal note
- `POST /api/complaints/{id}/resolve` - Resolve ticket & dispatch resolution email
- `POST /api/complaints/simulate-inbound-email` - Ingest incoming email (Email-to-ticket)
- `GET /api/dashboard/statistics` - Aggregate stats & CSAT metrics
- `POST /api/feedback` - Submit customer CSAT rating & review
- `GET /api/emails` - Retrieve incoming/outgoing `EMAIL_LOGS` records
