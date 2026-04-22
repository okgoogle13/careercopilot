INPUT_TO_REGISTRY_MAP: dict[str, str] = {
    "resume": "resume",
    "cover_letter": "full_letter",
    "ksc_response": "ksc_star",
}


def normalize_doc_id(input_id: str) -> str:
    """Converts an input document type ID to its canonical registry ID."""
    if input_id not in INPUT_TO_REGISTRY_MAP:
        raise ValueError(
            f"Unknown document type: '{input_id}'. Valid types: {list(INPUT_TO_REGISTRY_MAP)}"
        )
    return INPUT_TO_REGISTRY_MAP[input_id]
