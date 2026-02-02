# Security Checks

**Goal:** Ensure secrets, keys, and dependencies are safe.

## Secrets / Env Audit

- Check `.env.example` for completeness.
- Ensure no keys are committed:
  - `rg -n "API_KEY|SECRET|TOKEN|PRIVATE" -S .`

## Dependency Audit

- Node: `yarn npm audit`
- Python: review `backend/requirements.txt` for pinned versions

## Claude Desktop Prompt (Token-Efficient)

“Perform a security audit. Use filesystem MCP to scan for secrets and check dependency manifests. Provide critical/high findings with file paths only.”
