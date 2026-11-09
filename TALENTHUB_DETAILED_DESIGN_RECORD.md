# AI-Assisted Detailed Design Record (DDR) & Implementation Guide
## Data Design • Algorithm Design • Security Design
### TalentHub Campus Placement Platform
**Prepared using the approved TalentHub 11-Table Relational Architecture**

---

### Team Information
| # | Name | SRN | Roll No. | Role / Contribution |
|---|------|-----|----------|---------------------|
| 1 | **BHAVANA B H** | 01FE24BCI102 | 102 | Data Design & Normalization Analysis |
| 2 | **ZAKIYA T** | 01FE24BCI104 | 104 | ER Modeling & Database Schema Implementation |
| 3 | **VIKITA** | 01FE24BCI108 | 108 | Security Design, Password Hashing & JWT Auth |
| 4 | **PRADEEP BICHAGATTI** | 01FE24BCI040 | 106 | Eligibility Algorithm Design & Automated Testing |

---

## 1. Executive Summary & Design Baseline
* **Purpose:** Deliver an implementation-ready, fully compliant detailed design and working backend for the TalentHub Campus Placement Platform.
* **Scope Baseline:** Strictly maintains the **11-table relational schema** and business rules approved for TalentHub. Does not introduce unapproved tables (`seasons`, `notifications`) or unstructured column types.
* **Technology Stack:**
  * **Backend Framework:** Python 3.14, FastAPI, Pydantic v2
  * **Data Layer / ORM:** SQLAlchemy 2.x
  * **Database Engine:** SQLite (development / local demo: `talenthub.db`), PostgreSQL (production target)
  * **Security Layer:** PyJWT (HS256 tokens), bcrypt (salted cryptographic password hashing)
  * **Frontend Client:** React 19, TypeScript, Vite, Tailwind CSS / Lucide icons

---

## 2. Part A – Data Design & Normalization

### A1. Storage Alternatives & Selected Architecture
TalentHub handles structured placement transactions requiring ACID guarantees, referential integrity, and complete auditability.

| Data Category | Stored Attributes | Selected Storage Mechanism | Justification |
|---|---|---|---|
| **Structured Placement Transactions** | Students, companies, job listings, applications, interview slots, offers, users, consents, audit history, eligibility decisions | **Relational Database (RDBMS)** with PK, FK, UNIQUE, and CHECK constraints | Strict foreign key relationships, concurrency safety, and auditability. |
| **Offer Letter Documents** | Issued job offer letter PDFs / contracts | **Object Storage** (referenced via unique `offer_letter_key`) | Storing binary documents in RDBMS causes database bloat; unpredictable keys prevent direct URL guessing. |
| **Search / Analytics** | Placement statistics, filtering | **RDBMS Indexing** (B-Tree on USN, Email, Role) | Transaction volumes do not justify a dedicated vector or search database. |

### A2. Enhanced Entity-Relationship (ER) Model
The relational model consists of exactly 11 normalized entities:

