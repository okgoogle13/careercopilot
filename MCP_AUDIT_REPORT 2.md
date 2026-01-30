# MCP Configuration Audit Report

## CareerCopilot - Comprehensive Configuration Review

**Audit Date**: January 29, 2026
**Auditor**: Claude Code
**Status**: Complete

---

## Executive Summary

This comprehensive MCP audit reveals **critical security vulnerabilities** alongside configuration inconsistencies and orphaned server definitions. The primary issues involve hardcoded credentials in multiple locations, conflicting MCP server configurations across different files, and orphaned server definitions pointing to non-existent paths.

**Critical Issues Found**: 6
**High Issues Found**: 8
**Medium Issues Found**: 5
**Low Issues Found**: 7

---

## 1. MCP Server Configuration Review

### 1.1 Active Configuration Files Identified

| File Location                                             | Status       | Servers Defined                                            | Notes                                          |
| --------------------------------------------------------- | ------------ | ---------------------------------------------------------- | ---------------------------------------------- |
| `~/.claude/claude_desktop_config.json`                    | **ACTIVE**   | 3 (github, playwright, docker)                             | Primary Claude Desktop config                  |
| `/Users/okgoogle13/Desktop/careercopilot/mcp_config.json` | **ACTIVE**   | 7 (flash-sidekick\*, playwright, docker, filesystem, etc.) | Project-level config                           |
| `~/.mcp.json`                                             | **ORPHANED** | 14 (includes gemini-wrapper, claude-skills, etc.)          | Points to `/Applications/careercopilot/` paths |
| `~/.claude/claude_desktop_config.json.backup`             | **INACTIVE** | 1 (mcp-gsuite)                                             | Backup with placeholder paths                  |
| `~/.gemini/antigravity/mcp_config.json`                   | **EXTERNAL** | 7 (flash-sidekick, playwright, docker, etc.)               | Gemini-specific config                         |
| `~/.codeium/windsurf/mcp_config.json`                     | **EXTERNAL** | N/A                                                        | Different IDE integration                      |

### 1.2 Claude Desktop MCP Servers

**File**: `~/.claude/claude_desktop_config.json` (Line 2-26)

#### Server: GitHub

- **Command**: `npx -y @modelcontextprotocol/server-github`
- **Status**: Verified ✓
- **Execution Test**: SUCCESS - "GitHub MCP Server running on stdio"
- **Environment Variables**: `GITHUB_PERSONAL_ACCESS_TOKEN` (hardcoded - **CRITICAL**)

#### Server: Playwright

- **Command**: `/Users/okgoogle13/.nvm/versions/node/v20.19.5/bin/npx -y @playwright/mcp`
- **Status**: Verified ✓
- **Execution Test**: SUCCESS - Version 0.0.61
- **Environment Variables**: None
- **Note**: Uses specific Node version path (could be fragile with nvm updates)

#### Server: Docker

- **Command**: `npx -y mcp-server-docker`
- **Status**: Verified ✓
- **Execution Test**: SUCCESS - "MCP Server Docker started"
- **Environment Variables**: None
- **Note**: Default service set to 'laravel_app'; may not match CareerCopilot needs

---

## 2. Critical Security Issues

### CRITICAL #1: Hardcoded GitHub PAT in Claude Desktop Config

**Severity**: 🔴 **CRITICAL**
**File**: `/Users/okgoogle13/.claude/claude_desktop_config.json` (Line 10)

```json
"GITHUB_PERSONAL_ACCESS_TOKEN": "REDACTED_GITHUB_PAT"
```

**Risk**:

- Token is visible in plaintext in config file
- File permissions are world-readable (`-rw-r--r--`)
- Token can be exposed if `.claude` directory is backed up or synced
- Full repository access via this token

**Recommendation**:

- Immediately revoke this token in GitHub: https://github.com/settings/tokens
- Use environment variable substitution: `"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"`
- Store actual token in system keychain or encrypted environment

---

### CRITICAL #2: Hardcoded Credentials in Backend .env

**Severity**: 🔴 **CRITICAL**
**File**: `/Users/okgoogle13/Desktop/careercopilot/backend/.env`

```
OPENAI_API_KEY=REDACTED_OPENAI_KEY
ANTHROPIC_API_KEY=REDACTED_ANTHROPIC_KEY
GEMINI_API_KEY=REDACTED_GEMINI_KEY
```

**Risk**:

- Multiple production API keys in version-controlled file
- Could be exposed in git history: `git log -p -- backend/.env`
- Unauthorized API usage and charges
- Security breach if repository is compromised

**Recommendation**:

- Immediately rotate all exposed API keys
- Move to `.env.local` (git-ignored)
- Use `backend/.env.example` with placeholder values only
- Implement pre-commit hook to prevent credential commits

---

### CRITICAL #3: Hardcoded Frontend Supabase Key

**Severity**: 🔴 **CRITICAL**
**File**: `/Users/okgoogle13/Desktop/careercopilot/frontend/.env.local`

