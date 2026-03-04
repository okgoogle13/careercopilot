"""Unit tests for the ingest API helpers."""

import asyncio
import importlib.util
import sys
from contextlib import contextmanager
from pathlib import Path
from types import ModuleType
from uuid import uuid4

import pytest
from fastapi import BackgroundTasks

MODULE_PATH = Path(__file__).resolve().parents[2] / "api/ingest.py"


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for isolated tests."""
    return None


@contextmanager
def _patched_modules(modules):
    """Temporarily register module stubs in sys.modules."""
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


def _load_ingest_module():
    """Load the ingest module with only its direct imports stubbed."""
    app_module = ModuleType("app")
    app_module.__path__ = []
    core_module = ModuleType("app.core")
    core_module.__path__ = []
    security_module = ModuleType("app.core.security")
    security_module.get_current_user_optional = lambda: None
    core_module.security = security_module

    services_module = ModuleType("app.services")
    services_module.__path__ = []
    google_module = ModuleType("app.services.google_workspace")

    class _GoogleWorkspaceService:
        async def create_task(self, *args, **kwargs):
            return None

        async def schedule_deep_work(self, *args, **kwargs):
            return None

        async def create_doc(self, *args, **kwargs):
            return None

    google_module.GoogleWorkspaceService = _GoogleWorkspaceService
    job_store_module = ModuleType("app.services.job_store")
    job_store_module.get_job_store = lambda: None
    services_module.google_workspace = google_module
    services_module.job_store = job_store_module

    stubs = {
        "app": app_module,
        "app.core": core_module,
        "app.core.security": security_module,
        "app.services": services_module,
        "app.services.google_workspace": google_module,
        "app.services.job_store": job_store_module,
    }

    with _patched_modules(stubs):
        module_name = f"_ingest_test_{uuid4().hex}"
        spec = importlib.util.spec_from_file_location(module_name, MODULE_PATH)
        module = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(module)
        return module


@contextmanager
def _patched_import(name, module):
    """Patch a lazily-imported module for the duration of a test."""
    original = sys.modules.get(name)
    try:
        sys.modules[name] = module
        yield
    finally:
        if original is None:
            sys.modules.pop(name, None)
        else:
            sys.modules[name] = original


class _StubJobStore:
    """Small async job store stand-in used by the API tests."""

    def __init__(self, jobs=None, mode="memory"):
        self.jobs = jobs or {}
        self.mode = mode
        self.added_item = None
        self.updated = []
        self.raise_on_get_all = None

    async def add_job(self, item):
        self.added_item = item
        return "job-1"

    async def get_all_jobs(self, user_id=None):
        if self.raise_on_get_all:
            raise self.raise_on_get_all
        return [job for job in self.jobs.values() if job.get("user_id") == user_id]

    async def get_job(self, job_id):
        return self.jobs.get(job_id)

    async def update_job(self, job_id, updates):
        self.updated.append((job_id, updates))
        self.jobs.setdefault(job_id, {}).update(updates)
        return True

    def get_storage_mode(self):
        return self.mode

    def get_stats(self):
        return {"mode": self.mode, "count": len(self.jobs)}


def test_job_clip_request_supports_internal_user_id():
    """The request model should allow server-side user injection."""
    module = _load_ingest_module()

    payload = module.JobClipRequest(url="https://example.com/job")

    assert payload.source == "browser_extension"
    assert payload.notes is None
    assert payload.user_id is None


def test_process_job_clip_persists_job_and_calls_google_workspace(monkeypatch):
    """Background processing should save the job and create Google tasks."""
    module = _load_ingest_module()
    job_store = _StubJobStore()
    calls = {"task": None, "deep_work": None}

    class _Workspace:
        async def create_task(self, title, notes):
            calls["task"] = (title, notes)
            return {"id": "task-1"}

        async def schedule_deep_work(self, summary, duration_minutes):
            calls["deep_work"] = (summary, duration_minutes)
            return {"id": "event-1"}

    monkeypatch.setattr(module, "GoogleWorkspaceService", _Workspace)
    payload = module.JobClipRequest(
        url="https://example.com/job",
        source="extension",
        notes="Urgent role",
        user_id="user-123",
    )

    asyncio.run(module.process_job_clip(payload, job_store))

    assert job_store.added_item["user_id"] == "user-123"
    assert job_store.added_item["status"] == "pending_analysis"
    assert calls["task"][0] == "Apply: New Opportunity via extension"
    assert "Urgent role" in calls["task"][1]
    assert calls["deep_work"][1] == 45


def test_process_job_clip_ignores_google_workspace_failures(monkeypatch):
    """Non-critical Google integration failures should not abort ingestion."""
    module = _load_ingest_module()
    job_store = _StubJobStore()

    class _Workspace:
        async def create_task(self, *args, **kwargs):
            raise RuntimeError("google unavailable")

        async def schedule_deep_work(self, *args, **kwargs):
            raise AssertionError("schedule_deep_work should not be called")

    monkeypatch.setattr(module, "GoogleWorkspaceService", _Workspace)
    payload = module.JobClipRequest(url="https://example.com/job", user_id="user-123")

    asyncio.run(module.process_job_clip(payload, job_store))

    assert job_store.added_item["url"] == "https://example.com/job"


def test_process_job_clip_re_raises_storage_failures():
    """Primary storage errors should still fail the background task."""
    module = _load_ingest_module()

    class _FailingStore(_StubJobStore):
        async def add_job(self, item):
            self.added_item = item
            raise RuntimeError("write failed")

    payload = module.JobClipRequest(url="https://example.com/job", user_id="user-123")

    with pytest.raises(RuntimeError, match="write failed"):
        asyncio.run(module.process_job_clip(payload, _FailingStore()))


def test_clip_job_queues_background_task_and_defaults_user(monkeypatch):
    """The clip endpoint should schedule background work for single-user mode."""
    module = _load_ingest_module()
    job_store = _StubJobStore()
    background_tasks = BackgroundTasks()
    payload = module.JobClipRequest(url="https://example.com/job")

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    response = asyncio.run(module.clip_job(payload, background_tasks, user_id=None))

    assert response["status"] == "accepted"
    assert response["storage_mode"] == "memory"
    assert response["user_id"] == "default"
    assert payload.user_id == "default"
    assert len(background_tasks.tasks) == 1
    assert background_tasks.tasks[0].func is module.process_job_clip


def test_get_job_queue_filters_using_effective_user(monkeypatch):
    """Queue reads should use the authenticated user when present."""
    module = _load_ingest_module()
    job_store = _StubJobStore(
        jobs={
            "job-1": {"id": "job-1", "user_id": "user-1"},
            "job-2": {"id": "job-2", "user_id": "default"},
        }
    )

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    result = asyncio.run(module.get_job_queue(user_id="user-1"))

    assert result == [{"id": "job-1", "user_id": "user-1"}]


def test_get_job_queue_wraps_storage_errors(monkeypatch):
    """Storage failures should surface as a 500 HTTPException."""
    module = _load_ingest_module()
    job_store = _StubJobStore()
    job_store.raise_on_get_all = RuntimeError("storage down")

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    with pytest.raises(module.HTTPException) as exc_info:
        asyncio.run(module.get_job_queue(user_id=None))

    assert exc_info.value.status_code == 500
    assert "Failed to retrieve job queue" in exc_info.value.detail


def test_trigger_analysis_returns_404_for_missing_job(monkeypatch):
    """Missing jobs should fail before agent execution."""
    module = _load_ingest_module()
    job_store = _StubJobStore()

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    with pytest.raises(module.HTTPException) as exc_info:
        asyncio.run(module.trigger_analysis("missing", user_id=None))

    assert exc_info.value.status_code == 404


def test_trigger_analysis_blocks_cross_user_access(monkeypatch):
    """Authenticated users should not be able to analyze another user's job."""
    module = _load_ingest_module()
    job_store = _StubJobStore(
        jobs={"job-1": {"id": "job-1", "url": "https://example.com/job", "user_id": "owner"}}
    )

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    with pytest.raises(module.HTTPException) as exc_info:
        asyncio.run(module.trigger_analysis("job-1", user_id="someone-else"))

    assert exc_info.value.status_code == 403


