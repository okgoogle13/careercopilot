"""
Batch 3C: Job Matching and Document Analysis tests for 95% coverage.
Tests for Pydantic models and validation.
"""

import pytest
from pydantic import ValidationError

from app.genkit_flows.advanced_job_matching import (
    CareerTransitionAnalysis,
    JobMatchAnalysis,
    SkillMatch,
)

# ============================================================================
# SkillMatch Tests (6 tests)
# ============================================================================


class TestSkillMatch:
    """Tests for SkillMatch Pydantic model."""

    def test_skill_match_creation(self):
        """Test creating SkillMatch."""
        match = SkillMatch(
            skill="Python",
            candidate_level=8,
            required_level=7,
            gap_score=1,
            importance="critical",
        )
        assert match.skill == "Python"
        assert match.candidate_level == 8

    def test_skill_match_level_boundaries(self):
        """Test SkillMatch validates level boundaries."""
        match = SkillMatch(
            skill="Java",
            candidate_level=1,
            required_level=10,
            gap_score=5,
            importance="important",
        )
        assert match.candidate_level == 1
        assert match.required_level == 10

    def test_skill_match_invalid_level_low(self):
        """Test SkillMatch rejects level < 1."""
        with pytest.raises(ValidationError):
            SkillMatch(
                skill="JavaScript",
                candidate_level=0,
                required_level=5,
                gap_score=5,
                importance="nice-to-have",
            )

    def test_skill_match_invalid_level_high(self):
        """Test SkillMatch rejects level > 10."""
        with pytest.raises(ValidationError):
            SkillMatch(
                skill="React",
                candidate_level=11,
                required_level=5,
                gap_score=5,
                importance="critical",
            )

    def test_skill_match_gap_score_zero(self):
        """Test SkillMatch gap_score can be zero."""
        match = SkillMatch(
            skill="SQL",
            candidate_level=8,
            required_level=8,
            gap_score=0,
            importance="critical",
        )
        assert match.gap_score == 0

    def test_skill_match_importance_values(self):
        """Test SkillMatch accepts importance values."""
        for importance in ["critical", "important", "nice-to-have"]:
            match = SkillMatch(
                skill="Test",
                candidate_level=5,
                required_level=5,
                gap_score=0,
                importance=importance,
            )
            assert match.importance == importance


# ============================================================================
# CareerTransitionAnalysis Tests (5 tests)
# ============================================================================


class TestCareerTransitionAnalysis:
    """Tests for CareerTransitionAnalysis model."""

    def test_career_transition_creation(self):
        """Test creating CareerTransitionAnalysis."""
        analysis = CareerTransitionAnalysis(
            transition_feasibility=75,
            transferable_skills=["Leadership"],
            skill_gaps=["Machine Learning"],
            transition_timeline="6-12months",
            transition_strategy=["Take ML course"],
        )
        assert analysis.transition_feasibility == 75
        assert len(analysis.transferable_skills) == 1

    def test_career_transition_feasibility_zero(self):
        """Test feasibility score can be zero."""
        analysis = CareerTransitionAnalysis(
            transition_feasibility=0,
            transferable_skills=[],
            skill_gaps=[],
            transition_timeline="immediate",
            transition_strategy=[],
        )
        assert analysis.transition_feasibility == 0

    def test_career_transition_invalid_feasibility_high(self):
        """Test rejects feasibility > 100."""
        with pytest.raises(ValidationError):
            CareerTransitionAnalysis(
                transition_feasibility=101,
                transferable_skills=[],
                skill_gaps=[],
                transition_timeline="immediate",
                transition_strategy=[],
            )

    def test_career_transition_timeline_values(self):
        """Test timeline field accepts valid values."""
        timelines = ["immediate", "3-6months", "6-12months", "1-2years"]
        for timeline in timelines:
            analysis = CareerTransitionAnalysis(
                transition_feasibility=50,
                transferable_skills=[],
                skill_gaps=[],
                transition_timeline=timeline,
                transition_strategy=[],
            )
            assert analysis.transition_timeline == timeline

    def test_career_transition_empty_arrays(self):
        """Test with empty skill and strategy arrays."""
        analysis = CareerTransitionAnalysis(
            transition_feasibility=50,
            transferable_skills=[],
            skill_gaps=[],
            transition_timeline="immediate",
            transition_strategy=[],
        )
        assert analysis.transferable_skills == []
        assert analysis.skill_gaps == []


