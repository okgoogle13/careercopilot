# Codex CLI Configuration

This directory contains configuration files for [Codex CLI](https://codex.dev/), a terminal-based AI assistant.

## Files

### `config.toml`
Template configuration for MCP (Model Context Protocol) servers used by Codex CLI.

**Currently configured:**
- GitHub MCP Server (requires `CODEX_GITHUB_PERSONAL_ACCESS_TOKEN` environment variable)

**Available but commented out:**
- Flash Sidekick MCP Server
- Design System Sidekick MCP Server
- Playwright MCP Server

## Setup

### Quick Setup
Run the automated setup script:
```bash
./scripts/setup-codex-github-mcp.sh
```

### Manual Setup
1. Create a GitHub Personal Access Token at https://github.com/settings/personal-access-tokens
2. Set the environment variable:
   ```bash
   export CODEX_GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here"
   ```
3. Restart Codex CLI

## Documentation

For detailed setup instructions, troubleshooting, and security best practices, see:
- **Complete guide:** [`docs/guides/CODEX_CLI_SETUP.md`](../docs/guides/CODEX_CLI_SETUP.md)
- **Quick reference:** [`CODEX_CLI_GITHUB_MCP_FIX.md`](../CODEX_CLI_GITHUB_MCP_FIX.md) (root)
- **MCP overview:** [`docs/guides/MCP_CONFIGURATION.md`](../docs/guides/MCP_CONFIGURATION.md)

## Configuration Locations

Codex CLI looks for configuration in multiple locations:
1. **Project-specific:** `.codex/config.toml` (this file, in repository root)
2. **User global:** `~/.config/codex/config.toml` (macOS/Linux)
3. **User global:** `%APPDATA%\codex\config.toml` (Windows)

Project-specific configuration takes precedence over global configuration.

## Adding More MCP Servers

To add additional MCP servers, uncomment the relevant sections in `config.toml` or add new sections following this format:

```toml
[mcp_servers.server_name]
command = "command_to_run"
args = ["arg1", "arg2"]
env = { ENV_VAR = "value" }
```

## Security

⚠️ **Never commit secrets or tokens to this repository!**

- Use environment variables for all sensitive values
- The template `config.toml` only contains environment variable references
- Actual tokens should be in your shell configuration (~/.zshrc, ~/.bashrc) or system environment

## Status

✅ Ready to use - Template configuration provided  
📖 Comprehensive documentation available  
🔧 Automated setup script included
