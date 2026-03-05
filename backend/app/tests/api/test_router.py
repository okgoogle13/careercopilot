"""Tests for main API router registration."""

from app.api.router import api_router, routers


def test_router_has_registered_routes():
    assert len(api_router.routes) > 0


def test_all_configured_prefixes_present():
    all_paths = [route.path for route in api_router.routes]
    for _router, prefix, _tag in routers:
        assert any(path.startswith(prefix) for path in all_paths), prefix