def test_trigger_analysis_updates_job_with_agent_results(monkeypatch):
    """Successful analysis should persist extracted details."""
    module = _load_ingest_module()
    job_store = _StubJobStore(
        jobs={
            "job-1": {
                "id": "job-1",
                "url": "https://example.com/job",
                "title": "Pending Analysis",
                "company": "Unknown",
                "user_id": "user-1",
            }
        }
    )

    class _JobScoutAgent:
        async def analyze_job_content(self, url):
            assert url == "https://example.com/job"
            return {
                "title": "Case Manager",
                "company": "Community First",
                "salary": "$90k",
                "deadline": "2026-03-10",
                "status": "ready_to_apply",
            }

    agents_module = ModuleType("app.agents")
    agents_module.__path__ = []
    job_scout_module = ModuleType("app.agents.job_scout")
    job_scout_module.JobScoutAgent = _JobScoutAgent

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    with (
        _patched_import("app.agents", agents_module),
        _patched_import("app.agents.job_scout", job_scout_module),
    ):
        result = asyncio.run(module.trigger_analysis("job-1", user_id="user-1"))

    assert result["status"] == "success"
    assert result["data"]["title"] == "Case Manager"
    assert job_store.updated[0][0] == "job-1"
    assert job_store.updated[0][1]["title"] == "Case Manager"
    assert job_store.updated[0][1]["status"] == "ready_to_apply"


