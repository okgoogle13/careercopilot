"""
Personal Configuration for CareerCopilot
Optimized for single-user personal use
"""

import os
from dataclasses import dataclass, field
from typing import List, Dict, Optional
from enum import Enum

class ExperienceLevel(Enum):
    ENTRY = "entry"
    MID = "mid"
    SENIOR = "senior"

class WorkType(Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    CASUAL = "casual"

@dataclass
class PersonalCareerConfig:
    """Complete personal configuration for CareerCopilot"""
    
    # Personal Information
    name: str = os.getenv("USER_NAME", "Your Name")
    email: str = os.getenv("USER_EMAIL", "nishantdougall@gmail.com")
    location: str = os.getenv("USER_LOCATION", "Northcote, VIC, Australia")
    user_id: str = os.getenv("USER_ID", "personal_user")
    
    # Career Transition Details
    career_transition_from: str = os.getenv("CAREER_TRANSITION_FROM", "Finance")
    career_transition_to: str = os.getenv("CAREER_TRANSITION_TO", "Social Work/Community Services")
    career_motivation: str = os.getenv("CAREER_MOTIVATION", "Direct community impact and social justice")
    
    # Job Search Preferences
    target_roles: List[str] = field(default_factory=lambda: [
        "Social Worker",
        "Case Manager", 
        "Community Services Worker",
        "Program Coordinator",
        "Support Worker",
        "Mental Health Worker",
        "Family Services Worker",
        "Youth Worker",
        "Disability Support Worker",
        "Community Development Officer"
    ])
    
    preferred_locations: List[str] = field(default_factory=lambda: [
        "Melbourne, VIC",
        "Inner Melbourne",
        "Northcote, VIC", 
        "Brunswick, VIC",
        "Fitzroy, VIC",
        "Carlton, VIC",
        "Remote",
        "Hybrid"
    ])
    
    # Salary Expectations (AUD)
    salary_range: Dict[str, int] = field(default_factory=lambda: {
        "min": int(os.getenv("SALARY_RANGE_MIN", "60000")),
        "max": int(os.getenv("SALARY_RANGE_MAX", "85000")),
        "target": 72000,
        "currency": os.getenv("CURRENCY", "AUD")
    })
    
    # Work Preferences
    work_types: List[WorkType] = field(default_factory=lambda: [
        WorkType.FULL_TIME,
        WorkType.PART_TIME
    ])
    
    experience_level: ExperienceLevel = ExperienceLevel.MID
    remote_work_ok: bool = True
    travel_required_ok: bool = True
    shift_work_ok: bool = False
    
    # Skills Profile
    transferable_skills: List[str] = field(default_factory=lambda: [
        "Financial Analysis",
        "Data Analysis", 
        "Risk Assessment",
        "Project Management",
        "Budget Management",
        "Client Relationship Management",
        "Stakeholder Communication",
        "Problem Solving",
        "Attention to Detail",
        "Regulatory Compliance"
    ])
    
    developing_skills: List[str] = field(default_factory=lambda: [
        "Case Management",
        "Counseling Techniques", 
        "Community Engagement",
        "Crisis Intervention",
        "Cultural Competency",
        "Mental Health Support",
        "Group Facilitation",
        "Advocacy",
        "Program Evaluation",
        "Social Policy Knowledge"
    ])
    
    # Certifications and Qualifications
    current_qualifications: List[str] = field(default_factory=lambda: [
        "Bachelor's Degree in Finance",
        "Financial Planning Certification",
        "Project Management Experience"
    ])
    
    target_qualifications: List[str] = field(default_factory=lambda: [
        "Master of Social Work",
        "Mental Health First Aid",
        "Diploma in Community Services",
        "Cultural Competency Training"
    ])
    
    # Organization Preferences
    preferred_org_types: List[str] = field(default_factory=lambda: [
        "Non-profit Organization",
        "Government Agency", 
        "Community Health Service",
        "Mental Health Service",
        "Disability Services",
        "Family Services",
        "Youth Services",
        "Indigenous Services",
        "Multicultural Services"
    ])
    
    organization_values: List[str] = field(default_factory=lambda: [
        "Social Justice",
        "Cultural Diversity",
        "Community Empowerment",
        "Human Rights",
        "Equity and Inclusion",
        "Trauma-Informed Care",
        "Strengths-Based Approach",
        "Person-Centered Care"
    ])
    
    # Automation Preferences
    daily_job_scan: bool = bool(os.getenv("DAILY_JOB_SCAN", "true").lower() == "true")
    auto_generate_documents: bool = bool(os.getenv("AUTO_GENERATE_DOCUMENTS", "true").lower() == "true")
    email_notifications: bool = bool(os.getenv("EMAIL_NOTIFICATIONS", "true").lower() == "true")
    morning_scan_time: str = os.getenv("MORNING_SCAN_TIME", "09:00")
    weekly_review_day: str = os.getenv("WEEKLY_REVIEW_DAY", "friday")
    
    # Job Source Preferences
    job_sources: Dict[str, str] = field(default_factory=lambda: {
        "seek": os.getenv("SEEK_RSS_URL", "https://www.seek.com.au/jobs-in-social-work/rss"),
        "indeed": os.getenv("INDEED_RSS_URL", "https://au.indeed.com/rss?q=social+work+melbourne"),
        "ethical_jobs": os.getenv("ETHICAL_JOBS_RSS", "https://www.ethicaljobs.com.au/rss/jobs?category=social-services"),
        "aps_jobs": os.getenv("APS_JOBS_RSS", "https://www.apsjobs.gov.au/rss"),
        "vic_gov": "https://careers.vic.gov.au/rss",
        "nsw_gov": "https://iworkfor.nsw.gov.au/rss"
    })
    
    # Personal Story for AI Context
    personal_story: Dict[str, str] = field(default_factory=lambda: {
        "background": """Non-binary person of colour with extensive finance experience 
                        seeking to transition into social work and community services 
                        to create direct positive impact in communities.""",
        
        "motivation": """Driven by desire to use analytical and relationship skills 
                        from finance background to support vulnerable communities 
                        and address social inequalities.""",
        
        "unique_value": """Brings financial literacy, data analysis skills, and 
                         lived experience as person of colour to social work practice.""",
        
        "career_goals": """Develop expertise in case management, community development,
                          and culturally responsive social work practice."""
    })
    
    # Document Generation Preferences
    document_preferences: Dict[str, str] = field(default_factory=lambda: {
        "resume_style": "modern_professional",
        "cover_letter_tone": "professional_authentic",
        "highlight_career_change": True,
        "emphasize_diversity": True,
        "focus_transferable_skills": True
    })
    
    def get_job_keywords(self) -> List[str]:
        """Get comprehensive job search keywords"""
        return (
            self.target_roles + 
            ["social work", "community services", "case management", 
             "support worker", "community development", "mental health",
             "disability services", "family services", "youth work",
             "cultural competency", "diversity", "inclusion"] +
            [skill.lower() for skill in self.transferable_skills[:5]]
        )
    
    def get_location_keywords(self) -> List[str]:
        """Get location search terms"""
        return [
            "Melbourne", "Victoria", "VIC", "Inner Melbourne",
            "North Melbourne", "Carlton", "Fitzroy", "Brunswick",
            "Northcote", "Remote", "Hybrid", "Work from home"
        ]
    
    def is_salary_acceptable(self, salary_min: Optional[int], salary_max: Optional[int]) -> bool:
        """Check if job salary meets personal requirements"""
        if not salary_min and not salary_max:
            return True  # Salary not specified
        
        if salary_min and salary_min < self.salary_range["min"]:
            return False
        
        if salary_max and salary_max < self.salary_range["target"]:
            return False
            
        return True
    
    def calculate_job_match_score(self, job_title: str, job_description: str, 
                                company_type: str = "") -> float:
        """Calculate personal job match score based on preferences"""
        score = 0.0
        
        # Title match
        for role in self.target_roles:
            if role.lower() in job_title.lower():
                score += 0.3
                break
        
        # Skills match
        job_text = f"{job_title} {job_description}".lower()
        skill_matches = sum(1 for skill in self.transferable_skills 
                          if skill.lower() in job_text)
        score += min(skill_matches * 0.1, 0.4)
        
        # Organization type match
        if company_type:
            for org_type in self.preferred_org_types:
                if org_type.lower() in company_type.lower():
                    score += 0.2
                    break
        
        # Values alignment
        values_matches = sum(1 for value in self.organization_values
                           if value.lower() in job_text)
        score += min(values_matches * 0.02, 0.1)
        
        return min(score, 1.0)

# Global configuration instance
personal_config = PersonalCareerConfig()

def get_personal_config() -> PersonalCareerConfig:
    """Get the global personal configuration"""
    return personal_config

def update_personal_config(**kwargs) -> PersonalCareerConfig:
    """Update personal configuration with new values"""
    global personal_config
    for key, value in kwargs.items():
        if hasattr(personal_config, key):
            setattr(personal_config, key, value)
    return personal_config