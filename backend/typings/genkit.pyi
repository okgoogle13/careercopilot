from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

def flow(
    func: Callable[..., Any] | None = None,
    *,
    name: str | None = None,
    output_schema: type[BaseModel] | None = None,
    require_model: bool = True,
) -> Callable[..., Any]: ...

class AI:
    @staticmethod
    def generate(
        prompt: str,
        output_schema: type[T] | None = None,
        config: dict[str, Any] | None = None,
    ) -> Awaitable[T]: ...

class ModelConfig:
    def generate(
        self,
        prompt: str,
        output_schema: type[T] | None = None,
        config: dict[str, Any] | None = None,
    ) -> Awaitable[T]: ...
