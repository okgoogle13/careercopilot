"""Shared request payload factories for backend API tests."""

from __future__ import annotations

from typing import Any


def make_cover_letter_request(**overrides: Any) -> dict[str, Any]:
    """Return a valid cover-letter request payload."""
    payload: dict[str, Any] = {
        "candidate_profile": {"name": "John Doe", "skills": ["Python"]},
        "job_description": "Python developer position",
        "company_info": {"name": "Test Corp"},
        "style": "professional",
    }
    payload.update(overrides)
    return payload


def make_ksc_request(**overrides: Any) -> dict[str, Any]:
    """Return a valid KSC request payload."""
    payload: dict[str, Any] = {
        "user_profile_data": {"experience": []},
        "ksc_statement": "Demonstrated ability to work in a team",
    }
    payload.update(overrides)
    return payload


def make_resume_optimization_request(**overrides: Any) -> dict[str, Any]:
    """Return a valid resume-optimization request payload."""
    payload: dict[str, Any] = {
        "resume_text": "Original resume text",
        "missing_keywords": ["FastAPI"],
        "job_description": "Software Engineer role using Python and FastAPI.",
    }
    payload.update(overrides)
    return payload


def make_company_context_request(**overrides: Any) -> dict[str, Any]:
    """Return a valid company-context request payload."""
    payload: dict[str, Any] = {
        "company_name": "Test Corp",
        "job_description": "Software engineering role building APIs.",
    }
    payload.update(overrides)
    return payload


def make_analysis_optimize_request(**overrides: Any) -> dict[str, Any]:
    """Return a valid analysis optimize-resume payload."""
    payload: dict[str, Any] = {
        "job_description": "We need a Python developer.",
        "resume_text": "Original Resume",
    }
    payload.update(overrides)
    return payload


def make_application_create_request(**overrides: Any) -> dict[str, Any]:
    """Return a valid application creation payload."""
    payload: dict[str, Any] = {
        "job_id": "test-job",
        "status": "applied",
        "notes": "Integration test",
    }
    payload.update(overrides)
    return payload


def make_generate_application_request(**overrides: Any) -> dict[str, Any]:
    """Return a valid workflow generate-application payload."""
    payload: dict[str, Any] = {
        "job_description": "x" * 80,
        "user_profile": {"resume": "example-resume"},
    }
    payload.update(overrides)
    return payload