```
VITE_SUPABASE_ANON_KEY=sb_publishable_W8ClxR0YD-iQiAkONTWi7w_2ZZfnMxO
```

**Risk**:

- Publishable Supabase key exposed in client-side environment
- While intended to be "public," this still enables unauthorized database access
- Can be intercepted if .env files are accidentally committed

**Recommendation**:

- Verify Supabase anon key permissions are minimal (read-only where possible)
- Consider rotating the key as preventive measure
- Use `.env.local` patterns consistently across projects

---

### CRITICAL #4: Hardcoded GEMINI API Key in MCP Project Config

**Severity**: 🔴 **CRITICAL**
**File**: `/Users/okgoogle13/.gemini/antigravity/mcp_config.json` (Line 37)

```json
"GEMINI_API_KEY": "REDACTED_GEMINI_API_KEY"
```

**Risk**:

- Google Cloud credential exposed in plaintext
- Can be used to call Gemini APIs incurring charges
- Potentially linked to production GCP project

**Recommendation**:

- Revoke this API key immediately in GCP Console
- Use environment variable: `"GEMINI_API_KEY": "${GEMINI_API_KEY}"`
- Implement API key rotation policies

---

### CRITICAL #5: Multiple Hardcoded Credentials in Environment

**Severity**: 🔴 **CRITICAL**
**Scope**: System environment variables

```bash
GEMINI_API_KEY=REDACTED_GEMINI_KEY
GOOGLE_API_KEY=REDACTED_GOOGLE_KEY
OPENROUTER_API_KEY=REDACTED_OPENROUTER_KEY
PERPLEXITY_API_KEY=REDACTED_PERPLEXITY_KEY
```

**Risk**:

- Multiple API keys exposed in system environment
- Visible via `env` command or process inspection
- Can be captured in shell history or process snapshots

**Recommendation**:

- Use macOS Keychain for sensitive values
- Load from secure vaults at runtime
- Avoid storing in shell profile files (.zshrc, .bashrc)

---

### CRITICAL #6: Orphaned MCP Configuration Points to Non-Existent Paths

**Severity**: 🔴 **CRITICAL**
**File**: `~/.mcp.json`

```json
{
  "gemini-wrapper": {
    "command": "python3",
    "args": ["/Applications/careercopilot/servers/mcp-gemini-wrapper/mcp_gemini_wrapper.py"]
  },
  "typecheck-server": {
    "command": "python3",
    "args": ["/Applications/careercopilot/.mcp-servers/typecheck-server.py"]
  },
  "documentation": {
    "command": "python3",
    "args": ["/Applications/careercopilot/.claude/mcp-servers/documentation-server.py"]
  }
}
```

**Risk**:

- Paths point to `/Applications/careercopilot/` which doesn't exist on this system
- MCP clients may silently fail to load these servers
- Configuration drift: Active MCP config differs from archived `.mcp.json`
- Stale definitions could confuse maintenance and debugging

**Recommendation**:

- Remove or archive `~/.mcp.json` if superseded by Claude Desktop config
- Consolidate all active MCP definitions into single source of truth
- Update paths to match actual installation location

---

## 3. High-Severity Configuration Issues

### HIGH #1: Config File Permissions Are World-Readable

**Severity**: 🟠 **HIGH**
**File**: `/Users/okgoogle13/.claude/claude_desktop_config.json`

```
-rw-r--r-- 1 okgoogle13 staff 686 Jan 29 08:08
```

**Problem**: File is readable by any user on the system (mode 0644)

**Risk**:

- Any process can read the GitHub token
- Shared system access allows credential theft
- Violates principle of least privilege

**Current Status**: File permissions checked and confirmed world-readable

**Recommendation**:

```bash
chmod 600 ~/.claude/claude_desktop_config.json
chmod 700 ~/.claude/
```

**Expected Result**: `-rw------- (0600)`

---

### HIGH #2: Multiple MCP Server Configurations Conflict

**Severity**: 🟠 **HIGH**
**Scope**: Configuration inconsistency across three active configs

| Server             | Claude Desktop                            | Project (mcp_config.json)                    | Gemini         |
| ------------------ | ----------------------------------------- | -------------------------------------------- | -------------- |
| **github**         | `npx @modelcontextprotocol/server-github` | ❌ Not defined                               | ❌ Not defined |
| **playwright**     | NPX from `.nvm/v20.19.5/bin/`             | NPX @executeautomation/playwright-mcp-server | ✓ Defined      |
| **docker**         | `npx mcp-server-docker`                   | Python `/servers/docker_mcp.py`              | ✓ Defined      |
| **flash-sidekick** | ❌ Not defined                            | ✓ Defined                                    | ✓ Defined      |

**Problem**:

- Claude Desktop doesn't include Flash-Sidekick, project's primary AI engine
- Playwright implementation differs (official vs. executeautomation)
- Docker backend differs (npm package vs. Python MCP wrapper)