def test_trigger_analysis_wraps_empty_agent_results_as_http_500(monkeypatch):
    """A falsey agent result is re-wrapped by the endpoint error handler."""
    module = _load_ingest_module()
    job_store = _StubJobStore(
        jobs={
            "job-1": {
                "id": "job-1",
                "url": "https://example.com/job",
                "title": "Pending Analysis",
                "company": "Unknown",
                "user_id": "user-1",
            }
        }
    )

    class _JobScoutAgent:
        async def analyze_job_content(self, _url):
            return None

    agents_module = ModuleType("app.agents")
    agents_module.__path__ = []
    job_scout_module = ModuleType("app.agents.job_scout")
    job_scout_module.JobScoutAgent = _JobScoutAgent

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    with (
        _patched_import("app.agents", agents_module),
        _patched_import("app.agents.job_scout", job_scout_module),
        pytest.raises(module.HTTPException) as exc_info,
    ):
        asyncio.run(module.trigger_analysis("job-1", user_id="user-1"))

    assert exc_info.value.status_code == 500
    assert "Analysis error:" in exc_info.value.detail


def test_trigger_analysis_wraps_agent_exceptions(monkeypatch):
    """Unexpected analysis errors should become a 500 HTTPException."""
    module = _load_ingest_module()
    job_store = _StubJobStore(
        jobs={
            "job-1": {
                "id": "job-1",
                "url": "https://example.com/job",
                "title": "Pending Analysis",
                "company": "Unknown",
                "user_id": "user-1",
            }
        }
    )

    class _JobScoutAgent:
        async def analyze_job_content(self, _url):
            raise RuntimeError("agent crashed")

    agents_module = ModuleType("app.agents")
    agents_module.__path__ = []
    job_scout_module = ModuleType("app.agents.job_scout")
    job_scout_module.JobScoutAgent = _JobScoutAgent

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    with (
        _patched_import("app.agents", agents_module),
        _patched_import("app.agents.job_scout", job_scout_module),
        pytest.raises(module.HTTPException) as exc_info,
    ):
        asyncio.run(module.trigger_analysis("job-1", user_id="user-1"))

    assert exc_info.value.status_code == 500
    assert exc_info.value.detail == "Analysis error: agent crashed"


def test_draft_cover_letter_requires_completed_analysis(monkeypatch):
    """Pending jobs should be rejected before the ghostwriter runs."""
    module = _load_ingest_module()
    job_store = _StubJobStore(
        jobs={"job-1": {"id": "job-1", "status": "pending_analysis", "user_id": "default"}}
    )

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    with pytest.raises(module.HTTPException) as exc_info:
        asyncio.run(module.draft_cover_letter("job-1", create_google_doc=False, user_id=None))

    assert exc_info.value.status_code == 400
    assert "Job must be analyzed" in exc_info.value.detail


