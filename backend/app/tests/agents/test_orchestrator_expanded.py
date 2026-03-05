"""Expanded tests for Agent Orchestration System covering edge cases and mock logic."""

from datetime import datetime, timedelta
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import HTTPException

from app.agents.orchestrator import (
    AgentOrchestrator,
    AgentStatus,
    ApplicationAgent,
    BaseAgent,
    JobScoutAgent,
    MarketAnalystAgent,
)


@pytest.fixture
def orchestrator():
    return AgentOrchestrator()


@pytest.fixture(autouse=True)
def mock_cache():
    with patch("app.core.cache_decorators.get_ai_cache") as mock_get_cache:
        mock_cache_inst = MagicMock()
        mock_cache_inst.get = AsyncMock(return_value=None)
        mock_cache_inst.set = AsyncMock(return_value=True)
        mock_cache_inst.CACHE_CONFIGS = {"default": {"ttl": 3600}}
        mock_get_cache.return_value = mock_cache_inst
        yield mock_get_cache


class TestBaseAgentExpanded:
    @pytest.mark.asyncio
    async def test_execute_failure(self):
        """Should handle exceptions during _run_task."""
        agent = BaseAgent(agent_id="fail", name="Fail", description="Desc")
        agent._run_task = AsyncMock(side_effect=ValueError("Task failed"))

        with pytest.raises(ValueError, match="Task failed"):
            await agent.execute({})

        assert agent.status == AgentStatus.FAILED
        assert agent.error_message == "Task failed"

    @pytest.mark.asyncio
    async def test_get_status_info_duration(self):
        """Should calculate duration in status info."""
        agent = BaseAgent(agent_id="test", name="Test", description="Desc")
        agent.started_at = datetime.utcnow() - timedelta(seconds=2)
        agent.completed_at = datetime.utcnow()

        info = agent.get_status_info()
        assert info["duration_ms"] >= 2000

        # Test duration while running
        agent.completed_at = None
        info = agent.get_status_info()
        assert info["duration_ms"] >= 2000


class TestJobScoutAgentExpanded:
    @pytest.mark.asyncio
    async def test_discover_jobs_mock_logic(self):
        """Should hit the mock jobs generation logic."""
        agent = JobScoutAgent()
        jobs = await agent._discover_jobs({"location": "Sydney", "role": "Developer"})
        assert len(jobs) == 15
        assert jobs[0]["location"] == "Sydney"
        assert "Developer" in jobs[0]["description"]

    @pytest.mark.asyncio
    async def test_analyze_job_relevance_mock_logic(self):
        """Should hit the mock analysis logic."""
        agent = JobScoutAgent()
        job = {"job_id": "test_job"}
        analysis = await agent._analyze_job_relevance(job, {})
        assert 0.6 <= analysis["match_score"] <= 1.0
        assert len(analysis["key_requirements"]) > 0


class TestMarketAnalystAgentExpanded:
    @pytest.mark.asyncio
    async def test_salary_trends_logic(self):
        """Should calculate salary trends from job data."""
        agent = MarketAnalystAgent()
        job_data = {
            "all_jobs": [
                {"salary_min": 100000, "salary_max": 120000},
                {"salary_min": 80000, "salary_max": 100000},
                {"salary_min": None, "salary_max": None},  # Should be ignored
            ]
        }
        trends = await agent._analyze_salary_trends(job_data, {})
        assert trends["average_salary"] == 100000  # (110 + 90) / 2
        assert trends["min_salary"] == 90000
        assert trends["max_salary"] == 110000

        # No jobs branch
        assert "error" in await agent._analyze_salary_trends({}, {})
        # No salary data branch
        assert "error" in await agent._analyze_salary_trends(
            {"all_jobs": [{"title": "No Salary"}]}, {}
        )

    @pytest.mark.asyncio
    async def test_skill_trends_and_insights(self):
        """Should cover mock skill trends and insights generation."""
        agent = MarketAnalystAgent()
        skills = await agent._analyze_skill_trends({}, {})
        assert len(skills["top_skills"]) > 0

        insights = await agent._generate_market_insights({}, {}, {}, {})
        assert len(insights) > 0

    @pytest.mark.asyncio
    async def test_competition_analysis(self):
        """Should cover mock competition analysis."""
        agent = MarketAnalystAgent()
        comp = await agent._analyze_competition({}, {})
        assert comp["competition_level"] == "medium"


