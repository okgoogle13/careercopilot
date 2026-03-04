"""Unit tests for the email task workflow."""

import asyncio
import importlib.util
import sys
from contextlib import contextmanager
from pathlib import Path
from types import ModuleType, SimpleNamespace
from uuid import uuid4

import pytest

MODULE_PATH = Path(__file__).resolve().parents[2] / "genkit_flows/email_task_workflow.py"


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for isolated tests."""
    return None


@contextmanager
def _patched_modules(modules):
    originals = {name: sys.modules.get(name) for name in modules}
    try:
        for name, module in modules.items():
            sys.modules[name] = module
        yield
    finally:
        for name, original in originals.items():
            if original is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = original


def _load_module():
    """Load the workflow module with stubbed dependencies."""
    app_module = ModuleType("app")
    app_module.__path__ = []
    core_module = ModuleType("app.core")
    core_module.__path__ = []
    models_module = ModuleType("app.models")
    models_module.__path__ = []
    genkit_pkg = ModuleType("app.genkit_flows")
    genkit_pkg.__path__ = []

    ai_config_module = ModuleType("app.core.ai_config")
    ai_config_module.get_ai_config = lambda: SimpleNamespace(
        get_model_config=lambda _name: {"name": "stub-model"}
    )

    ai_error_module = ModuleType("app.core.ai_error_handling")
    ai_error_module.with_ai_error_handling = lambda: (lambda fn: fn)

    class InputValidationError(Exception):
        pass

    class InputSanitizer:
        @staticmethod
        def sanitize_text_input(value):
            return SimpleNamespace(sanitized_content=value.strip())

    input_validation_module = ModuleType("app.core.input_validation")
    input_validation_module.InputSanitizer = InputSanitizer
    input_validation_module.InputValidationError = InputValidationError

    class _UserIdColumn:
        def __eq__(self, value):
            return ("eq", value)

    models_database_module = ModuleType("app.models.database")
    models_database_module.User = type("User", (), {"id": _UserIdColumn()})

    state = {"user": None, "db_error": None}

    class _DbQuery:
        def filter(self, *_args):
            return self

        def first(self):
            if state["db_error"]:
                raise state["db_error"]
            return state["user"]

    class _Db:
        def __init__(self):
            self.closed = False

        def query(self, _model):
            return _DbQuery()

        def close(self):
            self.closed = True

    database_module = ModuleType("app.core.database")
    database_module.SessionLocal = lambda: _Db()
    database_module._state = state

    advanced_module = ModuleType("app.genkit_flows.advanced_job_matching")
    advanced_module.analyze_job_match_detailed = lambda *_args, **_kwargs: _awaitable(
        SimpleNamespace(overall_match_score=60)
    )

    calendar_module = ModuleType("app.genkit_flows.calendar_manager")
    calendar_module.createCalendarEvent = lambda *_args, **_kwargs: _awaitable("event-1")

    scanner_module = ModuleType("app.genkit_flows.email_scanner")
    scanner_module.scanEmailsForJobOpportunities = lambda *_args, **_kwargs: _awaitable(
        {"success": True, "opportunities": []}
    )

    stubs = {
        "app": app_module,
        "app.core": core_module,
        "app.models": models_module,
        "app.genkit_flows": genkit_pkg,
        "app.core.ai_config": ai_config_module,
        "app.core.ai_error_handling": ai_error_module,
        "app.core.database": database_module,
        "app.core.input_validation": input_validation_module,
        "app.models.database": models_database_module,
        "app.genkit_flows.advanced_job_matching": advanced_module,
        "app.genkit_flows.calendar_manager": calendar_module,
        "app.genkit_flows.email_scanner": scanner_module,
    }

    with _patched_modules(stubs):
        module_name = f"app.genkit_flows._email_task_workflow_test_{uuid4().hex}"
        spec = importlib.util.spec_from_file_location(module_name, MODULE_PATH)
        module = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(module)
        module._test_db_state = state
        return module


def test_scan_inbox_rejects_invalid_user_id():
    """Invalid input should return a failed workflow result, not crash."""
    module = _load_module()

    result = asyncio.run(module.scan_inbox_for_opportunities(""))

    assert result.success is False
    assert "User ID is required" in result.error_message


def test_scan_inbox_returns_scanner_error_and_no_opportunities(monkeypatch):
    """Scanner failures and empty inboxes should return early, structured results."""
    module = _load_module()

    async def failing_scan(_user_id):
        return {"success": False, "error": "gmail unavailable"}

    monkeypatch.setattr(module, "scanEmailsForJobOpportunities", failing_scan)
    failed = asyncio.run(module.scan_inbox_for_opportunities(" user-1 "))
    assert failed.success is False
    assert "Email scanning failed" in failed.error_message

    async def empty_scan(_user_id):
        return {"success": True, "opportunities": []}

    monkeypatch.setattr(module, "scanEmailsForJobOpportunities", empty_scan)
    empty = asyncio.run(module.scan_inbox_for_opportunities(" user-1 "))
    assert empty.success is True
    assert empty.total_opportunities_found == 0


def test_scan_inbox_processes_opportunities_and_counts_results(monkeypatch):
    """Successful runs should aggregate processed opportunity counts."""
    module = _load_module()

    async def scan(_user_id):
        return {
            "success": True,
            "opportunities": [{"id": "1"}, {"id": "2"}],
        }

    async def profile(_user_id):
        return {"skills": ["community services"]}

    processed = [
        module.OpportunityTaskResult(
            opportunity_id="1",
            job_title="Role 1",
            company="A",
            match_score=90,
            task_created=True,
            calendar_event_id="event-1",
            processing_status="success",
        ),
        module.OpportunityTaskResult(
            opportunity_id="2",
            job_title="Role 2",
            company="B",
            match_score=70,
            task_created=False,
            processing_status="success",
        ),
    ]

    async def process(_user_id, opportunity, _profile):
        return processed[int(opportunity["id"]) - 1]

    monkeypatch.setattr(module, "scanEmailsForJobOpportunities", scan)
    monkeypatch.setattr(module, "_get_user_profile", profile)
    monkeypatch.setattr(module, "_process_opportunity", process)

    result = asyncio.run(module.scan_inbox_for_opportunities("user-1"))

    assert result.success is True
    assert result.total_opportunities_found == 2
    assert result.opportunities_processed == 2
    assert result.high_scoring_opportunities == 1
    assert result.tasks_created == 1


def test_process_opportunity_low_high_and_error_paths(monkeypatch):
    """Opportunity processing should cover low score, task creation, and failures."""
    module = _load_module()
    base_opportunity = {
        "id": "job-1",
        "title": "Case Manager",
        "company": "Community First",
        "description": "Provide client support",
        "deadline": "2026-03-10",
        "source_url": "https://example.com/job",
    }

    async def low_match(_job_description, _profile):
        return SimpleNamespace(overall_match_score=60)

    monkeypatch.setattr(module, "analyze_job_match_detailed", low_match)
    low = asyncio.run(module._process_opportunity("user-1", base_opportunity, {}))
    assert low.processing_status == "success"
    assert low.task_created is False

    async def high_match(_job_description, _profile):
        return SimpleNamespace(overall_match_score=95)

    monkeypatch.setattr(module, "analyze_job_match_detailed", high_match)
    monkeypatch.setattr(
        module, "createCalendarEvent", lambda *_args, **_kwargs: _awaitable("event-9")
    )
    high = asyncio.run(module._process_opportunity("user-1", base_opportunity, {}))
    assert high.task_created is True
    assert high.calendar_event_id == "event-9"

    no_deadline = dict(base_opportunity)
    no_deadline["deadline"] = ""
    without_deadline = asyncio.run(module._process_opportunity("user-1", no_deadline, {}))
    assert without_deadline.task_created is False
    assert "No deadline available" in without_deadline.error_message

    async def bad_calendar(*_args, **_kwargs):
        raise RuntimeError("calendar down")

    monkeypatch.setattr(module, "createCalendarEvent", bad_calendar)
    calendar_failed = asyncio.run(module._process_opportunity("user-1", base_opportunity, {}))
    assert "Calendar task creation failed" in calendar_failed.error_message

    async def bad_match(*_args, **_kwargs):
        raise RuntimeError("matcher down")

    monkeypatch.setattr(module, "analyze_job_match_detailed", bad_match)
    failed = asyncio.run(module._process_opportunity("user-1", base_opportunity, {}))
    assert failed.processing_status == "failed"
    assert failed.error_message == "matcher down"


def test_get_user_profile_returns_db_profile_or_default():
    """Profile loading should map user records and fall back when missing or broken."""
    module = _load_module()
    module._test_db_state["user"] = SimpleNamespace(
        to_dict=lambda: {
            "career_transition_from": "Finance",
            "target_roles": ["Case Manager"],
            "location": "Sydney",
            "career_transition_to": "Social Work",
        }
    )
    module._test_db_state["db_error"] = None

    profile = asyncio.run(module._get_user_profile("user-1"))
    assert profile["current_role"] == "Finance"
    assert profile["skills"] == ["Case Manager"]

    module._test_db_state["user"] = None
    default_profile = asyncio.run(module._get_user_profile("user-1"))
    assert default_profile == module._get_default_user_profile()

    module._test_db_state["db_error"] = RuntimeError("db down")
    errored_profile = asyncio.run(module._get_user_profile("user-1"))
    assert errored_profile == module._get_default_user_profile()


def test_default_profile_and_job_description_helpers():
    """Helper functions should return predictable fallback structures."""
    module = _load_module()
    default_profile = module._get_default_user_profile()
    job_text = module._create_job_description_text(
        {
            "title": "Support Worker",
            "company": "Community First",
            "deadline": "2026-03-10",
            "source_url": "https://example.com/job",
            "description": "Assist clients across community programs.",
        }
    )

    assert default_profile["preferred_location"] == "Remote"
    assert "Support Worker" in job_text
    assert "Community First" in job_text
    assert "Assist clients" in job_text


def _awaitable(value):
    async def _inner(*_args, **_kwargs):
        return value

    return _inner()
