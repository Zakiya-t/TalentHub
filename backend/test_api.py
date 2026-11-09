import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import (
    Student, Company, JobListing, Application, InterviewSlot, Offer,
    User, StudentConsent, ApplicationStatusHistory, EligibilityDecision,
    ApplicationStatusEnum, UserRoleEnum
)
from schemas import (
    UserLogin, JobListingCreate, ApplicationCreate, ApplicationStatusUpdate,
    InterviewSlotCreate, OfferCreate, StudentConsentCreate
)
from main import (
    health_check, login, get_jobs, get_students,
    check_job_eligibility, apply_to_job, update_application_status,
    issue_offer, accept_offer, give_consent, withdraw_consent
)

class TestTalentHubSystem(unittest.TestCase):

    def setUp(self):
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def test_health_check(self):
        res = health_check()
        self.assertEqual(res["status"], "ok")
        self.assertEqual(res["tables"], 11)

    def test_authentication_and_password_hashing(self):
        # Successful login returns JWT
        login_req = UserLogin(email="coordinator@talenthub.edu", password="password123")
        token_res = login(login_req, db=self.db)
        self.assertTrue(len(token_res.access_token) > 20)
        self.assertEqual(token_res.role, "COORDINATOR")

        # Wrong password fails
        bad_req = UserLogin(email="coordinator@talenthub.edu", password="wrongpassword")
        with self.assertRaises(Exception):
            login(bad_req, db=self.db)

    def test_jobs_and_allowed_branches(self):
        jobs = get_jobs(is_open_only=True, db=self.db)
        self.assertGreaterEqual(len(jobs), 3)
        job1 = next(j for j in jobs if j.role == "Associate Software Engineer")
        # Allowed branches resolved via Table 4 (job_allowed_branches)
        self.assertIn("CSE", job1.allowed_branches)
        self.assertIn("ISE", job1.allowed_branches)

    def test_eligibility_evaluation_and_audit_decision(self):
        student1 = self.db.query(Student).filter(Student.email == "pradeep@campus.edu").first()
        job1 = self.db.query(JobListing).filter(JobListing.role == "Associate Software Engineer").first()
        coord_user = self.db.query(User).filter(User.role == UserRoleEnum.COORDINATOR).first()

        before_count = self.db.query(EligibilityDecision).count()

        # Check eligibility
        decision = check_job_eligibility(
            id=job1.id,
            student_id=student1.id,
            db=self.db,
            current_user=coord_user
        )
        self.assertTrue(decision.eligible)
        self.assertEqual(decision.reason, "All eligibility conditions are satisfied")

        # Verify decision recorded in table 11
        after_count = self.db.query(EligibilityDecision).count()
        self.assertEqual(after_count, before_count + 1)

    def test_offer_issuance_and_atomic_acceptance_transaction(self):
        coord_user = self.db.query(User).filter(User.role == UserRoleEnum.COORDINATOR).first()
        student2 = self.db.query(Student).filter(Student.email == "bhavana@campus.edu").first()
        student2_user = self.db.query(User).filter(User.email == "bhavana@campus.edu").first()

        # Find application for Bhavana (app2)
        app = self.db.query(Application).filter(Application.student_id == student2.id).first()
        self.assertIsNotNone(app)

        # Issue offer
        offer_req = OfferCreate(application_id=app.id, package_lpa=14.5)
        offer_res = issue_offer(offer_req, db=self.db, current_user=coord_user)
        self.assertTrue(offer_res.offer_letter_key.startswith("offkey_"))
        self.assertFalse(offer_res.accepted)

        # Student accepts offer -> single atomic transaction
        accepted_offer = accept_offer(offer_res.id, db=self.db, current_user=student2_user)
        self.assertTrue(accepted_offer.accepted)

        # Verify student table synchronized
        self.db.refresh(student2)
        self.assertTrue(student2.has_accepted_offer)

        # Verify application status updated to ACCEPTED
        self.db.refresh(app)
        self.assertEqual(app.status, ApplicationStatusEnum.ACCEPTED)

        # Verify audit history recorded
        latest_audit = self.db.query(ApplicationStatusHistory).filter(
            ApplicationStatusHistory.application_id == app.id
        ).order_by(ApplicationStatusHistory.changed_at.desc()).first()
        self.assertEqual(latest_audit.new_status, "ACCEPTED")

    def test_student_consent_and_withdrawal(self):
        student1_user = self.db.query(User).filter(User.email == "pradeep@campus.edu").first()

        # Add consent
        consent_req = StudentConsentCreate(purpose="Placement Drive Verification v2", consent_version="v2.0")
        consent_res = give_consent(consent_req, db=self.db, current_user=student1_user)
        self.assertTrue(consent_res.consent_given)
        self.assertIsNone(consent_res.withdrawn_at)

        # Withdraw consent
        withdrawn = withdraw_consent(consent_res.id, db=self.db, current_user=student1_user)
        self.assertIn("withdrawn_at", withdrawn)
        self.assertIsNotNone(withdrawn["withdrawn_at"])

if __name__ == "__main__":
    unittest.main()
