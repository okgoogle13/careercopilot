# Legacy MCP Prototypes Archive

The files in this directory are **legacy MCP server prototypes** extracted from `/home/njd/careercopilot/careercopilot-1/.claude/mcp-servers`.

## Audit Summary
**Date:** 2025-12-28
**Status:** Archived (Not in use)

## Contents
1. **design-system-server.py**:
   - Contains logic for WCAG validation and "Anti-Slop" aesthetic checking.
   - **Potential Value**: The `_detect_slop` and `_validate_contrast` methods are valuable algorithms. They could be migrated to a standalone utility script or integrated into the `flash-sidekick.py` server if needed in the future, but are not currently required.

2. **firestore-server.py**:
   - Prototype for direct Firestore access.
   - **Current Status**: Redundant, as we access Firestore directly via application code/tests.

3. **genkit-server.py**:
   - Prototype for Genkit flow validation.

4. **configuration-server.py** & **contract-validator-server.py**:
   - Infrastructure prototypes.

## Why Archived?
These scripts were part of a previous underlying architecture ("Claude MCP Orchestrator") that has been superseded by the `mcp.json` standard configuration and the `flash-sidekick` implementation. They are not loaded by any active configuration.
