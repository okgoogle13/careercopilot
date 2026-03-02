<<<<<<< HEAD
import os
from typing import List, Literal
from pydantic import BaseModel
=======
from typing import Literal

>>>>>>> restoration-KR-Rage-Figma-v2.0
try:
    from pdfminer.high_level import extract_text
except ImportError:  # pragma: no cover - optional dependency in test/CI
    extract_text = None
try:
    import docx
except ImportError:  # pragma: no cover - optional dependency in test/CI
    docx = None
<<<<<<< HEAD
from app.services.vector_store import VectorStore, CareerArtifact
import io

=======
import io

from app.services.vector_store import CareerArtifact, VectorStore


>>>>>>> restoration-KR-Rage-Figma-v2.0
class IngestionService:
    """
    Handles parsing of raw files (PDF, DOCX, TXT) and ingesting them
    into the VectorStore as structured CareerArtifacts.
    """

    def __init__(self):
        self.vector_store = VectorStore()

    def process_file(self, file_content: bytes, filename: str, source_type: Literal["resume", "cover_letter", "ksc_response"], user_id: str = "legacy_user"):
        """
        Parses file content and adds it to the vector store.
        """
        text = ""
<<<<<<< HEAD
        file_ext = filename.split('.')[-1].lower()

        if file_ext == 'pdf':
            text = self._parse_pdf(file_content)
        elif file_ext in ['docx', 'doc']:
            text = self._parse_docx(file_content)
        elif file_ext == 'txt':
            text = file_content.decode('utf-8')
=======
        file_ext = filename.split(".")[-1].lower()

        if file_ext == "pdf":
            text = self._parse_pdf(file_content)
        elif file_ext in ["docx", "doc"]:
            text = self._parse_docx(file_content)
        elif file_ext == "txt":
            text = file_content.decode("utf-8")
>>>>>>> restoration-KR-Rage-Figma-v2.0
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")

        if not text:
            raise ValueError("Extracted text is empty.")

        # Chunking Logic
        # For Resumes/Cover Letters, we want reasonably sized chunks that preserve context.
        # A simple approach for MVP: Split by paragraphs, grouping them until ~500 chars.
        chunks = self._semantic_chunking(text)

        for chunk in chunks:
            if len(chunk.strip()) > 50: # Ignore tiny nonsense chunks
                artifact = CareerArtifact(
                    content=chunk,
                    source_type=source_type,
                    source_filename=filename
                    # derived_skills could be added here via a lightweight Gemini call if we wanted active enrichment
                )
                self.vector_store.add_artifact(artifact, user_id=user_id)
<<<<<<< HEAD
        
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
        print(f"Successfully processed {filename} into {len(chunks)} chunks.")

    def _parse_pdf(self, file_content: bytes) -> str:
        if not extract_text:
            raise RuntimeError("pdfminer.six not installed")
        with io.BytesIO(file_content) as f:
            return extract_text(f)

    def _parse_docx(self, file_content: bytes) -> str:
        if not docx:
            raise RuntimeError("python-docx not installed")
        with io.BytesIO(file_content) as f:
            doc = docx.Document(f)
            return "\n".join([para.text for para in doc.paragraphs])

<<<<<<< HEAD
    def _semantic_chunking(self, text: str, max_chunk_size: int = 1000) -> List[str]:
=======
    def _semantic_chunking(self, text: str, max_chunk_size: int = 1000) -> list[str]:
>>>>>>> restoration-KR-Rage-Figma-v2.0
        """
        Splits text into chunks. Respects paragraph boundaries.
        Accumulates paragraphs until max_chunk_size is reached.
        """
<<<<<<< HEAD
        paragraphs = text.split('\n')
=======
        paragraphs = text.split("\n")
>>>>>>> restoration-KR-Rage-Figma-v2.0
        chunks = []
        current_chunk = ""

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
<<<<<<< HEAD
                
=======

>>>>>>> restoration-KR-Rage-Figma-v2.0
            if len(current_chunk) + len(para) > max_chunk_size:
                chunks.append(current_chunk)
                current_chunk = para
            else:
                if current_chunk:
                    current_chunk += "\n" + para
                else:
                    current_chunk = para
<<<<<<< HEAD
        
        if current_chunk:
            chunks.append(current_chunk)
            
=======

        if current_chunk:
            chunks.append(current_chunk)

>>>>>>> restoration-KR-Rage-Figma-v2.0
        return chunks
