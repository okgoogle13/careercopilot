import io
import json
from pathlib import Path
from typing import List, Literal

import docx
import pdfplumber
from app.core.dependencies import get_current_user, get_user_document_from_firestore
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from google.api_core.exceptions import GoogleAPICallError
from jinja2 import Environment, FileSystemLoader
from starlette.responses import StreamingResponse
from weasyprint import CSS, HTML

# from app.genkit_flows.extract_resume_entities import
# extract_resume_entities  # Temporarily disabled for deployment

router = APIRouter()

# --- Template Configuration Loading ---
config_path = Path(__file__).parent.parent.parent.parent / "config" / "themes.json"
template_root_dir = Path(__file__).parent.parent.parent / "templates"

with open(config_path) as f:
    THEME_CONFIG = json.load(f)

# Dynamically create the Theme literal type from the config file keys
Theme = Literal[tuple(THEME_CONFIG.keys())]
env = Environment(loader=FileSystemLoader(str(template_root_dir)))


def parse_pdf(file_path: str) -> str:
    with pdfplumber.open(file_path) as pdf:
        return "".join(page.extract_text() for page in pdf.pages if page.extract_text())


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
        theme_details = THEME_CONFIG.get(theme)

        if not theme_details:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Theme '{theme}' not found.",
            )

        template_path = theme_details["template"]
        css_path = str(template_root_dir / theme_details["css"])
        base_url_path = str(template_root_dir / theme)

        template = env.get_template(template_path)
        html_content = template.render(content=content)
        stylesheet = CSS(filename=css_path)
        pdf_bytes = HTML(string=html_content, base_url=base_url_path).write_pdf(
            stylesheets=[stylesheet]
        )

        response = StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf")
        original_filename = document.get("originalFilename", "document").split(".")[0]
        response.headers["Content-Disposition"] = (
            f"attachment; filename={original_filename}_{theme}.pdf"
        )

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
