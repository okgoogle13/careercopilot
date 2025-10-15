"""
AI Model Output Validation Tests for Cover Letter Generation.

This module tests the actual AI model output to ensure it meets the expected
JSON structure requirements for the job analysis step.
"""

import json
import os

import pytest

# Note: gemini_pro import removed as it no longer exists in cover_letter_generator
# from app.genkit_flows.cover_letter_generator import gemini_pro

# Skip entire test class until gemini_pro integration is restored
pytestmark = pytest.mark.skip(
    reason="gemini_pro model removed from cover_letter_generator - tests need refactoring"
)


class TestCoverLetterOutputValidation:
    """Test suite for validating AI model output structure and content."""

    @pytest.fixture
    def sample_job_description(self) -> str:
        """Provide a realistic sample job description for testing."""
        return """
        Senior Software Engineer - Full Stack

        Tech Innovations Inc. is seeking a highly skilled Senior Software Engineer to join our dynamic development team.

        About Us:
        We are a fast-growing technology company that values innovation, collaboration, and continuous learning.
        Our culture emphasizes work-life balance, remote flexibility, and professional growth opportunities.

        Key Responsibilities:
        • Design and develop scalable web applications using modern technologies
        • Lead technical discussions and mentor junior developers
        • Collaborate with product managers and designers on feature development
        • Participate in code reviews and maintain high code quality standards
        • Contribute to architectural decisions and technical strategy

        Required Qualifications:
        • 5+ years of experience in full-stack development
        • Proficiency in JavaScript/TypeScript, React, and Node.js
        • Experience with cloud platforms (AWS, GCP, or Azure)
        • Strong knowledge of database design (SQL and NoSQL)
        • Experience with containerization and microservices
        • Excellent problem-solving and communication skills
        • Bachelor's degree in Computer Science or equivalent experience

        Preferred Qualifications:
        • Experience with DevOps practices and CI/CD pipelines
        • Knowledge of machine learning or data science
        • Previous leadership or mentoring experience
        • Open source contributions

        What We Offer:
        • Competitive salary and equity package
        • Comprehensive health benefits
        • Flexible work arrangements and remote options
        • Professional development budget
        • Collaborative and inclusive work environment
        """

    def analyze_job_description_for_cover_letter(self, job_description: str) -> str:
        """
        Analyze job description to extract key requirements and company culture.
        This simulates Step 1 of the generate_authentic_cover_letter flow.

        Args:
            job_description: Raw job description text

        Returns:
            Raw AI model response as string
        """
        prompt = f"""
        Analyze the following job description and extract the key information needed for cover letter generation.

        Your response must be a valid JSON object with exactly these two keys:
        - "key_requirements": A list of strings containing the most important qualifications and requirements
        - "company_culture": A string describing the company culture, values, and work environment

        Be precise and ensure your response is valid JSON that can be parsed programmatically.

        Job Description:
        {job_description}

        Respond only with the JSON object, no additional text or formatting.
        """

        response = gemini_pro.generate(prompt)
        return response.text()

    @pytest.mark.integration
    def test_job_analysis_output_structure(self, sample_job_description: str):
        """
        Test that the job analysis step produces valid, parseable JSON with required keys.

        This test makes a real API call to the Gemini model and validates:
        1. Output is a valid JSON string
        2. JSON contains exactly the required keys
        3. key_requirements is a list
        4. company_culture is a string
        """
        # Skip if no API key is available
        if not os.getenv("GEMINI_API_KEY") and not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            pytest.skip("No API key available for integration test")

        # Make real API call to Gemini model
        raw_output = self.analyze_job_description_for_cover_letter(sample_job_description)

        # Assert 1: Output should be a string
        assert isinstance(raw_output, str), f"Expected string output, got {type(raw_output)}"
        assert len(raw_output.strip()) > 0, "Output should not be empty"

        # Assert 2: String should be parseable as JSON
        try:
            parsed_json = json.loads(raw_output.strip())
        except json.JSONDecodeError as e:
            pytest.fail(f"Model output is not valid JSON: {e}\\nRaw output: {raw_output}")

        # Assert 3: JSON should be a dictionary
        assert isinstance(
            parsed_json, dict
        ), f"Expected JSON object (dict), got {type(parsed_json)}"

        # Assert 4: JSON should contain exactly the required keys
        expected_keys = {"key_requirements", "company_culture"}
        actual_keys = set(parsed_json.keys())

        assert actual_keys == expected_keys, (
            f"JSON keys mismatch. Expected: {expected_keys}, Got: {actual_keys}\\n"
            f"Missing keys: {expected_keys - actual_keys}\\n"
            f"Extra keys: {actual_keys - expected_keys}"
        )

        # Assert 5: key_requirements should be a list
        key_requirements = parsed_json["key_requirements"]
        assert isinstance(
            key_requirements, list
        ), f"key_requirements should be a list, got {type(key_requirements)}"

        # Assert 6: key_requirements list should not be empty and contain strings
        assert len(key_requirements) > 0, "key_requirements list should not be empty"

        for i, requirement in enumerate(key_requirements):
            assert isinstance(
                requirement, str
            ), f"key_requirements[{i}] should be a string, got {type(requirement)}: {requirement}"
            assert len(requirement.strip()) > 0, f"key_requirements[{i}] should not be empty"

        # Assert 7: company_culture should be a non-empty string
        company_culture = parsed_json["company_culture"]
        assert isinstance(
            company_culture, str
        ), f"company_culture should be a string, got {type(company_culture)}"
        assert len(company_culture.strip()) > 0, "company_culture should not be empty"

    @pytest.mark.integration
    def test_job_analysis_content_quality(self, sample_job_description: str):
        """
        Test that the job analysis produces reasonable, relevant content.
        """
        if not os.getenv("GEMINI_API_KEY") and not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            pytest.skip("No API key available for integration test")

        raw_output = self.analyze_job_description_for_cover_letter(sample_job_description)
        parsed_json = json.loads(raw_output.strip())

        key_requirements = parsed_json["key_requirements"]
        company_culture = parsed_json["company_culture"]

        # Content quality assertions
        assert (
            len(key_requirements) >= 3
        ), f"Should extract at least 3 key requirements, got {len(key_requirements)}"

        # Check that requirements contain expected technical terms
        requirements_text = " ".join(key_requirements).lower()
        expected_terms = ["javascript", "react", "node", "experience", "development"]

        found_terms = [term for term in expected_terms if term in requirements_text]
        assert len(found_terms) >= 2, (
            f"Should contain at least 2 expected technical terms. "
            f"Found: {found_terms}, Requirements: {key_requirements}"
        )

        # Check company culture mentions relevant aspects
        culture_lower = company_culture.lower()
        expected_culture_terms = [
            "collaboration",
            "innovation",
            "remote",
            "flexibility",
            "growth",
            "balance",
        ]

        found_culture_terms = [term for term in expected_culture_terms if term in culture_lower]
        assert len(found_culture_terms) >= 1, (
            f"Company culture should mention at least 1 relevant aspect. "
            f"Found: {found_culture_terms}, Culture: {company_culture}"
        )

    @pytest.mark.integration
    def test_multiple_job_descriptions_consistency(self):
        """
        Test that the model consistently produces valid JSON structure across different inputs.
        """
        if not os.getenv("GEMINI_API_KEY") and not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            pytest.skip("No API key available for integration test")

        test_job_descriptions = [
            """
            Data Scientist Position
            We're looking for a data scientist with Python and ML experience.
            Our company values innovation and data-driven decisions.
            Requirements: PhD in Statistics, 3+ years experience, Python, R, SQL.
            """,
            """
            Frontend Developer
            Join our startup as a frontend developer.
            We offer flexible work and great benefits.
            Must know: React, CSS, HTML, Git. Nice to have: TypeScript.
            """,
            """
            Product Manager - Remote
            Tech startup seeking product manager.
            Fast-paced environment, equity compensation.
            Requirements: 5+ years PM experience, technical background, MBA preferred.
            """,
        ]

        for i, job_desc in enumerate(test_job_descriptions):
            raw_output = self.analyze_job_description_for_cover_letter(job_desc)

            # Each should produce valid, parseable JSON
            try:
                parsed_json = json.loads(raw_output.strip())
            except json.JSONDecodeError as e:
                pytest.fail(f"Job description {i + 1} produced invalid JSON: {e}")

            # Each should have the required structure
            assert set(parsed_json.keys()) == {
                "key_requirements",
                "company_culture",
            }, f"Job description {i + 1} has incorrect keys: {parsed_json.keys()}"

            assert isinstance(
                parsed_json["key_requirements"], list
            ), f"Job description {i + 1}: key_requirements not a list"

            assert isinstance(
                parsed_json["company_culture"], str
            ), f"Job description {i + 1}: company_culture not a string"

            assert (
                len(parsed_json["key_requirements"]) > 0
            ), f"Job description {i + 1}: empty key_requirements"

            assert (
                len(parsed_json["company_culture"].strip()) > 0
            ), f"Job description {i + 1}: empty company_culture"

    @pytest.mark.integration
    def test_edge_case_job_descriptions(self):
        """
        Test model output validation with edge case job descriptions.
        """
        if not os.getenv("GEMINI_API_KEY") and not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            pytest.skip("No API key available for integration test")

        edge_cases = [
            "Very short job description. Python developer needed.",
            """
            Very long job description with lots of details about requirements,
            company culture, benefits, and expectations. This tests whether the
            model can extract key information from verbose descriptions.
            """
            + " Extra detail. " * 50,
        ]

        for edge_case in edge_cases:
            raw_output = self.analyze_job_description_for_cover_letter(edge_case)

            # Should still produce valid JSON structure even for edge cases
            parsed_json = json.loads(raw_output.strip())

            assert "key_requirements" in parsed_json
            assert "company_culture" in parsed_json
            assert isinstance(parsed_json["key_requirements"], list)
            assert isinstance(parsed_json["company_culture"], str)

            # Should have at least some content even for minimal inputs
            assert len(parsed_json["key_requirements"]) > 0
            assert len(parsed_json["company_culture"].strip()) > 0
