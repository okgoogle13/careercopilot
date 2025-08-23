import os
from typing import Callable, Type

import genkit
from genkit.plugins import googleai
from pydantic import BaseModel

# Initialize Google AI plugin if needed
if not genkit.get_plugin("googleai"):
    genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])

# Define the model to use
gemini_pro = googleai.gemini_pro


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
            config=googleai.GenerationConfig(
                response_mime_type="application/json",
            ),
            output_schema=output_schema,
        )

        return response.output()

    return extraction_flow
