from typing import List, Optional

from pydantic import BaseModel, Field

from app.core.google_genai_compat import get_configured_google_generativeai
from app.core.secure_config import settings
from app.services.vector_store import VectorStore


def _get_generation_model():
    """Configure and create the Gemini client lazily."""
    genai = get_configured_google_generativeai(settings.GEMINI_API_KEY)
    return genai.GenerativeModel("gemini-1.5-flash") if genai else None


class GapAnalysisResult(BaseModel):
    missing_skills: List[str] = Field(
        description="List of critical skills found in JD but missing in Resume."
    )
    evidence_found: List[str] = Field(
        description="Evidence found in user history for these missing skills."
    )
    strategy_advice: str = Field(
        description="Advice on how to bridge the gap using the found evidence."
    )


def gap_hunter_flow(resume_text: str, job_description: str) -> GapAnalysisResult:
    """
    Identifies gaps between Resume and JD, then queries the Vector Store
    to find evidence from the user's past (KSCs, Cover Letters) to fill those gaps.
    """
    vector_store = VectorStore()
    generation_model = _get_generation_model()
    if generation_model is None:
        return GapAnalysisResult(
            missing_skills=[],
            evidence_found=[],
            strategy_advice="Gap analysis unavailable because the AI model is not configured.",
        )

    # Step 1: Identify Gaps using Gemini
    prompt_identify = f"""
    Compare the Resume against the Job Description.
    Identify the top 3 MOST CRITICAL hard skills or competencies that are REQUIRED by the Job but MISSING or weak in the Resume.
    Return ONLY a comma-separated list of these skills.

    JOB DESCRIPTION:
    {job_description[:3000]}

    RESUME:
    {resume_text[:3000]}
    """

    response_gaps = generation_model.generate_content(prompt_identify)

    missing_skills_text = response_gaps.text
    missing_skills = [s.strip() for s in missing_skills_text.split(",") if s.strip()]

    # Step 2: Hunt for Evidence
    found_evidence = []

    for skill in missing_skills:
        # Query the vector store
        results = vector_store.query_similar(f"Experience with {skill}", n_results=2)

        if results:
            best_match = results[0]
            source = best_match["metadata"].get("source_type", "Unknown Source")
            evidence_snippet = best_match["content"][:200] + "..."
            found_evidence.append(
                f"For '{skill}', found evidence in {source}: \"{evidence_snippet}\""
            )

    # Step 3: Generate Strategy Advice
    strategy_advice = "No major gaps found."
    if missing_skills:
        if found_evidence:
            strategy_advice = f"I found evidence for {len(found_evidence)} missing skills. I will strategically insert this into your resume."
        else:
            strategy_advice = "I identified missing skills but found no evidence in your history. You may need to add this manually."

    return GapAnalysisResult(
        missing_skills=missing_skills,
        evidence_found=found_evidence,
        strategy_advice=strategy_advice,
    )
