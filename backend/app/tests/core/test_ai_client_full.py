"""Focused unit tests for the AI client manager and providers."""

import asyncio
import importlib.util
import sys
from contextlib import contextmanager
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from types import ModuleType, SimpleNamespace
from uuid import uuid4

import pytest

MODULE_PATH = Path(__file__).resolve().parents[2] / "core/ai_client.py"


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
    """Load the AI client module with stubbed config and monitoring."""
    app_module = ModuleType("app")
    app_module.__path__ = []
    core_module = ModuleType("app.core")
    core_module.__path__ = []

    ai_config_module = ModuleType("app.core.ai_config")

    class AIProvider(Enum):
        GOOGLE_AI = "googleai"
        ANTHROPIC = "anthropic"

    class AIModelType(Enum):
        TEXT_EMBEDDING = "embedding"

    @dataclass
    class ModelConfig:
        name: str
        model_id: str
        provider: AIProvider
        max_tokens: int = 128
        temperature: float = 0.5
        top_p: float = 0.9
        timeout_seconds: float = 5.0
        cost_per_1k_tokens: dict[str, float] = field(
            default_factory=lambda: {"input": 0.001, "output": 0.002}
        )

    class AIConfigManager:
        def __init__(self):
            self.models = {}
            self.services = {}

        def get_provider_credentials(self, provider):
            return None

        def get_service_config(self, service_name):
            return self.services.get(service_name)

        def get_model_config(self, model_name):
            return self.models.get(model_name)

        def get_models_by_type(self, _model_type):
            return []

    ai_config_module.AIConfigManager = AIConfigManager
    ai_config_module.AIModelType = AIModelType
    ai_config_module.AIProvider = AIProvider
    ai_config_module.ModelConfig = ModelConfig
    ai_config_module._global_config = AIConfigManager()
    ai_config_module.get_ai_config = lambda: ai_config_module._global_config

    monitoring_module = ModuleType("app.core.observability")
    monitoring_calls = {"usage": [], "errors": []}

    def monitor_performance(_name):
        def decorator(func):
            return func

        return decorator

    def track_ai_usage(*args, **kwargs):
        monitoring_calls["usage"].append(kwargs if kwargs else {"args": args})

    def track_error(*args, **kwargs):
        if kwargs:
            monitoring_calls["errors"].append(kwargs)
        else:
            monitoring_calls["errors"].append(
                {
                    "error_type": args[0],
                    "component": args[1],
                    "error_message": args[2],
                    "user_id": args[3] if len(args) > 3 else None,
                }
            )

    monitoring_module.monitor_performance = monitor_performance
    monitoring_module.track_ai_usage = track_ai_usage
    monitoring_module.track_error = track_error
    monitoring_module._calls = monitoring_calls

    stubs = {
        "app": app_module,
        "app.core": core_module,
        "app.core.ai_config": ai_config_module,
        "app.core.observability": monitoring_module,
    }

    with _patched_modules(stubs):
        module_name = f"app.core._ai_client_test_{uuid4().hex}"
        spec = importlib.util.spec_from_file_location(module_name, MODULE_PATH)
        module = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(module)
        module._test_monitoring_calls = monitoring_calls
        return module


class _FakeResponse:
    """Minimal HTTP response used by provider tests."""

    def __init__(self, data, status_code=200, raise_error=None):
        self._data = data
        self.status_code = status_code
        self._raise_error = raise_error

    def raise_for_status(self):
        if self._raise_error:
            raise self._raise_error

    def json(self):
        return self._data


class _AsyncClient:
    """Async context manager used to stub httpx.AsyncClient."""

    def __init__(self, post_response=None, get_response=None, post_exception=None):
        self.post_response = post_response
        self.get_response = get_response
        self.post_exception = post_exception
        self.posts = []
        self.gets = []

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        return False

    async def post(self, url, **kwargs):
        self.posts.append((url, kwargs))
        if self.post_exception:
            raise self.post_exception
        return self.post_response

    async def get(self, url, **kwargs):
        self.gets.append((url, kwargs))
        return self.get_response


def _install_httpx(async_client):
    httpx_module = ModuleType("httpx")
    httpx_module.AsyncClient = lambda timeout=None: async_client
    return httpx_module


