from __future__ import annotations

import json

from app.core import db as db_module


def test_get_firestore_client_returns_none_when_firebase_unavailable(capsys) -> None:
    original = db_module.FIREBASE_AVAILABLE
    db_module.FIREBASE_AVAILABLE = False
    try:
        client = db_module.get_firestore_client()
        out = capsys.readouterr().out
        assert client is None
        assert "not available" in out.lower()
    finally:
        db_module.FIREBASE_AVAILABLE = original


def test_get_firestore_client_uses_env_credentials(monkeypatch) -> None:
    original = db_module.FIREBASE_AVAILABLE
    db_module.FIREBASE_AVAILABLE = True

    creds_payload = {"project_id": "demo-project", "client_email": "x@y.com"}

    class _CredsFactory:
        @staticmethod
        def from_service_account_info(info):
            return {"creds": info["project_id"]}

    class _SvcAcct:
        Credentials = _CredsFactory

    class _Firestore:
        @staticmethod
        def Client(**kwargs):
            return kwargs

    monkeypatch.setattr(db_module, "service_account", _SvcAcct)
    monkeypatch.setattr(db_module, "firestore", _Firestore)
    monkeypatch.setattr(
        db_module.os,
        "getenv",
        lambda key: (
            json.dumps(creds_payload) if key == "GOOGLE_APPLICATION_CREDENTIALS_JSON" else None
        ),
    )

    try:
        client = db_module.get_firestore_client()
        assert client["project"] == "demo-project"
        assert client["credentials"] == {"creds": "demo-project"}
    finally:
        db_module.FIREBASE_AVAILABLE = original


def test_get_firestore_client_falls_back_to_default_credentials(monkeypatch) -> None:
    original = db_module.FIREBASE_AVAILABLE
    db_module.FIREBASE_AVAILABLE = True

    class _Firestore:
        @staticmethod
        def Client(**kwargs):
            return {"default": True, **kwargs}

    monkeypatch.setattr(db_module, "firestore", _Firestore)
    monkeypatch.setattr(
        db_module.os,
        "getenv",
        lambda key: None if key == "GOOGLE_APPLICATION_CREDENTIALS_JSON" else None,
    )

    try:
        client = db_module.get_firestore_client()
        assert client["default"] is True
    finally:
        db_module.FIREBASE_AVAILABLE = original


def test_get_firestore_client_handles_exception(monkeypatch, capsys) -> None:
    original = db_module.FIREBASE_AVAILABLE
    db_module.FIREBASE_AVAILABLE = True

    class _Firestore:
        @staticmethod
        def Client(**kwargs):
            raise RuntimeError("boom")

    monkeypatch.setattr(db_module, "firestore", _Firestore)
    monkeypatch.setattr(
        db_module.os,
        "getenv",
        lambda key: None if key == "GOOGLE_APPLICATION_CREDENTIALS_JSON" else None,
    )

    try:
        client = db_module.get_firestore_client()
        out = capsys.readouterr().out
        assert client is None
        assert "could not initialize firestore client" in out.lower()
    finally:
        db_module.FIREBASE_AVAILABLE = original
