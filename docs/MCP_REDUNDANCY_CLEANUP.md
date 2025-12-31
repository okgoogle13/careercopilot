# MCP Redundancy Cleanup

**Date:** 2025-12-28
**Status:** Completed

## Deleted Files

### 1. Legacy Antigravity Fallback Config ❌
**Path:** `/home/njd/.gemini/antigravity/mcp_config.json`

**Reason for Deletion:**
- This file was a legacy configuration used by an older setup script.
- It contained **incorrect/broken configurations**:
  - `npx @modelcontextprotocol/server-playwright` (This package does not exist)
  - `npx @modelcontextprotocol/server-docker` (This package does not exist)
- It was redundant to the active global configuration at `~/.config/Antigravity/User/mcp.json`.
- Its presence confusingly duplicated the MCP settings.

## Remaining Active Files ✅

You now have exactly **two** active configuration files, adhering to the standard hierarchy:

1.  **Global Configuration** (User-wide)
    -   **Path:** `~/.config/Antigravity/User/mcp.json`
    -   **Purpose:** GitHub integration for all projects.

2.  **Workspace Configuration** (Project-specific)
    -   **Path:** `/home/njd/careercopilot/careercopilot-1/mcp.json`
    -   **Purpose:** Flash Sidekick, Playwright, and Docker for this specific codebase.

## Ignored Files (Safe to Keep)
- `docs/archive_mcp_configs/*`: Backup/Archive locations (not active).
- `globalStorage/.../google-mcp.json`: Internal data file for GitHub PR extension (do not touch).