def test_provider_client_requires_credentials():
    """Provider clients should reject missing credentials."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        pass

    with pytest.raises(ValueError, match="No credentials configured"):
        module.GoogleAIClient(_Config())


def test_google_ai_client_generate_text_and_health_check():
    """Google provider should parse API responses and report health."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    client = module.GoogleAIClient(_Config())
    model = module.ModelConfig(
        name="gemini",
        model_id="gemini-1",
        provider=module.AIProvider.GOOGLE_AI,
    )
    request = module.AIRequest(prompt="Hello world", service_name="draft", user_id="user-1")

    httpx_stub = _install_httpx(
        _AsyncClient(
            post_response=_FakeResponse(
                {
                    "candidates": [
                        {
                            "content": {"parts": [{"text": "Generated text"}]},
                            "finishReason": "STOP",
                            "safetyRatings": [],
                        }
                    ]
                }
            ),
            get_response=_FakeResponse({}, status_code=200),
        )
    )

    with _patched_modules({"httpx": httpx_stub}):
        response = asyncio.run(client.generate_text(request, model))
        health = asyncio.run(client.health_check())

    assert response.content == "Generated text"
    assert response.provider == "googleai"
    assert response.model_used == "gemini"
    assert response.cost_estimate > 0
    assert health is True


def test_google_ai_client_system_prompt_and_other_guard_branches():
    """Google client should include system prompts and cover guard/error branches."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    client = module.GoogleAIClient(_Config())
    model = module.ModelConfig(
        name="gemini",
        model_id="gemini-1",
        provider=module.AIProvider.GOOGLE_AI,
    )
    request = module.AIRequest(
        prompt="Hello world",
        service_name="draft",
        user_id="user-1",
        system_prompt="You are helpful.",
    )

    async_client = _AsyncClient(
        post_response=_FakeResponse(
            {
                "candidates": [
                    {
                        "content": {"parts": [{"text": "Generated text"}]},
                        "finishReason": "STOP",
                        "safetyRatings": [],
                    }
                ]
            }
        ),
        get_response=_FakeResponse({}, status_code=200),
    )

    with _patched_modules({"httpx": _install_httpx(async_client)}):
        asyncio.run(client.generate_text(request, model))

    assert async_client.posts[0][1]["json"]["systemInstruction"] == {
        "parts": [{"text": "You are helpful."}]
    }

    with pytest.raises(NotImplementedError):
        asyncio.run(client.generate_embeddings(["text"], model))

    client.credentials = None
    with _patched_modules({"httpx": _install_httpx(async_client)}):
        assert asyncio.run(client.health_check()) is False

    class _BrokenGetClient(_AsyncClient):
        async def get(self, url, **kwargs):
            raise RuntimeError("health down")

    client.credentials = SimpleNamespace(api_key="key")
    with _patched_modules({"httpx": _install_httpx(_BrokenGetClient())}):
        assert asyncio.run(client.health_check()) is False


def test_google_ai_client_tracks_errors():
    """Google provider failures should be logged and re-raised."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    client = module.GoogleAIClient(_Config())
    model = module.ModelConfig(
        name="gemini",
        model_id="gemini-1",
        provider=module.AIProvider.GOOGLE_AI,
    )
    request = module.AIRequest(prompt="Hello", service_name="draft", user_id="user-1")
    httpx_stub = _install_httpx(_AsyncClient(post_exception=RuntimeError("api down")))

    with _patched_modules({"httpx": httpx_stub}), pytest.raises(RuntimeError, match="api down"):
        asyncio.run(client.generate_text(request, model))

    assert module._test_monitoring_calls["errors"][0]["error_type"] == "google_ai_api_error"


