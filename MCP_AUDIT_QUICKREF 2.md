# MCP Audit - Quick Reference Card

## Critical Issues (DO TODAY)

### 1. Revoke GitHub Token

```bash
# GitHub token exposed in: ~/.claude/claude_desktop_config.json (line 10)
# Token: REDACTED_GITHUB_PAT
# ACTION: Go to https://github.com/settings/tokens and DELETE THIS TOKEN IMMEDIATELY
```

### 2. Fix File Permissions

```bash
chmod 600 ~/.claude/claude_desktop_config.json
chmod 700 ~/.claude/
# Verify: ls -la ~/.claude/claude_desktop_config.json | awk '{print $1}'
# Should show: -rw------- (0600)
```

### 3. Rotate API Keys

| API        | Provider                                   | Old Key Location |
| ---------- | ------------------------------------------ | ---------------- |
| OpenAI     | https://platform.openai.com/api-keys       | backend/.env     |
| Anthropic  | https://console.anthropic.com/account/keys | backend/.env     |
| Gemini     | https://aistudio.google.com/apikey         | multiple files   |
| Perplexity | https://www.perplexity.ai/settings         | system env       |
| OpenRouter | https://openrouter.ai/keys                 | system env       |

### 4. Remove Hardcoded Credentials

```bash
# Files with hardcoded secrets:
~/.claude/claude_desktop_config.json       # Line 10: GITHUB_PERSONAL_ACCESS_TOKEN
~/Desktop/careercopilot/backend/.env       # 3 API keys
~/Desktop/careercopilot/frontend/.env.local # 1 Supabase key
~/.gemini/antigravity/mcp_config.json      # 1 Gemini key
```

### 5. Check Environment Variables

```bash
# This should be EMPTY (no credentials):
env | grep -E "GITHUB_PERSONAL_ACCESS_TOKEN|github_pat_|API_KEY|SECRET"

# If not empty, remove from shell profiles:
nano ~/.zshrc ~/.zshenv ~/.bashrc ~/.bash_profile
# Delete any lines with credentials
```

---

## Configuration Issues

| Issue                                       | Severity | Location                                     | Fix                      |
| ------------------------------------------- | -------- | -------------------------------------------- | ------------------------ |
| Multiple MCP configs (3 active, 1 orphaned) | HIGH     | ~/.claude, ~/Desktop, ~/.mcp.json            | Consolidate to 1 file    |
| Flash-Sidekick not in Claude Desktop        | HIGH     | ~/.claude/claude_desktop_config.json         | Add server definition    |
| Playwright implementation differs           | HIGH     | Claude Desktop vs Project config             | Standardize to official  |
| Docker MCP missing ALLOWED_CONTAINERS       | HIGH     | ~/.claude/claude_desktop_config.json         | Add env config           |
| Non-existent model: gemini-3-pro-preview    | HIGH     | mcp_config.json                              | Change to gemini-2.5-pro |
| Hardcoded Node version path                 | HIGH     | ~/.claude/claude_desktop_config.json line 14 | Use generic npx          |
| Hardcoded venv paths                        | HIGH     | ~/Desktop/careercopilot/mcp_config.json      | Use env variables        |
| Backup config is stale (Sep 2025)           | MEDIUM   | ~/.claude/claude_desktop_config.json.backup  | Delete or update         |
| Inconsistent env var naming                 | LOW      | GITHUB_TOKEN vs GITHUB_PERSONAL_ACCESS_TOKEN | Standardize              |

---

## Server Status Check

### Quick Commands

```bash
# Test GitHub server
npx -y @modelcontextprotocol/server-github 2>&1 | head -1
# Expected: "GitHub MCP Server running on stdio"

# Test Playwright server
npx -y @playwright/mcp --version 2>&1 | head -1
# Expected: Version number

# Test Docker server
npx -y mcp-server-docker 2>&1 | head -1
# Expected: "MCP Server Docker started"

# Test Flash-Sidekick server
GEMINI_API_KEY=test ~/.venv/bin/python3 servers/flash_sidekick.py --help 2>&1 | head -1
# Expected: Server help output or Python error (not PATH error)
```

### Server Matrix

```
CONFIG FILE COMPARISON:
┌──────────────────────┬──────────────┬──────────────┬──────────────┐
│ Server               │ Claude       │ Project      │ Gemini       │
├──────────────────────┼──────────────┼──────────────┼──────────────┤
│ github               │ ✓            │ ✗            │ ✗            │
│ flash-sidekick       │ ✗            │ ✓            │ ✓            │
│ playwright           │ ✓            │ ✓            │ ✓            │
│ docker               │ ✓            │ ✓            │ ✓            │
│ filesystem           │ ✗            │ ✓            │ ✗            │
└──────────────────────┴──────────────┴──────────────┴──────────────┘
```

