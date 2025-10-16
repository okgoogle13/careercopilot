import json

from app.genkit_flows.job_analyzer import analyze_job_description
from app.genkit_flows.resume_analyzer import compare_resume_to_job
from fastapi import HTTPException


class JobsService:
    @staticmethod
    async def compare_resume_to_job_and_save(
        db, uid, document_id, job_description_text
    ):
        try:
            # Step A: Analyze the job description
            job_analysis_str = await analyze_job_description.run(job_description_text)
            job_analysis_data = json.loads(job_analysis_str)

            # Step B: Fetch the user's resume text from Firestore
            doc_ref = (
                db.collection("users")
                .document(uid)
                .collection("documents")
                .document(document_id)
            )
            doc = await doc_ref.get()
            if not doc.exists:
                raise HTTPException(status_code=404, detail="Resume document not found")

            resume_text = doc.to_dict().get("extractedText")
            if not resume_text:
                raise HTTPException(
                    status_code=400, detail="Resume has no extracted text."
                )

            # Step C: Compare the resume to the job analysis
            comparison_result_str = await compare_resume_to_job.run(
                resume_text=resume_text, job_analysis_data=job_analysis_data
            )
            comparison_result = json.loads(comparison_result_str)

            # Optionally save result to DB here
            return comparison_result
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON response: {e}")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