# ============================================================================
# JobMatchAnalysis Tests (9 tests)
# ============================================================================


class TestJobMatchAnalysis:
    """Tests for JobMatchAnalysis model."""

    @pytest.fixture
    def sample_skills(self):
        """Fixture with sample SkillMatch objects."""
        return [
            SkillMatch(
                skill="Python",
                candidate_level=8,
                required_level=7,
                gap_score=1,
                importance="critical",
            ),
        ]

    def test_job_match_analysis_creation(self, sample_skills):
        """Test creating JobMatchAnalysis."""
        analysis = JobMatchAnalysis(
            overall_match_score=82,
            skill_compatibility=80,
            experience_fit=85,
            cultural_fit=75,
            growth_potential=88,
            skill_matches=sample_skills,
            critical_gaps=["Advanced AWS"],
            competitive_advantages=["Strong Python"],
            recommendations=["Build AWS skills"],
            interview_prep_focus=["AWS architecture"],
            confidence_level="high",
            match_category="good",
        )
        assert analysis.overall_match_score == 82
        assert analysis.confidence_level == "high"

    def test_job_match_analysis_score_range(self, sample_skills):
        """Test all score fields are 0-100."""
        analysis = JobMatchAnalysis(
            overall_match_score=0,
            skill_compatibility=100,
            experience_fit=50,
            cultural_fit=75,
            growth_potential=90,
            skill_matches=sample_skills,
            critical_gaps=[],
            competitive_advantages=[],
            recommendations=[],
            interview_prep_focus=[],
            confidence_level="medium",
            match_category="fair",
        )
        assert analysis.overall_match_score == 0
        assert analysis.skill_compatibility == 100

    def test_job_match_analysis_invalid_score(self, sample_skills):
        """Test rejects scores > 100."""
        with pytest.raises(ValidationError):
            JobMatchAnalysis(
                overall_match_score=101,
                skill_compatibility=80,
                experience_fit=85,
                cultural_fit=75,
                growth_potential=88,
                skill_matches=sample_skills,
                critical_gaps=[],
                competitive_advantages=[],
                recommendations=[],
                interview_prep_focus=[],
                confidence_level="high",
                match_category="good",
            )

    def test_job_match_with_transition(self, sample_skills):
        """Test JobMatchAnalysis with career transition."""
        transition = CareerTransitionAnalysis(
            transition_feasibility=70,
            transferable_skills=["Communication"],
            skill_gaps=["Technical skills"],
            transition_timeline="6-12months",
            transition_strategy=["Bootcamp"],
        )
        analysis = JobMatchAnalysis(
            overall_match_score=65,
            skill_compatibility=60,
            experience_fit=70,
            cultural_fit=80,
            growth_potential=85,
            skill_matches=sample_skills,
            critical_gaps=["Years"],
            competitive_advantages=[],
            career_transition=transition,
            recommendations=[],
            interview_prep_focus=[],
            confidence_level="medium",
            match_category="fair",
        )
        assert analysis.career_transition is not None

    def test_job_match_empty_arrays(self):
        """Test with empty arrays."""
        analysis = JobMatchAnalysis(
            overall_match_score=50,
            skill_compatibility=50,
            experience_fit=50,
            cultural_fit=50,
            growth_potential=50,
            skill_matches=[],
            critical_gaps=[],
            competitive_advantages=[],
            recommendations=[],
            interview_prep_focus=[],
            confidence_level="low",
            match_category="poor",
        )
        assert analysis.skill_matches == []

    def test_job_match_perfect_scores(self, sample_skills):
        """Test with perfect scores (100)."""
        analysis = JobMatchAnalysis(
            overall_match_score=100,
            skill_compatibility=100,
            experience_fit=100,
            cultural_fit=100,
            growth_potential=100,
            skill_matches=sample_skills,
            critical_gaps=[],
            competitive_advantages=["Everything"],
            recommendations=[],
            interview_prep_focus=[],
            confidence_level="high",
            match_category="excellent",
        )
        assert analysis.overall_match_score == 100

    def test_job_match_confidence_levels(self, sample_skills):
        """Test confidence_level field."""
        for confidence in ["high", "medium", "low"]:
            analysis = JobMatchAnalysis(
                overall_match_score=50,
                skill_compatibility=50,
                experience_fit=50,
                cultural_fit=50,
                growth_potential=50,
                skill_matches=sample_skills,
                critical_gaps=[],
                competitive_advantages=[],
                recommendations=[],
                interview_prep_focus=[],
                confidence_level=confidence,
                match_category="fair",
            )
            assert analysis.confidence_level == confidence

    def test_job_match_category_values(self, sample_skills):
        """Test match_category field."""
        for category in ["excellent", "good", "fair", "poor"]:
            analysis = JobMatchAnalysis(
                overall_match_score=50,
                skill_compatibility=50,
                experience_fit=50,
                cultural_fit=50,
                growth_potential=50,
                skill_matches=sample_skills,
                critical_gaps=[],
                competitive_advantages=[],
                recommendations=[],
                interview_prep_focus=[],
                confidence_level="high",
                match_category=category,
            )
            assert analysis.match_category == category


