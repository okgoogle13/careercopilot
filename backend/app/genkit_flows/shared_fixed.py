"""
Fixed shared utilities for Genkit flows with correct imports
"""

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
GEMINI_1_5_PRO = google_genai.models.gemini.GEMINI_1_5_PRO

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
    if not _google_ai_initialized:
        raise RuntimeError("Google AI plugin not initialized. Check GEMINI_API_KEY.")

    @genkit.ai.flow(name)
    async def extraction_flow(input_text: str) -> output_schema:
        prompt_text = prompt_template.format(input_text=input_text)
        
        # Use the generate method with the Gemini model
        response = await genkit.ai.generate(
            prompt=prompt_text,
            model=GEMINI_1_5_PRO,
            config={
                "response_mime_type": "application/json",
                "response_schema": output_schema.schema()
            },
        )
        
        # Parse the response as JSON and validate with Pydantic
        return output_schema.parse_raw(response.text)

    return extraction_flow

# Export commonly used items
__all__ = [
    'create_extraction_flow',
    'GEMINI_1_5_PRO',
    'initialize_google_ai',
]