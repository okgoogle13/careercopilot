def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get("/api/v1/profile/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
