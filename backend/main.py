import os
import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import engine, get_db, Base
from models import (
    Student, Company, JobListing, JobAllowedBranch, Application,
    InterviewSlot, Offer, User, StudentConsent,
    ApplicationStatusHistory, EligibilityDecision,
    BranchEnum, ApplicationStatusEnum, UserRoleEnum
)
from schemas import (
    UserRegister, UserLogin, TokenResponse, UserResponse,
    StudentResponse, StudentUpdate, CompanyResponse, CompanyCreate,
    JobListingCreate, JobListingResponse,
    ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate,
    InterviewSlotCreate, InterviewSlotUpdate, InterviewSlotResponse,
    OfferCreate, OfferResponse,
    StudentConsentCreate, StudentConsentResponse,
    ApplicationStatusHistoryResponse, EligibilityDecisionResponse
)
from security import (
    hash_password, verify_password, create_access_token,
    get_current_user, require_roles
)
from eligibility import check_eligibility_and_record, evaluate_eligibility

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TalentHub Campus Placement Platform API",
    description="Full implementation of the approved 11-table relational schema and eligibility/security design",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default is 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat(), "tables": 11}


# ==========================================
# AUTHENTICATION & USERS
# ==========================================
@app.post("/api/auth/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    student_id = None
    company_id = None

    # If registering as student, create student profile first
    if user_data.role == UserRoleEnum.STUDENT:
        if not user_data.usn or not user_data.branch or user_data.cgpa is None:
            raise HTTPException(status_code=400, detail="USN, Branch, and CGPA are required for student accounts")
        
        student = Student(
            usn=user_data.usn,
            full_name=user_data.full_name or "Student",
            email=user_data.email,
            branch=user_data.branch.value if isinstance(user_data.branch, BranchEnum) else user_data.branch,
            cgpa=user_data.cgpa,
            active_backlogs=0,
            cleared_backlogs=0,
            has_accepted_offer=False
        )
        try:
            db.add(student)
            db.commit()
            db.refresh(student)
            student_id = student.id
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Student USN or email already exists")

    elif user_data.role == UserRoleEnum.COMPANY_REPRESENTATIVE:
        if user_data.company_name:
            company = db.query(Company).filter(Company.name == user_data.company_name).first()
            if not company:
                company = Company(name=user_data.company_name)
                db.add(company)
                db.commit()
                db.refresh(company)
            company_id = company.id

    hashed_pw = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        password_hash=hashed_pw,
        role=user_data.role,
        student_id=student_id,
        company_id=company_id,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"user_id": user.id, "role": user.role.value, "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        role=user.role.value,
        email=user.email,
        student_id=user.student_id,
        company_id=user.company_id
    )


@app.post("/api/auth/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    token = create_access_token({"user_id": user.id, "role": user.role.value, "email": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        role=user.role.value,
        email=user.email,
        student_id=user.student_id,
        company_id=user.company_id
    )


@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user


# ==========================================
# STUDENTS
# ==========================================
@app.get("/api/students", response_model=List[StudentResponse])
def get_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.COORDINATOR, UserRoleEnum.COMPANY_REPRESENTATIVE]))
):
    return db.query(Student).all()


