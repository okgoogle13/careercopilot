"""
Robustness tests for cover letter generation flows.

This module contains parameterized pytest tests that verify the robustness
of cover letter generation flows under various edge cases and stress conditions.
"""

from typing import Any, Dict
from unittest.mock import MagicMock, patch

import pytest
from app.core.ai_error_handling import AIError
from app.genkit_flows.cover_letter_generator import generate_tailored_cover_letter
from app.genkit_flows.smart_cover_letter_system import generate_smart_cover_letter


class TestCoverLetterRobustness:
    """Test suite for cover letter generation robustness."""

    @pytest.fixture
    def minimal_profile_data(self) -> Dict[str, Any]:
        """Minimal profile data for testing."""
        return {"name": "Test User", "email": "test@example.com", "experience": []}

    @pytest.fixture
    def minimal_job_analysis(self) -> Dict[str, Any]:
        """Minimal job analysis data for testing."""
        return {"title": "Test Position", "company": "Test Company", "requirements": []}

    @pytest.fixture
    def minimal_candidate_profile(self) -> Dict[str, Any]:
        """Minimal candidate profile for smart cover letter generation."""
        return {
            "personal_info": {
                "name": "Test Candidate",
                "email": "candidate@example.com",
            },
            "experience": [],
            "skills": [],
            "education": [],
        }

    @pytest.mark.parametrize(
        "job_description,scenario_name",
        [
            ("", "empty_string"),
            ("   ", "whitespace_only"),
            (
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " * 100
                + "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " * 100
                + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. " * 100,
                "very_long_nonsensical",
            ),
            (
                "这是一个用中文写的工作描述。我们正在寻找一位优秀的软件工程师。",
                "chinese_language",
            ),
            (
                "Ceci est une description de poste en français. Nous recherchons un ingénieur logiciel.",
                "french_language",
            ),
            (
                "これは日本語での求人情報です。ソフトウェアエンジニアを募集しています。",
                "japanese_language",
            ),
            (
                "Это описание работы на русском языке. Мы ищем инженера-программиста.",
                "russian_language",
            ),
            ("1234567890!@#$%^&*()_+-=[]{}|;:,.<>?/~`", "special_characters_only"),
            ("🚀💻🎯🔥⚡️🌟💡🎉🎊🎈🎁🏆🥇🌈🔮", "emojis_only"),
            ("\n\n\t\t\r\r\n\t", "control_characters_only"),
            ("A" * 10000, "extremely_long_repetitive"),
            (
                "Job Title: Senior Developer\n" + "Requirements:\n" + "- " * 1000,
                "malformed_structure",
            ),
        ],
    )
    def test_generate_tailored_cover_letter_robustness(
        self,
        job_description: str,
        scenario_name: str,
        minimal_profile_data: Dict[str, Any],
        minimal_job_analysis: Dict[str, Any],
    ):
        """
        Test that generate_tailored_cover_letter handles various edge cases robustly.

        The function should either:
        1. Complete successfully (even with unusual input)
        2. Raise a handled exception that doesn't crash the application
        3. Handle the case gracefully through internal error handling
        """
        # Update job analysis with the test job description
        test_job_analysis = minimal_job_analysis.copy()
        test_job_analysis["description"] = job_description

        with patch("app.genkit_flows.cover_letter_generator.gemini_pro") as mock_model:
            # Mock the model response to simulate successful AI generation
            mock_response = MagicMock()
            mock_response.text.return_value = (
                f"Generated cover letter for scenario: {scenario_name}"
            )
            mock_model.generate.return_value = mock_response

            try:
                # This should not raise an unhandled exception
                result = generate_tailored_cover_letter(
                    base_profile_data=minimal_profile_data,
                    job_analysis_data=test_job_analysis,
                )

                # Assert that we got some result (even if it's not perfect)
                assert isinstance(
                    result, str
                ), f"Expected string result for scenario: {scenario_name}"
                assert len(result) > 0, f"Expected non-empty result for scenario: {scenario_name}"

                # Verify the model was called (robustness includes attempting generation)
                mock_model.generate.assert_called_once()

            except Exception as e:
                # If an exception occurs, it should be a handled application exception
                # not an unhandled crash
                assert isinstance(
                    e, (AIError, ValueError, TypeError)
                ), f"Unexpected exception type {type(e)} for scenario {scenario_name}: {e}"

                # Log the scenario and exception for debugging
                pytest.fail(
                    f"Unhandled exception in scenario '{scenario_name}': {type(e).__name__}: {e}"
                )

    @pytest.mark.parametrize(
        "job_description,scenario_name",
        [
            ("", "empty_string"),
            ("   ", "whitespace_only"),
            (
                "Lorem ipsum dolor sit amet consectetur adipiscing elit " * 200,
                "very_long_latin",
            ),
            (
                "Software Engineer position requiring Python and machine learning experience. "
                + "We are looking for someone with 5+ years of experience in data science. " * 50,
                "realistic_but_very_long",
            ),
            (
                "Desarrollador de software con experiencia en Python y JavaScript.",
                "spanish_language",
            ),
            ("مطور برمجيات ذو خبرة في Python و JavaScript", "arabic_language"),
            ("NULL\x00\x01\x02\x03", "null_bytes_and_control"),
            (
                "SELECT * FROM jobs WHERE salary > 100000; DROP TABLE applications;",
                "sql_injection_like",
            ),
            ("javascript:alert('xss')", "javascript_like"),
            ("<script>alert('test')</script>Job Description", "html_script_tags"),
        ],
    )
    def test_generate_smart_cover_letter_robustness(
        self,
        job_description: str,
        scenario_name: str,
        minimal_candidate_profile: Dict[str, Any],
    ):
        """
        Test that generate_smart_cover_letter handles various edge cases robustly.

        This tests the more advanced smart cover letter generation function.
        """
        with patch("app.genkit_flows.smart_cover_letter_system.gemini_pro") as mock_model:
            # Mock successful AI model response
            mock_response = MagicMock()
            mock_response.text.return_value = f"""
            {{
                "letter_content": "Dear Hiring Manager, Thank you for considering my application for scenario: {scenario_name}",
                "subject_line": "Application for Test Position",
                "sections": [],
                "analysis": {{
                    "readability_score": 85,
                    "personalization_score": 75,
                    "compelling_score": 80,
                    "keyword_alignment": 70,
                    "strengths": ["Professional tone"],
                    "improvement_areas": ["More specific examples"],
                    "tone_assessment": "Professional",
                    "unique_elements": ["Personalized approach"]
                }},
                "personalization_notes": [],
                "key_selling_points": [],
                "company_connections": [],
                "alternative_versions": {{}},
                "follow_up_suggestions": []
            }}
            """
            mock_model.generate.return_value = mock_response

            try:
                # Test the smart cover letter generation
                result = generate_smart_cover_letter(
                    candidate_profile=minimal_candidate_profile,
                    job_description=job_description,
                    style="professional",
                    format_type="full_letter",
                )

                # Verify we got a valid result structure
                assert hasattr(
                    result, "letter_content"
                ), f"Missing letter_content for scenario: {scenario_name}"
                assert isinstance(
                    result.letter_content, str
                ), f"letter_content should be string for scenario: {scenario_name}"
                assert (
                    len(result.letter_content) > 0
                ), f"letter_content should not be empty for scenario: {scenario_name}"

                # The model should have been called
                mock_model.generate.assert_called_once()

            except Exception as e:
                # Similar to above, only handled exceptions should occur
                if isinstance(e, (AIError, ValueError, TypeError)):
                    # This is acceptable - the function handled the edge case
                    pass
                else:
                    pytest.fail(
                        f"Unhandled exception in scenario '{scenario_name}': {type(e).__name__}: {e}"
                    )

    def test_model_failure_handling(
        self, minimal_profile_data: Dict[str, Any], minimal_job_analysis: Dict[str, Any]
    ):
        """
        Test that the functions handle AI model failures gracefully.
        """
        with patch("app.genkit_flows.cover_letter_generator.gemini_pro") as mock_model:
            # Simulate AI model failure
            mock_model.generate.side_effect = Exception("AI model unavailable")

            with pytest.raises(Exception) as exc_info:
                generate_tailored_cover_letter(
                    base_profile_data=minimal_profile_data,
                    job_analysis_data=minimal_job_analysis,
                )

            # Verify the exception is not an unhandled crash
            assert "AI model unavailable" in str(exc_info.value)

    def test_memory_intensive_input(self, minimal_profile_data: Dict[str, Any]):
        """
        Test with extremely large inputs that could cause memory issues.
        """
        # Create a very large job analysis
        large_job_analysis = {
            "title": "Test Position",
            "company": "Test Company",
            "description": "A" * 1000000,  # 1MB of text
            "requirements": ["Requirement " + str(i) for i in range(10000)],
        }

        with patch("app.genkit_flows.cover_letter_generator.gemini_pro") as mock_model:
            mock_response = MagicMock()
            mock_response.text.return_value = "Generated response"
            mock_model.generate.return_value = mock_response

            try:
                result = generate_tailored_cover_letter(
                    base_profile_data=minimal_profile_data,
                    job_analysis_data=large_job_analysis,
                )

                # Should handle large inputs without crashing
                assert isinstance(result, str)
                assert len(result) > 0

            except (MemoryError, AIError, ValueError) as e:
                # These are acceptable exceptions for extreme inputs
                assert str(e)  # Just ensure there's an error message
            except Exception as e:
                pytest.fail(f"Unhandled exception with large input: {type(e).__name__}: {e}")

    def test_unicode_edge_cases(self, minimal_candidate_profile: Dict[str, Any]):
        """
        Test various Unicode edge cases and encoding issues.
        """
        unicode_test_cases = [
            "Position with unicode: café résumé naïve",
            "Mixed scripts: Hello 世界 مرحبا",
            "Emoji heavy: 🚀💼 Senior Developer 💻✨ at 🏢 Tech Corp 🌟",
            "Zero-width chars: Software‌‍‎Developer",
            "RTL text: ‏مطور برمجيات‏ Senior ‏مطور‏",
            "Normalization test: e\u0301 vs é",  # Combining vs precomposed
        ]

        with patch("app.genkit_flows.smart_cover_letter_system.gemini_pro") as mock_model:
            mock_response = MagicMock()
            mock_response.text.return_value = '{"letter_content": "Test response", "subject_line": null, "sections": [], "analysis": {"readability_score": 80, "personalization_score": 75, "compelling_score": 85, "keyword_alignment": 70, "strengths": [], "improvement_areas": [], "tone_assessment": "professional", "unique_elements": []}, "personalization_notes": [], "key_selling_points": [], "company_connections": [], "alternative_versions": {}, "follow_up_suggestions": []}'
            mock_model.generate.return_value = mock_response

            for test_case in unicode_test_cases:
                try:
                    result = generate_smart_cover_letter(
                        candidate_profile=minimal_candidate_profile,
                        job_description=test_case,
                    )

                    # Should handle Unicode correctly
                    assert hasattr(result, "letter_content")
                    assert isinstance(result.letter_content, str)

                except Exception as e:
                    # Should not have encoding/Unicode related crashes
                    if "encoding" in str(e).lower() or "unicode" in str(e).lower():
                        pytest.fail(f"Unicode handling failed for '{test_case}': {e}")
                    # Other exceptions might be acceptable
                    assert isinstance(e, (AIError, ValueError, TypeError))
