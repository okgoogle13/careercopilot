"""Validation tests for master_profile_schema models."""

import pytest
from pydantic import ValidationError

from app.models.master_profile_schema import (
    KeySelectionCriteriaExample,
    MasterCareerProfile,
    PersonalInfo,
    Skills,
)


def _valid_personal_info() -> PersonalInfo:
    return PersonalInfo(
        name="Jane Smith",
        email="jane@example.com",
        summary="Experienced social worker transitioning into community services leadership.",
    )


def _valid_skills() -> Skills:
    return Skills(
        technical=["Case Management"],
        tools=["Salesforce"],
        soft=["Communication"],
        methodologies=["STAR"],
    )


def test_master_profile_valid_minimum_payload():
    profile = MasterCareerProfile(personalInfo=_valid_personal_info(), skills=_valid_skills())

    assert profile.personalInfo.name == "Jane Smith"
    assert profile.skills.tools == ["Salesforce"]
    assert profile.workExperience == []


def test_personal_info_rejects_invalid_email():
    with pytest.raises(ValidationError):
        PersonalInfo(name="Jane", email="not-an-email", summary="summary")


def test_personal_info_rejects_invalid_linkedin_url():
    with pytest.raises(ValidationError):
        PersonalInfo(
            name="Jane",
            email="jane@example.com",
            summary="summary",
            linkedin="invalid-url",
        )


def test_ksc_example_requires_related_skills():
    with pytest.raises(ValidationError):
        KeySelectionCriteriaExample(criteria="Criteria", example="STAR response")


def test_default_list_fields_are_instance_isolated():
    one = MasterCareerProfile(personalInfo=_valid_personal_info(), skills=_valid_skills())
    two = MasterCareerProfile(personalInfo=_valid_personal_info(), skills=_valid_skills())

    one.certifications.append("Mental Health First Aid")

    assert two.certifications == []
