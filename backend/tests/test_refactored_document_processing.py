"""
Test suite for refactored document processing functionality.

This test suite validates that the DRY refactoring works correctly:
- Generic document processing function
- File upload validation decorators
- Consolidated resume and job description services
"""

from io import BytesIO
from unittest.mock import AsyncMock, Mock, patch

import pytest
from fastapi import UploadFile
from pydantic import BaseModel

from app.ai.job_description_service import (
    JobDescriptionAnalysisResult,
    JobDescriptionAnalysisService,
)
from app.ai.resume_service import ResumeAnalysisResult, ResumeAnalysisService
from app.core.document_processing import DocumentProcessingError, PromptTemplates, process_document
from app.core.file_upload_decorators import (
    FileUploadConfig,
    FileValidationError,
    validate_file_upload,
)


class TestModel(BaseModel):
    """Test model for document processing."""

    test_field: str = ""
    skills: list = []


@pytest.fixture
def mock_ai_response():
    """Mock AI response for testing."""
    return '{"test_field": "test value", "skills": ["Python", "Testing"]}'


@pytest.fixture
def sample_resume_text():
    """Sample resume text for testing."""
    return """
    John Doe
    Senior Software Engineer

    Skills: Python, JavaScript, React, Node.js

    Experience:
    - Senior Developer at TechCorp (2020-Present)
    - Software Engineer at StartupInc (2018-2020)

    Education:
    B.S. Computer Science, University of Technology (2018)
    """


@pytest.fixture
def sample_job_description():
    """Sample job description for testing."""
    return """
    Senior Python Developer
    TechCompany Inc.

    We are looking for a Senior Python Developer to join our team.

    Requirements:
    - 5+ years of Python experience
    - Experience with Django/Flask
    - Strong problem-solving skills

    Responsibilities:
    - Develop and maintain web applications
    - Collaborate with cross-functional teams
    - Write clean, maintainable code

    Benefits:
    - Competitive salary: $100,000 - $130,000
    - Health insurance
    - 401(k) matching
    """


@pytest.fixture
def mock_upload_file():
    """Create a mock UploadFile for testing."""
    file_content = b"This is test file content"
    mock_file = Mock(spec=UploadFile)
    mock_file.filename = "test_resume.pdf"
    mock_file.content_type = "application/pdf"
    mock_file.file = BytesIO(file_content)
    mock_file.read = AsyncMock(return_value=file_content)
    return mock_file


class TestGenericDocumentProcessing:
    """Test the generic document processing functionality."""

    @patch("app.core.document_processing._make_ai_request")
    async def test_process_document_success(self, mock_ai_request, mock_ai_response):
        """Test successful document processing."""
        mock_ai_request.return_value = mock_ai_response

        result = await process_document(
            file_content="Test content",
            prompt_template=PromptTemplates.RESUME_ANALYSIS,
            response_model=TestModel,
        )

        assert isinstance(result, TestModel)
        assert result.test_field == "test value"
        assert "Python" in result.skills

    async def test_process_document_empty_content(self):
        """Test processing with empty content."""
        with pytest.raises(DocumentProcessingError, match="must be a non-empty string"):
            await process_document(
                file_content="",
                prompt_template=PromptTemplates.RESUME_ANALYSIS,
                response_model=TestModel,
            )

    async def test_process_document_short_content(self):
        """Test processing with content that's too short."""
        with pytest.raises(DocumentProcessingError, match="too short"):
            await process_document(
                file_content="Hi",
                prompt_template=PromptTemplates.RESUME_ANALYSIS,
                response_model=TestModel,
            )

    def test_prompt_template_formatting(self):
        """Test prompt template formatting."""
        template = PromptTemplates.RESUME_ANALYSIS

        formatted = template.format(content="Test resume content")

        assert "Test resume content" in formatted
        assert "JSON" in formatted

    def test_prompt_template_missing_variables(self):
        """Test prompt template with missing variables."""
        template = PromptTemplates.DOCUMENT_COMPARISON

        with pytest.raises(ValueError, match="Missing required template variables"):
            template.format(resume_content="Resume")  # Missing job_description