def test_anthropic_client_generate_text_and_embeddings_behavior():
    """Anthropic provider should parse responses and reject embeddings."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    client = module.AnthropicClient(_Config())
    model = module.ModelConfig(
        name="claude",
        model_id="claude-3",
        provider=module.AIProvider.ANTHROPIC,
    )
    request = module.AIRequest(prompt="Hello", service_name="draft", user_id="user-1")

    httpx_stub = _install_httpx(
        _AsyncClient(
            post_response=_FakeResponse(
                {
                    "content": [{"text": "Claude reply"}],
                    "usage": {"input_tokens": 10, "output_tokens": 5},
                    "stop_reason": "end_turn",
                    "stop_sequence": None,
                }
            ),
            get_response=_FakeResponse({}, status_code=500),
        )
    )

    with _patched_modules({"httpx": httpx_stub}):
        response = asyncio.run(client.generate_text(request, model))
        health = asyncio.run(client.health_check())

    assert response.content == "Claude reply"
    assert response.provider == "anthropic"
    assert health is True
    with pytest.raises(NotImplementedError):
        asyncio.run(client.generate_embeddings(["x"], model))


def test_anthropic_client_system_prompt_and_error_paths():
    """Anthropic client should include system prompts and track failures."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    client = module.AnthropicClient(_Config())
    model = module.ModelConfig(
        name="claude",
        model_id="claude-3",
        provider=module.AIProvider.ANTHROPIC,
    )
    request = module.AIRequest(
        prompt="Hello",
        service_name="draft",
        user_id="user-1",
        system_prompt="system rules",
    )

    async_client = _AsyncClient(
        post_response=_FakeResponse(
            {
                "content": [{"text": "Claude reply"}],
                "usage": {"input_tokens": 10, "output_tokens": 5},
                "stop_reason": "end_turn",
                "stop_sequence": None,
            }
        )
    )

    with _patched_modules({"httpx": _install_httpx(async_client)}):
        asyncio.run(client.generate_text(request, model))

    assert async_client.posts[0][1]["json"]["system"] == "system rules"

    with (
        _patched_modules(
            {"httpx": _install_httpx(_AsyncClient(post_exception=RuntimeError("anthropic down")))}
        ),
        pytest.raises(RuntimeError, match="anthropic down"),
    ):
        asyncio.run(client.generate_text(request, model))

    assert module._test_monitoring_calls["errors"][-1]["error_type"] == "anthropic_api_error"

    class _BrokenPostClient(_AsyncClient):
        async def post(self, url, **kwargs):
            raise RuntimeError("health down")

    with _patched_modules({"httpx": _install_httpx(_BrokenPostClient())}):
        assert asyncio.run(client.health_check()) is False


def test_ai_client_manager_uses_genkit_when_enabled():
    """Genkit-enabled environments should short-circuit provider routing."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

        def get_service_config(self, service_name):
            return None

    manager = module.AIClientManager(_Config())

    genkit_module = ModuleType("app.core.genkit_init")
    genkit_module.is_genkit_enabled = lambda: True

    class _Model:
        async def generate(self, prompt):
            return SimpleNamespace(text=f"genkit:{prompt}")

    genkit_module.get_model = lambda: _Model()

    with _patched_modules({"app.core.genkit_init": genkit_module}):
        response = asyncio.run(
            manager.generate_text(
                module.AIRequest(
                    prompt="Hello",
                    service_name="draft",
                    user_id="user-1",
                    system_prompt="System",
                )
            )
        )

    assert response.content == "genkit:System\n\nHello"
    assert response.metadata["genkit"] is True


def test_ai_client_manager_validates_service_and_model_config():
    """Missing services or models should raise explicit errors."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    manager = module.AIClientManager(_Config())
    disabled_genkit = ModuleType("app.core.genkit_init")
    disabled_genkit.is_genkit_enabled = lambda: False
    disabled_genkit.get_model = lambda: None

    with (
        _patched_modules({"app.core.genkit_init": disabled_genkit}),
        pytest.raises(ValueError, match="Service 'draft' is not available"),
    ):
        asyncio.run(
            manager.generate_text(
                module.AIRequest(prompt="Hello", service_name="draft", user_id="user-1")
            )
        )

    service = SimpleNamespace(
        enabled=True,
        primary_model="missing",
        fallback_models=[],
        cache_enabled=True,
        cost_budget_daily=1.0,
        rate_limit_per_user=3,
    )
    manager.config_manager.services["draft"] = service

    with (
        _patched_modules({"app.core.genkit_init": disabled_genkit}),
        pytest.raises(ValueError, match="Model 'missing' not found"),
    ):
        asyncio.run(
            manager.generate_text(
                module.AIRequest(prompt="Hello", service_name="draft", user_id="user-1")
            )
        )


def test_ai_client_manager_requires_at_least_one_provider():
    """Manager initialization should fail when no providers are configured."""
    module = _load_module()

    with pytest.raises(ValueError, match="No AI provider credentials found"):
        module.AIClientManager(module.AIConfigManager())


