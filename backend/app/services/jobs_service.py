import json
import logging

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.genkit_flows.job_analyzer import analyze_job_description
from app.genkit_flows.resume_analyzer import compare_resume_to_job
from app.models.user_asset import UserAsset

logger = logging.getLogger(__name__)


class JobsService:
    @staticmethod
    async def compare_resume_to_job(
        db: Session, user_id: str, asset_id: str, job_description_text: str
    ):
        """
        Compare a specific resume (UserAsset) to a job description.
        Replaces Firestore-based compare_resume_to_job_and_save.
        """
        try:
            # Step A: Analyze the job description
            logger.info("Analyzing job description via Genkit...")
            job_analysis_str = await analyze_job_description(job_description_text)
            job_analysis_data = json.loads(job_analysis_str)

            # Step B: Fetch the user's resume text from SQL (UserAsset)
            logger.info(f"Fetching user asset {asset_id} for user {user_id}...")
            asset = (
                db.query(UserAsset)
                .filter(UserAsset.id == asset_id, UserAsset.user_id == user_id)
                .first()
            )

            if not asset:
                raise HTTPException(status_code=404, detail="Resume asset not found")

            # In the new schema, extracted text is usually in extracted_data
            resume_text = asset.extracted_data.get("fullText") or asset.extracted_data.get(
                "extractedText"
            )
            if not resume_text:
                # Fallback to checking other fields if necessary, or error out
                logger.warning(f"Asset {asset_id} has no extracted text in extracted_data")
                raise HTTPException(status_code=400, detail="Resume has no extracted text.")

            # Step C: Compare the resume to the job analysis
            logger.info("Comparing resume to job via Genkit...")
            comparison_result_str = await compare_resume_to_job(
                resume_text=resume_text, job_analysis_data=job_analysis_data
            )
            comparison_result = json.loads(comparison_result_str)

            return comparison_result

        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error in Genkit response: {e}")
            raise HTTPException(status_code=400, detail=f"Invalid JSON response from AI: {e}")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in compare_resume_to_job: {e}")
            raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