---

## Environment Variables To Set

### Required (Immediate)

```bash
export GITHUB_TOKEN="<new-github-pat>"           # From GitHub settings
export GEMINI_API_KEY="<new-gemini-key>"         # From aistudio.google.com
export OPENAI_API_KEY="<new-openai-key>"         # From platform.openai.com
export ANTHROPIC_API_KEY="<new-anthropic-key>"   # From console.anthropic.com
export PERPLEXITY_API_KEY="<new-perplexity-key>" # From perplexity.ai
export OPENROUTER_API_KEY="<new-openrouter-key>" # From openrouter.ai
```

### Recommended (Set in ~/.zshrc)

```bash
export CAREERCOPILOT_ROOT="/Users/okgoogle13/Desktop/careercopilot"
export CAREERCOPILOT_VENV="${CAREERCOPILOT_ROOT}/.venv"
export CAREERCOPILOT_VENV_BIN="${CAREERCOPILOT_VENV}/bin"
export GITHUB_REPOSITORY="okgoogle13/careercopilot"
```

---

## Files To Review

### Critical

- [ ] `~/.claude/claude_desktop_config.json` - Contains hardcoded GitHub token
- [ ] `/Users/okgoogle13/Desktop/careercopilot/backend/.env` - Contains 3 API keys
- [ ] `/Users/okgoogle13/Desktop/careercopilot/frontend/.env.local` - Contains Supabase key

### Configuration

- [ ] `/Users/okgoogle13/Desktop/careercopilot/mcp_config.json` - Project MCP config
- [ ] `~/.mcp.json` - Orphaned config with broken paths
- [ ] `/Users/okgoogle13/.gemini/antigravity/mcp_config.json` - Gemini-specific config

### Reference

- [ ] `/Users/okgoogle13/Desktop/careercopilot/.env.mcp.example` - Environment template

---

## Test Commands (After Fixes)

```bash
# 1. Verify no hardcoded credentials
grep -r "github_pat_\|AIzaSy\|sk-proj-\|sk-ant-api" ~/.claude ~/.config 2>/dev/null | wc -l
# Should output: 0

# 2. Check file permissions
stat ~/.claude/claude_desktop_config.json | grep Access
# Should show: 0600

# 3. Verify environment variables are used
grep -l "\${GITHUB_TOKEN}\|\${GEMINI_API_KEY}" ~/.claude/claude_desktop_config.json
# Should find the file

# 4. Test Git pre-commit hooks
echo "github_pat_test1234567890" > test.txt
git add test.txt
git commit -m "test" 2>&1 | grep -i secret && echo "✓ Hook working" || echo "✗ Hook failed"
git reset HEAD test.txt && rm test.txt

# 5. Verify all MCP servers accessible
npm list -g @modelcontextprotocol/server-github 2>/dev/null | grep -q "server-github" && echo "✓ GitHub MCP"
```

---

## Estimated Time to Fix

| Phase                            | Tasks                                                                | Time          |
| -------------------------------- | -------------------------------------------------------------------- | ------------- |
| **Critical (TODAY)**             | Revoke token, rotate keys, fix permissions, remove hardcoded secrets | **1-2 hours** |
| **High Priority (This Week)**    | Consolidate configs, fix paths, add validation                       | **2-3 hours** |
| **Medium Priority (This Month)** | Keychain setup, versioning, documentation                            | **3-4 hours** |
| **Total**                        | All fixes                                                            | **6-9 hours** |

---

## Success Criteria

After implementing fixes, verify:

```bash
# ✓ No hardcoded secrets in any config file
grep -r "github_pat_\|AIzaSy\|sk-proj-\|sk-ant-api" ~/.claude ~/Desktop/careercopilot

# ✓ All credentials use ${VAR_NAME} substitution
grep -E "\$\{GITHUB_TOKEN\}|\$\{GEMINI_API_KEY\}" ~/.claude/claude_desktop_config.json

# ✓ File permissions are 0600
stat ~/.claude/claude_desktop_config.json | grep Access | grep -q "0600"

# ✓ All MCP servers defined in one file
jq '.mcpServers | keys | length' ~/.claude/claude_desktop_config.json

# ✓ Flash-Sidekick is in Claude Desktop config
jq '.mcpServers.flash-sidekick' ~/.claude/claude_desktop_config.json | grep -q "python3"

# ✓ No stale/orphaned configs present
ls ~/.mcp.json 2>&1 | grep -q "No such file"

# ✓ Environment variables set
echo "$GITHUB_TOKEN" | grep -q "github_pat_" || echo "$GITHUB_TOKEN" | grep -q "^$"
```