```mermaid
erDiagram
    COMPANIES ||--o{ JOB_LISTINGS : "posts"
    COMPANIES ||--o{ USERS : "employs"
    
    JOB_LISTINGS ||--o{ JOB_ALLOWED_BRANCHES : "specifies"
    JOB_LISTINGS ||--o{ APPLICATIONS : "receives"
    JOB_LISTINGS ||--o{ ELIGIBILITY_DECISIONS : "evaluated_in"

    STUDENTS ||--o| USERS : "authenticates_as"
    STUDENTS ||--o{ APPLICATIONS : "submits"
    STUDENTS ||--o{ STUDENT_CONSENTS : "grants"
    STUDENTS ||--o{ ELIGIBILITY_DECISIONS : "subject_of"

    APPLICATIONS ||--o{ INTERVIEW_SLOTS : "schedules"
    APPLICATIONS ||--o| OFFERS : "receives"
    APPLICATIONS ||--o{ APPLICATION_STATUS_HISTORY : "audits"

    USERS ||--o{ APPLICATION_STATUS_HISTORY : "records"

    STUDENTS {
        int id PK
        string usn UK "UNIQUE NOT NULL"
        string full_name "NOT NULL"
        string email UK "UNIQUE NOT NULL"
        string branch "NOT NULL"
        float cgpa "CHECK (0.0 <= cgpa <= 10.0)"
        int active_backlogs "CHECK (active_backlogs >= 0) DEFAULT 0"
        int cleared_backlogs "CHECK (cleared_backlogs >= 0) DEFAULT 0"
        boolean has_accepted_offer "DEFAULT FALSE"
    }

    COMPANIES {
        int id PK
        string name "NOT NULL"
    }

    JOB_LISTINGS {
        int id PK
        int company_id FK "REFERENCES companies(id)"
        string role "NOT NULL"
        string season "NOT NULL"
        float min_cgpa "CHECK (0.0 <= min_cgpa <= 10.0)"
        int max_active_backlogs "CHECK (max_active_backlogs >= 0) DEFAULT 0"
        date drive_date "NOT NULL"
        boolean is_open "DEFAULT TRUE"
    }

    JOB_ALLOWED_BRANCHES {
        int job_id PK,FK "REFERENCES job_listings(id)"
        string branch PK
    }

    APPLICATIONS {
        int id PK
        int student_id FK "REFERENCES students(id)"
        int job_id FK "REFERENCES job_listings(id)"
        string status "DEFAULT 'APPLIED'"
        datetime applied_at "NOT NULL"
        datetime updated_at "NOT NULL"
    }

    INTERVIEW_SLOTS {
        int id PK
        int application_id FK "REFERENCES applications(id)"
        int round_no "CHECK (round_no > 0)"
        datetime scheduled_at "NOT NULL"
        string venue "NOT NULL"
        boolean passed "NULLABLE"
        string notes "NULLABLE"
    }

    OFFERS {
        int id PK
        int application_id FK,UK "REFERENCES applications(id) UNIQUE"
        float package_lpa "CHECK (package_lpa > 0.0)"
        string offer_letter_key UK "UNIQUE NOT NULL"
        boolean accepted "DEFAULT FALSE"
        datetime created_at "NOT NULL"
    }

    USERS {
        int id PK
        string email UK "UNIQUE NOT NULL"
        string password_hash "NOT NULL"
        string role "CHECK (role IN ('STUDENT','COMPANY_REPRESENTATIVE','COORDINATOR'))"
        int student_id FK,UK "NULLABLE UNIQUE REFERENCES students(id)"
        int company_id FK "NULLABLE REFERENCES companies(id)"
        boolean is_active "DEFAULT TRUE"
    }

    STUDENT_CONSENTS {
        int id PK
        int student_id FK "REFERENCES students(id)"
        string purpose "NOT NULL"
        boolean consent_given "NOT NULL"
        string consent_version "NOT NULL"
        datetime recorded_at "NOT NULL"
        datetime withdrawn_at "NULLABLE"
    }

    APPLICATION_STATUS_HISTORY {
        int id PK
        int application_id FK "REFERENCES applications(id)"
        string old_status "NULLABLE"
        string new_status "NOT NULL"
        int changed_by FK "REFERENCES users(id)"
        datetime changed_at "NOT NULL"
    }

    ELIGIBILITY_DECISIONS {
        int id PK
        int student_id FK "REFERENCES students(id)"
        int job_id FK "REFERENCES job_listings(id)"
        boolean eligible "NOT NULL"
        string reason "NOT NULL"
        datetime checked_at "NOT NULL"
    }
```

### A3. Sequential Normalization Analysis
The schema has been sequentially evaluated through all four normal forms:

* **First Normal Form (1NF):**
  * *Condition:* Atomic attribute values; no repeating groups or multi-valued fields.
  * *Correction:* `job_listings.allowed_branches` is a multi-valued set. Decomposed into `job_allowed_branches(job_id, branch)` with composite primary key `(job_id, branch)`. If a job has 0 branch rows, it signifies open to all branches. All attributes are atomic.
