from pydantic import BaseModel


class ATSScoringInput(BaseModel):
    user_id: str
    resume_text: str
    job_description: str
    profile_keywords: list[str] | None = None

# We can re-use the AtsResult from genkit_flows if we want strong typing for the return value
# within the bridge, but the legacy interface returns a Dict.
# For the migration schema, we might just define the input to be strict.
