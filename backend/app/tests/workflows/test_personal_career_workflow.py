"""Unit tests for the PersonalCareerWorkflow."""
import pytest
import json
from unittest.mock import MagicMock, patch, AsyncMock
from app.workflows.personal_career_workflow import PersonalCareerWorkflow

@pytest.fixture
def workflow():
    """Fixture to initialize PersonalCareerWorkflow with mocked dependencies."""
    with patch("app.workflows.personal_career_workflow.get_personal_config") as mock_config, \
         patch("app.workflows.personal_career_workflow.get_ai_client") as mock_ai_client, \
         patch("app.workflows.personal_career_workflow.get_ai_prompt_builder") as mock_prompt_builder, \
         patch("app.workflows.personal_career_workflow.get_template_service") as mock_template_service:
        
        mock_config.return_value = MagicMock(
            career_transition_from="Finance",
            career_transition_to="Social Work",
            location="Melbourne, VIC",
            salary_range={"min": 60000, "max": 100000},
            target_roles=["Social Worker", "Case Manager"]
        )
        
        return PersonalCareerWorkflow()

@pytest.mark.asyncio
async def test_salary_intelligence(workflow):
    """Test salary intelligence research and generation."""
    with patch("app.workflows.personal_career_workflow.web_search", new_callable=AsyncMock) as mock_search:
        mock_search.return_value = [{"title": "Salary Data", "url": "http://salary.com"}]
        
        mock_response = {
            "salary_range": "$70k - $90k",
            "negotiation_tips": ["Highlight finance skills"],
            "market_comparison": "Competitive"
        }
        workflow.ai_prompt_builder.generate_ai_response = AsyncMock(return_value=json.dumps(mock_response))
        
        result = await workflow.salary_intelligence("Social Worker", "Acme Corp", "Sydney")
        
        assert result == mock_response
        assert mock_search.called
        workflow.ai_prompt_builder.generate_ai_response.assert_called_once()

@pytest.mark.asyncio
async def test_analyze_skills_trends(workflow):
    """Test skill trends analysis."""
    job_listings = [{"description": "Looking for Python developer"}]
    mock_response = {
        "top_skills": ["Python"],
        "trending_skills": ["FastAPI"],
        "development_plan": "Take a course"
    }
    workflow.ai_prompt_builder.generate_ai_response = AsyncMock(return_value=json.dumps(mock_response))
    
    result = await workflow.analyze_skills_trends(job_listings)
    
    assert result == mock_response
    workflow.ai_prompt_builder.generate_ai_response.assert_called_once()

@pytest.mark.asyncio
async def test_generate_interview_prep(workflow):
    """Test interview preparation generation."""
    mock_response = {
        "questions": ["Why social work?"],
        "suggested_answers": ["Transferable skills"],
        "candidate_questions": ["What is the culture?"]
    }
    workflow.ai_prompt_builder.generate_ai_response = AsyncMock(return_value=json.dumps(mock_response))
    
    result = await workflow.generate_interview_prep("Job desc", {"name": "Company"})
    
    assert result == mock_response
    workflow.ai_prompt_builder.generate_ai_response.assert_called_once()

@pytest.mark.asyncio
async def test_daily_job_discovery(workflow):
    """Test daily job discovery routine."""
    result = await workflow.daily_job_discovery()
    
    assert result["success"] is True
    assert result["total_jobs_found"] > 0
    assert "jobs" in result

@pytest.mark.asyncio
async def test_apply_to_job(workflow):
    """Test complete job application process."""
    with patch.object(workflow, "quick_company_research", new_callable=AsyncMock) as mock_research, \
         patch.object(workflow, "generate_interview_prep", new_callable=AsyncMock) as mock_interview:
        
        mock_research.return_value = {
            "success": True,
            "job_details": {"title": "Worker", "company": "Care", "description": "Desc"},
            "talking_points": "Points"
        }
        
        mock_materials = {
            "email_application": MagicMock(subject_line="Sub", content="Cont", placeholders={}),
            "cover_letter": MagicMock(content="CL", placeholders={}),
            "follow_up_email": MagicMock(subject_line="Sub", content="Cont", placeholders={}),
            "interview_thank_you": MagicMock(subject_line="Sub", content="Cont", placeholders={})
        }
        workflow.template_service.generate_application_materials = AsyncMock(return_value=mock_materials)
        mock_interview.return_value = {"success": True}
        
        result = await workflow.apply_to_job("http://job.com")
        
        assert result["success"] is True
        assert result["job_title"] == "Worker"
        assert "application_materials" in result

@pytest.mark.asyncio
async def test_quick_company_research(workflow):
    """Test quick company research generation."""
    workflow.ai_prompt_builder.generate_ai_response = AsyncMock(side_effect=["Points", "Strategy"])
    
    result = await workflow.quick_company_research("http://company.com")
    
    assert result["success"] is True
    assert "job_details" in result
    assert result["talking_points"] == "Points"
    assert result["application_strategy"] == "Strategy"

@pytest.mark.asyncio
async def test_weekly_review(workflow):
    """Test weekly review generation."""
    workflow.ai_prompt_builder.generate_ai_response = AsyncMock(return_value="Review summary")
    
    result = await workflow.weekly_review()
    
    assert result["success"] is True
    assert result["analysis"]["summary"] == "Review summary"

@pytest.mark.asyncio
async def test_generate_email_template(workflow):
    """Test email template generation."""
    mock_template = MagicMock(
        subject_line="Sub", content="Body", placeholders={}, 
        customization_tips=[], generated_at="now"
    )
    workflow.template_service.generate_template = AsyncMock(return_value=mock_template)
    
    result = await workflow.generate_email_template("application", "Dev", "Google")
    
    assert result["success"] is True
    assert result["subject_line"] == "Sub"
    workflow.template_service.generate_template.assert_called_once()

@pytest.mark.asyncio
async def test_generate_cover_letter_template(workflow):
    """Test cover letter template generation."""
    mock_template = MagicMock(
        content="CL Body", placeholders={}, 
        customization_tips=[], generated_at="now"
    )
    workflow.template_service.generate_template = AsyncMock(return_value=mock_template)
    
    result = await workflow.generate_cover_letter_template("Dev", "Google")
    
    assert result["success"] is True
    assert result["content"] == "CL Body"
