"""
Comprehensive test cases for the FastAPI backend API endpoints.
Includes edge cases, error conditions, and integration tests.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

# Test data
TEST_USER = {"email": "test@example.com", "password": "TestPass123!"}

INVALID_USERS = [
    # Missing email
    {"password": "ValidPass123!"},
    # Missing password
    {"email": "test@example.com"},
    # Invalid email format
    {"email": "invalid-email", "password": "ValidPass123!"},
    # Short password
    {"email": "test@example.com", "password": "short"},
    # No special chars in password
    {"email": "test@example.com", "password": "NoSpecialChars123"},
    # No numbers in password
    {"email": "test@example.com", "password": "NoNumbers!"},
]


def test_health_check():
    """Test the health check endpoint with various scenarios."""
    # Test normal health check
    response = client.get("/api/health")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": "ok"}

    # Test with query parameters
    response = client.get("/api/health?detailed=true")
    assert response.status_code == status.HTTP_200_OK
    assert "status" in response.json()
    assert "timestamp" in response.json()


def test_register_user():
    """Test user registration with various scenarios."""
    # Test successful registration
    response = client.post("/api/auth/register", json=TEST_USER)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "id" in data
    assert data["email"] == TEST_USER["email"]
    assert "password" not in data  # Password should not be in response
    assert "hashed_password" not in data

    # Test duplicate registration
    response = client.post("/api/auth/register", json=TEST_USER)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email already registered" in response.json()["detail"]

    # Test invalid user data
    for invalid_user in INVALID_USERS:
        response = client.post("/api/auth/register", json=invalid_user)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_login_user():
    """Test user login with various scenarios."""
    # Test successful login
    response = client.post(
        "/api/auth/login",
        data={"username": TEST_USER["email"], "password": TEST_USER["password"]},
        headers={"content-type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Test invalid credentials
    response = client.post(
        "/api/auth/login",
        data={"username": TEST_USER["email"], "password": "wrongpassword"},
        headers={"content-type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # Test non-existent user
    response = client.post(
        "/api/auth/login",
        data={"username": "nonexistent@example.com", "password": "anypassword"},
        headers={"content-type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_protected_endpoints():
    """Test access to protected endpoints."""
    # Get a valid token
    login_response = client.post(
        "/api/auth/login",
        data={"username": TEST_USER["email"], "password": TEST_USER["password"]},
        headers={"content-type": "application/x-www-form-urlencoded"},
    )
    token = login_response.json()["access_token"]

    # Test accessing protected endpoint with valid token
    response = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["email"] == TEST_USER["email"]

    # Test accessing protected endpoint with invalid token
    response = client.get("/api/users/me", headers={"Authorization": "Bearer invalid_token"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # Test expired token
    expired_token = create_access_token(
        data={"sub": TEST_USER["email"]}, expires_delta=timedelta(seconds=-1)  # Expired token
    )
    response = client.get("/api/users/me", headers={"Authorization": f"Bearer {expired_token}"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