* **Second Normal Form (2NF):**
  * *Condition:* In 1NF and no non-prime attribute is partially dependent on any candidate key.
  * *Analysis:* The only composite key is `(job_id, branch)` in `job_allowed_branches`, which has no non-key attributes. All other relations use single-attribute surrogate keys (`id`). Partial dependencies cannot exist.
* **Third Normal Form (3NF):**
  * *Condition:* In 2NF and for every functional dependency $X \rightarrow A$, either $X$ is a superkey or $A$ is prime.
  * *Analysis:* All descriptive attributes depend directly on their respective entity determinants (`companies.name` depends on `companies.id`, not repeated in `job_listings`). Applications store foreign keys only.
* **Boyce-Codd Normal Form (BCNF):**
  * *Condition:* For every non-trivial functional dependency $X \rightarrow Y$, $X$ must be a superkey.
  * *Analysis:* Candidate keys (`students.usn`, `students.email`, `users.email`, `(student_id, job_id)`, `offers.application_id`) are all unique superkeys. No non-superkey determinants exist.

### A4. UML Class Diagram
The object-oriented software domain model corresponding to the 11-table schema:

```mermaid
classDiagram
    direction TB

    class BranchEnum {
        <<enumeration>>
        CSE
        ECE
        ISE
        MECH
        CIVIL
    }

    class ApplicationStatusEnum {
        <<enumeration>>
        APPLIED
        SHORTLISTED
        INTERVIEW_SCHEDULED
        INTERVIEWED
        OFFERED
        ACCEPTED
        REJECTED
    }

    class UserRoleEnum {
        <<enumeration>>
        STUDENT
        COMPANY_REPRESENTATIVE
        COORDINATOR
    }

    class Student {
        +int id
        +string usn
        +string full_name
        +string email
        +string branch
        +float cgpa
        +int active_backlogs
        +int cleared_backlogs
        +bool has_accepted_offer
        +checkEligibility(job: JobListing) Tuple~bool, string~
        +apply(job: JobListing) Application
        +grantConsent(purpose: string) StudentConsent
    }

    class Company {
        +int id
        +string name
        +postJob(role: string, season: string) JobListing
    }

    class JobListing {
        +int id
        +int company_id
        +string role
        +string season
        +float min_cgpa
        +int max_active_backlogs
        +date drive_date
        +bool is_open
        +addAllowedBranch(branch: string)
    }

    class JobAllowedBranch {
        +int job_id
        +string branch
    }

    class Application {
        +int id
        +int student_id
        +int job_id
        +ApplicationStatusEnum status
        +datetime applied_at
        +datetime updated_at
        +updateStatus(newStatus: ApplicationStatusEnum, actor: User)
    }

    class InterviewSlot {
        +int id
        +int application_id
        +int round_no
        +datetime scheduled_at
        +string venue
        +bool passed
        +string notes
    }

    class Offer {
        +int id
        +int application_id
        +float package_lpa
        +string offer_letter_key
        +bool accepted
        +datetime created_at
        +acceptOffer() bool
    }

    class User {
        +int id
        +string email
        +string password_hash
        +UserRoleEnum role
        +int student_id
        +int company_id
        +bool is_active
        +verifyPassword(plain: string) bool
    }

    class StudentConsent {
        +int id
        +int student_id
        +string purpose
        +bool consent_given
        +string consent_version
        +datetime recorded_at
        +datetime withdrawn_at
        +withdrawConsent()
    }

    class ApplicationStatusHistory {
        +int id
        +int application_id
        +string old_status
        +string new_status
        +int changed_by
        +datetime changed_at
    }

    class EligibilityDecision {
        +int id
        +int student_id
        +int job_id
        +bool eligible
        +string reason
        +datetime checked_at
    }

    Company "1" --> "0..*" JobListing : posts
    Company "1" --> "0..*" User : employs
    JobListing "1" *-- "0..*" JobAllowedBranch : specifies
    JobListing "1" --> "0..*" Application : receives
    JobListing "1" --> "0..*" EligibilityDecision : targets

    Student "1" --> "0..1" User : authenticates_as
    Student "1" --> "0..*" Application : submits
    Student "1" --> "0..*" StudentConsent : grants
    Student "1" --> "0..*" EligibilityDecision : subject_of

    Application "1" *-- "0..*" InterviewSlot : schedules
    Application "1" --> "0..1" Offer : receives
    Application "1" --> "0..*" ApplicationStatusHistory : tracks

    User "1" --> "0..*" ApplicationStatusHistory : records
```