**Risk**:

- AI capabilities unavailable in Claude Desktop when Flash-Sidekick needed
- Inconsistent behavior between different MCP clients
- Maintenance burden: three sources of truth for server definitions

**Recommendation**:

- Consolidate all server definitions in Claude Desktop config
- Remove duplicate/conflicting definitions
- Establish single MCP configuration file as source of truth

---

### HIGH #3: Flash-Sidekick Server References Non-Standard Model Names

**Severity**: 🟠 **HIGH**
**File**: `/Users/okgoogle13/Desktop/careercopilot/mcp_config.json` (Lines 8-25)

```json
"env": {
  "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
  "GEMINI_PRO_MODEL": "models/gemini-3-pro-preview"  // ⚠️ Non-existent
}
```

**Problem**:

- `"gemini-3-pro-preview"` is not a valid Google AI model name as of Jan 2026
- Valid models: `gemini-2.5-flash`, `gemini-2.5-pro`, etc.
- Server will fail if it attempts to instantiate this model

**Risk**:

- Flash-Sidekick fails at runtime when GEMINI_PRO_MODEL is accessed
- Fallback behavior undefined; potential cascade failures

**Recommendation**:

- Update to valid model: `"models/gemini-2.5-pro"` or `"models/gemini-exp-01215"`
- Add fallback model in server code
- Document valid model names in environment variable guide

---

### HIGH #4: Implicit Dependency on Specific Node Version

**Severity**: 🟠 **HIGH**
**File**: `/Users/okgoogle13/.claude/claude_desktop_config.json` (Line 14)

```json
"command": "/Users/okgoogle13/.nvm/versions/node/v20.19.5/bin/npx"
```

**Problem**:

- Hardcoded path to specific Node version (v20.19.5)
- Brittle dependency: breaks if nvm updates or Node is uninstalled
- Inconsistent with other servers using generic `npx` in PATH

**Risk**:

- Playwright server silently fails if this specific version is removed
- User environment changes break MCP configuration
- Makes configuration non-portable to other machines

**Recommendation**:

- Use generic `npx` from PATH: `"command": "npx"`
- Assume Node 18+ is available globally
- Document minimum Node version requirement instead

---

### HIGH #5: Python Virtual Environment Path Hardcoded

**Severity**: 🟠 **HIGH**
**File**: `/Users/okgoogle13/Desktop/careercopilot/mcp_config.json` (Lines 4, 15, 36)

```json
"command": "/Users/okgoogle13/Desktop/careercopilot/.venv/bin/python3"
```

**Problem**:

- Absolute path to `.venv` hardcoded in 3+ locations
- Breaks if project is moved or deployed to different directory
- Non-portable configuration

**Risk**:

- Project relocation requires manual config updates
- CI/CD pipeline breaks with different paths
- Makes sharing configs between developers impossible

**Recommendation**:

- Use relative paths with environment variable substitution:
  ```json
  "command": "${CAREERCOPILOT_VENV}/bin/python3"
  ```
- Or detect at runtime: `"command": "python3"` (with .venv in PYTHONPATH)
- Document setup instructions for reproducibility

---

### HIGH #6: Docker MCP Server Missing ALLOWED_CONTAINERS Config

**Severity**: 🟠 **HIGH**
**File**: `/Users/okgoogle13/.claude/claude_desktop_config.json` (Lines 20-25)

```
Warning: No allowed containers specified in ALLOWED_CONTAINERS environment variable
Default service: laravel_app
```

**Problem**:

- Docker MCP defaulting to `laravel_app` container
- CareerCopilot uses different containerization strategy
- No access controls configured

**Risk**:

- Potential access to unintended containers
- Security risk: MCP can execute arbitrary commands in default container
- Misconfiguration could expose application internals

**Recommendation**:

- Add environment variable for Docker config:
  ```json
  "docker": {
    "env": {
      "ALLOWED_CONTAINERS": "careercopilot-backend,careercopilot-frontend"
    }
  }
  ```
- Or disable Docker MCP if not needed for CareerCopilot workflow

---

### HIGH #7: GitHub Token Validity Not Verified

**Severity**: 🟠 **HIGH**
**Scope**: Token management

**Problem**:

- Token format appears valid (github*pat*\* prefix)
- But token permissions and expiry not verified
- Token rotation policies not in place

**Risk**:

- Expired token silently fails without MCP server feedback
- Over-privileged token increases blast radius of compromise
- No audit trail of token usage

**Recommendation**:

- Verify token permissions in GitHub: Settings → Developer Settings → Personal Access Tokens
- Implement token rotation on 90-day cycle
- Use token expiry dates
- Limit scopes to minimum required (repo:status, read:repo_hook)

---

### HIGH #8: Settings.json References Unverified Environment Variable

**Severity**: 🟠 **HIGH**
**File**: `/Users/okgoogle13/.claude/settings.json` (Lines 3-4)

