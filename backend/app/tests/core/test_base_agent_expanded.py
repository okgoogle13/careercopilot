"""Expanded unit tests for the base agent abstractions."""

import asyncio
import importlib.util
import sys
from contextlib import contextmanager
from datetime import timedelta
from pathlib import Path
from types import ModuleType, SimpleNamespace
from uuid import uuid4

import pytest

MODULE_PATH = Path(__file__).resolve().parents[2] / "core/base_agent.py"


@pytest.fixture(autouse=True, name="mock_genkit_model")
def noop_mock_genkit_model():
    """Override the repo-wide autouse Genkit fixture for isolated tests."""
    return None


@contextmanager
def _patched_modules(modules):
    originals = {name: sys.modules.get(name) for name in modules}
    try:
        for name, module in modules.items():
            sys.modules[name] = module
        yield
    finally:
        for name, original in originals.items():
            if original is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = original


def _load_module():
    """Load the base agent module with stubbed dependencies."""
    app_module = ModuleType("app")
    app_module.__path__ = []
    core_module = ModuleType("app.core")
    core_module.__path__ = []
    services_module = ModuleType("app.services")
    services_module.__path__ = []

    ai_client_module = ModuleType("app.core.ai_client")
    ai_client_module.get_ai_client = lambda: SimpleNamespace(name="ai-client")

    class _Cache:
        def __init__(self):
            self.storage = {}
            self.ai_responses = {}
            self.last_cached = None
            self.last_set = None

        async def get(self, key, namespace):
            return self.storage.get((namespace, key))

        async def cache_ai_response(self, key, data, ttl):
            self.ai_responses[key] = data
            self.last_cached = (key, data, ttl)

        async def get_ai_response(self, key):
            return self.ai_responses.get(key)

        async def set(self, key, value, ttl, namespace):
            self.storage[(namespace, key)] = value
            self.last_set = (key, value, ttl, namespace)

    cache = _Cache()

    personal_cache_module = ModuleType("app.core.personal_cache")
    personal_cache_module.get_personal_cache = lambda: cache

    ai_prompt_builder_module = ModuleType("app.services.ai_prompt_builder")

    class PromptContext:
        def __init__(self, custom_data=None):
            self.custom_data = custom_data

    class PromptType:
        GENERIC = "generic"

    class _Builder:
        def __init__(self):
            self.calls = []
            self.response = "generated"
            self.error = None

        async def generate_ai_response(self, prompt_type, prompt, prompt_context, model=None):
            self.calls.append((prompt_type, prompt, prompt_context, model))
            if self.error:
                raise self.error
            return self.response

    builder = _Builder()

    ai_prompt_builder_module.PromptContext = PromptContext
    ai_prompt_builder_module.PromptType = PromptType
    ai_prompt_builder_module.get_ai_prompt_builder = lambda: builder

    stubs = {
        "app": app_module,
        "app.core": core_module,
        "app.services": services_module,
        "app.core.ai_client": ai_client_module,
        "app.core.personal_cache": personal_cache_module,
        "app.services.ai_prompt_builder": ai_prompt_builder_module,
    }

    with _patched_modules(stubs):
        module_name = f"_base_agent_test_{uuid4().hex}"
        spec = importlib.util.spec_from_file_location(module_name, MODULE_PATH)
        module = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(module)
        module._test_cache = cache
        module._test_builder = builder
        return module


def _make_agent(module, mode="success"):
    """Create a concrete test agent from the abstract base."""

    class TestAgent(module.BaseAgent):
        async def _execute_core_logic(self, task_data):
            if mode == "error":
                raise RuntimeError("core failure")
            return {"result": task_data.get("value", "done")}

    return TestAgent("tester")


def test_base_agent_initialization_and_hash_helpers():
    """Initialization should wire defaults and produce stable hashes."""
    module = _load_module()
    agent = _make_agent(module)

    assert agent.agent_name == "tester"
    assert agent.ai_response_ttl == timedelta(hours=72)
    assert agent.user_profile_ttl == timedelta(days=7)
    assert len(agent._generate_prompt_hash("prompt", {"a": 1})) == 16
    assert len(agent._hash_dict({"a": 1})) == 8
    assert isinstance(agent._generate_task_cache_key({"task_type": "draft"}), str)


def test_execute_with_monitoring_uses_cache_when_available():
    """Suitable cached results should be returned without core execution."""
    module = _load_module()
    agent = _make_agent(module)
    task_data = {"task_type": "draft", "value": "fresh"}
    cache_key = agent._generate_task_cache_key(task_data)
    module._test_cache.storage[("ai_responses", cache_key)] = {"data": {"cached": True}}

    result = asyncio.run(agent.execute_with_monitoring(task_data))

    assert result["success"] is True
    assert result["data"] == {"cached": True}


