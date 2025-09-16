# AI Response Validation and Parsing Utility

## Overview

The AI Response Validation and Parsing Utility is a comprehensive system designed to validate and parse AI responses against predefined Pydantic schemas. This ensures data structure consistency, prevents errors, and provides robust fallback mechanisms across all AI flows in the CareerCopilot application.

## Key Features

- **Schema-based Validation**: Uses Pydantic models to validate AI responses
- **Automatic JSON Cleaning**: Removes common AI response artifacts (```json, prefixes, etc.)
- **Fallback Support**: Graceful degradation when AI responses are invalid
- **Legacy Field Support**: Handles both old and new field naming conventions
- **Warning Collection**: Identifies potential issues without failing validation
- **Integration Helpers**: Easy-to-use decorators and utilities for existing code
- **Comprehensive Testing**: Full test suite with edge cases and error scenarios

## Core Components

### 1. AIResponseValidator

The main validator class that handles all validation logic.

```python
from app.core.ai_response_validation import AIResponseValidator, ValidationResult

validator = AIResponseValidator(enable_warnings=True, strict_mode=False)

# Validate a response
result: ValidationResult = validator.validate_response(
    response_content="{'situation': '...', 'task': '...', ...}",
    schema_name="star_response",
    fallback_data=optional_fallback_dict
)

if result.is_valid:
    validated_data = result.parsed_data
    print(f"Validation successful with {len(result.validation_warnings)} warnings")
else:
    print(f"Validation failed: {result.error_message}")
```

### 2. Predefined Schemas

The utility includes schemas for all common AI response types:

#### STAR Response Schema
```python
class STARResponse(BaseAIResponseSchema):
    situation: str = Field(..., min_length=10)
    task: str = Field(..., min_length=10)
    action: str = Field(..., min_length=10)
    result: str = Field(..., min_length=10)
```

#### KSC Complete Response Schema
```python
class KSCResponseComplete(BaseAIResponseSchema):
    ksc_analysis: KSCAnalysis
    experience_selection: ExperienceSelection
    star_response: STARResponse
    response_enhancement: Optional[Dict[str, Any]] = None
    interview_preparation: Optional[Dict[str, Any]] = None
```

#### Semantic Analysis Schema
```python
class SemanticAnalysis(BaseAIResponseSchema):
    similarity_score: float = Field(..., ge=0, le=100)
    explanation: str = Field(..., min_length=10)
    # Legacy field support
    similarityScore: Optional[float] = None
```

#### ATS Result Schema
```python
class ATSResult(BaseAIResponseSchema):
    overall_score: float = Field(..., ge=0, le=100)
    breakdown: ATSScoreBreakdown
    matched_keywords: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
```

### 3. Integration Helpers

#### Flow Validation Decorator
```python
from app.core.ai_flow_integration import validate_ai_flow_response

@validate_ai_flow_response(STARResponse, fallback_data={...})
async def my_ai_flow_function(params) -> str:
    # Your existing AI flow logic
    response = await ai_client.generate(prompt)
    return response.content  # This will be automatically validated
```

#### Migration Helper
```python
from app.core.ai_flow_integration import migrate_json_parsing

# Replace this:
# parsed_result = json.loads(response.content.strip())

# With this:
validation_result = migrate_json_parsing(
    response.content.strip(),
    MySchema,
    fallback_data
)
parsed_result = extract_validated_data(validation_result)
```

## Usage Examples

### Basic Validation

```python
import json
from app.core.ai_response_validation import default_validator

# AI response content
ai_response = json.dumps({
    "situation": "I was leading a team project with tight deadlines",
    "task": "Coordinate 5 developers to deliver features on time",
    "action": "Implemented agile processes and daily standups",
    "result": "Delivered project 2 days early with 100% test coverage"
})

# Validate the response
result = default_validator.validate_response(ai_response, "star_response")

if result.is_valid:
    star_data = result.parsed_data
    print(f"Situation: {star_data.situation}")
    print(f"Task: {star_data.task}")
    print(f"Action: {star_data.action}")
    print(f"Result: {star_data.result}")
else:
    print(f"Validation error: {result.error_message}")
```

### Validation with Fallback

```python
# Define fallback data for error cases
fallback_data = {
    "situation": "Analysis temporarily unavailable",
    "task": "Unable to determine specific task",
    "action": "Could not extract action details",
    "result": "Results analysis pending"
}

# This will use fallback if AI response is invalid
result = default_validator.validate_response(
    invalid_or_empty_response,
    "star_response",
    fallback_data
)

# Always check if fallback was used
if result.metadata.get("fallback_used"):
    print("Using fallback data due to AI response issues")
```

### Integration with Existing AI Operations

```python
# In your existing AI operation class
from app.core.ai_response_validation import default_validator

class MyAIOperation:
    async def generate_response(self, user_id: str, prompt: str) -> Dict[str, Any]:
        # Your existing AI call
        response = await self.ai_client.generate_text(request)

        # Replace manual JSON parsing with validation
        # OLD CODE:
        # try:
        #     parsed_result = json.loads(response.content.strip())
        # except json.JSONDecodeError as e:
        #     raise AIError(f"Invalid JSON: {str(e)}")

        # NEW CODE:
        validation_result = default_validator.validate_response(
            response.content.strip(),
            "star_response",
            fallback_data={
                "situation": "Processing unavailable",
                "task": "Analysis pending",
                "action": "Unable to determine",
                "result": "Results pending"
            }
        )

        if not validation_result.is_valid and not validation_result.parsed_data:
            raise AIError(f"Validation failed: {validation_result.error_message}")

        # Convert validated data back to dict for compatibility
        validated_data = validation_result.parsed_data
        return {
            "situation": validated_data.situation,
            "task": validated_data.task,
            "action": validated_data.action,
            "result": validated_data.result,
            "metadata": {
                **response.metadata,
                "validation_successful": validation_result.is_valid,
                "fallback_used": validation_result.metadata.get("fallback_used", False)
            }
        }
```

## Custom Schema Registration

You can register custom schemas for specialized AI responses:

```python
from pydantic import BaseModel, Field
from app.core.ai_response_validation import default_validator, BaseAIResponseSchema

class CustomAnalysisResponse(BaseAIResponseSchema):
    analysis_score: float = Field(..., ge=0, le=100)
    key_insights: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    confidence_level: str = Field(..., regex="^(low|medium|high)$")

# Register the custom schema
default_validator.register_schema("custom_analysis", CustomAnalysisResponse)

# Now you can use it
result = default_validator.validate_response(
    ai_response_content,
    "custom_analysis"
)
```

## Error Handling and Fallback Strategies

### Common Error Types

```python
from app.core.ai_response_validation import ValidationErrorType

# Handle different error types
result = validator.validate_response(response, "star_response")

if not result.is_valid:
    if result.error_type == ValidationErrorType.INVALID_JSON:
        print("AI returned malformed JSON")
    elif result.error_type == ValidationErrorType.MISSING_REQUIRED_FIELDS:
        print("AI response missing required fields")
    elif result.error_type == ValidationErrorType.FAILED_CUSTOM_VALIDATION:
        print("Response failed schema validation")
    elif result.error_type == ValidationErrorType.EMPTY_RESPONSE:
        print("AI returned empty response")
```

### Creating Fallback Responses

```python
from app.core.ai_flow_integration import create_fallback_response

# Create type-specific fallbacks
star_fallback = create_fallback_response(STARResponse, "Service temporarily unavailable")
semantic_fallback = create_fallback_response(SemanticAnalysis, "Analysis pending")
```

## Testing and Validation

### Unit Tests

The utility includes comprehensive tests. Run them with:

```bash
# Run all validation tests
python -m pytest backend/app/tests/test_ai_response_validation.py -v

# Run specific test class
python -m pytest backend/app/tests/test_ai_response_validation.py::TestAIResponseValidator -v

# Run integration tests (requires AI services)
python -m pytest backend/app/tests/test_ai_response_validation.py -m integration
```

### Manual Testing

```python
# Quick functionality test
python backend/app/tests/test_ai_response_validation.py
```

## Performance Characteristics

- **Memory Efficient**: Schemas are registered once and reused
- **Fast Validation**: Pydantic provides optimized validation
- **Minimal Overhead**: ~1-2ms overhead for typical responses
- **Scalable**: Handles large responses (tested up to 50KB)

## Migration Guide

### For Existing AI Operations

1. **Import the validation utilities**:
   ```python
   from app.core.ai_response_validation import default_validator
   from app.core.ai_flow_integration import extract_validated_data
   ```

2. **Replace manual JSON parsing**:
   ```python
   # Before
   parsed_result = json.loads(response.content.strip())

   # After
   validation_result = default_validator.validate_response(
       response.content.strip(),
       "appropriate_schema_name",
       fallback_data
   )
   parsed_result = extract_validated_data(validation_result)
   ```

3. **Add fallback data**:
   ```python
   fallback_data = {
       # Provide sensible defaults for your schema
       "required_field": "fallback_value",
       # ...
   }
   ```

4. **Update error handling**:
   ```python
   # Check if fallback was used
   if validation_result.metadata.get("fallback_used"):
       logger.warning("Using fallback data for AI response")

   # Log validation warnings
   for warning in validation_result.validation_warnings:
       logger.warning(f"Validation warning: {warning}")
   ```

### For New AI Operations

Use the flow decorator for new operations:

```python
from app.core.ai_flow_integration import validate_ai_flow_response

@validate_ai_flow_response(YourSchema, fallback_data={...})
async def new_ai_operation(params) -> str:
    # Your AI logic here
    response = await ai_client.generate(prompt)
    return response.content
```

## Best Practices

1. **Always provide fallback data** for graceful degradation
2. **Log validation warnings** to monitor AI response quality
3. **Use appropriate schemas** - don't force responses into wrong schemas
4. **Test edge cases** with malformed, empty, and oversized responses
5. **Monitor fallback usage** to identify AI response quality issues
6. **Update schemas** when AI prompt templates change

## Troubleshooting

### Common Issues

1. **"Unknown schema" error**:
   - Check that the schema name is registered
   - Use `validator._schema_registry.keys()` to see available schemas

2. **Validation always fails**:
   - Check if AI responses match expected structure
   - Verify field names and types
   - Use `enable_warnings=True` to see detailed issues

3. **Fallback not working**:
   - Ensure fallback data matches schema requirements
   - Check that all required fields have values
   - Verify data types match schema expectations

4. **Performance issues**:
   - Use the default validator instance instead of creating new ones
   - Consider caching validation results for identical responses

### Debugging

```python
# Enable debug logging
import logging
logging.getLogger('app.core.ai_response_validation').setLevel(logging.DEBUG)

# Inspect validation details
result = validator.validate_response(response, schema_name)
print(f"Valid: {result.is_valid}")
print(f"Warnings: {result.validation_warnings}")
print(f"Metadata: {result.metadata}")

# Check available schemas
print(f"Available schemas: {list(validator._schema_registry.keys())}")
```

## Future Enhancements

- **Dynamic Schema Generation**: Create schemas from AI response examples
- **Response Quality Scoring**: Score responses based on completeness and quality
- **Auto-Retry Logic**: Automatically retry AI requests when validation fails
- **Schema Evolution**: Handle schema changes with backward compatibility
- **Validation Caching**: Cache validation results for identical responses

## Contributing

When adding new AI operations:

1. Define appropriate Pydantic schemas
2. Register schemas with the validator
3. Provide comprehensive fallback data
4. Write tests for your schemas
5. Update this documentation

For schema changes:
1. Maintain backward compatibility when possible
2. Use field aliases for renamed fields
3. Provide migration guides for breaking changes
4. Update all dependent operations