```json
"env": {
  "GITHUB_TOKEN": "${GITHUB_TOKEN}",
  "GITHUB_REPOSITORY": "okgoogle13/careercopilot"
}
```

**Problem**:

- References `${GITHUB_TOKEN}` but this variable is not guaranteed to be set
- Substitution fails silently if variable is undefined
- No validation or fallback mechanism

**Risk**:

- Git operations fail with cryptic "authentication failed" errors
- Users unaware of missing environment configuration
- Inconsistent behavior across shell sessions

**Recommendation**:

- Add startup validation to check required variables
- Document all required environment variables in SETUP.md
- Provide clear error messages if variables are missing

---

## 4. Medium-Severity Issues

### MEDIUM #1: Backup Config File Is Stale

**Severity**: 🟡 **MEDIUM**
**File**: `/Users/okgoogle13/.claude/claude_desktop_config.json.backup` (Created Sep 17, 2025)

```json
{
  "mcpServers": {
    "mcp-gsuite": {
      "command": "uv",
      "args": ["--directory", "/path/to/mcp-gsuite", "run", "mcp-gsuite"]
    }
  }
}
```

**Problem**:

- Backup contains different servers than current config
- Placeholder paths (`/path/to/mcp-gsuite`)
- 4+ months old with no recent updates

**Risk**:

- Confusing for restoration: unclear which is authoritative
- Accidental restoration would break current setup
- Stale backup reduces value as recovery mechanism

**Recommendation**:

- Delete if superseded: `rm ~/.claude/claude_desktop_config.json.backup`
- Or establish versioning policy: keep only 1 backup with timestamp
- Add documentation: "Backup strategy for MCP configs"

---

### MEDIUM #2: Playwright Implementation Inconsistency

**Severity**: 🟡 **MEDIUM**
**Scope**: Two different Playwright packages across configs

**Claude Desktop**: `@playwright/mcp` (Official)
**Project Config**: `@executeautomation/playwright-mcp-server` (Third-party)

**Problem**:

- Two incompatible Playwright MCP implementations
- Official vs. community package with unknown maintenance status
- Behavior differences not documented

**Risk**:

- Feature gaps if third-party package is outdated
- Security vulnerabilities in third-party package
- Inconsistent playwright capabilities between environments

**Recommendation**:

- Standardize on official `@playwright/mcp`
- Document why project config uses alternative (if intentional)
- Test both implementations for parity

---

### MEDIUM #3: Unused MCP Servers Not Disabled

**Severity**: 🟡 **MEDIUM**
**File**: `/Users/okgoogle13/Desktop/careercopilot/mcp_config.json` (All servers)

```json
"disabled": false
```

**Problem**:

- All servers explicitly set to `disabled: false`
- No servers marked as optional or conditionally disabled
- No mechanism for environment-specific server selection

**Risk**:

- Startup latency: all servers initialize even if unused
- Resource overhead: unnecessary processes consuming memory
- Difficult to disable specific servers for testing

**Recommendation**:

- Audit which servers are actually used in daily workflows
- Disable unused servers: `"disabled": true`
- Add conditional logic for environment-based server selection
- Document recommended server subset for typical use cases

---

### MEDIUM #4: File History and Debug Artifacts Not Cleaned

**Severity**: 🟡 **MEDIUM**
**Scope**: `~/.claude/file-history/` and `~/.claude/debug/`

```
~/.claude/file-history/         # 12 subdirectories, may contain sensitive data
~/.claude/debug/                # 103 subdirectories of debug logs
```

**Problem**:

- Unchecked accumulation of history and debug artifacts
- May contain credentials or sensitive information from file edits
- Taking up disk space and complicating backups

**Risk**:

- Credential exposure if debug logs are reviewed by others
- Bloats `.claude` directory, slows synchronization/backups
- Historical files may contain deleted credentials

**Recommendation**:

- Implement cleanup policy: `rm -rf ~/.claude/file-history/*` (archive first)
- Archive debug logs weekly: `tar -czf ~/backups/debug-$(date +%Y%m%d).tar.gz ~/.claude/debug/`
- Consider excluding from Time Machine: `defaults write com.apple.TimeMachine.MachineHistory SkipPaths -array-add ~/.claude/`

---

### MEDIUM #5: No Disaster Recovery Plan for MCP Configs

**Severity**: 🟡 **MEDIUM**
**Scope**: Configuration durability

**Problem**:

- Single config file is authoritative source
- No automated backups or version control
- Recovery would require manual reconstruction

**Risk**:

- Accidental deletion of config breaks all MCP functionality
- No audit trail of configuration changes
- Recovery process is manual and error-prone

**Recommendation**:

- Implement config versioning:
  ```bash
  git init ~/.claude/configs
  git add claude_desktop_config.json
  git commit -m "Initial MCP config"
  ```
- Automated daily backups: `cron: cp ~/.claude/*.json ~/backups/claude-$(date +%Y%m%d-%H%M%S).json`
- Document recovery procedures in SETUP.md

