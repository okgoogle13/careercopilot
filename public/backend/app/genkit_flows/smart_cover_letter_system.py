# smart_cover_letter_system.py
# AI-powered cover letter generation system

import os
from typing import Optional, Dict, Any

# Install: pip install google-cloud-aiplatform
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel, GenerationConfig
except ImportError:
    GenerativeModel = None
    GenerationConfig = None


class SmartCoverLetterSystem:
    def review_resume(
        self,
        resume_text: str,
        stream: bool = False,
        generation_config: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Reviews a resume and provides feedback."""
        prompt = f"Review the following resume and provide constructive feedback, strengths, and areas for improvement.\nResume: {resume_text}"
        if generation_config is None:
            generation_config = {
                "max_output_tokens": 1024,
                "temperature": 0.7,
                "top_p": 1.0,
            }
        try:
            if stream:
                response_stream = self.model.generate_content(
                    prompt,
                    generation_config=GenerationConfig(**generation_config),
                    stream=True,
                )
                full_response = ""
                for chunk in response_stream:
                    full_response += chunk.text
                    print(chunk.text, end="")
                return full_response
            else:
                response = self.model.generate_content(
                    prompt, generation_config=GenerationConfig(**generation_config)
                )
                return response.text if hasattr(response, "text") else str(response)
        except Exception as e:
            print(f"An error occurred: {e}")
            return ""

    def interview_qa(
        self,
        resume_text: str,
        job_description: str,
        stream: bool = False,
        generation_config: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Generates interview questions and sample answers."""
        prompt = f"Generate a list of interview questions and sample answers for the following job description and resume.\nResume: {resume_text}\nJob Description: {job_description}"
        if generation_config is None:
            generation_config = {
                "max_output_tokens": 1024,
                "temperature": 0.7,
                "top_p": 1.0,
            }
        try:
            if stream:
                response_stream = self.model.generate_content(
                    prompt,
                    generation_config=GenerationConfig(**generation_config),
                    stream=True,
                )
                full_response = ""
                for chunk in response_stream:
                    full_response += chunk.text
                    print(chunk.text, end="")
                return full_response
            else:
                response = self.model.generate_content(
                    prompt, generation_config=GenerationConfig(**generation_config)
                )
                return response.text if hasattr(response, "text") else str(response)
        except Exception as e:
            print(f"An error occurred: {e}")
            return ""

    def job_matching(
        self,
        resume_text: str,
        jobs: list,
        stream: bool = False,
        generation_config: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Suggests best job matches based on resume and job descriptions."""
        jobs_text = "\n\n".join(jobs) if isinstance(jobs, list) else str(jobs)
        prompt = f"Given the following resume and job descriptions, suggest the best job matches and explain why.\nResume: {resume_text}\nJob Descriptions: {jobs_text}"
        if generation_config is None:
            generation_config = {
                "max_output_tokens": 1024,
                "temperature": 0.7,
                "top_p": 1.0,
            }
        try:
            if stream:
                response_stream = self.model.generate_content(
                    prompt,
                    generation_config=GenerationConfig(**generation_config),
                    stream=True,
                )
                full_response = ""
                for chunk in response_stream:
                    full_response += chunk.text
                    print(chunk.text, end="")
                return full_response
            else:
                response = self.model.generate_content(
                    prompt, generation_config=GenerationConfig(**generation_config)
                )
                return response.text if hasattr(response, "text") else str(response)
        except Exception as e:
            print(f"An error occurred: {e}")
            return ""

    """A system to generate cover letters using Google's Generative AI.

    This class uses the Vertex AI SDK to interact with a generative model (e.g., Gemini)
    to create a cover letter tailored to a specific job description based on a resume.
    """

    def __init__(
        self,
        project_id: Optional[str] = None,
        location: str = "us-central1",
        model_name: str = "gemini-1.5-pro-001",
    ):
        """Initializes the SmartCoverLetterSystem.

        Args:
            project_id: The Google Cloud project ID.
            location: The Google Cloud location.
            model_name: The name of the generative model to use.
        """
        self.project_id = project_id or os.getenv("VERTEX_AI_PROJECT_ID")
        self.location = location
        self.model_name = model_name

        if GenerativeModel is None:
            raise ImportError(
                "google-cloud-aiplatform is not installed. Run 'pip install google-cloud-aiplatform'."
            )

        vertexai.init(project=self.project_id, location=self.location)
        self.model = GenerativeModel(self.model_name)

    def generate_cover_letter(
        self,
        resume_text: str,
        job_description: str,
        stream: bool = False,
        generation_config: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Generates a cover letter.

        Args:
            resume_text: The text of the resume.
            job_description: The text of the job description.
            stream: Whether to stream the response.
            generation_config: A dictionary of generation configuration parameters.

        Returns:
            The generated cover letter.
        """
        prompt = f"Generate a professional cover letter based on the following resume and job description.\nResume: {resume_text}\nJob Description: {job_description}"

        if generation_config is None:
            generation_config = {
                "max_output_tokens": 1024,
                "temperature": 0.7,
                "top_p": 1.0,
            }

        try:
            if stream:
                response_stream = self.model.generate_content(
                    prompt,
                    generation_config=GenerationConfig(**generation_config),
                    stream=True,
                )
                full_response = ""
                for chunk in response_stream:
                    full_response += chunk.text
                    print(chunk.text, end="")
                return full_response
            else:
                response = self.model.generate_content(
                    prompt, generation_config=GenerationConfig(**generation_config)
                )
                return response.text if hasattr(response, "text") else str(response)
        except Exception as e:
            print(f"An error occurred: {e}")
            return ""


# Example usage
if __name__ == "__main__":
    # Set your Google Cloud project ID and authenticate before running
    # export VERTEX_AI_PROJECT_ID="your-gcp-project-id"
    # gcloud auth application-default login
    try:
        system = SmartCoverLetterSystem()
        resume = "A highly skilled software engineer with 5 years of experience in Python, Django, and React."
        job = "We are looking for a senior software engineer with experience in Python and modern web frameworks."

        print("--- Generating non-streamed cover letter ---")
        cover_letter = system.generate_cover_letter(resume, job)
        print(cover_letter)

        print("\n--- Generating streamed cover letter ---")
        system.generate_cover_letter(resume, job, stream=True)

    except ImportError as e:
        print(e)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
