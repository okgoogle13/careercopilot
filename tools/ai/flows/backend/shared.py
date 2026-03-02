from typing import Callable, Type, TypeVar, cast

from pydantic import BaseModel

from app.core.genkit import get_model
from app.genkit_flows.flow_decorator import create_flow_wrapper


T = TypeVar("T", bound=BaseModel)


def create_extraction_flow(
    name: str, prompt_template: str, output_schema: Type[T]
) -> Callable[[str], T]:
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

    def extraction_flow(input_text: str) -> T:
        """
        A dynamically generated flow for entity extraction.
        """
        prompt = prompt_template.format(input_text=input_text)

        # Model availability is guaranteed by the decorator
        model = get_model()  # type: ignore[no-untyped-call]

        response = model.generate(
            prompt=prompt,
            config={
                "response_mime_type": "application/json",
            },
            output_schema=output_schema,
        )

        return cast(T, response.output())

    # Wrap with our standardized decorator
    return create_flow_wrapper(func=extraction_flow, name=name, output_schema=output_schema)
