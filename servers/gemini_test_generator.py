#!/usr/bin/env python3
"""
Gemini Test Generator
Standalone script that generates test files using Gemini API.
Called by the task poller for test generation tasks.
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, List
import logging

try:
    import google.generativeai as genai
except ImportError:
    print("ERROR: google-generativeai not installed. Run: pip install google-generativeai")
    sys.exit(1)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GeminiTestGenerator:
    """Generates test files using Gemini API."""

    def __init__(self, api_key: str, project_root: Path, model_name: str = 'gemini-2.0-flash'):
        self.api_key = api_key
        self.project_root = project_root

        try:
            genai.configure(api_key=api_key)
            # Use provided model
            self.model = genai.GenerativeModel(model_name)
            logger.info(f"🤖 Using Gemini model: {model_name}")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Gemini: {e}")
            raise

    def generate_test_file(
        self,
        output_file: str,
        description: str,
        requirements: List[str],
        reference_files: List[str],
        framework: str = 'pytest',
        target_coverage: int = 95
    ) -> Dict[str, Any]:
        """Generate a single test file with retry logic."""

        logger.info(f"📝 Generating {output_file}...")

        # Read reference files
        reference_content = self._read_reference_files(reference_files)

        # Build prompt
        prompt = self._build_prompt(
            output_file=output_file,
            description=description,
            requirements=requirements,
            reference_content=reference_content,
            framework=framework,
            target_coverage=target_coverage
        )

        # Call Gemini with retries
        max_retries = 3
        retry_delay = 30 # seconds

        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config={
                        'temperature': 0.3,
                        'top_p': 0.95,
                        'max_output_tokens': 8192,
                    }
                )

                # Extract code
                generated_code = self._extract_code(response.text)

                if not generated_code:
                    return {
                        'success': False,
                        'error': 'No code generated',
                        'output_file': output_file
                    }

                # Write file
                output_path = self.project_root / output_file
                output_path.parent.mkdir(parents=True, exist_ok=True)

                with open(output_path, 'w') as f:
                    f.write(generated_code)

                test_count = generated_code.count('def test_')

                logger.info(f"✅ Created {output_file} ({test_count} tests)")

                return {
                    'success': True,
                    'output_file': output_file,
                    'test_count': test_count,
                    'file_size': len(generated_code)
                }

            except Exception as e:
                if "429" in str(e) and attempt < max_retries - 1:
                    logger.warning(f"⚠️  Rate limited (429). Retrying in {retry_delay}s... (Attempt {attempt + 1}/{max_retries})")
                    import time
                    time.sleep(retry_delay)
                    continue

                logger.error(f"❌ Generation failed: {e}")
                return {
                    'success': False,
                    'error': str(e),
                    'output_file': output_file
                }

        return {'success': False, 'error': 'Max retries exceeded', 'output_file': output_file}

    def _read_reference_files(self, reference_files: List[str]) -> Dict[str, str]:
        """Read reference files for context."""
        content = {}
        for ref_file in reference_files:
            ref_path = self.project_root / ref_file
            if ref_path.exists():
                try:
                    with open(ref_path, 'r') as f:
                        # Limit content to avoid token overflow
                        content[ref_file] = f.read()[:5000]
                except Exception as e:
                    logger.warning(f"⚠️  Could not read {ref_file}: {e}")
        return content

    def _build_prompt(
        self,
        output_file: str,
        description: str,
        requirements: List[str],
        reference_content: Dict[str, str],
        framework: str,
        target_coverage: int
    ) -> str:
        """Build prompt for test generation."""

        component_name = Path(output_file).stem.replace('test_', '')

        prompt = f"""# Test Generation Task

Generate comprehensive {framework} tests for: **{component_name}**

## Objective
{description}

**Output File:** `{output_file}`
**Target Coverage:** {target_coverage}%

## Requirements
{chr(10).join(f"- {req}" for req in requirements)}

## Reference Code

"""

        for ref_file, content in reference_content.items():
            prompt += f"""
### {ref_file}
```python
{content}
```

"""

        prompt += """

## Test Structure

Organize tests into classes by functionality:
- TestClassName for each major feature/endpoint
- Use descriptive test method names
- Include docstrings explaining what each test validates

## Coverage Strategy

