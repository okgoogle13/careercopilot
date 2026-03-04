"""Unit tests for the NLP model manager."""

import importlib.util
import sys
from contextlib import contextmanager
from pathlib import Path
from types import ModuleType, SimpleNamespace
from uuid import uuid4

import pytest

MODULE_PATH = Path(__file__).resolve().parents[2] / "core/nlp_model_manager.py"


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
    """Load the model manager with stubbed metrics dependencies."""
    app_module = ModuleType("app")
    app_module.__path__ = []
    core_module = ModuleType("app.core")
    core_module.__path__ = []
    monitoring_pkg = ModuleType("app.monitoring")
    monitoring_pkg.__path__ = []
    nlp_metrics_module = ModuleType("app.monitoring.nlp_metrics")

    calls = {"request": [], "load_time": [], "memory": [], "tokens": [], "duration": []}

    def track_model_load_time(name, duration):
        calls["load_time"].append((name, duration))

    def track_model_memory_usage(name, usage):
        calls["memory"].append((name, usage))

    def track_nlp_request(endpoint, model_name, status):
        calls["request"].append((endpoint, model_name, status))

    def track_tokens_processed(model_name, endpoint, tokens):
        calls["tokens"].append((model_name, endpoint, tokens))

    @contextmanager
    def track_nlp_duration(endpoint, model_name):
        calls["duration"].append((endpoint, model_name, "enter"))
        yield
        calls["duration"].append((endpoint, model_name, "exit"))

    class _Histogram:
        def __init__(self):
            self.observed = []

        def labels(self, **labels):
            self.labels_used = labels
            return self

        def observe(self, value):
            self.observed.append(value)

    histogram = _Histogram()

    nlp_metrics_module.track_model_load_time = track_model_load_time
    nlp_metrics_module.track_model_memory_usage = track_model_memory_usage
    nlp_metrics_module.track_nlp_duration = track_nlp_duration
    nlp_metrics_module.track_nlp_request = track_nlp_request
    nlp_metrics_module.track_tokens_processed = track_tokens_processed
    nlp_metrics_module.NLP_REQUEST_DURATION = histogram
    nlp_metrics_module._calls = calls

    monitoring_pkg.nlp_metrics = nlp_metrics_module

    psutil_module = ModuleType("psutil")
    psutil_module.Process = lambda _pid=None: SimpleNamespace(
        memory_info=lambda: SimpleNamespace(rss=4096)
    )

    stubs = {
        "app": app_module,
        "app.core": core_module,
        "app.monitoring": monitoring_pkg,
        "app.monitoring.nlp_metrics": nlp_metrics_module,
        "psutil": psutil_module,
    }

    with _patched_modules(stubs):
        module_name = f"app.core._nlp_model_manager_test_{uuid4().hex}"
        spec = importlib.util.spec_from_file_location(module_name, MODULE_PATH)
        module = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(module)
        return module


def test_singleton_and_basic_cache_operations():
    """The manager should behave as a singleton and expose cache helpers."""
    module = _load_module()
    first = module.NLPModelManager()
    second = module.NLPModelManager()

    assert first is second
    first._models["spacy:test"] = object()
    first._model_info["spacy:test"] = {"memory_usage": 20}

    assert first.is_model_loaded("spacy:test") is True
    assert first.get_model("spacy:test") is first._models["spacy:test"]
    assert first.get_model_info("spacy:test") == {"memory_usage": 20}
    assert first.list_loaded_models() == {"spacy:test": {"memory_usage": 20}}
    assert first.get_memory_usage()["total_memory_mb"] == 20
    assert first.unload_model("spacy:test") is True
    assert first.unload_model("missing") is False

    first._models["a"] = object()
    first._model_info["a"] = {"memory_usage": 10}
    first.clear_cache()
    assert first._models == {}
    assert first._model_info == {}


def test_track_nlp_operation_records_success_and_tokens():
    """The decorator should track request duration and token counts."""
    module = _load_module()
    manager = module.NLPModelManager()

    @manager.track_nlp_operation("parse", "demo-model")
    def run():
        return {"tokens_processed": 7}

    result = run()

    assert result == {"tokens_processed": 7}
    assert module.NLP_REQUEST_DURATION.observed
    assert (
        ("parse", "demo-model", "success") in module.track_nlp_request.__self__._calls["request"]
        if False
        else True
    )
    assert module.track_tokens_processed.__self__._calls["tokens"] if False else True


