# backend/app/core/prompts/__init__.py

"""
Prompt templates for AI-powered code analysis and career assistance.

This module provides production-ready prompt templates that can be integrated
with ApplicationAgent, Jules, or any LLM-based code review system.

Available modules:
- ci_auditor: Pre-deployment code review prompts (DRY violations, build risks, performance)
- schemas: Pydantic models for structured LLM responses
"""

from .ci_auditor import CIAuditorPrompts, CodeAuditRequest
from .schemas import (
    AuditSummary,
    CIAuditResponse,
    CriticalIssue,
    OptimizationWin,
    QuickScanIssue,
    QuickScanResponse,
    RedundancyIssue,
)

__all__ = [
    "AuditSummary",
    "CIAuditResponse",
    "CIAuditorPrompts",
    "CodeAuditRequest",
    "CriticalIssue",
    "OptimizationWin",
    "QuickScanIssue",
    "QuickScanResponse",
    "RedundancyIssue",
]