---

## 3. Part B – Algorithm Design: Placement Eligibility Evaluator

### B1. Algorithm Specification
* **Target Function:** `check_eligibility(student, job)`
* **Design Pattern:** Sequential Fail-Fast (Alternative A).
* **Evaluation Order:**
  $$\text{R1: Academic Cutoff (CGPA)} \longrightarrow \text{R2: Active Backlogs} \longrightarrow \text{R3: Accepted Offer Policy} \longrightarrow \text{R4: Allowed Branches}$$

```
FUNCTION check_eligibility(student, job)
    IF student.cgpa < job.min_cgpa THEN
        RETURN (FALSE, "CGPA is below the job minimum")

    IF student.active_backlogs > job.max_active_backlogs THEN
        RETURN (FALSE, "Active backlogs exceed the permitted maximum")

    IF student.has_accepted_offer = TRUE THEN
        RETURN (FALSE, "Student has already accepted an offer")

    IF job.allowed_branches IS NOT EMPTY
       AND student.branch NOT IN job.allowed_branches THEN
        RETURN (FALSE, "Student branch is not allowed for this job")

    RETURN (TRUE, "All eligibility conditions are satisfied")
END FUNCTION
```

### B2. Edge Case Test Matrix & Automated Test Results
Implemented and verified in `backend/test_eligibility.py`:

| Test Case | Inputs | Expected Output | Status |
|---|---|---|:---:|
| **CGPA below minimum** | CGPA=7.4, Min=7.5 | Ineligible: "CGPA is below the job minimum" | **PASS** |
| **CGPA equals minimum** | CGPA=7.5, Min=7.5 | Eligible: Passes R1 boundary condition | **PASS** |
| **Active backlogs equal maximum** | Active=1, MaxAllowed=1 | Eligible: Passes R2 boundary condition | **PASS** |
| **Active backlogs exceed maximum** | Active=1, MaxAllowed=0 | Ineligible: "Active backlogs exceed the permitted maximum" | **PASS** |
| **Cleared backlogs non-zero** | Active=0, Cleared=5 | Eligible: Cleared backlogs are ignored | **PASS** |
| **Accepted offer holds** | `has_accepted_offer = True` | Ineligible: "Student has already accepted an offer" | **PASS** |
| **Empty allowed-branches list** | `allowed_branches = []` | Eligible: Open to all branches | **PASS** |
| **Branch not in list** | Branch="CIVIL", Allowed=["CSE", "ISE"] | Ineligible: "Student branch is not allowed for this job" | **PASS** |
| **Sequential fail-fast ordering** | Fails CGPA (R1) AND Branch (R4) | Returns R1 failure message | **PASS** |
| **Precedence R2 over R3** | Fails Backlogs (R2) AND Offer (R3) | Returns R2 failure message | **PASS** |

*All 10/10 automated tests pass in 0.001 seconds.*

---

## 4. Part C – Security Design & Controls

1. **Authentication:**
   * Passwords hashed using `bcrypt` with random salt. Plaintext passwords are never stored.
   * Stateless JSON Web Tokens (JWT) using `HS256` signed with a secure 32+ character server secret.
2. **Role-Based Access Control (RBAC):**
   * Enforced via FastAPI dependency injection:
     * `STUDENT`: Read/update own profile, submit applications, view own offers and consents.
     * `COMPANY_REPRESENTATIVE`: Manage company job drives, schedule interview rounds, view applicants.
     * `COORDINATOR`: Global visibility, platform audits, drive management.
3. **Data Integrity & ACID Transactions:**
   * Offer acceptance transaction atomically updates `offers.accepted = True`, `students.has_accepted_offer = True`, and `applications.status = 'ACCEPTED'`, while logging the transition in `application_status_history`.
