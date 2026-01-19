# Data Models Cheat Sheet

**Goal:** Fast reference for core collections and schema sources.

## Primary Sources

- Backend schemas: `backend/app/schemas/`
- Firestore usage: `backend/app/core/db.py` and `backend/app/services/`

## Suggested Quick Checks

- List schemas: `rg -n "class .*\\(BaseModel\\)" backend/app/schemas -g "*.py"`
- Find Firestore collections: `rg -n "collection\\(" backend/app -g "*.py"`

## Notes

- Treat Firestore as schema-driven (Pydantic V2).
- Avoid dict-only payloads in internal flows.

