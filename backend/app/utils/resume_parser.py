"""
Resume Parser Utilities with Optimized spaCy Model Loading

This module demonstrates how to use the NLP Model Manager to efficiently
parse resumes without loading the spaCy model on every request.

BEFORE: Loading model on every request (SLOW)
AFTER: Using cached model from singleton (FAST)
"""

import logging
import re
from dataclasses import dataclass
from typing import Any

from app.core.nlp_model_manager import get_spacy_model, load_spacy_model

logger = logging.getLogger(__name__)


@dataclass
class ResumeParseResult:
    """Structured result from resume parsing."""

    skills: list[str]
    entities: dict[str, list[str]]
    education: list[dict[str, str]]
    experience: list[dict[str, str]]
    contact_info: dict[str, str | None]
    sections: dict[str, str]
    word_count: int
    sentence_count: int
    parsing_time_ms: float


class OptimizedResumeParser:
    """
    Resume parser that uses cached spaCy models for optimal performance.

    This solves the performance issue of loading spaCy models on every request
    by using the NLP Model Manager singleton.
    """

    def __init__(self, model_name: str = "en_core_web_sm"):
        """
        Initialize the resume parser.

        Args:
            model_name: Name of the spaCy model to use
        """
        self.model_name = model_name
        self.skill_patterns = self._load_skill_patterns()

    def parse_resume(self, resume_text: str) -> ResumeParseResult:
        """
        Parse a resume using the optimized cached spaCy model.

        PERFORMANCE OPTIMIZATION:
        - Before: spacy.load() called every time (~2-3 seconds per request)
        - After: Uses cached model from singleton (~20-50ms per request)

        Args:
            resume_text: The resume text to parse

        Returns:
            ResumeParseResult with extracted information
        """
        import time

        start_time = time.time()

        try:
            # Get the cached model (fast!)
            nlp = get_spacy_model(self.model_name)

            if nlp is None:
                # Model not loaded yet, load it (this should only happen once)
                logger.info(f"Model {self.model_name} not cached, loading...")
                nlp = load_spacy_model(self.model_name)

            # Process the text with spaCy
            doc = nlp(resume_text)

            # Extract information using the processed doc
            result = ResumeParseResult(
                skills=self._extract_skills(doc, resume_text),
                entities=self._extract_entities(doc),
                education=self._extract_education(doc, resume_text),
                experience=self._extract_experience(doc, resume_text),
                contact_info=self._extract_contact_info(doc, resume_text),
                sections=self._extract_sections(resume_text),
                word_count=len([token for token in doc if not token.is_space]),
                sentence_count=len(list(doc.sents)),
                parsing_time_ms=round((time.time() - start_time) * 1000, 2),
            )

            logger.debug(
                f"Resume parsed in {result.parsing_time_ms}ms "
                f"({result.word_count} words, {result.sentence_count} sentences)"
            )

            return result

        except Exception as e:
            logger.error(f"Error parsing resume: {e!s}")
            raise

    def _extract_skills(self, doc: Any, text: str) -> list[str]:
        """Extract skills from the resume."""
        skills = set()

        # Extract from spaCy entities
        for ent in doc.ents:
            if ent.label_ in ["PRODUCT", "ORG", "LANGUAGE"]:
                skills.add(ent.text.strip())

        # Extract using pattern matching
        for pattern in self.skill_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            skills.update([match.strip() for match in matches])

        # Extract noun chunks that might be skills
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) <= 3 and chunk.text.lower() not in self._get_common_words():
                skills.add(chunk.text.strip())

        return sorted(list(skills))

    def _extract_entities(self, doc: Any) -> dict[str, list[str]]:
        """Extract named entities by category."""
        entities = {}

        for ent in doc.ents:
            if ent.label_ not in entities:
                entities[ent.label_] = []
            entities[ent.label_].append(ent.text)

        # Remove duplicates and sort
        for label in entities:
            entities[label] = sorted(list(set(entities[label])))

        return entities

    def _extract_education(self, doc: Any, text: str) -> list[dict[str, str]]:
        """Extract education information."""
        education = []

        # Common degree patterns
        degree_patterns = [
            r"(?i)\b(bachelor|master|phd|doctorate|associate|diploma|certificate|b\.?[as]|m\.?[as]|ph\.?d)\s+(?:of\s+)?([^,\n]+)",
            r"(?i)\b(university|college|institute|school)\s+of\s+([^,\n]+)",
        ]

        for pattern in degree_patterns:
            matches = re.finditer(pattern, text)
            for match in matches:
                education.append(
                    {
                        "type": match.group(1),
                        "field": match.group(2).strip(),
                        "raw_text": match.group(0),
                    }
                )

        return education

    def _extract_experience(self, doc: Any, text: str) -> list[dict[str, str]]:
        """Extract work experience information."""
        experience = []

        # Look for job titles and companies
        for ent in doc.ents:
            if ent.label_ == "ORG":
                # Simple heuristic: organizations might be companies
                experience.append({"company": ent.text, "type": "organization"})

        return experience

    def _extract_contact_info(self, doc: Any, text: str) -> dict[str, str | None]:
        """Extract contact information."""
        contact = {"email": None, "phone": None, "linkedin": None, "github": None}

        # Email pattern
        email_pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
        email_match = re.search(email_pattern, text)
        if email_match:
            contact["email"] = email_match.group()

        # Phone pattern
        phone_pattern = r"(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})"
        phone_match = re.search(phone_pattern, text)
        if phone_match:
            contact["phone"] = phone_match.group()

        # LinkedIn pattern
        linkedin_pattern = r"linkedin\.com/in/([A-Za-z0-9-]+)"
        linkedin_match = re.search(linkedin_pattern, text, re.IGNORECASE)
        if linkedin_match:
            contact["linkedin"] = linkedin_match.group()

        # GitHub pattern
        github_pattern = r"github\.com/([A-Za-z0-9-]+)"
        github_match = re.search(github_pattern, text, re.IGNORECASE)
        if github_match:
            contact["github"] = github_match.group()

        return contact

    def _extract_sections(self, text: str) -> dict[str, str]:
        """Extract different sections of the resume."""
        sections = {}

        section_patterns = {
            "summary": r"(?i)(summary|objective|profile)[\s:]*([^\n]+(?:\n[^\n]+)*?)(?=\n\s*[A-Z][^:\n]*:|\n\s*$)",
            "experience": r"(?i)(experience|employment|work history)[\s:]*([^\n]+(?:\n[^\n]+)*?)(?=\n\s*[A-Z][^:\n]*:|\n\s*$)",
            "education": r"(?i)(education|academic)[\s:]*([^\n]+(?:\n[^\n]+)*?)(?=\n\s*[A-Z][^:\n]*:|\n\s*$)",
            "skills": r"(?i)(skills|competencies|expertise)[\s:]*([^\n]+(?:\n[^\n]+)*?)(?=\n\s*[A-Z][^:\n]*:|\n\s*$)",
        }

        for section_name, pattern in section_patterns.items():
            match = re.search(pattern, text, re.MULTILINE | re.DOTALL)
            if match:
                sections[section_name] = match.group(2).strip()

        return sections

    def _load_skill_patterns(self) -> list[str]:
        """Load common skill patterns for extraction."""
        return [
            r"\b(Python|Java|JavaScript|C\+\+|C#|Ruby|Go|Rust|Swift|Kotlin)\b",
            r"\b(React|Angular|Vue|Django|Flask|Spring|Laravel|Rails)\b",
            r"\b(AWS|Azure|GCP|Docker|Kubernetes|Jenkins|Git|Terraform)\b",
            r"\b(SQL|NoSQL|MongoDB|PostgreSQL|MySQL|Redis|Elasticsearch)\b",
            r"\b(Machine Learning|AI|Deep Learning|NLP|Computer Vision)\b",
            r"\b(Agile|Scrum|DevOps|CI/CD|TDD|BDD|API|REST|GraphQL)\b",
        ]

    def _get_common_words(self) -> set[str]:
        """Get common words to filter out from skill extraction."""
        return {
            "the",
            "and",
            "or",
            "but",
            "in",
            "on",
            "at",
            "to",
            "for",
            "of",
            "with",
            "by",
            "from",
            "up",
            "about",
            "into",
            "through",
            "during",
            "before",
            "after",
            "above",
            "below",
            "over",
            "under",
            "again",
            "further",
            "then",
            "once",
            "work",
            "experience",
            "job",
            "role",
            "position",
            "company",
            "team",
            "project",
            "projects",
            "time",
            "year",
            "years",
            "month",
            "months",
            "day",
            "days",
        }