def test_ai_client_manager_falls_back_between_models_and_tracks_usage():
    """Provider failures should fall back to the next configured model."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    primary = module.ModelConfig("primary", "p1", module.AIProvider.GOOGLE_AI)
    fallback = module.ModelConfig("fallback", "f1", module.AIProvider.ANTHROPIC)
    config = _Config()
    config.models = {"primary": primary, "fallback": fallback}
    config.services = {
        "draft": SimpleNamespace(
            enabled=True,
            primary_model="primary",
            fallback_models=["fallback"],
            cache_enabled=True,
            cost_budget_daily=1.0,
            rate_limit_per_user=3,
        )
    }
    manager = module.AIClientManager(config)
    disabled_genkit = ModuleType("app.core.genkit_init")
    disabled_genkit.is_genkit_enabled = lambda: False
    disabled_genkit.get_model = lambda: None

    class _FailingClient:
        async def generate_text(self, request, model_config):
            raise RuntimeError("primary failed")

        async def generate_embeddings(self, texts, model_config):
            return []

        async def health_check(self):
            return False

    class _WorkingClient:
        async def generate_text(self, request, model_config):
            return module.AIResponse(
                content="fallback response",
                model_used=model_config.name,
                provider=model_config.provider.value,
                tokens_used={"input": 2, "output": 3},
                response_time_ms=5.0,
                cached=False,
                cost_estimate=0.1,
                metadata={},
                request_id="req-1",
            )

        async def generate_embeddings(self, texts, model_config):
            return [[0.1] for _ in texts]

        async def health_check(self):
            return True

    manager.clients = {
        module.AIProvider.GOOGLE_AI: _FailingClient(),
        module.AIProvider.ANTHROPIC: _WorkingClient(),
    }

    with _patched_modules({"app.core.genkit_init": disabled_genkit}):
        response = asyncio.run(
            manager.generate_text(
                module.AIRequest(prompt="Hello", service_name="draft", user_id="user-1")
            )
        )

    assert response.content == "fallback response"
    assert module._test_monitoring_calls["usage"][0]["operation_type"] == "draft"


def test_ai_client_manager_raises_when_all_models_fail():
    """If every provider attempt fails, the manager should raise a summary error."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    primary = module.ModelConfig("primary", "p1", module.AIProvider.GOOGLE_AI)
    config = _Config()
    config.models = {"primary": primary}
    config.services = {
        "draft": SimpleNamespace(
            enabled=True,
            primary_model="primary",
            fallback_models=[],
            cache_enabled=True,
            cost_budget_daily=1.0,
            rate_limit_per_user=3,
        )
    }
    manager = module.AIClientManager(config)
    disabled_genkit = ModuleType("app.core.genkit_init")
    disabled_genkit.is_genkit_enabled = lambda: False
    disabled_genkit.get_model = lambda: None

    class _FailingClient:
        async def generate_text(self, request, model_config):
            raise RuntimeError("still broken")

        async def generate_embeddings(self, texts, model_config):
            return []

        async def health_check(self):
            return False

    manager.clients = {module.AIProvider.GOOGLE_AI: _FailingClient()}

    with (
        _patched_modules({"app.core.genkit_init": disabled_genkit}),
        pytest.raises(Exception, match="All models failed for service draft"),
    ):
        asyncio.run(
            manager.generate_text(
                module.AIRequest(prompt="Hello", service_name="draft", user_id="user-1")
            )
        )

    assert module._test_monitoring_calls["errors"][-1]["error_type"] == "all_models_failed"


