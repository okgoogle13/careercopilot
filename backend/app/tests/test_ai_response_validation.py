"""
Tests for AI Response Validation and Parsing Utility

Comprehensive tests to ensure the validation utility works correctly
with various AI response formats and edge cases.
"""

import json
import pytest
from unittest.mock import Mock, patch
from typing import Dict, Any

from app.core.ai_response_validation import (
    AIResponseValidator,
    ValidationResult,
    ValidationErrorType,
    STARResponse,
    KSCResponseComplete,
    SemanticAnalysis,
    JobRequirements,
    ATSResult,
    ATSScoreBreakdown,
    default_validator,
    validate_ai_response,
    create_fallback_star_response,
    create_fallback_semantic_analysis
)

from app.core.ai_flow_integration import (
    validate_ai_flow_response,
    extract_validated_data,
    create_fallback_response,
    AIFlowManager,
    migrate_json_parsing
)


class TestAIResponseValidator:
    """Test the main AIResponseValidator class"""
    
    def setup_method(self):
        """Setup for each test method"""
        self.validator = AIResponseValidator(enable_warnings=True, strict_mode=False)
    
    def test_validator_initialization(self):
        """Test validator initializes with correct default schemas"""
        assert "star_response" in self.validator._schema_registry
        assert "semantic_analysis" in self.validator._schema_registry
        assert "job_requirements" in self.validator._schema_registry
        assert "ats_result" in self.validator._schema_registry
    
    def test_register_custom_schema(self):
        """Test registering custom schemas"""
        from pydantic import BaseModel
        
        class CustomSchema(BaseModel):
            test_field: str
        
        self.validator.register_schema("custom", CustomSchema)
        assert "custom" in self.validator._schema_registry
    
    def test_valid_star_response(self):
        """Test validation of valid STAR response"""
        valid_response = json.dumps({
            "situation": "I was working as a project manager at XYZ Corp when we faced a critical deadline.",
            "task": "I needed to coordinate a team of 10 developers to deliver a software update within 2 weeks.",
            "action": "I implemented daily standups, created a detailed project timeline, and identified critical path items.",
            "result": "We delivered the project 2 days early, resulting in a 15% increase in client satisfaction scores."
        })
        
        result = self.validator.validate_response(valid_response, "star_response")
        
        assert result.is_valid
        assert isinstance(result.parsed_data, STARResponse)
        assert "project manager" in result.parsed_data.situation
        assert len(result.validation_warnings) == 0
    
    def test_invalid_json_with_fallback(self):
        """Test handling of invalid JSON with fallback data"""
        invalid_response = "This is not valid JSON {incomplete"
        fallback_data = {
            "situation": "Fallback situation",
            "task": "Fallback task",
            "action": "Fallback action",
            "result": "Fallback result"
        }
        
        result = self.validator.validate_response(
            invalid_response, "star_response", fallback_data
        )
        
        assert result.is_valid
        assert isinstance(result.parsed_data, STARResponse)
        assert "Fallback situation" in result.parsed_data.situation
        assert "Using fallback data" in result.validation_warnings[0]
        assert result.metadata["fallback_used"] is True
    
    def test_missing_required_fields(self):
        """Test handling of missing required fields"""
        incomplete_response = json.dumps({
            "situation": "Test situation",
            "task": "Test task"
            # Missing action and result
        })
        
        result = self.validator.validate_response(incomplete_response, "star_response")
        
        assert not result.is_valid
        assert result.error_type == ValidationErrorType.FAILED_CUSTOM_VALIDATION
        assert "validation failed" in result.error_message.lower()
    
    def test_empty_response_handling(self):
        """Test handling of empty responses"""
        empty_responses = ["", "   ", None]
        
        for empty_response in empty_responses:
            result = self.validator.validate_response(
                empty_response or "", "star_response"
            )
            assert not result.is_valid
            assert result.error_type == ValidationErrorType.EMPTY_RESPONSE
    
    def test_semantic_analysis_validation(self):
        """Test semantic analysis schema validation"""
        valid_semantic = json.dumps({
            "similarity_score": 85.5,
            "explanation": "The resume shows strong alignment with job requirements in data analysis and Python programming."
        })
        
        result = self.validator.validate_response(valid_semantic, "semantic_analysis")
        
        assert result.is_valid
        assert isinstance(result.parsed_data, SemanticAnalysis)
        assert result.parsed_data.similarity_score == 85.5
    
    def test_legacy_field_support(self):
        """Test support for legacy field names"""
        legacy_semantic = json.dumps({
            "similarityScore": 75,  # Legacy field name
            "explanation": "Good match for technical skills"
        })
        
        result = self.validator.validate_response(legacy_semantic, "semantic_analysis")
        
        assert result.is_valid
        assert result.parsed_data.similarity_score == 75
    
    def test_json_cleaning(self):
        """Test JSON content cleaning functionality"""
        messy_response = """
        Here's the JSON response:
        ```json
        {
            "situation": "Test situation",
            "task": "Test task", 
            "action": "Test action",
            "result": "Test result"
        }
        ```
        End of response
        """
        
        result = self.validator.validate_response(messy_response, "star_response")
        
        assert result.is_valid
        assert isinstance(result.parsed_data, STARResponse)
    
    def test_warning_collection(self):
        """Test collection of validation warnings"""
        response_with_warnings = json.dumps({
            "situation": "",  # Empty required field
            "task": "Test task",
            "action": "Test action",
            "result": "Test result"
        })
        
        result = self.validator.validate_response(response_with_warnings, "star_response")
        
        # This should fail validation due to empty required field
        assert not result.is_valid
    
    def test_ats_result_validation(self):
        """Test ATS result validation with breakdown"""
        ats_response = json.dumps({
            "overall_score": 78.5,
            "breakdown": {
                "keyword_score": 82.0,
                "semantic_score": 75.0,
                "formatting_score": 79.0
            },
            "matched_keywords": ["Python", "Data Analysis", "SQL"],
            "missing_keywords": ["Machine Learning", "TensorFlow"],
            "recommendations": [
                "Add machine learning experience",
                "Include more technical certifications"
            ]
        })
        
        result = self.validator.validate_response(ats_response, "ats_result")
        
        assert result.is_valid
        assert isinstance(result.parsed_data, ATSResult)
        assert result.parsed_data.overall_score == 78.5
        assert isinstance(result.parsed_data.breakdown, ATSScoreBreakdown)
        assert len(result.parsed_data.matched_keywords) == 3


