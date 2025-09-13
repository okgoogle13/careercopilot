"""AI Services Module

This module contains AI-related services and utilities for the application.
"""

# Import AI services here as they are implemented
from .base_service import BaseAIService
from .document_analysis_service import (
    DocumentAnalysisService,
    get_document_analysis_service,
    analyze_resume,
    analyze_job_description,
)

# Legacy imports for backward compatibility
from .resume_service import ResumeAnalysisService
from .job_description_service import JobDescriptionAnalysisService

__all__ = [
    "BaseAIService",
    "DocumentAnalysisService",
    "get_document_analysis_service",
    "analyze_resume",
    "analyze_job_description",
    # Legacy exports (deprecated)
    "ResumeAnalysisService", 
    "JobDescriptionAnalysisService",
]
