"""
Integration tests for the {{FEATURE_NAME}} API endpoint.

This module contains pytest tests that make actual HTTP requests to the
{{HTTP_METHOD}} {{ENDPOINT_PATH}} FastAPI endpoint using httpx.
"""

import asyncio
from typing import Any, Dict

import pytest
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient
from unittest.mock import AsyncMock, patch

from app.main import app


class Test{{FEATURE_NAME_PASCAL}}Integration:
    """Integration test suite for {{FEATURE_NAME}} API endpoint."""

    @pytest.fixture
    def valid_request_data(self) -> Dict[str, Any]:
        """Provide valid request payload for testing."""
        return {
            {{VALID_REQUEST_DATA}}
        }

    @pytest.fixture
    def minimal_request_data(self) -> Dict[str, Any]:
        """Provide minimal valid request payload."""
        return {
            {{MINIMAL_REQUEST_DATA}}
        }

    @pytest.fixture
    def invalid_request_data(self) -> Dict[str, Any]:
        """Provide invalid request payload for validation testing."""
        return {
            {{INVALID_REQUEST_DATA}}
        }

    @pytest.mark.asyncio
    async def test_{{FUNCTION_NAME}}_success(self, valid_request_data: Dict[str, Any]):
        """
        Test the {{HTTP_METHOD}} {{ENDPOINT_PATH}} endpoint with valid input.

        This test:
        1. Sends a valid {{HTTP_METHOD}} request
        2. Asserts {{SUCCESS_STATUS_CODE}} status
        3. Confirms response structure matches expected format
        4. Validates response data types
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Send {{HTTP_METHOD}} request
            response = await client.{{HTTP_METHOD_LOWER}}("{{ENDPOINT_PATH}}", json=valid_request_data)

            # Assert 1: HTTP {{SUCCESS_STATUS_CODE}} status
            assert (
                response.status_code == {{SUCCESS_STATUS_CODE}}
            ), f"Expected {{SUCCESS_STATUS_CODE}}, got {response.status_code}: {response.text}"

            # Assert 2: Response is valid JSON
            response_data = response.json()
            assert isinstance(
                response_data, dict
            ), f"Expected dict response, got {type(response_data)}"

            # Assert 3: Response has expected structure
            {{#each EXPECTED_FIELDS}}
            assert (
                "{{this}}" in response_data
            ), "Response should contain '{{this}}'"
            {{/each}}

            # Assert 4: Validate response data types
            {{RESPONSE_TYPE_ASSERTIONS}}

    @pytest.mark.asyncio
    async def test_{{FUNCTION_NAME}}_minimal_input(self, minimal_request_data: Dict[str, Any]):
        """
        Test the endpoint with minimal valid input.

        Ensures the endpoint handles minimal data without errors.
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.{{HTTP_METHOD_LOWER}}("{{ENDPOINT_PATH}}", json=minimal_request_data)

            assert response.status_code == {{SUCCESS_STATUS_CODE}}
            response_data = response.json()
            assert isinstance(response_data, dict)

    @pytest.mark.asyncio
    async def test_{{FUNCTION_NAME}}_validation_error(self, invalid_request_data: Dict[str, Any]):
        """
        Test the endpoint with invalid input data.

        Should return 422 Unprocessable Entity for validation errors.
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.{{HTTP_METHOD_LOWER}}("{{ENDPOINT_PATH}}", json=invalid_request_data)

            # Assert: 422 Validation Error
            assert response.status_code == 422, f"Expected 422, got {response.status_code}"

            # Assert: Response contains validation error details
            response_data = response.json()
            assert "detail" in response_data, "Validation error should contain 'detail'"

    @pytest.mark.asyncio
    async def test_{{FUNCTION_NAME}}_empty_payload(self):
        """
        Test the endpoint with empty payload.

        Should return 422 for missing required fields.
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.{{HTTP_METHOD_LOWER}}("{{ENDPOINT_PATH}}", json={})

            assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_{{FUNCTION_NAME}}_malformed_json(self):
        """
        Test the endpoint with malformed JSON.

        Should return 422 for unparseable data.
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.{{HTTP_METHOD_LOWER}}(
                "{{ENDPOINT_PATH}}",
                content="not valid json",
                headers={"Content-Type": "application/json"}
            )

            assert response.status_code == 422

    @pytest.mark.asyncio
    @patch("app.core.dependencies.get_current_user")
    async def test_{{FUNCTION_NAME}}_unauthorized(self, mock_auth):
        """
        Test the endpoint without authentication.

        Should return 401 Unauthorized if auth is required.
        """
        # Simulate authentication failure
        mock_auth.side_effect = Exception("Unauthorized")

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.{{HTTP_METHOD_LOWER}}("{{ENDPOINT_PATH}}", json={})

            # Note: Depending on auth middleware, may return 401 or 500
            assert response.status_code in [401, 500]

    @pytest.mark.asyncio
    @patch("app.genkit_flows.{{GENKIT_FLOW_MODULE}}.{{GENKIT_FLOW_FUNCTION}}")
    async def test_{{FUNCTION_NAME}}_genkit_flow_execution(
        self, mock_flow, valid_request_data: Dict[str, Any]
    ):
        """
        Test that the endpoint invokes the Genkit flow correctly.

        Mocks the Genkit flow and verifies it's called with correct parameters.
        """
        # Mock Genkit flow response
        mock_flow.return_value = {{MOCK_FLOW_RESPONSE}}

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.{{HTTP_METHOD_LOWER}}("{{ENDPOINT_PATH}}", json=valid_request_data)

            # Assert: Flow was called
            assert mock_flow.called, "Genkit flow should have been invoked"

            # Assert: Flow called with correct arguments
            call_args = mock_flow.call_args
            # TODO: Verify specific arguments passed to flow

            # Assert: Response processed flow result correctly
            assert response.status_code == {{SUCCESS_STATUS_CODE}}

    @pytest.mark.asyncio
    async def test_{{FUNCTION_NAME}}_response_time(self, valid_request_data: Dict[str, Any]):
        """
        Test that the endpoint responds within acceptable time.

        Performance test to ensure response time is under threshold.
        """
        import time

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            start_time = time.time()
            response = await client.{{HTTP_METHOD_LOWER}}("{{ENDPOINT_PATH}}", json=valid_request_data)
            end_time = time.time()

            response_time_ms = (end_time - start_time) * 1000

            # Assert: Response within 10 seconds (adjust threshold as needed)
            assert response_time_ms < 10000, f"Response time {response_time_ms}ms exceeded 10s threshold"

            # Log response time for monitoring
            print(f"Response time: {response_time_ms:.2f}ms")

    @pytest.mark.asyncio
    async def test_{{FUNCTION_NAME}}_concurrent_requests(self, valid_request_data: Dict[str, Any]):
        """
        Test the endpoint handles concurrent requests correctly.

        Ensures no race conditions or resource conflicts.
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Send 5 concurrent requests
            tasks = [
                client.{{HTTP_METHOD_LOWER}}("{{ENDPOINT_PATH}}", json=valid_request_data)
                for _ in range(5)
            ]

            responses = await asyncio.gather(*tasks)

            # Assert: All requests succeeded
            for i, response in enumerate(responses):
                assert (
                    response.status_code == {{SUCCESS_STATUS_CODE}}
                ), f"Request {i} failed with status {response.status_code}"

    # TODO: Add edge case tests
    @pytest.mark.skip(reason="TODO: Implement edge case test")
    async def test_{{FUNCTION_NAME}}_edge_cases(self):
        """Test edge cases like very long input, special characters, etc."""
        pass

    # TODO: Add caching tests if applicable
    @pytest.mark.skip(reason="TODO: Implement cache test")
    async def test_{{FUNCTION_NAME}}_cache_behavior(self):
        """Test that caching works correctly (cache hit/miss)."""
        pass
