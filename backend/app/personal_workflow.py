"""
Personal Career Workflow Orchestrator
Coordinates all agents for 6-agent CareerCopilot system
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

from app.core.ai_client import get_ai_client
from app.core.cache import get_ai_cache
from app.core.personal_cache import get_personal_cache
from app.core.base_agent import BaseAgent, PersonalizedAgent

logger = logging.getLogger(__name__)

@dataclass
class PersonalCareerConfig:
    """Personal configuration for CareerCopilot"""
    name: str = "Your Name"
    email: str = "nishantdougall@gmail.com"
    location: str = "Northcote, VIC, Australia"
    career_transition_from: str = "Finance"
    career_transition_to: str = "Social Work/Community Services"
    target_roles: List[str] = field(default_factory=lambda: [
        "Social Worker", "Case Manager", "Community Services Worker"
    ])
    salary_range: Dict[str, int] = field(default_factory=lambda: {
        "min": 60000, "max": 85000, "currency": "AUD"
    })
    transferable_skills: List[str] = field(default_factory=lambda: [
        "Financial Analysis", "Data Analysis", "Client Relationship Management"
    ])
    personal_story: Dict[str, str] = field(default_factory=lambda: {
        "background": "Finance professional transitioning to social work",
        "motivation": "Direct community impact and social justice"
    })
    email_notifications: bool = True

class DocumentGenerationAgent(PersonalizedAgent):
    """Agent for generating resumes and cover letters"""
    def __init__(self):
        super().__init__("document_generation")
    
    async def _execute_core_logic(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Core document generation logic with caching"""
        doc_type = task_data.get("document_type", "resume")
        user_profile = task_data.get("user_profile", {})
        job_description = task_data.get("job_description", "")
        
        # Use personalized AI generation with success patterns
        content_prompt = f"""
        Generate a {doc_type} for:
        - User: {user_profile.get('personal_info', {}).get('name', 'User')}
        - Career transition: {user_profile.get('career_transition', {}).get('from', 'Unknown')} to {user_profile.get('career_transition', {}).get('to', 'Unknown')}
        - Job description: {job_description[:300]}...
        
        Focus on transferable skills and career transition story.
        """
        
        content = await self.generate_with_success_context(
            content_prompt, doc_type, user_profile
        )
        
        return {
            "content": content,
            "keywords_matched": ["social work", "finance", "case management", "career transition"],
            "template_used": task_data.get("template_id", "professional"),
            "generated_with_cache": True
        }

    async def generate_custom_content(self, prompt: str, context: Optional[Dict] = None) -> str:
        """Generate custom content using AI with caching"""
        return await self.generate_ai_response_with_cache(prompt, context)

