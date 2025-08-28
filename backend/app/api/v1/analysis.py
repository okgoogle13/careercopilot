import uuid
import logging
from typing import Optional

from app.ai_operations.ats_scoring import ats_scorer
from fastapi import BackgroundTasks
from app.workers.ats_score_worker import process_ats_score_task
from app.ai_operations.job_analyzer import job_analyzer
from app.ai_operations.resume_analyzer import resume_analyzer
from app.core.ai_error_handling import AIError
from app.core.enhanced_ai_error_handling import (
    enhanced_ai_handler,
    AIServiceType,
    AIOperationContext,
    FallbackStrategy,
    create_fallback_strategy,
    create_detailed_error_message,
    AIOperationResult
)
from app.core.db import db
from app.core.dependencies import get_current_user_with_state, get_user_document_from_firestore
from app.core.limiter import authenticated_limiter
from fastapi import APIRouter, Depends, HTTPException, Request, status
from google.api_core.exceptions import GoogleAPICallError
from google.cloud.firestore import SERVER_TIMESTAMP
from pydantic import BaseModel, ValidationError

logger = logging.getLogger(__name__)

router = APIRouter()


class AtsScoreRequest(BaseModel):
    job_description: str


class ResumeAnalysisRequest(BaseModel):
    job_description: str
    company_info: Optional[str] = None


class JobAnalysisRequest(BaseModel):
    job_description: str
    company_info: Optional[str] = None


@router.post("/ats-score/{document_id}")
@authenticated_limiter.limit("10/minute")
async def get_ats_score(
    http_request: Request,
    document_id: str,
    request: AtsScoreRequest,
    document: dict = Depends(get_user_document_from_firestore),
    user: dict = Depends(get_current_user_with_state),
    background_tasks: BackgroundTasks = None,
):
    """
    Accepts a resume document and a job description, runs them through the
    ATS scoring flow with enhanced error handling, saves the result, and returns the analysis.
    """
    user_id = user["uid"]
    logger.info(f"Starting ATS score analysis for user {user_id}, document {document_id}")
    
    # Validate document content
    resume_text = document.get("content") or document.get("extractedText")
    if not resume_text:
        logger.warning(f"No text content found in document {document_id} for user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The selected document has no text content to analyze.",
        )

    # Trigger background ATS scoring task
    background_tasks.add_task(
        process_ats_score_task,
        user_id,
        document_id,
        resume_text,
        request.job_description
    )
    return {"status": "accepted", "detail": "ATS scoring started", "document_id": document_id}, 202


