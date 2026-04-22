# Environment Config Cheat Sheet

**Goal:** Quickly verify environment and secrets configuration.

## Primary Files

- `.env.example`
- `backend/.env.example` (if present)
- `frontend/.env.*` (local only, not committed)

## Secret Scan

- `rg -n "API_KEY|SECRET|TOKEN|PRIVATE" -S .`

## CI Secrets

- Check GitHub repo secrets used in `.github/workflows/deploy.yml`
