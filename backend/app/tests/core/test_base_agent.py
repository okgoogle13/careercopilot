"""Compatibility tests for the current BaseAgent contract."""

import asyncio
import hashlib
import json
from datetime import timedelta

import pytest

from app.core import base_agent as base_agent_module


class _FakeCache:
    """Small async cache stub used by the base-agent tests."""

    def __init__(self):
        self.by_namespace = {}
        self.ai_responses = {}
        self.last_cached = None

    async def get(self, key, namespace):
        return self.by_namespace.get((namespace, key))

    async def cache_ai_response(self, key, data, ttl):
        self.by_namespace[("ai_responses", key)] = data
        self.ai_responses[key] = data
        self.last_cached = (key, data, ttl)

    async def get_ai_response(self, key):
        return self.ai_responses.get(key)


class _FakePromptBuilder:
    """Prompt-builder stub that records calls."""

    def __init__(self):
        self.calls = []
        self.response = "generated"
        self.error = None

    async def generate_ai_response(self, prompt_type, prompt, prompt_context, model=None):
        self.calls.append((prompt_type, prompt, prompt_context, model))
        if self.error:
            raise self.error
        return self.response


@pytest.fixture
def base_agent(monkeypatch):
    """Create a concrete BaseAgent wired to test doubles."""
    cache = _FakeCache()
    prompt_builder = _FakePromptBuilder()
    ai_client = object()

    monkeypatch.setattr(base_agent_module, "get_ai_client", lambda: ai_client)
    monkeypatch.setattr(base_agent_module, "get_personal_cache", lambda: cache)
    monkeypatch.setattr(base_agent_module, "get_ai_prompt_builder", lambda: prompt_builder)

    class TestAgent(base_agent_module.BaseAgent):
        async def _execute_core_logic(self, task_data):
            if task_data.get("raise_error"):
                raise RuntimeError("AI error")
            return {"result": task_data.get("value", "ai_result")}

    agent = TestAgent("test_agent")
    agent._test_cache = cache
    agent._test_prompt_builder = prompt_builder
    agent._test_ai_client = ai_client
    return agent


def test_init(base_agent):
    """Initialization should use the injected collaborators."""
    assert base_agent.agent_name == "test_agent"
    assert base_agent.ai_client is base_agent._test_ai_client
    assert base_agent.cache is base_agent._test_cache
    assert base_agent.ai_prompt_builder is base_agent._test_prompt_builder
    assert base_agent.ai_response_ttl == timedelta(hours=72)
    assert base_agent.user_profile_ttl == timedelta(days=7)
    assert base_agent.company_research_ttl == timedelta(days=7)


def test_generate_prompt_hash(base_agent):
    """Prompt hashes should remain stable for the same serialized payload."""
    prompt = "test prompt"
    context = {"key": "value"}

    hash_value = base_agent._generate_prompt_hash(prompt, context)
    expected_hash = hashlib.sha256(
        json.dumps(
            {"prompt": prompt, "context": context, "agent": base_agent.agent_name},
            sort_keys=True,
            default=str,
        ).encode()
    ).hexdigest()[:16]

    assert hash_value == expected_hash
    assert len(base_agent._generate_prompt_hash(prompt)) == 16


def test_execute_with_monitoring_cache_hit(base_agent):
    """Cache hits should bypass core logic and return the wrapped response."""
    task_data = {"task_type": "test_task", "user_profile": {"name": "test"}}
    cache_key = base_agent._generate_task_cache_key(task_data)
    base_agent._test_cache.by_namespace[("ai_responses", cache_key)] = {"data": {"cached": True}}

    result = asyncio.run(base_agent.execute_with_monitoring(task_data))

    assert result["success"] is True
    assert result["data"] == {"cached": True}


def test_execute_with_monitoring_cache_miss(base_agent):
    """Cache misses should execute core logic and persist the result."""
    result = asyncio.run(
        base_agent.execute_with_monitoring(
            {"task_type": "test_task", "user_profile": {"name": "test"}, "value": "fresh"}
        )
    )

    assert result["success"] is True
    assert result["data"] == {"result": "fresh"}
    assert base_agent._test_cache.last_cached is not None


def test_execute_with_monitoring_error(base_agent):
    """Core failures should be returned through the standard error envelope."""
    result = asyncio.run(
        base_agent.execute_with_monitoring({"task_type": "test_task", "raise_error": True})
    )

    assert result["success"] is False
    assert result["error"] == "AI error"
    assert result["retry_after"] == 300


def test_generate_task_cache_key_and_hash_dict(base_agent):
    """Cache keys should be generated from hashable task metadata."""
    task_data = {
        "task_type": "test_task",
        "user_profile": {"name": "test"},
        "job_description": "test description",
        "document_type": "resume",
        "template_id": "123",
    }

    cache_key = base_agent._generate_task_cache_key(task_data)

    assert isinstance(cache_key, str)
    assert isinstance(base_agent._hash_dict({"name": "test", "age": 30}), str)


def test_generate_ai_response_with_cache(base_agent):
    """Generated AI responses should flow through the prompt builder and cache."""
    result = asyncio.run(
        base_agent.generate_ai_response_with_cache(
            "test prompt",
            {"tone": "warm"},
            model="gemini-2.0-flash",
        )
    )

    assert result == "generated"
    assert base_agent._test_prompt_builder.calls[0][0] == base_agent_module.PromptType.GENERIC
    assert base_agent._test_cache.last_cached is not None
