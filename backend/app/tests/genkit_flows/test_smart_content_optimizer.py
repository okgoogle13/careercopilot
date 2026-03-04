"""Focused tests for the smart content optimizer."""

from types import SimpleNamespace

import pytest

from app.core.ai_error_handling import AIError
from app.genkit_flows import smart_content_optimizer as module


def _optimization_result():
    return module.ContentOptimizationResult(
        original_score=70,
        optimized_score=90,
        improvement_percentage=28.57,
        suggestions=[
            module.OptimizationSuggestion(
                type="word_choice",
                priority="high",
                original_text="utilize",
                suggested_text="use",
                reasoning="More concise and readable",
                impact_score=8,
                location="summary",
            )
        ],
        ats_analysis=module.ATSAnalysis(
            ats_score=85,
            keyword_density=15.0,
            readability_score=75,
            formatting_issues=[],
            missing_keywords=[],
            keyword_placement_suggestions=[],
            section_recommendations=[],
        ),
        optimized_content="Optimized content",
        key_improvements=["Improved readability"],
        next_steps=["Review keyword density"],
        success_metrics=["Increased ATS score"],
    )


class _Model:
    """Simple model stub returning a canned output payload."""

    def __init__(self, result):
        self.result = result

    def generate(self, *args, **kwargs):
        return SimpleNamespace(output=lambda: self.result)


def test_optimize_content_for_job_success(monkeypatch):
    """The optimizer should return the structured model output."""
    monkeypatch.setattr(module, "get_model", lambda: _Model(_optimization_result()))

    result = module.optimize_content_for_job(
        content="Original content",
        job_description="Job description with Python and FastAPI requirements.",
        content_type="resume",
        optimization_goals=["ats_optimization"],
    )

    assert isinstance(result, module.ContentOptimizationResult)
    assert result.optimized_score == 90
    assert result.optimized_content == "Optimized content"


def test_optimize_content_for_job_missing_required_input_raises_ai_error():
    """Validation failures are wrapped by the AI error handler."""
    with pytest.raises(AIError, match="required"):
        module.optimize_content_for_job(
            content="",
            job_description="Job description",
            content_type="resume",
            optimization_goals=["ats_optimization"],
        )


def test_optimize_content_for_job_model_failure_raises_ai_error(monkeypatch):
    """Missing model availability should surface as an AIError."""
    monkeypatch.setattr(module, "get_model", lambda: None)
    monkeypatch.setattr(module, "gemini_pro", SimpleNamespace(), raising=False)

    with pytest.raises(AIError, match="Genkit model not available"):
        module.optimize_content_for_job(
            content="Original content",
            job_description="Job description",
            content_type="resume",
            optimization_goals=[],
        )


def test_optimizer_enums():
    """Enum values should remain stable for callers."""
    assert module.ContentType.RESUME == "resume"
    assert module.OptimizationGoal.ATS_OPTIMIZATION == "ats_optimization"
