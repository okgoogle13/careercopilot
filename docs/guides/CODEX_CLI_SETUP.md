# Codex CLI MCP Setup Guide

This guide helps you configure Codex CLI to use MCP (Model Context Protocol) servers, specifically the GitHub MCP server with Personal Access Token (PAT) authentication.

## Problem

When trying to use GitHub MCP with Codex CLI, you may encounter this error:

```
GitHub MCP does not support OAuth. Log in by adding a personal access token (https://
github.com/settings/personal-access-tokens) to your environment and config.toml:
[mcp_servers.github]
bearer_token_env_var = CODEX_GITHUB_PERSONAL_ACCESS_TOKEN

⚠ MCP startup incomplete (failed: github)
```

## Solution Overview

To fix this, you need to:
1. Create a GitHub Personal Access Token (PAT)
2. Set up the environment variable
3. Configure Codex CLI's `config.toml` file
4. Restart Codex CLI

---

## Step 1: Create GitHub Personal Access Token

### Option A: Fine-grained Personal Access Token (Recommended)

1. Go to https://github.com/settings/personal-access-tokens/new
2. Give your token a descriptive name: `Codex CLI MCP Access`
3. Set expiration (recommend 90 days for security)
4. Select **Repository access**:
   - Choose "Only select repositories" and select `okgoogle13/careercopilot`
   - Or choose "All repositories" if you want broader access
5. Under **Permissions**, grant:
   - **Repository permissions**:
     - Contents: Read and write
     - Issues: Read and write
     - Pull requests: Read and write
     - Workflows: Read and write
   - **Account permissions**:
     - None required (unless accessing organization data)
6. Click **Generate token**
7. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

### Option B: Classic Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Give your token a descriptive name: `Codex CLI MCP Access`
3. Set expiration (recommend 90 days)
4. Select scopes:
   - [x] `repo` (Full control of private repositories)
   - [x] `workflow` (Update GitHub Action workflows)
   - [x] `read:org` (Read org and team membership)
5. Click **Generate token**
6. Copy the token immediately

---

## Step 2: Set Environment Variable

You need to set the `CODEX_GITHUB_PERSONAL_ACCESS_TOKEN` environment variable with your PAT.

### macOS / Linux

Add to your shell configuration file (`~/.zshrc`, `~/.bashrc`, or `~/.bash_profile`):

```bash
# GitHub Personal Access Token for Codex CLI MCP
export CODEX_GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your_token_here"
```

Then reload your shell:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

**Verify the variable is set:**

```bash
echo $CODEX_GITHUB_PERSONAL_ACCESS_TOKEN
```

### Windows (PowerShell)

**For current session only:**
```powershell
$env:CODEX_GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_your_token_here"
```

**For persistent (all sessions):**
```powershell
[System.Environment]::SetEnvironmentVariable('CODEX_GITHUB_PERSONAL_ACCESS_TOKEN', 'ghp_your_token_here', 'User')
```

**Verify:**
```powershell
echo $env:CODEX_GITHUB_PERSONAL_ACCESS_TOKEN
```

### Alternative: Use `.env` file (if Codex CLI supports it)

Create or edit `.env` in the repository root:

```bash
# GitHub Personal Access Token for Codex CLI MCP
CODEX_GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
```

**Note**: Add `.env` to `.gitignore` if not already present to avoid committing secrets!

---

## Step 3: Configure Codex CLI

### Find Your Codex Configuration Directory

Codex CLI typically stores configuration in one of these locations:

- **macOS/Linux**: `~/.config/codex/config.toml` or `~/.codex/config.toml`
- **Windows**: `%APPDATA%\codex\config.toml`
- **Project-specific**: `.codex/config.toml` (in your repository root)

### Option A: Use Project-Specific Configuration (Recommended)

We've created a template configuration file in this repository:

```
.codex/config.toml
```

This file is already configured with the GitHub MCP server settings. Just ensure your environment variable is set (Step 2).

### Option B: Use Global Configuration

If you prefer a global configuration:

1. Create the configuration directory if it doesn't exist:

   ```bash
   # macOS/Linux
   mkdir -p ~/.config/codex
   
   # Windows
   mkdir %APPDATA%\codex
   ```

2. Copy the template:

   ```bash
   # macOS/Linux
   cp .codex/config.toml ~/.config/codex/config.toml
   
   # Windows
   copy .codex\config.toml %APPDATA%\codex\config.toml
   ```

