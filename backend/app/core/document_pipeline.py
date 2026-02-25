# backend/app/core/document_pipeline.py
"""
Unified Document Pipeline: The core orchestrator for document generation.
Implements the sequence: Plan -> Draft -> Validate -> Render -> Export.
"""

import logging
from typing import Any, Dict, Optional
from app.core.templates_repo import template_repo
from app.core.docx_renderer import render_cover_letter_docx, render_resume_docx, render_ksc_docx
from app.core.pdf_renderer import render_cover_letter_pdf, render_resume_pdf, render_ksc_pdf
from app.core.ats_rules import validate_template_schema

logger = logging.getLogger(__name__)

class DocumentPipeline:
    """
    Orchestrates the creation and rendering of career documents.
    """

    async def generate_document(
        self,
        doc_type: str,
        content: Any,
        template_id: str = "minimal",
        file_format: str = "pdf",
        candidate_name: Optional[str] = None,
        theme_id: str = "minimal"
    ) -> bytes:
        """
        Main entry point for generating a document file.
        """
        logger.info(f"Pipeline: Generating {doc_type} in {file_format} using {template_id}")

        # 1. Load and validate template
        template = template_repo.get(doc_type, template_id)
        
        # 2. Render based on doc_type and format
        if doc_type == "cover_letter":
            if file_format == "docx":
                return render_cover_letter_docx(content, candidate_name, theme_id)
            else:
                return render_cover_letter_pdf(content, candidate_name, theme_id)
        
        elif doc_type == "resume":
            # content should be a structured dict matching MasterCareerProfile or flattened for renderer
            if file_format == "docx":
                return render_resume_docx(content, candidate_name, theme_id)
            else:
                return render_resume_pdf(content, candidate_name, theme_id)
                
        elif doc_type == "ksc_response":
            if file_format == "docx":
                return render_ksc_docx(content) # simplified
            else:
                return render_ksc_pdf(content)

        raise ValueError(f"Unsupported document type: {doc_type}")

# Global instance
document_pipeline = DocumentPipeline()
