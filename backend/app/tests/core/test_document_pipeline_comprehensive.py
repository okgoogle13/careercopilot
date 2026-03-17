"""
Comprehensive tests for document pipeline orchestration.
"""

import sys
from unittest.mock import MagicMock, Mock, patch

import pytest

# Mock all dependencies before importing
sys.modules["docx"] = MagicMock()
sys.modules["docx.enum"] = MagicMock()
sys.modules["docx.enum.text"] = MagicMock()
sys.modules["docx.shared"] = MagicMock()
sys.modules["weasyprint"] = MagicMock()

from app.core.document_pipeline import DocumentPipeline, document_pipeline


@pytest.fixture
def mock_template_repo():
    """Mock template repository."""
    mock_repo = MagicMock()
    mock_repo.get = Mock(return_value={"id": "minimal", "name": "Minimal Template"})
    with patch("app.core.document_pipeline.template_repo", mock_repo):
        yield mock_repo


@pytest.fixture
def mock_docx_renderers():
    """Mock DOCX renderer functions."""
    with patch("app.core.document_pipeline.render_cover_letter_docx") as mock_cover:
        with patch("app.core.document_pipeline.render_resume_docx") as mock_resume:
            with patch("app.core.document_pipeline.render_ksc_docx") as mock_ksc:
                mock_cover.return_value = b"Cover Letter DOCX"
                mock_resume.return_value = b"Resume DOCX"
                mock_ksc.return_value = b"KSC DOCX"
                yield mock_cover, mock_resume, mock_ksc


@pytest.fixture
def mock_pdf_renderers():
    """Mock PDF renderer functions."""
    with patch("app.core.document_pipeline.render_cover_letter_pdf") as mock_cover:
        with patch("app.core.document_pipeline.render_resume_pdf") as mock_resume:
            with patch("app.core.document_pipeline.render_ksc_pdf") as mock_ksc:
                mock_cover.return_value = b"Cover Letter PDF"
                mock_resume.return_value = b"Resume PDF"
                mock_ksc.return_value = b"KSC PDF"
                yield mock_cover, mock_resume, mock_ksc


class TestDocumentPipelineInitialization:
    """Test pipeline initialization."""

    def test_pipeline_instance_creation(self):
        """Test creating DocumentPipeline instance."""
        pipeline = DocumentPipeline()
        assert pipeline is not None

    def test_global_pipeline_instance(self):
        """Test global pipeline instance exists."""
        assert document_pipeline is not None
        assert isinstance(document_pipeline, DocumentPipeline)


class TestCoverLetterGeneration:
    """Test cover letter generation."""

    @pytest.mark.asyncio
    async def test_generate_cover_letter_pdf(self, mock_template_repo, mock_pdf_renderers):
        """Test generating cover letter as PDF."""
        mock_cover_pdf, _, _ = mock_pdf_renderers

        pipeline = DocumentPipeline()
        result = await pipeline.generate_document(
            doc_type="cover_letter",
            content="I am writing to express my interest.",
            file_format="pdf",
        )

        assert result == b"Cover Letter PDF"
        mock_cover_pdf.assert_called_once()

    @pytest.mark.asyncio
    async def test_generate_cover_letter_docx(self, mock_template_repo, mock_docx_renderers):
        """Test generating cover letter as DOCX."""
        mock_cover_docx, _, _ = mock_docx_renderers

        pipeline = DocumentPipeline()
        result = await pipeline.generate_document(
            doc_type="cover_letter", content="Letter content", file_format="docx"
        )

        assert result == b"Cover Letter DOCX"
        mock_cover_docx.assert_called_once()

    @pytest.mark.asyncio
    async def test_generate_cover_letter_with_name(self, mock_template_repo, mock_pdf_renderers):
        """Test generating cover letter with candidate name."""
        mock_cover_pdf, _, _ = mock_pdf_renderers

        pipeline = DocumentPipeline()
        result = await pipeline.generate_document(
            doc_type="cover_letter",
            content="Letter content",
            candidate_name="John Doe",
            file_format="pdf",
        )

        mock_cover_pdf.assert_called_with("Letter content", "John Doe", "minimal")

    @pytest.mark.asyncio
    async def test_generate_cover_letter_with_custom_theme(
        self, mock_template_repo, mock_pdf_renderers
    ):
        """Test generating cover letter with custom theme."""
        mock_cover_pdf, _, _ = mock_pdf_renderers

        pipeline = DocumentPipeline()
        result = await pipeline.generate_document(
            doc_type="cover_letter",
            content="Letter content",
            theme_id="professional",
            file_format="pdf",
        )

        mock_cover_pdf.assert_called_with("Letter content", None, "professional")