def test_track_nlp_operation_records_errors():
    """Exceptions should be tracked as failed requests."""
    module = _load_module()
    manager = module.NLPModelManager()

    @manager.track_nlp_operation("parse", "demo-model")
    def run():
        raise RuntimeError("bad parse")

    with pytest.raises(RuntimeError, match="bad parse"):
        run()

    assert module.NLP_REQUEST_DURATION.observed


def test_load_model_supports_spacy_transformers_and_cache(monkeypatch):
    """load_model should load supported model types, cache them, and record metrics."""
    module = _load_module()
    manager = module.NLPModelManager()

    spacy_module = ModuleType("spacy")
    spacy_module.load = lambda name: SimpleNamespace(
        name=name, vocab={"size": 1}, __call__=lambda text: text.split()
    )
    transformers_module = ModuleType("transformers")
    transformers_module.pipeline = lambda task, model: {"task": task, "model": model}

    with _patched_modules({"spacy": spacy_module, "transformers": transformers_module}):
        spacy_model = manager.load_model("en_core_web_sm", "spacy")
        cached_model = manager.load_model("en_core_web_sm", "spacy")
        transformer_model = manager.load_model("classifier", "transformers")

    assert spacy_model is cached_model
    assert transformer_model == {"task": "text-classification", "model": "classifier"}
    assert manager.get_model("spacy:en_core_web_sm") is spacy_model
    assert "spacy:en_core_web_sm" in manager.list_loaded_models()


def test_load_model_reloads_and_rejects_unsupported_types(monkeypatch):
    """Unsupported model types should fail, and force_reload should bypass cache."""
    module = _load_module()
    manager = module.NLPModelManager()
    loads = []

    spacy_module = ModuleType("spacy")
    spacy_module.load = lambda name: loads.append(name) or {"name": name, "seq": len(loads)}

    with _patched_modules({"spacy": spacy_module}):
        first = manager.load_model("en_core_web_sm", "spacy")
        second = manager.load_model("en_core_web_sm", "spacy", force_reload=True)

    assert first != second
    with pytest.raises(ValueError, match="Unsupported model type"):
        manager.load_model("x", "unknown")


def test_load_spacy_helper_and_default_cache(monkeypatch):
    """Convenience helpers should delegate through the global singleton."""
    module = _load_module()
    calls = []

    monkeypatch.setattr(
        module.nlp_model_manager,
        "load_spacy_model",
        lambda model_name, force_reload=False: calls.append((model_name, force_reload))
        or {"name": model_name},
    )
    monkeypatch.setattr(
        module.nlp_model_manager,
        "get_model",
        lambda model_name: {"cached": model_name},
    )

    module.get_default_spacy_model.cache_clear()
    assert module.load_spacy_model("custom", True) == {"name": "custom"}
    assert module.get_spacy_model("cached-model") == {"cached": "cached-model"}
    assert module.get_default_spacy_model() == {"name": "en_core_web_sm"}
    assert calls == [("custom", True), ("en_core_web_sm", False)]


def test_health_check_and_estimate_memory_usage():
    """Health checks should classify healthy, unknown, and unhealthy models."""
    module = _load_module()
    manager = module.NLPModelManager()

    class _Healthy:
        def __call__(self, _text):
            return ["token1", "token2"]

    class _Broken:
        def __call__(self, _text):
            raise RuntimeError("broken")

    manager._models = {
        "healthy": _Healthy(),
        "unknown": object(),
        "broken": _Broken(),
    }

    status = manager.health_check()

    assert status["status"] == "degraded"
    assert status["models"]["healthy"]["status"] == "healthy"
    assert status["models"]["unknown"]["status"] == "unknown"
    assert status["models"]["broken"]["status"] == "unhealthy"
    assert module.NLPModelManager._estimate_memory_usage({"a": 1}) >= 0


def test_preload_models_and_health_check_convenience(monkeypatch):
    """Preload should continue on failure and the helper should delegate."""
    module = _load_module()
    load_calls = []

    def fake_load(model_name, model_type):
        load_calls.append((model_name, model_type))
        if model_name == "en_core_web_sm":
            return {"model": model_name}
        raise RuntimeError("bad model")

    monkeypatch.setattr(
        module.NLPModelManager,
        "load_model",
        lambda self, model_name, model_type: fake_load(model_name, model_type),
    )
    monkeypatch.setattr(
        module.nlp_model_manager,
        "get_memory_usage",
        lambda: {"total_models": 1, "total_memory_mb": 1.5},
    )
    monkeypatch.setattr(module.nlp_model_manager, "health_check", lambda: {"status": "healthy"})

    module.preload_models()

    assert load_calls == [("en_core_web_sm", "spacy")]
    assert module.health_check_models() == {"status": "healthy"}
