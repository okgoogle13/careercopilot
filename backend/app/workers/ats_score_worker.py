import logging

from app.ai_operations.ats_scoring import ats_scorer
from app.core.db import db
from app.core.enhanced_ai_error_handling import (
    AIOperationContext,
    AIServiceType,
    create_fallback_strategy,
    enhanced_ai_handler,
)

logger = logging.getLogger(__name__)


async def process_ats_score_task(user_id, document_id, resume_text, job_description):
    try:

        async def ai_operation():
            return await ats_scorer.comprehensive_ats_analysis(
                user_id=user_id,
                resume_text=resume_text,
                job_description=job_description,
            )

        ats_analysis_result = await enhanced_ai_handler.execute_ai_operation(
            ai_operation,
            AIOperationContext(
                operation_name="comprehensive_ats_analysis",
                service_type=AIServiceType.GENKIT_FLOW,
                user_id=user_id,
                input_size=len(resume_text) + len(job_description),
                metadata={
                    "document_id": document_id,
                    "resume_length": len(resume_text),
                    "job_description_length": len(job_description),
                },
            ),
            create_fallback_strategy(enabled=True, degraded_mode=True),
        )
        # Save result to Firestore
        doc_ref = (
            db.collection("users")
            .document(user_id)
            .collection("documents")
            .document(document_id)
        )
        result = doc_ref.set({"ats_score_result": ats_analysis_result.data}, merge=True)
        # Await if set is a coroutine (for AsyncMock in tests), else just call
        if hasattr(result, "__await__"):
            await result
        logger.info(
            f"ATS score analysis completed for user {user_id}, document {document_id}"
        )
    except Exception as e:
        logger.error(
            f"Background ATS score task failed for user {user_id}, document {document_id}: {e}"
        )
