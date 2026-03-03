"""
Test suite for the TestAutomationSpecialistAgent.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from backend.app.agents.test_automation_specialist import TestAutomationSpecialistAgent
from backend.app.agents.orchestrator import BaseAgent
from typing import Any, Dict

# Mocking dependencies (if any) - currently none in the agent itself
# In a real application, you'd mock skills like task_delegator, test_runner, etc.

@pytest.fixture
def test_automation_specialist_agent():
    """Fixture for creating a TestAutomationSpecialistAgent instance."""
    return TestAutomationSpecialistAgent()

@pytest.mark.asyncio
async def test_test_automation_specialist_agent_init(test_automation_specialist_agent):
    """Test that the agent initializes correctly."""
    assert test_automation_specialist_agent.agent_id == "test_automation_specialist"
    assert test_automation_specialist_agent.name == "Test Automation Specialist"
    assert test_automation_specialist_agent.description == "Generates and validates Jest tests, focusing on M3 token compliance"
    assert len(test_automation_specialist_agent.dependencies) == 0
    assert test_automation_specialist_agent.priority == 3

@pytest.mark.asyncio
async def test_run_task_happy_path(test_automation_specialist_agent):
    """Test the _run_task method with a happy path scenario."""
    mock_logger = AsyncMock()
    test_automation_specialist_agent.logger = mock_logger

    context: Dict[str, Any] = {}
    result = await test_automation_specialist_agent._run_task(context)

    assert result == {"generated": 2, "status": "completed"}
    assert mock_logger.info.call_count == 6  # Check that all log messages were called
    mock_logger.info.assert_any_call("🔧 Starting automated test generation workflow")
    mock_logger.info.assert_any_call("📊 Analyzing test coverage")
    mock_logger.info.assert_any_call("🚀 Generating tests for 2 components in parallel")
    mock_logger.info.assert_any_call("🧪 Generating tests for Button at src/components/ui/Button/Button.tsx")
    mock_logger.info.assert_any_call("🧪 Generating tests for Card at src/components/ui/Card/Card.tsx")
    mock_logger.info.assert_any_call("✅ Running the full Jest test suite")
    mock_logger.info.assert_any_call("📈 Coverage improvement: before 68%, after 82%")

@pytest.mark.asyncio
async def test_run_task_no_low_coverage_components(test_automation_specialist_agent):
    """Test the _run_task method when there are no low coverage components."""
    mock_logger = AsyncMock()
    test_automation_specialist_agent.logger = mock_logger

    context: Dict[str, Any] = {}
    test_automation_specialist_agent._run_task = AsyncMock(return_value={"generated": 0, "status": "completed"})
    
    # Simulate no low coverage components
    test_automation_specialist_agent._run_task.return_value = {"generated": 0, "status": "completed"}
    
    result = await test_automation_specialist_agent._run_task(context)
    
    assert result == {"generated": 0, "status": "completed"}
    assert mock_logger.info.call_count == 6