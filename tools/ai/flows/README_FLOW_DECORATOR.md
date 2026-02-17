# Centralized Genkit Flow Decorator System

## Overview

This document describes the centralized decorator system implemented to standardize and reduce boilerplate in all Genkit flow definitions across the CareerCopilot application.

## Problem Solved

Previously, every Genkit flow had repetitive boilerplate code including:

- Manual model initialization (`get_model()` calls)
- Conditional Genkit registration based on environment
- Error handling for model availability
- Flow registration for tracking
- Try/catch blocks for genkit imports

## Solution: `flow_decorator.py`

A centralized decorator system that encapsulates all common setup logic.

### Key Components

#### 1. `@simple_genkit_flow()`

The most common decorator for basic flows:

```python
@simple_genkit_flow(output_schema=MyResponse)
def my_flow(input_text: str) -> MyResponse:
    # Model is guaranteed to be available
    model = get_model()
    response = model.generate(input_text)
    return response.output()
```

#### 2. `@async_genkit_flow()`

For asynchronous flows:

```python
@async_genkit_flow(output_schema=MyResponse, require_model=False)
async def my_async_flow(input_text: str) -> MyResponse:
    # Handle complex async operations
    result = await some_async_operation()
    return result
```

#### 3. `@genkit_flow()`

Full-featured decorator with all options:

```python
@genkit_flow(
    name="custom_name",
    output_schema=MyResponse,
    require_model=True,
    auto_register=True,
    enable_logging=True
)
def my_custom_flow(input_text: str) -> MyResponse:
    # Custom flow logic
    pass
```

### Decorator Features

- **Automatic Model Validation**: Ensures model availability before execution
- **Conditional Genkit Registration**: Handles `GENKIT_AVAILABLE` and `is_genkit_enabled()` checks
- **Auto Flow Registration**: Automatically registers flows for tracking
- **Error Handling**: Centralized error logging and handling
- **Execution Logging**: Optional flow execution logging
- **Backward Compatibility**: Works with existing API code

### Utility Functions

- `run_flow_async(flow_func, **kwargs)` - Async flow execution
- `run_flow(flow_func, **kwargs)` - Sync flow execution
- `create_flow_wrapper()` - Programmatic flow creation

## Refactored Flows

### Before and After Examples

#### KSC Generator (Before)

```python
# Old boilerplate-heavy approach
import os
from app.core.genkit_init import get_model, is_genkit_enabled, register_flow_function

try:
    import genkit
    GENKIT_AVAILABLE = True
except ImportError:
    genkit = None
    GENKIT_AVAILABLE = False

def _generate_ksc_response_impl(user_profile_data: dict, ksc_statement: str) -> STAR_Response:
    model = get_model()
    if not model:
        raise RuntimeError("Genkit model not available for KSC generation")
    # Flow logic...

if GENKIT_AVAILABLE and is_genkit_enabled():
    generateKscResponse = genkit.flow(output_schema=STAR_Response)(_generate_ksc_response_impl)
else:
    generateKscResponse = _generate_ksc_response_impl

register_flow_function(generateKscResponse, "generateKscResponse")
```

#### KSC Generator (After)

```python
# Clean, focused approach
from app.genkit_flows.flow_decorator import simple_genkit_flow

@simple_genkit_flow(output_schema=STAR_Response)
def generateKscResponse(user_profile_data: dict, ksc_statement: str) -> STAR_Response:
    # Model availability guaranteed by decorator
    model = get_model()
    # Flow logic...
```

## Files Updated

### Core Decorator System

- **`flow_decorator.py`** - New centralized decorator implementation

### Refactored Flows

- **`ksc_generator.py`** - Uses `@simple_genkit_flow`
- **`cover_letter_generator.py`** - Uses `@simple_genkit_flow`
- **`ats_scoring.py`** - Uses `@async_genkit_flow` for complex async operations
- **`keyword_placer.py`** - Uses `@simple_genkit_flow`
- **`shared.py`** - Updated `create_extraction_flow()` to use new system

### API Compatibility

- **`analysis.py`** - Updated to use `run_flow_async` from decorator module

## Benefits Achieved

✅ **Reduced Boilerplate**: Eliminated 15-20 lines of repetitive setup code per flow
✅ **Consistency**: All flows now follow the same pattern
✅ **Maintainability**: Central place to update common logic
✅ **Error Handling**: Standardized error handling across all flows
✅ **Logging**: Consistent logging for all flow executions
✅ **Registration**: Automatic flow registration for monitoring
✅ **Backward Compatibility**: Existing API code continues to work
✅ **Type Safety**: Maintained full type hints and Pydantic integration

## Usage Guidelines

### For New Flows

Use `@simple_genkit_flow()` for most cases:

```python
@simple_genkit_flow(output_schema=MyResponse)
def my_new_flow(input_data: str) -> MyResponse:
    model = get_model()  # Always available
    # Your flow logic here
    return result
```

### For Complex Flows

Use `@async_genkit_flow()` or `@genkit_flow()` with custom options:

```python
@async_genkit_flow(
    output_schema=ComplexResponse,
    require_model=False,  # If you handle model availability manually
    enable_logging=True
)
async def complex_async_flow(data: dict) -> ComplexResponse:
    # Complex async operations
    pass
```

### For Dynamic Flows

Use `create_flow_wrapper()` for programmatic creation:

```python
def create_dynamic_flow(schema):
    def flow_impl(data):
        # Dynamic logic
        pass

    return create_flow_wrapper(
        func=flow_impl,
        name="dynamic_flow",
        output_schema=schema
    )
```

## Testing

All refactored flows have been tested for:

- Import compatibility ✅
- Flow registration ✅
- API endpoint compatibility ✅
- Error handling ✅
- Backward compatibility ✅

## Future Enhancements

- Add metrics collection in decorator
- Implement flow caching capabilities
- Add request/response validation
- Extend error recovery mechanisms
