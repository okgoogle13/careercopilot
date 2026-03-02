"""
File Upload Validation Decorators

This module provides decorators for validating file uploads, consolidating
repeated validation logic across different endpoints.
"""

import logging
import os
from collections.abc import Callable
from functools import wraps

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

logger = logging.getLogger(__name__)


class FileValidationError(Exception):
    """Custom exception for file validation errors."""


class FileUploadConfig:
    """Configuration for file upload validation."""

    def __init__(
        self,
        allowed_extensions: set[str] | None = None,
        allowed_content_types: set[str] | None = None,
        max_file_size_mb: int | None = None,
        max_files: int = 1,
        require_filename: bool = True,
        allowed_filename_patterns: list[str] | None = None,
        forbidden_filename_patterns: list[str] | None = None,
    ):
        """Initialize file upload configuration.

        Args:
            allowed_extensions: Set of allowed file extensions (e.g., {'.pd', '.docx'})
            allowed_content_types: Set of allowed MIME types
            max_file_size_mb: Maximum file size in megabytes
            max_files: Maximum number of files allowed
            require_filename: Whether filename is required
            allowed_filename_patterns: Regex patterns that filenames must match
            forbidden_filename_patterns: Regex patterns that filenames must not match
        """
        # Default values from settings or reasonable defaults
        self.allowed_extensions = allowed_extensions or {
            ".pd",
            ".doc",
            ".docx",
            ".txt",
            ".md",
            ".rtf",
        }
        self.allowed_content_types = allowed_content_types or {
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
            "text/markdown",
            "application/rtf",
        }
        self.max_file_size_mb = max_file_size_mb or getattr(settings, "max_file_size_mb", 10)
        self.max_files = max_files
        self.require_filename = require_filename
        self.allowed_filename_patterns = allowed_filename_patterns or []
        self.forbidden_filename_patterns = forbidden_filename_patterns or [
            r'.*[<>:"|?*].*',  # Windows forbidden characters
            r"^\.",  # Hidden files
            r".*\.exe$",  # Executable files
            r".*\.bat$",  # Batch files
            r".*\.sh$",  # Shell scripts (for security)
        ]


def validate_file_upload(
    file: UploadFile,
    config: FileUploadConfig,
) -> None:
    """Validate a single file upload.

    Args:
        file: The uploaded file
        config: Validation configuration

    Raises:
        FileValidationError: If validation fails
    """
    if file is None:
        raise FileValidationError("No file provided")

    # Check filename requirements
    if config.require_filename and (not file.filename or file.filename.strip() == ""):
        raise FileValidationError("Filename is required")

    if file.filename:
        # Check filename patterns
        import re

        # Check forbidden patterns
        for pattern in config.forbidden_filename_patterns:
            if re.match(pattern, file.filename, re.IGNORECASE):
                raise FileValidationError(f"Filename contains forbidden pattern: {pattern}")

        # Check allowed patterns (if specified)
        if config.allowed_filename_patterns:
            matches_pattern = any(
                re.match(pattern, file.filename, re.IGNORECASE)
                for pattern in config.allowed_filename_patterns
            )
            if not matches_pattern:
                raise FileValidationError("Filename does not match allowed patterns")

        # Check file extension
        if config.allowed_extensions:
            file_ext = os.path.splitext(file.filename.lower())[1]
            if file_ext not in config.allowed_extensions:
                allowed_exts = ", ".join(config.allowed_extensions)
                raise FileValidationError(
                    f"File extension '{file_ext}' not allowed. "
                    f"Allowed extensions: {allowed_exts}"
                )

    # Check content type
    if config.allowed_content_types and file.content_type:
        if file.content_type not in config.allowed_content_types:
            allowed_types = ", ".join(config.allowed_content_types)
            raise FileValidationError(
                f"Content type '{file.content_type}' not allowed. "
                f"Allowed types: {allowed_types}"
            )

    # Check file size
    if config.max_file_size_mb and hasattr(file, "file"):
        try:
            # Get file size
            file.file.seek(0, 2)  # Seek to end
            file_size = file.file.tell()
            file.file.seek(0)  # Reset to beginning

            max_size_bytes = config.max_file_size_mb * 1024 * 1024
            if file_size > max_size_bytes:
                raise FileValidationError(
                    f"File size {file_size / 1024 / 1024:.1f}MB exceeds "
                    f"maximum allowed size {config.max_file_size_mb}MB"
                )
        except Exception as e:
            logger.warning(f"Could not check file size: {e!s}")


