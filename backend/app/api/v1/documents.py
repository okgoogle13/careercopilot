import uuid
import shutil
from pathlib import Path
import os
import json
import pdfplumber
import docx
import asyncio
from typing import List, Dict, Any, Literal
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from starlette.responses import StreamingResponse
from firebase_admin import storage
from google.cloud.firestore import SERVER_TIMESTAMP
from pydantic import BaseModel
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML, CSS
import io

from app.core.dependencies import get_current_user
from app.core.db import db
# ... other imports remain the same

router = APIRouter()

# Setup Jinja2 environment
template_root_dir = Path(__file__).parent.parent.parent / "templates"
env = Environment(loader=FileSystemLoader(str(template_root_dir)))

Theme = Literal["professional", "modern", "creative"]


@router.get("/{document_id}/download-pdf")
async def download_document_as_pdf(
    document_id: str,
    uid: str = Depends(get_current_user),
    theme: Theme = "professional" # Default to 'professional' theme
):
    """
    Fetches a document from Firestore, renders it into a themed HTML template,
    and returns it as a downloadable PDF file.
    """
    try:
        # Fetch the document from Firestore
        doc_ref = db.collection("users").document(uid).collection("documents").document(document_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Document not found")
        
        document_data = doc.to_dict()
        content = document_data.get("content", "")
        title = document_data.get("title", "Document")


        # 1. Dynamically select the theme directory and files
        theme_dir = template_root_dir / theme
        html_template_path = theme_dir / "template.html"
        css_path = theme_dir / "style.css"

        if not html_template_path.exists() or not css_path.exists():
            raise HTTPException(status_code=400, detail=f"Theme '{theme}' not found.")

        # 2. Load the HTML template from the specific theme directory
        template = env.get_template(f"{theme}/template.html")
        html_content = template.render(title=title, content=content)

        # 3. Load the CSS stylesheet from the theme directory
        stylesheet = CSS(filename=str(css_path))

        # 4. Generate PDF in memory, applying the stylesheet
        pdf_bytes = HTML(string=html_content, base_url=str(theme_dir)).write_pdf(stylesheets=[stylesheet])
        
        response = StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf")
        original_filename = document_data.get("originalFilename", "resume").split('.')[0]
        response.headers["Content-Disposition"] = f"attachment; filename={original_filename}_{theme}.pdf"
        
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the PDF: {e}")

# ... (all other endpoints remain the same) ...