@router.post("/resume-analysis/{document_id}")
@authenticated_limiter.limit("10/minute")
async def analyze_resume(
    http_request: Request,
    document_id: str,
    request: ResumeAnalysisRequest,
    document: dict = Depends(get_user_document_from_firestore),
    user: dict = Depends(get_current_user_with_state),
):
    """
    Analyze a resume against a job description with enhanced error handling
    to provide match scoring and recommendations.
    """
    user_id = user["uid"]
    logger.info(f"Starting resume analysis for user {user_id}, document {document_id}")
    
    # Validate document content
    resume_text = document.get("content") or document.get("extractedText")
    if not resume_text:
        logger.warning(f"No text content found in document {document_id} for user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The selected document has no text content to analyze.",
        )

    # First analyze the job description with error handling
    job_analysis_result = await enhanced_ai_handler.execute_ai_operation(
        lambda: job_analyzer.analyze_job_description(
            user_id=user_id,
            job_description=request.job_description,
            company_info=request.company_info,
        ),
        AIOperationContext(
            operation_name="job_description_analysis",
            service_type=AIServiceType.GEMINI_ANALYSIS,
            user_id=user_id,
            input_size=len(request.job_description),
            metadata={
                "document_id": document_id,
                "has_company_info": bool(request.company_info)
            }
        ),
        create_fallback_strategy(
            enabled=True,
            fallback_data={
                "role_title": "Position",
                "required_skills": [],
                "preferred_skills": [],
                "experience_level": "Unknown",
                "key_responsibilities": [],
                "company_culture": "Not specified",
                "degraded_mode": True
            }
        )
    )
    
    if not job_analysis_result.success:
        error_message = create_detailed_error_message(
            job_analysis_result,
            "job description analysis"
        )
        logger.error(f"Job analysis failed for user {user_id}: {error_message}")
        raise _create_http_exception_from_ai_result(job_analysis_result, error_message)
    
    job_analysis = job_analysis_result.data

    # Then compare resume to job analysis with error handling
    resume_analysis_result = await enhanced_ai_handler.execute_ai_operation(
        lambda: resume_analyzer.compare_resume_to_job(
            user_id=user_id, 
            resume_text=resume_text, 
            job_analysis_data=job_analysis
        ),
        AIOperationContext(
            operation_name="resume_comparison_analysis",
            service_type=AIServiceType.GEMINI_ANALYSIS,
            user_id=user_id,
            input_size=len(resume_text),
            metadata={
                "document_id": document_id,
                "job_analysis_degraded": job_analysis_result.fallback_used
            }
        ),
        create_fallback_strategy(
            enabled=True,
            fallback_data={
                "match_score": 50,
                "strengths": ["Analysis temporarily unavailable"],
                "gaps": ["Please try again later for detailed analysis"],
                "recommendations": [
                    "Resume analysis is currently unavailable. "
                    "Please try again in a few minutes for detailed recommendations."
                ],
                "degraded_mode": True
            }
        )
    )
    
    if not resume_analysis_result.success:
        error_message = create_detailed_error_message(
            resume_analysis_result,
            "resume comparison analysis"
        )
        logger.error(f"Resume analysis failed for user {user_id}: {error_message}")
        raise _create_http_exception_from_ai_result(resume_analysis_result, error_message)
    
    resume_analysis = resume_analysis_result.data
    
    # Save the analysis result with enhanced metadata
    try:
        await _save_analysis_result(
            user_id=user_id,
            document_id=document_id,
            analysis_type="resume_analysis",
            request_data={
                "job_description": request.job_description,
                "company_info": request.company_info
            },
            result={
                "jobAnalysis": job_analysis,
                "resumeAnalysis": resume_analysis
            },
            operation_result=resume_analysis_result,
            additional_metadata={
                "job_analysis_fallback": job_analysis_result.fallback_used,
                "resume_analysis_fallback": resume_analysis_result.fallback_used
            }
        )
    except Exception as save_error:
        logger.error(
            f"Failed to save resume analysis for user {user_id}, document {document_id}: {str(save_error)}"
        )
    
    logger.info(
        f"Resume analysis completed for user {user_id}, document {document_id}. "
        f"Match score: {resume_analysis.get('match_score', 'N/A')}, "
        f"Fallbacks used: job={job_analysis_result.fallback_used}, resume={resume_analysis_result.fallback_used}"
    )

    return {"jobAnalysis": job_analysis, "resumeAnalysis": resume_analysis}


