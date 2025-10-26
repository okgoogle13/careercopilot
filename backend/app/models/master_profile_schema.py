"""
Master Career Profile Schema

Pydantic models for structured career data extraction from resumes and career documents.
Based on Resume Extractor Schema v4 - the "gold standard" for Smart Ingestion feature.

This schema is designed for:
- AI-powered resume parsing with Genkit flows
- Firestore storage in users/{user_id}/assetLibrary collection
- Comprehensive career data representation
"""

from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field, HttpUrl


class PersonalInfo(BaseModel):
    """Basic contact and summary information for a professional profile."""

    name: str = Field(..., description="Full name of the individual")
    email: EmailStr = Field(..., description="Primary contact email address")
    phone: Optional[str] = Field(None, description="Primary contact phone number")
    location: Optional[str] = Field(
        None,
        description="Current city and state/country (e.g., 'Naarm, VIC', 'London, UK')",
    )
    summary: str = Field(
        ...,
        description="A 2-4 sentence professional summary or objective highlighting key experience and goals",
    )
    linkedin: Optional[HttpUrl] = Field(
        None, description="URL of the LinkedIn profile, if available"
    )
    portfolio: Optional[HttpUrl] = Field(
        None, description="URL of a personal portfolio or website, if available"
    )


class WorkExperience(BaseModel):
    """
    Professional work experience entry.

    Note: Multiple roles at the same company with overlapping dates should be
    consolidated into ONE entry with combined job titles separated by ' / '.
    """

    jobTitle: str = Field(
        ...,
        description="Job title held. Combine multiple titles with ' / ' if roles were consolidated",
    )
    company: str = Field(..., description="Name of the company or organization")
    location: Optional[str] = Field(
        None, description="City and state/country where the job was located"
    )
    startDate: str = Field(..., description="Start date in YYYY-MM format (e.g., '2022-03')")
    endDate: str = Field(..., description="End date in YYYY-MM format or 'Present'")
    responsibilities: List[str] = Field(
        default_factory=list,
        description="List of general duties and responsibilities for the role. DO NOT include quantifiable achievements here",
    )
    achievements: List[str] = Field(
        default_factory=list,
        description="List of specific, quantifiable accomplishments or results achieved in the role (STAR format preferred). DO NOT list general duties here",
    )
    skillsUsed: List[str] = Field(
        default_factory=list,
        description="Specific skills (technical, tools, methodologies) utilized in THIS role. MUST be populated if skills are mentioned for the role",
    )


class Project(BaseModel):
    """Significant personal or professional project."""

    projectName: str = Field(..., description="Name of the project")
    description: str = Field(..., description="Brief description of the project and your role")
    startDate: Optional[str] = Field(None, description="Start date in YYYY-MM format")
    endDate: Optional[str] = Field(None, description="End date in YYYY-MM format or 'Ongoing'")
    link: Optional[HttpUrl] = Field(None, description="URL to the project, if available")
    technologiesUsed: List[str] = Field(
        default_factory=list, description="Key technologies or skills used"
    )


class Education(BaseModel):
    """Educational qualification entry."""

    institution: str = Field(..., description="Name of the school, university, or institution")
    degree: str = Field(
        ...,
        description="Degree or qualification obtained (e.g., 'Master of Finance', 'Diploma of Community Services')",
    )
    fieldOfStudy: Optional[str] = Field(
        None,
        description="Major or field of study (e.g., 'Finance', 'Community Services', 'Marketing'). Extract ONLY the core field (e.g., 'Marketing' not 'Business in Marketing')",
    )
    startDate: Optional[str] = Field(None, description="Start date in YYYY-MM or YYYY format")
    endDate: str = Field(..., description="End date or graduation date in YYYY-MM or YYYY format")
    notes: Optional[str] = Field(None, description="Optional: GPA, honors, relevant coursework")


