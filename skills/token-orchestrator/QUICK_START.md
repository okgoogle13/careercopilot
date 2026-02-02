# Token Orchestrator - Quick Start

## Basic Usage

1. **Audit a specific component:**
   "Audit src/components/ui/Button.tsx using Token Orchestrator"

2. **Find hardcoded colors in a directory:**
   "Scan src/components/shared for hardcoded colors using Token Orchestrator"

3. **Generate a migration plan:**
   "Create a token migration plan for src/features/landing/LandingPage.tsx"

## Configuration

This skill reads from:
- `frontend/src/design-tokens.json` (Source of truth)
- `.claude/skills/token-orchestrator/token_orchestrator_engine.py` (Logic)