def validate_multiple_files(
    files: list[UploadFile],
    config: FileUploadConfig,
) -> None:
    """Validate multiple file uploads.

    Args:
        files: List of uploaded files
        config: Validation configuration

    Raises:
        FileValidationError: If validation fails
    """
    if not files:
        raise FileValidationError("No files provided")

    if len(files) > config.max_files:
        raise FileValidationError(
            f"Too many files. Maximum allowed: {config.max_files}, " f"received: {len(files)}"
        )

    # Validate each file
    for i, file in enumerate(files):
        try:
            validate_file_upload(file, config)
        except FileValidationError as e:
            raise FileValidationError(f"File {i + 1} validation failed: {e!s}")


def require_valid_file_upload(
    config: FileUploadConfig | None = None,
    single_file: bool = True,
) -> Callable:
    """
    Decorator that validates file uploads before calling the endpoint function.

    Args:
        config: File validation configuration (uses defaults if None)
        single_file: Whether to expect a single file (True) or multiple files (False)

    Returns:
        Decorator function

    Example:
        @require_valid_file_upload()
        async def upload_resume(file: UploadFile = File(...)):
            # File is already validated
            pass

        @require_valid_file_upload(
            config=FileUploadConfig(
                allowed_extensions={'.pdf'},
                max_file_size_mb=5
            )
        )
        async def upload_pdf_only(file: UploadFile = File(...)):
            # Only PDF files up to 5MB allowed
            pass
    """
    if config is None:
        config = FileUploadConfig()

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                # Find file parameter in kwargs
                file_param = None
                files_param = None

                # Look for common file parameter names
                file_param_names = ["file", "upload_file", "document", "attachment"]
                files_param_names = [
                    "files",
                    "upload_files",
                    "documents",
                    "attachments",
                ]

                for name in file_param_names:
                    if name in kwargs and isinstance(kwargs[name], UploadFile):
                        file_param = kwargs[name]
                        break

                for name in files_param_names:
                    if name in kwargs and isinstance(kwargs[name], list):
                        files_param = kwargs[name]
                        break

                # Validate based on what we found
                if single_file:
                    if file_param is None:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="No file parameter found in request",
                        )
                    validate_file_upload(file_param, config)
                else:
                    if files_param is None:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="No files parameter found in request",
                        )
                    validate_multiple_files(files_param, config)

                # Call the original function if validation passes
                return await func(*args, **kwargs)

            except FileValidationError as e:
                logger.warning(f"File validation failed: {e!s}")
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
            except HTTPException:
                # Re-raise HTTP exceptions
                raise
            except Exception as e:
                logger.error(f"Unexpected error in file validation: {e!s}", exc_info=True)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Internal server error during file validation",
                )

        return wrapper

    return decorator


def require_valid_resume_upload(max_size_mb: int = 10) -> Callable:
    """
    Convenience decorator for resume uploads.

    Args:
        max_size_mb: Maximum file size in MB

    Returns:
        Decorator function
    """
    config = FileUploadConfig(
        allowed_extensions={".pd", ".doc", ".docx", ".txt"},
        allowed_content_types={
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        },
        max_file_size_mb=max_size_mb,
        max_files=1,
    )
    return require_valid_file_upload(config=config, single_file=True)


def require_valid_job_description_upload(max_size_mb: int = 5) -> Callable:
    """
    Convenience decorator for job description uploads.

    Args:
        max_size_mb: Maximum file size in MB

    Returns:
        Decorator function
    """
    config = FileUploadConfig(
        allowed_extensions={".pd", ".doc", ".docx", ".txt", ".md"},
        allowed_content_types={
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
            "text/markdown",
        },
        max_file_size_mb=max_size_mb,
        max_files=1,
    )
    return require_valid_file_upload(config=config, single_file=True)


def require_valid_document_upload(
    allowed_types: set[str] | None = None, max_size_mb: int = 10, max_files: int = 1
) -> Callable:
    """
    Flexible decorator for various document types.

    Args:
        allowed_types: Set of allowed file extensions
        max_size_mb: Maximum file size in MB
        max_files: Maximum number of files

    Returns:
        Decorator function
    """
    if allowed_types is None:
        allowed_types = {".pd", ".doc", ".docx", ".txt", ".md", ".rtf"}

    # Map extensions to content types
    content_type_mapping = {
        ".pd": "application/pdf",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".txt": "text/plain",
        ".md": "text/markdown",
        ".rt": "application/rtf",
    }

    allowed_content_types = {
        content_type_mapping[ext] for ext in allowed_types if ext in content_type_mapping
    }

    config = FileUploadConfig(
        allowed_extensions=allowed_types,
        allowed_content_types=allowed_content_types,
        max_file_size_mb=max_size_mb,
        max_files=max_files,
    )

    return require_valid_file_upload(config=config, single_file=(max_files == 1))
