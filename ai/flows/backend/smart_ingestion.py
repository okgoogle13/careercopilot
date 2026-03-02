"""
Smart Ingestion Genkit Flows

AI-powered document ingestion flows for extracting structured career data from resumes,
Key Selection Criteria documents, and voice/writing samples.

This module implements the core AI extraction logic for the Smart Ingestion feature:
1. Context Tagger - Suggests roleType and subsectors from document content
2. Resume Extractor - Extracts comprehensive career data (MasterCareerProfile schema v4)
3. KSC Extractor - Extracts Key Selection Criteria examples and related skills
4. Voice Profile Extractor - Analyzes writing style, tone, and vocabulary

All flows use gemini-3.0-pro for structured JSON output and large context windows.
"""

import logging
from typing import List, Optional

from pydantic import BaseModel, Field

from app.core.enhanced_ai_error_handling import (
    AIOperationContext,
    AIServiceType,
    create_fallback_strategy,
    enhanced_ai_handler,
)
from app.core.genkit import get_model
from app.genkit_flows.flow_decorator import genkit_flow
from app.models.asset_library_schema import VoiceProfile
from app.models.ingestion_schemas import SuggestedTags
from app.models.master_profile_schema import (
    KeySelectionCriteriaExample,
    MasterCareerProfile,
)

logger = logging.getLogger(__name__)


# ============================================================================
# Helper Functions
# ============================================================================


async def _generate_with_model(
    prompt: str, output_schema: type[BaseModel], operation_name: str, user_id: str = "system"
) -> BaseModel:
    """
    Generate structured output from Gemini model with enhanced error handling.

    Args:
        prompt: The prompt to send to the model
        output_schema: Pydantic model for structured output
        operation_name: Name of the operation for logging
        user_id: User ID for tracking (default: "system")

    Returns:
        Parsed output matching the output_schema

    Raises:
        RuntimeError: If model is unavailable or generation fails
    """
    model = get_model()
    if not model:
        raise RuntimeError(f"Genkit model not available for {operation_name}")

    async def _generate():
        response = await model.generate(
            prompt=prompt,
            output_schema=output_schema,
            config={
                "response_mime_type": "application/json",
                "temperature": 0.2,  # Lower temperature for more consistent extraction
            },
        )
        return response.output()

    # Execute with enhanced error handling
    result = await enhanced_ai_handler.execute_ai_operation(
        _generate,
        AIOperationContext(
            operation_name=operation_name,
            service_type=AIServiceType.GENKIT_FLOW,
            user_id=user_id,
            input_size=len(prompt),
        ),
        create_fallback_strategy(enabled=True, degraded_mode=False),
    )

    if not result.success:
        raise RuntimeError(
            f"{operation_name} failed: {result.error.message if result.error else 'Unknown error'}"
        )

    return result.data


# ============================================================================
# Flow 1: Context Tagger
# ============================================================================


@genkit_flow(output_schema=SuggestedTags, require_model=True)
async def contextTaggerFlow(documentText: str, user_id: str = "anonymous") -> SuggestedTags:
    """
    Analyze a career document and suggest contextual tags (roleType, subsectors).

    This flow examines the document content to identify:
    - Primary role type (e.g., "Social Worker", "Software Engineer", "Project Manager")
    - Relevant industry subsectors (e.g., ["Healthcare", "Community Services"])

    Args:
        documentText: The full text content of the uploaded document
        user_id: Firebase UID of the user (for logging/tracking)

    Returns:
        SuggestedTags with roleType, subsectors, and confidence score

    Example:
        Input: Resume for a social worker in healthcare
        Output: {
            "roleType": "Social Worker",
            "subsectors": ["Healthcare", "Mental Health", "Community Services"],
            "confidence": 0.92
        }
    """
    logger.info(f"Starting context tagging for user {user_id}")

    prompt = f"""You are an expert career analyst. Analyze the following career document and identify:

1. **Primary Role Type**: The main professional role this person holds or is targeting.
   - Be specific but not overly narrow (e.g., "Software Engineer" not "Python Developer")
   - Use common industry terminology (e.g., "Social Worker", "Project Manager", "Data Analyst")

2. **Industry Subsectors**: 2-5 relevant industry subsectors or specializations.
   - Include both broad and specific areas (e.g., ["Healthcare", "Mental Health", "Community Services"])
   - Consider the person's experience, skills, and stated interests

3. **Confidence Score**: Your confidence in these categorizations (0.0 to 1.0)
   - Base this on the clarity and specificity of the document
   - Lower confidence if the document is vague or multi-disciplinary

**Document Content:**
{documentText[:4000]}  # Limit to first 4000 chars for context window

**Instructions:**
- Be specific and actionable
- Use standard industry terminology
- Provide 2-5 subsectors, ranked by relevance
- Return valid JSON matching the SuggestedTags schema
"""

    suggested_tags = await _generate_with_model(
        prompt=prompt,
        output_schema=SuggestedTags,
        operation_name="context_tagger",
        user_id=user_id,
    )

    logger.info(
        f"Context tagging completed: {suggested_tags.roleType}, "
        f"{len(suggested_tags.subsectors)} subsectors, "
        f"confidence: {suggested_tags.confidence:.2f}"
    )

    return suggested_tags


