from app.core.genkit_init import get_model


def _generate_text(prompt: str) -> str:
    """Generate text lazily through the centralized Genkit runtime."""
    model = get_model()
    if model is None:
        raise RuntimeError("Genkit model not available")

    response = model.generate(prompt=prompt)

    text_attr = getattr(response, "text", None)
    if callable(text_attr):
        return text_attr()
    if isinstance(text_attr, str):
        return text_attr

    output_attr = getattr(response, "output", None)
    if callable(output_attr):
        output_value = output_attr()
        return output_value if isinstance(output_value, str) else str(output_value)

    return str(response)


# Removed @genkit.flow()
def generate_tailored_resume(base_profile_data: dict, comparison_analysis: dict) -> str:
    """
    Acts as an expert resume writer to generate a tailored resume.
    """

    prompt = f"""
    As an expert resume writer, your task is to rewrite the provided base profile data into a new, tailored resume.
    You must use the provided comparison analysis to guide your writing.

    Your rewritten resume should:
    1.  Emphasize the "matching_skills" from the analysis.
    2.  Subtly integrate keywords from the job description and address the "missing_skills"
        by rephrasing experience and responsibilities.
    3.  Incorporate the "improvement_suggestions" from the analysis.
    4.  The final output should be a single string containing the full text of the newly
        generated, optimized resume.

    Base Profile Data:
    ---
    {base_profile_data}
    ---

    Comparison Analysis:
    ---
    {comparison_analysis}
    ---
    """

    return _generate_text(prompt)
