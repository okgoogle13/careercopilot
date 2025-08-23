"""
Personal Career Workflow Orchestrator
Optimized for single-user CareerCopilot system
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import asdict

from config.personal_config import get_personal_config, PersonalCareerConfig
from src.backend.agents import *
from src.backend.utils.cache import PersonalCache
from src.backend.utils.firebase_client import FirebaseClient
from src.backend.models.job_models import JobMatch, ApplicationStatus
from src.backend.models.document_models import DocumentResult

logger = logging.getLogger(__name__)

class PersonalCareerWorkflow:
    """
    Single-user workflow orchestrator that coordinates all agents
    for personal job search automation
    """
    
    def __init__(self):
        self.config = get_personal_config()
        self.cache = PersonalCache()
        self.firebase = FirebaseClient()
        
        # Initialize all agents
        self.document_generator = DocumentGenerationAgent()
        self.ats_optimizer = ATSOptimizationAgent()
        self.resume_parser = ResumeParsingAgent()
        self.job_matcher = JobMatchingAgent()
        self.application_tracker = ApplicationTrackingAgent()
        self.email_agent = EmailIntegrationAgent()
        
        # Cache user profile for session
        self.cached_profile = None
        
        logger.info("Personal Career Workflow initialized")
    
    async def initialize_user_profile(self) -> Dict[str, Any]:
        """Load and cache user profile for the session"""
        if self.cached_profile is None:
            profile_data = await self.firebase.get_user_profile(self.config.user_id)
            
            if not profile_data:
                # Create initial profile from config
                profile_data = self._create_initial_profile()
                await self.firebase.save_user_profile(self.config.user_id, profile_data)
            
            self.cached_profile = profile_data
            logger.info("User profile loaded and cached")
        
        return self.cached_profile
    
    def _create_initial_profile(self) -> Dict[str, Any]:
        """Create initial user profile from personal config"""
        return {
            "personal_info": {
                "name": self.config.name,
                "email": self.config.email,
                "location": self.config.location,
                "phone": "",  # User can fill this in later
            },
            "career_transition": {
                "from": self.config.career_transition_from,
                "to": self.config.career_transition_to,
                "motivation": self.config.career_motivation,
                "story": self.config.personal_story
            },
            "experience": [
                {
                    "company": "Previous Finance Role",
                    "position": "Financial Analyst",
                    "start_date": "2020-01-01",
                    "end_date": "2024-12-31", 
                    "description": "Financial analysis, risk assessment, client relationship management",
                    "achievements": [
                        "Managed portfolio of high-value clients",
                        "Improved financial processes and efficiency",
                        "Developed strong analytical and communication skills"
                    ]
                }
            ],
            "skills": self.config.transferable_skills + self.config.developing_skills,
            "education": [
                {
                    "institution": "University",
                    "degree": "Bachelor of Finance",
                    "graduation_year": "2019",
                    "relevant_coursework": []
                }
            ],
            "preferences": {
                "target_roles": self.config.target_roles,
                "locations": self.config.preferred_locations,
                "salary_range": self.config.salary_range,
                "work_types": [wt.value for wt in self.config.work_types]
            }
        }
    
    async def daily_job_discovery(self) -> Dict[str, Any]:
        """
        Morning routine: Find new jobs, generate materials for promising ones,
        and send daily summary email
        """
        logger.info("Starting daily job discovery routine")
        
        # Get user profile
        user_profile = await self.initialize_user_profile()
        
        # Find new job matches
        job_results = await self.job_matcher.find_matches({
            "user_profile": user_profile,
            "matching_criteria": {
                "locations": self.config.preferred_locations,
                "roles": self.config.target_roles,
                "salary_range": self.config.salary_range,
                "experience_level": self.config.experience_level.value,
                "remote_ok": self.config.remote_work_ok
            },
            "job_sources": self.config.job_sources
        })
        
        # Filter for high-quality matches
        promising_jobs = [
            job for job in job_results["matches"] 
            if job["match_score"] > 0.7 and 
            self.config.is_salary_acceptable(job.get("salary_min"), job.get("salary_max"))
        ]
        
        logger.info(f"Found {len(job_results['matches'])} total jobs, {len(promising_jobs)} promising")
        
        # Generate application materials for top 3 promising jobs
        application_materials = []
        for job in promising_jobs[:3]:
            try:
                materials = await self._prepare_application_materials(job, user_profile)
                application_materials.append(materials)
                
                # Save to database for later reference
                await self._save_job_opportunity(job, materials)
                
            except Exception as e:
                logger.error(f"Failed to prepare materials for job {job.get('job_id')}: {e}")
        
        # Generate and send morning summary
        summary = await self._generate_daily_summary(promising_jobs, application_materials)
        
        if self.config.email_notifications:
            await self._send_daily_summary_email(summary, promising_jobs, application_materials)
        
        return {
            "total_jobs_found": len(job_results["matches"]),
            "promising_jobs": len(promising_jobs),
            "materials_prepared": len(application_materials),
            "summary": summary,
            "jobs": promising_jobs
        }
    
    async def _prepare_application_materials(self, job_match: Dict[str, Any], 
                                           user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate tailored application materials for a specific job"""
        
        job_description = job_match.get("description", "")
        
        # Generate resume and cover letter in parallel
        resume_task = self.document_generator.generate({
            "user_profile": user_profile,
            "job_description": job_description,
            "document_type": "resume",
            "template_id": "career_transition_resume"
        })
        
        cover_letter_task = self.document_generator.generate({
            "user_profile": user_profile,
            "job_description": job_description,
            "document_type": "cover_letter", 
            "template_id": "finance_to_social_work_cover_letter"
        })
        
        resume_result, cover_letter_result = await asyncio.gather(
            resume_task, cover_letter_task
        )
        
        # Optimize resume for ATS
        optimized_resume = await self.ats_optimizer.optimize({
            "document_content": resume_result["document_content"],
            "job_description": job_description,
            "optimization_level": "standard"
        })
        
        return {
            "job_id": job_match["job_id"],
            "job_title": job_match["title"],
            "company": job_match["company"],
            "match_score": job_match["match_score"],
            "resume": {
                "content": optimized_resume["optimized_content"],
                "ats_score": optimized_resume["ats_score"],
                "suggestions": optimized_resume["improvements"]
            },
            "cover_letter": {
                "content": cover_letter_result["document_content"],
                "keywords_matched": cover_letter_result["keywords_matched"]
            },
            "missing_skills": job_match.get("missing_skills", []),
            "generated_at": datetime.now().isoformat()
        }
    
    async def quick_company_research(self, job_url: str) -> Dict[str, Any]:
        """Research company from job URL for targeted application"""
        
        # Extract job details and company info
        job_details = await self.job_matcher.extract_job_from_url(job_url)
        
        if not job_details:
            raise ValueError(f"Could not extract job details from URL: {job_url}")
        
        company_name = job_details.get("company", "")
        job_description = job_details.get("description", "")
        
        # Generate company-specific talking points using personal story
        talking_points_prompt = f"""
        Company: {company_name}
        Job Description: {job_description}
        My Background: {self.config.personal_story["background"]}
        Career Transition: {self.config.career_transition_from} to {self.config.career_transition_to}
        
        Generate 5 specific talking points for my application to this organization:
        1. Why I'm interested in THIS specific organization
        2. How my finance background adds unique value to social work
        3. Specific programs or initiatives I could contribute to
        4. How my lived experience as a person of colour aligns with their mission
        5. Thoughtful questions to ask in an interview
        
        Make them specific to this organization and authentic to my career transition story.
        """
        
        talking_points = await self.document_generator.generate_custom_content(talking_points_prompt)
        
        # Generate application strategy
        strategy_prompt = f"""
        Based on this job and company:
        Company: {company_name}
        Job: {job_details.get("title", "")}
        Description: {job_description[:500]}...
        
        My profile: Finance professional transitioning to social work
        
        Provide a strategic approach for my application:
        1. Key messages to emphasize in cover letter
        2. How to position my career transition as a strength
        3. Skills from finance that are most relevant
        4. Cultural competency and diversity aspects to highlight
        5. Potential red flags to watch for in this role
        
        Focus on standing out as a career changer with unique value.
        """
        
        application_strategy = await self.document_generator.generate_custom_content(strategy_prompt)
        
        # Save research for future reference
        research_data = {
            "company": company_name,
            "job_url": job_url,
            "job_details": job_details,
            "talking_points": talking_points,
            "application_strategy": application_strategy,
            "research_date": datetime.now().isoformat()
        }
        
        await self.firebase.save_company_research(self.config.user_id, company_name, research_data)
        
        return research_data
    
    async def apply_to_job(self, job_url: str, custom_message: Optional[str] = None) -> Dict[str, Any]:
        """Complete end-to-end job application process"""
        
        logger.info(f"Starting application process for: {job_url}")
        
        # Research company
        research = await self.quick_company_research(job_url)
        
        # Get user profile
        user_profile = await self.initialize_user_profile()
        
        # Create job match object for material generation
        job_match = {
            "job_id": f"manual_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "title": research["job_details"]["title"],
            "company": research["company"],
            "description": research["job_details"]["description"],
            "url": job_url,
            "match_score": 0.9,  # Manually selected job
        }
        
        # Generate application materials
        materials = await self._prepare_application_materials(job_match, user_profile)
        
        # Track the application
        application_record = {
            "job_url": job_url,
            "company": research["company"],
            "job_title": research["job_details"]["title"],
            "status": ApplicationStatus.MATERIALS_READY.value,
            "materials": materials,
            "research": research,
            "applied_date": datetime.now().isoformat(),
            "custom_notes": custom_message or ""
        }
        
        await self.application_tracker.add_application({
            "user_id": self.config.user_id,
            "application_data": application_record
        })
        
        # Send confirmation email with materials
        if self.config.email_notifications:
            await self._send_application_ready_email(application_record)
        
        logger.info(f"Application materials prepared for {research['company']}")
        
        return {
            "status": "success",
            "job_title": job_match["title"],
            "company": research["company"],
            "materials_generated": True,
            "research_completed": True,
            "application_tracked": True
        }
    
    async def weekly_review(self) -> Dict[str, Any]:
        """Weekly review of all applications and progress"""
        
        logger.info("Starting weekly application review")
        
        # Get all applications from last week
        week_ago = (datetime.now() - timedelta(days=7)).isoformat()
        
        applications = await self.application_tracker.get_applications_since({
            "user_id": self.config.user_id,
            "since_date": week_ago
        })
        
        # Check Gmail for any responses
        email_updates = await self.application_tracker.check_email_updates({
            "user_id": self.config.user_id,
            "gmail_integration": True,
            "applications": applications
        })
        
        # Generate weekly summary
        summary = await self._generate_weekly_summary(applications, email_updates)
        
        # Get skills gap analysis
        skills_analysis = await self._analyze_skills_gaps(applications)
        
        # Send weekly review email
        if self.config.email_notifications:
            await self._send_weekly_review_email(summary, skills_analysis)
        
        return {
            "applications_reviewed": len(applications),
            "email_updates_found": len(email_updates.get("status_updates", [])),
            "summary": summary,
            "skills_analysis": skills_analysis
        }
    
    async def _generate_daily_summary(self, jobs: List[Dict], materials: List[Dict]) -> str:
        """Generate AI-powered daily job summary"""
        
        jobs_text = "\n".join([
            f"• {job['title']} at {job['company']} (Match: {job['match_score']:.1%})"
            for job in jobs[:10]
        ])
        
        materials_text = "\n".join([
            f"• Prepared materials for {mat['job_title']} at {mat['company']}"
            for mat in materials
        ])
        
        prompt = f"""
        Today's job discovery results:
        
        Jobs Found ({len(jobs)} total):
        {jobs_text}
        
        Materials Prepared ({len(materials)} applications):
        {materials_text}
        
        Personal context: Finance professional transitioning to social work in Melbourne
        
        Write a 2-paragraph daily summary that's:
        1. Encouraging and personal
        2. Highlights the most promising opportunities
        3. Notes any trends in today's job market
        4. Motivating for career transition journey
        
        Keep it concise but insightful.
        """
        
        summary = await self.document_generator.generate_custom_content(prompt)
        return summary
    
    async def _send_daily_summary_email(self, summary: str, jobs: List[Dict], 
                                      materials: List[Dict]) -> None:
        """Send daily summary email"""
        
        subject = f"🎯 Daily Career Brief - {len(jobs)} Opportunities Found"
        
        body = f"""
Good morning!

{summary}

📋 TODAY'S OPPORTUNITIES:
{chr(10).join([f"• {job['title']} at {job['company']} - {job.get('location', 'Location TBD')}" for job in jobs[:5]])}

📄 MATERIALS PREPARED:
{chr(10).join([f"• {mat['job_title']} at {mat['company']} (ATS Score: {mat['resume']['ats_score']})" for mat in materials])}

🔗 Next Steps:
1. Review the prepared materials in your dashboard
2. Customize cover letters with specific company details
3. Submit applications through company websites
4. Track responses in your application tracker

Keep pushing forward on your career transition journey! 🚀

Best,
Your CareerCopilot AI
        """
        
        await self.email_agent.send({
            "action": "send",
            "recipient": self.config.email,
            "subject": subject,
            "body": body
        })
    
    async def _send_application_ready_email(self, application: Dict[str, Any]) -> None:
        """Send email when application materials are ready"""
        
        subject = f"📄 Application Ready: {application['job_title']} at {application['company']}"
        
        body = f"""
Your application materials are ready for {application['job_title']} at {application['company']}!

🎯 COMPANY RESEARCH HIGHLIGHTS:
{application['research']['talking_points'][:300]}...

📊 ATS OPTIMIZATION SCORE: {application['materials']['resume']['ats_score']}/100

📋 NEXT STEPS:
1. Review the tailored resume and cover letter
2. Customize the cover letter opening with company-specific details
3. Submit your application through their website
4. Set a follow-up reminder for 1-2 weeks

💡 APPLICATION STRATEGY:
{application['research']['application_strategy'][:200]}...

Good luck with your application! 🍀

View full materials in your dashboard.

Best,
Your CareerCopilot AI
        """
        
        await self.email_agent.send({
            "action": "send",
            "recipient": self.config.email,
            "subject": subject,
            "body": body
        })
    
    async def _save_job_opportunity(self, job: Dict[str, Any], materials: Dict[str, Any]) -> None:
        """Save job opportunity and materials to Firebase"""
        
        job_record = {
            "job_id": job["job_id"],
            "title": job["title"],
            "company": job["company"],
            "url": job.get("url", ""),
            "description": job.get("description", ""),
            "match_score": job["match_score"],
            "salary_min": job.get("salary_min"),
            "salary_max": job.get("salary_max"),
            "location": job.get("location", ""),
            "found_date": datetime.now().isoformat(),
            "materials": materials,
            "status": "discovered"
        }
        
        await self.firebase.save_job_opportunity(self.config.user_id, job_record)
    
    async def _generate_weekly_summary(self, applications: List[Dict], 
                                     email_updates: Dict[str, Any]) -> str:
        """Generate weekly summary with AI"""
        
        apps_text = f"Applications this week: {len(applications)}"
        updates_text = f"Email updates: {len(email_updates.get('status_updates', []))}"
        
        prompt = f"""
        Weekly job search summary:
        {apps_text}
        {updates_text}
        
        Context: Finance to social work career transition
        
        Create an encouraging weekly review that:
        1. Celebrates progress made this week
        2. Notes any response patterns
        3. Provides motivation for next week
        4. Suggests 2-3 focus areas for improvement
        
        Keep it personal and actionable.
        """
        
        return await self.document_generator.generate_custom_content(prompt)
    
    async def _send_weekly_review_email(self, summary: str, skills_analysis: Dict[str, Any]) -> None:
        """Send weekly review email"""
        
        subject = "📊 Weekly Job Search Review & Progress"
        
        body = f"""
Weekly Review - {datetime.now().strftime('%B %d, %Y')}

{summary}

🎯 SKILLS DEVELOPMENT FOCUS:
{skills_analysis.get('recommendations', 'Continue developing core social work competencies.')}

💪 Keep up the momentum on your career transition!

Best,
Your CareerCopilot AI
        """
        
        await self.email_agent.send({
            "action": "send",
            "recipient": self.config.email,
            "subject": subject,
            "body": body
        })
    
    async def _analyze_skills_gaps(self, applications: List[Dict]) -> Dict[str, Any]:
        """Analyze skills gaps from recent applications"""
        
        missing_skills = []
        for app in applications:
            if "materials" in app and "missing_skills" in app["materials"]:
                missing_skills.extend(app["materials"]["missing_skills"])
        
        # Count frequency of missing skills
        from collections import Counter
        skill_gaps = Counter(missing_skills)
        
        top_gaps = skill_gaps.most_common(5)
        
        return {
            "top_skill_gaps": top_gaps,
            "recommendations": f"Focus on developing: {', '.join([skill for skill, _ in top_gaps[:3]])}"
        }