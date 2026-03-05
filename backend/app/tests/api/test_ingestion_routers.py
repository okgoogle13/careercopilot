"""Tests for legacy ingestion router wrappers."""

from app.api.endpoints.legacy_ingestion import router as legacy_ingestion_router
from app.api.endpoints.smart_ingestion import router as smart_ingestion_router
from app.api.routers.ingestion import router as routers_ingestion_router
from app.api.routes.ingestion import router as routes_ingestion_router


def test_routes_wrapper_points_to_legacy_router():
    assert routes_ingestion_router is legacy_ingestion_router


def test_routers_wrapper_points_to_smart_router():
    assert routers_ingestion_router is smart_ingestion_router
