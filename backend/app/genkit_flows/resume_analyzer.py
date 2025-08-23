import json
import os

import genkit
from app.core.ai_error_handling import (
    AIError,
    AIErrorType,
    validate_ai_response,
    with_ai_error_handling,
)
from app.core.input_validation import InputSanitizer, InputValidationError
from dotenv import load_dotenv
from genkit.plugins import googleai

# Load environment variables from .env file
load_dotenv()

# Initialize the Google AI plugin if not already initialized
if not genkit.get_plugin("googleai"):
    genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])

# Define the Gemini Pro model
gemini_pro = googleai.gemini_pro


@genkit.flow()
@with_ai_error_handling()
def compare_resume_to_job(resume_text: str, job_analysis_data: dict) -> dict:
    """
    Acts as an expert career coach to compare a resume to a job analysis.

    Args:
        resume_text: Raw resume content from user
        job_analysis_data: Structured job analysis data

    Returns:
        dict: Structured analysis with match score and recommendations

    Raises:
        InputValidationError: If input validation fails
        AIError: If AI operation fails
    """
    try:
        # Input validation and sanitization
        if not resume_text or not isinstance(resume_text, str):
            raise InputValidationError("Resume text is required and must be a string")

        if not job_analysis_data or not isinstance(job_analysis_data, dict):
            raise InputValidationError(
                "Job analysis data is required and must be a dictionary"
            )

        # Sanitize inputs to prevent prompt injection
        sanitized_resume = InputSanitizer.sanitize_text_input(resume_text)
        sanitized_job_data = InputSanitizer.sanitize_dict_input(job_analysis_data)

        # Log warnings if any suspicious content was detected
        if sanitized_resume.warnings:
            # In production, you'd want proper logging
            print(f"Resume sanitization warnings: {sanitized_resume.warnings}")

        # Create safe prompt with validated inputs
        prompt_template = """
As an expert career coach, analyze the provided resume against the structured job analysis data.
Your goal is to provide a detailed comparison and actionable feedback.

IMPORTANT: You must respond ONLY with a valid JSON object. No additional text or explanations.

The output must be a valid JSON object with the following structure:
- "match_score": An integer between 0 and 100 representing how well the resume matches the job.
- "matching_skills": A list of skills found in both the resume and the job's key skills.
- "missing_skills": A list of key skills required for the job that are not found in the resume.
- "improvement_suggestions": A list of specific, actionable suggestions for the user to improve their resume for this job.

Resume Text:
---
{resume_content}
---

Job Analysis Data:
---
{job_data}
---

Respond with ONLY the JSON object:"""

        safe_prompt = InputSanitizer.create_safe_prompt(
            prompt_template,
            resume_content=sanitized_resume.sanitized_content,
            job_data=json.dumps(sanitized_job_data, indent=2),
        )

        # Make AI request with error handling
        response = gemini_pro.generate(safe_prompt)

        # Validate response exists
        validated_response = validate_ai_response(response, expected_type=object)
        response_text = validated_response.text()

        # Validate response content
        if not response_text or not response_text.strip():
            raise AIError(
                message="AI returned empty response",
                error_type=AIErrorType.INVALID_REQUEST,
            )

        # Parse and validate JSON response
        try:
            parsed_result = json.loads(response_text.strip())
        except json.JSONDecodeError as e:
            raise AIError(
                message=f"AI returned invalid JSON: {str(e)}",
                error_type=AIErrorType.INVALID_REQUEST,
                original_error=e,
            )

        # Validate required fields in response
        required_fields = [
            "match_score",
            "matching_skills",
            "missing_skills",
            "improvement_suggestions",
        ]
        missing_fields = [
            field for field in required_fields if field not in parsed_result
        ]

        if missing_fields:
            raise AIError(
                message=f"AI response missing required fields: {missing_fields}",
                error_type=AIErrorType.INVALID_REQUEST,
            )

        # Validate field types and ranges
        if not isinstance(parsed_result["match_score"], int) or not (
            0 <= parsed_result["match_score"] <= 100
        ):
            raise AIError(
                message="Match score must be an integer between 0 and 100",
                error_type=AIErrorType.INVALID_REQUEST,
            )

        for field in ["matching_skills", "missing_skills", "improvement_suggestions"]:
            if not isinstance(parsed_result[field], list):
                raise AIError(
                    message=f"Field '{field}' must be a list",
                    error_type=AIErrorType.INVALID_REQUEST,
                )

        return parsed_result

    except InputValidationError as e:
        # Re-raise validation errors as-is
        raise AIError(
            message=f"Input validation failed: {str(e)}",
            error_type=AIErrorType.INVALID_REQUEST,
            original_error=e,
        )

    except AIError:
        # Re-raise AI errors as-is
        raise

    except Exception as e:
        # Catch any other unexpected errors
        raise AIError(
            message=f"Unexpected error in resume analysis: {str(e)}",
            error_type=AIErrorType.UNKNOWN,
            original_error=e,
        )
