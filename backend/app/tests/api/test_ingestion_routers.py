"""Tests for career ingestion router wrappers."""

from app.api.endpoints.career_ingestion import router as career_ingestion_router
from app.api.endpoints.smart_ingestion import router as smart_ingestion_router
from app.api.routers.ingestion import router as routers_ingestion_router
from app.api.routes.ingestion import router as routes_ingestion_router


def test_routes_wrapper_points_to_legacy_router():
    assert routes_ingestion_router is career_ingestion_router


def test_routers_wrapper_points_to_smart_router():
    assert routers_ingestion_router is smart_ingestion_router
