# backend/app/tests/core/test_pdf_renderer.py
from __future__ import annotations

from app.core import pdf_renderer


def test_render_cover_letter_pdf() -> None:
    content = "Dear Hiring Manager,\n\nI am writing to express my interest in this role.\n\nSincerely,\nCandidate"
    candidate_name = "Jane Doe"
    pdf_bytes = pdf_renderer.render_cover_letter_pdf(
        content=content,
        candidate_name=candidate_name,
    )
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 0
    # A PDF should start with the PDF signature
    assert pdf_bytes.startswith(b"%PDF-")


def test_render_resume_pdf() -> None:
    sections = {
        "basics": {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "0400000000",
            "location": "Melbourne, VIC",
        },
        "summary": "Experienced social worker specializing in crisis care.",
        "work": [
            {
                "role": "Crisis Case Worker",
                "company": "Support Services",
                "startDate": "2020",
                "endDate": "Present",
                "bullets": ["Managed high-risk case loads.", "Advocated for clients in court."],
            }
        ],
    }
    pdf_bytes = pdf_renderer.render_resume_pdf(
        sections=sections,
        candidate_name="Jane Doe",
    )
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 0
    assert pdf_bytes.startswith(b"%PDF-")


def test_render_ksc_pdf() -> None:
    responses = [
        {
            "criterion": "Proven ability to support vulnerable youth",
            "response": "In my previous role as youth support worker, I successfully assisted...\n\nThis resulted in improved outcomes.",
        }
    ]
    pdf_bytes = pdf_renderer.render_ksc_pdf(
        responses=responses,
        job_title="Youth Worker Lead",
    )
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 0
    assert pdf_bytes.startswith(b"%PDF-")