def test_draft_cover_letter_returns_404_for_missing_job(monkeypatch):
    """Missing jobs should fail before drafting starts."""
    module = _load_ingest_module()
    job_store = _StubJobStore()

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    with pytest.raises(module.HTTPException) as exc_info:
        asyncio.run(module.draft_cover_letter("missing", create_google_doc=False, user_id=None))

    assert exc_info.value.status_code == 404


def test_draft_cover_letter_blocks_cross_user_access(monkeypatch):
    """Authenticated users should not draft for another user's job."""
    module = _load_ingest_module()
    job_store = _StubJobStore(
        jobs={
            "job-1": {
                "id": "job-1",
                "status": "ready_to_apply",
                "title": "Case Manager",
                "company": "Community First",
                "user_id": "owner",
            }
        }
    )

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    with pytest.raises(module.HTTPException) as exc_info:
        asyncio.run(
            module.draft_cover_letter("job-1", create_google_doc=False, user_id="someone-else")
        )

    assert exc_info.value.status_code == 403


def test_draft_cover_letter_saves_content_and_google_doc(monkeypatch):
    """Draft generation should persist the document and optional Google Doc link."""
    module = _load_ingest_module()
    cover_letter = (
        "I am excited to apply for this community services opportunity and bring "
        "strong client advocacy, case coordination, and stakeholder communication experience."
    )
    job_store = _StubJobStore(
        jobs={
            "job-1": {
                "id": "job-1",
                "title": "Case Manager",
                "company": "Community First",
                "status": "ready_to_apply",
                "user_id": "user-1",
            }
        }
    )

    class _GhostwriterAgent:
        async def generate_cover_letter(self, job):
            assert job["title"] == "Case Manager"
            return cover_letter

    class _Workspace:
        async def create_doc(self, title, body):
            assert "Case Manager" in title
            assert body == cover_letter
            return {
                "status": "success",
                "documentId": "doc-1",
                "webViewLink": "https://docs.example/doc-1",
            }

    agents_module = ModuleType("app.agents")
    agents_module.__path__ = []
    ghostwriter_module = ModuleType("app.agents.ghostwriter")
    ghostwriter_module.GhostwriterAgent = _GhostwriterAgent

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)
    monkeypatch.setattr(module, "GoogleWorkspaceService", _Workspace)

    with (
        _patched_import("app.agents", agents_module),
        _patched_import("app.agents.ghostwriter", ghostwriter_module),
    ):
        result = asyncio.run(
            module.draft_cover_letter("job-1", create_google_doc=True, user_id="user-1")
        )

    assert result["status"] == "success"
    assert result["data"]["job_title"] == "Case Manager"
    assert result["data"]["google_doc"]["documentId"] == "doc-1"
    assert job_store.updated[0][1]["cover_letter"] == cover_letter
    assert job_store.updated[1][1]["google_doc_url"] == "https://docs.example/doc-1"


def test_draft_cover_letter_accepts_credentials_missing_google_doc(monkeypatch):
    """Credentials-missing doc creation should not fail the draft request."""
    module = _load_ingest_module()
    cover_letter = "A" * 80
    job_store = _StubJobStore(
        jobs={
            "job-1": {
                "id": "job-1",
                "title": "Case Manager",
                "company": "Community First",
                "status": "ready_to_apply",
                "user_id": "user-1",
            }
        }
    )

    class _GhostwriterAgent:
        async def generate_cover_letter(self, _job):
            return cover_letter

    class _Workspace:
        async def create_doc(self, _title, _body):
            return {"status": "credentials_missing", "message": "no creds"}

    agents_module = ModuleType("app.agents")
    agents_module.__path__ = []
    ghostwriter_module = ModuleType("app.agents.ghostwriter")
    ghostwriter_module.GhostwriterAgent = _GhostwriterAgent

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)
    monkeypatch.setattr(module, "GoogleWorkspaceService", _Workspace)

    with (
        _patched_import("app.agents", agents_module),
        _patched_import("app.agents.ghostwriter", ghostwriter_module),
    ):
        result = asyncio.run(
            module.draft_cover_letter("job-1", create_google_doc=True, user_id="user-1")
        )

    assert result["status"] == "success"
    assert result["data"]["google_doc"]["status"] == "credentials_missing"
    assert len(job_store.updated) == 1


