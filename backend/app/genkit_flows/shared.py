from typing import Callable, Type

from app.genkit_flows.flow_decorator import create_flow_wrapper
from app.core.genkit_init import get_model
from pydantic import BaseModel


def create_extraction_flow(
    name: str, prompt_template: str, output_schema: Type[BaseModel]
) -> Callable[[str], BaseModel]:
    """
    Creates a reusable Genkit flow for extracting structured data from text.
    Now uses the standardized flow decorator system.

    Args:
        name: The name for the generated flow.
        prompt_template: The prompt template to use for the AI model.
                         It must contain a single `{input_text}` placeholder.
        output_schema: The Pydantic model to use for the structured output.

    Returns:
        A Genkit flow function.
    """
    
    def extraction_flow(input_text: str) -> BaseModel:
        """
        A dynamically generated flow for entity extraction.
        """
        prompt = prompt_template.format(input_text=input_text)
        
        # Model availability is guaranteed by the decorator
        model = get_model()
        
        response = model.generate(
            prompt=prompt,
            config={
                "response_mime_type": "application/json",
            },
            output_schema=output_schema,
        )

        return response.output()

    # Wrap with our standardized decorator
    return create_flow_wrapper(
        func=extraction_flow,
        name=name,
        output_schema=output_schema
    )
