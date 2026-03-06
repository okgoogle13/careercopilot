from __future__ import annotations

import builtins
import runpy
from pathlib import Path

from app.core import observability as obs


def test_observability_import_fallback_paths(monkeypatch) -> None:
    source = Path(__file__).resolve().parents[2] / "core" / "observability.py"
    real_import = builtins.__import__

    def _patched_import(name, *args, **kwargs):
        if name in {"loguru", "prometheus_client", "psutil"}:
            raise ImportError(f"blocked import: {name}")
        return real_import(name, *args, **kwargs)

    monkeypatch.setattr(builtins, "__import__", _patched_import)
    module_globals = runpy.run_path(str(source))

    logger_obj = module_globals["logger"]
    assert hasattr(logger_obj, "name")
    assert module_globals["PROMETHEUS_AVAILABLE"] is False
    assert module_globals["psutil"] is None


def test_configure_logging_without_loguru_methods(tmp_path, monkeypatch) -> None:
    class _PlainLogger:
        pass

    monkeypatch.setattr(obs, "logger", _PlainLogger())
    monkeypatch.delenv("ENV", raising=False)

    # Covers environment None path and logger objects without remove/add.
    obs.configure_logging(environment=None, log_dir=str(tmp_path / "logs"))
    obs.configure_logging(environment="production", log_dir=str(tmp_path / "logs-prod"))
    assert (tmp_path / "logs").exists()
    assert (tmp_path / "logs-prod").exists()


def test_init_metrics_returns_early_when_prometheus_missing(monkeypatch) -> None:
    monkeypatch.setattr(obs, "PROMETHEUS_AVAILABLE", False)
    # Should be a no-op and not raise.
    obs._init_metrics()