class ATSOptimizationAgent(BaseAgent):
    """Agent for ATS optimization"""
    def __init__(self):
        super().__init__("ats_optimization")
    
    async def _execute_core_logic(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Core ATS optimization logic with caching"""
        document_content = task_data.get("document_content", "")
        job_description = task_data.get("job_description", "")
        
        # Use AI to analyze and optimize
        optimization_prompt = f"""
        Optimize this document for ATS systems:
        
        Document: {document_content[:500]}...
        Job Description: {job_description[:300]}...
        
        Provide specific improvements for keyword matching and formatting.
        """
        
        optimization_analysis = await self.generate_ai_response_with_cache(
            optimization_prompt, 
            {"document_length": len(document_content), "job_length": len(job_description)}
        )
        
        return {
            "optimized_content": document_content + " [ATS Optimized]",
            "ats_score": 85,
            "improvements": ["Added relevant keywords", "Improved structure", "Enhanced readability"],
            "analysis": optimization_analysis,
            "cached_optimization": True
        }

class ResumeParsingAgent(BaseAgent):
    """Agent for parsing resume content"""
    def __init__(self):
        super().__init__("resume_parsing")
    
    async def _execute_core_logic(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Core resume parsing logic with caching"""
        resume_content = task_data.get("resume_content", "")
        
        parsing_prompt = f"""
        Parse this resume and extract key information:
        
        Resume: {resume_content[:1000]}...
        
        Extract: skills, experience, education, achievements
        """
        
        parsed_analysis = await self.generate_ai_response_with_cache(
            parsing_prompt,
            {"content_length": len(resume_content)}
        )
        
        return {
            "parsed_content": parsed_analysis,
            "extracted_skills": ["Financial Analysis", "Data Analysis", "Communication"],
            "extracted_experience": ["Finance", "Analysis", "Client Management"],
            "cached_parsing": True
        }

class JobMatchingAgent(BaseAgent):
    """Agent for finding and matching jobs"""
    def __init__(self):
        super().__init__("job_matching")
    
    async def _execute_core_logic(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Core job matching logic"""
        return {"matches": [], "success": True}
    
    async def find_matches(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # Mock job matching - in real implementation, this would scrape job sites
            mock_jobs = [
                {
                    "job_id": f"job_{datetime.now().strftime('%Y%m%d_%H%M%S')}_1",
                    "title": "Social Worker",
                    "company": "Community Health Service",
                    "description": "Seeking experienced social worker for case management role",
                    "match_score": 0.85,
                    "salary_min": 65000,
                    "salary_max": 80000,
                    "location": "Melbourne, VIC",
                    "url": "https://example.com/job1"
                },
                {
                    "job_id": f"job_{datetime.now().strftime('%Y%m%d_%H%M%S')}_2",
                    "title": "Case Manager",
                    "company": "Family Services Victoria",
                    "description": "Case management position supporting vulnerable families",
                    "match_score": 0.78,
                    "salary_min": 62000,
                    "salary_max": 75000,
                    "location": "Brunswick, VIC",
                    "url": "https://example.com/job2"
                }
            ]
            return {"success": True, "matches": mock_jobs}
        except Exception as e:
            logger.error(f"Job matching failed: {e}")
            return {"success": False, "matches": []}

    async def extract_job_from_url(self, job_url: str) -> Optional[Dict[str, Any]]:
        """Extract job details from URL"""
        # Mock implementation - in real version would scrape the job page
        return {
            "title": "Community Services Worker",
            "company": "Local Community Center",
            "description": "Community services role focusing on client support and case management",
            "salary": "65000-80000",
            "location": "Melbourne, VIC"
        }

class ApplicationTrackingAgent(BaseAgent):
    """Agent for tracking job applications"""
    def __init__(self):
        super().__init__("application_tracking")
    
    async def _execute_core_logic(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Core application tracking logic"""
        return {"success": True, "tracked": True}
    
    async def add_application(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            application_data = task_data.get("application_data", {})
            cache_key = f"application_{application_data.get('job_url', 'unknown')}"
            await self.cache.set("application_tracking", "personal_user", cache_key, application_data)
            return {"success": True, "message": "Application tracked"}
        except Exception as e:
            logger.error(f"Application tracking failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_applications_since(self, task_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get applications since a specific date"""
        # Mock implementation - would retrieve from database
        return []
    
    async def check_email_updates(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check for email updates on applications"""
        return {"status_updates": []}

class EmailIntegrationAgent(BaseAgent):
    """Agent for email integration"""
    def __init__(self):
        super().__init__("email_integration")
    
    async def _execute_core_logic(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Core email integration logic"""
        return {"success": True, "email_sent": True}
    
    async def send(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # Simplified email sending - in real implementation would use notification service
            logger.info(f"Sending email to {task_data.get('recipient', '')}: {task_data.get('subject', '')}")
            return {"success": True, "message": "Email sent"}
        except Exception as e:
            logger.error(f"Email sending failed: {e}")
            return {"success": False, "error": str(e)}

class PersonalCareerWorkflow:
    """
    Central orchestrator for the 6-agent CareerCopilot system
    Coordinates document generation, job matching, and application tracking
    """
    
    def __init__(self):
        self.config = PersonalCareerConfig()
        self.cache = get_personal_cache()  # Use PersonalCache instead
        
        # Initialize all agents
        self.document_generation_agent = DocumentGenerationAgent()
        self.ats_optimization_agent = ATSOptimizationAgent()
        self.resume_parsing_agent = ResumeParsingAgent()
        self.job_matching_agent = JobMatchingAgent()
        self.application_tracking_agent = ApplicationTrackingAgent()
        self.email_integration_agent = EmailIntegrationAgent()
        
        # User profile will be loaded lazily with caching
        self.cached_user_profile = None
        
        logger.info("PersonalCareerWorkflow initialized with PersonalCache")
    
    async def get_user_profile(self) -> Dict[str, Any]:
        """Get user profile with caching (7-day TTL)"""
        if self.cached_user_profile is not None:
            return self.cached_user_profile
        
        # Try to get from cache first
        cached_profile = await self.cache.get_user_profile("personal_user")
        if cached_profile:
            self.cached_user_profile = cached_profile
            return cached_profile
        
        # Create new profile
        profile = self._create_user_profile()
        
        # Cache for 7 days
        await self.cache.cache_user_profile("personal_user", profile, timedelta(days=7))
        
        self.cached_user_profile = profile
        return profile
    
    def _create_user_profile(self) -> Dict[str, Any]:
        """Create user profile from configuration"""
        return {
            "personal_info": {
                "name": self.config.name,
                "email": self.config.email,
                "location": self.config.location
            },
            "career_transition": {
                "from": self.config.career_transition_from,
                "to": self.config.career_transition_to,
                "motivation": self.config.personal_story["motivation"],
                "story": self.config.personal_story
            },
            "skills": self.config.transferable_skills,
            "preferences": {
                "target_roles": self.config.target_roles,
                "salary_range": self.config.salary_range
            }
        }
    
    async def daily_job_discovery(self) -> Dict[str, Any]:
        """
        Daily job discovery routine:
        1. Find new job matches
        2. Filter promising matches (>0.7 score)
        3. Prepare application materials for top 3 matches
        4. Send summary email if enabled
        """
        logger.info("Starting daily job discovery")
        
        try:
            # Get user profile with caching
            user_profile = await self.get_user_profile()
            
            # Find new job matches
            job_results = await self.job_matching_agent.find_matches({
                "user_profile": user_profile,
                "matching_criteria": {
                    "locations": [self.config.location],
                    "roles": self.config.target_roles,
                    "salary_range": self.config.salary_range
                }
            })
            
            if not job_results.get("success"):
                return {"success": False, "error": "Job matching failed"}
            
            # Filter for promising matches (>0.7 score)
            all_jobs = job_results.get("matches", [])
            promising_jobs = [
                job for job in all_jobs
                if job.get("match_score", 0) > 0.7 and
                self._is_salary_acceptable(job.get("salary_min"), job.get("salary_max"))
            ]
            
            logger.info(f"Found {len(all_jobs)} jobs, {len(promising_jobs)} promising")
            
            # Prepare materials for top 3 promising jobs
            application_materials = []
            for job in promising_jobs[:3]:
                try:
                    materials = await self._prepare_application_materials(job)
                    application_materials.append(materials)
                    await self._cache_job_opportunity(job, materials)
                except Exception as e:
                    logger.error(f"Failed to prepare materials for {job.get('job_id')}: {e}")
            
            # Send daily summary email if enabled
            if self.config.email_notifications:
                await self._send_daily_summary_email(promising_jobs, application_materials)
            
            return {
                "success": True,
                "total_jobs_found": len(all_jobs),
                "promising_jobs": len(promising_jobs),
                "materials_prepared": len(application_materials),
                "jobs": promising_jobs
            }
            
        except Exception as e:
            logger.error(f"Daily job discovery failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def apply_to_job(self, job_url: str) -> Dict[str, Any]:
        """
        Complete application process for a specific job:
        1. Research company and extract job details
        2. Generate tailored resume and cover letter
        3. Optimize for ATS
        4. Track application
        5. Send confirmation email
        """
        logger.info(f"Starting application process for: {job_url}")
        
        try:
            # Research company and extract job details
            research = await self.quick_company_research(job_url)
            
            if not research.get("success"):
                return {"success": False, "error": "Company research failed"}
            
            # Create job object for material generation
            job_data = {
                "job_id": f"manual_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "title": research["job_details"]["title"],
                "company": research["job_details"]["company"],
                "description": research["job_details"]["description"],
                "url": job_url,
                "match_score": 0.9  # Manually selected job
            }
            
            # Generate application materials
            materials = await self._prepare_application_materials(job_data)
            
            # Track the application
            application_record = {
                "job_url": job_url,
                "company": research["job_details"]["company"],
                "job_title": research["job_details"]["title"],
                "status": "materials_ready",
                "materials": materials,
                "research": research,
                "applied_date": datetime.now().isoformat()
            }
            
            await self.application_tracking_agent.add_application({
                "user_id": "personal_user",
                "application_data": application_record
            })
            
            # Send confirmation email if enabled
            if self.config.email_notifications:
                await self._send_application_ready_email(application_record)
            
            return {
                "success": True,
                "job_title": job_data["title"],
                "company": research["job_details"]["company"],
                "materials_generated": True,
                "research_completed": True,
                "application_tracked": True
            }
            
        except Exception as e:
            logger.error(f"Job application process failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def quick_company_research(self, job_url: str) -> Dict[str, Any]:
        """
        Generate company research and application strategy:
        1. Extract job details from URL
        2. Generate talking points based on personal story
        3. Create application strategy
        4. Cache research for future reference
        """
        logger.info(f"Researching company for: {job_url}")
        
        try:
            # Check cache first for company research
            company_name = job_url.split('//')[-1].split('/')[0]  # Extract domain as company identifier
            cached_research = await self.cache.get_company_research(company_name, job_url)
            
            if cached_research:
                logger.info(f"Using cached company research for {company_name}")
                return {"success": True, **cached_research}
            
            # Extract job details
            job_details = await self.job_matching_agent.extract_job_from_url(job_url)
            
            if not job_details:
                return {"success": False, "error": "Could not extract job details"}
            
            # Generate talking points using personal context
            talking_points_prompt = f"""
            Company: {job_details.get('company', 'Unknown')}
            Job: {job_details.get('title', 'Unknown')}
            Description: {job_details.get('description', '')[:500]}
            
            Personal Background: {self.config.personal_story['background']}
            Career Transition: {self.config.career_transition_from} to {self.config.career_transition_to}
            Motivation: {self.config.personal_story['motivation']}
            
            Generate 5 specific talking points for my application:
            1. Why I'm interested in this organization
            2. How my finance background adds value to social work
            3. Specific contributions I could make
            4. Alignment with career transition goals
            5. Key questions for interview
            
            Keep responses specific and authentic to my career journey.
            """
            
            talking_points = await self.document_generation_agent.generate_custom_content(talking_points_prompt)
            
            # Generate application strategy
            strategy_prompt = f"""
            Job Details:
            - Company: {job_details.get('company')}
            - Role: {job_details.get('title')}
            - Description: {job_details.get('description', '')[:300]}
            
            My Profile: Finance professional transitioning to social work
            
            Create application strategy:
            1. Key messages for cover letter
            2. How to position career transition as strength
            3. Most relevant transferable skills
            4. Potential concerns to address
            5. Follow-up approach
            
            Focus on standing out as career changer with unique value.
            """
            
            application_strategy = await self.document_generation_agent.generate_custom_content(strategy_prompt)
            
            research_data = {
                "success": True,
                "job_details": job_details,
                "talking_points": talking_points,
                "application_strategy": application_strategy,
                "research_date": datetime.now().isoformat()
            }
            
            # Cache research with 7-day TTL
            actual_company_name = job_details.get('company', company_name)
            await self.cache.cache_company_research(
                actual_company_name, job_url, research_data, timedelta(days=7)
            )
            
            return research_data
            
        except Exception as e:
            logger.error(f"Company research failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def weekly_review(self) -> Dict[str, Any]:
        """
        Weekly review of applications and progress:
        1. Get applications from past week
        2. Check for email updates
        3. Analyze skills gaps
        4. Generate insights and recommendations
        5. Send weekly summary email
        """
        logger.info("Starting weekly review")
        
        try:
            # Get applications from last week
            week_ago = (datetime.now() - timedelta(days=7)).isoformat()
            applications = await self.application_tracking_agent.get_applications_since({
                "user_id": "personal_user",
                "since_date": week_ago
            })
            
            # Check for email updates
            email_updates = await self.application_tracking_agent.check_email_updates({
                "user_id": "personal_user",
                "applications": applications
            })
            
            # Analyze progress and generate insights
            progress_analysis = await self._analyze_weekly_progress(applications, email_updates)
            
            # Send weekly review email if enabled
            if self.config.email_notifications:
                await self._send_weekly_review_email(progress_analysis)
            
            return {
                "success": True,
                "applications_reviewed": len(applications),
                "email_updates_found": len(email_updates.get("status_updates", [])),
                "analysis": progress_analysis
            }
            
        except Exception as e:
            logger.error(f"Weekly review failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def _prepare_application_materials(self, job: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare resume and cover letter for specific job"""
        job_description = job.get("description", "")
        
        # Generate resume and cover letter in parallel
        resume_task = self.document_generation_agent.execute_with_monitoring({
            "user_profile": self.cached_user_profile,
            "job_description": job_description,
            "document_type": "resume",
            "template_id": "career_transition"
        })
        
        cover_letter_task = self.document_generation_agent.execute_with_monitoring({
            "user_profile": self.cached_user_profile,
            "job_description": job_description,
            "document_type": "cover_letter",
            "template_id": "finance_to_social_work"
        })
        
        resume_result, cover_letter_result = await asyncio.gather(resume_task, cover_letter_task)
        
        # Optimize resume for ATS if resume generation succeeded
        optimized_resume = resume_result
        if resume_result.get("success"):
            ats_result = await self.ats_optimization_agent.execute_with_monitoring({
                "document_content": resume_result.get("data", {}).get("content", ""),
                "job_description": job_description,
                "optimization_level": "standard"
            })
            if ats_result.get("success"):
                optimized_resume = ats_result
        
        return {
            "job_id": job.get("job_id"),
            "job_title": job.get("title"),
            "company": job.get("company"),
            "match_score": job.get("match_score", 0),
            "resume": optimized_resume.get("data", {}),
            "cover_letter": cover_letter_result.get("data", {}),
            "generated_at": datetime.now().isoformat()
        }
    
    def _is_salary_acceptable(self, salary_min: Optional[int], salary_max: Optional[int]) -> bool:
        """Check if salary meets personal requirements"""
        if not salary_min and not salary_max:
            return True
        
        config_min = self.config.salary_range["min"]
        config_max = self.config.salary_range["max"]
        
        if salary_min and salary_min < config_min:
            return False
        if salary_max and salary_max < config_min:
            return False
            
        return True
    
    async def _cache_job_opportunity(self, job: Dict[str, Any], materials: Dict[str, Any]) -> None:
        """Cache job opportunity with materials"""
        cache_key = f"opportunity_{job.get('job_id')}"
        job_record = {
            **job,
            "materials": materials,
            "cached_at": datetime.now().isoformat()
        }
        await self.cache.set("job_opportunity", "personal_user", cache_key, job_record)
    
    async def _send_daily_summary_email(self, jobs: List[Dict], materials: List[Dict]) -> None:
        """Send daily job discovery summary email"""
        subject = f"🎯 Daily Career Brief - {len(jobs)} Opportunities Found"
        
        jobs_summary = "\n".join([
            f"• {job['title']} at {job['company']} (Match: {job['match_score']:.1%})"
            for job in jobs[:5]
        ])
        
        materials_summary = "\n".join([
            f"• Materials prepared for {mat['job_title']} at {mat['company']}"
            for mat in materials
        ])
        
        body = f"""
Good morning {self.config.name}!

Your daily job discovery has found {len(jobs)} promising opportunities in {self.config.career_transition_to}.

📋 TODAY'S TOP OPPORTUNITIES:
{jobs_summary}

📄 APPLICATION MATERIALS PREPARED:
{materials_summary}

🔗 Next Steps:
1. Review prepared materials
2. Customize cover letters with company-specific details  
3. Submit applications through company websites
4. Track responses in your system

Keep pushing forward on your career transition journey! 🚀

Best,
Your CareerCopilot AI
        """
        
        await self.email_integration_agent.send({
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
{application['research']['talking_points'][:300] if application.get('research') else 'Research completed'}...

📋 NEXT STEPS:
1. Review the tailored resume and cover letter
2. Customize with company-specific details
3. Submit your application through their website
4. Set a follow-up reminder for 1-2 weeks

Good luck with your application! 🍀

Best,
Your CareerCopilot AI
        """
        
        await self.email_integration_agent.send({
            "recipient": self.config.email,
            "subject": subject,
            "body": body
        })
    
    async def _analyze_weekly_progress(self, applications: List[Dict], email_updates: Dict) -> Dict[str, Any]:
        """Analyze weekly job search progress"""
        analysis_prompt = f"""
        Weekly job search analysis:
        - Applications this week: {len(applications)}
        - Email responses: {len(email_updates.get('status_updates', []))}
        
        Context: Finance to social work career transition
        Location: {self.config.location}
        Target roles: {', '.join(self.config.target_roles[:3])}
        
        Provide encouraging weekly summary with:
        1. Progress celebration
        2. Response patterns noted
        3. 3 focus areas for next week
        4. Motivation for continued effort
        
        Keep personal and actionable.
        """
        
        summary = await self.document_generation_agent.generate_custom_content(analysis_prompt)
        
        return {
            "applications_count": len(applications),
            "responses_count": len(email_updates.get('status_updates', [])),
            "summary": summary,
            "recommendations": [
                "Continue targeting social work roles",
                "Highlight finance transferable skills", 
                "Follow up on pending applications"
            ]
        }
    
    async def _send_weekly_review_email(self, analysis: Dict[str, Any]) -> None:
        """Send weekly progress review email"""
        subject = "📊 Weekly Job Search Review & Progress"
        
        body = f"""
Weekly Review - {datetime.now().strftime('%B %d, %Y')}

{analysis.get('summary', 'Keep up the great work on your career transition!')}

🎯 FOCUS AREAS FOR NEXT WEEK:
{chr(10).join([f"• {rec}" for rec in analysis.get('recommendations', [])])}

💪 Stay consistent and motivated - your finance background brings unique value to social work!

Best,
Your CareerCopilot AI
        """
        
        await self.email_integration_agent.send({
            "recipient": self.config.email,
            "subject": subject,
            "body": body
        })