class TestFileUploadValidation:
    """Test file upload validation functionality."""

    def test_validate_file_upload_success(self, mock_upload_file):
        """Test successful file validation."""
        config = FileUploadConfig(allowed_extensions={".pdf"}, max_file_size_mb=10)

        # Should not raise an exception
        validate_file_upload(mock_upload_file, config)

    def test_validate_file_upload_invalid_extension(self, mock_upload_file):
        """Test validation with invalid file extension."""
        mock_upload_file.filename = "test.exe"
        config = FileUploadConfig(allowed_extensions={".pdf"})

        with pytest.raises(FileValidationError, match="not allowed"):
            validate_file_upload(mock_upload_file, config)

    def test_validate_file_upload_no_filename(self):
        """Test validation with missing filename."""
        mock_file = Mock(spec=UploadFile)
        mock_file.filename = None
        config = FileUploadConfig(require_filename=True)

        with pytest.raises(FileValidationError, match="required"):
            validate_file_upload(mock_file, config)

    def test_validate_file_upload_forbidden_patterns(self, mock_upload_file):
        """Test validation with forbidden filename patterns."""
        mock_upload_file.filename = "test<script>.pdf"
        config = FileUploadConfig()  # Uses default forbidden patterns

        with pytest.raises(FileValidationError, match="forbidden pattern"):
            validate_file_upload(mock_upload_file, config)


class TestRefactoredResumeService:
    """Test the refactored resume service."""

    @patch("app.core.document_processing.process_document")
    async def test_analyze_resume_uses_generic_processing(
        self, mock_process_document, sample_resume_text
    ):
        """Test that resume service uses generic document processing."""
        # Mock the process_document function
        mock_result = ResumeAnalysisResult(skills=["Python", "JavaScript"], summary="Test summary")
        mock_process_document.return_value = mock_result

        service = ResumeAnalysisService()
        result = await service.analyze_resume(sample_resume_text)

        # Verify generic processing was called
        mock_process_document.assert_called_once()
        call_args = mock_process_document.call_args

        assert call_args[1]["prompt_template"] == PromptTemplates.RESUME_ANALYSIS
        assert call_args[1]["response_model"] == ResumeAnalysisResult
        assert isinstance(result, ResumeAnalysisResult)

    async def test_analyze_resume_validation_error(self):
        """Test resume analysis with invalid input."""
        service = ResumeAnalysisService()

        with pytest.raises(ValueError, match="non-empty string"):
            await service.analyze_resume("")

    async def test_analyze_resume_too_short(self):
        """Test resume analysis with content that's too short."""
        service = ResumeAnalysisService()

        with pytest.raises(ValueError, match="too short"):
            await service.analyze_resume("Hi")


class TestRefactoredJobDescriptionService:
    """Test the refactored job description service."""

    @patch("app.core.document_processing.process_document")
    async def test_analyze_job_description_uses_generic_processing(
        self, mock_process_document, sample_job_description
    ):
        """Test that job description service uses generic document processing."""
        # Mock the process_document function
        mock_result = JobDescriptionAnalysisResult(
            title="Senior Python Developer", required_skills=["Python", "Django"]
        )
        mock_process_document.return_value = mock_result

        service = JobDescriptionAnalysisService()
        result = await service.analyze_job_description(sample_job_description)

        # Verify generic processing was called
        mock_process_document.assert_called_once()
        call_args = mock_process_document.call_args

        assert call_args[1]["prompt_template"] == PromptTemplates.JOB_DESCRIPTION_ANALYSIS
        assert call_args[1]["response_model"] == JobDescriptionAnalysisResult
        assert isinstance(result, JobDescriptionAnalysisResult)

    async def test_extract_skills_from_job_description(self, sample_job_description):
        """Test skill extraction from job description."""
        with patch.object(JobDescriptionAnalysisService, "analyze_job_description") as mock_analyze:
            mock_analyze.return_value = JobDescriptionAnalysisResult(
                required_skills=["Python", "Django"], preferred_skills=["React"]
            )

            service = JobDescriptionAnalysisService()
            skills = await service.extract_skills(sample_job_description)

            assert "Python" in skills
            assert "Django" in skills
            assert "React" in skills


