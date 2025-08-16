import uuid
import shutil
from pathlib import Path
import os
import asyncio
from typing import List, Literal
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from starlette.responses import StreamingResponse
from google.cloud.firestore import SERVER_TIMESTAMP
from google.api_core.exceptions import GoogleAPICallError, NotFound
from pydantic import ValidationError
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML, CSS
import io
import pdfplumber
import docx

from app.core.dependencies import get_current_user, get_user_document_from_firestore
from app.core.db import db
from app.genkit_flows.extract_resume_entities import extract_resume_entities

router = APIRouter()

template_root_dir = Path(__file__).parent.parent.parent / "templates"
env = Environment(loader=FileSystemLoader(str(template_root_dir)))

Theme = Literal["professional", "modern", "creative"]


def parse_pdf(file_path: str) -> str:
    with pdfplumber.open(file_path) as pdf:
        return "".join(
            page.extract_text() for page in pdf.pages if page.extract_text()
        )


def parse_docx(file_path: str) -> str:
    doc = docx.Document(file_path)
    return "\\n".join(para.text for para in doc.paragraphs)


async def process_and_upload_file(file: UploadFile, uid: str, doc_type: str):
    # This is a placeholder for the actual implementation
    pass


@router.post("/upload")
async def upload_and_parse_files(
    files: List[UploadFile] = File(...),
    user: dict = Depends(get_current_user),
    doc_type: str = "resume",
):
    # This is a placeholder for the actual implementation
    pass


@router.get("/{document_id}/download-pdf")
async def download_document_as_pdf(
    document_id: str,
    theme: Theme,
    document: dict = Depends(get_user_document_from_firestore),
):
    try:
        content = document.get("content", "")

        theme_dir = template_root_dir / theme
        html_template_path = theme_dir / "template.html"
        css_path = theme_dir / "style.css"

        if not html_template_path.exists() or not css_path.exists():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Theme '{theme}' not found.",
            )

        template = env.get_template(f"{theme}/template.html")
        html_content = template.render(content=content)
        stylesheet = CSS(filename=str(css_path))
        pdf_bytes = HTML(string=html_content, base_url=str(theme_dir)).write_pdf(
            stylesheets=[stylesheet]
        )

        response = StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf")
        original_filename = document.get("originalFilename", "document").split(".")[0]
        response.headers[
            "Content-Disposition"
        ] = f"attachment; filename={original_filename}_{theme}.pdf"

        return response

    except (FileNotFoundError, GoogleAPICallError) as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error accessing template files or cloud storage: {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the PDF: {e}",
        )
