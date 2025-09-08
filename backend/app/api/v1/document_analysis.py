"""
Document Analysis API Endpoints

This module demonstrates the use of the consolidated document processing
and file upload validation functionality.
"""

import logging
from typing import Any, Dict

from app.ai.job_description_service import JobDescriptionAnalysisService
from app.ai.resume_service import ResumeAnalysisService
from app.core.dependencies import get_current_user_with_state
from app.core.document_processing import compare_resume_to_job
from app.core.file_upload_decorators import (
    require_valid_job_description_upload,
    require_valid_resume_upload,
)
from app.core.limiter import authenticated_limiter
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()


class AnalysisResponse(BaseModel):
    """Response model for document analysis."""
    
    success: bool
    message: str
    analysis: Dict[str, Any]
    filename: str


class ComparisonResponse(BaseModel):
    """Response model for document comparison."""
    
    success: bool
    message: str
    comparison: Dict[str, Any]
    resume_filename: str
    job_description_filename: str


# Helper function to extract text from uploaded files
async def extract_text_from_file(file: UploadFile) -> str:
    """Extract text from an uploaded file."""
    content = await file.read()
    
    # Reset file pointer for potential reuse
    file.file.seek(0)
    
    if file.content_type == "application/pdf":
        # For PDF files, you'd use a PDF extraction library
        # This is a simplified placeholder
        return content.decode("utf-8", errors="ignore")
    elif file.content_type == "text/plain":
        return content.decode("utf-8")
    elif file.content_type in [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]:
        # For Word documents, you'd use python-docx or similar
        # This is a simplified placeholder
        return content.decode("utf-8", errors="ignore")
    else:
        # Fallback to text extraction
        return content.decode("utf-8", errors="ignore")


@router.post("/analyze/resume", response_model=AnalysisResponse)
@authenticated_limiter.limit("10/minute")
@require_valid_resume_upload(max_size_mb=10)
async def analyze_resume(
    request: Request,
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user_with_state),
):
    """
    Analyze a resume using the consolidated document processing system.
    
    This endpoint demonstrates:
    - File upload validation via decorator
    - Generic document processing for resume analysis
    """
    try:
        # Extract text from the validated file
        resume_text = await extract_text_from_file(file)
        
        # Use the refactored resume service (which uses generic document processing)
        service = ResumeAnalysisService()
        result = await service.analyze_resume(resume_text)
        
        return AnalysisResponse(
            success=True,
            message="Resume analyzed successfully",
            analysis=result.model_dump(),
            filename=file.filename or "unknown",
        )
        
    except Exception as e:
        logger.error(f"Resume analysis failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze resume: {str(e)}"
        )


@router.post("/analyze/job-description", response_model=AnalysisResponse)
@authenticated_limiter.limit("10/minute")
@require_valid_job_description_upload(max_size_mb=5)
async def analyze_job_description(
    request: Request,
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user_with_state),
):
    """
    Analyze a job description using the consolidated document processing system.
    
    This endpoint demonstrates:
    - File upload validation via decorator
    - Generic document processing for job description analysis
    """
    try:
        # Extract text from the validated file
        job_text = await extract_text_from_file(file)
        
        # Use the new job description service (which uses generic document processing)
        service = JobDescriptionAnalysisService()
        result = await service.analyze_job_description(job_text)
        
        return AnalysisResponse(
            success=True,
            message="Job description analyzed successfully",
            analysis=result.model_dump(),
            filename=file.filename or "unknown",
        )
        
    except Exception as e:
        logger.error(f"Job description analysis failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze job description: {str(e)}"
        )


@router.post("/compare", response_model=ComparisonResponse)
@authenticated_limiter.limit("5/minute")  # More restrictive for complex operations
async def compare_resume_to_job_description(
    request: Request,
    resume_file: UploadFile = File(...),
    job_description_file: UploadFile = File(...),
    user: dict = Depends(get_current_user_with_state),
):
    """
    Compare a resume to a job description using the consolidated processing system.
    
    This endpoint demonstrates:
    - Manual validation for multiple files with different requirements
    - Generic document processing for comparison analysis
    """
    try:
        # Manual validation since we have two different file types
        from app.core.file_upload_decorators import FileUploadConfig, validate_file_upload
        
        # Validate resume file
        resume_config = FileUploadConfig(
            allowed_extensions={'.pdf', '.doc', '.docx', '.txt'},
            max_file_size_mb=10
        )
        validate_file_upload(resume_file, resume_config)
        
        # Validate job description file
        job_config = FileUploadConfig(
            allowed_extensions={'.pdf', '.doc', '.docx', '.txt', '.md'},
            max_file_size_mb=5
        )
        validate_file_upload(job_description_file, job_config)
        
        # Extract text from both files
        resume_text = await extract_text_from_file(resume_file)
        job_description_text = await extract_text_from_file(job_description_file)
        
        # Use the generic comparison function
        result = await compare_resume_to_job(
            resume_text=resume_text,
            job_description=job_description_text
        )
        
        return ComparisonResponse(
            success=True,
            message="Documents compared successfully",
            comparison=result.model_dump(),
            resume_filename=resume_file.filename or "unknown",
            job_description_filename=job_description_file.filename or "unknown",
        )
        
    except Exception as e:
        logger.error(f"Document comparison failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compare documents: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check for document analysis service."""
    return {
        "status": "healthy",
        "services": {
            "document_processing": "available",
            "file_validation": "available",
            "resume_analysis": "available",
            "job_description_analysis": "available",
        },
        "version": "2.0.0"
    }