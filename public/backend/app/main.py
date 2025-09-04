# main.py
# Main API router for career copilot backend

from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import StreamingResponse, JSONResponse
from genkit_flows.smart_cover_letter_system import SmartCoverLetterSystem
import logging

app = FastAPI()
router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("career-copilot-api")

# AI-powered career services endpoint


# Cover Letter Generation
@router.post("/generate-cover-letter")
async def generate_cover_letter(request: Request):
    data = await request.json()
    resume = data.get("resume", "")
    job = data.get("job", "")
    prompt = data.get("prompt")
    stream = data.get("stream", False)
    generation_config = data.get("generation_config")

    try:
        system = SmartCoverLetterSystem()
        if prompt:
            full_prompt = prompt
        else:
            full_prompt = f"Generate a professional cover letter based on the following resume and job description.\nResume: {resume}\nJob Description: {job}"

        if stream:

            def stream_gen():
                try:
                    for chunk in system.model.generate_content(
                        full_prompt,
                        generation_config=system.model.GenerationConfig(
                            **(generation_config or {})
                        ),
                        stream=True,
                    ):
                        yield chunk.text
                except Exception as e:
                    logger.error(f"Streaming error in /generate-cover-letter: {e}")
                    yield f"Error: {e}"

            return StreamingResponse(stream_gen(), media_type="text/plain")
        else:
            result = system.model.generate_content(
                full_prompt,
                generation_config=system.model.GenerationConfig(
                    **(generation_config or {})
                ),
            )
            return JSONResponse(
                {
                    "cover_letter": (
                        result.text if hasattr(result, "text") else str(result)
                    )
                }
            )
    except Exception as e:
        logger.error(f"Error in /generate-cover-letter: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)


# Resume Review
@router.post("/review-resume")
async def review_resume(request: Request):
    data = await request.json()
    resume = data.get("resume", "")
    prompt = data.get("prompt")
    stream = data.get("stream", False)
    generation_config = data.get("generation_config")

    try:
        system = SmartCoverLetterSystem()
        if prompt:
            full_prompt = prompt
        else:
            full_prompt = f"Review the following resume and provide constructive feedback, strengths, and areas for improvement.\nResume: {resume}"

        if stream:

            def stream_gen():
                try:
                    for chunk in system.model.generate_content(
                        full_prompt,
                        generation_config=system.model.GenerationConfig(
                            **(generation_config or {})
                        ),
                        stream=True,
                    ):
                        yield chunk.text
                except Exception as e:
                    logger.error(f"Streaming error in /review-resume: {e}")
                    yield f"Error: {e}"

            return StreamingResponse(stream_gen(), media_type="text/plain")
        else:
            result = system.model.generate_content(
                full_prompt,
                generation_config=system.model.GenerationConfig(
                    **(generation_config or {})
                ),
            )
            return JSONResponse(
                {"review": result.text if hasattr(result, "text") else str(result)}
            )
    except Exception as e:
        logger.error(f"Error in /review-resume: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)


# Interview Q&A
@router.post("/interview-qa")
async def interview_qa(request: Request):
    data = await request.json()
    resume = data.get("resume", "")
    job = data.get("job", "")
    prompt = data.get("prompt")
    stream = data.get("stream", False)
    generation_config = data.get("generation_config")

    try:
        system = SmartCoverLetterSystem()
        if prompt:
            full_prompt = prompt
        else:
            full_prompt = f"Generate a list of interview questions and sample answers for the following job description and resume.\nResume: {resume}\nJob Description: {job}"

        if stream:

            def stream_gen():
                try:
                    for chunk in system.model.generate_content(
                        full_prompt,
                        generation_config=system.model.GenerationConfig(
                            **(generation_config or {})
                        ),
                        stream=True,
                    ):
                        yield chunk.text
                except Exception as e:
                    logger.error(f"Streaming error in /interview-qa: {e}")
                    yield f"Error: {e}"

            return StreamingResponse(stream_gen(), media_type="text/plain")
        else:
            result = system.model.generate_content(
                full_prompt,
                generation_config=system.model.GenerationConfig(
                    **(generation_config or {})
                ),
            )
            return JSONResponse(
                {
                    "interview_qa": (
                        result.text if hasattr(result, "text") else str(result)
                    )
                }
            )
    except Exception as e:
        logger.error(f"Error in /interview-qa: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)


# Job Matching
@router.post("/job-matching")
async def job_matching(request: Request):
    data = await request.json()
    resume = data.get("resume", "")
    jobs = data.get("jobs", [])  # List of job descriptions
    prompt = data.get("prompt")
    stream = data.get("stream", False)
    generation_config = data.get("generation_config")

    try:
        system = SmartCoverLetterSystem()
        jobs_text = "\n\n".join(jobs) if isinstance(jobs, list) else str(jobs)
        if prompt:
            full_prompt = prompt
        else:
            full_prompt = f"Given the following resume and job descriptions, suggest the best job matches and explain why.\nResume: {resume}\nJob Descriptions: {jobs_text}"

        if stream:

            def stream_gen():
                try:
                    for chunk in system.model.generate_content(
                        full_prompt,
                        generation_config=system.model.GenerationConfig(
                            **(generation_config or {})
                        ),
                        stream=True,
                    ):
                        yield chunk.text
                except Exception as e:
                    logger.error(f"Streaming error in /job-matching: {e}")
                    yield f"Error: {e}"

            return StreamingResponse(stream_gen(), media_type="text/plain")
        else:
            result = system.model.generate_content(
                full_prompt,
                generation_config=system.model.GenerationConfig(
                    **(generation_config or {})
                ),
            )
            return JSONResponse(
                {"job_matches": result.text if hasattr(result, "text") else str(result)}
            )
    except Exception as e:
        logger.error(f"Error in /job-matching: {e}")
        return JSONResponse({"error": str(e)}, status_code=500)


app.include_router(router)

# Add more endpoints for other AI-powered career services here