3. Or manually create `~/.config/codex/config.toml` with:

   ```toml
   [mcp_servers.github]
   bearer_token_env_var = "CODEX_GITHUB_PERSONAL_ACCESS_TOKEN"
   ```

---

## Step 4: Verify Configuration

### Check Configuration File

```bash
# macOS/Linux
cat ~/.config/codex/config.toml
# or
cat .codex/config.toml

# Windows
type %APPDATA%\codex\config.toml
# or
type .codex\config.toml
```

You should see:

```toml
[mcp_servers.github]
bearer_token_env_var = "CODEX_GITHUB_PERSONAL_ACCESS_TOKEN"
```

### Test MCP Connection

1. **Restart Codex CLI** completely (quit and relaunch)

2. In Codex CLI, verify the GitHub MCP server is available:

   ```
   List available MCP servers
   ```

3. Test GitHub access:

   ```
   Show me the latest issues in okgoogle13/careercopilot
   ```

If successful, Codex should be able to query GitHub without errors.

---

## Quick Setup Script

We've created a helper script to automate this setup:

```bash
# Run from repository root
./scripts/setup-codex-github-mcp.sh
```

This script will:
1. Prompt you for your GitHub PAT
2. Add the environment variable to your shell config
3. Create the `.codex/config.toml` file if needed
4. Verify the setup

---

## Troubleshooting

### Error: "MCP startup incomplete (failed: github)"

**Cause**: Environment variable not set or config.toml missing

**Solution**:
1. Verify environment variable is set:
   ```bash
   echo $CODEX_GITHUB_PERSONAL_ACCESS_TOKEN
   ```
2. Check config.toml exists and has the correct format
3. Restart Codex CLI completely

### Error: "401 Unauthorized" or "403 Forbidden"

**Cause**: Invalid or expired GitHub PAT, or insufficient permissions

**Solution**:
1. Verify your PAT is correct:
   ```bash
   curl -H "Authorization: token $CODEX_GITHUB_PERSONAL_ACCESS_TOKEN" https://api.github.com/user
   ```
   Should return your GitHub user information
2. Check PAT hasn't expired at https://github.com/settings/tokens
3. Regenerate PAT if necessary and update environment variable

### Error: "Rate limit exceeded"

**Cause**: Too many GitHub API requests

**Solution**:
- Wait for rate limit to reset (check headers in error message)
- Consider using a different PAT or GitHub account
- Authenticated requests have higher rate limits (5000/hour vs 60/hour)

### Environment Variable Not Loading

**Cause**: Shell configuration not reloaded or Codex started before setting variable

**Solution**:
1. Reload shell configuration:
   ```bash
   source ~/.zshrc  # or ~/.bashrc
   ```
2. Verify variable is set:
   ```bash
   echo $CODEX_GITHUB_PERSONAL_ACCESS_TOKEN
   ```
3. Restart Codex CLI completely
4. For VS Code extensions, you may need to restart VS Code entirely

### Config File Not Being Read

**Cause**: Codex may be looking in a different location

**Solution**:
1. Check Codex CLI documentation for config file location
2. Try both global (`~/.config/codex/`) and local (`.codex/`) configs
3. Check file permissions:
   ```bash
   chmod 644 ~/.config/codex/config.toml
   ```

---

## Alternative: Using OpenAI API

If you prefer not to use the GitHub MCP or want to explore other options, note that:

- Codex CLI was suggesting you use OpenAI API as an alternative
- However, based on your request, this guide focuses on the **free** GitHub PAT approach
- GitHub PAT is free and doesn't require OpenAI API subscription

---

## Security Best Practices

1. **Never commit your PAT**: Ensure `.env` and any files containing tokens are in `.gitignore`
2. **Use fine-grained tokens**: Limit access to specific repositories
3. **Set expiration dates**: Regularly rotate tokens (recommended: 90 days)
4. **Revoke unused tokens**: Clean up old tokens at https://github.com/settings/tokens
5. **Use environment variables**: Never hardcode tokens in config files that might be committed

---

## Additional Resources

- [GitHub Personal Access Tokens Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [MCP (Model Context Protocol) Specification](https://spec.modelcontextprotocol.io/)
- [Codex CLI Documentation](https://codex.dev/docs)

---

**Last Updated**: 2026-02-14  
**Issue Reference**: Persistent config issue re: codex cli mcp config  
**Status**: ✅ Ready for use