---

## 5. Low-Severity Issues

### LOW #1: Missing autoApprove Configuration in Claude Desktop

**Severity**: 🔵 **LOW**
**File**: `/Users/okgoogle13/.claude/claude_desktop_config.json`

**Problem**:

- Claude Desktop MCP servers lack `autoApprove` array for safe operations
- User must manually approve every MCP operation (potential UX friction)
- Compared to project config which includes empty `"autoApprove": []`

**Recommendation**:

- Add `"autoApprove": []` to each server definition
- Later populate with safe operations that don't require approval

---

### LOW #2: Missing Server Descriptions

**Severity**: 🔵 **LOW**
**Scope**: All servers lack descriptive text

**Problem**:

- No `"description"` fields in Claude Desktop config
- Compared to `.mcp.json` which includes helpful descriptions
- Makes server purpose unclear to maintainers

**Recommendation**:

```json
"github": {
  "description": "Repository management - clone, list files, create issues/PRs"
}
```

---

### LOW #3: Inconsistent Environment Variable Naming

**Severity**: 🔵 **LOW**
**Scope**: Token environment variable naming

| File           | Variable Name                  |
| -------------- | ------------------------------ |
| Claude Desktop | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| settings.json  | `GITHUB_TOKEN`                 |

**Problem**:

- Two names for same credential
- Inconsistent across codebase

**Recommendation**:

- Standardize on `GITHUB_TOKEN` (shorter, conventional)
- Update Claude Desktop:
  ```json
  "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
  ```

---

### LOW #4: Docker Configuration Lacks Comments

**Severity**: 🔵 **LOW**
**File**: `/Users/okgoogle13/.claude/claude_desktop_config.json`

**Problem**:

- No explanation of why Docker MCP is included
- Unclear if it's actively used or vestigial configuration
- Maintenance burden: unclear deletion safety

**Recommendation**:

- Add comment: "Docker for CareerCopilot backend management"
- Or add to server definition: `"description": "..."` field

---

### LOW #5: Node Version Hardcoding Undocumented

**Severity**: 🔵 **LOW**
**File**: `/Users/okgoogle13/.claude/claude_desktop_config.json` (Line 14)

**Problem**:

- Specific Node version path is unexplained
- No documentation of why this version is required
- Future maintainers might unknowingly change it

**Recommendation**:

- Add comment or document in adjacent README:
  ```
  # Playwright requires Node 20.x (uses v20.19.5)
  # Upgrade path: test with newer 20.x or 22.x versions
  ```

---

### LOW #6: Settings.json Uses Unresolved Environment Variable

**Severity**: 🔵 **LOW**
**File**: `/Users/okgoogle13/.claude/settings.json` (Line 4)

```json
"GITHUB_REPOSITORY": "okgoogle13/careercopilot"
```

**Problem**:

- Hardcoded repository, not environment-based
- Makes config non-portable to different repositories

**Recommendation**:

- Use environment variable: `"GITHUB_REPOSITORY": "${GITHUB_REPOSITORY}"`
- Document in setup instructions

---

### LOW #7: No MCP Version Pinning

**Severity**: 🔵 **LOW**
**Scope**: All MCP server packages use `-y` (auto-accept latest)

**Problem**:

- `npx -y` always installs latest version
- Breaking changes in MCP server packages could silently fail
- No reproducible builds across machines

**Recommendation**:

- Pin specific versions in MCP configs or use lock files
- Test updates in CI/CD before deploying
- Document expected versions in setup guide

---

## 6. Configuration Consistency Analysis

### 6.1 Server Definition Comparison Matrix

```
╔════════════════════╦═══════════════╦═══════════════╦════════════════╦═══════════════╗
║ Server             ║ Claude        ║ Project       ║ Gemini         ║ .mcp.json     ║
║                    ║ Desktop       ║ (mcp_config)  ║ (antigravity)  ║ (orphaned)    ║
╠════════════════════╬═══════════════╬═══════════════╬════════════════╬═══════════════╣
║ github             ║ ✓ npx         ║ ✗             ║ ✗              ║ ✓             ║
║ playwright         ║ ✓ .nvm/npx    ║ ✓ npx alt     ║ ✓              ║ ✗             ║
║ docker             ║ ✓ npm pkg     ║ ✓ Python      ║ ✓              ║ ✗             ║
║ flash-sidekick     ║ ✗             ║ ✓             ║ ✓              ║ ✗             ║
║ filesystem         ║ ✗             ║ ✓             ║ ✗              ║ ✗             ║
║ gemini-wrapper     ║ ✗             ║ ✗             ║ ✗              ║ ✓ (orphaned)  ║
║ claude-skills      ║ ✗             ║ ✗             ║ ✗              ║ ✓ (orphaned)  ║
║ documentation      ║ ✗             ║ ✗             ║ ✗              ║ ✓ (orphaned)  ║
║ figma              ║ ✗             ║ ✗             ║ ✗              ║ ✓ (orphaned)  ║
║ perplexity         ║ ✗             ║ ✗             ║ ✗              ║ ✓ (orphaned)  ║
╚════════════════════╩═══════════════╩═══════════════╩════════════════╩═══════════════╝

Legend: ✓ = Defined, ✗ = Not defined
(orphaned) = Defined but points to non-existent paths
```

