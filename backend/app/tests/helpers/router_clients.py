"""Helpers for lightweight router-only test clients."""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI
from fastapi.routing import APIRouter
from fastapi.testclient import TestClient


def build_router_client(router: APIRouter) -> TestClient:
    """Mount a single router on a throwaway FastAPI app and return a test client."""
    app = FastAPI()
    app.include_router(router)
    return TestClient(app)


def build_module_client(module: Any) -> TestClient:
    """Build a throwaway client for a module exposing ``router``."""
    return build_router_client(module.router)
