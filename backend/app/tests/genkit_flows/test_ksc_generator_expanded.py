"""
Tests for ksc_generator_expanded.
"""

from typing import Dict
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from pydantic import BaseModel

from app.core.genkit_init import get_model
from app.core.observability import monitor_performance
from app.core.prompt_service import format_prompt
from app.genkit_flows.ksc_generator import STAR_Response, generateKscResponse

# Mock user profile data for testing
USER_PROFILE_DATA = {
    "job_title": "Software Engineer",
    "years_of_experience": 5,
    "skills": ["Python", "JavaScript", "SQL"],
}

# Mock KSC statement for testing
KSC_STATEMENT = "Developed a new feature for the company website."


@pytest.fixture
def test_client():
    """Fixture to create a test client."""
    from app.main import app

    client = TestClient(app)
    return client


@pytest.fixture
async def mock_get_model():
    """Mock the get_model function."""
    mock_model = AsyncMock()
    mock_model.generate = AsyncMock()
    mock_model.generate.return_value = {"output": AsyncMock()}
    mock_model.generate.return_value["output"].return_value = STAR_Response(
        situation="Test Situation",
        task="Test Task",
        action="Test Action",
        result="Test Result",
    )
    return AsyncMock(return_value=mock_model)


@pytest.fixture
async def mock_format_prompt():
    """Mock the format_prompt function."""
    return AsyncMock(return_value="Mocked Prompt")


@pytest.fixture
async def mock_monitor_performance():
    """Mock the monitor_performance function."""
    return AsyncMock()


@pytest.mark.asyncio
@patch("app.genkit_flows.ksc_generator.get_model")
@patch("app.genkit_flows.ksc_generator.format_prompt")
@patch("app.genkit_flows.ksc_generator.monitor_performance")
async def test_generate_ksc_response_happy_path(
    mock_monitor_performance, mock_format_prompt, mock_get_model
):
    """
    Test successful generation of a KSC response with valid inputs.
    """
    mock_model = AsyncMock()
    mock_get_model.return_value = mock_model

    # mock_model.generate() returns a mock object that has an output() method
    mock_result = MagicMock()
    mock_result.output = AsyncMock(
        return_value=STAR_Response(
            situation="Test Situation",
            task="Test Task",
            action="Test Action",
            result="Test Result",
        )
    )
    mock_model.generate.return_value = mock_result

    mock_format_prompt.return_value = "Mocked Prompt"

    response = await generateKscResponse(USER_PROFILE_DATA, KSC_STATEMENT)

    assert isinstance(response, STAR_Response)
    assert response.situation == "Test Situation"
    assert response.task == "Test Task"
    assert response.action == "Test Action"
    assert response.result == "Test Result"

    mock_format_prompt.assert_called()
    mock_get_model.assert_called()


@pytest.mark.asyncio
@patch("app.genkit_flows.ksc_generator.get_model")
@patch("app.genkit_flows.ksc_generator.format_prompt")
@patch("app.genkit_flows.ksc_generator.monitor_performance")
async def test_generate_ksc_response_empty_user_profile(
    mock_monitor_performance, mock_format_prompt, mock_get_model
):
    """
    Test KSC response generation with an empty user profile.
    """
    mock_model = AsyncMock()
    mock_get_model.return_value = mock_model
    mock_result = MagicMock()
    mock_result.output = AsyncMock(
        return_value=STAR_Response(situation="Test Situation", task="T", action="A", result="R")
    )
    mock_model.generate.return_value = mock_result
    mock_format_prompt.return_value = "Mocked Prompt"

    response = await generateKscResponse({}, KSC_STATEMENT)

    assert isinstance(response, STAR_Response)


@pytest.mark.asyncio
@patch("app.genkit_flows.ksc_generator.get_model")
@patch("app.genkit_flows.ksc_generator.format_prompt")
@patch("app.genkit_flows.ksc_generator.monitor_performance")
async def test_generate_ksc_response_empty_ksc_statement(
    mock_monitor_performance, mock_format_prompt, mock_get_model
):
    """
    Test KSC response generation with an empty KSC statement.
    """
    mock_model = AsyncMock()
    mock_get_model.return_value = mock_model
    mock_result = MagicMock()
    mock_result.output = AsyncMock(
        return_value=STAR_Response(situation="Test Situation", task="T", action="A", result="R")
    )
    mock_model.generate.return_value = mock_result
    mock_format_prompt.return_value = "Mocked Prompt"

    response = await generateKscResponse(USER_PROFILE_DATA, "")

    assert isinstance(response, STAR_Response)


@pytest.mark.asyncio
@patch("app.genkit_flows.ksc_generator.get_model")
@patch("app.genkit_flows.ksc_generator.format_prompt")
@patch("app.genkit_flows.ksc_generator.monitor_performance")
async def test_generate_ksc_response_genkit_error(
    mock_monitor_performance, mock_format_prompt, mock_get_model
):
    """
    Test KSC response generation when Genkit model fails.
    """
    mock_get_model.side_effect = Exception("Genkit model error")
    mock_format_prompt.return_value = "Mocked Prompt"

    with pytest.raises(Exception) as excinfo:
        await generateKscResponse(USER_PROFILE_DATA, KSC_STATEMENT)

    assert "Genkit model error" in str(excinfo.value)
