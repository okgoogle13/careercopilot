"""
Tests for the simple root endpoint of the FastAPI application.

This module provides comprehensive tests for the basic functionality of the
application's root endpoint, ensuring it responds correctly and with the
expected data.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app  # Assuming the FastAPI app instance is named 'app' in app/main.py


@pytest.fixture(scope="module")
def client():
    """
    Provides a test client for the FastAPI application.

    This fixture initializes a TestClient for the main FastAPI application,
    allowing tests to make requests against the application without running
    a live server. The client is yielded once per module.
    """
    with TestClient(app) as test_client:
        yield test_client


class TestSimpleEndpoint:
    """
    Tests for the basic root endpoint ("/") of the application.

    This class contains tests to validate the behavior of the application's
    entry point, focusing on successful responses and expected content.
    """

    def test_read_root_success(self, client: TestClient):
        """
        Validates that the root endpoint ("/") returns a successful response
        with the expected message.

        This test covers the happy path for the root GET endpoint,
        checking for:
        - An HTTP status code of 200 OK.
        - A JSON response body containing the expected welcome message.
        """
        print("Testing GET / endpoint...")
        response = client.get("/")

        # Assert the HTTP status code is 200 OK
        assert (
            response.status_code == 200
        ), f"Expected status code 200, but got {response.status_code}"

        # Assert the response body matches the expected JSON
        expected_response_data = {"status": "ok"}
        assert (
            response.json() == expected_response_data
        ), f"Expected JSON {expected_response_data}, but got {response.json()}"

        print(f"GET / successful. Response: {response.json()}")

    def test_read_root_method_not_allowed(self, client: TestClient):
        """
        Validates that unsupported HTTP methods on the root endpoint ("/")
        return a 405 Method Not Allowed error.

        This test ensures that only the intended GET method is allowed for
        the root endpoint, covering basic error handling for incorrect HTTP verbs.
        """
        print("Testing POST / endpoint (expecting 405)...")
        response = client.post("/")

        # Assert the HTTP status code is 405 Method Not Allowed
        assert (
            response.status_code == 405
        ), f"Expected status code 405 for POST /, but got {response.status_code}"

        # Optionally, check the detail message for clarity
        assert "detail" in response.json()
        assert (
            response.json()["detail"] == "Method Not Allowed"
        ), f"Expected detail 'Method Not Allowed', but got {response.json()['detail']}"

        print(f"POST / correctly returned 405. Response: {response.json()}")
