"""Tests for Agent Orchestration System."""

from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.agents.orchestrator import (
    AgentOrchestrator,
    AgentStatus,
    ApplicationAgent,
    BaseAgent,
    JobScoutAgent,
    MarketAnalystAgent,
)


@pytest.fixture(autouse=True)
def mock_cache():
    """Silence cache decorators for all agent tests."""
    with patch("app.core.cache_decorators.get_ai_cache") as mock_get_cache:
        mock_cache_inst = MagicMock()
        mock_cache_inst.get = AsyncMock(return_value=None)
        mock_cache_inst.set = AsyncMock(return_value=True)
        mock_cache_inst.CACHE_CONFIGS = {"default": {"ttl": 3600}}
        mock_get_cache.return_value = mock_cache_inst
        yield mock_get_cache


class TestBaseAgent:
    @pytest.mark.asyncio
    async def test_base_agent_execution_flow(self):
        """Should transition through statuses during execution."""
        agent = BaseAgent(agent_id="test", name="Test", description="Test desc")
        agent._run_task = AsyncMock(return_value={"result": "ok"})

        result = await agent.execute({"key": "val"})

        assert agent.status == AgentStatus.COMPLETED
        assert result["result"] == "ok"
        assert agent.started_at is not None
        assert agent.completed_at is not None

        # Test status info
        info = agent.get_status_info()
        assert info["status"] == "completed"
        assert info["agent_id"] == "test"
        assert info["has_results"] is True
        assert info["duration_ms"] is not None
        assert info["error"] is None

    @pytest.mark.asyncio
    async def test_base_agent_execution_error(self):
        """Should transition to FAILED status on exception."""
        agent = BaseAgent(agent_id="test", name="Test", description="Test desc")
        agent._run_task = AsyncMock(side_effect=ValueError("Test Error"))

        with pytest.raises(ValueError):
            await agent.execute({"key": "val"})

        assert agent.status == AgentStatus.FAILED
        assert agent.error_message == "Test Error"

        info = agent.get_status_info()
        assert info["status"] == "failed"
        assert info["error"] == "Test Error"

    @pytest.mark.asyncio
    async def test_base_agent_run_task_not_implemented(self):
        """Base _run_task should raise NotImplementedError."""
        agent = BaseAgent(agent_id="test", name="Test", description="Test desc")
        with pytest.raises(NotImplementedError):
            await agent._run_task({})

    def test_check_dependencies_met(self):
        agent = BaseAgent(agent_id="b", name="B", description="D")
        agent.dependencies = ["a"]

        # Dependency not in results
        assert agent.can_run([]) is False
        assert agent.can_run(["a"]) is True

    def test_get_status_info_no_started_at(self):
        agent = BaseAgent(agent_id="test", name="Test", description="Test desc")
        info = agent.get_status_info()
        assert info["duration_ms"] is None


class TestSpecializedAgents:
    @pytest.mark.asyncio
    async def test_job_scout_run_task(self):
        """Should call its internal discovery/analysis methods."""
        agent = JobScoutAgent()

        result = await agent._run_task({"search_criteria": {"role": "Social Worker"}})
        assert result["jobs_discovered"] == 15
        assert result["jobs_analyzed"] == 15
        assert len(result["top_matches"]) == 10
        assert "all_jobs" in result
        assert "search_criteria" in result

        # Test the mock data and analysis logic
        for job in result["all_jobs"]:
            assert "match_score" in job
            assert "key_requirements" in job
            assert "match_reasons" in job
            assert "concerns" in job
            assert job["salary_min"] < job["salary_max"]

    @pytest.mark.asyncio
    async def test_market_analyst_run_task(self):
        """Should call internal market analysis method."""
        agent = MarketAnalystAgent()

        # Create mock context
        mock_jobs = [
            {"salary_min": 60000, "salary_max": 80000},
            {"salary_min": 70000, "salary_max": 90000},
        ]
        context = {
            "job_scout_results": {"all_jobs": mock_jobs},
            "user_profile": {},
            "target_roles": ["Dev"],
        }

        result = await agent._run_task(context)
        assert "salary_trends" in result
        assert result["salary_trends"]["average_salary"] == 75000
        assert result["salary_trends"]["min_salary"] == 70000
        assert result["salary_trends"]["max_salary"] == 80000
        assert "skill_trends" in result
        assert "competition_level" in result
        assert "market_insights" in result
        assert "analysis_date" in result

    @pytest.mark.asyncio
    async def test_market_analyst_no_jobs(self):
        agent = MarketAnalystAgent()
        context = {"job_scout_results": {}}

        result = await agent._run_task(context)
        assert "error" in result["salary_trends"]

        context = {"job_scout_results": {"all_jobs": [{"title": "no salary"}]}}
        result = await agent._run_task(context)
        assert "error" in result["salary_trends"]

    @pytest.mark.asyncio
    async def test_application_agent_run_task(self):
        """Should call internal material generation for provided jobs."""
        agent = ApplicationAgent()

        context = {
            "target_jobs": [{"job_id": "j1", "title": "Dev", "company": "G"}],
            "user_profile": {"career_from": "Finance", "career_to": "Engineering"},
            "market_analyst_results": {"market_insights": ["Hot market"]},
        }
        result = await agent._run_task(context)
        assert result["materials_generated"] == 1
        assert "cover_letter" in result["job_applications"][0]["materials"]
        assert "email_application" in result["job_applications"][0]["materials"]
        assert "follow_up_templates" in result["job_applications"][0]["materials"]

        materials = result["job_applications"][0]["materials"]
        assert "Dev" in materials["cover_letter"]
        assert "Hot market" in materials["cover_letter"]
        assert "Dev" in materials["email_application"]["subject"]
        assert "one_week" in materials["follow_up_templates"]

    @pytest.mark.asyncio
    async def test_application_agent_empty_insights(self):
        agent = ApplicationAgent()
        context = {
            "target_jobs": [{"job_id": "j1", "title": "Dev", "company": "G"}],
            "user_profile": {},
            "market_analyst_results": {},
        }
        result = await agent._run_task(context)
        materials = result["job_applications"][0]["materials"]
        assert "Market analysis pending" in materials["cover_letter"]


