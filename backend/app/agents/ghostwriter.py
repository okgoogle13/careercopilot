"""
backend/app/agents/ghostwriter.py
----------------------------------
AI Agent for generating tailored cover letters based on job details and user resume.
"""

import logging
from pathlib import Path

from app.services.flash_sidekick_service import FlashSidekickService

logger = logging.getLogger(__name__)

# Define path to user resume
RESUME_PATH = Path("user_profile/resume.md")


class GhostwriterAgent:
    """
    Autonomous agent for generating personalized cover letters.
    Combines job details with user resume to create compelling application materials.
    """

    def __init__(self):
        self.ai_service = FlashSidekickService()
        logger.info("[Ghostwriter] Agent initialized")

    async def load_resume(self) -> str:
        """
        Loads the user's resume from the user_profile directory.

        Returns:
            str: Resume content or placeholder message if not found
        """
        if not RESUME_PATH.exists():
            logger.warning(f"[Ghostwriter] Resume not found at {RESUME_PATH}")
            return "Candidate Resume: [No resume found in user_profile/resume.md]. Please add your resume to generate personalized cover letters."

        try:
            resume_content = RESUME_PATH.read_text(encoding="utf-8")
            logger.info(f"[Ghostwriter] Resume loaded: {len(resume_content)} characters")
            return resume_content
        except Exception as e:
            logger.error(f"[Ghostwriter] Error reading resume: {e}")
            return f"Error loading resume: {e!s}"

    async def generate_cover_letter(self, job_data: dict) -> str:
        """
        Generates a compelling, professional cover letter using AI.

        Args:
            job_data: Dictionary containing job details (title, company, description, etc.)

        Returns:
            str: Generated cover letter text
        """
        # Load the user's resume
        resume_content = await self.load_resume()

        # Extract job details
        job_title = job_data.get("title", "the position")
        company = job_data.get("company", "your organization")
        job_description = job_data.get("description", job_data.get("url", "See job posting"))
        salary = job_data.get("salary", "Not specified")
        deadline = job_data.get("deadline", "Not specified")

        # Construct the AI prompt
        prompt = f"""
ROLE: Expert Career Coach & Professional Copywriter specializing in application materials.

TASK: Write a compelling, professional cover letter that will help the candidate stand out.

JOB DETAILS:
• Role: {job_title}
• Company: {company}
• Salary Range: {salary}
• Application Deadline: {deadline}
• Key Requirements/Description: {job_description[:2000]}

CANDIDATE RESUME:
{resume_content[:3000]}

INSTRUCTIONS:
1. Keep the letter under 350 words (approximately 3-4 paragraphs)
2. Use a professional but enthusiastic and authentic tone
3. Highlight matching skills and experiences from the resume
4. Address specific requirements mentioned in the job description
5. Include a strong opening that captures attention
6. Demonstrate genuine interest in the company and role
7. End with a confident call to action
8. Use Australian English spelling and conventions
9. Format with proper paragraph spacing

OUTPUT FORMAT:
Return the complete cover letter text, ready to paste into an application.
Do NOT include placeholders like [Insert Date] or [Your Name] - use the actual information from the resume.
Start directly with "Dear Hiring Manager," or similar greeting.
"""

        logger.info(f"[Ghostwriter] Drafting cover letter for {company} - {job_title}")

        try:
            # Use Flash Sidekick's AI generation (Pro model for better quality)
            # Note: For production, you may want to use the consult_pro method for higher quality
            cover_letter = await self.ai_service.quick_summarize(prompt)

            # Clean up any markdown formatting if present
            if "```" in cover_letter:
                # Extract content between code blocks if the AI wrapped it
                parts = cover_letter.split("```")
                for part in parts:
                    cleaned_part = part.strip()
                    if not cleaned_part:
                        continue
                    if cleaned_part.startswith("markdown"):
                        cleaned_part = cleaned_part.removeprefix("markdown").strip()
                    elif cleaned_part.startswith("text"):
                        cleaned_part = cleaned_part.removeprefix("text").strip()
                    if cleaned_part:
                        cover_letter = cleaned_part
                        break

            logger.info(f"[Ghostwriter] ✓ Cover letter generated: {len(cover_letter)} characters")
            return cover_letter

        except Exception as e:
            logger.error(f"[Ghostwriter] Error generating cover letter: {e}")

            # Fallback to a template-based approach if AI fails
            fallback_letter = f"""Dear Hiring Manager at {company},

I am writing to express my strong interest in the {job_title} position. With my background and skills as outlined in my resume, I believe I would be a valuable addition to your team.

My experience aligns well with the requirements of this role, and I am particularly excited about the opportunity to contribute to {company}. I am confident that my skills and passion make me an excellent fit for this position.

I would welcome the opportunity to discuss how my background and qualifications would benefit your team. Thank you for your consideration, and I look forward to hearing from you.

Sincerely,
[Your Name from Resume]

---
Note: AI generation failed. This is a fallback template. Please customize before sending.
Error: {e!s}
"""
            return fallback_letter


if __name__ == "__main__":
    # Smoke test the agent
    import asyncio

    async def test_ghostwriter():
        agent = GhostwriterAgent()

        # Test resume loading
        resume = await agent.load_resume()
        print(f"Resume loaded: {len(resume)} characters")

        # Test cover letter generation
        test_job = {
            "title": "Senior Python Developer",
            "company": "Tech Innovations Pty Ltd",
            "description": "We are seeking an experienced Python developer...",
            "salary": "$120k - $150k + Super",
            "deadline": "January 15, 2026",
        }

        cover_letter = await agent.generate_cover_letter(test_job)
        print("\n" + "=" * 50)
        print("GENERATED COVER LETTER:")
        print("=" * 50)
        print(cover_letter)
        print("=" * 50)

    asyncio.run(test_ghostwriter())
