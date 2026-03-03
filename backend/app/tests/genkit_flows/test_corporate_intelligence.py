"""
Tests for corporate_intelligence module.
"""

import pytest
from fastapi.testclient import TestClient
from app.genkit_flows.corporate_intelligence import research_company, CorporateProfile
from unittest.mock import patch, MagicMock
from app.services.search_service import SearchService
import json

# Mock SearchService for testing
@pytest.fixture
def mock_search_service():
    with patch('app.genkit_flows.corporate_intelligence.SearchService') as mock:
        yield mock

# Mock genai for testing
@pytest.fixture
def mock_genai():
    with patch('app.genkit_flows.corporate_intelligence.genai') as mock:
        yield mock

# Mock model for testing
@pytest.fixture
def mock_model(mock_genai):
    mock_genai.GenerativeModel.return_value = MagicMock()
    yield mock_genai.GenerativeModel.return_value

# Mock response for testing
@pytest.fixture
def mock_response():
    response = MagicMock()
    response.text = '{"name": "Test Company", "mission_statement": "Test Mission", "core_values": ["Value1", "Value2"], "strategic_focus": "Test Focus", "communication_style": "Test Style", "known_for": "Test Known"}'
    return response

class TestCorporateIntelligence:

    def test_research_company_happy_path(self, mock_search_service, mock_genai, mock_model, mock_response):
        mock_search_service.return_value.research_company.return_value = "Test Research Summary"
        mock_model.generate_content.return_value = mock_response
        company_name = "Test Company"
        profile = research_company(company_name)
        assert isinstance(profile, CorporateProfile)
        assert profile.name == "Test Company"
        assert profile.mission_statement == "Test Mission"
        assert profile.core_values == ["Value1", "Value2"]
        assert profile.strategic_focus == "Test Focus"
        assert profile.communication_style == "Test Style"
        assert profile.known_for == "Test Known"

    def test_research_company_search_service_failure(self, mock_search_service):
        mock_search_service.return_value.research_company.return_value = None
        company_name = "Test Company"
        profile = research_company(company_name)
        assert isinstance(profile, CorporateProfile)
        assert profile.name == "Test Company"
        assert profile.mission_statement == "Information not available (Search failed)"
        assert profile.core_values == ["Professionalism"]
        assert profile.strategic_focus == "General Industry Growth"
        assert profile.communication_style == "Professional"
        assert profile.known_for == "Unknown"

    def test_research_company_genai_not_available(self, mock_search_service):
        import app.genkit_flows.corporate_intelligence
        app.genkit_flows.corporate_intelligence.genai = None
        mock_search_service.return_value.research_company.return_value = "Test Research Summary"
        company_name = "Test Company"
        profile = research_company(company_name)
        assert isinstance(profile, CorporateProfile)
        assert profile.name == "Test Company"
        assert profile.mission_statement == "Test Research Summary"
        assert profile.core_values == ["Professionalism"]
        assert profile.strategic_focus == "General Industry Growth"
        assert profile.communication_style == "Professional"
        assert profile.known_for == "Unknown"

    def test_research_company_genai_error(self, mock_search_service, mock_genai, mock_model, mock_response):
        mock_search_service.return_value.research_company.return_value = "Test Research Summary"
        mock_model.generate_content.side_effect = Exception("Test Error")
        company_name = "Test Company"
        profile = research_company(company_name)
        assert isinstance(profile, CorporateProfile)
        assert profile.name == "Test Company"
        assert profile.mission_statement == "Error parsing research data"
        assert profile.core_values == ["Error"]
        assert profile.strategic_focus == "Error"
        assert profile.communication_style == "Error"
        assert profile.known_for == "Error"

    def test_corporate_profile_schema(self):
        profile_data = {
            "name": "Test Company",
            "mission_statement": "Test Mission",
            "core_values": ["Value1", "Value2"],
            "strategic_focus": "Test Focus",
            "communication_style": "Test Style",
            "known_for": "Test Known"
        }
        CorporateProfile(**profile_data)  # Should not raise an exception

    def test_corporate_profile_name_required(self):
        with pytest.raises(ValueError) as excinfo:
            CorporateProfile(mission_statement="Test Mission", core_values=["Value1"], strategic_focus="Test Focus", communication_style="Test Style", known_for="Test Known")
        assert "name" in str(excinfo.value)

    def test_corporate_profile_core_values_list(self):
        with pytest.raises(ValueError) as excinfo:
            CorporateProfile(name="Test Company", mission_statement="Test Mission", core_values="Value1", strategic_focus="Test Focus", communication_style="Test Style", known_for="Test Known")
        assert "List" in str(excinfo.value)