"""
This module contains the PersonalCareerWorkflow class, which orchestrates
the advanced intelligence features for career management.
"""

import asyncio
import json
from typing import Any, Dict, List

from app.core.ai_client import get_ai_client
from app.core.cache_decorators import cached_ai_operation
from app.core.config import get_personal_config
from app.services.ai_prompt_builder import (
    PromptContext,
    PromptType,
    get_ai_prompt_builder,
)
from app.services.template_service import (
    TemplateContext,
    TemplateType,
    get_template_service,
)
from app.services.web_search import web_search


class PersonalCareerWorkflow:
    """
    Orchestrates advanced intelligence features for personalized career management.
    """

    def __init__(self):
        """Initializes the workflow with personal configuration, AI prompt builder, and template service."""
        self.config = get_personal_config()
        self.ai_client = get_ai_client()
        self.ai_prompt_builder = get_ai_prompt_builder()
        self.template_service = get_template_service()
        self.cached_profile = None  # Placeholder for profile data

    @cached_ai_operation("salary_intelligence")
    async def salary_intelligence(
        self, job_title: str, company: str, location: str
    ) -> Dict[str, Any]:
        """
        Researches salary, generates negotiation points for a specific role.

        Args:
            job_title: The title of the job.
            company: The name of the company.
            location: The location of the job.

        Returns:
            A dictionary with salary range, negotiation tips, and market comparison.
        """
        # 1. Web search for salary data
        search_queries = [
            f"salary for {job_title} at {company} in {location}",
            f"average {job_title} salary in {location} Australia",
            f"Social Work award rates Australia {job_title}",
        ]
        search_results = await asyncio.gather(*[web_search(q) for q in search_queries])

        # 2. Check for government pay scales (if applicable)
        govt_pay_scale_info = "No specific government pay scale found in initial search."
        if "social work" in job_title.lower():
            # Simplified check
            govt_search = await web_search(
                "Fair Work Ombudsman Social and Community Services Award rates"
            )
            if govt_search:
                govt_pay_scale_info = (
                    f"Potential government award rates may apply. See: {govt_search[0]['url']}"
                )

        # 3. Generate negotiation strategy with AI
        prompt = f"""
        Based on the following web search results and government pay scale information,
        generate a salary negotiation strategy for a '{job_title}' role at '{company}' in '{location}'.

        Web Search Results:
        {search_results}

        Government Pay Scale Info:
        {govt_pay_scale_info}

        Provide a realistic salary range, 3-5 specific negotiation talking points highlighting
        strengths from a finance background transitioning into social work, and a market comparison summary.
        Format the output as a JSON object with keys: 'salary_range', 'negotiation_tips', 'market_comparison'.
        """

        # Use unified AI prompt builder with proper context
        context = PromptContext(
            job_context={"title": job_title, "company": company, "location": location},
            custom_data={
                "search_results": search_results,
                "govt_pay_scale": govt_pay_scale_info,
            },
        )

        ai_response_str = await self.ai_prompt_builder.generate_ai_response(
            PromptType.SALARY_ANALYSIS, prompt, context
        )
        return json.loads(ai_response_str)

    @cached_ai_operation("skills_trends")
    async def analyze_skills_trends(self, job_listings: List[Dict]) -> Dict[str, Any]:
        """
        Analyzes skill trends from job listings and creates a development plan.

        Args:
            job_listings: A list of job listing dictionaries, each with a 'description'.

        Returns:
            A dictionary with top skills, trending skills, and a development plan.
        """
        descriptions = [job.get("description", "") for job in job_listings]

        prompt = f"""
        Analyze the following {len(descriptions)} job descriptions for the '{self.config.career_transition_to}' field.

        Job Descriptions:
        {descriptions}

        Identify the top 10 most frequently required skills and 3-5 emerging or trending skills.
        Based on these trends, create a 6-month professional development roadmap for someone
        transitioning from finance. The roadmap should include specific courses, certifications,
        or experiences.
        Format the output as a JSON object with keys: 'top_skills', 'trending_skills', 'development_plan'.
        """

        # Use unified AI prompt builder with skills analysis context
        context = PromptContext(
            custom_data={
                "job_descriptions": descriptions,
                "analysis_type": "skills_trends",
                "description_count": len(descriptions),
            }
        )

        ai_response_str = await self.ai_prompt_builder.generate_ai_response(
            PromptType.SKILLS_ANALYSIS, prompt, context
        )
        return json.loads(ai_response_str)

    @cached_ai_operation("interview_prep")
    async def generate_interview_prep(
        self, job_description: str, company_research: Dict
    ) -> Dict[str, Any]:
        """
        Generates interview preparation materials for a specific job.

        Args:
            job_description: The full text of the job description.
            company_research: A dictionary of research about the company.

        Returns:
            A dictionary with interview questions, suggested answers, and candidate questions.
        """
        prompt = f"""
        Generate interview preparation materials for a role based on the provided job description
        and company research. The candidate is transitioning from Finance to Social Work.

        Job Description:
        {job_description}

        Company Research:
        {company_research}

        Create the following:
        1. 5-7 company-specific behavioral interview questions.
        2. For each question, provide a STAR method answer suggestion that highlights transferable
           skills from finance (e.g., budgeting, risk assessment, stakeholder management).
        3. A list of 3-4 thoughtful questions the candidate should ask the interviewer.

        Format the output as a JSON object with keys: 'questions', 'suggested_answers', 'candidate_questions'.
        """

        # Use unified AI prompt builder with interview context
        context = PromptContext(
            job_context={"description": job_description},
            company_context=company_research,
            custom_data={"prep_type": "behavioral_interview"},
        )

        ai_response_str = await self.ai_prompt_builder.generate_ai_response(
            PromptType.INTERVIEW_PREP, prompt, context
        )
        return json.loads(ai_response_str)

    async def daily_job_discovery(self) -> Dict[str, Any]:
        """
        Daily job discovery routine - simplified version without agent orchestration
        """
        try:
            # Mock job discovery for development
            # In production, this would integrate with job search APIs
            mock_jobs = [
                {
                    "job_id": "job_001",
                    "title": "Social Worker",
                    "company": "Community Health Service",
                    "description": "Seeking experienced social worker for case management role",
                    "match_score": 0.85,
                    "salary_min": 65000,
                    "salary_max": 80000,
                    "location": self.config.location,
                    "url": "https://example.com/job1",
                },
                {
                    "job_id": "job_002",
                    "title": "Case Manager",
                    "company": "Family Services Victoria",
                    "description": "Case management position supporting vulnerable families",
                    "match_score": 0.78,
                    "salary_min": 62000,
                    "salary_max": 75000,
                    "location": "Brunswick, VIC",
                    "url": "https://example.com/job2",
                },
            ]

            # Filter promising matches (>0.7 score and acceptable salary)
            promising_jobs = [
                job
                for job in mock_jobs
                if job.get("match_score", 0) > 0.7
                and job.get("salary_min", 0) >= self.config.salary_range["min"]
            ]

            return {
                "success": True,
                "total_jobs_found": len(mock_jobs),
                "promising_jobs": len(promising_jobs),
                "jobs": promising_jobs,
                "materials_prepared": min(3, len(promising_jobs)),  # Top 3
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def apply_to_job(self, job_url: str) -> Dict[str, Any]:
        """
        Complete application process for a specific job with template generation
        """
        try:
            # 1. Company research
            company_research = await self.quick_company_research(job_url)

            if not company_research.get("success"):
                return {"success": False, "error": "Company research failed"}

            # 2. Extract job details
            job_details = company_research.get("job_details", {})
            job_title = job_details.get("title", "Unknown Role")
            company_name = job_details.get("company", "Unknown Company")
            job_description = job_details.get("description", "")

            # 3. Generate complete application materials package
            application_materials = await self.template_service.generate_application_materials(
                job_title=job_title,
                company_name=company_name,
                job_description=job_description,
                company_research=company_research.get("talking_points"),
            )

            # 4. Generate interview prep materials
            interview_materials = await self.generate_interview_prep(
                job_description, company_research.get("talking_points", {})
            )

            return {
                "success": True,
                "job_title": job_title,
                "company": company_name,
                "job_url": job_url,
                # Generated application materials
                "application_materials": {
                    "email_application": {
                        "subject": getattr(
                            application_materials.get("email_application"),
                            "subject_line",
                            None,
                        ),
                        "content": getattr(
                            application_materials.get("email_application"),
                            "content",
                            "",
                        ),
                        "placeholders": getattr(
                            application_materials.get("email_application"),
                            "placeholders",
                            {},
                        ),
                    },
                    "cover_letter": {
                        "content": getattr(
                            application_materials.get("cover_letter"), "content", ""
                        ),
                        "placeholders": getattr(
                            application_materials.get("cover_letter"),
                            "placeholders",
                            {},
                        ),
                    },
                    "follow_up_email": {
                        "subject": getattr(
                            application_materials.get("follow_up_email"),
                            "subject_line",
                            None,
                        ),
                        "content": getattr(
                            application_materials.get("follow_up_email"), "content", ""
                        ),
                        "placeholders": getattr(
                            application_materials.get("follow_up_email"),
                            "placeholders",
                            {},
                        ),
                    },
                    "interview_thank_you": {
                        "subject": getattr(
                            application_materials.get("interview_thank_you"),
                            "subject_line",
                            None,
                        ),
                        "content": getattr(
                            application_materials.get("interview_thank_you"),
                            "content",
                            "",
                        ),
                        "placeholders": getattr(
                            application_materials.get("interview_thank_you"),
                            "placeholders",
                            {},
                        ),
                    },
                },
                # Interview preparation
                "interview_prep": interview_materials,
                # Company research
                "company_research": company_research.get("talking_points", ""),
                # Status flags
                "materials_generated": len(application_materials) > 0,
                "research_completed": True,
                "interview_prep_completed": interview_materials.get("success", False),
                "application_tracked": True,
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def quick_company_research(self, job_url: str) -> Dict[str, Any]:
        """
        Generate company research and application strategy - simplified without agents
        """
        try:
            # Extract company from URL (simplified)
            company_name = (
                job_url.split("//")[-1].split("/")[0].replace(".com", "").replace("www.", "")
            )

            # Mock job details extraction
            job_details = {
                "title": "Community Services Worker",
                "company": (
                    company_name.title() if company_name != "example" else "Community Care Services"
                ),
                "description": "Community services role focusing on client support and case management",
                "salary": "65000-80000 AUD",
                "location": self.config.location,
            }

            # Generate talking points using AI
            talking_points_prompt = f"""
            Generate 5 specific talking points for applying to {job_details['company']} for a {job_details['title']} role.
            Focus on transitioning from {self.config.career_transition_from} to {self.config.career_transition_to}.
            Include: motivation, transferable skills, value proposition, questions to ask.
            """

            # Use unified AI prompt builder for company research
            company_context = PromptContext(
                job_context=job_details,
                company_context={"name": job_details["company"]},
                custom_data={"research_type": "application_strategy"},
            )

            talking_points = await self.ai_prompt_builder.generate_ai_response(
                PromptType.COMPANY_RESEARCH, talking_points_prompt, company_context
            )

            # Generate application strategy
            strategy_prompt = f"""
            Create an application strategy for someone transitioning from finance to social work.
            Job: {job_details['title']} at {job_details['company']}
            Include: key cover letter messages, how to position career change as strength, concerns to address.
            """

            application_strategy = await self.ai_prompt_builder.generate_ai_response(
                PromptType.COMPANY_RESEARCH, strategy_prompt, company_context
            )

            return {
                "success": True,
                "job_details": job_details,
                "talking_points": talking_points,
                "application_strategy": application_strategy,
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def weekly_review(self) -> Dict[str, Any]:
        """
        Weekly review of applications and progress - simplified without agents
        """
        try:
            # Mock progress data
            mock_applications = 3  # Applications this week
            mock_responses = 1  # Email responses received

            # Generate AI-powered progress analysis
            analysis_prompt = f"""
            Generate a weekly progress review for someone who:
            - Applied to {mock_applications} jobs this week
            - Received {mock_responses} responses
            - Is transitioning from {self.config.career_transition_from} to {self.config.career_transition_to}
            - Target roles: {', '.join(self.config.target_roles)}

            Provide encouraging summary with 3 focus areas for next week.
            """

            # Use unified AI prompt builder for weekly review
            review_context = PromptContext(
                custom_data={
                    "applications_count": mock_applications,
                    "responses_count": mock_responses,
                    "review_type": "weekly_progress",
                }
            )

            summary = await self.ai_prompt_builder.generate_ai_response(
                PromptType.WEEKLY_REVIEW, analysis_prompt, review_context
            )

            return {
                "success": True,
                "applications_reviewed": mock_applications,
                "email_updates_found": mock_responses,
                "analysis": {
                    "summary": summary,
                    "applications_count": mock_applications,
                    "responses_count": mock_responses,
                    "recommendations": [
                        "Continue targeting social work roles in community services",
                        "Highlight finance transferable skills in applications",
                        "Follow up on pending applications from last week",
                        "Consider networking opportunities in social work field",
                    ],
                },
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def generate_email_template(
        self,
        template_type: str,
        job_title: str = None,
        company_name: str = None,
        contact_name: str = None,
    ) -> Dict[str, Any]:
        """
        Generate specific email template for job applications

        Args:
            template_type: Type of email (application, follow_up, networking, thank_you, reference)
            job_title: Job title if applicable
            company_name: Company name if applicable
            contact_name: Contact person name if applicable

        Returns:
            Generated email template with subject, content, and placeholders
        """
        try:
            # Map string types to enum values
            template_map = {
                "application": TemplateType.EMAIL_APPLICATION,
                "follow_up": TemplateType.FOLLOW_UP_EMAIL,
                "networking": TemplateType.NETWORKING_EMAIL,
                "thank_you": TemplateType.INTERVIEW_THANK_YOU,
                "reference": TemplateType.REFERENCE_REQUEST,
            }

            template_enum = template_map.get(template_type.lower())
            if not template_enum:
                return {
                    "success": False,
                    "error": f"Unknown template type: {template_type}",
                }

            # Create context
            context = TemplateContext(
                company_name=company_name,
                job_title=job_title,
                contact_name=contact_name,
            )

            # Generate template
            template = await self.template_service.generate_template(template_enum, context)

            return {
                "success": True,
                "template_type": template_type,
                "subject_line": template.subject_line,
                "content": template.content,
                "placeholders": template.placeholders,
                "customization_tips": template.customization_tips,
                "generated_at": template.generated_at,
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    async def generate_cover_letter_template(
        self, job_title: str = None, company_name: str = None
    ) -> Dict[str, Any]:
        """
        Generate cover letter template with career transition context

        Returns:
            Generated cover letter template with placeholders and tips
        """
        try:
            context = TemplateContext(company_name=company_name, job_title=job_title)

            template = await self.template_service.generate_template(
                TemplateType.COVER_LETTER, context
            )

            return {
                "success": True,
                "template_type": "cover_letter",
                "content": template.content,
                "placeholders": template.placeholders,
                "customization_tips": template.customization_tips,
                "generated_at": template.generated_at,
            }

        except Exception as e:
            return {"success": False, "error": str(e)}
