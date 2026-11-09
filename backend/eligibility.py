from datetime import datetime
from typing import Tuple, List
from sqlalchemy.orm import Session
from models import Student, JobListing, EligibilityDecision

def evaluate_eligibility(student: Student, job: JobListing, allowed_branches: List[str]) -> Tuple[bool, str]:
    """
    Pure language-independent algorithmic evaluation of eligibility.
    Rule order:
      R1: Minimum CGPA check
      R2: Maximum active backlogs check (cleared backlogs are ignored)
      R3: Accepted-offer condition
      R4: Allowed branch match (empty set means open to all)
    Sequential fail-fast: returns the first failure in R1-R4 order.
    """
    # R1 minimum CGPA
    if student.cgpa < job.min_cgpa:
        return False, "CGPA is below the job minimum"

    # R2 maximum active backlogs
    if student.active_backlogs > job.max_active_backlogs:
        return False, "Active backlogs exceed the permitted maximum"

    # R3 accepted-offer condition
    if student.has_accepted_offer:
        return False, "Student has already accepted an offer"

    # R4 allowed branch
    if len(allowed_branches) > 0 and student.branch not in allowed_branches:
        return False, "Student branch is not allowed for this job"

    return True, "All eligibility conditions are satisfied"


def check_eligibility_and_record(db: Session, student: Student, job: JobListing) -> Tuple[bool, str, EligibilityDecision]:
    """
    Evaluates placement eligibility using evaluate_eligibility()
    and records the result into the eligibility_decisions table as required by the DDR.
    """
    branch_list = [b.branch for b in job.allowed_branches]
    eligible, reason = evaluate_eligibility(student, job, branch_list)

    decision_record = EligibilityDecision(
        student_id=student.id,
        job_id=job.id,
        eligible=eligible,
        reason=reason,
        checked_at=datetime.utcnow()
    )
    db.add(decision_record)
    db.commit()
    db.refresh(decision_record)

    return eligible, reason, decision_record

