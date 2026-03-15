# Backend AI / Genkit

**Goal:** Migrate legacy AI logic to Genkit flows with strict schemas.

## Rules

- Use Pydantic V2 models for all inputs/outputs.
- New AI logic lives in `backend/app/genkit_flows/`.
- If workers use legacy code, add a bridge in `backend/app/bridges/`.

## Queue

- See: `docs/development/GENKIT_MIGRATION_QUEUE.md`

## Commands

- Find legacy AI calls:
  - `rg -n "ai_client|ai_flow|ai_operations" backend/app -g "*.py"`
- Find workers:
  - `rg -n "ats_score_worker" backend/app -g "*.py"`

## Claude Desktop Prompt (Token-Efficient)

“Review Genkit migration queue and confirm schema coverage. Use filesystem MCP to read:
`docs/development/GENKIT_MIGRATION_QUEUE.md` and sample files in `backend/app/core/ai/`.
Return: missing schemas + proposed flow targets.”
