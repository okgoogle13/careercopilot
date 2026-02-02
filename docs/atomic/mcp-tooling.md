# MCP Tooling

**Goal:** Ensure MCP servers are healthy and configured for Claude Desktop.

## Active Servers (Config)

- `flash-sidekick-fast`
- `flash-sidekick`
- `filesystem`
- `playwright`
- `docker` (optional)

## Health Checks

- Confirm MCP servers respond in Claude Desktop.
- Check logs:
  - `/tmp/mcp-flash-sidekick.log`

## Config File

- `mcp_config.json`

## Claude Desktop Prompt (Token-Efficient)

“Confirm MCP servers are reachable (filesystem, playwright, flash-sidekick-fast, flash-sidekick). Report any disconnects and log hints.”