4. **Offer Letter Protection:**
   * Offer letters are referenced using random UUIDv4 keys (e.g. `offkey_4f9a...`) rather than guessable public URLs.

---

## 5. Consolidated Detailed Design Record (DDR) Validation

| Validation Check | Status | Verification Evidence / Design Note |
|---|---|---|
| **Consistent with TalentHub data design** | **VERIFIED** | Exactly 11 entities are defined with all attributes, check constraints, and default values matching approved requirements. |
| **ER relationships and cardinalities** | **VERIFIED** | Crow's Foot diagram precisely depicts 1:N company-jobs, composite PK for branch associations, and 1:1 constraints for applications-offers and students-users. |
| **Sequential Normalization** | **VERIFIED** | Schema passes 1NF, 2NF, 3NF, and BCNF with full functional dependency analysis. |
| **Eligibility Algorithm Compliance** | **VERIFIED** | Implemented as sequential fail-fast; 10 edge cases tested with 100% pass rate. |
| **Security Controls Implemented** | **VERIFIED** | Bcrypt password hashing, JWT bearer tokens, role checks, and audit logging active. |

---

## 6. How to Run the Completed System

### 1. Run the Backend API & SQLite Database
```bash
# From e:\frontend directory:
python backend/run.py
```
* **API Server:** `http://127.0.0.1:8000`
* **Interactive OpenAPI Docs:** `http://127.0.0.1:8000/docs`
* **Database File:** `e:\frontend\talenthub.db`

### 2. Run Database Seeding or Tests
```bash
# Seed initial placement data into all 11 tables:
python backend/seed.py

# Run eligibility algorithm tests:
python backend/test_eligibility.py

# Run API system integration tests:
python backend/test_api.py
```

### 3. Run the Frontend UI
```bash
npm run dev
```
* Frontend runs at `http://localhost:5173`.

---

## 7. Viva & Evaluation Defense Reference

### Q1: Why was `job_allowed_branches` separated from `job_listings`?
> **Answer:** In First Normal Form (1NF), every field must contain an atomic value. If `job_listings.allowed_branches` stores a list or comma-separated string (e.g., `'CSE, ISE, ECE'`), it violates 1NF. Decomposing it into `job_allowed_branches(job_id, branch)` with composite primary key `(job_id, branch)` ensures atomic values and allows database-level referential integrity and indexing.

### Q2: Why is the schema in BCNF?
> **Answer:** A schema is in Boyce-Codd Normal Form (BCNF) if for every non-trivial functional dependency $X \rightarrow Y$, the determinant $X$ is a superkey. In our schema:
> - In `students`, the keys `id`, `usn`, and `email` are all unique superkeys.
> - In `applications`, `id` and `(student_id, job_id)` are superkeys.
> - In `job_allowed_branches`, the candidate key is the composite key `(job_id, branch)`.
> Because no non-superkey determines any attribute, the schema strictly satisfies BCNF.

### Q3: Why is sequential fail-fast chosen over evaluating all rules?
> **Answer:** Sequential fail-fast provides deterministic behavior and immediate feedback upon the first broken constraint following the institutional policy hierarchy (R1 Cutoff $\rightarrow$ R2 Backlogs $\rightarrow$ R3 Offer Policy $\rightarrow$ R4 Branch). It reduces computation and database round-trips while matching the university placement regulation manual.

### Q4: How is consistency maintained between `offers.accepted` and `students.has_accepted_offer`?
> **Answer:** Both columns are updated within a single ACID database transaction in the FastAPI `accept_offer` endpoint. If either update fails, the transaction rolls back, preventing inconsistency. Additionally, `students.has_accepted_offer` acts as an indexed fast-path flag for high-volume eligibility scans during mass recruitment drives.

### Q5: Why is `offer_letter_key` used instead of a direct public URL or storing the file in the database?
> **Answer:** Storing binary files (BLOBs) directly inside an RDBMS degrades database query cache performance and significantly increases backup size. Using guessable public URLs creates a major IDOR (Insecure Direct Object Reference) security vulnerability. Storing a cryptographically random UUID `offer_letter_key` ensures secure, controlled retrieval through authenticated endpoints.


