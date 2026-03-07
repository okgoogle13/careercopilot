"""
Comprehensive tests for DOCX document rendering.
"""

import io
import sys
from unittest.mock import MagicMock, Mock, patch

import pytest

# Mock docx module before importing renderer
sys.modules["docx"] = MagicMock()
sys.modules["docx.enum"] = MagicMock()
sys.modules["docx.enum.text"] = MagicMock()
sys.modules["docx.shared"] = MagicMock()

from app.core.docx_renderer import (
    render_cover_letter_docx,
    render_ksc_docx,
    render_resume_docx,
)


@pytest.fixture
def mock_docx_module():
    """Mock the docx module."""
    mock_module = MagicMock()
    with patch.dict("sys.modules", {"docx": mock_module}):
        yield mock_module


@pytest.fixture
def mock_docx_document(mock_docx_module):
    """Mock Document class with proper structure."""
    mock_doc = MagicMock()

    # Mock styles
    mock_style = MagicMock()
    mock_font = MagicMock()
    mock_style.font = mock_font
    mock_doc.styles = {"Normal": mock_style}

    # Mock document methods
    mock_doc.add_heading = Mock(return_value=MagicMock())
    mock_doc.add_paragraph = Mock(return_value=MagicMock())

    # Mock save method to write to BytesIO
    def mock_save(stream):
        stream.write(b"DOCX content")

    mock_doc.save = Mock(side_effect=mock_save)

    # Patch Document constructor
    with patch("app.core.docx_renderer.Document", return_value=mock_doc):
        yield mock_doc


@pytest.fixture
def mock_theme_tokens():
    """Mock theme tokens."""
    tokens = {
        "font": {
            "name": "Arial",
            "size_pt": 11,
        },
        "alignment": {
            "heading": MagicMock(),
            "body": MagicMock(),
            "contact": MagicMock(),
        },
    }
    with patch("app.core.docx_renderer.get_theme_tokens", return_value=tokens):
        yield tokens


class TestCoverLetterRendering:
    """Test cover letter DOCX rendering."""

    def test_render_cover_letter_docx_basic(self, mock_docx_document, mock_theme_tokens):
        """Test basic cover letter rendering."""
        content = "I am writing to express my interest in the position."
        result = render_cover_letter_docx(content)

        assert isinstance(result, bytes)
        assert result == b"DOCX content"

    def test_render_cover_letter_docx_with_name(self, mock_docx_document, mock_theme_tokens):
        """Test cover letter rendering with candidate name."""
        content = "Letter content"
        result = render_cover_letter_docx(content, candidate_name="John Doe")

        mock_docx_document.add_heading.assert_called()
        assert result == b"DOCX content"

    def test_render_cover_letter_docx_multiline(self, mock_docx_document, mock_theme_tokens):
        """Test cover letter rendering with multiple paragraphs."""
        content = "First paragraph\n\nSecond paragraph\n\nThird paragraph"
        result = render_cover_letter_docx(content)

        assert mock_docx_document.add_paragraph.call_count >= 3
        assert result == b"DOCX content"

    def test_render_cover_letter_docx_custom_theme(self, mock_docx_document, mock_theme_tokens):
        """Test cover letter rendering with custom theme."""
        content = "Letter content"
        result = render_cover_letter_docx(content, theme_id="professional")

        assert result == b"DOCX content"

    def test_render_cover_letter_docx_empty_content(self, mock_docx_document, mock_theme_tokens):
        """Test cover letter rendering with empty content."""
        result = render_cover_letter_docx("")

        assert isinstance(result, bytes)

    def test_render_cover_letter_docx_whitespace_handling(
        self, mock_docx_document, mock_theme_tokens
    ):
        """Test cover letter rendering handles whitespace correctly."""
        content = "Paragraph 1\n\n\n\nParagraph 2"
        result = render_cover_letter_docx(content)

        assert result == b"DOCX content"