# ============================================================================
# Integration Tests (5 tests)
# ============================================================================


class TestJobMatchingIntegration:
    """Integration tests for job matching models."""

    def test_full_workflow(self):
        """Test complete job matching workflow."""
        skills = [
            SkillMatch(
                skill="Python",
                candidate_level=9,
                required_level=8,
                gap_score=0,
                importance="critical",
            ),
        ]

        analysis = JobMatchAnalysis(
            overall_match_score=85,
            skill_compatibility=90,
            experience_fit=82,
            cultural_fit=80,
            growth_potential=88,
            skill_matches=skills,
            critical_gaps=[],
            competitive_advantages=["Expert Python"],
            recommendations=["Strengthen data viz"],
            interview_prep_focus=["System design"],
            confidence_level="high",
            match_category="good",
        )

        assert len(analysis.skill_matches) == 1
        assert analysis.overall_match_score > 80

    def test_career_transition_workflow(self):
        """Test career transition analysis."""
        transition = CareerTransitionAnalysis(
            transition_feasibility=65,
            transferable_skills=["Management"],
            skill_gaps=["Machine Learning"],
            transition_timeline="6-12months",
            transition_strategy=["ML bootcamp"],
        )

        assert transition.transition_feasibility == 65
        assert len(transition.transferable_skills) == 1

    def test_mixed_match_with_transition(self):
        """Test job match with career transition."""
        skills = [
            SkillMatch(
                skill="JavaScript",
                candidate_level=8,
                required_level=9,
                gap_score=1,
                importance="critical",
            ),
        ]
        transition = CareerTransitionAnalysis(
            transition_feasibility=55,
            transferable_skills=["Web dev"],
            skill_gaps=["Backend"],
            transition_timeline="1-2years",
            transition_strategy=["Learn backend"],
        )

        analysis = JobMatchAnalysis(
            overall_match_score=60,
            skill_compatibility=65,
            experience_fit=55,
            cultural_fit=70,
            growth_potential=80,
            skill_matches=skills,
            critical_gaps=["Backend experience"],
            competitive_advantages=["Strong JS"],
            career_transition=transition,
            recommendations=["Pursue backend"],
            interview_prep_focus=["Backend readiness"],
            confidence_level="medium",
            match_category="fair",
        )

        assert analysis.career_transition is not None

    def test_serialization(self):
        """Test model serialization."""
        original = SkillMatch(
            skill="TypeScript",
            candidate_level=8,
            required_level=8,
            gap_score=0,
            importance="important",
        )

        data = original.model_dump()
        restored = SkillMatch(**data)
        assert restored.skill == original.skill

    def test_all_models_together(self):
        """Test all models work together."""
        skills = [
            SkillMatch(
                skill="Test",
                candidate_level=5,
                required_level=5,
                gap_score=0,
                importance="important",
            ),
        ]

        transition = CareerTransitionAnalysis(
            transition_feasibility=50,
            transferable_skills=[],
            skill_gaps=[],
            transition_timeline="immediate",
            transition_strategy=[],
        )

        analysis = JobMatchAnalysis(
            overall_match_score=50,
            skill_compatibility=50,
            experience_fit=50,
            cultural_fit=50,
            growth_potential=50,
            skill_matches=skills,
            critical_gaps=[],
            competitive_advantages=[],
            career_transition=transition,
            recommendations=[],
            interview_prep_focus=[],
            confidence_level="medium",
            match_category="fair",
        )

        assert analysis.skill_matches is not None
        assert analysis.career_transition is not None
