"""Tests for Agent Orchestration System."""

from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.agents.orchestrator import (
    AgentOrchestrator,
    AgentPriority,
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

    def test_check_dependencies_met(self):
        agent = BaseAgent(agent_id="b", name="B", description="D")
        agent.dependencies = ["a"]

        # Dependency not in results
        assert agent.can_run([]) is False
        assert agent.can_run(["a"]) is True


class TestSpecializedAgents:
    @pytest.mark.asyncio
    async def test_job_scout_run_task(self):
        """Should call its internal discovery/analysis methods."""
        agent = JobScoutAgent()
        agent._discover_jobs = AsyncMock(return_value=[{"job_id": "j1", "title": "Dev"}])
        agent._analyze_job_relevance = AsyncMock(return_value={"match_score": 0.9})

        result = await agent._run_task({"search_criteria": {"role": "Social Worker"}})
        assert result["jobs_discovered"] == 1
        assert result["all_jobs"][0]["match_score"] == 0.9

    @pytest.mark.asyncio
    async def test_market_analyst_run_task(self):
        """Should call internal market analysis method."""
        agent = MarketAnalystAgent()
        # Mock internal methods to avoid AI calls
        agent._analyze_salary_trends = AsyncMock(return_value={})
        agent._analyze_skill_trends = AsyncMock(return_value={})
        agent._analyze_competition = AsyncMock(return_value={})
        agent._generate_market_insights = AsyncMock(return_value={"trend": "growing"})

        result = await agent._run_task({"user_profile": {}, "target_roles": ["Dev"]})
        assert result["market_insights"]["trend"] == "growing"

    @pytest.mark.asyncio
    async def test_application_agent_run_task(self):
        """Should call internal material generation for provided jobs."""
        agent = ApplicationAgent()
        agent._generate_job_materials = AsyncMock(
            return_value={"cover_letter": "...", "email": "..."}
        )

        context = {
            "target_jobs": [{"job_id": "j1", "title": "Dev", "company": "G"}],
            "user_profile": {},
            "market_analyst_results": {},
        }
        result = await agent._run_task(context)
        assert result["materials_generated"] == 1
        assert "cover_letter" in result["job_applications"][0]["materials"]


class TestAgentOrchestrator:
    @pytest.fixture
    def orchestrator(self):
        return AgentOrchestrator()

    def test_orchestrator_initialization(self, orchestrator):
        assert len(orchestrator.agents) > 0
        assert "job_scout" in orchestrator.agents

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
            orchestrator.agents[name].can_run.return_value = True
            orchestrator.agents[name].execute = AsyncMock(return_value={"status": "completed"})

        with patch("app.agents.orchestrator.get_db_session") as mock_db:
            # Silence DB calls
            mock_db.return_value.__enter__.return_value = MagicMock()

            result = await orchestrator.run_workflow("daily_discovery", {"user_id": "u1"})
            assert result["success"] is True
            assert "job_scout" in result["results"]

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
        mock_session.agent_results = {}
        mock_db.query().filter().first.return_value = mock_session

        with patch("app.agents.orchestrator.get_db_session") as mock_get_db:
            mock_get_db.return_value.__enter__.return_value = mock_db

            status = orchestrator.get_session_status("s1")
            assert status["status"] == "running"
            assert status["session_id"] == "s1"
