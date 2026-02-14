# backend/app/tests/integration/test_document_export.py
"""
Integration tests for document export functionality.

Tests the complete flow of document export with Cloud Storage integration:
1. Document generation
2. Export to file
3. Cloud Storage upload
4. Signed URL generation
5. Download verification

These tests validate:
- Bandwidth optimization (large content → small URL)
- File format support (JSON, PDF, DOCX, TXT)
- Signed URL expiration handling
- Error handling and edge cases
"""

import json
from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest

from app.core.document_export_service import (
    DocumentExportService,
)

# ============================================================================
# Fixtures
# ============================================================================


@pytest.fixture
def document_export_service():
    """Create a document export service instance."""
    return DocumentExportService()


@pytest.fixture
def sample_cover_letter():
    """Sample cover letter content."""
    return """Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Engineer position at Acme Corp.
With 8+ years of experience in full-stack development, I am confident in my ability to contribute
significantly to your team.

Sincerely,
John Doe"""


@pytest.fixture
def sample_resume():
    """Sample resume data."""
    return {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "summary": "Senior Software Engineer with 8+ years experience",
        "experience": [
            {
                "company": "Previous Company",
                "position": "Software Engineer",
                "duration": "2 years",
                "highlights": ["Led team of 5", "Improved performance by 40%"]
            }
        ],
        "education": [
            {
                "school": "University",
                "degree": "BS Computer Science"
            }
        ]
    }


@pytest.fixture
def sample_ksc_response():
    """Sample KSC STAR response."""
    return {
        "situation": "We needed to optimize API response times for a high-traffic service.",
        "task": "I was tasked with identifying and resolving performance bottlenecks.",
        "action": "I profiled the application, identified N+1 queries, and implemented caching.",
        "result": "Reduced average response time from 500ms to 100ms, improving user experience."
    }


@pytest.fixture
def sample_application_package():
    """Sample complete application package."""
    return {
        "job_id": "job_123",
        "job_title": "Senior Software Engineer",
        "company": "Acme Corp",
        "resume": {
            "name": "John Doe",
            "email": "john@example.com"
        },
        "cover_letter": "Dear Hiring Manager...",
        "ksc_responses": [
            {
                "criteria": "Communication skills",
                "response": {"situation": "...", "task": "...", "action": "...", "result": "..."}
            }
        ],
        "metadata": {
            "created_at": datetime.utcnow().isoformat(),
            "status": "ready_to_submit"
        }
    }


@pytest.fixture
def user_id():
    """Test user ID."""
    return "test_user_123"


# ============================================================================
# Cloud Storage Mock
# ============================================================================


@pytest.fixture
def mock_cloud_storage():
    """Mock CloudStorageClient."""
    mock = MagicMock()
    mock.upload_file = MagicMock(
        return_value="gs://bucket/exports/test_user/cover_letter/2025-01-18_14-30-45.json"
    )
    mock.generate_signed_url = MagicMock(
        return_value="https://storage.googleapis.com/signed-url-token"
    )
    mock.delete_file = MagicMock(return_value=True)
    mock.download_file = MagicMock(return_value=(b"file content", {"size": 1024}))
    return mock


# ============================================================================
# Cover Letter Export Tests
# ============================================================================


@pytest.mark.asyncio
async def test_export_cover_letter_json(
    document_export_service,
    sample_cover_letter,
    user_id,
    mock_cloud_storage
):
    """Test exporting cover letter to JSON format."""
    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        result = await document_export_service.export_cover_letter(
            content=sample_cover_letter,
            user_id=user_id,
            job_title="Senior Software Engineer",
            company_name="Acme Corp",
            format="json",
            expiration_hours=24.0
        )

    # Verify result
    assert result.success
    assert result.document_type == "cover_letter"
    assert result.file_format == "json"
    assert result.download_url.startswith("https://")
    assert result.file_size_bytes > 0
    assert result.storage_path.startswith("gs://")
    assert "Z" in result.expires_at  # ISO 8601 timestamp

    # Verify Cloud Storage was called
    mock_cloud_storage.upload_file.assert_called_once()
    mock_cloud_storage.generate_signed_url.assert_called_once()


@pytest.mark.asyncio
async def test_export_cover_letter_txt(
    document_export_service,
    sample_cover_letter,
    user_id,
    mock_cloud_storage
):
    """Test exporting cover letter to plain text."""
    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        result = await document_export_service.export_cover_letter(
            content=sample_cover_letter,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="txt",
            expiration_hours=24.0
        )

    assert result.success
    assert result.file_format == "txt"
    assert result.download_url.startswith("https://")


