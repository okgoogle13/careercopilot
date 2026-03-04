import pytest
from pydantic import ValidationError

from app.models.profile import ProfileUpdate, ProfileVariationCreate


class TestProfileUpdate:
    def test_profile_update_empty(self):
        model = ProfileUpdate()
        assert model.name is None
        assert model.location is None

    def test_profile_update_with_values(self):
        model = ProfileUpdate(name="John Doe", location="New York")
        assert model.name == "John Doe"
        assert model.location == "New York"


class TestProfileVariationCreate:
    def test_profile_variation_create_valid(self):
        model = ProfileVariationCreate(
            name="Tech Profile", keywords=["python", "fastapi"], skills=["backend"]
        )
        assert model.name == "Tech Profile"
        assert model.keywords == ["python", "fastapi"]
        assert model.skills == ["backend"]

    def test_profile_variation_create_missing_name(self):
        with pytest.raises(ValidationError):
            ProfileVariationCreate(keywords=["python"])

    def test_profile_variation_create_optional_fields(self):
        model = ProfileVariationCreate(name="Basic")
        assert model.name == "Basic"
        assert model.keywords is None
        assert model.skills is None