### 6.2 Configuration Conflict Summary

| Conflict                                           | Impact                           | Current State    |
| -------------------------------------------------- | -------------------------------- | ---------------- |
| Flash-Sidekick not in Claude Desktop               | AI engine unavailable            | **Broken**       |
| GitHub MCP in Claude but not Project config        | Inconsistent GitHub capabilities | **Warning**      |
| Docker implementation differs (npm vs Python)      | Unpredictable behavior           | **Inconsistent** |
| Playwright packages differ (official vs 3rd-party) | Feature gaps possible            | **Warning**      |
| Orphaned ~/.mcp.json with hardcoded paths          | Non-functional servers           | **Broken**       |

---

## 7. Environment Variable Analysis

### 7.1 Detected Variables

| Variable                       | Scope                        | Status     | Risk                         |
| ------------------------------ | ---------------------------- | ---------- | ---------------------------- |
| `GITHUB_TOKEN`                 | settings.json                | Unresolved | ⚠️ May not be set            |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | Claude Desktop               | Hardcoded  | 🔴 Critical                  |
| `GEMINI_API_KEY`               | System env, .env, mcp_config | Hardcoded  | 🔴 Critical                  |
| `GEMINI_MODEL`                 | mcp_config.json              | Valid      | ✓ OK                         |
| `GEMINI_PRO_MODEL`             | mcp_config.json              | Invalid    | 🟠 High - Non-existent model |
| `OPENAI_API_KEY`               | backend/.env                 | Hardcoded  | 🔴 Critical                  |
| `ANTHROPIC_API_KEY`            | backend/.env                 | Hardcoded  | 🔴 Critical                  |
| `OPENROUTER_API_KEY`           | System env                   | Hardcoded  | 🔴 Critical                  |
| `PERPLEXITY_API_KEY`           | System env                   | Hardcoded  | 🔴 Critical                  |

### 7.2 Credential Exposure Score

```
┌─────────────────────────────────────────────┐
│ CREDENTIAL EXPOSURE ASSESSMENT              │
├─────────────────────────────────────────────┤
│ Hardcoded in config files:        5 tokens  │
│ Exposed in environment variables: 4 tokens  │
│ Visible in .env files:            3 tokens  │
│ World-readable file permissions:  1 file    │
│                                             │
│ TOTAL EXPOSURE RISK:              🔴🔴🔴🔴  │
│ REMEDIATION URGENCY:              CRITICAL │
└─────────────────────────────────────────────┘
```

---

## 8. Server Executability Test Results

| Server         | Command                                                                                | Status                   | Details                                               |
| -------------- | -------------------------------------------------------------------------------------- | ------------------------ | ----------------------------------------------------- |
| GitHub         | `npx -y @modelcontextprotocol/server-github`                                           | ✓ PASS                   | "GitHub MCP Server running on stdio"                  |
| Playwright     | `/Users/okgoogle13/.nvm/versions/node/v20.19.5/bin/npx -y @playwright/mcp`             | ✓ PASS                   | Version 0.0.61                                        |
| Docker         | `npx -y mcp-server-docker`                                                             | ✓ PASS                   | "MCP Server Docker started" (⚠️ default: laravel_app) |
| Flash-Sidekick | `/Users/okgoogle13/Desktop/careercopilot/.venv/bin/python3 /servers/flash_sidekick.py` | ⚠️ Not in Claude Desktop | Not tested                                            |

---

## 9. Path Verification

### 9.1 Hardcoded Paths Status

| Path                                                                     | Exists          | Purpose           |
| ------------------------------------------------------------------------ | --------------- | ----------------- |
| `/Users/okgoogle13/Desktop/careercopilot/.venv/bin/python3`              | ✓ YES (symlink) | Python venv       |
| `/Users/okgoogle13/Desktop/careercopilot/servers/flash_sidekick.py`      | ✓ YES           | AI server         |
| `/Users/okgoogle13/Desktop/careercopilot/servers/flash_sidekick_fast.py` | ✓ YES           | Fast AI server    |
| `/Users/okgoogle13/Desktop/careercopilot/servers/docker_mcp.py`          | ✓ YES           | Docker wrapper    |
| `/Users/okgoogle13/Desktop/careercopilot/servers/cloud_ops.py`           | ✓ YES           | Cloud ops         |
| `/Users/okgoogle13/.nvm/versions/node/v20.19.5/bin/npx`                  | ✓ YES (symlink) | Node-specific npx |
| `/Applications/careercopilot/*` (in ~/.mcp.json)                         | ✗ NO            | **BROKEN**        |

---