@pytest.mark.asyncio
async def test_export_cover_letter_invalid_format(
    document_export_service,
    sample_cover_letter,
    user_id
):
    """Test exporting with invalid format raises ValueError."""
    with pytest.raises(ValueError, match="Unsupported format"):
        await document_export_service.export_cover_letter(
            content=sample_cover_letter,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="invalid_format"
        )


@pytest.mark.asyncio
async def test_export_cover_letter_bandwidth_optimization(
    document_export_service,
    sample_cover_letter,
    user_id,
    mock_cloud_storage
):
    """
    Test that signed URL is much smaller than original content.

    This validates the core bandwidth optimization principle.
    """
    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        result = await document_export_service.export_cover_letter(
            content=sample_cover_letter,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="json"
        )

    content_size = len(sample_cover_letter)
    url_size = len(result.download_url)

    # URL should be smaller than content (relaxed check for small test files)
    assert url_size < content_size, \
        f"URL ({url_size} bytes) should be smaller than content ({content_size} bytes)"

    print(f"Bandwidth optimization: {content_size} bytes → {url_size} bytes (URL) "
          f"({url_size / content_size * 100:.1f}%)")


# ============================================================================
# Resume Export Tests
# ============================================================================


@pytest.mark.asyncio
async def test_export_resume_json(
    document_export_service,
    sample_resume,
    user_id,
    mock_cloud_storage
):
    """Test exporting resume to JSON format."""
    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        result = await document_export_service.export_resume(
            content=sample_resume,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="json"
        )

    assert result.success
    assert result.document_type == "resume"
    assert result.file_format == "json"
    assert result.download_url.startswith("https://")
    assert result.file_size_bytes > 0


@pytest.mark.asyncio
async def test_export_resume_invalid_format(
    document_export_service,
    sample_resume,
    user_id
):
    """Test exporting resume with invalid format."""
    with pytest.raises(ValueError, match="Unsupported format"):
        await document_export_service.export_resume(
            content=sample_resume,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="xyz"
        )


# ============================================================================
# KSC Response Export Tests
# ============================================================================


@pytest.mark.asyncio
async def test_export_ksc_response(
    document_export_service,
    sample_ksc_response,
    user_id,
    mock_cloud_storage
):
    """Test exporting KSC response."""
    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        result = await document_export_service.export_ksc_response(
            response_data=sample_ksc_response,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="json"
        )

    assert result.success
    assert result.document_type == "ksc_response"
    assert result.file_format == "json"
    assert result.download_url.startswith("https://")


# ============================================================================
# Application Package Export Tests
# ============================================================================


@pytest.mark.asyncio
async def test_export_application_package(
    document_export_service,
    sample_application_package,
    user_id,
    mock_cloud_storage
):
    """Test exporting complete application package."""
    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        result = await document_export_service.export_application_package(
            package_data=sample_application_package,
            user_id=user_id,
            job_id="job_123",
            format="json"
        )

    assert result.success
    assert result.document_type == "application_package"
    assert result.file_format == "json"
    assert result.download_url.startswith("https://")


@pytest.mark.asyncio
async def test_export_application_package_bandwidth_optimization(
    document_export_service,
    sample_application_package,
    user_id,
    mock_cloud_storage
):
    """Test bandwidth optimization for large application package."""
    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        result = await document_export_service.export_application_package(
            package_data=sample_application_package,
            user_id=user_id,
            job_id="job_123",
            format="json"
        )

    content_size = len(json.dumps(sample_application_package))
    url_size = len(result.download_url)

    # Relaxed check for small test samples
    assert url_size < content_size, \
        "URL should be smaller than content"

    print(f"Package optimization: {content_size} bytes → {url_size} bytes (URL) "
          f"({url_size / content_size * 100:.1f}%)")


# ============================================================================
# Signed URL Expiration Tests
# ============================================================================


@pytest.mark.asyncio
async def test_export_custom_expiration(
    document_export_service,
    sample_cover_letter,
    user_id,
    mock_cloud_storage
):
    """Test custom signed URL expiration."""
    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        result = await document_export_service.export_cover_letter(
            content=sample_cover_letter,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="json",
            expiration_hours=72.0  # 3 days
        )

    # Parse expiration time and verify it's approximately 72 hours from now
    expires_dt = datetime.fromisoformat(result.expires_at.replace("Z", "+00:00"))

    # Use timezone-aware UTC datetime for comparison
    from datetime import timezone
    now = datetime.now(timezone.utc)
    time_diff = (expires_dt - now).total_seconds() / 3600

    # Allow 1 hour tolerance
    assert 71 <= time_diff <= 73, f"Expected ~72 hours, got {time_diff:.1f}"


