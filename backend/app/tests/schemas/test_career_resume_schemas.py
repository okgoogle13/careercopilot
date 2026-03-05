"""Schema validation tests for career and resume models."""

import pytest
from pydantic import ValidationError

from app.schemas.career import (
    CareerDatabase,
    CareerEntry,
    EntryType,
    PersonalInfo,
    StructuredAchievement,
)
from app.schemas.resume import Education, Experience, ResumeAnalysisResult


def _valid_entry() -> CareerEntry:
    return CareerEntry(
        entry_id="entry-1",
        entry_type=EntryType.WORK,
        organization="Org",
        role="Case Manager",
        start_date="2020-01",
        end_date="2022-01",
        core_responsibilities="Support clients",
    )


def _valid_achievement() -> StructuredAchievement:
    return StructuredAchievement(
        achievement_id="ach-1",
        entry_id="entry-1",
        original_text="Improved client outcomes",
        action_verb="Improved",
        noun_task="client support process",
        metric="Increased satisfaction by X%",
        strategy="Implemented regular check-ins",
        outcome="Higher retention",
    )


def test_career_entry_rejects_invalid_entry_type():
    with pytest.raises(ValidationError):
        CareerEntry(
            entry_id="entry-1",
            entry_type="Invalid",
            organization="Org",
            role="Case Manager",
            start_date="2020-01",
            end_date="2022-01",
            core_responsibilities="Support clients",
        )


def test_career_database_requires_personal_info():
    with pytest.raises(ValidationError):
        CareerDatabase(entries=[_valid_entry()], achievements=[_valid_achievement()])


def test_structured_achievement_list_defaults_are_isolated():
    first = _valid_achievement()
    second = _valid_achievement()

    first.skills_used.append("Trauma-informed care")

    assert second.skills_used == []


def test_personal_info_links_default_isolated():
    p1 = PersonalInfo(full_name="A", email="a@example.com")
    p2 = PersonalInfo(full_name="B", email="b@example.com")

    p1.links.append("https://example.com")

    assert p2.links == []


def test_education_year_requires_int():
    with pytest.raises(ValidationError):
        Education(degree="B", field="Social Work", institution="Uni", year="two thousand")


def test_experience_defaults_current_false_and_end_date_none():
    exp = Experience(title="Support Worker", company="Org", start_date="2021-01")

    assert exp.current is False
    assert exp.end_date is None


def test_resume_analysis_result_defaults_and_raw_data_optional():
    result = ResumeAnalysisResult()

    assert result.skills == []
    assert result.experience == []
    assert result.education == []
    assert result.summary == ""
    assert result.raw_data is None