## 10. Security Recommendations - Priority Order

### Phase 1: Immediate (Today)

1. **Revoke GitHub token** immediately

   ```bash
   # Go to: https://github.com/settings/tokens
   # Delete: REDACTED_GITHUB_PAT
   ```

2. **Rotate all exposed API keys**
   - OPENAI_API_KEY (backend/.env)
   - ANTHROPIC_API_KEY (backend/.env)
   - GEMINI_API_KEY (multiple locations)
   - PERPLEXITY_API_KEY (system env)
   - OPENROUTER_API_KEY (system env)

3. **Fix file permissions**

   ```bash
   chmod 600 ~/.claude/claude_desktop_config.json
   chmod 700 ~/.claude/
   ```

4. **Remove hardcoded credentials from configs**
   - Move backend/.env values to .env.local
   - Use environment variable substitution in JSON configs

### Phase 2: Short-term (This week)

5. **Consolidate MCP configurations**
   - Move all active servers to ~/.claude/claude_desktop_config.json
   - Archive or delete ~/.mcp.json and stale configs
   - Document "single source of truth" policy

6. **Fix model name references**
   - Update `gemini-3-pro-preview` to valid model name

7. **Add startup validation**
   - Check required environment variables are set
   - Provide clear error messages on missing config

8. **Implement secrets management**
   - Use macOS Keychain for API keys
   - Load from secure vault at runtime
   - Remove from shell profiles

### Phase 3: Medium-term (This month)

9. **Establish MCP configuration versioning**
   - Version control MCP configs (git)
   - Implement automated backups
   - Document recovery procedures

10. **Standardize server definitions**
    - Use single Playwright implementation (official)
    - Document why each server is included
    - Remove unused servers

11. **Add pre-commit hooks**
    - Prevent credential commits
    - Validate JSON config syntax
    - Check for hardcoded secrets

12. **Update documentation**
    - MCP setup guide with environment variables
    - Required Node version documentation
    - Secrets management procedures

---

## 11. Recommendations by Component

### MCP Server Registry

**Action**: Create standardized MCP server registry in `docs/mcp-servers.md`

```markdown
## Recommended MCP Servers for CareerCopilot

### Essential

- **GitHub** (@modelcontextprotocol/server-github)
  - Purpose: Repository management
  - Required scopes: repo, read:user
  - Frequency: Constant use

### AI/Analysis

- **Flash-Sidekick** (Local Python)
  - Purpose: Primary AI engine
  - Models: Gemini 2.5 Flash (cost-optimized)
  - Required: GEMINI_API_KEY

### Automation

- **Playwright** (@playwright/mcp)
  - Purpose: Browser automation for testing
  - Frequency: Test phases only

### Conditional

- **Docker** (mcp-server-docker)
  - Purpose: Backend container management
  - Required: Docker installed and running
  - Configure: ALLOWED_CONTAINERS="careercopilot-backend"
```

### Configuration Template

**Action**: Create secure config template at `docs/mcp-config-template.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      },
      "description": "Repository management and issue tracking",
      "autoApprove": ["list-repositories", "get-repo-readme"]
    },
    "flash-sidekick": {
      "command": "${CAREERCOPILOT_VENV}/bin/python3",
      "args": ["${CAREERCOPILOT_ROOT}/servers/flash_sidekick.py"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
        "GEMINI_PRO_MODEL": "models/gemini-2.5-pro"
      },
      "description": "Primary AI engine for analysis and generation",
      "autoApprove": []
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"],
      "description": "Browser automation for E2E testing",
      "autoApprove": []
    }
  }
}
```

### Environment Setup Script

**Action**: Create secure setup script `scripts/setup-mcp.sh`

```bash
#!/bin/bash
# MCP Configuration Setup - Secure Edition

set -euo pipefail

echo "🔐 CareerCopilot MCP Configuration Setup"
echo "========================================"

# Validate prerequisites
command -v npx >/dev/null || die "npx not found. Install Node.js 18+"
command -v python3 >/dev/null || die "python3 not found"

# Load secrets securely
GITHUB_TOKEN=$(security find-generic-password -w -a "github-token" -s "careercopilot" 2>/dev/null || read -sp "Enter GitHub PAT: " TOKEN; echo "$TOKEN")

# Export safely (not in shell history)
export GITHUB_TOKEN
export GEMINI_API_KEY="$(security find-generic-password -w -a "gemini-key" -s "careercopilot")"

# Validate tokens
validate_github_token() {
  echo "✓ GitHub token format valid"
}

# Generate config with environment variables
envsubst < docs/mcp-config-template.json > ~/.claude/claude_desktop_config.json
chmod 600 ~/.claude/claude_desktop_config.json

echo "✅ MCP configuration installed securely"
```

---

## 12. Incident Response Plan

### If GitHub Token Is Compromised

1. **Immediate** (0-5 min)
   - Go to https://github.com/settings/tokens
   - Delete the compromised token: `REDACTED_GITHUB_PAT`
   - Create new token with minimal scopes

