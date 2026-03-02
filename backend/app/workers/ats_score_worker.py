import logging

from app.bridges.legacy_wrapper import ats_scorer
from app.core.database import SessionLocal
from app.core.enhanced_ai_error_handling import (
    AIOperationContext,
    AIServiceType,
    create_fallback_strategy,
    enhanced_ai_handler,
)
from app.models.database import UserAsset

logger = logging.getLogger(__name__)


async def process_ats_score_task(user_id, document_id, resume_text, job_description):
    db = SessionLocal()
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

        # Save result to Database
        asset = db.query(UserAsset).filter(UserAsset.id == document_id).first()
        if asset:
            asset.extracted_data["ats_score_result"] = ats_analysis_result.data
            db.commit()
            logger.info(f"ATS score analysis completed for user {user_id}, asset {document_id}")
    except Exception as e:
        logger.error(
            f"Background ATS score task failed for user {user_id}, asset {document_id}: {e}"
        )
    finally:
        db.close()
