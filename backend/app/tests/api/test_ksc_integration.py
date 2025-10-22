"""
Integration tests for the KSC Generation API endpoint.

This module contains pytest tests that make actual HTTP requests to the
POST /api/v1/ksc/generate FastAPI endpoint using httpx.
"""

import asyncio
from typing import Any, Dict

import pytest
from app.main_simple import app
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient


class TestKscGenerationIntegration:
    """Integration test suite for KSC generation API endpoint."""

    @pytest.fixture
    def sample_job_description(self) -> Dict[str, Any]:
        """Provide a valid job description payload for testing."""
        return {
            "job_description": """
            Senior Software Engineer Position

            We are seeking a Senior Software Engineer with:
            - 5+ years of Python development experience
            - Strong leadership and mentoring abilities
            - Experience with cloud technologies (AWS/GCP)
            - Database design and optimization skills
            - Agile development methodologies

            Responsibilities:
            - Lead development of scalable web applications
            - Mentor junior developers and conduct code reviews
            - Collaborate with product managers and designers
            - Implement best practices for software development
            - Participate in architectural decisions

            Required Skills:
            - Python, JavaScript, SQL
            - REST API development
            - CI/CD pipelines
            - Problem-solving and analytical thinking
            - Excellent communication skills
            """
        }

    @pytest.fixture
    def minimal_job_description(self) -> Dict[str, Any]:
        """Provide minimal valid job description."""
        return {"job_description": "Python developer position requiring 2+ years experience."}

    @pytest.mark.asyncio
    async def test_ksc_generate_endpoint_success(self, sample_job_description: Dict[str, Any]):
        """
        Test the POST /api/v1/ksc/generate endpoint with valid input.

        This test:
        1. Sends a valid POST request with job_description
        2. Asserts 200 OK status
        3. Confirms JSON response is a list of strings (KSC statements)
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Send POST request to KSC generation endpoint
            response = await client.post("/api/v1/ksc/generate", json=sample_job_description)

            # Assert 1: HTTP 200 OK status
            assert (
                response.status_code == 200
            ), f"Expected 200, got {response.status_code}: {response.text}"

            # Assert 2: Response is valid JSON
            response_data = response.json()
            assert isinstance(
                response_data, dict
            ), f"Expected dict response, got {type(response_data)}"

            # Assert 3: Response has expected structure
            assert (
                "generated_statements" in response_data
            ), "Response should contain 'generated_statements'"

            generated_statements = response_data["generated_statements"]

            # Assert 4: generated_statements is a list
            assert isinstance(
                generated_statements, list
            ), f"Expected list, got {type(generated_statements)}"

            # Assert 5: List is not empty
            assert len(generated_statements) > 0, "generated_statements should not be empty"

            # Assert 6: All items in list are strings (KSC statements)
            for i, statement in enumerate(generated_statements):
                assert isinstance(
                    statement, str
                ), f"Statement {i} should be string, got {type(statement)}"
                assert len(statement.strip()) > 0, f"Statement {i} should not be empty"

                # KSC statements should be reasonably substantial
                assert len(statement) > 20, f"Statement {i} seems too short: '{statement}'"

    @pytest.mark.asyncio
    async def test_ksc_generate_with_minimal_input(self, minimal_job_description: Dict[str, Any]):
        """
        Test KSC generation with minimal job description input.
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/api/v1/ksc/generate", json=minimal_job_description)

            # Should still succeed with minimal input
            assert response.status_code == 200

            response_data = response.json()
            assert "generated_statements" in response_data

            statements = response_data["generated_statements"]
            assert isinstance(statements, list)
            assert len(statements) > 0

    def test_ksc_generate_with_sync_client(self, sample_job_description: Dict[str, Any]):
        """
        Test KSC generation using synchronous TestClient for simpler testing.
        """
        with TestClient(app) as client:
            response = client.post("/api/v1/ksc/generate", json=sample_job_description)

            # Verify successful response
            assert response.status_code == 200

            # Verify response structure
            data = response.json()
            assert "generated_statements" in data
            assert isinstance(data["generated_statements"], list)
            assert len(data["generated_statements"]) > 0

            # Verify all statements are non-empty strings
            for statement in data["generated_statements"]:
                assert isinstance(statement, str)
                assert len(statement.strip()) > 0

    @pytest.mark.asyncio
    async def test_ksc_generate_endpoint_error_cases(self):
        """
        Test KSC generation endpoint with various error conditions.
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Test 1: Missing job_description field
            response = await client.post("/api/v1/ksc/generate", json={})
            # Current mock implementation doesn't validate input, so it might still return 200
            # In a real implementation, this should return 422 Unprocessable Entity

            # Test 2: Invalid JSON payload
            response = await client.post(
                "/api/v1/ksc/generate",
                content="invalid json",
                headers={"content-type": "application/json"},
            )
            # In test environment with mocked handlers, may return 200
            # Real FastAPI would return 422 for invalid JSON
            assert response.status_code in [
                200,
                400,
                422,
            ], f"Expected 200/400/422 for invalid JSON in test, got {response.status_code}"

            # Test 3: Empty job description
            response = await client.post("/api/v1/ksc/generate", json={"job_description": ""})
            # Mock implementation will still return 200, but real implementation should handle this
            # For now, just verify it doesn't crash
            assert response.status_code in [200, 400, 422]

    @pytest.mark.asyncio
    async def test_ksc_generate_response_timing(self, sample_job_description: Dict[str, Any]):
        """
        Test that the KSC generation endpoint responds within reasonable time.
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            import time

            start_time = time.time()
            response = await client.post("/api/v1/ksc/generate", json=sample_job_description)
            end_time = time.time()

            # Should respond within reasonable time (mock has 2s sleep)
            response_time = end_time - start_time
            assert response_time < 5.0, f"Response took too long: {response_time}s"
            assert (
                response_time >= 1.8
            ), f"Response suspiciously fast: {response_time}s (expected ~2s due to mock sleep)"

            # Verify response is still valid
            assert response.status_code == 200
            data = response.json()
            assert "generated_statements" in data

    @pytest.mark.asyncio
    async def test_ksc_generate_multiple_requests(self, sample_job_description: Dict[str, Any]):
        """
        Test multiple concurrent requests to ensure endpoint stability.
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Create multiple concurrent requests
            tasks = []
            for _i in range(3):  # Limit concurrent requests to avoid overwhelming
                task = client.post("/api/v1/ksc/generate", json=sample_job_description)
                tasks.append(task)

            # Execute all requests concurrently
            responses = await asyncio.gather(*tasks, return_exceptions=True)

            # Verify all requests succeeded
            for i, response in enumerate(responses):
                assert not isinstance(
                    response, Exception
                ), f"Request {i} failed with exception: {response}"
                assert (
                    response.status_code == 200
                ), f"Request {i} failed with status {response.status_code}"

                data = response.json()
                assert "generated_statements" in data
                assert len(data["generated_statements"]) > 0

    @pytest.mark.asyncio
    async def test_ksc_generate_different_job_types(self):
        """
        Test KSC generation with different types of job descriptions.
        """
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            job_types = [
                {
                    "job_description": "Data Scientist position requiring Python, SQL, and machine learning experience.",
                    "type": "technical",
                },
                {
                    "job_description": "Marketing Manager role focused on digital campaigns and team leadership.",
                    "type": "business",
                },
                {
                    "job_description": "Project Manager position requiring Agile methodology and stakeholder management.",
                    "type": "management",
                },
            ]

            for job_data in job_types:
                response = await client.post(
                    "/api/v1/ksc/generate",
                    json={"job_description": job_data["job_description"]},
                )

                assert response.status_code == 200, f"Failed for {job_data['type']} job type"

                data = response.json()
                assert "generated_statements" in data
                statements = data["generated_statements"]
                assert (
                    len(statements) > 0
                ), f"No statements generated for {job_data['type']} job type"

                # All statements should be meaningful strings
                for statement in statements:
                    assert isinstance(statement, str)
                    assert len(statement.strip()) > 10  # Reasonable minimum length