# ============================================================================
# Flow 2: Resume Extractor
# ============================================================================


@genkit_flow(output_schema=MasterCareerProfile, require_model=True)
async def resumeExtractorFlow(
    resumeText: str, confirmedTags: dict, user_id: str = "anonymous"
) -> MasterCareerProfile:
    """
    Extract comprehensive structured career data from a resume.

    This flow implements the Resume Extractor Schema v4 ("gold standard") and extracts:
    - Personal information (name, contact details, summary)
    - Work experience with responsibilities, achievements (STAR format), and skills used
    - Projects with technologies and descriptions
    - Education with degrees, institutions, and dates
    - Skills categorized into technical, tools, soft skills, and methodologies
    - Certifications and licenses
    - Key Selection Criteria examples (if present)

    Args:
        resumeText: The full text content of the resume
        confirmedTags: User-confirmed tags (roleType, subsectors) for context
        user_id: Firebase UID of the user

    Returns:
        MasterCareerProfile with all extracted structured data

    Example:
        Input: PDF resume for a social worker
        Output: Complete MasterCareerProfile with all fields populated
    """
    logger.info(f"Starting resume extraction for user {user_id}")

    role_type = confirmedTags.get("roleType", "Professional")
    subsectors = confirmedTags.get("subsectors", [])

    prompt = f"""You are an expert resume parser. Extract comprehensive structured data from this resume.

**Context:**
- Target Role: {role_type}
- Industry Subsectors: {', '.join(subsectors) if subsectors else 'General'}

**Resume Content:**
{resumeText}

**Extraction Instructions:**

1. **Personal Info:**
   - Extract name, email (required), phone, location, LinkedIn, portfolio
   - Write a 2-4 sentence professional summary highlighting key experience and goals

2. **Work Experience:**
   - Consolidate multiple roles at the same company into ONE entry
   - Use YYYY-MM format for dates (e.g., "2022-03")
   - Separate responsibilities (general duties) from achievements (quantifiable results)
   - **Achievements must use STAR format**: Situation, Task, Action, Result
   - Extract skills used in EACH role (technical skills, tools, methodologies)

3. **Projects:**
   - Extract personal/professional projects
   - Include technologies used and project descriptions
   - Capture links if available

4. **Education:**
   - Extract institution, degree, field of study (core field only, e.g., "Marketing" not "Business in Marketing")
   - Use YYYY-MM or YYYY format for dates
   - Include honors, GPA, relevant coursework in notes

5. **Skills (CRITICAL - Categorize ALL mentioned skills):**
   - **Technical**: Domain-specific expertise (e.g., "Case Management", "Pharmacokinetics", "Data Analysis")
   - **Tools**: Software/hardware (e.g., "Microsoft Office", "Salesforce", "Jira", "Python")
   - **Soft**: Interpersonal skills (e.g., "Communication", "Empathy", "Leadership")
   - **Methodologies**: Frameworks/processes (e.g., "Agile", "Project Management", "STAR methodology")
   - **MUST populate tools array if ANY tools are mentioned**

6. **Certifications:**
   - Extract all professional certifications and licenses

7. **Key Selection Criteria Examples:**
   - Extract ONLY if explicitly present as KSC responses or STAR examples
   - Analyze each example to populate relatedSkills array

**Output Format:**
Return valid JSON matching the MasterCareerProfile schema v4.
"""

    master_profile = await _generate_with_model(
        prompt=prompt,
        output_schema=MasterCareerProfile,
        operation_name="resume_extraction",
        user_id=user_id,
    )

    logger.info(
        f"Resume extraction completed: {len(master_profile.workExperience)} work experiences, "
        f"{len(master_profile.education)} education entries, "
        f"{len(master_profile.skills.technical)} technical skills"
    )

    return master_profile


# ============================================================================
# Flow 3: KSC Extractor
# ============================================================================


class KSCExtractionResult(BaseModel):
    """Result of KSC extraction with criteria examples and related skills."""

    examples: List[KeySelectionCriteriaExample] = Field(
        ..., description="Extracted Key Selection Criteria examples"
    )


