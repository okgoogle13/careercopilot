import genkit
from genkit.core.typing import GenerateRequest
from app.schemas.career_master import CareerDatabase
import logging

logger = logging.getLogger(__name__)

# The Master Prompt from ingestion_prompts.md
SYSTEM_PROMPT = """
### Master Career Database Ingestion
**System Role:** Career Database Pre-processor
**Input:** Raw file text content.

Analyze the following collection of career documents, provided as separate files.
Extract, analyze, de-duplicate, merge, and structure the information from ALL provided documents into a single, coherent JSON object.

**Core Instructions:**
1.  **De-duplication & Merging**: Identify identical roles across different documents and merge them.
2.  **Structured Achievements**: Rewrite text into "Action Verb + Noun + Metric + Strategy + Outcome".
3.  **KSC to STAR Method**: Structure narrative selection criteria responses into STAR format.

4.  **DEEP STAR CRITIQUE & VALIDATION**:
    For every KSC Response, perform a "High-Impact Audit". Set 'Needs_Review_Flag' to true if any of the following are detected:
    
    - **Vague Language Audit**: Check for "fluff" words like "assisted," "involved in," "handled," or "helped with." Replace with power verbs like "orchestrated," "standardized," "mitigated," or "pioneered."
    - **Quantification Gap**: If the 'Result' lacks numbers, percentages, dollar amounts, or timeframes (e.g., "improved efficiency" vs. "reduced processing time by 30%"), flag it.
    - **Detail Deficiency**:
        - **Situation**: Is the scale of the project or team size missing?
        - **Task**: Is the specific business problem or obstacle unclear?
        - **Action**: Are the technical tools or specific steps missing? (e.g., "I used software" vs. "I leveraged Python's Pandas library to automate...").
        - **Result**: Is the qualitative impact (stakeholder feedback, award) or quantitative metric missing?

    - **STAR_Feedback**: Provide a professional, critical analysis. Tell the user exactly *why* their response is currently weak.
    - **Improvement_Suggestions**: Provide draft rewrites that include placeholders (e.g., "[Insert Number here]") to show the user exactly where they need to provide more data to reach a 10/10 rating.

5.  **Achievement Optimization**:
    For EVERY Structured Achievement, provide an "Improvement_Suggestions" object. 
    Analyze the original text and provide the strongest possible version for the Action Verb, Noun/Task, Metric, Strategy, and Outcome. 
    If the metric is missing in the original, suggest a realistic placeholder.

6.  **Subtype Tagging**: Apply relevant tags aligned with Australian Community Services best practices (e.g., NDIS, Trauma-Informed, Strengths-Based).
7.  **Unique IDs**: Generate IDs like 'work-1', 'ach-1', 'ksc-1'.

8.  **Skill Enrichment**:
    For every skill in 'Master_Skills_Inventory', attempt to infer the 'Proficiency' (Novice, Competent, Proficient, Expert, Master) and 'Years_Experience' based on the duration of roles where that skill was used.

9. **Job Preferences**:
    Infer the user's implicit job preferences (e.g., if they have only worked remote recently, mark remote) and extract any explicit ones found in summaries or objective statements.
"""

def ingest_career_history(text_content: str) -> CareerDatabase:
    """
    Genkit flow to parse raw text into structured CareerDatabase.
    """
    # Assuming valid Genkit instance availability or using the library's registry
    # In some setups, you might need: from app.core.genkit import genkit as ai
    try:
        ai = genkit.get_ai("googleai") 
    except Exception:
        # Fallback to importing the singleton if registry lookup fails
        from app.core.genkit import genkit as ai
    
    if not ai:
        raise RuntimeError("Genkit AI instance not available")

    # 1. Generate Structured Data
    response = ai.generate(
        model="gemini-1.5-pro",
        prompt=f"{SYSTEM_PROMPT}\n\nINPUT TEXT:\n{text_content}",
        output_schema=CareerDatabase
    )
    
    career_db = response.output

    # 2. Post-Processing: Vector Embeddings (Pseudo-code for integration)
    # We iterate through achievements to create semantic embeddings for RAG
    try:
        embedder = ai.embedder("text-embedding-004")
        
        texts_to_embed = []
        for ach in career_db.structured_achievements:
            # Create a semantic sentence representation
            text = f"{ach.action_verb} {ach.noun_task} resulting in {ach.outcome}"
            texts_to_embed.append(text)
            
        if texts_to_embed:
            # Check if embedder supports batch embedding
            embeddings = embedder.embed_many(texts_to_embed)
            for i, ach in enumerate(career_db.structured_achievements):
                ach.embedding = embeddings[i]
                
    except Exception as e:
        logger.warning(f"Embedding generation failed: {e}. Proceeding without embeddings.")

    return career_db
