import os
from typing import Callable, Type

import genkit
from genkit.plugins import google_genai
from pydantic import BaseModel


# Initialize Google AI plugin if needed
def initialize_google_ai():
    """Initialize Google AI plugin with error handling"""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")

        # Initialize the GoogleAI plugin
        google_ai_plugin = google_genai.GoogleAI()
        google_ai_plugin.initialize(api_key=api_key)

        return True
    except Exception as e:
        print(f"Warning: Failed to initialize Google AI plugin: {e}")
        return False


# Initialize on import
_google_ai_initialized = initialize_google_ai()

# Get the Gemini 1.5 Pro model constant
gemini_pro = google_genai.models.gemini.GEMINI_1_5_PRO


def create_extraction_flow(
    name: str, prompt_template: str, output_schema: Type[BaseModel]
) -> Callable[[str], BaseModel]:
    """
    Creates a reusable Genkit flow for extracting structured data from text.

    Args:
        name: The name for the generated flow.
        prompt_template: The prompt template to use for the AI model.
                         It must contain a single `{input_text}` placeholder.
        output_schema: The Pydantic model to use for the structured output.

    Returns:
        A Genkit flow function.
    """

    @genkit.flow(name=name, output_schema=output_schema)
    def extraction_flow(input_text: str) -> BaseModel:
        """
        A dynamically generated flow for entity extraction.
        """
        prompt = prompt_template.format(input_text=input_text)

        response = gemini_pro.generate(
            prompt=prompt,
            config={
                "response_mime_type": "application/json",
            },
            output_schema=output_schema,
        )

        return response.output()

    return extraction_flow
