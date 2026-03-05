"""Tests for the AutomationSpecialistAgent."""

from unittest.mock import MagicMock

import pytest

from app.agents.automation_specialist import AutomationSpecialistAgent


@pytest.fixture
def automation_specialist_agent():
    return AutomationSpecialistAgent()


@pytest.mark.asyncio
async def test_automation_specialist_agent_init(automation_specialist_agent):
    assert automation_specialist_agent.agent_id == "test_automation_specialist"
    assert automation_specialist_agent.name == "Test Automation Specialist"
    assert (
        automation_specialist_agent.description
        == "Generates and validates Jest tests, focusing on M3 token compliance"
    )
    assert automation_specialist_agent.dependencies == []
    assert automation_specialist_agent.priority == 3


@pytest.mark.asyncio
async def test_run_task_logs_and_returns_summary(automation_specialist_agent):
    mock_logger = MagicMock()
    automation_specialist_agent.logger = mock_logger

    result = await automation_specialist_agent._run_task({})

    assert result == {"generated": 2, "status": "completed"}
    assert mock_logger.info.call_count == 7
    mock_logger.info.assert_any_call("🔧 Starting automated test generation workflow")
    mock_logger.info.assert_any_call("📊 Analyzing test coverage")
    mock_logger.info.assert_any_call("🚀 Generating tests for 2 components in parallel")


@pytest.mark.asyncio
async def test_run_task_component_specific_logs(automation_specialist_agent):
    mock_logger = MagicMock()
    automation_specialist_agent.logger = mock_logger

    await automation_specialist_agent._run_task({})

    mock_logger.info.assert_any_call(
        "🧪 Generating tests for Button at src/components/ui/Button/Button.tsx"
    )
    mock_logger.info.assert_any_call(
        "🧪 Generating tests for Card at src/components/ui/Card/Card.tsx"
    )
    mock_logger.info.assert_any_call("✅ Running the full Jest test suite")
    mock_logger.info.assert_any_call("📈 Coverage improvement: before 68%, after 82%")