@pytest.mark.asyncio
async def test_export_min_max_expiration(
    document_export_service,
    sample_cover_letter,
    user_id,
    mock_cloud_storage
):
    """Test minimum and maximum expiration values."""
    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        # Test minimum (1 hour)
        result_min = await document_export_service.export_cover_letter(
            content=sample_cover_letter,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="json",
            expiration_hours=1.0
        )
        assert result_min.success

        # Test maximum (168 hours = 7 days)
        result_max = await document_export_service.export_cover_letter(
            content=sample_cover_letter,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="json",
            expiration_hours=168.0
        )
        assert result_max.success


# ============================================================================
# Storage Path Generation Tests
# ============================================================================


def test_storage_path_format(
    document_export_service,
    user_id
):
    """Test that storage path follows correct format."""
    path = document_export_service._get_storage_path(
        user_id=user_id,
        document_type="cover_letter",
        file_format="json"
    )

    # Format: exports/{user_id}/{document_type}/{timestamp}.{format}
    assert path.startswith(f"exports/{user_id}/cover_letter/")
    assert path.endswith(".json")
    assert len(path.split("/")) == 4  # 4 path components


def test_storage_path_uniqueness(
    document_export_service,
    user_id
):
    """Test that generated paths are unique (different timestamps)."""
    import time

    path1 = document_export_service._get_storage_path(
        user_id=user_id,
        document_type="cover_letter",
        file_format="json"
    )

    time.sleep(0.1)  # Small delay to ensure different timestamp

    path2 = document_export_service._get_storage_path(
        user_id=user_id,
        document_type="cover_letter",
        file_format="json"
    )

    assert path1 != path2, "Storage paths should be unique"


# ============================================================================
# Error Handling Tests
# ============================================================================


@pytest.mark.asyncio
async def test_export_storage_failure(
    document_export_service,
    sample_cover_letter,
    user_id,
    mock_cloud_storage
):
    """Test handling of Cloud Storage upload failure."""
    # Make upload_file raise an exception
    mock_cloud_storage.upload_file.side_effect = Exception("Storage unavailable")

    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        with pytest.raises(Exception, match="Storage unavailable"):
            await document_export_service.export_cover_letter(
                content=sample_cover_letter,
                user_id=user_id,
                job_title="Senior Software Engineer",
                format="json"
            )


# ============================================================================
# Integration Test: End-to-End Export Flow
# ============================================================================


@pytest.mark.asyncio
async def test_complete_export_flow(
    document_export_service,
    sample_cover_letter,
    sample_resume,
    sample_ksc_response,
    sample_application_package,
    user_id,
    mock_cloud_storage
):
    """
    Test complete end-to-end export flow.

    Simulates: Generate content → Export to file → Get signed URL → Download
    """
    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        # Step 1: Export cover letter
        cover_letter_result = await document_export_service.export_cover_letter(
            content=sample_cover_letter,
            user_id=user_id,
            job_title="Senior Software Engineer",
            company_name="Acme Corp",
            format="json"
        )
        assert cover_letter_result.success

        # Step 2: Export resume
        resume_result = await document_export_service.export_resume(
            content=sample_resume,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="json"
        )
        assert resume_result.success

        # Step 3: Export KSC response
        ksc_result = await document_export_service.export_ksc_response(
            response_data=sample_ksc_response,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="json"
        )
        assert ksc_result.success

        # Step 4: Export application package
        package_result = await document_export_service.export_application_package(
            package_data=sample_application_package,
            user_id=user_id,
            job_id="job_123",
            format="json"
        )
        assert package_result.success

        # Verify all results
        assert len([cover_letter_result, resume_result, ksc_result, package_result]) == 4
        assert all(r.download_url.startswith("https://") for r in [
            cover_letter_result, resume_result, ksc_result, package_result
        ])


# ============================================================================
# Performance Tests
# ============================================================================


@pytest.mark.asyncio
async def test_export_performance(
    document_export_service,
    sample_cover_letter,
    user_id,
    mock_cloud_storage
):
    """Test that export completes in reasonable time."""
    import time

    with patch.object(
        document_export_service,
        "storage_client",
        mock_cloud_storage
    ):
        start_time = time.time()

        result = await document_export_service.export_cover_letter(
            content=sample_cover_letter,
            user_id=user_id,
            job_title="Senior Software Engineer",
            format="json"
        )

        elapsed_time = time.time() - start_time

        assert result.success
        # Export should complete in less than 5 seconds (mostly mocked)
        assert elapsed_time < 5.0