@app.get("/api/students/{id}", response_model=StudentResponse)
def get_student_by_id(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Resource ownership check: student can only view self unless coordinator/recruiter
    if current_user.role == UserRoleEnum.STUDENT and current_user.student_id != id:
        raise HTTPException(status_code=403, detail="Access denied to other student profiles")
    
    student = db.query(Student).filter(Student.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@app.put("/api/students/{id}", response_model=StudentResponse)
def update_student(
    id: int,
    updates: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == UserRoleEnum.STUDENT and current_user.student_id != id:
        raise HTTPException(status_code=403, detail="Cannot edit another student profile")

    student = db.query(Student).filter(Student.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if updates.full_name is not None:
        student.full_name = updates.full_name
    if updates.branch is not None:
        student.branch = updates.branch
    if updates.cgpa is not None:
        student.cgpa = updates.cgpa
    if updates.active_backlogs is not None:
        student.active_backlogs = updates.active_backlogs
    if updates.cleared_backlogs is not None:
        student.cleared_backlogs = updates.cleared_backlogs

    db.commit()
    db.refresh(student)
    return student


# ==========================================
# COMPANIES
# ==========================================
@app.get("/api/companies", response_model=List[CompanyResponse])
def get_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()


@app.post("/api/companies", response_model=CompanyResponse)
def create_company(
    company_data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.COORDINATOR]))
):
    company = Company(name=company_data.name)
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


# ==========================================
# JOB LISTINGS & ALLOWED BRANCHES
# ==========================================
@app.get("/api/jobs", response_model=List[JobListingResponse])
def get_jobs(is_open_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(JobListing)
    if is_open_only:
        query = query.filter(JobListing.is_open == True)
    jobs = query.all()
    
    result = []
    for j in jobs:
        branches = [b.branch for b in j.allowed_branches]
        result.append(JobListingResponse(
            id=j.id,
            company_id=j.company_id,
            company_name=j.company.name if j.company else None,
            role=j.role,
            season=j.season,
            min_cgpa=j.min_cgpa,
            max_active_backlogs=j.max_active_backlogs,
            drive_date=j.drive_date,
            is_open=j.is_open,
            allowed_branches=branches
        ))
    return result


@app.get("/api/jobs/{id}", response_model=JobListingResponse)
def get_job_by_id(id: int, db: Session = Depends(get_db)):
    j = db.query(JobListing).filter(JobListing.id == id).first()
    if not j:
        raise HTTPException(status_code=404, detail="Job listing not found")
    
    branches = [b.branch for b in j.allowed_branches]
    return JobListingResponse(
        id=j.id,
        company_id=j.company_id,
        company_name=j.company.name if j.company else None,
        role=j.role,
        season=j.season,
        min_cgpa=j.min_cgpa,
        max_active_backlogs=j.max_active_backlogs,
        drive_date=j.drive_date,
        is_open=j.is_open,
        allowed_branches=branches
    )


@app.post("/api/jobs", response_model=JobListingResponse)
def create_job(
    job_data: JobListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.COORDINATOR, UserRoleEnum.COMPANY_REPRESENTATIVE]))
):
    # If company rep, ensure creating job for own company
    if current_user.role == UserRoleEnum.COMPANY_REPRESENTATIVE:
        if current_user.company_id != job_data.company_id:
            raise HTTPException(status_code=403, detail="Can only post jobs for your registered company")

    job = JobListing(
        company_id=job_data.company_id,
        role=job_data.role,
        season=job_data.season,
        min_cgpa=job_data.min_cgpa,
        max_active_backlogs=job_data.max_active_backlogs,
        drive_date=job_data.drive_date,
        is_open=job_data.is_open
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Insert atomic allowed branches (Table 4: job_allowed_branches)
    for branch_str in job_data.allowed_branches:
        branch_row = JobAllowedBranch(job_id=job.id, branch=branch_str)
        db.add(branch_row)
    db.commit()
    db.refresh(job)

    branches = [b.branch for b in job.allowed_branches]
    return JobListingResponse(
        id=job.id,
        company_id=job.company_id,
        company_name=job.company.name if job.company else None,
        role=job.role,
        season=job.season,
        min_cgpa=job.min_cgpa,
        max_active_backlogs=job.max_active_backlogs,
        drive_date=job.drive_date,
        is_open=job.is_open,
        allowed_branches=branches
    )


# ==========================================
# ELIGIBILITY EVALUATION & AUDIT
# ==========================================
@app.post("/api/jobs/{id}/check-eligibility", response_model=EligibilityDecisionResponse)
def check_job_eligibility(
    id: int,
    student_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    target_student_id = student_id
    if current_user.role == UserRoleEnum.STUDENT:
        target_student_id = current_user.student_id

    if not target_student_id:
        raise HTTPException(status_code=400, detail="Student ID must be specified")

    student = db.query(Student).filter(Student.id == target_student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    job = db.query(JobListing).filter(JobListing.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job listing not found")

    eligible, reason, decision = check_eligibility_and_record(db, student, job)
    return decision


# ==========================================
# APPLICATIONS & AUDIT HISTORY
# ==========================================
@app.get("/api/applications", response_model=List[ApplicationResponse])
def get_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Application)
    if current_user.role == UserRoleEnum.STUDENT:
        query = query.filter(Application.student_id == current_user.student_id)
    elif current_user.role == UserRoleEnum.COMPANY_REPRESENTATIVE:
        query = query.join(JobListing).filter(JobListing.company_id == current_user.company_id)
    
    apps = query.all()
    result = []
    for a in apps:
        result.append(ApplicationResponse(
            id=a.id,
            student_id=a.student_id,
            student_name=a.student.full_name if a.student else None,
            student_usn=a.student.usn if a.student else None,
            job_id=a.job_id,
            job_role=a.job.role if a.job else None,
            company_name=a.job.company.name if a.job and a.job.company else None,
            status=a.status,
            applied_at=a.applied_at,
            updated_at=a.updated_at
        ))
    return result


@app.post("/api/applications", response_model=ApplicationResponse)
def apply_to_job(
    app_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.STUDENT]))
):
    student = db.query(Student).filter(Student.id == current_user.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    job = db.query(JobListing).filter(JobListing.id == app_data.job_id).first()
    if not job or not job.is_open:
        raise HTTPException(status_code=400, detail="Recruitment drive is closed or does not exist")

    # Evaluate eligibility using Part B algorithm and log to eligibility_decisions
    eligible, reason, _ = check_eligibility_and_record(db, student, job)
    if not eligible:
        raise HTTPException(status_code=400, detail=f"Ineligible: {reason}")

    # Check for duplicate application (enforced by UNIQUE constraint in DB as well)
    existing = db.query(Application).filter(
        Application.student_id == student.id,
        Application.job_id == job.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this job listing")

    new_app = Application(
        student_id=student.id,
        job_id=job.id,
        status=ApplicationStatusEnum.APPLIED,
        applied_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    # Record initial status in application_status_history audit table
    status_log = ApplicationStatusHistory(
        application_id=new_app.id,
        old_status=None,
        new_status=ApplicationStatusEnum.APPLIED.value,
        changed_by=current_user.id,
        changed_at=datetime.utcnow()
    )
    db.add(status_log)
    db.commit()

    return ApplicationResponse(
        id=new_app.id,
        student_id=new_app.student_id,
        student_name=student.full_name,
        student_usn=student.usn,
        job_id=new_app.job_id,
        job_role=job.role,
        company_name=job.company.name if job.company else None,
        status=new_app.status,
        applied_at=new_app.applied_at,
        updated_at=new_app.updated_at
    )


@app.put("/api/applications/{id}/status", response_model=ApplicationResponse)
def update_application_status(
    id: int,
    status_update: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.COORDINATOR, UserRoleEnum.COMPANY_REPRESENTATIVE]))
):
    app_obj = db.query(Application).filter(Application.id == id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = app_obj.status.value
    app_obj.status = status_update.new_status
    app_obj.updated_at = datetime.utcnow()

    # Record status transition in application_status_history table
    audit_entry = ApplicationStatusHistory(
        application_id=app_obj.id,
        old_status=old_status,
        new_status=status_update.new_status.value,
        changed_by=current_user.id,
        changed_at=datetime.utcnow()
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(app_obj)

    return ApplicationResponse(
        id=app_obj.id,
        student_id=app_obj.student_id,
        student_name=app_obj.student.full_name if app_obj.student else None,
        student_usn=app_obj.student.usn if app_obj.student else None,
        job_id=app_obj.job_id,
        job_role=app_obj.job.role if app_obj.job else None,
        company_name=app_obj.job.company.name if app_obj.job and app_obj.job.company else None,
        status=app_obj.status,
        applied_at=app_obj.applied_at,
        updated_at=app_obj.updated_at
    )


# ==========================================
# INTERVIEW SLOTS
# ==========================================
@app.get("/api/interview_slots", response_model=List[InterviewSlotResponse])
def get_interview_slots(application_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(InterviewSlot)
    if application_id:
        query = query.filter(InterviewSlot.application_id == application_id)
    return query.all()


@app.post("/api/interview_slots", response_model=InterviewSlotResponse)
def schedule_interview_slot(
    slot_data: InterviewSlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.COORDINATOR, UserRoleEnum.COMPANY_REPRESENTATIVE]))
):
    existing = db.query(InterviewSlot).filter(
        InterviewSlot.application_id == slot_data.application_id,
        InterviewSlot.round_no == slot_data.round_no
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Interview round already scheduled for this application")

    slot = InterviewSlot(
        application_id=slot_data.application_id,
        round_no=slot_data.round_no,
        scheduled_at=slot_data.scheduled_at,
        venue=slot_data.venue,
        notes=slot_data.notes
    )
    db.add(slot)
    
    # Update application status
    app_obj = db.query(Application).filter(Application.id == slot_data.application_id).first()
    if app_obj:
        app_obj.status = ApplicationStatusEnum.INTERVIEW_SCHEDULED
        status_log = ApplicationStatusHistory(
            application_id=app_obj.id,
            old_status=ApplicationStatusEnum.SHORTLISTED.value,
            new_status=ApplicationStatusEnum.INTERVIEW_SCHEDULED.value,
            changed_by=current_user.id,
            changed_at=datetime.utcnow()
        )
        db.add(status_log)

    db.commit()
    db.refresh(slot)
    return slot


# ==========================================
# OFFERS
# ==========================================
@app.get("/api/offers", response_model=List[OfferResponse])
def get_offers(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Offer)
    if current_user.role == UserRoleEnum.STUDENT:
        query = query.join(Application).filter(Application.student_id == current_user.student_id)
    return query.all()


@app.post("/api/offers", response_model=OfferResponse)
def issue_offer(
    offer_data: OfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.COORDINATOR, UserRoleEnum.COMPANY_REPRESENTATIVE]))
):
    # Check UNIQUE application_id constraint
    existing = db.query(Offer).filter(Offer.application_id == offer_data.application_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="An offer has already been issued for this application")

    # Generate unpredictable storage key as specified in Part A1
    unique_key = f"offkey_{uuid.uuid4().hex}"

    offer = Offer(
        application_id=offer_data.application_id,
        package_lpa=offer_data.package_lpa,
        offer_letter_key=unique_key,
        accepted=False,
        created_at=datetime.utcnow()
    )
    db.add(offer)

    app_obj = db.query(Application).filter(Application.id == offer_data.application_id).first()
    if app_obj:
        app_obj.status = ApplicationStatusEnum.OFFERED
        audit = ApplicationStatusHistory(
            application_id=app_obj.id,
            old_status=app_obj.status.value,
            new_status=ApplicationStatusEnum.OFFERED.value,
            changed_by=current_user.id,
            changed_at=datetime.utcnow()
        )
        db.add(audit)

    db.commit()
    db.refresh(offer)
    return offer


