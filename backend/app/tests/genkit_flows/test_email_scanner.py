from unittest.mock import patch, Mock
from app.genkit_flows.email_scanner import extract_job_details_from_email


@patch("app.genkit_flows.email_scanner.gemini_pro")
def test_extract_job_details_from_email_flow(mock_gemini):
    mock_response = Mock()
    mock_response.generate.return_value.text.return_value = '{"company": "Acme", "title": "Engineer", "deadline": "2025-09-01", "source_url": "http://example.com"}'
    mock_gemini.generate.return_value = mock_response.generate.return_value
    result = extract_job_details_from_email("Email content text")
    assert "company" in result
    assert "title" in result
    assert "deadline" in result
    assert "source_url" in result