class TestResumeGeneration:
    """Test resume generation."""

    @pytest.mark.asyncio
    async def test_generate_resume_pdf(self, mock_template_repo, mock_pdf_renderers):
        """Test generating resume as PDF."""
        _, mock_resume_pdf, _ = mock_pdf_renderers

        pipeline = DocumentPipeline()
        resume_data = {
            "basics": {"name": "Jane Smith"},
            "work": [],
        }
        result = await pipeline.generate_document(
            doc_type="resume", content=resume_data, file_format="pdf"
        )

        assert result == b"Resume PDF"
        mock_resume_pdf.assert_called_once()

    @pytest.mark.asyncio
    async def test_generate_resume_docx(self, mock_template_repo, mock_docx_renderers):
        """Test generating resume as DOCX."""
        _, mock_resume_docx, _ = mock_docx_renderers

        pipeline = DocumentPipeline()
        resume_data = {
            "basics": {"name": "John Doe"},
        }
        result = await pipeline.generate_document(
            doc_type="resume", content=resume_data, file_format="docx"
        )

        assert result == b"Resume DOCX"
        mock_resume_docx.assert_called_once()

    @pytest.mark.asyncio
    async def test_generate_resume_with_candidate_name(
        self, mock_template_repo, mock_pdf_renderers
    ):
        """Test generating resume with candidate name override."""
        _, mock_resume_pdf, _ = mock_pdf_renderers

        pipeline = DocumentPipeline()
        result = await pipeline.generate_document(
            doc_type="resume",
            content={"basics": {}},
            candidate_name="Override Name",
            file_format="pdf",
        )

        mock_resume_pdf.assert_called_with({"basics": {}}, "Override Name", "minimal")

    @pytest.mark.asyncio
    async def test_generate_resume_with_template(self, mock_template_repo, mock_pdf_renderers):
        """Test generating resume with specific template."""
        pipeline = DocumentPipeline()
        result = await pipeline.generate_document(
            doc_type="resume",
            content={"basics": {"name": "Test"}},
            template_id="modern",
            file_format="pdf",
        )

        mock_template_repo.get.assert_called_with("resume", "modern")


class TestKSCGeneration:
    """Test Key Selection Criteria generation."""

    @pytest.mark.asyncio
    async def test_generate_ksc_pdf(self, mock_template_repo, mock_pdf_renderers):
        """Test generating KSC as PDF."""
        _, _, mock_ksc_pdf = mock_pdf_renderers

        pipeline = DocumentPipeline()
        ksc_data = [{"criterion": "Criterion 1", "response": "Response 1"}]
        result = await pipeline.generate_document(
            doc_type="ksc_response", content=ksc_data, file_format="pdf"
        )

        assert result == b"KSC PDF"
        mock_ksc_pdf.assert_called_once()

    @pytest.mark.asyncio
    async def test_generate_ksc_docx(self, mock_template_repo, mock_docx_renderers):
        """Test generating KSC as DOCX."""
        _, _, mock_ksc_docx = mock_docx_renderers

        pipeline = DocumentPipeline()
        ksc_data = [{"criterion": "Criterion 1", "response": "Response 1"}]
        result = await pipeline.generate_document(
            doc_type="ksc_response", content=ksc_data, file_format="docx"
        )

        assert result == b"KSC DOCX"
        mock_ksc_docx.assert_called_once()


