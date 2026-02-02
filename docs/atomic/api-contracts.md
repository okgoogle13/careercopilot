# API Contracts Cheat Sheet

**Goal:** Locate and validate API endpoints + payloads.

## Primary Sources

- Backend routes: `backend/app/api/`
- Schemas: `backend/app/schemas/`

## Quick Commands

- List routes: `rg -n "APIRouter|@router" backend/app/api -g "*.py"`
- Find request/response models: `rg -n "BaseModel" backend/app/schemas -g "*.py"`

## Notes

- All internal payloads must use Pydantic V2.
- Avoid raw dicts for internal APIs.