@genkit_flow(output_schema=KSCExtractionResult, require_model=True)
async def kscExtractorFlow(
    kscText: str, confirmedTags: dict, user_id: str = "anonymous"
) -> KSCExtractionResult:
    """
    Extract Key Selection Criteria (KSC) examples from a document.

    This flow focuses on extracting longer-form KSC responses that demonstrate
    specific competencies, typically using the STAR (Situation, Task, Action, Result) format.

    Args:
        kscText: The full text content of the KSC document
        confirmedTags: User-confirmed tags for context
        user_id: Firebase UID of the user

    Returns:
        KSCExtractionResult with list of KeySelectionCriteriaExample objects

    Example:
        Input: Document with 3 KSC responses
        Output: {
            "examples": [
                {
                    "criteria": "Demonstrate experience in stakeholder management",
                    "example": "In my role as...",
                    "relatedSkills": ["Stakeholder Management", "Communication", "Negotiation"]
                },
                ...
            ]
        }
    """
    logger.info(f"Starting KSC extraction for user {user_id}")

    role_type = confirmedTags.get("roleType", "Professional")

    prompt = f"""You are an expert at analyzing Key Selection Criteria (KSC) responses.

**Context:**
- Target Role: {role_type}

**Document Content:**
{kscText}

**Extraction Instructions:**

1. **Identify KSC Questions/Criteria:**
   - Look for explicit KSC questions or criteria statements
   - Common patterns: "Demonstrate...", "Provide an example of...", "Describe a time when..."

2. **Extract Full Responses:**
   - Capture the complete response for each criterion
   - Include all STAR elements if present (Situation, Task, Action, Result)

3. **Analyze Related Skills:**
   - For EACH example, carefully analyze the text
   - Extract skills demonstrated (technical, tools, soft skills, methodologies)
   - Be comprehensive - include both explicitly mentioned and implicitly demonstrated skills

**Output Format:**
Return valid JSON with a list of KeySelectionCriteriaExample objects.
Each must have:
- criteria: The KSC question/statement
- example: The full response text
- relatedSkills: Array of skills demonstrated (MUST be populated)
"""

    ksc_result = await _generate_with_model(
        prompt=prompt,
        output_schema=KSCExtractionResult,
        operation_name="ksc_extraction",
        user_id=user_id,
    )

    logger.info(f"KSC extraction completed: {len(ksc_result.examples)} examples extracted")

    return ksc_result


# ============================================================================
# Flow 4: Voice Profile Extractor
# ============================================================================


@genkit_flow(output_schema=VoiceProfile, require_model=True)
async def voiceProfileExtractorFlow(
    writingSample: str, confirmedTags: dict, user_id: str = "anonymous"
) -> VoiceProfile:
    """
    Analyze a writing sample to extract voice profile characteristics.

    This flow identifies the user's writing style, tone, vocabulary level, and other
    characteristics that can be used to personalize AI-generated content.

    Args:
        writingSample: Text sample for analysis (cover letter, email, etc.)
        confirmedTags: User-confirmed tags for context
        user_id: Firebase UID of the user

    Returns:
        VoiceProfile with tone, style, vocabularyLevel, and other characteristics

    Example:
        Input: Professional cover letter
        Output: {
            "tone": "Professional and Persuasive",
            "style": "Concise and achievement-focused",
            "vocabularyLevel": "Advanced",
            "sentenceComplexity": "Mix of simple and compound sentences",
            "preferredPhrasing": ["I successfully", "demonstrated ability", "proven track record"]
        }
    """
    logger.info(f"Starting voice profile extraction for user {user_id}")

    prompt = f"""You are an expert writing style analyst. Analyze this writing sample to create a detailed voice profile.

**Writing Sample:**
{writingSample[:3000]}  # Limit for context window

**Analysis Instructions:**

1. **Tone:**
   - Identify the overall tone (e.g., "Professional", "Conversational", "Academic", "Persuasive", "Warm and approachable")
   - Be specific and use compound descriptors if appropriate (e.g., "Professional and Persuasive")

2. **Style:**
   - Describe the writing style (e.g., "Concise and direct", "Descriptive and detailed", "Narrative-driven", "Achievement-focused")
   - Note key stylistic characteristics

3. **Vocabulary Level:**
   - Assess sophistication: "Simple", "Moderate", "Advanced", "Technical"
   - Base this on word choice and domain-specific terminology

4. **Sentence Complexity (Optional):**
   - Describe average complexity: "Simple sentences", "Compound sentences", "Complex structures", "Mix of simple and compound"

5. **Preferred Phrasing (Optional):**
   - Extract 3-5 phrases the writer frequently uses
   - Look for action verbs, transitional phrases, and characteristic expressions
   - Examples: "I successfully", "demonstrated ability", "proven track record"

**Output Format:**
Return valid JSON matching the VoiceProfile schema.
"""

    voice_profile = await _generate_with_model(
        prompt=prompt,
        output_schema=VoiceProfile,
        operation_name="voice_profile_extraction",
        user_id=user_id,
    )

    logger.info(
        f"Voice profile extraction completed: tone={voice_profile.tone}, "
        f"vocab={voice_profile.vocabularyLevel}"
    )

    return voice_profile