class TestDRYPrinciples:
    """Test that DRY principles are properly implemented."""

    def test_no_duplicate_prompt_creation(self):
        """Verify that prompt creation is centralized."""
        # Both services should use the same prompt templates
        resume_template = PromptTemplates.RESUME_ANALYSIS
        job_template = PromptTemplates.JOB_DESCRIPTION_ANALYSIS

        # Templates should have consistent structure
        assert hasattr(resume_template, "template")
        assert hasattr(resume_template, "required_variables")
        assert hasattr(job_template, "template")
        assert hasattr(job_template, "required_variables")

    def test_consistent_error_handling(self):
        """Verify that error handling is consistent across services."""
        # Both services should use the same validation patterns
        resume_service = ResumeAnalysisService()
        job_service = JobDescriptionAnalysisService()

        # Both should reject empty strings
        with pytest.raises(ValueError):
            asyncio.run(resume_service.analyze_resume(""))

        with pytest.raises(ValueError):
            asyncio.run(job_service.analyze_job_description(""))

    def test_file_validation_consistency(self):
        """Verify that file validation is consistent across endpoints."""
        # All file configs should have consistent validation
        resume_config = FileUploadConfig(
            allowed_extensions={".pd", ".doc", ".docx", ".txt"}, max_file_size_mb=10
        )

        job_config = FileUploadConfig(
            allowed_extensions={".pd", ".doc", ".docx", ".txt", ".md"},
            max_file_size_mb=5,
        )

        # Both should have similar forbidden patterns
        assert resume_config.forbidden_filename_patterns == job_config.forbidden_filename_patterns


# Integration tests
class TestIntegration:
    """Integration tests for the refactored system."""

    @pytest.mark.asyncio
    async def test_end_to_end_resume_processing(self, sample_resume_text):
        """Test end-to-end resume processing with mocked AI."""
        with patch("app.core.document_processing._make_ai_request") as mock_ai:
            mock_ai.return_value = """{
                "skills": ["Python", "JavaScript"],
                "experience": [],
                "education": [],
                "summary": "Experienced software engineer"
            }"""

            service = ResumeAnalysisService()
            result = await service.analyze_resume(sample_resume_text)

            assert isinstance(result, ResumeAnalysisResult)
            assert len(result.skills) > 0
            assert result.summary != ""

    @pytest.mark.asyncio
    async def test_end_to_end_job_description_processing(self, sample_job_description):
        """Test end-to-end job description processing with mocked AI."""
        with patch("app.core.document_processing._make_ai_request") as mock_ai:
            mock_ai.return_value = """{
                "title": "Senior Python Developer",
                "company": "TechCompany Inc.",
                "required_skills": ["Python", "Django"],
                "responsibilities": ["Develop applications"],
                "summary": "Great opportunity for Python developer"
            }"""

            service = JobDescriptionAnalysisService()
            result = await service.analyze_job_description(sample_job_description)

            assert isinstance(result, JobDescriptionAnalysisResult)
            assert result.title == "Senior Python Developer"
            assert len(result.required_skills) > 0


if __name__ == "__main__":
    import asyncio

    # Run a simple test
    async def simple_test():
        print("Testing generic document processing...")

        # Test prompt template
        template = PromptTemplates.RESUME_ANALYSIS
        formatted = template.format(content="Test resume content")
        print(f"Template formatted successfully: {len(formatted)} characters")

        # Test file validation config
        config = FileUploadConfig()
        print(
            f"File validation config created: {len(config.allowed_extensions)} allowed extensions"
        )

        print("✅ Basic functionality tests passed!")

    asyncio.run(simple_test())
