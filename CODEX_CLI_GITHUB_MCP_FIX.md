# Codex CLI GitHub MCP - Quick Reference

## Problem

```
GitHub MCP does not support OAuth. Log in by adding a personal access token
⚠ MCP startup incomplete (failed: github)
```

## Quick Fix (5 minutes)

### 1. Create GitHub Token
🔗 https://github.com/settings/personal-access-tokens/new
- Name: `Codex CLI MCP Access`
- Scopes: `repo`, `workflow`, `read:org`
- Copy the token (starts with `ghp_` or `github_pat_`)

### 2. Set Environment Variable
```bash
# Add to ~/.zshrc or ~/.bashrc
export CODEX_GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here"

# Reload
source ~/.zshrc
```

### 3. Run Setup Script
```bash
./scripts/setup-codex-github-mcp.sh
```

OR manually create `.codex/config.toml`:
```toml
[mcp_servers.github]
bearer_token_env_var = "CODEX_GITHUB_PERSONAL_ACCESS_TOKEN"
```

### 4. Restart Codex CLI
Completely quit and relaunch Codex CLI.

## Verify It Works
```bash
# Check environment variable
echo $CODEX_GITHUB_PERSONAL_ACCESS_TOKEN

# Test in Codex CLI
"Show me the latest issues in okgoogle13/careercopilot"
```

## Files Created
- `.codex/config.toml` - Codex CLI MCP configuration
- `docs/guides/CODEX_CLI_SETUP.md` - Complete setup guide
- `scripts/setup-codex-github-mcp.sh` - Automated setup script

## Full Documentation
📖 See [`docs/guides/CODEX_CLI_SETUP.md`](docs/guides/CODEX_CLI_SETUP.md) for:
- Detailed troubleshooting
- Security best practices
- Alternative setup methods
- Windows-specific instructions

## Why This Approach?
✅ **Free** - No OpenAI API subscription required  
✅ **Secure** - Uses Personal Access Token (PAT)  
✅ **Simple** - One-time setup  
✅ **Flexible** - Works with Codex CLI and other MCP clients

---
**Last Updated:** 2026-02-14  
**Status:** ✅ Ready to use
