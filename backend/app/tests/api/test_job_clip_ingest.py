"""Tests for Job Clip Ingestion API endpoints in app/api/ingest.py."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import FastAPI, status
from fastapi.testclient import TestClient

from app.api.ingest import router as ingest_router


@pytest.fixture
def mock_job_store():
    with patch("app.api.ingest.get_job_store") as mock:
        store = MagicMock()
        store.add_job = AsyncMock(return_value="job_123")
        store.get_all_jobs = AsyncMock(return_value=[])
        store.get_job = AsyncMock(return_value=None)
        store.update_job = AsyncMock(return_value=None)
        store.get_storage_mode = MagicMock(return_value="mock_firestore")
        store.get_stats = MagicMock(return_value={"mode": "mock_firestore", "count": 0})
        mock.return_value = store
        yield store


@pytest.fixture
def mock_gw_service():
    with patch("app.api.ingest.GoogleWorkspaceService") as mock:
        service = MagicMock()
        service.create_task = AsyncMock(return_value={"id": "task_123"})
        service.schedule_deep_work = AsyncMock(return_value={"id": "event_123"})
        service.create_doc = AsyncMock(
            return_value={"status": "success", "webViewLink": "http://docs.google.com/123"}
        )
        mock.return_value = service
        yield service


@pytest.fixture
def api_client():
    # Use a clean client with the specific router being tested
    test_app = FastAPI()
    test_app.include_router(ingest_router)
    with TestClient(test_app) as client:
        yield client


class TestJobClipIngest:
    def test_clip_job_success(self, api_client, mock_job_store, mock_gw_service):
        """Should accept a job clip and trigger background processing."""
        # Payload matches JobClipRequest
        payload = {
            "url": "https://example.com/job/123",
            "notes": "Great job opportunity",
            "source": "manual",
        }

        response = api_client.post("/clip", json=payload)

        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "accepted"
        assert response.json()["user_id"] == "default"  # Assuming no auth

        # Verify job store called (in background task)
        # Note: In TestClient, background tasks run after the response is returned
        mock_job_store.add_job.assert_called_once()
        mock_gw_service.create_task.assert_called_once()
        mock_gw_service.schedule_deep_work.assert_called_once()

    def test_get_job_queue_empty(self, api_client, mock_job_store):
        """Should return an empty list when no jobs are found."""
        mock_job_store.get_all_jobs.return_value = []

        response = api_client.get("/queue")

        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []
        mock_job_store.get_all_jobs.assert_called_once_with(user_id="default")

    def test_trigger_analysis_success(self, api_client, mock_job_store):
        """Should trigger JobScout agent analysis."""
        job_id = "job_123"
        mock_job_store.get_job.return_value = {
            "id": job_id,
            "url": "https://example.com/job/123",
            "title": "Pending Analysis",
            "company": "Unknown",
            "user_id": "default",
        }

        mock_result = {
            "title": "Senior Engineer",
            "company": "Tech Corp",
            "salary": "$150k",
            "status": "ready_to_apply",
        }

        with patch("app.agents.job_scout.JobScoutAgent") as MockAgent:
            agent = MockAgent.return_value
            agent.analyze_job_content = AsyncMock(return_value=mock_result)

            response = api_client.post(f"/{job_id}/analyze")

            assert response.status_code == status.HTTP_200_OK
            assert response.json()["status"] == "success"
            assert response.json()["data"]["title"] == "Senior Engineer"

            mock_job_store.update_job.assert_called_once()
            # Check that update_job was called with the right data
            args, _ = mock_job_store.update_job.call_args
            assert args[0] == job_id
            assert args[1]["title"] == "Senior Engineer"

    def test_trigger_analysis_not_found(self, api_client, mock_job_store):
        """Should return 404 if job doesn't exist."""
        mock_job_store.get_job.return_value = None

        response = api_client.post("/api/ingest/nonexistent/analyze")
        assert response.status_code == 404

    def test_draft_cover_letter_success(self, api_client, mock_job_store, mock_gw_service):
        """Should trigger Ghostwriter agent and optionally create a Google Doc."""
        job_id = "job_123"
        mock_job_store.get_job.return_value = {
            "id": job_id,
            "url": "https://example.com/job/123",
            "title": "Senior Engineer",
            "company": "Tech Corp",
            "user_id": "default",
            "status": "ready_to_apply",
        }

        mock_letter = "Dear Hiring Manager, I am very interested in the Senior Engineer position at Tech Corp..."

        with patch("app.agents.ghostwriter.GhostwriterAgent") as MockAgent:
            agent = MockAgent.return_value
            agent.generate_cover_letter = AsyncMock(return_value=mock_letter)

            response = api_client.post(f"/{job_id}/draft?create_google_doc=true")

            assert response.status_code == status.HTTP_200_OK
            assert response.json()["status"] == "success"
            assert "Dear Hiring Manager" in response.json()["data"]["cover_letter"]
            assert (
                response.json()["data"]["google_doc"]["webViewLink"] == "http://docs.google.com/123"
            )

            # Should have called update_job twice: once for the letter, once for the doc URL
            assert mock_job_store.update_job.call_count == 2

    def test_get_storage_status(self, api_client, mock_job_store):
        """Should return storage status."""
        response = api_client.get("/storage/status")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
        assert response.json()["storage"]["mode"] == "mock_firestore"
