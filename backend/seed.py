import os
from datetime import datetime, date, timedelta
from database import engine, SessionLocal, Base
from models import (
    Student, Company, JobListing, JobAllowedBranch, Application,
    InterviewSlot, Offer, User, StudentConsent,
    ApplicationStatusHistory, EligibilityDecision,
    BranchEnum, ApplicationStatusEnum, UserRoleEnum
)
from security import hash_password

def seed_database():
    print("Initializing SQLite database tables...")
    # Drop existing tables and recreate cleanly
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding Companies...")
        comp_apex = Company(name="Apex Systems & Technologies")
        comp_cloud = Company(name="CloudScale Networks")
        comp_cyber = Company(name="CyberDefend Security")
        comp_ai = Company(name="Quantum AI Labs")
        db.add_all([comp_apex, comp_cloud, comp_cyber, comp_ai])
        db.commit()

        print("Seeding Students...")
        s1 = Student(
            usn="01FE24BCI040",
            full_name="Pradeep Bichagatti",
            email="pradeep@campus.edu",
            branch="CSE",
            cgpa=9.10,
            active_backlogs=0,
            cleared_backlogs=0,
            has_accepted_offer=False
        )
        s2 = Student(
            usn="01FE24BCI102",
            full_name="Bhavana B H",
            email="bhavana@campus.edu",
            branch="ISE",
            cgpa=8.85,
            active_backlogs=0,
            cleared_backlogs=1,
            has_accepted_offer=False
        )
        s3 = Student(
            usn="01FE24BCI104",
            full_name="Zakiya T",
            email="zakiya@campus.edu",
            branch="ECE",
            cgpa=8.40,
            active_backlogs=0,
            cleared_backlogs=0,
            has_accepted_offer=False
        )
        s4 = Student(
            usn="01FE24BCI108",
            full_name="Vikita",
            email="vikita@campus.edu",
            branch="MECH",
            cgpa=7.20,
            active_backlogs=1,
            cleared_backlogs=0,
            has_accepted_offer=False
        )
        s5 = Student(
            usn="01FE24BCI110",
            full_name="Rohan Sharma",
            email="rohan@campus.edu",
            branch="CIVIL",
            cgpa=6.80,
            active_backlogs=2,
            cleared_backlogs=1,
            has_accepted_offer=False
        )
        db.add_all([s1, s2, s3, s4, s5])
        db.commit()

        print("Seeding Users with hashed passwords...")
        default_pw = hash_password("password123")
        u_coord = User(
            email="coordinator@talenthub.edu",
            password_hash=default_pw,
            role=UserRoleEnum.COORDINATOR,
            is_active=True
        )
        u_recruiter = User(
            email="recruiter@apexsystems.com",
            password_hash=default_pw,
            role=UserRoleEnum.COMPANY_REPRESENTATIVE,
            company_id=comp_apex.id,
            is_active=True
        )
        u_student1 = User(
            email=s1.email,
            password_hash=default_pw,
            role=UserRoleEnum.STUDENT,
            student_id=s1.id,
            is_active=True
        )
        u_student2 = User(
            email=s2.email,
            password_hash=default_pw,
            role=UserRoleEnum.STUDENT,
            student_id=s2.id,
            is_active=True
        )
        db.add_all([u_coord, u_recruiter, u_student1, u_student2])
        db.commit()

        print("Seeding Job Listings & Allowed Branches...")
        job1 = JobListing(
            company_id=comp_apex.id,
            role="Associate Software Engineer",
            season="2026-2027",
            min_cgpa=7.50,
            max_active_backlogs=0,
            drive_date=date(2026, 11, 20),
            is_open=True
        )
        job2 = JobListing(
            company_id=comp_cloud.id,
            role="Cloud Systems Specialist",
            season="2026-2027",
            min_cgpa=7.00,
            max_active_backlogs=1,
            drive_date=date(2026, 11, 25),
            is_open=True
        )
        job3 = JobListing(
            company_id=comp_ai.id,
            role="AI Research Engineer",
            season="2026-2027",
            min_cgpa=8.50,
            max_active_backlogs=0,
            drive_date=date(2026, 12, 1),
            is_open=True
        )
        db.add_all([job1, job2, job3])
        db.commit()

        # Job 1 allowed branches (CSE, ISE, ECE)
        b1_1 = JobAllowedBranch(job_id=job1.id, branch="CSE")
        b1_2 = JobAllowedBranch(job_id=job1.id, branch="ISE")
        b1_3 = JobAllowedBranch(job_id=job1.id, branch="ECE")

        # Job 2 open to all branches (no entries in job_allowed_branches as per 1NF design)
        # Job 3 allowed branches (CSE, ISE)
        b3_1 = JobAllowedBranch(job_id=job3.id, branch="CSE")
        b3_2 = JobAllowedBranch(job_id=job3.id, branch="ISE")
        db.add_all([b1_1, b1_2, b1_3, b3_1, b3_2])
        db.commit()

        print("Seeding Applications...")
        app1 = Application(
            student_id=s1.id,
            job_id=job1.id,
            status=ApplicationStatusEnum.INTERVIEW_SCHEDULED,
            applied_at=datetime.utcnow() - timedelta(days=5),
            updated_at=datetime.utcnow() - timedelta(days=2)
        )
        app2 = Application(
            student_id=s2.id,
            job_id=job1.id,
            status=ApplicationStatusEnum.SHORTLISTED,
            applied_at=datetime.utcnow() - timedelta(days=4),
            updated_at=datetime.utcnow() - timedelta(days=1)
        )
        app3 = Application(
            student_id=s1.id,
            job_id=job3.id,
            status=ApplicationStatusEnum.APPLIED,
            applied_at=datetime.utcnow() - timedelta(days=1),
            updated_at=datetime.utcnow() - timedelta(days=1)
        )
        db.add_all([app1, app2, app3])
        db.commit()

        print("Seeding Interview Slots...")
        slot1 = InterviewSlot(
            application_id=app1.id,
            round_no=1,
            scheduled_at=datetime.utcnow() + timedelta(days=2),
            venue="Tech Park Block B, Boardroom 3",
            passed=None,
            notes="Technical Screening & Algorithmic Problem Solving"
        )
        db.add(slot1)
        db.commit()

        print("Seeding Student Consents...")
        consent1 = StudentConsent(
            student_id=s1.id,
            purpose="Allow verified placement coordinators and recruiters to review academic records and resume.",
            consent_given=True,
            consent_version="v1.0",
            recorded_at=datetime.utcnow() - timedelta(days=10)
        )
        consent2 = StudentConsent(
            student_id=s2.id,
            purpose="Allow verified placement coordinators and recruiters to review academic records and resume.",
            consent_given=True,
            consent_version="v1.0",
            recorded_at=datetime.utcnow() - timedelta(days=10)
        )
        db.add_all([consent1, consent2])
        db.commit()

        print("Seeding Application Status History (Audit)...")
        ash1 = ApplicationStatusHistory(
            application_id=app1.id,
            old_status=None,
            new_status=ApplicationStatusEnum.APPLIED.value,
            changed_by=u_student1.id,
            changed_at=datetime.utcnow() - timedelta(days=5)
        )
        ash2 = ApplicationStatusHistory(
            application_id=app1.id,
            old_status=ApplicationStatusEnum.APPLIED.value,
            new_status=ApplicationStatusEnum.SHORTLISTED.value,
            changed_by=u_coord.id,
            changed_at=datetime.utcnow() - timedelta(days=3)
        )
        ash3 = ApplicationStatusHistory(
            application_id=app1.id,
            old_status=ApplicationStatusEnum.SHORTLISTED.value,
            new_status=ApplicationStatusEnum.INTERVIEW_SCHEDULED.value,
            changed_by=u_coord.id,
            changed_at=datetime.utcnow() - timedelta(days=2)
        )
        db.add_all([ash1, ash2, ash3])
        db.commit()

        print("Seeding Eligibility Decisions (Audit)...")
        ed1 = EligibilityDecision(
            student_id=s1.id,
            job_id=job1.id,
            eligible=True,
            reason="All eligibility conditions are satisfied",
            checked_at=datetime.utcnow() - timedelta(days=5)
        )
        ed2 = EligibilityDecision(
            student_id=s2.id,
            job_id=job1.id,
            eligible=True,
            reason="All eligibility conditions are satisfied",
            checked_at=datetime.utcnow() - timedelta(days=4)
        )
        ed3 = EligibilityDecision(
            student_id=s4.id,
            job_id=job1.id,
            eligible=False,
            reason="CGPA is below the job minimum",
            checked_at=datetime.utcnow() - timedelta(days=1)
        )
        db.add_all([ed1, ed2, ed3])
        db.commit()

        print("Database seeded successfully with all 11 tables populated!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

