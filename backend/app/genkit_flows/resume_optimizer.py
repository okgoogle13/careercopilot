"""
resume_optimizer.py

Genkit flows for optimizing resumes:
  1. optimize_resume  – integrates missing keywords naturally
  2. enhance_resume_with_metrics – rewrites bullets with quantifiable metrics
                                    and computes a structured skills-gap block

Modernized to use async patterns and current Genkit architecture.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from app.genkit_flows.flow_decorator import async_genkit_flow
from app.core.genkit_init import get_model
import logging
import json

from app.genkit_flows.extract_job_requirements import JobRequirements, extractJobRequirements
from app.genkit_flows.extract_resume_entities import ResumeEntities, extractResumeEntities

logger = logging.getLogger(__name__)


class OptimizedResume(BaseModel):
    """The full, optimized resume text with keywords naturally integrated."""

    resume_text: str = Field(
        description="The complete and updated resume text, with keywords naturally integrated."
    )
    keywords_integrated: List[str] = Field(
        default_factory=list,
        description="List of keywords that were successfully integrated into the resume."
    )


@async_genkit_flow(
    name="optimize_resume",
    output_schema=OptimizedResume
)
async def optimize_resume(
    resume_text: str,
    missing_keywords: List[str],
    job_description: str
) -> OptimizedResume:
    """
    Analyzes a resume and a list of missing keywords, then rewrites the resume
    to naturally incorporate those keywords in the context of the job description.

    This flow enhances ATS scores by integrating relevant keywords while maintaining
    authenticity and avoiding fabrication of experience.

    Args:
        resume_text: The original resume text
        missing_keywords: List of keywords identified as missing by ATS analysis
        job_description: The target job description for context

    Returns:
        OptimizedResume: The enhanced resume with keywords naturally integrated

    Example:
        result = await optimize_resume(
            resume_text="Software Engineer with 5 years experience...",
            missing_keywords=["Project Management", "Agile", "Python"],
            job_description="We're looking for a Senior Software Engineer..."
        )
    """

    if not missing_keywords:
        logger.info("No missing keywords to integrate, returning original resume")
        return OptimizedResume(
            resume_text=resume_text,
            keywords_integrated=[]
        )

    keywords_str = ", ".join(missing_keywords)

    prompt = f"""
You are an expert resume editor. Your task is to revise the provided resume to seamlessly integrate a list of missing keywords.
The goal is to make the resume a stronger match for the target job description without inventing new experiences or skills.

**Target Job Description:**
---
{job_description}
---

**Original Resume:**
---
{resume_text}
---

**Keywords to Integrate:**
- {keywords_str}

**Instructions:**
1. **Analyze Context:** Read the job description and the original resume to understand the candidate's experience and the employer's needs.
2. **Integrate Naturally:** Weave the keywords into the existing text of the resume. Rephrase bullet points or summaries where appropriate. For example, if a keyword is "Project Management" and the resume says "Led a team," you could change it to "Applied strong Project Management skills to lead a team."
3. **Do Not Fabricate:** You must not add new job roles, invent new skills, or create experiences the candidate does not have. Your role is to edit and enhance, not to create fiction.
4. **Preserve Formatting:** Maintain the overall structure and formatting of the original resume.
5. **Track Integration:** Note which keywords you successfully integrated.

**Output Format:**
Return a JSON object with:
- resume_text: The complete, revised resume text
- keywords_integrated: Array of keywords that were successfully integrated

