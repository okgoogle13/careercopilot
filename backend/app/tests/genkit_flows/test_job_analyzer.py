import pytest
from unittest.mock import patch, Mock
from app.genkit_flows.job_analyzer import analyze_job_description

@patch("app.genkit_flows.job_analyzer.gemini_pro")
def test_analyze_job_description_flow(mock_gemini):
    mock_response = Mock()
    mock_response.generate.return_value.text.return_value = '{"job_title": "Engineer", "key_skills": ["Python"]}'
    mock_gemini.generate.return_value = mock_response.generate.return_value
    result = analyze_job_description("Job description text")
    assert "job_title" in result
    assert "key_skills" in result
