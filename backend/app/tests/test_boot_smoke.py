import importlib
import sys


def test_app_main_imports_with_genkit_disabled(monkeypatch):
    """The app should boot infrastructure paths even when Genkit is disabled."""
    monkeypatch.setenv("ENABLE_GENKIT_FLOWS", "false")
    monkeypatch.setenv("ENV", "test")
    monkeypatch.setenv("ENVIRONMENT", "test")

    sys.modules.pop("app.main", None)

    module = importlib.import_module("app.main")

    assert module.app is not None