@app.post("/api/offers/{id}/accept", response_model=OfferResponse)
def accept_offer(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.STUDENT]))
):
    offer = db.query(Offer).filter(Offer.id == id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    application = offer.application
    if application.student_id != current_user.student_id:
        raise HTTPException(status_code=403, detail="You can only accept your own offer")

    student = application.student

    # ACID Transaction updating both offer and student simultaneously (DDR normalization caveat resolution)
    try:
        offer.accepted = True
        student.has_accepted_offer = True
        application.status = ApplicationStatusEnum.ACCEPTED
        application.updated_at = datetime.utcnow()

        audit = ApplicationStatusHistory(
            application_id=application.id,
            old_status=ApplicationStatusEnum.OFFERED.value,
            new_status=ApplicationStatusEnum.ACCEPTED.value,
            changed_by=current_user.id,
            changed_at=datetime.utcnow()
        )
        db.add(audit)
        db.commit()
        db.refresh(offer)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Transaction failed: {str(e)}")

    return offer


# ==========================================
# STUDENT CONSENTS
# ==========================================
@app.get("/api/consents", response_model=List[StudentConsentResponse])
def get_consents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(StudentConsent)
    if current_user.role == UserRoleEnum.STUDENT:
        query = query.filter(StudentConsent.student_id == current_user.student_id)
    return query.all()


@app.post("/api/consents", response_model=StudentConsentResponse)
def give_consent(
    consent_data: StudentConsentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.STUDENT]))
):
    consent = StudentConsent(
        student_id=current_user.student_id,
        purpose=consent_data.purpose,
        consent_given=consent_data.consent_given,
        consent_version=consent_data.consent_version,
        recorded_at=datetime.utcnow(),
        withdrawn_at=None
    )
    db.add(consent)
    db.commit()
    db.refresh(consent)
    return consent