class TestAIFlowIntegration:
    """Test the AI flow integration helpers"""
    
    def setup_method(self):
        """Setup for each test method"""
        self.flow_manager = AIFlowManager()
    
    def test_flow_registration(self):
        """Test flow registration"""
        fallback_data = {"situation": "test", "task": "test", "action": "test", "result": "test"}
        
        self.flow_manager.register_flow("test_flow", STARResponse, fallback_data)
        
        assert "test_flow" in self.flow_manager.registered_flows
        assert self.flow_manager.get_flow_schema("test_flow") == STARResponse
    
    @pytest.mark.asyncio
    async def test_flow_execution_success(self):
        """Test successful flow execution with validation"""
        # Mock flow function
        async def mock_flow():
            return json.dumps({
                "situation": "Test situation",
                "task": "Test task",
                "action": "Test action", 
                "result": "Test result"
            })
        
        self.flow_manager.register_flow("test_flow", STARResponse)
        
        result = await self.flow_manager.execute_flow("test_flow", mock_flow)
        
        assert result.is_valid
        assert isinstance(result.parsed_data, STARResponse)
    
    @pytest.mark.asyncio
    async def test_flow_execution_with_fallback(self):
        """Test flow execution with fallback on error"""
        # Mock flow function that raises an error
        async def mock_failing_flow():
            raise Exception("Simulated flow error")
        
        fallback_data = {
            "situation": "Fallback situation",
            "task": "Fallback task",
            "action": "Fallback action",
            "result": "Fallback result"
        }
        
        self.flow_manager.register_flow("failing_flow", STARResponse, fallback_data)
        
        result = await self.flow_manager.execute_flow("failing_flow", mock_failing_flow)
        
        assert result.is_valid
        assert isinstance(result.parsed_data, STARResponse)
        assert "fallback" in result.parsed_data.situation.lower()
        assert result.metadata["fallback_used"] is True
    
    def test_extract_validated_data(self):
        """Test extracting data from ValidationResult"""
        validation_result = ValidationResult(
            is_valid=True,
            parsed_data=STARResponse(
                situation="Test", task="Test", action="Test", result="Test"
            )
        )
        
        extracted_data = extract_validated_data(validation_result)
        
        assert isinstance(extracted_data, STARResponse)
        assert extracted_data.situation == "Test"
    
    def test_extract_validated_data_error(self):
        """Test error when extracting from invalid result"""
        validation_result = ValidationResult(
            is_valid=False,
            error_message="Test error"
        )
        
        from app.core.ai_error_handling import AIError
        
        with pytest.raises(AIError):
            extract_validated_data(validation_result)
    
    def test_create_fallback_response(self):
        """Test creating fallback responses for different schemas"""
        # Test STAR response fallback
        star_fallback = create_fallback_response(STARResponse, "Test error")
        assert isinstance(star_fallback, STARResponse)
        assert "Test error" in star_fallback.situation
        
        # Test semantic analysis fallback
        semantic_fallback = create_fallback_response(SemanticAnalysis, "Test error")
        assert isinstance(semantic_fallback, SemanticAnalysis)
        assert semantic_fallback.similarity_score == 50.0
    
    def test_migration_json_parsing(self):
        """Test migration helper for existing JSON parsing"""
        json_content = json.dumps({
            "situation": "Migrated situation",
            "task": "Migrated task",
            "action": "Migrated action",
            "result": "Migrated result"
        })
        
        result = migrate_json_parsing(json_content, STARResponse)
        
        assert result.is_valid
        assert isinstance(result.parsed_data, STARResponse)
        assert "Migrated" in result.parsed_data.situation
    
    @pytest.mark.asyncio
    async def test_validate_ai_flow_response_decorator(self):
        """Test the validation decorator"""
        
        @validate_ai_flow_response(STARResponse)
        async def mock_ai_function():
            return json.dumps({
                "situation": "Decorated situation",
                "task": "Decorated task",
                "action": "Decorated action",
                "result": "Decorated result"
            })
        
        result = await mock_ai_function()
        
        assert isinstance(result, ValidationResult)
        assert result.is_valid
        assert isinstance(result.parsed_data, STARResponse)


