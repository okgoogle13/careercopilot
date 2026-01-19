from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Literal, Any
from app.services.ingestion import IngestionService
from app.core.dependencies import get_current_user

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
        
        # Process and ingest
        service.process_file(
            file_content=content,
            filename=file.filename,
            source_type=source_type,
            user_id=current_user.id
        )
        
        return {"message": f"Successfully ingested {file.filename} as {source_type}"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error ingesting artifact: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during ingestion")
