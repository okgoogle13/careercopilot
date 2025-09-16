"""
RAG API Endpoints

Provides endpoints for document processing and retrieval using RAG.
"""

import logging
import os
from typing import List, Optional

from app.ai.rag_integration import rag_integration
from app.core.ai_error_handling import AIError, AIErrorType
from app.core.auth import get_current_user
from app.core.config import settings
from app.core.file_upload_decorators import require_valid_document_upload
from app.models.database import User
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

router = APIRouter()


class DocumentUploadResponse(BaseModel):
    """Response model for document uploads."""

    success: bool
    message: str
    document_ids: Optional[List[str]] = None


class RAGQueryRequest(BaseModel):
    """Request model for RAG queries."""

    query: str
    top_k: int = Field(5, ge=1, le=20, description="Number of results to return")
    filters: Optional[dict] = Field(None, description="Additional filters for the search")


class RAGQueryResponse(BaseModel):
    """Response model for RAG queries."""

    results: List[dict]
    augmented_query: str


class DocumentDeleteRequest(BaseModel):
    """Request model for document deletion."""

    document_ids: List[str]


@router.post(
    "/documents/upload",
    response_model=DocumentUploadResponse,
    summary="Upload and process a document for RAG",
    description="""
    Upload a document to be processed and indexed for retrieval.
    Supported formats: PDF, TXT, Markdown
    """,
)
@require_valid_document_upload(
    allowed_types={".pdf", ".txt", ".md"},
    max_size_mb=getattr(settings, "max_document_size_mb", 10),
)
async def upload_document(
    file: UploadFile = File(...), current_user: User = Depends(get_current_user)
):
    """Upload and process a document for RAG."""
    if not settings.enable_rag:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="RAG functionality is not enabled",
        )

    # File validation is now handled by the decorator
    # The following validation code has been removed:
    # - File type validation
    # - File size validation
    # - Filename validation

    try:
        # Save the file temporarily
        temp_dir = "/tmp/rag_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, file.filename)

        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Process and index the document
        metadata = {
            "filename": file.filename,
            "content_type": file.content_type,
            "user_id": str(current_user.id),
            "source": "api_upload",
        }

        document_ids = await rag_integration.process_and_index_document(
            file_path=temp_path, metadata=metadata, user_id=str(current_user.id)
        )

        # Clean up
        try:
            os.remove(temp_path)
        except Exception as e:
            logger.warning(f"Failed to delete temporary file {temp_path}: {str(e)}")

        return DocumentUploadResponse(
            success=True,
            message=f"Successfully processed {len(document_ids)} document chunks",
            document_ids=document_ids,
        )

    except AIError as e:
        logger.error(f"Document processing failed: {str(e)}")
        status_code = status.HTTP_400_BAD_REQUEST
        if e.error_type == AIErrorType.SERVICE_UNAVAILABLE:
            status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        raise HTTPException(status_code=status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error processing document: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing the document",
        )


@router.post(
    "/query",
    response_model=RAGQueryResponse,
    summary="Query the RAG system",
    description="""
    Query the RAG system to get relevant context and an augmented query.
    """,
)
async def query_rag(request: RAGQueryRequest, current_user: User = Depends(get_current_user)):
    """Query the RAG system for relevant information."""
    if not settings.enable_rag:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="RAG functionality is not enabled",
        )

    try:
        # Add user filter to ensure users only see their own documents
        if request.filters is None:
            request.filters = {}

        if "user_id" not in request.filters:
            request.filters["user_id"] = str(current_user.id)

        # Execute the query
        search_results, augmented_query = await rag_integration.query_rag(
            query=request.query,
            user_id=str(current_user.id),
            top_k=request.top_k,
            filters=request.filters,
        )

        # Format results
        results = [
            {
                "id": doc.get("id"),
                "content": doc.get("content", ""),
                "metadata": doc.get("metadata", {}),
                "score": float(score) if score is not None else 0.0,
            }
            for doc, score in search_results
        ]

        return RAGQueryResponse(results=results, augmented_query=augmented_query)

    except AIError as e:
        logger.error(f"RAG query failed: {str(e)}")
        status_code = status.HTTP_400_BAD_REQUEST
        if e.error_type == AIErrorType.SERVICE_UNAVAILABLE:
            status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        raise HTTPException(status_code=status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in RAG query: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing your query",
        )


@router.post(
    "/documents/delete",
    response_model=dict,
    summary="Delete documents",
    description="""
    Delete documents from the vector store by their IDs.
    Users can only delete their own documents.
    """,
)
async def delete_documents(
    request: DocumentDeleteRequest, current_user: User = Depends(get_current_user)
):
    """Delete documents from the vector store."""
    if not settings.enable_rag:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="RAG functionality is not enabled",
        )

    if not request.document_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No document IDs provided"
        )

    try:
        success = await rag_integration.delete_documents(
            doc_ids=request.document_ids, user_id=str(current_user.id)
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to delete one or more of the specified documents",
            )

        return {
            "success": True,
            "message": f"Successfully deleted {len(request.document_ids)} documents",
        }

    except Exception as e:
        logger.error(f"Failed to delete documents: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete documents",
        )
