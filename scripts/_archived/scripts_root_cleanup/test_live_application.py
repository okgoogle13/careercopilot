#!/usr/bin/env python3
"""
Test script for evaluating a live job opportunity against the Career Copilot AI flows.

Usage:
  python3 scripts/test_live_application.py --job-description "path/to/job_description.txt" --resume-path "user_profile/resume.md"
"""

import argparse
import asyncio
import json
import logging
import sys
from pathlib import Path

# Add the backend path to sys.path so we can import from app
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from app.ai.document_analysis_service import DocumentAnalysisService
from app.agents.ghostwriter import GhostwriterAgent, RESUME_PATH
from app.core.config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

async def run_live_test(job_description_text: str, resume_text: str):
    logger.info("Initializing AI services...")
    doc_service = DocumentAnalysisService()
    ghostwriter = GhostwriterAgent()
    
    # Temporarily override Ghostwriter's resume loading if needed
    # Ghostwriter normally reads from `user_profile/resume.md`. We can mock it for this test.
    async def mock_load_resume():
        return resume_text
    ghostwriter.load_resume = mock_load_resume

    logger.info("\n" + "="*50)
    logger.info("1. ANALYZING RESUME")
    logger.info("="*50)
    resume_analysis = await doc_service.analyze_resume(resume_text)
    logger.info(f"Summary: {resume_analysis.summary}")
    logger.info(f"Extracted Skills: {', '.join(resume_analysis.skills[:15])}...")

    logger.info("\n" + "="*50)
    logger.info("2. ANALYZING JOB DESCRIPTION")
    logger.info("="*50)
    job_analysis = await doc_service.analyze_job_description(job_description_text)
    logger.info(f"Job Title & Company: {job_analysis.title} at {job_analysis.company}")
    logger.info(f"Required Skills: {', '.join(job_analysis.required_skills)}")

    # Calculate match conceptually
    resume_skills_lower = {s.lower() for s in resume_analysis.skills}
    job_skills_lower = {s.lower() for s in job_analysis.required_skills}
    matched_skills = resume_skills_lower.intersection(job_skills_lower)
    missing_skills = job_skills_lower - resume_skills_lower
    
    logger.info("\n" + "="*50)
    logger.info("3. SKILL MATCH ANALYSIS")
    logger.info("="*50)
    logger.info(f"Matched Skills: {', '.join(matched_skills) if matched_skills else 'None'}")
    logger.info(f"Missing Skills: {', '.join(missing_skills) if missing_skills else 'None'}")

    logger.info("\n" + "="*50)
    logger.info("4. GENERATING COVER LETTER")
    logger.info("="*50)
    
    job_data_for_ghostwriter = {
        "title": job_analysis.title,
        "company": job_analysis.company,
        "description": job_description_text,
        "salary": "Not specified",
        "deadline": "Not specified"
    }
    
    cover_letter = await ghostwriter.generate_cover_letter(job_data_for_ghostwriter)
    
    print("\n\n" + "*"*80)
    print("FINAL GENERATED COVER LETTER")
    print("*"*80)
    print(cover_letter)
    print("*"*80 + "\n")
    

def main():
    parser = argparse.ArgumentParser(description="Run Career Copilot AI flows on a live job.")
    parser.add_argument("--job-description", required=True, help="Path to a text file containing the job description")
    parser.add_argument("--resume-path", default="user_profile/resume.md", help="Path to your resume markdown or text file")
    
    args = parser.parse_args()
    
    job_desc_path = Path(args.job_description)
    resume_path = Path(args.resume_path)
    
    if not job_desc_path.exists():
        logger.error(f"Job description file not found: {job_desc_path}")
        sys.exit(1)
        
    if not resume_path.exists():
        logger.error(f"Resume file not found: {resume_path}")
        logger.info(f"Please place your resume at {resume_path} or specify --resume-path")
        sys.exit(1)
        
    job_text = job_desc_path.read_text(encoding="utf-8")
    resume_text = resume_path.read_text(encoding="utf-8")
    
    asyncio.run(run_live_test(job_text, resume_text))

if __name__ == "__main__":
    main()
