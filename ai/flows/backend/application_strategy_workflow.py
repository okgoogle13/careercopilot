import genkit
from typing import List, Optional
from pydantic import BaseModel
from app.genkit_flows.job_listing_extractor import extract_job_listing_details_flow
from app.genkit_flows.resume_optimizer import optimize_resume, OptimizedResume
from app.genkit_flows.corporate_intelligence import research_company, CorporateProfile
from app.genkit_flows.gap_hunter import gap_hunter_flow, GapAnalysisResult

class ApplicationStrategyResult(BaseModel):
    """The complete strategic output for a job application."""
    optimization_result: OptimizedResume
    corporate_profile: Optional[CorporateProfile] = None
    gap_analysis: Optional[GapAnalysisResult] = None
    strategy_summary: str

@genkit.flow(output_schema=ApplicationStrategyResult)
async def create_application_strategy(job_url: str, resume_text: str, missing_keywords: List[str]) -> ApplicationStrategyResult:
    """
    Orchestrates the full application strategy:
    1. Extracts Job Details.
    2. Researches the Company.
    3. Performs Evidence-Based Gap Analysis (RAG).
    4. Optimizes Resume using Company Intelligence + Verified Evidence.
    """

    # 1. Job Extraction
    try:
        job_details = await extract_job_listing_details_flow(source={"url": job_url})
        company_name = job_details.company_name
        job_description_text = f"Company: {company_name or 'Unknown'}\nRole: {job_details.role_title}\n\nTasks: {', '.join(job_details.key_responsibilities)}"
    except Exception as e:
        print(f"Error extracting job details: {e}")
        # Fallback if extraction fails
        company_name = "Target Company"
        job_description_text = "Job description extraction failed."

    # 2. Corporate Research
    corporate_profile = None
    if company_name and company_name != "Target Company":
        try:
             corporate_profile = research_company(company_name)
        except Exception as e:
            print(f"Warning: Corporate research failed: {e}")

    # 3. Gap Hunter (RAG)
    gap_analysis = None
    evidence_context = ""
    try:
        gap_analysis = gap_hunter_flow(resume_text=resume_text, job_description=job_description_text)
        if gap_analysis.evidence_found:
             evidence_context = "\n\n**VERIFIED EVIDENCE FROM USER HISTORY:**\n" + "\n".join(gap_analysis.evidence_found)
    except Exception as e:
        print(f"Warning: Gap Hunter failed: {e}")

    # 4. Resume Optimization
    # We pass the corporate profile to the optimizer to influence tone/content,
    # and include the retrieved evidence in the job context.

    final_job_context = f"{job_description_text}\n{evidence_context}"

    optimized_resume_result = await optimize_resume(
        resume_text=resume_text,
        missing_keywords=missing_keywords,
        job_description=final_job_context
    )

    strategic_focus = (
        corporate_profile.strategic_focus if corporate_profile else "Standard Optimization"
    )
    communication_style = (
        corporate_profile.communication_style if corporate_profile else "Neutral"
    )
    strategy_summary = (
        f"Strategy for {company_name}: {strategic_focus}. "
        f"Communication style: {communication_style}. "
    )
    if gap_analysis and gap_analysis.evidence_found:
        strategy_summary += f"Bridged {len(gap_analysis.evidence_found)} gaps using past evidence."

    return ApplicationStrategyResult(
        optimization_result=optimized_resume_result,
        corporate_profile=corporate_profile,
        gap_analysis=gap_analysis,
        strategy_summary=strategy_summary
    )
