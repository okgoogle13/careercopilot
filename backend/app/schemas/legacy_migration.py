<<<<<<< HEAD
from typing import List, Optional, Any, Dict
from pydantic import BaseModel

=======
from pydantic import BaseModel


>>>>>>> restoration-KR-Rage-Figma-v2.0
class ATSScoringInput(BaseModel):
    user_id: str
    resume_text: str
    job_description: str
<<<<<<< HEAD
    profile_keywords: Optional[List[str]] = None
=======
    profile_keywords: list[str] | None = None
>>>>>>> restoration-KR-Rage-Figma-v2.0

# We can re-use the AtsResult from genkit_flows if we want strong typing for the return value
# within the bridge, but the legacy interface returns a Dict.
# For the migration schema, we might just define the input to be strict.