def test_execute_with_monitoring_runs_core_logic_and_caches_result():
    """Cache misses should execute core logic and persist the result."""
    module = _load_module()
    agent = _make_agent(module)

    result = asyncio.run(agent.execute_with_monitoring({"task_type": "draft", "value": "fresh"}))

    assert result["success"] is True
    assert result["data"] == {"result": "fresh"}
    assert module._test_cache.last_cached is not None


def test_execute_with_monitoring_wraps_core_errors():
    """Core execution failures should return the formatted error response."""
    module = _load_module()
    agent = _make_agent(module, mode="error")

    result = asyncio.run(agent.execute_with_monitoring({"task_type": "draft"}))

    assert result["success"] is False
    assert result["error"] == "core failure"
    assert result["retry_after"] == 300


def test_generate_ai_response_with_cache_hits_existing_cache():
    """Existing cached AI responses should bypass prompt generation."""
    module = _load_module()
    agent = _make_agent(module)
    prompt_hash = agent._generate_prompt_hash("Prompt", {"tone": "warm"})
    module._test_cache.ai_responses[prompt_hash] = {"response": "cached text"}

    result = asyncio.run(
        agent.generate_ai_response_with_cache("Prompt", {"tone": "warm"}, model="m1")
    )

    assert result == "cached text"
    assert module._test_builder.calls == []


def test_generate_ai_response_with_cache_generates_and_persists():
    """New AI prompts should flow through the prompt builder and cache."""
    module = _load_module()
    agent = _make_agent(module)
    module._test_builder.response = "fresh text"

    result = asyncio.run(
        agent.generate_ai_response_with_cache("Prompt", {"tone": "warm"}, model="m2")
    )

    assert result == "fresh text"
    assert module._test_builder.calls[0][0] == module.PromptType.GENERIC
    assert module._test_cache.last_cached is not None


def test_generate_ai_response_with_cache_returns_error_string_on_failure():
    """Prompt-builder failures should not raise to the caller."""
    module = _load_module()
    agent = _make_agent(module)
    module._test_builder.error = RuntimeError("builder down")

    result = asyncio.run(agent.generate_ai_response_with_cache("Prompt"))

    assert "Error generating AI response" in result


def test_generate_structured_response_and_personal_context():
    """Structured responses and context injection should expose expected metadata."""
    module = _load_module()
    agent = _make_agent(module)
    module._test_builder.response = '{"name":"Alex"}'

    structured = asyncio.run(
        agent.generate_structured_ai_response_with_cache(
            "Summarize",
            {"type": "object"},
            {"role": "mentor"},
        )
    )
    prompt = agent.add_personal_context_to_prompt(
        "Write a cover letter",
        {
            "career_transition": {"from": "Finance", "to": "Social Work", "motivation": "Impact"},
            "personal_info": {"name": "Alex", "location": "Sydney"},
        },
    )

    assert structured["structured"] is True
    assert "Alex" in prompt
    assert "Finance" in prompt


def test_personalized_agent_learns_and_uses_success_patterns():
    """PersonalizedAgent should persist success patterns and build enhanced prompts."""
    module = _load_module()

    class _ConcretePersonalizedAgent(module.PersonalizedAgent):
        async def _execute_core_logic(self, task_data):
            return task_data

    agent = _ConcretePersonalizedAgent("personalized")

    asyncio.run(
        agent.learn_from_success(
            "cover_letter",
            {"summary": "Lead with measurable impact"},
            {"name": "Alex"},
        )
    )

    patterns = asyncio.run(agent.get_success_patterns("cover_letter"))
    response = asyncio.run(
        agent.generate_with_success_context(
            "Draft a cover letter",
            "cover_letter",
            {"name": "Alex"},
        )
    )

    assert len(patterns) == 1
    assert "generated" in response
    assert "Successful approach 1" in module._test_builder.calls[-1][1]


def test_personalized_agent_handles_cache_errors_gracefully(monkeypatch):
    """Cache failures should be swallowed for learning and reads."""
    module = _load_module()

    class _ConcretePersonalizedAgent(module.PersonalizedAgent):
        async def _execute_core_logic(self, task_data):
            return task_data

    agent = _ConcretePersonalizedAgent("personalized")

    async def broken_get(*_args, **_kwargs):
        raise RuntimeError("cache down")

    async def broken_set(*_args, **_kwargs):
        raise RuntimeError("cache down")

    monkeypatch.setattr(agent.cache, "get", broken_get)
    monkeypatch.setattr(agent.cache, "set", broken_set)

    asyncio.run(agent.learn_from_success("draft", {"summary": "x"}, {}))
    patterns = asyncio.run(agent.get_success_patterns("draft"))

    assert patterns == []
