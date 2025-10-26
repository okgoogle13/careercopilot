from typing import Any, Callable, Optional, Type, TypeVar, Union, Awaitable, Dict, List
from pydantic import BaseModel

T = TypeVar('T', bound=BaseModel)

def flow(
    func: Optional[Callable[..., Any]] = None,
    *,
    name: Optional[str] = None,
    output_schema: Optional[Type[BaseModel]] = None,
    require_model: bool = True
) -> Callable[..., Any]: ...

class AI:
    @staticmethod
    def generate(
        prompt: str,
        output_schema: Optional[Type[T]] = None,
        config: Optional[Dict[str, Any]] = None
    ) -> Awaitable[T]: ...

class ModelConfig:
    def generate(
        self,
        prompt: str,
        output_schema: Optional[Type[T]] = None,
        config: Optional[Dict[str, Any]] = None
    ) -> Awaitable[T]: ...