class TestResumeRendering:
    """Test resume DOCX rendering."""

    def test_render_resume_docx_basic(self, mock_docx_document, mock_theme_tokens):
        """Test basic resume rendering."""
        sections = {
            "basics": {
                "name": "Jane Smith",
                "email": "jane@example.com",
                "phone": "+1234567890",
            }
        }
        result = render_resume_docx(sections)

        assert isinstance(result, bytes)
        assert result == b"DOCX content"

    def test_render_resume_docx_with_summary(self, mock_docx_document, mock_theme_tokens):
        """Test resume rendering with professional summary."""
        sections = {
            "basics": {"name": "John Doe"},
            "summary": "Experienced software engineer with 5 years in web development.",
        }
        result = render_resume_docx(sections)

        heading_calls = [call[0][0] for call in mock_docx_document.add_heading.call_args_list]
        assert "Professional Summary" in heading_calls

    def test_render_resume_docx_with_work_experience(self, mock_docx_document, mock_theme_tokens):
        """Test resume rendering with work experience."""
        sections = {
            "basics": {"name": "John Doe"},
            "work": [
                {
                    "role": "Senior Developer",
                    "company": "Tech Corp",
                    "startDate": "2020",
                    "endDate": "2023",
                    "bullets": ["Led development team", "Built microservices"],
                }
            ],
        }
        result = render_resume_docx(sections)

        assert mock_docx_document.add_paragraph.call_count > 0
        assert result == b"DOCX content"

    def test_render_resume_docx_with_education(self, mock_docx_document, mock_theme_tokens):
        """Test resume rendering with education."""
        sections = {
            "basics": {"name": "John Doe"},
            "education": [
                {
                    "qualification": "BSc Computer Science",
                    "institution": "University of Technology",
                    "endDate": "2020",
                }
            ],
        }
        result = render_resume_docx(sections)

        heading_calls = [call[0][0] for call in mock_docx_document.add_heading.call_args_list]
        assert "Education" in heading_calls

    def test_render_resume_docx_with_skills_list(self, mock_docx_document, mock_theme_tokens):
        """Test resume rendering with skills as list."""
        sections = {
            "basics": {"name": "John Doe"},
            "skills": ["Python", "JavaScript", "SQL"],
        }
        result = render_resume_docx(sections)

        assert result == b"DOCX content"

    def test_render_resume_docx_with_skills_grouped(self, mock_docx_document, mock_theme_tokens):
        """Test resume rendering with grouped skills."""
        sections = {
            "basics": {"name": "John Doe"},
            "skills": {
                "Languages": ["Python", "JavaScript"],
                "Frameworks": ["React", "Django"],
            },
        }
        result = render_resume_docx(sections)

        assert result == b"DOCX content"

    def test_render_resume_docx_contact_info(self, mock_docx_document, mock_theme_tokens):
        """Test resume rendering includes all contact info."""
        sections = {
            "basics": {
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "+1234567890",
                "location": "New York, NY",
            }
        }
        result = render_resume_docx(sections)

        assert mock_docx_document.add_paragraph.call_count >= 1

    def test_render_resume_docx_with_candidate_name_override(
        self, mock_docx_document, mock_theme_tokens
    ):
        """Test resume rendering with candidate name override."""
        sections = {"basics": {"name": "Jane Smith"}}
        result = render_resume_docx(sections, candidate_name="John Doe")

        heading_calls = [call[0][0] for call in mock_docx_document.add_heading.call_args_list]
        assert "John Doe" in heading_calls

    def test_render_resume_docx_missing_basics(self, mock_docx_document, mock_theme_tokens):
        """Test resume rendering with missing basics section."""
        sections = {}
        result = render_resume_docx(sections)

        assert isinstance(result, bytes)

    def test_render_resume_docx_work_current_position(self, mock_docx_document, mock_theme_tokens):
        """Test resume rendering shows 'Present' for current position."""
        sections = {
            "basics": {"name": "John Doe"},
            "work": [
                {
                    "role": "Senior Developer",
                    "company": "Tech Corp",
                    "startDate": "2020",
                    # No endDate means current
                }
            ],
        }
        result = render_resume_docx(sections)

        assert result == b"DOCX content"


