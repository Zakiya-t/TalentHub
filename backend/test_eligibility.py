import unittest
from types import SimpleNamespace
from eligibility import evaluate_eligibility

class TestTalentHubEligibility(unittest.TestCase):

    def setUp(self):
        # Base eligible student
        self.base_student = SimpleNamespace(
            cgpa=8.5,
            active_backlogs=0,
            cleared_backlogs=2,
            has_accepted_offer=False,
            branch="CSE"
        )
        # Base job
        self.base_job = SimpleNamespace(
            min_cgpa=7.5,
            max_active_backlogs=0
        )
        self.allowed_branches = ["CSE", "ISE"]

    def test_cgpa_below_minimum(self):
        """Test R1: CGPA below cutoff returns R1 failure"""
        self.base_student.cgpa = 7.4
        eligible, reason = evaluate_eligibility(self.base_student, self.base_job, self.allowed_branches)
        self.assertFalse(eligible)
        self.assertEqual(reason, "CGPA is below the job minimum")

    def test_cgpa_exactly_equals_minimum(self):
        """Test R1 boundary: CGPA == min_cgpa passes R1"""
        self.base_student.cgpa = 7.5
        eligible, reason = evaluate_eligibility(self.base_student, self.base_job, self.allowed_branches)
        self.assertTrue(eligible)
        self.assertEqual(reason, "All eligibility conditions are satisfied")

    def test_active_backlogs_equal_maximum(self):
        """Test R2 boundary: active_backlogs == max_active_backlogs passes R2"""
        self.base_job.max_active_backlogs = 1
        self.base_student.active_backlogs = 1
        eligible, reason = evaluate_eligibility(self.base_student, self.base_job, self.allowed_branches)
        self.assertTrue(eligible)

    def test_active_backlogs_exceed_maximum(self):
        """Test R2: active_backlogs > max_active_backlogs returns R2 failure"""
        self.base_student.active_backlogs = 1
        self.base_job.max_active_backlogs = 0
        eligible, reason = evaluate_eligibility(self.base_student, self.base_job, self.allowed_branches)
        self.assertFalse(eligible)
        self.assertEqual(reason, "Active backlogs exceed the permitted maximum")

    def test_cleared_backlogs_ignored(self):
        """Test R2: Cleared backlogs (e.g. 5) do NOT affect eligibility if active backlogs is 0"""
        self.base_student.cleared_backlogs = 5
        self.base_student.active_backlogs = 0
        eligible, reason = evaluate_eligibility(self.base_student, self.base_job, self.allowed_branches)
        self.assertTrue(eligible)

    def test_accepted_offer_condition(self):
        """Test R3: has_accepted_offer = TRUE returns R3 failure"""
        self.base_student.has_accepted_offer = True
        eligible, reason = evaluate_eligibility(self.base_student, self.base_job, self.allowed_branches)
        self.assertFalse(eligible)
        self.assertEqual(reason, "Student has already accepted an offer")

    def test_empty_allowed_branches_open_to_all(self):
        """Test R4: empty branch list means open to all engineering branches"""
        self.base_student.branch = "MECH"
        eligible, reason = evaluate_eligibility(self.base_student, self.base_job, [])
        self.assertTrue(eligible)

    def test_branch_not_in_allowed_list(self):
        """Test R4: branch not in non-empty allowed list returns R4 failure"""
        self.base_student.branch = "CIVIL"
        eligible, reason = evaluate_eligibility(self.base_student, self.base_job, ["CSE", "ISE"])
        self.assertFalse(eligible)
        self.assertEqual(reason, "Student branch is not allowed for this job")

    def test_sequential_fail_fast_precedence(self):
        """
        Test fail-fast ordering: When both CGPA (R1) and Branch (R4) fail,
        the function MUST return R1 reason (first failure in sequence).
        """
        self.base_student.cgpa = 6.0
        self.base_student.branch = "CIVIL"
        eligible, reason = evaluate_eligibility(self.base_student, self.base_job, ["CSE", "ISE"])
        self.assertFalse(eligible)
        self.assertEqual(reason, "CGPA is below the job minimum")

    def test_r2_precedence_over_r3(self):
        """
        Test fail-fast ordering: When both Backlogs (R2) and Accepted Offer (R3) fail,
        the function MUST return R2 reason.
        """
        self.base_student.active_backlogs = 2
        self.base_student.has_accepted_offer = True
        eligible, reason = evaluate_eligibility(self.base_student, self.base_job, self.allowed_branches)
        self.assertFalse(eligible)
        self.assertEqual(reason, "Active backlogs exceed the permitted maximum")

if __name__ == "__main__":
    unittest.main()

