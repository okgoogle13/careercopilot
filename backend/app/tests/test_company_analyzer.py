import pytest
import requests
from unittest.mock import patch, Mock
from app.genkit_flows.company_analyzer import analyze_company_website, CompanyAnalysis

@pytest.mark.asyncio
@patch('app.genkit_flows.company_analyzer.requests.get')
@patch('app.genkit_flows.company_analyzer.genkit.init')
@patch('app.genkit_flows.company_analyzer.googleai.init')
@patch('app.genkit_flows.company_analyzer.gemini_pro.generate')
async def test_analyze_company_website_success(mock_gemini_generate, mock_googleai_init, mock_genkit_init, mock_requests_get):
    # Arrange
    mock_html_content = """
    <html>
        <head><title>TestCo</title></head>
        <body>
            <h1>Welcome to TestCo</h1>
            <p>We are an innovative company focused on AI and machine learning solutions. Our core values are collaboration and customer success.</p>
            <p>We use Python, TensorFlow, and React.</p>
        </body>
    </html>
    """

    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.content = mock_html_content.encode('utf-8')
    mock_requests_get.return_value = mock_response

    mock_analysis_result = CompanyAnalysis(
        company_keywords=["AI", "machine learning", "collaboration", "Python", "TensorFlow"],
        company_tone="Innovative and professional"
    )

    mock_gemini_response = Mock()
    mock_gemini_response.output.return_value = mock_analysis_result
    mock_gemini_generate.return_value = mock_gemini_response

    # Act
    result = await analyze_company_website.run(url="http://fakeurl.com")

    # Assert
    assert isinstance(result, CompanyAnalysis)
    assert "AI" in result.company_keywords
    assert "collaboration" in result.company_keywords
    assert result.company_tone == "Innovative and professional"
    mock_requests_get.assert_called_once_with("http://fakeurl.com", headers=pytest.ANY, timeout=10)
    mock_gemini_generate.assert_called_once()


@pytest.mark.asyncio
@patch('app.genkit_flows.company_analyzer.requests.get')
async def test_analyze_company_website_request_fails(mock_requests_get):
    # Arrange
    mock_requests_get.side_effect = requests.exceptions.RequestException("Test error")

    # Act & Assert
    with pytest.raises(ConnectionError):
        await analyze_company_website.run(url="http://fakeurl.com")