def test_ai_client_manager_covers_genkit_fallback_and_missing_clients():
    """Genkit failures should fall back, and skipped models/clients should be handled."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    config = _Config()
    config.models = {
        "primary": module.ModelConfig("primary", "p1", module.AIProvider.GOOGLE_AI),
        "no_client": module.ModelConfig("no_client", "n1", module.AIProvider.ANTHROPIC),
    }
    config.services = {
        "draft": SimpleNamespace(
            enabled=True,
            primary_model="primary",
            fallback_models=["missing_model", "no_client"],
            cache_enabled=True,
            cost_budget_daily=1.0,
            rate_limit_per_user=3,
        )
    }
    manager = module.AIClientManager(config)

    class _FailingGenkitModel:
        async def generate(self, prompt):
            raise RuntimeError("genkit broke")

    genkit_module = ModuleType("app.core.genkit_init")
    genkit_module.is_genkit_enabled = lambda: True
    genkit_module.get_model = lambda: _FailingGenkitModel()

    class _FailingClient:
        async def generate_text(self, request, model_config):
            raise RuntimeError("primary failed")

        async def generate_embeddings(self, texts, model_config):
            return []

        async def health_check(self):
            return True

    manager.clients = {module.AIProvider.GOOGLE_AI: _FailingClient()}

    with (
        _patched_modules({"app.core.genkit_init": genkit_module}),
        pytest.raises(Exception, match="All models failed for service draft"),
    ):
        asyncio.run(
            manager.generate_text(
                module.AIRequest(prompt="Hello", service_name="draft", user_id="user-1")
            )
        )


def test_embedding_health_and_status_helpers():
    """Helper methods should expose embeddings, health, models, and service status."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    embedding_model = module.ModelConfig("embed", "e1", module.AIProvider.GOOGLE_AI)
    config = _Config()
    config.models = {"embed": embedding_model}
    config.services = {
        "draft": SimpleNamespace(
            enabled=True,
            primary_model="embed",
            fallback_models=["fallback"],
            cache_enabled=False,
            cost_budget_daily=2.0,
            rate_limit_per_user=10,
        )
    }
    config.get_models_by_type = lambda _type: [embedding_model]
    manager = module.AIClientManager(config)

    class _WorkingClient:
        async def generate_text(self, request, model_config):
            raise NotImplementedError

        async def generate_embeddings(self, texts, model_config):
            return [[0.2] for _ in texts]

        async def health_check(self):
            return True

    manager.clients = {
        module.AIProvider.GOOGLE_AI: _WorkingClient(),
        module.AIProvider.ANTHROPIC: _WorkingClient(),
    }

    embeddings = asyncio.run(manager.generate_embeddings(["a", "b"]))
    health = asyncio.run(manager.health_check())

    assert embeddings == [[0.2], [0.2]]
    assert health == {"googleai": True, "anthropic": True}
    assert manager.get_available_models() == ["embed"]
    assert manager.get_available_models("draft") == ["embed", "fallback"]
    assert manager.get_service_status()["draft"]["provider_available"] is True


def test_embedding_and_health_guard_branches():
    """Embedding and health helpers should reject missing models/clients and tolerate failures."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    config = _Config()
    config.services = {
        "draft": SimpleNamespace(
            enabled=True,
            primary_model="missing",
            fallback_models=[],
            cache_enabled=True,
            cost_budget_daily=1.0,
            rate_limit_per_user=3,
        )
    }
    manager = module.AIClientManager(config)

    with pytest.raises(ValueError, match="No embedding models configured"):
        asyncio.run(manager.generate_embeddings(["a"]))

    config.get_models_by_type = lambda _type: [SimpleNamespace(name="embed")]
    with pytest.raises(ValueError, match="Embedding model 'embed' not found"):
        asyncio.run(manager.generate_embeddings(["a"]))

    config.models = {"embed": module.ModelConfig("embed", "e1", module.AIProvider.ANTHROPIC)}
    manager.clients = {}
    with pytest.raises(ValueError, match="No client available for provider"):
        asyncio.run(manager.generate_embeddings(["a"], "embed"))

    class _BrokenHealthClient:
        async def health_check(self):
            raise RuntimeError("down")

    manager.clients = {module.AIProvider.GOOGLE_AI: _BrokenHealthClient()}
    assert asyncio.run(manager.health_check()) == {"googleai": False}
    assert manager.get_service_status()["draft"]["provider_available"] is False


def test_get_ai_client_initializes_global_when_missing():
    """get_ai_client should lazily create the global manager."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    module._ai_client_manager = None
    module.AIClientManager = lambda: SimpleNamespace(name="lazy-client")
    assert module.get_ai_client().name == "lazy-client"


def test_global_ai_client_helpers(monkeypatch):
    """setup_ai_client and get_ai_client should manage the global singleton."""
    module = _load_module()

    class _Config(module.AIConfigManager):
        def get_provider_credentials(self, provider):
            return SimpleNamespace(api_key="key")

    manager = module.setup_ai_client(_Config())
    assert module.get_ai_client() is manager