---

## Quick Reference: Key Locations

```
MAIN CLAUDE DESKTOP CONFIG:
~/.claude/claude_desktop_config.json (CURRENT - 3 servers)

PROJECT CONFIGS:
~/Desktop/careercopilot/mcp_config.json (7 servers - CONSOLIDATE)
~/Desktop/careercopilot/.env.mcp.example (Template)

ORPHANED CONFIGS:
~/.mcp.json (14 servers with broken paths - ARCHIVE)
~/.claude/claude_desktop_config.json.backup (Outdated - DELETE)
~/.gemini/antigravity/mcp_config.json (Gemini-specific - REVIEW)

CREDENTIALS:
backend/.env (3 API keys - REMOVE)
frontend/.env.local (1 Supabase key - KEEP IN .local)
System environment variables (4 keys - MOVE TO KEYCHAIN)

SHELL PROFILES:
~/.zshrc, ~/.zshenv, ~/.bashrc, ~/.bash_profile (Check for hardcoded secrets)

SCRIPTS DIRECTORY:
~/scripts/setup-mcp-env.sh (Create)
~/scripts/backup-mcp-config.sh (Create)
~/scripts/setup-keychain-secrets.sh (Create)
```

---

## Support Matrix

| Issue                                   | Solution                                                          | Time  |
| --------------------------------------- | ----------------------------------------------------------------- | ----- |
| "GITHUB_TOKEN not found"                | Set in environment or Keychain                                    | 2 min |
| "ModuleNotFoundError" in Flash-Sidekick | Source venv: `source .venv/bin/activate`                          | 1 min |
| "Playwright server version mismatch"    | Update: `npx -y @playwright/mcp@latest`                           | 2 min |
| "Docker container not found"            | Set ALLOWED_CONTAINERS env var                                    | 3 min |
| "Config file not found"                 | Check path exists: `ls ~/.claude/claude_desktop_config.json`      | 1 min |
| "Permission denied on config"           | Fix permissions: `chmod 600 ~/.claude/claude_desktop_config.json` | 1 min |

---

## Last Checks Before Completing Remediation

```bash
#!/bin/bash
# Final verification script

echo "=== MCP AUDIT REMEDIATION - FINAL VERIFICATION ==="
echo ""

echo "1. Checking for hardcoded credentials..."
CREDS=$(grep -r "github_pat_\|AIzaSy\|sk-proj-\|sk-ant-api\|pplx-" \
  ~/.claude ~/Desktop/careercopilot 2>/dev/null | wc -l)
[ "$CREDS" -eq 0 ] && echo "✓ PASS: No hardcoded credentials found" || \
  echo "✗ FAIL: Found $CREDS credential occurrences"

echo ""
echo "2. Checking file permissions..."
PERMS=$(stat ~/.claude/claude_desktop_config.json 2>/dev/null | grep Access | grep "0600")
[ -n "$PERMS" ] && echo "✓ PASS: Config file has correct permissions (0600)" || \
  echo "✗ FAIL: Config file permissions incorrect"

echo ""
echo "3. Checking for environment variable substitution..."
ENVVARS=$(grep -c "\${GITHUB_TOKEN}\|\${GEMINI_API_KEY}" ~/.claude/claude_desktop_config.json)
[ "$ENVVARS" -gt 0 ] && echo "✓ PASS: Environment variables used in config" || \
  echo "✗ FAIL: Hardcoded values still present"

echo ""
echo "4. Checking MCP server consolidation..."
SERVERS=$(jq '.mcpServers | length' ~/.claude/claude_desktop_config.json)
echo "   Found $SERVERS servers in Claude Desktop config"
[ "$SERVERS" -ge 4 ] && echo "✓ PASS: All essential servers consolidated" || \
  echo "✗ FAIL: Missing servers in main config"

echo ""
echo "5. Checking for orphaned configs..."
ORPHANED=$(ls ~/.mcp.json 2>/dev/null | wc -l)
[ "$ORPHANED" -eq 0 ] && echo "✓ PASS: No orphaned config files" || \
  echo "✗ FAIL: Orphaned config still exists"

echo ""
echo "=== VERIFICATION COMPLETE ==="
```

---

## Next Steps After Remediation

1. **Week 2**: Implement Keychain integration
2. **Week 3**: Setup config versioning with git
3. **Week 4**: Deploy automated secret scanning
4. **Month 2**: Team training and documentation
5. **Ongoing**: Monthly security audits

---

**Quick Reference Created**: January 29, 2026
**For Full Details**: See `MCP_AUDIT_REPORT.md` and `MCP_REMEDIATION_PLAN.md`
**Status**: Ready for immediate action
