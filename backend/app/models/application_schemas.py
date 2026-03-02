from datetime import datetime
from enum import Enum
<<<<<<< HEAD
from typing import List, Literal, Optional, Dict, Any
=======
from typing import Any, Literal
>>>>>>> restoration-KR-Rage-Figma-v2.0

from pydantic import BaseModel, Field, HttpUrl


class DocumentReferences(BaseModel):
<<<<<<< HEAD
    resume_id: Optional[str] = Field(None, alias="resumeId")
    cover_letter_id: Optional[str] = Field(None, alias="coverLetterId")
    ksc_id: Optional[str] = Field(None, alias="kscId")
=======
    resume_id: str | None = Field(None, alias="resumeId")
    cover_letter_id: str | None = Field(None, alias="coverLetterId")
    ksc_id: str | None = Field(None, alias="kscId")
>>>>>>> restoration-KR-Rage-Figma-v2.0


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
<<<<<<< HEAD
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[HttpUrl] = Field(None, alias="linkedinUrl")
    role: Optional[str] = None
=======
    email: str | None = None
    phone: str | None = None
    linkedin_url: HttpUrl | None = Field(None, alias="linkedinUrl")
    role: str | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0


class InterviewSchedule(BaseModel):
    interview_date: datetime = Field(..., alias="interviewDate")
    interview_type: Literal["phone", "video", "onsite", "take-home"] = Field(..., alias="interviewType")
<<<<<<< HEAD
    interviewer_names: List[str] = Field(default_factory=list, alias="interviewerNames")
    notes: Optional[str] = None


class SalaryRange(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None
=======
    interviewer_names: list[str] = Field(default_factory=list, alias="interviewerNames")
    notes: str | None = None


class SalaryRange(BaseModel):
    min: float | None = None
    max: float | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0
    currency: str = "USD"


class ApplicationCreate(BaseModel):
    job_title: str = Field(..., alias="jobTitle", min_length=1)
    company_name: str = Field(..., alias="companyName", min_length=1)
    job_description: str = Field(..., alias="jobDescription", min_length=50)
<<<<<<< HEAD
    deadline: Optional[datetime] = None
    documents: Optional[DocumentReferences] = None
=======
    deadline: datetime | None = None
    documents: DocumentReferences | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0


class ApplicationResponse(BaseModel):
    id: str
    user_id: str = Field(..., alias="userId")
<<<<<<< HEAD
    job_id: Optional[str] = Field(None, alias="jobId")
=======
    job_id: str | None = Field(None, alias="jobId")
>>>>>>> restoration-KR-Rage-Figma-v2.0
    job_title: str = Field(..., alias="jobTitle")
    company_name: str = Field(..., alias="companyName")
    job_description: str = Field(..., alias="jobDescription")
    source: Literal["email", "manual", "job_board"]
    status: ApplicationStatus
<<<<<<< HEAD
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
=======
    applied_date: datetime | None = Field(None, alias="appliedDate")
    deadline: datetime | None = None
    contacts: list[Contact] = Field(default_factory=list)
    interviews: list[InterviewSchedule] = Field(default_factory=list)
    documents: DocumentReferences | None = None
    notes: str | None = None
    rating: int | None = Field(None, ge=1, le=5)
    salary: SalaryRange | None = None
    integrations: dict[str, str] | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
>>>>>>> restoration-KR-Rage-Figma-v2.0
    created_at: datetime = Field(..., alias="createdAt")
    updated_at: datetime = Field(..., alias="updatedAt")