class TestFallbackCreation:
    """Test fallback response creation"""
    
    def test_create_fallback_star_response(self):
        """Test creating fallback STAR response"""
        fallback = create_fallback_star_response()
        
        assert isinstance(fallback, STARResponse)
        assert "Unable to analyze" in fallback.situation
        assert len(fallback.task) > 0
    
    def test_create_fallback_semantic_analysis(self):
        """Test creating fallback semantic analysis"""
        fallback = create_fallback_semantic_analysis()
        
        assert isinstance(fallback, SemanticAnalysis)
        assert fallback.similarity_score == 50.0
        assert "temporarily unavailable" in fallback.explanation.lower()


class TestEdgeCases:
    """Test edge cases and error conditions"""
    
    def setup_method(self):
        """Setup for each test method"""
        self.validator = AIResponseValidator()
    
    def test_malformed_json_variants(self):
        """Test various malformed JSON formats"""
        malformed_variants = [
            "{incomplete",
            "{'single_quotes': 'invalid'}",
            '{"trailing_comma": "invalid",}',
            '{"unquoted_key": value}',
            "not json at all"
        ]
        
        for malformed in malformed_variants:
            result = self.validator.validate_response(malformed, "star_response")
            assert not result.is_valid
            assert result.error_type in [
                ValidationErrorType.INVALID_JSON,
                ValidationErrorType.FAILED_CUSTOM_VALIDATION
            ]
    
    def test_unknown_schema_error(self):
        """Test error for unknown schema"""
        result = self.validator.validate_response(
            '{"test": "data"}', "nonexistent_schema"
        )
        
        assert not result.is_valid
        assert "Unknown schema" in result.error_message
    
    def test_validation_with_extra_fields(self):
        """Test validation with extra fields (should be allowed)"""
        response_with_extra = json.dumps({
            "situation": "Test situation",
            "task": "Test task", 
            "action": "Test action",
            "result": "Test result",
            "extra_field": "This should be allowed",
            "another_extra": {"nested": "data"}
        })
        
        result = self.validator.validate_response(response_with_extra, "star_response")
        
        assert result.is_valid
        assert isinstance(result.parsed_data, STARResponse)
    
    def test_numeric_boundary_validation(self):
        """Test numeric boundary validation for scores"""
        # Test valid boundaries
        valid_semantic = json.dumps({
            "similarity_score": 0.0,  # Minimum
            "explanation": "Minimum score test"
        })
        result = self.validator.validate_response(valid_semantic, "semantic_analysis")
        assert result.is_valid
        
        valid_semantic = json.dumps({
            "similarity_score": 100.0,  # Maximum
            "explanation": "Maximum score test"
        })
        result = self.validator.validate_response(valid_semantic, "semantic_analysis")
        assert result.is_valid
        
        # Test invalid boundaries
        invalid_semantic = json.dumps({
            "similarity_score": 150.0,  # Over maximum
            "explanation": "Invalid score test"
        })
        result = self.validator.validate_response(invalid_semantic, "semantic_analysis")
        assert not result.is_valid


