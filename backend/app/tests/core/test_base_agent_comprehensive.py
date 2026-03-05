"""
Test suite for base_agent.py
"""

import hashlib
import json
from datetime import datetime, timedelta
from unittest.mock import patch

import pytest
from fastapi import HTTPException
from pytest_mock import MockerFixture

from app.core.ai_client import get_ai_client
from app.core.base_agent import BaseAgent, PromptType
from app.core.personal_cache import get_personal_cache
from app.services.ai_prompt_builder import get_ai_prompt_builder


class TestBaseAgent:
    @pytest.fixture
    def base_agent(self):
        return BaseAgent("test_agent")

    def test_init(self, base_agent):
        assert base_agent.agent_name == "test_agent"
        assert base_agent.ai_client is not None
        assert base_agent.cache is not None
        assert base_agent.ai_prompt_builder is not None
        assert base_agent.ai_response_ttl == timedelta(hours=72)
        assert base_agent.user_profile_ttl == timedelta(days=7)
        assert base_agent.company_research_ttl == timedelta(days=7)

    def test_generate_prompt_hash(self, base_agent):
        prompt = "test prompt"
        context = {"key": "value"}
        hash_value = base_agent._generate_prompt_hash(prompt, context)
        assert isinstance(hash_value, str)
        assert len(hash_value) == 16

        prompt_data = {
            "prompt": prompt,
            "context": context,
            "agent": base_agent.agent_name,
        }
        prompt_str = json.dumps(prompt_data, sort_keys=True, default=str)
        expected_hash = hashlib.sha256(prompt_str.encode()).hexdigest()[:16]
        assert hash_value == expected_hash

        hash_value_no_context = base_agent._generate_prompt_hash(prompt)
        assert isinstance(hash_value_no_context, str)
        assert len(hash_value_no_context) == 16

    @pytest.mark.asyncio
    async def test_execute_with_monitoring_cache_hit(self, base_agent, mocker):
        mock_cache = mocker.MagicMock()
        mocker.patch("app.core.base_agent.get_personal_cache", return_value=mock_cache)
        mock_execute_core_logic = mocker.AsyncMock()
        base_agent._execute_core_logic = mock_execute_core_logic

        task_data = {"task_type": "test_task"}
        cache_key = base_agent._generate_task_cache_key(task_data)
        cached_result = {"data": "cached_data"}
        mock_cache.get.return_value = cached_result

        result = await base_agent.execute_with_monitoring(task_data)

        assert result == "cached_data"
        mock_cache.get.assert_called_once_with(cache_key, "ai_responses")
        mock_execute_core_logic.assert_not_called()
        mock_cache.cache_ai_response.assert_not_called()

    @pytest.mark.asyncio
    async def test_execute_with_monitoring_cache_miss(self, base_agent, mocker):
        mock_cache = mocker.MagicMock()
        mocker.patch("app.core.base_agent.get_personal_cache", return_value=mock_cache)
        mock_execute_core_logic = mocker.AsyncMock(return_value={"result": "executed_data"})
        base_agent._execute_core_logic = mock_execute_core_logic

        task_data = {"task_type": "test_task"}
        cache_key = base_agent._generate_task_cache_key(task_data)
        mock_cache.get.return_value = None

        result = await base_agent.execute_with_monitoring(task_data)

        assert result == {"result": "executed_data"}
        mock_cache.get.assert_called_once_with(cache_key, "ai_responses")
        mock_execute_core_logic.assert_called_once_with(task_data)
        mock_cache.cache_ai_response.assert_called_once()

    @pytest.mark.asyncio
    async def test_execute_with_monitoring_error_handling(self, base_agent, mocker):
        mock_cache = mocker.MagicMock()
        mocker.patch("app.core.base_agent.get_personal_cache", return_value=mock_cache)
        mock_execute_core_logic = mocker.AsyncMock(side_effect=Exception("test_error"))
        base_agent._execute_core_logic = mock_execute_core_logic

        task_data = {"task_type": "test_task"}
        result = await base_agent.execute_with_monitoring(task_data)

        assert isinstance(result, dict)
        assert result["status"] == "error"
        assert "message" in result
        assert "test_error" in result["message"]
        mock_cache.get.assert_called_once_with(
            base_agent._generate_task_cache_key(task_data), "ai_responses"
        )
        mock_execute_core_logic.assert_called_once_with(task_data)
        mock_cache.cache_ai_response.assert_not_called()

    def test_generate_task_cache_key(self, base_agent):
        task_data = {
            "task_type": "test_task",
            "user_profile": {"name": "test_user"},
            "job_description": "test_description",
            "document_type": "resume",
            "template_id": "123",
        }
        cache_key = base_agent._generate_task_cache_key(task_data)
        assert isinstance(cache_key, str)

    def test_hash_dict(self, base_agent):
        data = {"a": 1, "b": "test"}
        hashed_data = base_agent._hash_dict(data)
        assert isinstance(hashed_data, str)
