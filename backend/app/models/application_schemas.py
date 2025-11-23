from datetime import datetime
from enum import Enum
from typing import List, Literal, Optional, Dict, Any

from pydantic import BaseModel, Field, HttpUrl


class DocumentReferences(BaseModel):
    resume_id: Optional[str] = Field(None, alias="resumeId")
    cover_letter_id: Optional[str] = Field(None, alias="coverLetterId")
    ksc_id: Optional[str] = Field(None, alias="kscId")


class ApplicationStatus(str, Enum):
    DRAFT = "draft"
    APPLIED = "applied"
    INTERVIEWING = "interviewing"
    OFFER = "offer"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"
    ARCHIVED = "archived"


class Contact(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = Field(None, alias="linkedinUrl")
    role: Optional[str] = None


class InterviewSchedule(BaseModel):
    interview_date: datetime = Field(..., alias="interviewDate")
    interview_type: Literal["phone", "video", "onsite", "take-home"] = Field(..., alias="interviewType")
    interviewer_names: List[str] = Field(default_factory=list, alias="interviewerNames")
    notes: Optional[str] = None


class SalaryRange(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None
    currency: str = "USD"


class ApplicationCreate(BaseModel):
    job_title: str = Field(..., alias="jobTitle", min_length=1)
    company_name: str = Field(..., alias="companyName", min_length=1)
    job_description: str = Field(..., alias="jobDescription", min_length=50)
    deadline: Optional[datetime] = None
    documents: Optional[DocumentReferences] = None


class ApplicationResponse(BaseModel):
    id: str
    user_id: str = Field(..., alias="userId")
    job_id: Optional[str] = Field(None, alias="jobId")
    job_title: str = Field(..., alias="jobTitle")
    company_name: str = Field(..., alias="companyName")
    job_description: str = Field(..., alias="jobDescription")
    source: Literal["email", "manual", "job_board"]
    status: ApplicationStatus
    applied_date: Optional[datetime] = Field(None, alias="appliedDate")
    deadline: Optional[datetime] = None
    contacts: List[Contact] = Field(default_factory=list)
    interviews: List[InterviewSchedule] = Field(default_factory=list)
    documents: Optional[DocumentReferences] = None
    notes: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    salary: Optional[SalaryRange] = None
    integrations: Optional[Dict[str, str]] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(..., alias="createdAt")
    updated_at: datetime = Field(..., alias="updatedAt")