@router.post("/job-analysis")
@authenticated_limiter.limit("10/minute")
async def analyze_job_description(
    http_request: Request,
    request: JobAnalysisRequest, 
    user: dict = Depends(get_current_user_with_state)
):
    """
    Analyze a job description with enhanced error handling to extract requirements, skills, and key information.
    """
    user_id = user["uid"]
    logger.info(f"Starting job description analysis for user {user_id}")
    
    # Analyze job description with enhanced error handling
    job_analysis_result = await enhanced_ai_handler.execute_ai_operation(
        lambda: job_analyzer.analyze_job_description(
            user_id=user_id,
            job_description=request.job_description,
            company_info=request.company_info,
        ),
        AIOperationContext(
            operation_name="standalone_job_analysis",
            service_type=AIServiceType.GEMINI_ANALYSIS,
            user_id=user_id,
            input_size=len(request.job_description),
            metadata={
                "has_company_info": bool(request.company_info),
                "job_description_length": len(request.job_description)
            }
        ),
        create_fallback_strategy(
            enabled=True,
            fallback_data={
                "role_title": "Position",
                "required_skills": [],
                "preferred_skills": [],
                "experience_level": "Not specified",
                "key_responsibilities": ["Responsibilities not available"],
                "company_culture": "Company culture not specified",
                "salary_range": "Not specified",
                "benefits": [],
                "degraded_mode": True,
                "message": "Job analysis is currently running in degraded mode. Please try again later for full analysis."
            }
        )
    )
    
    if not job_analysis_result.success:
        error_message = create_detailed_error_message(
            job_analysis_result,
            "job description analysis"
        )
        logger.error(f"Job analysis failed for user {user_id}: {error_message}")
        raise _create_http_exception_from_ai_result(job_analysis_result, error_message)
    
    job_analysis = job_analysis_result.data
    
    # Save the job analysis with enhanced metadata
    try:
        analysis_id = str(uuid.uuid4())
        analysis_ref = (
            db.collection("users")
            .document(user_id)
            .collection("job_analyses")
            .document(analysis_id)
        )
        analysis_data = {
            "id": analysis_id,
            "createdAt": SERVER_TIMESTAMP,
            "jobDescription": request.job_description,
            "companyInfo": request.company_info,
            "analysis": job_analysis,
            "metadata": {
                "fallback_used": job_analysis_result.fallback_used,
                "execution_time": job_analysis_result.execution_time,
                "service_type": "gemini_analysis"
            }
        }
        await analysis_ref.set(analysis_data)
    except Exception as save_error:
        logger.error(
            f"Failed to save job analysis for user {user_id}: {str(save_error)}"
        )
    
    logger.info(
        f"Job description analysis completed for user {user_id}. "
        f"Fallback used: {job_analysis_result.fallback_used}"
    )

    return job_analysis


# --- Helper Functions ---

async def _save_analysis_result(
    user_id: str,
    document_id: str,
    analysis_type: str,
    request_data: dict,
    result: dict,
    operation_result: AIOperationResult,
    additional_metadata: dict = None
) -> None:
    """Save analysis result with enhanced metadata"""
    doc_ref = (
        db.collection("users")
        .document(user_id)
        .collection("documents")
        .document(document_id)
    )
    analysis_id = str(uuid.uuid4())
    analysis_ref = doc_ref.collection("analyses").document(analysis_id)
    
    # Prepare enhanced metadata
    metadata = {
        "fallback_used": operation_result.fallback_used,
        "execution_time": operation_result.execution_time,
        "service_type": operation_result.context.service_type.value if operation_result.context else "unknown",
        "success": operation_result.success,
        "timestamp": SERVER_TIMESTAMP
    }
    
    if additional_metadata:
        metadata.update(additional_metadata)
        
    if operation_result.error:
        metadata["error_type"] = operation_result.error.error_type.value
        metadata["had_error"] = True
    
    analysis_data = {
        "id": analysis_id,
        "createdAt": SERVER_TIMESTAMP,
        "type": analysis_type,
        "result": result,
        "metadata": metadata,
        **request_data  # Spread request data fields
    }
    
    await analysis_ref.set(analysis_data)


def _create_http_exception_from_ai_result(
    ai_result: AIOperationResult, 
    error_message: str
) -> HTTPException:
    """Create appropriate HTTPException from AIOperationResult"""
    if not ai_result.error:
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_message
        )
    
    error_type = ai_result.error.error_type.value
    
    if error_type in ["rate_limit", "quota_exceeded"]:
        return HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=error_message
        )
    elif error_type in ["service_unavailable", "timeout"]:
        return HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=error_message
        )
    elif error_type == "invalid_request":
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message
        )
    elif error_type == "authentication":
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error_message
        )
    else:
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_message
        )
