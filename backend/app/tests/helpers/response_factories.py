"""Shared response payload factories for backend API tests."""

from __future__ import annotations

from typing import Any


def make_cover_letter_response(**overrides: Any) -> dict[str, Any]:
    """Return a valid SmartCoverLetter payload."""
    payload: dict[str, Any] = {
        "letter_content": "Dear Hiring Manager,\nI am excited to apply.",
        "subject_line": "Application for Software Engineer",
        "sections": [
            {
                "section_name": "Opening",
                "content": "I am excited to apply.",
                "personalization_elements": ["Role title"],
                "key_messages": ["Strong alignment"],
                "call_to_action": "I welcome the opportunity to discuss further.",
            }
        ],
        "analysis": {
            "readability_score": 85,
            "personalization_score": 88,
            "compelling_score": 84,
            "keyword_alignment": 80,
            "strengths": ["Clear relevance"],
            "improvement_areas": ["Add a quantified impact example"],
            "tone_assessment": "professional",
            "unique_elements": ["Company-specific motivation"],
        },
        "personalization_notes": ["Tailored to the role"],
        "key_selling_points": ["Python expert", "Team player"],
        "company_connections": ["Interest in the company mission"],
        "alternative_versions": {"brief": "Shorter version"},
        "follow_up_suggestions": ["Follow up in one week"],
    }
    payload.update(overrides)
    return payload


def make_optimized_resume_response(**overrides: Any) -> dict[str, Any]:
    """Return a valid OptimizedResume payload."""
    payload: dict[str, Any] = {
        "resume_text": "Optimized resume text",
        "keywords_integrated": ["Python", "Leadership"],
    }
    payload.update(overrides)
    return payload


def make_job_analysis_response(**overrides: Any) -> dict[str, Any]:
    """Return a valid UnifiedJobAnalysis payload."""
    payload: dict[str, Any] = {
        "job_details": {
            "company_name": "Tech Corp",
            "role_title": "Senior Python Developer",
            "full_description": "Build backend systems using Python and FastAPI.",
            "essential_criteria": ["Python"],
            "desirable_criteria": ["FastAPI"],
            "subsectors": [],
            "key_responsibilities": ["Build APIs"],
        },
        "company_context": None,
        "analysis_success": True,
        "error_message": None,
    }
    payload.update(overrides)
    return payload


def make_company_context_response(**overrides: Any) -> dict[str, Any]:
    """Return a valid CompanyContext payload."""
    payload: dict[str, Any] = {
        "recent_achievements": ["Expanded platform capabilities"],
        "core_values": ["Innovation", "Collaboration"],
        "recommended_tone": "conversational",
        "why_work_here_points": ["Meaningful product impact"],
        "interview_questions": ["How is success measured for this role?"],
        "cultural_insights": "Collaborative and fast-moving team.",
    }
    payload.update(overrides)
    return payload
