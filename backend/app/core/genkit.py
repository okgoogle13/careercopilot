"""Compatibility shim that re-exports the canonical Genkit runtime."""

import inspect
from typing import Any

from app.core.genkit_init import get_model as _get_model
from app.core.genkit_init import (
    init_genkit,
    is_genkit_enabled,
    register_flow_function,
)


def get_genkit_instance() -> Any | None:
    """Return the lazily initialized Genkit runtime."""
    return _get_model()


def get_model() -> Any | None:
    """Backward-compatible alias for the canonical runtime accessor."""
    return _get_model()


class LazyGenkitProxy:
    """Compatibility proxy that resolves the active runtime lazily."""

    def _runtime(self) -> Any | None:
        return _get_model()

    def flow(self, *args: Any, **kwargs: Any):
        runtime = self._runtime()
        flow_attr = getattr(runtime, "flow", None) if runtime is not None else None
        if callable(flow_attr):
            return flow_attr(*args, **kwargs)

        def _noop_decorator(func):
            return func

        return _noop_decorator

    async def generate(self, *args: Any, **kwargs: Any) -> Any:
        runtime = self._runtime()
        if runtime is None:
            raise RuntimeError("Genkit model not available")

        result = runtime.generate(*args, **kwargs)
        if inspect.isawaitable(result):
            return await result
        return result

    def __getattr__(self, name: str) -> Any:
        runtime = self._runtime()
        if runtime is None:
            raise AttributeError(name)
        return getattr(runtime, name)


ai = LazyGenkitProxy()


__all__ = [
    "ai",
    "get_genkit_instance",
    "get_model",
    "init_genkit",
    "is_genkit_enabled",
    "register_flow_function",
]
