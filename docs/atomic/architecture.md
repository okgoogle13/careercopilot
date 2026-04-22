# Architecture Overview (Concise)

## Frontend
- React 18 + Vite
- UI components in `frontend/src/components/`
- Design tokens + globals in `frontend/src/globals.css` and `frontend/src/theme/`

## Backend
- FastAPI entry: `backend/app/main.py`
- Genkit flows: `backend/app/genkit_flows/`
- Schemas: `backend/app/schemas/`
- Workers: `backend/app/workers/`
- Bridges: `backend/app/bridges/` (legacy compatibility)

## Functions
- Firebase functions in `functions/src/`
- Genkit initialization in `functions/src/genkit.ts`

## MCP Tooling
- MCP servers in `servers/` (flash-sidekick + docker)
- MCP config: `mcp_config.json`
