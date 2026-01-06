from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from app.core.ai_client import get_ai_client, AIRequest
from app.core.db import db
from app.genkit_flows.calendar_manager import createCalendarEvent
from google.cloud import firestore

router = APIRouter()

# Input model
class JobPostingData(BaseModel):
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    description: str
    url: str
    source: Optional[str] = "unknown"
    employmentType: Optional[str] = None
    datePosted: Optional[str] = None
    salary: Optional[str] = None
    resume_text: Optional[str] = None

# Output model
class JobAnalysisResponse(BaseModel):
    success: bool
    markdown_analysis: str
    job_id: Optional[str] = None
    job_saved: bool = False
    deadline_found: Optional[str] = None

# Default user ID for the extension (in a real app, this would come from auth token)
DEFAULT_USER_ID = "okgoogle13" 

@router.post("/analyze", response_model=JobAnalysisResponse)
async def analyze_job_posting(job_data: JobPostingData, background_tasks: BackgroundTasks):
    """
    Analyze a job posting, save it to the dashboard, and create calendar reminders if a deadline is found.
    """
    try:
        # 1. Build the prompt for AI Analysis & Extraction
        prompt = _build_analysis_prompt(job_data)
        
        # 2. Call AI Client
        ai_client = get_ai_client()
        request = AIRequest(
            prompt=prompt,
            service_name="job_analysis",
            user_id=DEFAULT_USER_ID,
            temperature=0.7,
            max_tokens=2000
        )
        
        # We'll ask for markdown analysis but also try to extract JSON metadata if possible
        # For this implementation, we will use a single pass that asks for a specific format
        # or we might parse the response. To be safe/simple for the extension UI which expects Markdown,
        # we will ask for Markdown but formatted such that we can regex extract the deadline if needed.
        # Actually, let's just ask for the Markdown analysis for the user, 
        # and do a quick regex or heuristic for the deadline, 
        # OR make a second lightweight call for structured data.
        
        # Strategy: Single call. Ask for analysis in Markdown, and at the end, 
        # a JSON block with metadata like {"deadline": "YYYY-MM-DD", "match_score": 85}.
        
        response = await ai_client.generate_text(request)
        full_text = response.content
        
        # 3. Parse Metadata (JSON block at the end)
        analysis_text, metadata = _parse_ai_response(full_text)
        
        # 4. Save to Firestore
        job_id = None
        job_saved = False
        
        if db:
            # Prepare data for Firestore
            doc_data = {
                "title": job_data.title,
                "company": job_data.company,
                "description": job_data.description,
                "url": job_data.url,
                "location": job_data.location,
                "source": "chrome_extension",
                "status": "new",
                "created_at": firestore.SERVER_TIMESTAMP,
                "ai_analysis": analysis_text,
                "deadline": metadata.get("deadline"),
                "match_score": metadata.get("match_score"),
            }
            
            # Save to user's opportunities collection
            # /users/{uid}/opportunities/{doc_id}
            user_ref = db.collection("users").document(DEFAULT_USER_ID)
            update_time, doc_ref = user_ref.collection("opportunities").add(doc_data)
            
            job_id = doc_ref.id
            job_saved = True
            
            # 5. Create Calendar Event (Background Task)
            if metadata.get("deadline"):
                # We need to pass the ID to the calendar manager so it can update the doc with event ID
                doc_data["id"] = job_id 
                background_tasks.add_task(
                    _create_calendar_entry, 
                    DEFAULT_USER_ID, 
                    doc_data
                )

        return JobAnalysisResponse(
            success=True,
            markdown_analysis=analysis_text,
            job_id=job_id,
            job_saved=job_saved,
            deadline_found=metadata.get("deadline")
        )

    except Exception as e:
        print(f"Error in analyze_job_posting: {e}")
        # Return a graceful error response or mock data if AI fails
        return JobAnalysisResponse(
            success=False,
            markdown_analysis=f"### Error\n\nFailed to analyze job: {str(e)}\n\n(Ensure backend is running and AI credentials are set)",
            job_saved=False
        )

async def _create_calendar_entry(user_id: str, job_details: dict):
    """
    Wrapper to call the calendar manager safely
    """
    try:
        print(f"📅 Creating calendar event for job: {job_details.get('title')}")
        await createCalendarEvent(user_id, job_details)
        print("✅ Calendar event created successfully")
    except Exception as e:
        print(f"❌ Failed to create calendar event: {e}")

def _build_analysis_prompt(job: JobPostingData) -> str:
    resume_context = ""
    if job.resume_text:
        resume_context = f"\n\nCANDIDATE RESUME:\n{job.resume_text}\n"

    return f"""
You are an expert Career Coach and AI Analyst. Analyze the following job posting{ " based on the candidate's resume" if job.resume_text else "" }.

JOB TITLE: {job.title}
COMPANY: {job.company or "Unknown"}
LOCATION: {job.location or "Unknown"}
SOURCE URL: {job.url}

JOB DESCRIPTION:
{job.description[:8000]} # Truncate if too long

{resume_context}

Provide a comprehensive analysis in Markdown format using the following structure:

1. **Overall Fit Score** (0-100%): Estimate the alignment{ " with the resume" if job.resume_text else "" }.
2. **Matching Qualifications**: Key skills/experience from the description{ " that the candidate matches" if job.resume_text else " required" }.
3. **Gaps & Development Areas**: What is missing or needs work.
4. **Key Selling Points**: What stands out about this role.
5. **Application Strategy**: Recommended approach.

IMPORTANT: At the very end of your response, strictly append a single JSON block with the following metadata (and nothing else after it):
```json
{{
  "deadline": "YYYY-MM-DD", // Extract application deadline if explicitly present (ISO 8601), otherwise null
  "match_score": 85, // Integer 0-100
  "is_remote": true/false // Boolean
}}
```
If no deadline is found, use null.
"""

def _parse_ai_response(text: str) -> tuple[str, dict]:
    """
    Separates the Markdown analysis from the JSON metadata block.
    """
    import json
    import re

    # Try to find the JSON block at the end
    json_match = re.search(r"```json\s*({.*?})\s*```", text, re.DOTALL)
    
    metadata = {}
    analysis_text = text
    
    if json_match:
        json_str = json_match.group(1)
        try:
            metadata = json.loads(json_str)
            # Remove the JSON block from the analysis text to keep it clean for display
            analysis_text = text.replace(json_match.group(0), "").strip()
        except json.JSONDecodeError:
            print("Failed to parse JSON metadata from AI response")
            pass
            
    return analysis_text, metadata
