from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field
from models import BranchEnum, ApplicationStatusEnum, UserRoleEnum

# User & Auth
class UserRegister(BaseModel):
    email: str
    password: str = Field(min_length=6)
    role: UserRoleEnum
    full_name: Optional[str] = None
    usn: Optional[str] = None
    branch: Optional[BranchEnum] = None
    cgpa: Optional[float] = Field(default=None, ge=0.0, le=10.0)
    company_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    email: str
    student_id: Optional[int] = None
    company_id: Optional[int] = None

class UserResponse(BaseModel):
    id: int
    email: str
    role: UserRoleEnum
    student_id: Optional[int] = None
    company_id: Optional[int] = None
    is_active: bool

    class Config:
        from_attributes = True

# Student
class StudentBase(BaseModel):
    usn: str
    full_name: str
    email: str
    branch: str
    cgpa: float = Field(ge=0.0, le=10.0)
    active_backlogs: int = Field(default=0, ge=0)
    cleared_backlogs: int = Field(default=0, ge=0)
    has_accepted_offer: bool = False

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    branch: Optional[str] = None
    cgpa: Optional[float] = Field(default=None, ge=0.0, le=10.0)
    active_backlogs: Optional[int] = Field(default=None, ge=0)
    cleared_backlogs: Optional[int] = Field(default=None, ge=0)

class StudentResponse(StudentBase):
    id: int

    class Config:
        from_attributes = True

# Company
class CompanyBase(BaseModel):
    name: str

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: int

    class Config:
        from_attributes = True

# Job Listing & Allowed Branches
class JobListingCreate(BaseModel):
    company_id: int
    role: str
    season: str
    min_cgpa: float = Field(ge=0.0, le=10.0)
    max_active_backlogs: int = Field(default=0, ge=0)
    drive_date: date
    is_open: bool = True
    allowed_branches: List[str] = []

class JobListingResponse(BaseModel):
    id: int
    company_id: int
    company_name: Optional[str] = None
    role: str
    season: str
    min_cgpa: float
    max_active_backlogs: int
    drive_date: date
    is_open: bool
    allowed_branches: List[str] = []

    class Config:
        from_attributes = True

# Eligibility
class EligibilityDecisionResponse(BaseModel):
    id: int
    student_id: int
    job_id: int
    eligible: bool
    reason: str
    checked_at: datetime

    class Config:
        from_attributes = True

# Application
class ApplicationCreate(BaseModel):
    job_id: int

class ApplicationStatusUpdate(BaseModel):
    new_status: ApplicationStatusEnum
    notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    student_id: int
    student_name: Optional[str] = None
    student_usn: Optional[str] = None
    job_id: int
    job_role: Optional[str] = None
    company_name: Optional[str] = None
    status: ApplicationStatusEnum
    applied_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Interview Slot
class InterviewSlotCreate(BaseModel):
    application_id: int
    round_no: int = Field(gt=0)
    scheduled_at: datetime
    venue: str
    notes: Optional[str] = None

class InterviewSlotUpdate(BaseModel):
    passed: Optional[bool] = None
    notes: Optional[str] = None

class InterviewSlotResponse(BaseModel):
    id: int
    application_id: int
    round_no: int
    scheduled_at: datetime
    venue: str
    passed: Optional[bool]
    notes: Optional[str]

    class Config:
        from_attributes = True

# Offer
class OfferCreate(BaseModel):
    application_id: int
    package_lpa: float = Field(gt=0.0)

class OfferResponse(BaseModel):
    id: int
    application_id: int
    package_lpa: float
    offer_letter_key: str
    accepted: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Consent
class StudentConsentCreate(BaseModel):
    purpose: str
    consent_given: bool = True
    consent_version: str = "v1.0"

class StudentConsentResponse(BaseModel):
    id: int
    student_id: int
    purpose: str
    consent_given: bool
    consent_version: str
    recorded_at: datetime
    withdrawn_at: Optional[datetime]

    class Config:
        from_attributes = True

# Status History
class ApplicationStatusHistoryResponse(BaseModel):
    id: int
    application_id: int
    old_status: Optional[str]
    new_status: str
    changed_by: int
    changed_at: datetime

    class Config:
        from_attributes = True
