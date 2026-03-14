from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from app.models.application_schemas import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatus,
    ApplicationUpdate,
    Contact,
    DocumentReferences,
    InterviewSchedule,
    SalaryRange,
)


class TestApplicationSchemas:
    def test_document_references(self):
        doc = DocumentReferences(resumeId="res1", coverLetterId="cov1", kscId="ksc1")
        assert doc.resume_id == "res1"
        assert doc.cover_letter_id == "cov1"
        assert doc.ksc_id == "ksc1"

    def test_application_status_enum(self):
        assert ApplicationStatus.DRAFT.value == "draft"
        assert ApplicationStatus.APPLIED.value == "applied"

    def test_contact(self):
        contact = Contact(
            name="Jane Doe", email="jane@example.com", linkedinUrl="https://linkedin.com/in/jane"
        )
        assert contact.name == "Jane Doe"
        assert contact.email == "jane@example.com"
        assert str(contact.linkedin_url) == "https://linkedin.com/in/jane"

    def test_interview_schedule(self):
        now = datetime.now(timezone.utc)
        schedule = InterviewSchedule(
            interviewDate=now, interviewType="video", interviewerNames=["John"]
        )
        assert schedule.interview_date == now
        assert schedule.interview_type == "video"
        assert schedule.interviewer_names == ["John"]

    def test_interview_schedule_invalid_type(self):
        now = datetime.now(timezone.utc)
        with pytest.raises(ValidationError):
            InterviewSchedule(interviewDate=now, interviewType="invalid_type")

    def test_salary_range(self):
        salary = SalaryRange(min=50000, max=80000, currency="EUR")
        assert salary.min == 50000
        assert salary.max == 80000
        assert salary.currency == "EUR"

    def test_application_create(self):
        now = datetime.now(timezone.utc)
        app_create = ApplicationCreate(
            jobTitle="Software Engineer",
            companyName="Tech Corp",
            jobDescription="A very long job description that needs to be at least fifty characters long to pass the validation rule.",
            deadline=now,
        )
        assert app_create.job_title == "Software Engineer"
        assert app_create.company_name == "Tech Corp"
        assert app_create.deadline == now

    def test_application_create_invalid_description_length(self):
        with pytest.raises(ValidationError):
            ApplicationCreate(jobTitle="SE", companyName="TC", jobDescription="Too short")

    def test_application_response(self):
        now = datetime.now(timezone.utc)
        app_resp = ApplicationResponse(
            id="app1",
            userId="user1",
            jobTitle="SE",
            companyName="TC",
            jobDescription="Desc",
            source="manual",
            status=ApplicationStatus.DRAFT,
            createdAt=now,
            updatedAt=now,
        )
        assert app_resp.id == "app1"
        assert app_resp.user_id == "user1"
        assert app_resp.status == ApplicationStatus.DRAFT
        assert app_resp.created_at == now

    def test_application_update_partial(self):
        app_update = ApplicationUpdate(
            status=ApplicationStatus.INTERVIEWING,
            notes="Follow-up booked",
            rating=4,
        )
        assert app_update.status == ApplicationStatus.INTERVIEWING
        assert app_update.notes == "Follow-up booked"
        assert app_update.rating == 4