# Convenience functions for easy usage
def parse_resume_optimized(
    resume_text: str, model_name: str = "en_core_web_sm"
) -> ResumeParseResult:
    """
    Parse a resume using the optimized parser.

    This is the recommended way to parse resumes as it uses cached models.

    Args:
        resume_text: The resume text to parse
        model_name: spaCy model name to use

    Returns:
        ResumeParseResult with extracted information
    """
    parser = OptimizedResumeParser(model_name)
    return parser.parse_resume(resume_text)


def parse_resume_batch(
    resume_texts: list[str], model_name: str = "en_core_web_sm"
) -> list[ResumeParseResult]:
    """
    Parse multiple resumes efficiently using cached models.

    Args:
        resume_texts: List of resume texts to parse
        model_name: spaCy model name to use

    Returns:
        List of ResumeParseResult objects
    """
    parser = OptimizedResumeParser(model_name)
    return [parser.parse_resume(text) for text in resume_texts]


# Example usage and migration guide
def example_usage():
    """
    Example showing how to use the optimized resume parser.

    MIGRATION GUIDE:

    BEFORE (slow - loads model every time):
    ```python
    import spacy

    def parse_resume(text):
        nlp = spacy.load("en_core_web_sm")  # Slow! (~2-3 seconds)
        doc = nlp(text)
        # ... parsing logic
    ```

    AFTER (fast - uses cached model):
    ```python
    from app.utils.resume_parser import parse_resume_optimized

    def parse_resume(text):
        result = parse_resume_optimized(text)  # Fast! (~20-50ms)
        return result
    ```
    """
    sample_resume = """
    John Doe
    Software Engineer
    john.doe@email.com
    (555) 123-4567

    SUMMARY
    Experienced software engineer with expertise in Python, React, and AWS.

    EXPERIENCE
    Senior Developer at Tech Corp (2020-2023)
    - Developed web applications using React and Django
    - Managed AWS infrastructure

    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology (2016-2020)

    SKILLS
    Python, JavaScript, React, Django, AWS, Docker
    """

    # Parse using optimized method
    result = parse_resume_optimized(sample_resume)

    logger.info(f"Parsed resume in {result.parsing_time_ms}ms")
    logger.info(f"Found skills: {result.skills}")
    logger.info(f"Contact info: {result.contact_info}")

    return result


if __name__ == "__main__":
    # Test the parser
    example_usage()