@app.delete("/api/consents/{id}")
def withdraw_consent(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.STUDENT]))
):
    consent = db.query(StudentConsent).filter(
        StudentConsent.id == id,
        StudentConsent.student_id == current_user.student_id
    ).first()
    if not consent:
        raise HTTPException(status_code=404, detail="Consent record not found")

    consent.consent_given = False
    consent.withdrawn_at = datetime.utcnow()
    db.commit()
    return {"message": "Consent successfully withdrawn", "withdrawn_at": consent.withdrawn_at}


# ==========================================
# AUDIT LOGS & REPORTS
# ==========================================
@app.get("/api/audits/status-history", response_model=List[ApplicationStatusHistoryResponse])
def get_status_history(
    application_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.COORDINATOR, UserRoleEnum.COMPANY_REPRESENTATIVE]))
):
    query = db.query(ApplicationStatusHistory)
    if application_id:
        query = query.filter(ApplicationStatusHistory.application_id == application_id)
    return query.order_by(ApplicationStatusHistory.changed_at.desc()).all()


@app.get("/api/audits/eligibility-decisions", response_model=List[EligibilityDecisionResponse])
def get_eligibility_decisions(
    student_id: Optional[int] = None,
    job_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRoleEnum.COORDINATOR, UserRoleEnum.COMPANY_REPRESENTATIVE]))
):
    query = db.query(EligibilityDecision)
    if student_id:
        query = query.filter(EligibilityDecision.student_id == student_id)
    if job_id:
        query = query.filter(EligibilityDecision.job_id == job_id)
    return query.order_by(EligibilityDecision.checked_at.desc()).all()