class Skills(BaseModel):
    """
    Categorized list of ALL skills mentioned in the document.

    Skills should be comprehensively categorized into technical expertise, tools,
    soft skills, and methodologies for maximum utility in job applications.
    """

    technical: List[str] = Field(
        default_factory=list,
        description="Specific technical expertise relevant to the field (e.g., 'AOD services', 'Pharmacokinetics', 'Case Management', 'Data Entry')",
    )
    tools: List[str] = Field(
        default_factory=list,
        description="Software, hardware, or specific tools proficiency (e.g., 'Microsoft Office Suite', 'Excel', 'Salesforce', 'Jira', 'Asana', 'Oracle BPM'). MUST NOT be empty if tools are mentioned anywhere in the document",
    )
    soft: List[str] = Field(
        default_factory=list,
        description="Interpersonal and professional skills (e.g., 'Stakeholder Management', 'Communication', 'Empathy', 'Adaptability')",
    )
    methodologies: List[str] = Field(
        default_factory=list,
        description="Frameworks, processes, or ways of working (e.g., 'Project Management', 'Agile', 'Scrum', 'Co-design Facilitation', 'SMART Recovery Facilitation')",
    )


class KeySelectionCriteriaExample(BaseModel):
    """
    Specific example written in response to Key Selection Criteria (KSC) or using STAR format.

    These are usually longer-form text examples that demonstrate specific competencies
    and are valuable for future job applications.
    """

    criteria: str = Field(..., description="The KSC question or statement")
    example: str = Field(..., description="The full example response")
    relatedSkills: List[str] = Field(
        ...,
        description="Skills demonstrated in this example. MUST be populated by analyzing the 'example' text",
    )


class MasterCareerProfile(BaseModel):
    """
    Complete structured career profile extracted from a resume or career document.

    This is the "gold standard" schema for the Smart Ingestion feature, representing
    the most comprehensive data structure for storing career information in Firestore.

    Schema Version: v4
    """

    personalInfo: PersonalInfo = Field(..., description="Basic contact and summary information")
    workExperience: List[WorkExperience] = Field(
        default_factory=list,
        description="Chronological list of professional work experiences. Consolidate multiple roles at the same company with overlapping dates into ONE entry",
    )
    projects: List[Project] = Field(
        default_factory=list,
        description="Significant personal or professional projects",
    )
    education: List[Education] = Field(
        default_factory=list,
        description="List of educational qualifications",
    )
    skills: Skills = Field(
        ...,
        description="Categorized list of ALL skills mentioned in the document",
    )
    certifications: List[str] = Field(
        default_factory=list,
        description="List of professional certifications or licenses",
    )
    keySelectionCriteriaExamples: List[KeySelectionCriteriaExample] = Field(
        default_factory=list,
        description="Specific examples written in response to Key Selection Criteria (KSC) or using STAR format. Only extract if explicitly present",
    )

    class Config:
        """Pydantic model configuration."""

        json_schema_extra = {
            "example": {
                "personalInfo": {
                    "name": "Jane Smith",
                    "email": "jane.smith@example.com",
                    "phone": "+61 400 123 456",
                    "location": "Melbourne, VIC",
                    "summary": "Experienced social worker with 5+ years in community services, specializing in case management and client advocacy. Passionate about supporting vulnerable populations.",
                    "linkedin": "https://linkedin.com/in/janesmith",
                    "portfolio": None,
                },
                "workExperience": [
                    {
                        "jobTitle": "Senior Case Manager",
                        "company": "Community Health Services Victoria",
                        "location": "Melbourne, VIC",
                        "startDate": "2020-03",
                        "endDate": "Present",
                        "responsibilities": [
                            "Manage caseload of 25+ clients with complex needs",
                            "Develop individualized care plans",
                        ],
                        "achievements": [
                            "Reduced client crisis incidents by 40% through proactive intervention strategies",
                            "Achieved 95% client satisfaction rating in annual survey",
                        ],
                        "skillsUsed": ["Case Management", "Crisis Intervention", "Salesforce"],
                    }
                ],
                "projects": [],
                "education": [
                    {
                        "institution": "University of Melbourne",
                        "degree": "Bachelor of Social Work",
                        "fieldOfStudy": "Social Work",
                        "startDate": "2014",
                        "endDate": "2017",
                        "notes": "Graduated with Honors",
                    }
                ],
                "skills": {
                    "technical": ["Case Management", "Crisis Intervention", "Risk Assessment"],
                    "tools": ["Salesforce", "Microsoft Office Suite"],
                    "soft": ["Empathy", "Communication", "Stakeholder Management"],
                    "methodologies": ["STAR methodology", "Trauma-informed practice"],
                },
                "certifications": ["Mental Health First Aid", "Working with Children Check"],
                "keySelectionCriteriaExamples": [],
            }
        }