# ============================================================================
# Flow 5: Skills Extractor
# ============================================================================


class SkillsExtractionResult(BaseModel):
    """Result of skills extraction with categorized skills."""

    technical: List[str] = Field(default_factory=list, description="Technical skills")
    tools: List[str] = Field(default_factory=list, description="Software and tools")
    soft: List[str] = Field(default_factory=list, description="Soft/interpersonal skills")
    methodologies: List[str] = Field(default_factory=list, description="Methodologies and frameworks")


@genkit_flow(output_schema=SkillsExtractionResult, require_model=True)
async def skillsExtractorFlow(
    resumeText: str, confirmedTags: dict, user_id: str = "anonymous"
) -> SkillsExtractionResult:
    """
    Extract and categorize skills from a resume or document.

    This flow performs deep skill extraction and categorization, identifying:
    - Technical skills (domain-specific expertise)
    - Tools (software, platforms, applications)
    - Soft skills (interpersonal and professional)
    - Methodologies (frameworks, processes, approaches)

    Args:
        resumeText: The full text content of the resume
        confirmedTags: User-confirmed tags for context
        user_id: Firebase UID of the user

    Returns:
        SkillsExtractionResult with categorized skills

    Example:
        Input: Resume for a software engineer
        Output: {
            "technical": ["Full-stack development", "System design", "REST APIs"],
            "tools": ["Python", "React", "PostgreSQL", "Docker"],
            "soft": ["Team leadership", "Communication", "Problem-solving"],
            "methodologies": ["Agile", "CI/CD", "Test-driven development"]
        }
    """
    logger.info(f"Starting comprehensive skills extraction for user {user_id}")

    role_type = confirmedTags.get("roleType", "Professional")
    subsectors = confirmedTags.get("subsectors", [])

    prompt = f"""You are an expert career skills analyst. Extract and categorize ALL skills mentioned in this resume.

**Context:**
- Target Role: {role_type}
- Industry Subsectors: {', '.join(subsectors) if subsectors else 'General'}

**Resume Content:**
{resumeText}

**Extraction Instructions:**

1. **Technical Skills** - Domain-specific expertise and specialized knowledge
   - Examples for software engineer: "Full-stack development", "Microservices architecture", "API design"
   - Examples for social worker: "Case management", "Crisis intervention", "Community development"
   - Be specific to the domain and role

2. **Tools** - Software, platforms, programming languages, frameworks, and applications
   - Examples: "Python", "React", "AWS", "Salesforce", "Microsoft Excel", "JIRA", "Docker"
   - Include programming languages, frameworks, platforms, and software tools
   - Only include tools that are explicitly or implicitly mentioned

3. **Soft Skills** - Interpersonal, communication, and professional development skills
   - Examples: "Leadership", "Communication", "Problem-solving", "Team collaboration", "Empathy", "Negotiation"
   - Focus on human-centered and professional competencies

4. **Methodologies** - Frameworks, processes, approaches, and best practices
   - Examples: "Agile", "Scrum", "Lean", "Design thinking", "STAR methodology", "Project management"
   - Include approaches, frameworks, and systematic processes mentioned

**Requirements:**
- Extract EVERY skill mentioned, including implicit skills demonstrated through responsibilities
- Avoid duplicates - consolidate similar skills under one name
- Be comprehensive but avoid being overly granular
- Sort by frequency/importance (most mentioned or most prominent first)
- Return valid JSON matching the SkillsExtractionResult schema

**Output Format:**
{{
    "technical": ["skill1", "skill2", ...],
    "tools": ["tool1", "tool2", ...],
    "soft": ["skill1", "skill2", ...],
    "methodologies": ["method1", "method2", ...]
}}
"""

    skills_result = await _generate_with_model(
        prompt=prompt,
        output_schema=SkillsExtractionResult,
        operation_name="skills_extraction",
        user_id=user_id,
    )

    logger.info(
        f"Skills extraction completed: {len(skills_result.technical)} technical, "
        f"{len(skills_result.tools)} tools, "
        f"{len(skills_result.soft)} soft skills, "
        f"{len(skills_result.methodologies)} methodologies"
    )

    return skills_result


# ============================================================================
# Flow Registration (automatic via decorators)
# ============================================================================

# Flows are automatically registered by the @genkit_flow decorator
logger.info("Smart Ingestion Genkit flows registered successfully")
