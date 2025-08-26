import uuid
from typing import Optional

from app.ai_operations.ats_scoring import ats_scorer
from app.ai_operations.job_analyzer import job_analyzer
from app.ai_operations.resume_analyzer import resume_analyzer
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.db import db
from app.core.dependencies import get_current_user, get_user_document_from_firestore
from fastapi import APIRouter, Depends, HTTPException, status
from google.api_core.exceptions import GoogleAPICallError
from google.cloud.firestore import SERVER_TIMESTAMP
from pydantic import BaseModel, ValidationError

router = APIRouter()


def _handle_ai_error(e: AIError):
    """Maps an AIError to an appropriate HTTPException."""
    if e.error_type in [
        AIErrorType.SERVICE_UNAVAILABLE,
        AIErrorType.TIMEOUT,
        AIErrorType.RATE_LIMIT,
        AIErrorType.QUOTA_EXCEEDED,
    ]:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e)
        )
    elif e.error_type == AIErrorType.INVALID_REQUEST:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


class AtsScoreRequest(BaseModel):
    job_description: str


class ResumeAnalysisRequest(BaseModel):
    job_description: str
    company_info: Optional[str] = None


class JobAnalysisRequest(BaseModel):
    job_description: str
    company_info: Optional[str] = None


@router.post("/ats-score/{document_id}")
async def get_ats_score(
    document_id: str,
    request: AtsScoreRequest,
    document: dict = Depends(get_user_document_from_firestore),
    user: dict = Depends(get_current_user),
):
    """
    Accepts a resume document and a job description, runs them through the
    ATS scoring flow, saves the result, and returns the analysis.
    """
    try:
        resume_text = document.get("content") or document.get("extractedText")
        if not resume_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The selected document has no text content to analyze.",
            )

        # Perform comprehensive ATS analysis
        analysis_result = await ats_scorer.comprehensive_ats_analysis(
            user_id=user["uid"],
            resume_text=resume_text,
            job_description=request.job_description,
        )

        # Save the analysis result for tracking
        doc_ref = (
            db.collection("users")
            .document(user["uid"])
            .collection("documents")
            .document(document_id)
        )
        analysis_id = str(uuid.uuid4())
        analysis_ref = doc_ref.collection("analyses").document(analysis_id)
        analysis_data = {
            "id": analysis_id,
            "createdAt": SERVER_TIMESTAMP,
            "jobDescription": request.job_description,
            "result": analysis_result,
        }
        await analysis_ref.set(analysis_data)

        return analysis_result

    except AIError as e:
        _handle_ai_error(e)
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.errors())
    except GoogleAPICallError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Google Cloud API error: {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during ATS analysis: {str(e)}",
        )


@router.post("/resume-analysis/{document_id}")
async def analyze_resume(
    document_id: str,
    request: ResumeAnalysisRequest,
    document: dict = Depends(get_user_document_from_firestore),
    user: dict = Depends(get_current_user),
):
    """
    Analyze a resume against a job description to provide match scoring and recommendations.
    """
    try:
        resume_text = document.get("content") or document.get("extractedText")
        if not resume_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The selected document has no text content to analyze.",
            )

        # First analyze the job description
        job_analysis = await job_analyzer.analyze_job_description(
            user_id=user["uid"],
            job_description=request.job_description,
            company_info=request.company_info,
        )

        # Then compare resume to job analysis
        resume_analysis = await resume_analyzer.compare_resume_to_job(
            user_id=user["uid"], resume_text=resume_text, job_analysis_data=job_analysis
        )

        # Save the analysis result
        doc_ref = (
            db.collection("users")
            .document(user["uid"])
            .collection("documents")
            .document(document_id)
        )
        analysis_id = str(uuid.uuid4())
        analysis_ref = doc_ref.collection("analyses").document(analysis_id)
        analysis_data = {
            "id": analysis_id,
            "createdAt": SERVER_TIMESTAMP,
            "type": "resume_analysis",
            "jobDescription": request.job_description,
            "companyInfo": request.company_info,
            "jobAnalysis": job_analysis,
            "resumeAnalysis": resume_analysis,
        }
        await analysis_ref.set(analysis_data)

        return {"jobAnalysis": job_analysis, "resumeAnalysis": resume_analysis}

    except AIError as e:
        _handle_ai_error(e)
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.errors())
    except GoogleAPICallError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Google Cloud API error: {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during resume analysis: {str(e)}",
        )


@router.post("/job-analysis")
async def analyze_job_description(
    request: JobAnalysisRequest, user: dict = Depends(get_current_user)
):
    """
    Analyze a job description to extract requirements, skills, and key information.
    """
    try:
        job_analysis = await job_analyzer.analyze_job_description(
            user_id=user["uid"],
            job_description=request.job_description,
            company_info=request.company_info,
        )

        # Save the job analysis for future reference
        analysis_id = str(uuid.uuid4())
        analysis_ref = (
            db.collection("users")
            .document(user["uid"])
            .collection("job_analyses")
            .document(analysis_id)
        )
        analysis_data = {
            "id": analysis_id,
            "createdAt": SERVER_TIMESTAMP,
            "jobDescription": request.job_description,
            "companyInfo": request.company_info,
            "analysis": job_analysis,
        }
        await analysis_ref.set(analysis_data)

        return job_analysis

    except AIError as e:
        _handle_ai_error(e)
    except ValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.errors())
    except GoogleAPICallError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Google Cloud API error: {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during job analysis: {str(e)}",
        )
