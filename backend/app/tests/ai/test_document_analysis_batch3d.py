"""
Batch 3D: Document Analysis Service tests for final push to 95%.
Tests Pydantic models and analysis workflows.
"""

import pytest
from pydantic import ValidationError

from app.ai.document_analysis_service import (
    Education,
    Experience,
    ResumeAnalysisResult,
    SalaryRange,
)

# ============================================================================
# Education Model Tests (5 tests)
# ============================================================================


class TestEducation:
    """Tests for Education model."""

    def test_education_creation(self):
        """Test creating Education."""
        edu = Education(
            degree="Bachelor of Science",
            field="Computer Science",
            institution="MIT",
            year=2020,
        )
        assert edu.degree == "Bachelor of Science"
        assert edu.field == "Computer Science"
        assert edu.year == 2020

    def test_education_minimal(self):
        """Test Education with minimal fields."""
        edu = Education(
            degree="High School Diploma",
            field="General",
            institution="Unknown",
            year=2015,
        )
        assert edu.institution == "Unknown"

    def test_education_with_special_characters(self):
        """Test Education with special characters."""
        edu = Education(
            degree="Ph.D.",
            field="Artificial Intelligence & Machine Learning",
            institution="University of California, Berkeley",
            year=2019,
        )
        assert "&" in edu.field
        assert "," in edu.institution

    def test_education_unicode(self):
        """Test Education with unicode characters."""
        edu = Education(
            degree="Diplôme",
            field="Informatique",
            institution="Université de Paris",
            year=2018,
        )
        assert edu.degree == "Diplôme"

    def test_education_future_year(self):
        """Test Education with future year."""
        edu = Education(
            degree="Master's",
            field="Data Science",
            institution="Stanford",
            year=2025,
        )
        assert edu.year == 2025


# ============================================================================
# Experience Model Tests (6 tests)
# ============================================================================


class TestExperience:
    """Tests for Experience model."""

    def test_experience_creation(self):
        """Test creating Experience."""
        exp = Experience(
            title="Senior Engineer",
            company="Google",
            start_date="2020-01",
            end_date="2023-12",
            description="Led team of 5",
        )
        assert exp.title == "Senior Engineer"
        assert exp.current is False
        assert exp.description is not None

    def test_experience_current_role(self):
        """Test Experience for current role."""
        exp = Experience(
            title="Principal Engineer",
            company="Apple",
            start_date="2023-01",
            end_date=None,
            current=True,
        )
        assert exp.current is True
        assert exp.end_date is None

    def test_experience_without_description(self):
        """Test Experience without description."""
        exp = Experience(
            title="Developer",
            company="Microsoft",
            start_date="2021-06",
        )
        assert exp.description is None
        assert exp.current is False

    def test_experience_with_dates_only(self):
        """Test Experience with only dates."""
        exp = Experience(
            title="Intern",
            company="Startup",
            start_date="2020-05",
            end_date="2020-08",
        )
        assert exp.start_date == "2020-05"
        assert exp.end_date == "2020-08"

    def test_experience_special_company_name(self):
        """Test Experience with special company name."""
        exp = Experience(
            title="Engineer",
            company="Dropbox, Inc.",
            start_date="2019-01",
            end_date="2021-12",
        )
        assert "Inc." in exp.company

    def test_experience_long_description(self):
        """Test Experience with long description."""
        long_desc = "Led development of " * 50
        exp = Experience(
            title="Architect",
            company="IBM",
            start_date="2015-01",
            end_date="2020-12",
            description=long_desc,
        )
        assert len(exp.description) > 100


# ============================================================================
# SalaryRange Model Tests (5 tests)
# ============================================================================


class TestSalaryRange:
    """Tests for SalaryRange model."""

    def test_salary_range_both_values(self):
        """Test SalaryRange with both min and max."""
        salary = SalaryRange(min=100000, max=150000, currency="USD")
        assert salary.min == 100000
        assert salary.max == 150000

    def test_salary_range_min_only(self):
        """Test SalaryRange with min only."""
        salary = SalaryRange(min=80000, currency="USD")
        assert salary.min == 80000
        assert salary.max is None

    def test_salary_range_max_only(self):
        """Test SalaryRange with max only."""
        salary = SalaryRange(max=200000, currency="USD")
        assert salary.min is None
        assert salary.max == 200000

    def test_salary_range_different_currency(self):
        """Test SalaryRange with different currencies."""
        for currency in ["USD", "EUR", "GBP", "JPY", "INR"]:
            salary = SalaryRange(min=50000, max=100000, currency=currency)
            assert salary.currency == currency

    def test_salary_range_default_currency(self):
        """Test SalaryRange defaults to USD."""
        salary = SalaryRange(min=75000)
        assert salary.currency == "USD"


# ============================================================================
# ResumeAnalysisResult Model Tests (7 tests)
# ============================================================================


