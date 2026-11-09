import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Date,
    ForeignKey, UniqueConstraint, CheckConstraint, Enum
)
from sqlalchemy.orm import relationship
from database import Base

class BranchEnum(str, enum.Enum):
    CSE = "CSE"
    ECE = "ECE"
    ISE = "ISE"
    MECH = "MECH"
    CIVIL = "CIVIL"

class ApplicationStatusEnum(str, enum.Enum):
    APPLIED = "APPLIED"
    SHORTLISTED = "SHORTLISTED"
    INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED"
    INTERVIEWED = "INTERVIEWED"
    OFFERED = "OFFERED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"

class UserRoleEnum(str, enum.Enum):
    STUDENT = "STUDENT"
    COMPANY_REPRESENTATIVE = "COMPANY_REPRESENTATIVE"
    COORDINATOR = "COORDINATOR"


# Table 1: students
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    usn = Column(String(30), unique=True, nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    branch = Column(String(20), nullable=False)
    cgpa = Column(Float, nullable=False)
    active_backlogs = Column(Integer, default=0, nullable=False)
    cleared_backlogs = Column(Integer, default=0, nullable=False)
    has_accepted_offer = Column(Boolean, default=False, nullable=False)

    __table_args__ = (
        CheckConstraint("cgpa >= 0.0 AND cgpa <= 10.0", name="chk_student_cgpa"),
        CheckConstraint("active_backlogs >= 0", name="chk_student_active_backlogs"),
        CheckConstraint("cleared_backlogs >= 0", name="chk_student_cleared_backlogs"),
    )

    user = relationship("User", back_populates="student", uselist=False)
    applications = relationship("Application", back_populates="student")
    consents = relationship("StudentConsent", back_populates="student")
    eligibility_decisions = relationship("EligibilityDecision", back_populates="student")


# Table 2: companies
class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)

    jobs = relationship("JobListing", back_populates="company")
    users = relationship("User", back_populates="company")


# Table 3: job_listings
class JobListing(Base):
    __tablename__ = "job_listings"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(100), nullable=False)
    season = Column(String(50), nullable=False)
    min_cgpa = Column(Float, nullable=False)
    max_active_backlogs = Column(Integer, default=0, nullable=False)
    drive_date = Column(Date, nullable=False)
    is_open = Column(Boolean, default=True, nullable=False)

    __table_args__ = (
        CheckConstraint("min_cgpa >= 0.0 AND min_cgpa <= 10.0", name="chk_job_min_cgpa"),
        CheckConstraint("max_active_backlogs >= 0", name="chk_job_max_active_backlogs"),
    )

    company = relationship("Company", back_populates="jobs")
    allowed_branches = relationship("JobAllowedBranch", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job")
    eligibility_decisions = relationship("EligibilityDecision", back_populates="job")


# Table 4: job_allowed_branches (Composite PK resolving M:N branch association)
class JobAllowedBranch(Base):
    __tablename__ = "job_allowed_branches"

    job_id = Column(Integer, ForeignKey("job_listings.id", ondelete="CASCADE"), primary_key=True)
    branch = Column(String(20), primary_key=True)

    job = relationship("JobListing", back_populates="allowed_branches")


# Table 5: applications (Associative entity for student-job M:N)
class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="RESTRICT"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_listings.id", ondelete="RESTRICT"), nullable=False)
    status = Column(Enum(ApplicationStatusEnum), default=ApplicationStatusEnum.APPLIED, nullable=False)
    applied_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("student_id", "job_id", name="uq_student_job_application"),
    )

    student = relationship("Student", back_populates="applications")
    job = relationship("JobListing", back_populates="applications")
    interviews = relationship("InterviewSlot", back_populates="application")
    offer = relationship("Offer", back_populates="application", uselist=False)
    status_history = relationship("ApplicationStatusHistory", back_populates="application")


# Table 6: interview_slots
class InterviewSlot(Base):
    __tablename__ = "interview_slots"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    round_no = Column(Integer, nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    venue = Column(String(200), nullable=False)
    passed = Column(Boolean, nullable=True)
    notes = Column(String(500), nullable=True)

    __table_args__ = (
        CheckConstraint("round_no > 0", name="chk_interview_round_positive"),
        UniqueConstraint("application_id", "round_no", name="uq_app_round_no"),
    )

    application = relationship("Application", back_populates="interviews")


# Table 7: offers (1:0..1 with application, unique application_id)
class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="RESTRICT"), unique=True, nullable=False)
    package_lpa = Column(Float, nullable=False)
    offer_letter_key = Column(String(255), unique=True, nullable=False)
    accepted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        CheckConstraint("package_lpa > 0.0", name="chk_offer_package_positive"),
    )

    application = relationship("Application", back_populates="offer")


# Table 8: users
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRoleEnum), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="SET NULL"), unique=True, nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    student = relationship("Student", back_populates="user")
    company = relationship("Company", back_populates="users")
    status_changes = relationship("ApplicationStatusHistory", back_populates="user")


# Table 9: student_consents
class StudentConsent(Base):
    __tablename__ = "student_consents"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    purpose = Column(String(200), nullable=False)
    consent_given = Column(Boolean, nullable=False)
    consent_version = Column(String(20), nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    withdrawn_at = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="consents")


# Table 10: application_status_history (Audit log)
class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    old_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=False)
    changed_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    changed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    application = relationship("Application", back_populates="status_history")
    user = relationship("User", back_populates="status_changes")


# Table 11: eligibility_decisions (Eligibility audit trail)
class EligibilityDecision(Base):
    __tablename__ = "eligibility_decisions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_listings.id", ondelete="CASCADE"), nullable=False)
    eligible = Column(Boolean, nullable=False)
    reason = Column(String(255), nullable=False)
    checked_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    student = relationship("Student", back_populates="eligibility_decisions")
    job = relationship("JobListing", back_populates="eligibility_decisions")

