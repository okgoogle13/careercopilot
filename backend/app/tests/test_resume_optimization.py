"""
Tests for resume optimization and company analysis features.
"""
<<<<<<< HEAD
import pytest
from unittest.mock import Mock, patch, AsyncMock
=======

import pytest
>>>>>>> restoration-KR-Rage-Figma-v2.0

# Note: These tests require proper Genkit setup and API keys
# For now, they serve as integration test templates

@pytest.mark.asyncio
@pytest.mark.skip(reason="Requires Genkit initialization and API keys")
async def test_resume_optimizer_basic():
    """Test resume optimizer with missing keywords"""
    from app.genkit_flows.resume_optimizer import optimizeResume
<<<<<<< HEAD
    
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
    result = await optimizeResume(
        resumeText="Software engineer with Python experience",
        missingKeywords=["React", "TypeScript"],
        jobDescription="Looking for fullstack developer"
    )
<<<<<<< HEAD
    
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
    assert result.resume_text
    assert len(result.resume_text) > 0


@pytest.mark.asyncio
@pytest.mark.skip(reason="Requires network access and API keys")
async def test_company_analyzer():
    """Test company website analysis"""
    from app.genkit_flows.company_analyzer import analyze_company_website
<<<<<<< HEAD
    
    # Use a known stable website
    result = await analyze_company_website(url="https://www.google.com")
    
=======

    # Use a known stable website
    result = await analyze_company_website(url="https://www.google.com")

>>>>>>> restoration-KR-Rage-Figma-v2.0
    assert result.company_keywords
    assert result.company_tone
    assert len(result.company_keywords) > 0


@pytest.mark.asyncio
async def test_optimize_resume_endpoint_structure():
    """Test that the optimize-resume endpoint exists and has correct structure"""
<<<<<<< HEAD
    from app.api.endpoints.analysis import router, OptimizeResumeRequest, OptimizeResumeResponse
    
=======
    from app.api.endpoints.analysis import OptimizeResumeRequest, OptimizeResumeResponse

>>>>>>> restoration-KR-Rage-Figma-v2.0
    # Verify request model
    request = OptimizeResumeRequest(
        job_description="Test job description",
        company_url="https://example.com"
    )
    assert request.job_description == "Test job description"
    assert request.company_url == "https://example.com"
<<<<<<< HEAD
    
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
    # Verify response model
    response = OptimizeResumeResponse(optimized_text="Test optimized resume")
    assert response.optimized_text == "Test optimized resume"


def test_genkit_flows_exist():
    """Verify that the Genkit flow files exist and can be imported"""
    try:
<<<<<<< HEAD
        from app.genkit_flows.resume_optimizer import optimizeResume, OptimizedResume
        from app.genkit_flows.company_analyzer import analyze_company_website, CompanyAnalysis
=======
        from app.genkit_flows.company_analyzer import CompanyAnalysis, analyze_company_website
        from app.genkit_flows.resume_optimizer import OptimizedResume, optimizeResume
>>>>>>> restoration-KR-Rage-Figma-v2.0
        assert optimizeResume is not None
        assert analyze_company_website is not None
        assert OptimizedResume is not None
        assert CompanyAnalysis is not None
    except ImportError as e:
        pytest.fail(f"Failed to import Genkit flows: {e}")