class TestApplicationAgentExpanded:
    @pytest.mark.asyncio
    async def test_generate_materials_logic(self):
        """Should cover the full material generation flow."""
        agent = ApplicationAgent()
        job = {"job_id": "j1", "title": "Dev", "company": "Acme"}
        profile = {"career_from": "Banking", "career_to": "Engineering"}
        market_data = {"market_insights": ["High growth area"]}

        materials = await agent._generate_job_materials(job, profile, market_data)
        assert "Dear Hiring Manager" in materials["cover_letter"]
        assert "High growth area" in materials["cover_letter"]
        assert "Acme" in materials["email_application"]["body"]
        assert "one_week" in materials["follow_up_templates"]


class TestAgentOrchestratorExpanded:
    @pytest.mark.asyncio
    async def test_run_workflow_invalid_type(self, orchestrator):
        """Should raise ValueError for unknown workflow."""
        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            mock_db.return_value.__enter__.return_value = MagicMock()
            with pytest.raises(ValueError, match="Unknown workflow type"):
                await orchestrator.run_workflow("invalid", {})

    @pytest.mark.asyncio
    async def test_run_workflow_db_failure_logging(self, orchestrator):
        """Should log and update session on workflow failure."""
        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            db_inst = MagicMock()
            mock_db.return_value.__enter__.return_value = db_inst

            # Mock workflow internal to fail
            with patch.object(
                orchestrator,
                "_run_daily_discovery_workflow",
                side_effect=RuntimeError("Work error"),
            ):
                with pytest.raises(RuntimeError, match="Work error"):
                    await orchestrator.run_workflow("daily_discovery", {"user_id": "u1"})

            # Verify status update attempt
            db_inst.query.assert_called()

    @pytest.mark.asyncio
    async def test_run_daily_discovery_dependency_skip(self, orchestrator):
        """Should skip agent if dependencies are not met."""
        orchestrator.agents["job_scout"] = MagicMock()
        orchestrator.agents["job_scout"].can_run.return_value = False

        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            mock_db.return_value.__enter__.return_value = MagicMock()
            result = await orchestrator._run_daily_discovery_workflow({"user_id": "u1"})
            assert "job_scout" not in result["results"]

    @pytest.mark.asyncio
    async def test_run_daily_discovery_agent_failure(self, orchestrator):
        """Should capture error message if an agent fails but continue if possible."""
        orchestrator.agents["job_scout"].execute = AsyncMock(side_effect=Exception("Agent failed"))

        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            mock_db.return_value.__enter__.return_value = MagicMock()
            result = await orchestrator._run_daily_discovery_workflow({"user_id": "u1"})
            assert "error" in result["results"]["job_scout"]
            assert result["results"]["job_scout"]["error"] == "Agent failed"

    @pytest.mark.asyncio
    async def test_run_daily_discovery_session_missing(self, orchestrator):
        """Should skip DB updates if session is missing from DB during execution."""
        orchestrator.session_id = "missing"

        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            db_inst = MagicMock()
            mock_db.return_value.__enter__.return_value = db_inst
            db_inst.query.return_value.filter.return_value.first.return_value = None

            result = await orchestrator._run_daily_discovery_workflow({"user_id": "u1"})
            assert result["success"] is True  # Agents still ran
            db_inst.commit.assert_not_called()

    @pytest.mark.asyncio
    async def test_run_daily_discovery_full_success(self, orchestrator):
        """Should run full discovery and update session."""
        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            db_inst = MagicMock()
            mock_db.return_value.__enter__.return_value = db_inst
            mock_session = MagicMock()
            db_inst.query.return_value.filter.return_value.first.return_value = mock_session

            # Mock agents to skip actual logic
            for name in ["job_scout", "market_analyst", "application_agent"]:
                orchestrator.agents[name].execute = AsyncMock(return_value={"done": True})

            result = await orchestrator._run_daily_discovery_workflow({"user_id": "u1"})
            assert result["success"] is True
            assert mock_session.status == "completed"

    @pytest.mark.asyncio
    async def test_run_application_prep_workflow_stub(self, orchestrator):
        """Should hit the application_prep workflow stub."""
        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            mock_db.return_value.__enter__.return_value = MagicMock()
            result = await orchestrator.run_workflow("application_prep", {})
            assert result == {}

    def test_get_session_status_not_found(self, orchestrator):
        """Should return error if session not found."""
        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            mock_db.return_value.__enter__.return_value.query.return_value.filter.return_value.first.return_value = (
                None
            )
            result = orchestrator.get_session_status("nonexistent")
            assert "error" in result
            assert result["error"] == "Session not found"