class TestAgentOrchestrator:
    @pytest.fixture
    def orchestrator(self):
        return AgentOrchestrator()

    def test_orchestrator_initialization(self, orchestrator):
        assert len(orchestrator.agents) > 0
        assert "job_scout" in orchestrator.agents
        assert "market_analyst" in orchestrator.agents
        assert "application_agent" in orchestrator.agents

    @pytest.mark.asyncio
    async def test_run_workflow_daily_discovery(self, orchestrator):
        """Should execute agents in order for daily_discovery."""
        orchestrator.agents = {
            "job_scout": MagicMock(spec=JobScoutAgent),
            "market_analyst": MagicMock(spec=MarketAnalystAgent),
            "application_agent": MagicMock(spec=ApplicationAgent),
        }

        for name in orchestrator.agents:
            orchestrator.agents[name].agent_id = name
            # Mock can_run to follow order
            orchestrator.agents[name].can_run.side_effect = lambda deps: (
                True if not deps else True
            )  # simplified
            orchestrator.agents[name].execute = AsyncMock(return_value={"status": "completed"})

        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            # Silence DB calls
            mock_session = MagicMock()
            mock_db.return_value.__enter__.return_value = mock_session
            mock_session.query.return_value.filter.return_value.first.return_value = MagicMock()

            result = await orchestrator.run_workflow("daily_discovery", {"user_id": "u1"})
            assert result["success"] is True
            assert "job_scout" in result["results"]
            assert "market_analyst" in result["results"]
            assert "application_agent" in result["results"]

    @pytest.mark.asyncio
    async def test_run_workflow_daily_discovery_agent_skip_and_fail(self, orchestrator):
        orchestrator.agents = {
            "job_scout": MagicMock(spec=JobScoutAgent),
            "market_analyst": MagicMock(spec=MarketAnalystAgent),
            "application_agent": MagicMock(spec=ApplicationAgent),
        }
        orchestrator.agents["application_agent"].can_run.return_value = False

        # job_scout can't run
        orchestrator.agents["job_scout"].can_run.return_value = False

        # market_analyst fails
        orchestrator.agents["market_analyst"].can_run.return_value = True
        orchestrator.agents["market_analyst"].execute = AsyncMock(
            side_effect=ValueError("Test Error")
        )

        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            mock_session = MagicMock()
            mock_db.return_value.__enter__.return_value = mock_session
            mock_session.query.return_value.filter.return_value.first.return_value = MagicMock()

            # Execute but suppress logs for cleaner test output
            result = await orchestrator._run_daily_discovery_workflow({"user_id": "u1"})

            assert result["success"] is False
            assert "job_scout" not in result["results"]
            assert "error" in result["results"]["market_analyst"]

    @pytest.mark.asyncio
    async def test_run_workflow_application_prep(self, orchestrator):
        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            mock_session = MagicMock()
            mock_db.return_value.__enter__.return_value = mock_session

            result = await orchestrator.run_workflow("application_prep", {"user_id": "u1"})
            assert result == {}

    @pytest.mark.asyncio
    async def test_run_workflow_unknown(self, orchestrator):
        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            mock_session = MagicMock()
            mock_db.return_value.__enter__.return_value = mock_session
            db_query_mock = MagicMock()
            mock_session.query.return_value.filter.return_value.first.return_value = db_query_mock

            with pytest.raises(ValueError, match="Unknown workflow type"):
                await orchestrator.run_workflow("unknown", {"user_id": "u1"})

            assert db_query_mock.status == "failed"

    def test_get_session_status_db(self, orchestrator):
        """Should retrieve status from database if available."""
        mock_db = MagicMock()
        mock_session = MagicMock()
        mock_session.id = "s1"
        mock_session.status = "running"
        mock_session.session_type = "daily_discovery"
        mock_session.started_at = datetime.utcnow()
        mock_session.completed_at = None
        mock_session.active_agents = []
        mock_session.completed_agents = []
        mock_session.agent_results = {"job_scout": {"status": "ok"}, "market_analyst": {}}
        mock_db.query().filter().first.return_value = mock_session

        with patch("app.agents.orchestrator.get_db_session") as mock_get_db:
            mock_get_db.return_value.__enter__.return_value = mock_db

            status = orchestrator.get_session_status("s1")
            assert status["status"] == "running"
            assert status["session_id"] == "s1"
            assert status["results_summary"] == {"job_scout": True, "market_analyst": False}

    def test_get_session_status_not_found(self, orchestrator):
        mock_db = MagicMock()
        mock_db.query().filter().first.return_value = None

        with patch("app.agents.orchestrator.get_db_session") as mock_get_db:
            mock_get_db.return_value.__enter__.return_value = mock_db

            status = orchestrator.get_session_status("s1")
            assert status == {"error": "Session not found"}
