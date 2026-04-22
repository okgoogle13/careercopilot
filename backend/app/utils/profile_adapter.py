from typing import Any

from app.models.master_profile_schema import MasterCareerProfile


def map_master_to_renderer(profile: MasterCareerProfile) -> dict[str, Any]:
    """Maps MasterCareerProfile to a flat renderer-safe section dictionary."""
    info = profile.personalInfo

    basics = {
        "name": info.name,
        "email": str(info.email),
        "phone": info.phone,
        "location": info.location,
        "linkedin": str(info.linkedin) if info.linkedin else None,
        "portfolio": str(info.portfolio) if info.portfolio else None,
    }

    work = [
        {
            "title": exp.jobTitle,
            "company": exp.company,
            "location": exp.location,
            "startDate": exp.startDate,
            "endDate": exp.endDate,
            "responsibilities": exp.responsibilities,
            "achievements": exp.achievements,
            "skills": exp.skillsUsed,
        }
        for exp in profile.workExperience
    ]

    education = [
        {
            "institution": edu.institution,
            "degree": edu.degree,
            "fieldOfStudy": edu.fieldOfStudy,
            "startDate": edu.startDate,
            "endDate": edu.endDate,
            "notes": edu.notes,
        }
        for edu in profile.education
    ]

    skills = {
        "technical": profile.skills.technical,
        "tools": profile.skills.tools,
        "soft": profile.skills.soft,
        "methodologies": profile.skills.methodologies,
    }

    certifications = profile.certifications

    return {
        "basics": basics,
        "summary": info.summary,
        "work": work,
        "education": education,
        "skills": skills,
        "certifications": certifications,
    }
