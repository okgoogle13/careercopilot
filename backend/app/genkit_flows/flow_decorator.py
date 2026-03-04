"""Compatibility re-export for legacy flow decorator imports."""

from app.core.genkit_init import (
    async_genkit_flow,
    create_flow_wrapper,
    genkit_flow,
    run_flow,
    run_flow_async,
    simple_genkit_flow,
)

__all__ = [
    "async_genkit_flow",
    "create_flow_wrapper",
    "genkit_flow",
    "run_flow",
    "run_flow_async",
    "simple_genkit_flow",
]