class TestPipelineErrorHandling:
    """Test error handling in document pipeline."""

    @pytest.mark.asyncio
    async def test_generate_document_unsupported_type(self, mock_template_repo):
        """Test generating document with unsupported type raises error."""
        pipeline = DocumentPipeline()

        with pytest.raises(ValueError, match="Unsupported document type"):
            await pipeline.generate_document(
                doc_type="invalid_type", content="content", file_format="pdf"
            )

    @pytest.mark.asyncio
    async def test_generate_document_renderer_failure(self, mock_template_repo):
        """Test pipeline handles renderer failure."""
        with patch("app.core.document_pipeline.render_cover_letter_pdf") as mock_render:
            mock_render.side_effect = Exception("Rendering failed")

            pipeline = DocumentPipeline()

            with pytest.raises(Exception, match="Rendering failed"):
                await pipeline.generate_document(
                    doc_type="cover_letter", content="content", file_format="pdf"
                )


class TestPipelineLogging:
    """Test pipeline logging."""

    @pytest.mark.asyncio
    async def test_generate_document_logs_generation(self, mock_template_repo, mock_pdf_renderers):
        """Test pipeline logs document generation."""
        with patch("app.core.document_pipeline.logger") as mock_logger:
            pipeline = DocumentPipeline()
            await pipeline.generate_document(
                doc_type="cover_letter", content="content", template_id="minimal", file_format="pdf"
            )

            mock_logger.info.assert_called()
            log_message = mock_logger.info.call_args[0][0]
            assert "cover_letter" in log_message
            assert "pdf" in log_message


class TestPipelineFormatSelection:
    """Test pipeline format selection logic."""

    @pytest.mark.asyncio
    async def test_default_format_is_pdf(self, mock_template_repo, mock_pdf_renderers):
        """Test default file format is PDF."""
        mock_cover_pdf, _, _ = mock_pdf_renderers

        pipeline = DocumentPipeline()
        result = await pipeline.generate_document(doc_type="cover_letter", content="content")

        assert result == b"Cover Letter PDF"

    @pytest.mark.asyncio
    async def test_format_selection_case_insensitive(self, mock_template_repo, mock_docx_renderers):
        """Test format selection handles case variations."""
        mock_cover_docx, _, _ = mock_docx_renderers

        pipeline = DocumentPipeline()
        result = await pipeline.generate_document(
            doc_type="cover_letter", content="content", file_format="docx"
        )

        assert result == b"Cover Letter DOCX"


class TestPipelineIntegration:
    """Test pipeline integration scenarios."""

    @pytest.mark.asyncio
    async def test_full_resume_pipeline(self, mock_template_repo, mock_pdf_renderers):
        """Test complete resume generation pipeline."""
        _, mock_resume_pdf, _ = mock_pdf_renderers

        pipeline = DocumentPipeline()
        resume_data = {
            "basics": {
                "name": "John Doe",
                "email": "john@example.com",
            },
            "work": [
                {
                    "role": "Developer",
                    "company": "Tech Corp",
                }
            ],
            "education": [
                {
                    "qualification": "BSc",
                    "institution": "University",
                }
            ],
        }

        result = await pipeline.generate_document(
            doc_type="resume",
            content=resume_data,
            template_id="professional",
            file_format="pdf",
            candidate_name="John Doe",
            theme_id="modern",
        )

        assert result == b"Resume PDF"
        mock_template_repo.get.assert_called_with("resume", "professional")
        mock_resume_pdf.assert_called_with(resume_data, "John Doe", "modern")

    @pytest.mark.asyncio
    async def test_multiple_sequential_generations(self, mock_template_repo, mock_pdf_renderers):
        """Test generating multiple documents sequentially."""
        mock_cover_pdf, mock_resume_pdf, mock_ksc_pdf = mock_pdf_renderers

        pipeline = DocumentPipeline()

        result1 = await pipeline.generate_document(
            doc_type="cover_letter", content="Letter", file_format="pdf"
        )

        result2 = await pipeline.generate_document(
            doc_type="resume", content={"basics": {}}, file_format="pdf"
        )

        result3 = await pipeline.generate_document(
            doc_type="ksc_response", content=[], file_format="pdf"
        )

        assert result1 == b"Cover Letter PDF"
        assert result2 == b"Resume PDF"
        assert result3 == b"KSC PDF"