Now, please generate the optimized resume.
"""

    try:
        model = get_model()
        if not model:
            raise RuntimeError("Genkit model not available")

        # Generate optimized resume using the model
        response = model.generate(
            prompt=prompt,
            generation_config={
                "temperature": 0.2,  # Lower temperature for focused, less creative output
                "response_mime_type": "application/json"
            }
        )

        # Parse the response
        if hasattr(response, 'text'):
            result_data = json.loads(response.text)

            return OptimizedResume(
                resume_text=result_data.get("resume_text", resume_text),
                keywords_integrated=result_data.get("keywords_integrated", missing_keywords)
            )
        else:
            raise ValueError("Failed to generate an optimized resume from the model")

    except Exception as e:
        logger.error(f"Resume optimization failed: {str(e)}", exc_info=True)
        # Return original resume on failure
        return OptimizedResume(
            resume_text=resume_text,
            keywords_integrated=[]
        )


# ---------------------------------------------------------------------------
# New models for metric-enriched bullet rewrites + skills gap
# ---------------------------------------------------------------------------


class ImprovedBullet(BaseModel):
    """A single resume bullet rewritten with a quantifiable metric."""

    original: str = Field(description="The original resume bullet text.")
    improved: str = Field(description="Rewritten bullet with a concrete, quantifiable metric.")
    metric_type: str = Field(
        description="Type of metric added: 'number', 'percentage', 'timeframe', or 'scale'."
    )
    rationale: str = Field(description="Brief explanation of why this metric strengthens the bullet.")


class SkillsGap(BaseModel):
    """Structured skills gap between resume and job description."""

    matched: List[str] = Field(
        default_factory=list,
        description="Skills present in both the resume and the job description.",
    )
    missing: List[str] = Field(
        default_factory=list,
        description="Skills required by the job that are absent from the resume.",
    )
    adjacent: List[str] = Field(
        default_factory=list,
        description="Skills from the resume that are closely related to (but not identical to) required skills.",
    )
    match_score: int = Field(
        default=0,
        description="Percentage of required skills already present in the resume (0-100).",
        ge=0,
        le=100,
    )


class EnhancedResumeResult(BaseModel):
    """Combined output of bullet enhancement + skills gap analysis."""

    improved_bullets: List[ImprovedBullet] = Field(
        default_factory=list,
        description="Bullet points rewritten with quantifiable metrics.",
    )
    skills_gap: SkillsGap = Field(
        default_factory=SkillsGap,
        description="Structured skills gap between resume and job description.",
    )


# ---------------------------------------------------------------------------
# Helper: compute skills gap locally (pure function, no AI call)
# ---------------------------------------------------------------------------

def _compute_skills_gap(
    resume_entities: ResumeEntities,
    job_reqs: JobRequirements,
) -> SkillsGap:
    """Compute skills gap via set operations on extracted entities."""
    resume_skills_lower = {s.lower() for s in resume_entities.skills}
    required_lower = {s.lower(): s for s in job_reqs.requiredSkills}
    preferred_lower = {s.lower(): s for s in job_reqs.preferredSkills}

    all_job_skills_lower = {**required_lower, **preferred_lower}  # de-duped by lower-key

    matched = [
        all_job_skills_lower[k] for k in all_job_skills_lower if k in resume_skills_lower
    ]
    missing = [
        all_job_skills_lower[k] for k in all_job_skills_lower if k not in resume_skills_lower
    ]

    # Adjacent: resume skills whose first word matches a missing-skill first word
    missing_first_words = {m.split()[0].lower() for m in missing if m.split()}
    adjacent = [
        s for s in resume_entities.skills
        if s.split()[0].lower() in missing_first_words and s.lower() not in {m.lower() for m in matched}
    ]

    total_required = len(job_reqs.requiredSkills)
    matched_required_count = sum(
        1 for s in job_reqs.requiredSkills if s.lower() in resume_skills_lower
    )
    match_score = round((matched_required_count / total_required) * 100) if total_required else 0

    return SkillsGap(
        matched=matched,
        missing=missing,
        adjacent=adjacent,
        match_score=match_score,
    )


# ---------------------------------------------------------------------------
# Flow: enhance_resume_with_metrics
# ---------------------------------------------------------------------------


@async_genkit_flow(
    name="enhance_resume_with_metrics",
    output_schema=EnhancedResumeResult,
)
async def enhance_resume_with_metrics(
    resume_text: str,
    job_description: str,
) -> EnhancedResumeResult:
    """
    Two-part enhancement:
    1. Rewrites resume bullets to include quantifiable metrics (Google XYZ formula).
    2. Computes a skills-gap block: matched, missing, adjacent skills + match_score.

    Args:
        resume_text: Raw resume text.
        job_description: Target job description.

    Returns:
        EnhancedResumeResult with improved_bullets and skills_gap.
    """
    import asyncio

    # --- Step 1: Extract structured data from both documents in parallel ---
    try:
        job_reqs_raw, resume_entities_raw = await asyncio.gather(
            asyncio.get_event_loop().run_in_executor(None, extractJobRequirements, job_description),
            asyncio.get_event_loop().run_in_executor(None, extractResumeEntities, resume_text),
        )
        job_reqs: JobRequirements = job_reqs_raw
        resume_entities: ResumeEntities = resume_entities_raw
    except Exception as e:
        logger.warning(f"Entity extraction failed, using fallbacks: {e}")
        job_reqs = JobRequirements(requiredSkills=[], preferredSkills=[], experienceLevel="")
        resume_entities = ResumeEntities(skills=[], experience=[], education=[])

    # --- Step 2: Compute skills gap (pure logic, no AI) ---
    skills_gap = _compute_skills_gap(resume_entities, job_reqs)

    # --- Step 3: Ask Gemini to rewrite bullets with quantifiable metrics ---
    prompt = f"""
You are an expert career coach specialising in impactful resume writing.
Your task is to identify bullet points in the resume below and rewrite them using the **Google XYZ formula**:
  "Accomplished [X] as measured by [Y], by doing [Z]"

For each bullet you rewrite, choose the most appropriate metric type:
  - number      (e.g. "team of 8 engineers")
  - percentage  (e.g. "reduced latency by 35%")
  - timeframe   (e.g. "delivered in 6 weeks")
  - scale       (e.g. "$2M project budget")

**Target Job Description:**
---
{job_description[:2000]}
---

**Resume:**
---
{resume_text[:4000]}
---

**Instructions:**
1. Extract every distinct achievement/responsibility bullet (up to 10).
2. Rewrite each with a plausible, illustrative quantifiable metric. If the original already has a number, preserve it.
3. Do NOT fabricate specific company names or project names not in the resume.
4. Be concise: improved bullets should be ≤ 30 words.
5. For `rationale`, write one sentence explaining why this metric is persuasive.

**Output Format (valid JSON only):**
{{
  "improved_bullets": [
    {{
      "original":    "<original bullet text>",
      "improved":    "<rewritten bullet with metric>",
      "metric_type": "number | percentage | timeframe | scale",
      "rationale":   "<one-sentence rationale>"
    }}
  ]
}}

Return ONLY the JSON object, no markdown fences.
"""

    try:
        model = get_model()
        if not model:
            raise RuntimeError("Genkit model not available")

        response = model.generate(
            prompt=prompt,
            generation_config={
                "temperature": 0.3,
                "response_mime_type": "application/json",
            },
        )

        raw_text: str = response.text if hasattr(response, "text") else ""
        result_data = json.loads(raw_text)
        bullets_data = result_data.get("improved_bullets", [])

        improved_bullets = [
            ImprovedBullet(
                original=b.get("original", ""),
                improved=b.get("improved", b.get("original", "")),
                metric_type=b.get("metric_type", "number"),
                rationale=b.get("rationale", ""),
            )
            for b in bullets_data
            if b.get("original")
        ]

    except Exception as e:
        logger.error(f"Bullet enhancement failed: {e}", exc_info=True)
        improved_bullets = []

    return EnhancedResumeResult(
        improved_bullets=improved_bullets,
        skills_gap=skills_gap,
    )
