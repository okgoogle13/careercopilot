from datetime import datetime
from enum import Enum
from typing import Any, Literal

from pydantic import BaseModel, Field, HttpUrl


class DocumentReferences(BaseModel):
    resume_id: str | None = Field(None, alias="resumeId")
    cover_letter_id: str | None = Field(None, alias="coverLetterId")
    ksc_id: str | None = Field(None, alias="kscId")


class ApplicationStatus(str, Enum):
    DRAFT = "draft"
    APPLIED = "applied"
    INTERVIEWING = "interviewing"
    OFFER = "offer"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"
    ARCHIVED = "archived"


class Contact(BaseModel):
    model_config = {"populate_by_name": True, "from_attributes": True}
    name: str
    email: str | None = None
    phone: str | None = None
    linkedin_url: HttpUrl | None = Field(None, alias="linkedinUrl")
    role: str | None = None


class InterviewSchedule(BaseModel):
    model_config = {"populate_by_name": True, "from_attributes": True}
    interview_date: datetime = Field(..., alias="interviewDate")
    interview_type: Literal["phone", "video", "onsite", "take-home"] = Field(..., alias="interviewType")
    interviewer_names: list[str] = Field(default_factory=list, alias="interviewerNames")
    notes: str | None = None


class SalaryRange(BaseModel):
    min: float | None = None
    max: float | None = None
    currency: str = "USD"


class ApplicationCreate(BaseModel):
    model_config = {"populate_by_name": True, "from_attributes": True}
    job_title: str = Field(..., alias="jobTitle", min_length=1)
    company_name: str = Field(..., alias="companyName", min_length=1)
    job_description: str = Field(..., alias="jobDescription", min_length=50)
    deadline: datetime | None = None
    documents: DocumentReferences | None = None


class ApplicationResponse(BaseModel):
    model_config = {"populate_by_name": True, "from_attributes": True}
    id: str
    user_id: str = Field(..., alias="userId")
    job_id: str | None = Field(None, alias="jobId")
    job_title: str = Field(..., alias="jobTitle")
    company_name: str = Field(..., alias="companyName")
    job_description: str = Field(..., alias="jobDescription")
    source: Literal["email", "manual", "job_board"]
    status: ApplicationStatus
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
    created_at: datetime = Field(..., alias="createdAt")
    updated_at: datetime = Field(..., alias="updatedAt")
