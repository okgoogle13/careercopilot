"""
Tests for the job ingestion API endpoints.
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime

from app.main import app
from app.api.ingest import job_queue

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_job_queue():
    """Clear the job queue before and after each test."""
    job_queue.clear()
    yield
    job_queue.clear()


class TestJobClipEndpoint:
    """Tests for POST /api/ingest/clip endpoint."""

    def test_clip_job_success(self):
        """Test successfully clipping a job from browser extension."""
        payload = {
            "url": "https://www.seek.com.au/job/12345",
            "notes": "Great company culture",
            "source": "browser_extension"
        }
        
        response = client.post("/api/ingest/clip", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "accepted"
        assert data["message"] == "Job sent to CareerCopilot."

    def test_clip_job_without_notes(self):
        """Test clipping a job without optional notes."""
        payload = {
            "url": "https://www.ethicaljobs.com.au/job/98765"
        }
        
        response = client.post("/api/ingest/clip", json=payload)
        
        assert response.status_code == 200
        assert response.json()["status"] == "accepted"

    def test_clip_job_missing_url(self):
        """Test that missing URL returns validation error."""
        payload = {
            "notes": "Missing URL field"
        }
        
        response = client.post("/api/ingest/clip", json=payload)
        
        assert response.status_code == 422  # Validation error

    def test_clip_job_adds_to_queue(self):
        """Test that clipping a job adds it to the queue."""
        payload = {
            "url": "https://www.jora.com/job/67890",
            "notes": "Test job"
        }
        
        # Queue should be empty initially
        assert len(job_queue) == 0
        
        response = client.post("/api/ingest/clip", json=payload)
        assert response.status_code == 200
        
        # Give background task time to execute
        import time
        time.sleep(0.5)
        
        # Queue should now have 1 job
        assert len(job_queue) == 1


class TestJobQueueEndpoint:
    """Tests for GET /api/ingest/queue endpoint."""

    def test_get_empty_queue(self):
        """Test retrieving an empty job queue."""
        response = client.get("/api/ingest/queue")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0

    def test_get_queue_with_jobs(self):
        """Test retrieving queue with clipped jobs."""
        # Add jobs to queue via clip endpoint
        jobs_to_add = [
            {"url": "https://seek.com.au/job/1", "notes": "Job 1"},
            {"url": "https://ethicaljobs.com.au/job/2", "notes": "Job 2"},
        ]
        
        for job in jobs_to_add:
            client.post("/api/ingest/clip", json=job)
        
        # Give background tasks time
        import time
        time.sleep(0.5)
        
        response = client.get("/api/ingest/queue")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 2

    def test_queue_job_structure(self):
        """Test that queued jobs have correct structure."""
        payload = {
            "url": "https://www.seek.com.au/job/test",
            "notes": "Structural test"
        }
        
        client.post("/api/ingest/clip", json=payload)
        
        import time
        time.sleep(0.5)
        
        response = client.get("/api/ingest/queue")
        jobs = response.json()
        
        assert len(jobs) == 1
        job = jobs[0]
        
        # Verify required fields
        assert "id" in job
        assert "title" in job
        assert "company" in job
        assert "url" in job
        assert "status" in job
        assert "date_clipped" in job
        assert "notes" in job
        
        # Verify values
        assert job["url"] == payload["url"]
        assert job["notes"] == payload["notes"]
        assert job["status"] == "pending_analysis"
        assert job["title"] == "Pending Analysis"
        assert job["company"] == "Unknown"

    def test_queue_returns_valid_json_schema(self):
        """Test that queue response matches JobQueueItem schema."""
        payload = {"url": "https://test.com/job"}
        client.post("/api/ingest/clip", json=payload)
        
        import time
        time.sleep(0.5)
        
        response = client.get("/api/ingest/queue")
        jobs = response.json()
        
        # Validate against schema (basic checks)
        for job in jobs:
            assert isinstance(job["id"], str)
            assert isinstance(job["title"], str)
            assert isinstance(job["company"], str)
            assert isinstance(job["url"], str)
            assert job["status"] in ["pending_analysis", "ready_to_apply", "applied"]
            # date_clipped should be ISO format
            datetime.fromisoformat(job["date_clipped"])


class TestInMemoryStorage:
    """Tests for in-memory job queue storage behavior."""

    def test_job_id_increments(self):
        """Test that job IDs increment sequentially."""
        for i in range(3):
            client.post("/api/ingest/clip", json={"url": f"https://test.com/job/{i}"})
        
        import time
        time.sleep(0.5)
        
        response = client.get("/api/ingest/queue")
        jobs = response.json()
        
        assert jobs[0]["id"] == "1"
        assert jobs[1]["id"] == "2"
        assert jobs[2]["id"] == "3"

    def test_timestamp_format(self):
        """Test that timestamps are in correct ISO format."""
        client.post("/api/ingest/clip", json={"url": "https://test.com/job"})
        
        import time
        time.sleep(0.5)
        
        response = client.get("/api/ingest/queue")
        jobs = response.json()
        
        timestamp = jobs[0]["date_clipped"]
        # Should parse without error
        parsed = datetime.fromisoformat(timestamp)
        assert isinstance(parsed, datetime)
