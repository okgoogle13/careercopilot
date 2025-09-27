# backend/app/ai/__init__.py

"""
AI services package for CareerCopilot.

This package provides:
- LLM caching layer for cost optimization
- Smart model dispatcher for task-appropriate model selection
- Cost estimation and monitoring for AI operations
"""

from .llm_service import get_llm_response, clear_cache_pattern, get_cache_stats
from .model_dispatcher import (
    dispatch_llm_call,
    estimate_cost,
    get_model_recommendations,
    generate_cover_letter,
    optimize_resume,
    extract_keywords
)

__all__ = [
    "get_llm_response",
    "clear_cache_pattern",
    "get_cache_stats",
    "dispatch_llm_call",
    "estimate_cost",
    "get_model_recommendations",
    "generate_cover_letter",
    "optimize_resume",
    "extract_keywords"
]