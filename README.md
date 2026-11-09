# TalentHub Campus Placement Platform

**AI-Assisted Detailed Design & Full-Stack Implementation**  
*Data Design • Algorithm Design • Security Design*

### Team 14
| # | Name | SRN | Roll No. | Contribution Area |
|---|------|-----|----------|-------------------|
| 1 | **BHAVANA B H** | 01FE24BCI102 | 102 | Relational Data Design & Normalization (1NF–BCNF) |
| 2 | **ZAKIYA T** | 01FE24BCI104 | 104 | Enhanced ER Modeling & SQLite Schema |
| 3 | **VIKITA** | 01FE24BCI108 | 108 | Security Controls, JWT Authentication & Password Hashing |
| 4 | **PRADEEP BICHAGATTI** | 01FE24BCI040 | 106 | Sequential Eligibility Engine & Edge-Case Test Suite |

---

## 🚀 Project Overview

TalentHub is an enterprise campus recruitment and placement platform designed for universities, students, recruiters, and placement coordinators.

### Technology Stack
* **Backend:** Python 3.14, FastAPI, SQLAlchemy 2.x, Pydantic v2
* **Database:** SQLite (development / local demo: `talenthub.db`), PostgreSQL (production target)
* **Security:** PyJWT (HS256 tokens), bcrypt (salted password hashing), RBAC middleware
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons

---

## 🗄️ Database Architecture (Approved 11-Table Schema)

The database strictly implements the normalized 11-table relational schema:
1. `students` — Student academic profiles, CGPA, backlogs, offer status (CHECK 0–10, active $\ge 0$).
2. `companies` — Recruiting company profiles.
3. `job_listings` — Placement drive openings, salary, eligibility cutoffs.
4. `job_allowed_branches` — Composite PK `(job_id, branch)` resolving M:N branch association (1NF decomposition).
5. `applications` — Associative entity linking students and jobs with unique `(student_id, job_id)`.
6. `interview_slots` — Interview rounds with unique `(application_id, round_no)`.
7. `offers` — Placement offers with unique `application_id`, package, and secret `offer_letter_key`.
8. `users` — Authentication accounts with salted `password_hash`, roles, and 1:1 student link.
9. `student_consents` — GDPR/DPDP-compliant consent tracking with versions and revocation timestamps.
10. `application_status_history` — Comprehensive audit log of all application transitions.
11. `eligibility_decisions` — Persistent audit trail of every automated eligibility check.

---

## 🧠 Part B: Eligibility Engine Algorithm

Sequential fail-fast execution order ($R1 \rightarrow R2 \rightarrow R3 \rightarrow R4$):
* **R1 (Academic Cutoff):** $\text{Student CGPA} \ge \text{Job Min CGPA}$
* **R2 (Active Backlogs):** $\text{Active Backlogs} \le \text{Job Max Allowed}$ (cleared backlogs ignored)
* **R3 (Accepted Offer Policy):** Student has not accepted an active offer this season
* **R4 (Allowed Branch):** Student branch exists in `job_allowed_branches` (empty = open to all)

All 10 boundary and edge-case unit tests are automated and passing with 100% test coverage (`backend/test_eligibility.py`).

---

## 🔒 Part C: Security Controls

* **Password Hashing:** Salted `bcrypt` hashing (zero plaintext storage).
* **Stateless JWT Tokens:** Signed with HS256 and verified through FastAPI security dependencies.
* **Role-Based Access Control:** Separate permissions for `STUDENT`, `COMPANY_REPRESENTATIVE`, and `COORDINATOR`.
* **ACID Transactions:** Atomic updates for offer acceptance ensuring data consistency between `offers`, `students`, and `applications`.
* **Unpredictable Storage Keys:** Offer letters use cryptographically random UUID tokens (`offkey_...`).

---

## 🛠️ Quickstart: How to Run the Platform

### 1. Start Backend API Server
```powershell
python backend/run.py
```
* API Server: `http://127.0.0.1:8000`
* Interactive OpenAPI/Swagger Docs: `http://127.0.0.1:8000/docs`

### 2. Seed Database & Run Automated Tests
```powershell
# Populate the 11 SQLite tables with initial data:
python backend/seed.py

# Run eligibility algorithm edge-case tests (10/10 PASS):
python backend/test_eligibility.py

# Run API & security integration tests (6/6 PASS):
python backend/test_api.py
```

### 3. Start Frontend Client
```powershell
npm run dev
```
* Web Application: `http://localhost:5173`

---

## 📄 Documentation Artifact
The full Detailed Design Record containing the Crow's Foot Mermaid ER diagram, normalization proofs, and DDR validation matrix is available in [`TALENTHUB_DETAILED_DESIGN_RECORD.md`](./TALENTHUB_DETAILED_DESIGN_RECORD.md).
