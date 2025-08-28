import asyncio
from fastapi import BackgroundTasks
from app.ai_operations.ats_scoring import ats_scorer
from app.core.enhanced_ai_error_handling import (
    enhanced_ai_handler,
    AIServiceType,
    AIOperationContext,
    create_fallback_strategy,
    create_detailed_error_message,
    AIOperationResult
)
from app.core.db import db
import logging

logger = logging.getLogger(__name__)

async def process_ats_score_task(user_id, document_id, resume_text, job_description):
    try:
        ats_analysis_result = await enhanced_ai_handler.execute_ai_operation(
            lambda: ats_scorer.comprehensive_ats_analysis(
                user_id=user_id,
                resume_text=resume_text,
                job_description=job_description,
            ),
            AIOperationContext(
                operation_name="comprehensive_ats_analysis",
                service_type=AIServiceType.GENKIT_FLOW,
                user_id=user_id,
                input_size=len(resume_text) + len(job_description),
                metadata={
                    "document_id": document_id,
                    "resume_length": len(resume_text),
                    "job_description_length": len(job_description)
                }
            ),
            create_fallback_strategy(
                enabled=True,
                degraded_mode=True
            )
        )
        # Save result to Firestore
        doc_ref = db.collection("users").document(user_id).collection("documents").document(document_id)
        await doc_ref.set({"ats_score_result": ats_analysis_result.data}, merge=True)
        logger.info(f"ATS score analysis completed for user {user_id}, document {document_id}")
    except Exception as e:
        logger.error(f"Background ATS score task failed for user {user_id}, document {document_id}: {e}")
