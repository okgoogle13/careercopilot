"""Focused tests for the extract-job-requirements flow."""

from types import SimpleNamespace

from app.genkit_flows import extract_job_requirements as module


def test_extract_job_requirements_happy_path(monkeypatch):
    """The flow should return the structured model output."""
    expected = module.JobRequirements(
        requiredSkills=["Python", "Django"],
        preferredSkills=["AWS"],
        experienceLevel="Senior",
    )
    fake_model = SimpleNamespace(
        generate=lambda *args, **kwargs: SimpleNamespace(output=lambda: expected)
    )
    monkeypatch.setattr("app.genkit_flows.shared.get_model", lambda: fake_model)

    result = module.extractJobRequirements(
        "Senior Software Engineer with Python, Django, and AWS experience."
    )

    assert result == expected


def test_extract_job_requirements_edge_case_empty_description(monkeypatch):
    """Empty descriptions should still return a valid schema payload from the model."""
    expected = module.JobRequirements(
        requiredSkills=[],
        preferredSkills=[],
        experienceLevel="Unknown",
    )
    fake_model = SimpleNamespace(
        generate=lambda *args, **kwargs: SimpleNamespace(output=lambda: expected)
    )
    monkeypatch.setattr("app.genkit_flows.shared.get_model", lambda: fake_model)

    result = module.extractJobRequirements("")

    assert result.requiredSkills == []
    assert result.preferredSkills == []
    assert result.experienceLevel == "Unknown"


def test_prompt_template_and_schema_are_wired():
    """The module should expose the expected prompt template and schema."""
    assert "{input_text}" in module.JOB_PROMPT_TEMPLATE

    payload = module.JobRequirements(
        requiredSkills=["Python"],
        preferredSkills=[],
        experienceLevel="Mid-level",
    )

    assert payload.requiredSkills == ["Python"]