class TestPerformanceAndMemory:
    """Test performance characteristics and memory usage"""
    
    def test_large_response_handling(self):
        """Test handling of large AI responses"""
        # Create a large but valid response
        large_situation = "This is a very long situation description. " * 100
        large_response = json.dumps({
            "situation": large_situation,
            "task": "Large task description " * 50,
            "action": "Detailed action steps " * 75,
            "result": "Comprehensive results " * 60
        })
        
        validator = AIResponseValidator()
        result = validator.validate_response(large_response, "star_response")
        
        assert result.is_valid
        assert isinstance(result.parsed_data, STARResponse)
        assert len(result.parsed_data.situation) > 1000
    
    def test_multiple_validations(self):
        """Test multiple rapid validations (basic performance test)"""
        validator = AIResponseValidator()
        
        test_response = json.dumps({
            "situation": "Test situation",
            "task": "Test task",
            "action": "Test action", 
            "result": "Test result"
        })
        
        # Perform multiple validations
        for i in range(100):
            result = validator.validate_response(test_response, "star_response")
            assert result.is_valid


# Integration test with actual AI operations (if available)
@pytest.mark.integration
class TestRealAIIntegration:
    """Integration tests with real AI operations (requires AI services)"""
    
    @pytest.mark.asyncio
    async def test_ksc_generator_integration(self):
        """Test integration with actual KSC generator (if available)"""
        # This test would require actual AI services and would be skipped 
        # in unit test runs, but useful for integration testing
        pytest.skip("Integration test - requires AI services")
    
    @pytest.mark.asyncio
    async def test_ats_scoring_integration(self):
        """Test integration with actual ATS scoring (if available)"""
        pytest.skip("Integration test - requires AI services")


if __name__ == "__main__":
    # Run basic tests if script is executed directly
    import asyncio
    
    print("Running basic AI Response Validation tests...")
    
    # Test basic validation
    validator = AIResponseValidator()
    
    test_response = json.dumps({
        "situation": "I led a cross-functional team project",
        "task": "Deliver software integration under tight deadline",
        "action": "Coordinated daily standups and resource allocation",
        "result": "Delivered 3 days early with 98% quality score"
    })
    
    result = validator.validate_response(test_response, "star_response")
    
    if result.is_valid:
        print("✅ Basic validation test passed")
        print(f"   Validated STAR response with {len(result.validation_warnings)} warnings")
    else:
        print("❌ Basic validation test failed")
        print(f"   Error: {result.error_message}")
    
    # Test fallback functionality
    invalid_response = "Invalid JSON content"
    fallback_data = {
        "situation": "Fallback situation",
        "task": "Fallback task",
        "action": "Fallback action",
        "result": "Fallback result"
    }
    
    result = validator.validate_response(invalid_response, "star_response", fallback_data)
    
    if result.is_valid and result.metadata.get("fallback_used"):
        print("✅ Fallback test passed")
        print("   Successfully used fallback data for invalid response")
    else:
        print("❌ Fallback test failed")
    
    print("\nAI Response Validation utility is ready for use!")