1. **Happy Path Tests**: Successful operations with valid inputs
2. **Error Handling**: HTTP status codes (401, 404, 422, 500)
3. **Validation**: Schema compliance, data types, required fields
4. **Edge Cases**: Missing data, invalid formats, boundary conditions
5. **Integration**: Mocked external dependencies (Firebase, Genkit, DB)

## Mocking Guidelines

```python
@pytest.fixture
def mock_current_user(monkeypatch):
    \"\"\"Mock authenticated user.\"\"\"
    def mock_get_current_user():
        return User(id="test", email="test@example.com")

    from app.core import dependencies
    monkeypatch.setattr(dependencies, "get_current_user", mock_get_current_user)

@patch('app.genkit_flows.some_flow.function_name')
def test_with_mocked_genkit(mock_flow, client):
    mock_flow.return_value = {"result": "success"}
    # ... test code
```

## Output Format

Generate ONLY the complete Python test file. No explanations before or after.

Start with:
```python
\"\"\"
[Module docstring]
\"\"\"

import pytest
from fastapi.testclient import TestClient
# ... imports
```

Generate the complete, production-ready test file now:
"""

        return prompt

    def _extract_code(self, response_text: str) -> str:
        """Extract Python code from response."""

        # Try to find code blocks
        if '```python' in response_text:
            start = response_text.find('```python') + 9
            end = response_text.rfind('```')
            if end > start:
                return response_text[start:end].strip()

        elif '```' in response_text:
            start = response_text.find('```') + 3
            # Skip language identifier if present
            if '\n' in response_text[start:start+20]:
                start = response_text.find('\n', start) + 1
            end = response_text.rfind('```')
            if end > start:
                return response_text[start:end].strip()

        # Check if entire response is code
        if (response_text.strip().startswith('"""') or
            response_text.strip().startswith("'''") or
            response_text.strip().startswith('import')):
            return response_text.strip()

        return ""


def main():
    parser = argparse.ArgumentParser(description='Generate test files using Gemini API')
    parser.add_argument('--task-file', required=True, help='JSON file with task inputs')
    parser.add_argument('--output-file', required=True, help='JSON file for results')
    parser.add_argument('--project-root', default='/Users/okgoogle13/Projects/careercopilot')
    parser.add_argument('--model', default='gemma-3-27b-it', help='Gemini/Gemma model to use (default: gemma-3-27b-it)')
    args = parser.parse_args()

    # Load task inputs
    with open(args.task_file, 'r') as f:
        task_inputs = json.load(f)

    # Get API key
    api_key = os.getenv('GEMINI_API_KEY') or os.getenv('GENKIT_GOOGLE_API_KEY')
    if not api_key:
        result = {
            'status': 'failed',
            'error': 'No API key found. Set GEMINI_API_KEY or GENKIT_GOOGLE_API_KEY',
            'files_generated': []
        }
        with open(args.output_file, 'w') as f:
            json.dump(result, f, indent=2)
        sys.exit(1)

    # Initialize generator
    generator = GeminiTestGenerator(api_key, Path(args.project_root), model_name=args.model)

    # Prepare file list
    expected_files = task_inputs.get('expected_output', [])
    if not expected_files and 'output_file' in task_inputs:
        expected_files = [task_inputs['output_file']]

    # Ensure source file is in reference files
    reference_files = task_inputs.get('reference_files', [])
    if 'source_file' in task_inputs and task_inputs['source_file'] not in reference_files:
        reference_files.append(task_inputs['source_file'])

    # Generate test files
    results = []
    for output_file in expected_files:
        result = generator.generate_test_file(
            output_file=output_file,
            description=task_inputs.get('description', ''),
            requirements=task_inputs.get('requirements', []),
            reference_files=reference_files,
            framework=task_inputs.get('framework', 'pytest'),
            target_coverage=task_inputs.get('target_coverage', 95)
        )
        results.append(result)

    # Compile final output
    successful_files = [r['output_file'] for r in results if r.get('success')]
    total_tests = sum(r.get('test_count', 0) for r in results if r.get('success'))

    output = {
        'status': 'completed' if successful_files else 'failed',
        'files_generated': successful_files,
        'test_count': total_tests,
        'results': results
    }

    # Write output
    with open(args.output_file, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"✅ Generated {len(successful_files)} test files with {total_tests} tests")
    sys.exit(0 if successful_files else 1)


if __name__ == '__main__':
    main()
