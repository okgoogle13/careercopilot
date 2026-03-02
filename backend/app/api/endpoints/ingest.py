<<<<<<< HEAD
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Literal, Any
from app.services.ingestion import IngestionService
from app.core.dependencies import get_current_user
=======
from typing import Any, Literal

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.core.dependencies import get_current_user
from app.services.ingestion import IngestionService
>>>>>>> restoration-KR-Rage-Figma-v2.0

router = APIRouter()

@router.post("/artifacts/upload")
async def upload_artifact(
    file: UploadFile = File(...),
    source_type: Literal["resume", "cover_letter", "ksc_response"] = Form(...),
    current_user: Any = Depends(get_current_user)
):
    """
    Uploads a career artifact (PDF/DOCX) for ingestion into the RAG Vector Store.
    """
    try:
        content = await file.read()
        service = IngestionService()
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        # Process and ingest
        service.process_file(
            file_content=content,
            filename=file.filename,
            source_type=source_type,
            user_id=current_user.id
        )
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        return {"message": f"Successfully ingested {file.filename} as {source_type}"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error ingesting artifact: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during ingestion")
