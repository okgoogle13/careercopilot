import io
from fastapi import UploadFile
from pypdf import PdfReader

async def extract_text_from_upload(file: UploadFile) -> str:
    """Reads PDF or TXT uploads and returns clean text string."""
    content = await file.read()
    
    if file.content_type == "text/plain":
        return content.decode("utf-8")
    
    if file.content_type == "application/pdf":
        try:
            pdf_file = io.BytesIO(content)
            reader = PdfReader(pdf_file)
            text = [page.extract_text() for page in reader.pages]
            return "\n".join(text)
        except Exception as e:
            return f"[Error reading PDF {file.filename}: {str(e)}]"
            
    return "" # Unsupported type
