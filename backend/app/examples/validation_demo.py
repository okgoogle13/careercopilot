"""
AI Response Validation Utility Demo

This script demonstrates the key features of the AI response validation and parsing utility.
It shows how the utility handles valid responses, invalid responses, and provides fallback mechanisms.
"""

import json
import logging
from datetime import datetime

# Configure logging to see validation details
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from app.core.ai_flow_integration import (
        validate_ai_flow_response,
    )
    from app.core.ai_response_validation import (
        AIResponseValidator,
        STARResponse,
        default_validator,
    )

    print("✅ AI Response Validation Utility - Demo")
    print("=" * 50)

    # Demo 1: Basic Validation Success
    print("\n1. BASIC VALIDATION - SUCCESS CASE")
    print("-" * 40)

    valid_star_response = json.dumps(
        {
            "situation": "I was leading a cross-functional team of 8 members working on a critical client project with a tight 6-week deadline.",
            "task": "My task was to coordinate the development of a new feature integration while ensuring all quality standards were met and the project stayed on schedule.",
            "action": "I implemented agile methodology with daily standups, created detailed project timelines, identified critical path dependencies, and established clear communication protocols between frontend, backend, and QA teams.",
            "result": "We delivered the project 3 days ahead of schedule with 98% test coverage, resulting in a 25% improvement in client satisfaction scores and securing a $2M contract renewal.",
        }
    )

    result = default_validator.validate_response(valid_star_response, "star_response")

    if result.is_valid:
        print("✅ Validation successful!")
        star_data = result.parsed_data
        print(f"   Situation length: {len(star_data.situation)} characters")
        print(f"   Task length: {len(star_data.task)} characters")
        print(f"   Action length: {len(star_data.action)} characters")
        print(f"   Result length: {len(star_data.result)} characters")
        print(f"   Validation warnings: {len(result.validation_warnings)}")
    else:
        print(f"❌ Validation failed: {result.error_message}")

    # Demo 2: Invalid JSON with Fallback
    print("\n2. INVALID JSON - FALLBACK MECHANISM")
    print("-" * 40)

    invalid_json_response = """
    Here's the response:
    {
        "situation": "I was working on a project
        // Incomplete JSON - missing closing braces and quotes
    """

    fallback_data = {
        "situation": "Fallback: Unable to analyze specific situation due to AI processing error.",
        "task": "Fallback: Could not determine task requirements from response.",
        "action": "Fallback: Action details were not extractable from AI output.",
        "result": "Fallback: Results analysis is temporarily unavailable. Please try again.",
    }

    result = default_validator.validate_response(
        invalid_json_response, "star_response", fallback_data
    )

    if result.is_valid:
        print("✅ Fallback mechanism working!")
        print(f"   Using fallback: {result.metadata.get('fallback_used', False)}")
        print(f"   Warnings: {result.validation_warnings}")
        star_data = result.parsed_data
        print(f"   Situation: {star_data.situation[:60]}...")
    else:
        print(f"❌ Even fallback failed: {result.error_message}")

    # Demo 3: Semantic Analysis Validation
    print("\n3. SEMANTIC ANALYSIS VALIDATION")
    print("-" * 40)

    semantic_response = json.dumps(
        {
            "similarity_score": 87.5,
            "explanation": "The resume demonstrates strong alignment with the job requirements. Key matches include 5+ years of Python development experience, proven track record in agile methodologies, and leadership experience managing technical teams. The candidate's background in financial technology aligns well with the fintech focus of the role.",
        }
    )

    result = default_validator.validate_response(semantic_response, "semantic_analysis")

    if result.is_valid:
        print("✅ Semantic analysis validation successful!")
        semantic_data = result.parsed_data
        print(f"   Similarity score: {semantic_data.similarity_score}%")
        print(f"   Explanation length: {len(semantic_data.explanation)} characters")
        print(f"   Score in valid range: {0 <= semantic_data.similarity_score <= 100}")
    else:
        print(f"❌ Semantic validation failed: {result.error_message}")

    # Demo 4: Legacy Field Support
    print("\n4. LEGACY FIELD SUPPORT")
    print("-" * 40)

    legacy_semantic_response = json.dumps(
        {
            "similarityScore": 92.3,  # Old field name
            "explanation": "Legacy field format: This response uses the old 'similarityScore' field name but should still validate correctly due to backward compatibility support.",
        }
    )

    result = default_validator.validate_response(legacy_semantic_response, "semantic_analysis")

    if result.is_valid:
        print("✅ Legacy field support working!")
        semantic_data = result.parsed_data
        print(f"   Parsed similarity_score: {semantic_data.similarity_score}%")
        print("   Legacy 'similarityScore' was automatically converted to 'similarity_score'")
    else:
        print(f"❌ Legacy field support failed: {result.error_message}")

    # Demo 5: JSON Cleaning Functionality
    print("\n5. JSON CLEANING FUNCTIONALITY")
    print("-" * 40)

    messy_response = """
    Here's your STAR response:
    ```json
    {
        "situation": "I was responsible for managing a critical database migration project",
        "task": "The task was to migrate 50TB of customer data with zero downtime",
        "action": "I planned the migration in phases, coordinated with 4 teams, and implemented rollback procedures",
        "result": "Successfully completed migration with 99.99% uptime and 40% performance improvement"
    }
    ```
    That's the complete response.
    """

    result = default_validator.validate_response(messy_response, "star_response")

    if result.is_valid:
        print("✅ JSON cleaning successful!")
        star_data = result.parsed_data
        print("   Extracted clean JSON from messy AI response")
        print(f"   Situation extracted: {star_data.situation[:50]}...")
        print("   Removed: ```json tags, prefixes, and suffixes")
    else:
        print(f"❌ JSON cleaning failed: {result.error_message}")

    # Demo 6: Custom Schema Registration
    print("\n6. CUSTOM SCHEMA REGISTRATION")
    print("-" * 40)

    from app.core.ai_response_validation import BaseAIResponseSchema
    from pydantic import Field

    class ProjectAnalysisResponse(BaseAIResponseSchema):
        project_name: str = Field(..., min_length=1)
        complexity_score: float = Field(..., ge=0, le=10)
        estimated_hours: int = Field(..., gt=0)
        risk_factors: list = Field(default_factory=list)
        recommendations: list = Field(default_factory=list)

    # Register custom schema
    custom_validator = AIResponseValidator()
    custom_validator.register_schema("project_analysis", ProjectAnalysisResponse)

    custom_response = json.dumps(
        {
            "project_name": "E-commerce Platform Redesign",
            "complexity_score": 7.8,
            "estimated_hours": 480,
            "risk_factors": [
                "Integration with legacy systems",
                "Third-party API dependencies",
                "Performance requirements",
            ],
            "recommendations": [
                "Phase implementation over 3 sprints",
                "Implement comprehensive testing strategy",
                "Plan for rollback procedures",
            ],
        }
    )

    result = custom_validator.validate_response(custom_response, "project_analysis")

    if result.is_valid:
        print("✅ Custom schema validation successful!")
        project_data = result.parsed_data
        print(f"   Project: {project_data.project_name}")
        print(f"   Complexity: {project_data.complexity_score}/10")
        print(f"   Estimated hours: {project_data.estimated_hours}")
        print(f"   Risk factors: {len(project_data.risk_factors)}")
    else:
        print(f"❌ Custom schema validation failed: {result.error_message}")

    # Demo 7: Flow Decorator Usage
    print("\n7. FLOW DECORATOR USAGE")
    print("-" * 40)

    @validate_ai_flow_response(STARResponse, fallback_data=fallback_data)
    async def simulate_ai_flow(include_error: bool = False) -> str:
        """Simulated AI flow function with decorator validation"""
        if include_error:
            return "Invalid response format"

        return json.dumps(
            {
                "situation": "I was managing a team transition during a critical product launch",
                "task": "Ensure smooth handover while maintaining sprint velocity",
                "action": "Created detailed documentation, held knowledge transfer sessions, and established mentorship pairs",
                "result": "Zero disruption to sprint goals, 95% team satisfaction, and successful product launch on schedule",
            }
        )

    # Test the decorated function
    import asyncio

    async def test_decorator():
        # Test success case
        result = await simulate_ai_flow(include_error=False)
        if result.is_valid:
            print("✅ Decorator validation successful!")
            print(f"   Result type: {type(result.parsed_data).__name__}")

        # Test fallback case
        result = await simulate_ai_flow(include_error=True)
        if result.is_valid and result.metadata.get("fallback_used"):
            print("✅ Decorator fallback mechanism working!")

    asyncio.run(test_decorator())

    # Demo 8: Performance Test
    print("\n8. PERFORMANCE TEST")
    print("-" * 40)

    start_time = datetime.now()

    # Validate 100 responses to test performance
    for i in range(100):
        test_response = json.dumps(
            {
                "situation": f"Performance test situation #{i}",
                "task": f"Performance test task #{i}",
                "action": f"Performance test action #{i}",
                "result": f"Performance test result #{i}",
            }
        )

        result = default_validator.validate_response(test_response, "star_response")
        assert result.is_valid, f"Validation failed for test {i}"

    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds() * 1000  # Convert to ms
    avg_time = duration / 100

    print("✅ Performance test completed!")
    print(f"   100 validations in {duration:.2f}ms")
    print(f"   Average: {avg_time:.2f}ms per validation")
    print(f"   Throughput: {1000 / avg_time:.0f} validations/second")

    print("\n" + "=" * 50)
    print("🎉 AI Response Validation Utility Demo Complete!")
    print("\nKey Features Demonstrated:")
    print("  ✅ Schema-based validation with Pydantic")
    print("  ✅ Automatic JSON cleaning and parsing")
    print("  ✅ Robust fallback mechanisms")
    print("  ✅ Legacy field name support")
    print("  ✅ Custom schema registration")
    print("  ✅ Integration decorators")
    print("  ✅ High performance validation")
    print("\nThe utility is ready for production use!")

except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running this from the backend directory with the proper Python path")
except Exception as e:
    print(f"❌ Demo error: {e}")
    logger.exception("Demo failed with exception")

if __name__ == "__main__":
    print("\nRun this demo with: python backend/app/examples/validation_demo.py")
    print("Or from the backend directory: python -m app.examples.validation_demo")