def test_draft_cover_letter_ignores_google_doc_creation_errors(monkeypatch):
    """Google Doc creation errors should be logged and ignored."""
    module = _load_ingest_module()
    cover_letter = "B" * 80
    job_store = _StubJobStore(
        jobs={
            "job-1": {
                "id": "job-1",
                "title": "Case Manager",
                "company": "Community First",
                "status": "ready_to_apply",
                "user_id": "user-1",
            }
        }
    )

    class _GhostwriterAgent:
        async def generate_cover_letter(self, _job):
            return cover_letter

    class _Workspace:
        async def create_doc(self, _title, _body):
            raise RuntimeError("docs down")

    agents_module = ModuleType("app.agents")
    agents_module.__path__ = []
    ghostwriter_module = ModuleType("app.agents.ghostwriter")
    ghostwriter_module.GhostwriterAgent = _GhostwriterAgent

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)
    monkeypatch.setattr(module, "GoogleWorkspaceService", _Workspace)

    with (
        _patched_import("app.agents", agents_module),
        _patched_import("app.agents.ghostwriter", ghostwriter_module),
    ):
        result = asyncio.run(
            module.draft_cover_letter("job-1", create_google_doc=True, user_id="user-1")
        )

    assert result["status"] == "success"
    assert "google_doc" not in result["data"]
    assert len(job_store.updated) == 1


def test_draft_cover_letter_wraps_short_content_as_http_500(monkeypatch):
    """Short content should hit the explicit insufficient-content branch."""
    module = _load_ingest_module()
    job_store = _StubJobStore(
        jobs={
            "job-1": {
                "id": "job-1",
                "title": "Case Manager",
                "company": "Community First",
                "status": "ready_to_apply",
                "user_id": "user-1",
            }
        }
    )

    class _GhostwriterAgent:
        async def generate_cover_letter(self, _job):
            return "too short"

    agents_module = ModuleType("app.agents")
    agents_module.__path__ = []
    ghostwriter_module = ModuleType("app.agents.ghostwriter")
    ghostwriter_module.GhostwriterAgent = _GhostwriterAgent

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    with (
        _patched_import("app.agents", agents_module),
        _patched_import("app.agents.ghostwriter", ghostwriter_module),
        pytest.raises(module.HTTPException) as exc_info,
    ):
        asyncio.run(module.draft_cover_letter("job-1", create_google_doc=False, user_id="user-1"))

    assert exc_info.value.status_code == 500
    assert "Draft error:" in exc_info.value.detail


def test_draft_cover_letter_wraps_ghostwriter_failures(monkeypatch):
    """Unexpected ghostwriter errors should surface as a 500 HTTPException."""
    module = _load_ingest_module()
    job_store = _StubJobStore(
        jobs={
            "job-1": {
                "id": "job-1",
                "title": "Case Manager",
                "company": "Community First",
                "status": "ready_to_apply",
                "user_id": "user-1",
            }
        }
    )

    class _GhostwriterAgent:
        async def generate_cover_letter(self, _job):
            raise RuntimeError("ghostwriter failed")

    agents_module = ModuleType("app.agents")
    agents_module.__path__ = []
    ghostwriter_module = ModuleType("app.agents.ghostwriter")
    ghostwriter_module.GhostwriterAgent = _GhostwriterAgent

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    with (
        _patched_import("app.agents", agents_module),
        _patched_import("app.agents.ghostwriter", ghostwriter_module),
        pytest.raises(module.HTTPException) as exc_info,
    ):
        asyncio.run(module.draft_cover_letter("job-1", create_google_doc=False, user_id="user-1"))

    assert exc_info.value.status_code == 500
    assert exc_info.value.detail == "Draft error: ghostwriter failed"


def test_get_storage_status_returns_store_stats(monkeypatch):
    """The status endpoint should proxy the store statistics."""
    module = _load_ingest_module()
    job_store = _StubJobStore(jobs={"job-1": {"id": "job-1"}}, mode="firestore")

    monkeypatch.setattr(module, "get_job_store", lambda: job_store)

    result = asyncio.run(module.get_storage_status())

    assert result == {
        "status": "ok",
        "storage": {"mode": "firestore", "count": 1},
        "message": "Using firestore storage",
    }
