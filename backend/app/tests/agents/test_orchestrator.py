"""
Tests for the orchestrator module.
"""

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from app.agents.orchestrator import (
    AgentPriority,
    AgentStatus,
    BaseAgent,
    JobScoutAgent,
)
from app.core.ai_client import get_ai_client
from app.core.cache_decorators import cached_ai_operation


@pytest.fixture
def test_client():
    """Fixture for a test client."""
    # In a real application, you'd likely have a FastAPI app instance here.
    # For this example, we're testing the orchestrator logic directly,
    # so we don't need a full FastAPI app.
    return TestClient(None)  # Placeholder


class TestBaseAgent:
    """Tests for the BaseAgent class."""

    def test_base_agent_init(self):
        """Test the initialization of the BaseAgent class."""
        agent = BaseAgent(
            agent_id="test_agent",
            name="Test Agent",
            description="A test agent",
            dependencies=["dep1", "dep2"],
        )
        assert agent.agent_id == "test_agent"
        assert agent.name == "Test Agent"
        assert agent.description == "A test agent"
        assert agent.dependencies == ["dep1", "dep2"]
        assert agent.status == AgentStatus.PENDING
        assert agent.priority == AgentPriority.NORMAL
        assert agent.started_at is None
        assert agent.completed_at is None
        assert agent.results is None
        assert agent.error_message is None

    def test_can_run_with_dependencies(self):
        """Test the can_run method with dependencies."""
        agent = BaseAgent(
            agent_id="test_agent",
            name="Test Agent",
            description="A test agent",
            dependencies=["dep1", "dep2"],
        )
        assert not agent.can_run(["dep1"])
        assert agent.can_run(["dep1", "dep2"])
        assert agent.can_run(["dep2", "dep1"])

    def test_can_run_without_dependencies(self):
        """Test the can_run method without dependencies."""
        agent = BaseAgent(
            agent_id="test_agent",
            name="Test Agent",
            description="A test agent",
        )
        assert agent.can_run([])
        assert agent.can_run(["dep1"])

    def test_get_status_info(self):
        """Test the get_status_info method."""
        agent = BaseAgent(
            agent_id="test_agent",
            name="Test Agent",
            description="A test agent",
        )
        agent.status = AgentStatus.RUNNING
        agent.started_at = datetime.utcnow() - timedelta(seconds=10)
        agent.results = {"key": "value"}

        status_info = agent.get_status_info()
        assert status_info["agent_id"] == "test_agent"
        assert status_info["name"] == "Test Agent"
        assert status_info["status"] == "running"
        assert status_info["priority"] == "normal"
        assert status_info["dependencies"] == []
        assert status_info["duration_ms"] > 0
        assert status_info["error"] is None
        assert status_info["has_results"] is True

    @pytest.mark.asyncio
    async def test_execute_success(self):
        """Test the execute method with a successful task."""
        agent = BaseAgent(
            agent_id="test_agent",
            name="Test Agent",
            description="A test agent",
        )

        with patch.object(agent, "_run_task", return_value={"result": "success"}):
            result = await agent.execute({"context_key": "context_value"})
            assert agent.status == AgentStatus.COMPLETED
            assert result == {"result": "success"}

    @pytest.mark.asyncio
    async def test_execute_failure(self):
        """Test the execute method with a failing task."""
        agent = BaseAgent(
            agent_id="test_agent",
            name="Test Agent",
            description="A test agent",
        )

        with patch.object(agent, "_run_task", side_effect=Exception("Test error")):
            with pytest.raises(Exception) as exc_info:
                await agent.execute({"context_key": "context_value"})

            assert agent.status == AgentStatus.FAILED
            assert "Test error" in str(exc_info.value)


class TestJobScoutAgent:
    """Tests for the JobScoutAgent class."""

    @pytest.mark.asyncio
    async def test_job_scout_agent_init(self):
        """Test the initialization of the JobScoutAgent class."""
        agent = JobScoutAgent()
        assert agent.agent_id == "job_scout"
        assert agent.name == "Job Scout"
        assert agent.description == "Discovers and analyzes job opportunities"
        assert agent.priority == AgentPriority.HIGH

    @pytest.mark.asyncio
    @patch("app.agents.orchestrator.JobScoutAgent._discover_jobs")
    @patch("app.agents.orchestrator.JobScoutAgent._analyze_job_relevance")
    async def test_run_task_success(self, mock_analyze, mock_discover):
        """Test the _run_task method with successful job discovery and analysis."""
        mock_discover.return_value = [
            {"title": "Job 1", "description": "Description 1"},
            {"title": "Job 2", "description": "Description 2"},
        ]
        mock_analyze.side_effect = lambda job, context: {"match_score": 0.8}

        agent = JobScoutAgent()
        context = {"search_criteria": {"keyword": "test"}}
        result = await agent._run_task(context)

        assert result["jobs_discovered"] == 2
        assert result["jobs_analyzed"] == 2
        assert len(result["top_matches"]) == 2
        assert len(result["all_jobs"]) == 2
        assert result["search_criteria"] == {"keyword": "test"}

    @pytest.mark.asyncio
    @patch("app.agents.orchestrator.JobScoutAgent._discover_jobs")
    @patch("app.agents.orchestrator.JobScoutAgent._analyze_job_relevance")
    async def test_run_task_empty_jobs(self, mock_analyze, mock_discover):
        """Test the _run_task method with no jobs discovered."""
        mock_discover.return_value = []

        agent = JobScoutAgent()
        context = {"search_criteria": {"keyword": "test"}}
        result = await agent._run_task(context)

        assert result["jobs_discovered"] == 0
        assert result["jobs_analyzed"] == 0
        assert len(result["top_matches"]) == 0
        assert len(result["all_jobs"]) == 0
        assert result["search_criteria"] == {"keyword": "test"}
