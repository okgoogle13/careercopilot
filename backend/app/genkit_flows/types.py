"""Type stubs for genkit and related modules."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any, TypeVar

from typing_extensions import ParamSpec, Protocol

T = TypeVar("T")
P = ParamSpec("P")
R = TypeVar("R")
InputT = TypeVar("InputT")
OutputT = TypeVar("OutputT")


# Type stubs for genkit
class GenkitFlow(Protocol[P, T]):
    """Protocol for genkit.flow decorator."""

    def __call__(self, func: Callable[P, T]) -> Callable[P, T]: ...


class GenkitPlugin(Protocol):
    """Protocol for genkit plugins."""

    def init(self, **kwargs: Any) -> Any: ...


class ModelConfig(Protocol):
    """Protocol for model configuration."""

    def generate(self, prompt: str, **kwargs: Any) -> Any: ...

    def __call__(self, *args: Any, **kwargs: Any) -> Any: ...


# Stub for genkit module
class GenkitModule(Protocol):
    """Stub for genkit module."""

    def get_plugin(self, name: str) -> GenkitPlugin | None: ...

    def init(self, plugins: list[Any] | None = None) -> None: ...

    @property
    def flow(self) -> GenkitFlow[P, T]: ...


# Stub for google_genai plugin
class GoogleGenAIPlugin(Protocol):
    """Stub for google_genai plugin."""

    @staticmethod
    def init(api_key: str | None = None) -> GenkitPlugin: ...


# Type for flow functions
FlowFunction = Callable[..., OutputT]

# Type for error handler
ErrorHandler = Callable[[Exception], None]