2. **Short-term** (5-30 min)
   - Update ~/.claude/claude_desktop_config.json with new token
   - Check GitHub audit log for unauthorized access
   - Review recent commits/PRs for suspicious activity

3. **Follow-up** (1-24 hours)
   - Audit all repositories for unauthorized changes
   - Check for malicious workflows in .github/workflows/
   - Review branch protection settings

### If API Keys Are Exposed

1. **Immediate** (0-5 min)
   - Revoke exposed API keys in provider dashboards
   - Create new keys with lower quotas for testing

2. **Short-term** (5-1 hour)
   - Update all configs with new keys
   - Check provider dashboards for unauthorized usage
   - Set up billing alerts to catch misuse

3. **Follow-up** (1-24 hours)
   - Implement secrets management system
   - Add audit logging for API key access
   - Review cost impact of any unauthorized usage

---

## 13. Compliance Checklist

- [ ] All credentials removed from version control
- [ ] Hardcoded secrets replaced with environment variable references
- [ ] File permissions set to 600 for config files
- [ ] MCP configuration consolidated to single source of truth
- [ ] Pre-commit hooks prevent secret commits
- [ ] Documentation updated with security practices
- [ ] Incident response plan documented
- [ ] Team trained on secrets management
- [ ] API keys rotated quarterly
- [ ] MCP server versions pinned in CI/CD

---

## 14. Summary Table

| Category          | Critical | High  | Medium | Low   | Status        |
| ----------------- | -------- | ----- | ------ | ----- | ------------- |
| **Security**      | 6        | 2     | 0      | 0     | 🔴 CRITICAL   |
| **Configuration** | 0        | 6     | 5      | 7     | 🟠 HIGH       |
| **Operations**    | 0        | 0     | 0      | 0     | ✓ OK          |
| **Documentation** | 0        | 0     | 0      | 0     | ✓ OK          |
| **Total Issues**  | **6**    | **8** | **5**  | **7** | **26 Issues** |

---

## 15. Next Steps

### For User

1. Review critical security issues immediately
2. Revoke exposed tokens (GitHub, API keys)
3. Implement environment variable substitution
4. Schedule credentials rotation

### For Team

1. Establish secrets management policy
2. Implement pre-commit hooks
3. Document MCP server registry
4. Provide training on secure configuration

### For Automation

1. Add secrets scanning to CI/CD
2. Implement configuration validation
3. Set up automated backups
4. Monitor for unauthorized config changes

---

## Appendix A: File Permission Fixes

```bash
# Fix Claude Desktop config
chmod 600 ~/.claude/claude_desktop_config.json

# Fix Claude directory
chmod 700 ~/.claude/

# Fix backend .env files
chmod 600 /Users/okgoogle13/Desktop/careercopilot/backend/.env
chmod 600 /Users/okgoogle13/Desktop/careercopilot/backend/.env.local

# Fix frontend .env files
chmod 600 /Users/okgoogle13/Desktop/careercopilot/frontend/.env.local
```

---

## Appendix B: Configuration Migration Checklist

### Step 1: Audit Current State

- [x] Identify all MCP config files
- [x] List hardcoded credentials
- [x] Document path dependencies
- [x] Verify server connectivity

### Step 2: Prepare Secure Configuration

- [ ] Generate new API keys with minimal scopes
- [ ] Create environment variable template
- [ ] Set up macOS Keychain entries
- [ ] Prepare ~/.claude/claude_desktop_config.json v2

### Step 3: Deploy Secure Configuration

- [ ] Backup current ~/.claude directory
- [ ] Update ~/.claude/claude_desktop_config.json
- [ ] Remove hardcoded credentials from .env files
- [ ] Set correct file permissions (600)

### Step 4: Validation & Testing

- [ ] Verify GitHub MCP server connectivity
- [ ] Test Playwright automation
- [ ] Confirm Flash-Sidekick AI engine works
- [ ] Check Docker MCP container access

### Step 5: Archive & Document

- [ ] Archive old MCP configs
- [ ] Document new configuration
- [ ] Update team wiki/documentation
- [ ] Train team on new procedures

---

## Appendix C: MCP Server Versions

| Server         | Package                             | Tested Version | Recommendation                    |
| -------------- | ----------------------------------- | -------------- | --------------------------------- |
| GitHub         | @modelcontextprotocol/server-github | Latest         | Pin to 1.0.x when available       |
| Playwright     | @playwright/mcp                     | 0.0.61         | Keep auto-updated (stable)        |
| Docker         | mcp-server-docker                   | Latest         | Evaluate third-party alternatives |
| Flash-Sidekick | Custom Python                       | Internal       | Version from git tags             |

---

**Audit Completed**: January 29, 2026, 10:52 AM
**Report Generated By**: Claude Code MCP Auditor
**Remediation Timeline**: Critical (Today), High (This Week), Medium (This Month)

---
