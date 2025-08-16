import genkit
from genkit.plugins import googleai
import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

# Initialize the Google AI plugin if not already initialized
if not genkit.get_plugin("googleai"):
    genkit.init(plugins=[googleai.init(api_key=os.getenv("GEMINI_API_KEY"))])

# Define the Gemini Pro model
gemini_pro = googleai.gemini_pro

# Define the structured output model using Pydantic
class STAR_Response(BaseModel):
    situation: str
    task: str
    action: str
    result: str

@genkit.flow(output_schema=STAR_Response)
def generateKscResponse(user_profile_data: dict, ksc_statement: str) -> STAR_Response:
    """
    Acts as an expert career coach to generate a STAR response for a KSC statement.
    """
    
    prompt = f"""
    As an expert career coach and a master of the STAR interview technique, your task is to generate a response for a Key Selection Criterion (KSC).

    **Objective:**
    1.  Analyze the following Key Selection Criterion: "{ksc_statement}".
    2.  Search through the provided user profile data to find the most relevant real-world example of this skill or experience.
    3.  Using that single, most relevant example, write a comprehensive response that is strictly formatted using the STAR methodology (Situation, Task, Action, Result).
    4.  The final output must be a JSON object with four keys: "situation", "task", "action", and "result".

    **User Profile Data:**
    ```json
    {user_profile_data}
    ```

    Now, generate the STAR response based on the user's experience.
    """
    
    # Generate the response using the Gemini model, ensuring JSON output
    response = gemini_pro.generate(
        prompt=prompt,
        config=googleai.GenerationConfig(
            response_mime_type="application/json",
        ),
    )
    
    return response.output()
