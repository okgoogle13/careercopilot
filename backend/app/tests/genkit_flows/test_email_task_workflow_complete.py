"""Comprehensive tests for email_task_workflow."""

from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.genkit_flows import email_task_workflow as module


@pytest.mark.asyncio
async def test_scan_inbox_rejects_invalid_user_id():
    result = await module.scan_inbox_for_opportunities("")
    assert result.success is False
    assert "User ID is required" in result.error_message


@pytest.mark.asyncio
async def test_scan_inbox_handles_scanner_failure(monkeypatch):
    monkeypatch.setattr(
        module,
        "scanEmailsForJobOpportunities",
        AsyncMock(return_value={"success": False, "error": "scanner unavailable"}),
    )

    result = await module.scan_inbox_for_opportunities("user-1")

    assert result.success is False
    assert result.total_opportunities_found == 0
    assert "Email scanning failed" in result.error_message


@pytest.mark.asyncio
async def test_scan_inbox_no_opportunities_is_success(monkeypatch):
    monkeypatch.setattr(
        module,
        "scanEmailsForJobOpportunities",
        AsyncMock(return_value={"success": True, "opportunities": []}),
    )

    result = await module.scan_inbox_for_opportunities("user-1")

    assert result.success is True
    assert result.total_opportunities_found == 0
    assert result.opportunities_processed == 0


@pytest.mark.asyncio
async def test_scan_inbox_processes_opportunities_and_counts(monkeypatch):
    monkeypatch.setattr(
        module,
        "scanEmailsForJobOpportunities",
        AsyncMock(
            return_value={
                "success": True,
                "opportunities": [{"id": "o1", "title": "Role"}, {"id": "o2", "title": "Role2"}],
            }
        ),
    )
    monkeypatch.setattr(module, "_get_user_profile", AsyncMock(return_value={"skills": []}))
    monkeypatch.setattr(
        module,
        "_process_opportunity",
        AsyncMock(
            side_effect=[
                module.OpportunityTaskResult(
                    opportunity_id="o1",
                    job_title="Role",
                    company="A",
                    match_score=81,
                    task_created=True,
                    processing_status="success",
                ),
                module.OpportunityTaskResult(
                    opportunity_id="o2",
                    job_title="Role2",
                    company="B",
                    match_score=50,
                    task_created=False,
                    processing_status="success",
                ),
            ]
        ),
    )

    result = await module.scan_inbox_for_opportunities("user-1")

    assert result.success is True
    assert result.total_opportunities_found == 2
    assert result.opportunities_processed == 2
    assert result.high_scoring_opportunities == 1
    assert result.tasks_created == 1


@pytest.mark.asyncio
async def test_process_opportunity_high_score_creates_calendar_event(monkeypatch):
    monkeypatch.setattr(
        module,
        "analyze_job_match_detailed",
        AsyncMock(return_value=SimpleNamespace(overall_match_score=95)),
    )
    monkeypatch.setattr(module, "createCalendarEvent", AsyncMock(return_value="evt-1"))

    result = await module._process_opportunity(
        "user-1",
        {
            "id": "opp-1",
            "title": "Role",
            "company": "Org",
            "description": "Desc",
            "deadline": "2026-05-01",
        },
        {"skills": []},
    )

    assert result.processing_status == "success"
    assert result.match_score == 95
    assert result.task_created is True
    assert result.calendar_event_id == "evt-1"


@pytest.mark.asyncio
async def test_process_opportunity_high_score_without_deadline_sets_error(monkeypatch):
    monkeypatch.setattr(
        module,
        "analyze_job_match_detailed",
        AsyncMock(return_value=SimpleNamespace(overall_match_score=90)),
    )

    result = await module._process_opportunity(
        "user-1",
        {"id": "opp-1", "title": "Role", "company": "Org", "description": "Desc"},
        {"skills": []},
    )

    assert result.processing_status == "success"
    assert result.task_created is False
    assert "No deadline" in result.error_message


@pytest.mark.asyncio
async def test_process_opportunity_failure_path(monkeypatch):
    monkeypatch.setattr(
        module, "analyze_job_match_detailed", AsyncMock(side_effect=RuntimeError("match failed"))
    )

    result = await module._process_opportunity("user-1", {"id": "opp-1"}, {"skills": []})

    assert result.processing_status == "failed"
    assert "match failed" in result.error_message


@pytest.mark.asyncio
async def test_get_user_profile_from_db_and_default_paths(monkeypatch):
    user_obj = SimpleNamespace(
        to_dict=lambda: {
            "career_transition_from": "Finance",
            "target_roles": ["Case Manager"],
            "location": "Melbourne",
            "career_transition_to": "Social Work",
        }
    )
    db = SimpleNamespace(
        query=lambda *_a, **_k: SimpleNamespace(
            filter=lambda *_a, **_k: SimpleNamespace(first=lambda: user_obj)
        ),
        close=lambda: None,
    )
    monkeypatch.setattr(module, "SessionLocal", lambda: db)

    profile = await module._get_user_profile("user-1")
    assert profile["current_role"] == "Finance"
    assert profile["career_goals"] == "Social Work"

    db_missing = SimpleNamespace(
        query=lambda *_a, **_k: SimpleNamespace(
            filter=lambda *_a, **_k: SimpleNamespace(first=lambda: None)
        ),
        close=lambda: None,
    )
    monkeypatch.setattr(module, "SessionLocal", lambda: db_missing)

    fallback = await module._get_user_profile("missing")
    assert fallback["current_role"] == "Professional"


def test_default_profile_and_job_text_helpers():
    profile = module._get_default_user_profile()
    assert profile["preferred_location"] == "Remote"

    job_text = module._create_job_description_text(
        {"title": "Role", "company": "Org", "description": "Desc"}
    )
    assert "Job Title: Role" in job_text
    assert "Company: Org" in job_text