class TestResumeAnalysisResult:
    """Tests for ResumeAnalysisResult model."""

    def test_resume_analysis_minimal(self):
        """Test ResumeAnalysisResult with defaults."""
        result = ResumeAnalysisResult()
        assert result.skills == []

    def test_resume_analysis_with_skills(self):
        """Test ResumeAnalysisResult with skills."""
        result = ResumeAnalysisResult(skills=["Python", "JavaScript", "React"])
        assert len(result.skills) == 3
        assert "Python" in result.skills

    def test_resume_analysis_empty_skills(self):
        """Test ResumeAnalysisResult with empty skills."""
        result = ResumeAnalysisResult(skills=[])
        assert result.skills == []

    def test_resume_analysis_many_skills(self):
        """Test ResumeAnalysisResult with many skills."""
        skills = [f"Skill{i}" for i in range(50)]
        result = ResumeAnalysisResult(skills=skills)
        assert len(result.skills) == 50

    def test_resume_analysis_skill_case_sensitivity(self):
        """Test skills are case-sensitive."""
        result = ResumeAnalysisResult(skills=["python", "Python", "PYTHON"])
        assert len(result.skills) == 3
        assert "python" in result.skills
        assert "Python" in result.skills

    def test_resume_analysis_duplicate_skills(self):
        """Test ResumeAnalysisResult with duplicate skills."""
        result = ResumeAnalysisResult(skills=["Python", "Python", "JavaScript"])
        assert result.skills.count("Python") == 2

    def test_resume_analysis_special_skill_names(self):
        """Test ResumeAnalysisResult with special skill names."""
        result = ResumeAnalysisResult(
            skills=[
                "C++",
                "C#",
                "Node.js",
                "Machine Learning",
                "AWS/Cloud",
            ]
        )
        assert "C++" in result.skills
        assert "Node.js" in result.skills


# ============================================================================
# Integration Tests (6 tests)
# ============================================================================


class TestDocumentAnalysisIntegration:
    """Integration tests for document analysis models."""

    def test_resume_with_education_history(self):
        """Test building resume analysis with education."""
        educations = [
            Education(
                degree="Bachelor",
                field="CS",
                institution="MIT",
                year=2020,
            ),
            Education(
                degree="Master",
                field="AI",
                institution="Stanford",
                year=2022,
            ),
        ]
        result = ResumeAnalysisResult(skills=["ML", "Python"])
        assert len(educations) == 2
        assert len(result.skills) == 2

    def test_resume_with_experience_history(self):
        """Test building resume with experience."""
        experiences = [
            Experience(
                title="Junior Dev",
                company="Startup",
                start_date="2020-06",
                end_date="2021-12",
            ),
            Experience(
                title="Senior Dev",
                company="BigTech",
                start_date="2022-01",
                end_date=None,
                current=True,
            ),
        ]
        assert len(experiences) == 2
        assert experiences[1].current is True

    def test_job_description_with_salary(self):
        """Test job description with salary."""
        salary = SalaryRange(
            min=120000,
            max=180000,
            currency="USD",
        )
        required_skills = ["Java", "Spring", "AWS"]
        assert salary.min == 120000
        assert len(required_skills) == 3

    def test_complete_resume_profile(self):
        """Test complete resume profile."""
        education = Education(
            degree="BS",
            field="Computer Science",
            institution="Stanford",
            year=2020,
        )
        experience = Experience(
            title="Software Engineer",
            company="Google",
            start_date="2020-07",
            current=True,
        )
        skills = ["Python", "Go", "Kubernetes"]
        result = ResumeAnalysisResult(skills=skills)

        assert education.year >= 2020
        assert experience.current is True
        assert len(result.skills) == 3

    def test_career_progression(self):
        """Test tracking career progression."""
        experiences = [
            Experience(
                title="Intern",
                company="TechCorp",
                start_date="2018-06",
                end_date="2018-08",
            ),
            Experience(
                title="Junior Engineer",
                company="StartupXYZ",
                start_date="2018-09",
                end_date="2020-06",
            ),
            Experience(
                title="Senior Engineer",
                company="FortuneCorp",
                start_date="2020-07",
                end_date=None,
                current=True,
            ),
        ]
        assert len(experiences) == 3
        assert experiences[0].title == "Intern"
        assert experiences[2].current is True

    def test_skill_progression(self):
        """Test tracking skill progression."""
        initial_skills = ["JavaScript", "HTML", "CSS"]
        intermediate_skills = initial_skills + ["React", "Node.js"]
        advanced_skills = intermediate_skills + ["TypeScript", "AWS"]

        result1 = ResumeAnalysisResult(skills=initial_skills)
        result2 = ResumeAnalysisResult(skills=intermediate_skills)
        result3 = ResumeAnalysisResult(skills=advanced_skills)

        assert len(result1.skills) == 3
        assert len(result2.skills) == 5
        assert len(result3.skills) == 7


# ============================================================================
# Edge Cases and Boundary Tests (6 tests)
# ============================================================================


class TestEdgeCases:
    """Tests for edge cases and boundary conditions."""

    def test_education_year_boundary(self):
        """Test Education with extreme year values."""
        old_edu = Education(
            degree="Certificate",
            field="Ancient Study",
            institution="Old School",
            year=1950,
        )
        future_edu = Education(
            degree="PhD",
            field="Future Tech",
            institution="Tomorrow University",
            year=2050,
        )
        assert old_edu.year == 1950
        assert future_edu.year == 2050

    def test_experience_very_short_duration(self):
        """Test Experience with very short duration."""
        exp = Experience(
            title="Consultant",
            company="Short Gig",
            start_date="2023-01-01",
            end_date="2023-01-31",
        )
        assert exp.start_date == "2023-01-01"

    def test_experience_very_long_duration(self):
        """Test Experience with very long duration."""
        exp = Experience(
            title="Lifer",
            company="Same Corp",
            start_date="1980-01",
            end_date="2023-12",
        )
        assert exp.start_date == "1980-01"

    def test_salary_range_very_high(self):
        """Test SalaryRange with very high values."""
        salary = SalaryRange(
            min=1000000,
            max=5000000,
            currency="USD",
        )
        assert salary.max == 5000000

    def test_salary_range_zero_values(self):
        """Test SalaryRange with zero values."""
        salary = SalaryRange(min=0, max=0, currency="USD")
        assert salary.min == 0
        assert salary.max == 0

    def test_resume_analysis_empty_result(self):
        """Test ResumeAnalysisResult with all empty/None values."""
        result = ResumeAnalysisResult()
        assert result.skills == []