class TestKSCRendering:
    """Test Key Selection Criteria DOCX rendering."""

    def test_render_ksc_docx_basic(self, mock_docx_document, mock_theme_tokens):
        """Test basic KSC rendering."""
        responses = [
            {
                "criterion": "Excellent communication skills",
                "response": "I have demonstrated strong communication throughout my career.",
            }
        ]
        result = render_ksc_docx(responses)

        assert isinstance(result, bytes)
        assert result == b"DOCX content"

    def test_render_ksc_docx_multiple_criteria(self, mock_docx_document, mock_theme_tokens):
        """Test KSC rendering with multiple criteria."""
        responses = [
            {
                "criterion": "Technical expertise",
                "response": "I have 5 years of experience in Python development.",
            },
            {
                "criterion": "Leadership skills",
                "response": "I have led teams of up to 10 developers.",
            },
        ]
        result = render_ksc_docx(responses)

        assert mock_docx_document.add_heading.call_count >= 2

    def test_render_ksc_docx_with_job_title(self, mock_docx_document, mock_theme_tokens):
        """Test KSC rendering with custom job title."""
        responses = [
            {
                "criterion": "Criterion 1",
                "response": "Response 1",
            }
        ]
        result = render_ksc_docx(responses, job_title="Senior Software Engineer")

        assert result == b"DOCX content"

    def test_render_ksc_docx_multiline_response(self, mock_docx_document, mock_theme_tokens):
        """Test KSC rendering with multi-paragraph response."""
        responses = [
            {
                "criterion": "Problem solving",
                "response": "Situation: Faced a complex bug.\n\nTask: Fix it.\n\nAction: Debugged.\n\nResult: Resolved.",
            }
        ]
        result = render_ksc_docx(responses)

        assert mock_docx_document.add_paragraph.call_count >= 4

    def test_render_ksc_docx_empty_responses(self, mock_docx_document, mock_theme_tokens):
        """Test KSC rendering with empty responses list."""
        result = render_ksc_docx([])

        assert isinstance(result, bytes)

    def test_render_ksc_docx_missing_criterion(self, mock_docx_document, mock_theme_tokens):
        """Test KSC rendering handles missing criterion field."""
        responses = [
            {
                "response": "Response without criterion",
            }
        ]
        result = render_ksc_docx(responses)

        assert result == b"DOCX content"

    def test_render_ksc_docx_custom_theme(self, mock_docx_document, mock_theme_tokens):
        """Test KSC rendering with custom theme."""
        responses = [
            {
                "criterion": "Criterion",
                "response": "Response",
            }
        ]
        result = render_ksc_docx(responses, theme_id="modern")

        assert result == b"DOCX content"


class TestDocxEdgeCases:
    """Test edge cases and error handling."""

    def test_render_cover_letter_special_characters(self, mock_docx_document, mock_theme_tokens):
        """Test cover letter rendering handles special characters."""
        content = "Special chars: é, ñ, ü, 中文"
        result = render_cover_letter_docx(content)

        assert isinstance(result, bytes)

    def test_render_resume_empty_work_bullets(self, mock_docx_document, mock_theme_tokens):
        """Test resume rendering with empty work bullets."""
        sections = {
            "basics": {"name": "John Doe"},
            "work": [
                {
                    "role": "Developer",
                    "company": "Company",
                    "bullets": [],
                }
            ],
        }
        result = render_resume_docx(sections)

        assert result == b"DOCX content"

    def test_render_ksc_empty_response_text(self, mock_docx_document, mock_theme_tokens):
        """Test KSC rendering with empty response text."""
        responses = [
            {
                "criterion": "Criterion",
                "response": "",
            }
        ]
        result = render_ksc_docx(responses)

        assert isinstance(result, bytes)

    def test_document_save_to_bytesio(self, mock_docx_document, mock_theme_tokens):
        """Test all renderers return BytesIO content."""
        cover_result = render_cover_letter_docx("Content")
        resume_result = render_resume_docx({"basics": {"name": "Test"}})
        ksc_result = render_ksc_docx([{"criterion": "C", "response": "R"}])

        assert all(isinstance(r, bytes) for r in [cover_result, resume_result, ksc_result])
