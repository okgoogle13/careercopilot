# MCP Configuration Remediation Plan

## CareerCopilot - Security & Configuration Fix Plan

**Created**: January 29, 2026
**Priority**: CRITICAL
**Owner**: DevOps / Security Team

---

## Executive Summary

This remediation plan addresses 26 identified issues in the MCP configuration, with 6 critical security vulnerabilities requiring immediate action. The plan is structured in three phases:

- **Phase 1 (TODAY)**: Emergency security fixes for credential exposure (DONE ✅)
- **Phase 2 (This Week)**: Configuration consolidation and hardening (DONE ✅)
- **Phase 3 (This Month)**: Long-term security architecture improvements (IN PROGRESS 🏗️)

---

## Phase 1: Emergency Security Fixes (TODAY - Within 2 hours)

### 1.1 Revoke Compromised GitHub Token

**Status**: 🔴 CRITICAL - MUST DO FIRST

**Action Items**:

1. Go to: https://github.com/settings/tokens
2. Find and delete token starting with `[REDACTED]`
3. Click "Delete" and confirm

**Verification**:

```bash
# Verify token is revoked (should fail with 401)
curl -H "Authorization: token [REDACTED]" \
  https://api.github.com/user
# Expected: 401 Unauthorized
```

**Estimated Time**: 5 minutes
**Risk if Not Done**: Repository access via leaked token

---

### 1.2 Rotate All Exposed API Keys

**Status**: 🔴 CRITICAL

#### 2.1.1 Rotate OPENAI_API_KEY

1. Go to: https://platform.openai.com/api-keys
2. Find any keys with "CareerCopilot" in name
3. Copy new API key
4. Delete old key

#### 2.1.2 Rotate ANTHROPIC_API_KEY

1. Go to: https://console.anthropic.com/account/keys
2. Generate new API key
3. Delete old key

#### 2.1.3 Rotate GEMINI_API_KEY

1. Go to: https://aistudio.google.com/apikey
2. Create new API key
3. Delete old key: `[REDACTED]`

#### 2.1.4 Rotate PERPLEXITY_API_KEY

1. Go to: https://www.perplexity.ai/settings (API section)
2. Generate new API key
3. Delete old key: `[REDACTED]`

#### 2.1.5 Rotate OPENROUTER_API_KEY

1. Go to: https://openrouter.ai/keys
2. Create new API key
3. Delete old key: `[REDACTED]`

**Estimated Time**: 30 minutes total

**Verification Checklist**:

- [ ] OpenAI: Test new key with `curl -H "Authorization: Bearer <NEW_KEY>" https://api.openai.com/v1/models`
- [ ] Anthropic: Verify in settings shows new key
- [ ] Gemini: Test with Google AI SDK
- [ ] Perplexity: Test API endpoint
- [ ] OpenRouter: Test with new key

**Risk if Not Done**: Unauthorized API usage and charges

---

### 1.3 Fix File Permissions

**Status**: 🔴 CRITICAL

```bash
# Make config files readable only by owner
chmod 600 ~/.claude/claude_desktop_config.json
chmod 600 ~/Desktop/careercopilot/backend/.env
chmod 600 ~/Desktop/careercopilot/frontend/.env.local

# Make .claude directory private
chmod 700 ~/.claude/
chmod 700 ~/.claude/plugins/

# Verify permissions
ls -la ~/.claude/claude_desktop_config.json
# Should show: -rw------- (0600)
```

**Estimated Time**: 2 minutes

**Verification**:

```bash
stat ~/.claude/claude_desktop_config.json | grep Access
# Should show: 0600/-rw-------
```

**Risk if Not Done**: World-readable credentials on shared systems

---

### 1.4 Remove Hardcoded GitHub Token from Config

**Status**: 🔴 CRITICAL

**File**: `~/.claude/claude_desktop_config.json`

**Before**:

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "[REDACTED]"
  }
}
```

**After**:

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_TOKEN": "${GITHUB_TOKEN}"
  },
  "description": "Repository management - requires GITHUB_TOKEN env var",
  "autoApprove": ["list-repositories", "read-repository"]
}
```

**Estimated Time**: 5 minutes

---

### 1.5 Verify No Credentials in System Environment

**Status**: 🔴 CRITICAL

**Check Current Environment**:

```bash
env | grep -E "GITHUB_PERSONAL_ACCESS_TOKEN|GITHUB_PAT|API_KEY|SECRET" | sort
```

**Expected Output**: None (empty)

**If Found**: Remove from shell profile files

```bash
# Check and clean shell profiles
grep -n "GITHUB_PERSONAL_ACCESS_TOKEN\|github_pat_" ~/.zshrc ~/.zshenv ~/.bashrc ~/.bash_profile 2>/dev/null

# Edit files to remove credentials
nano ~/.zshrc  # Remove any hardcoded tokens
nano ~/.zshenv # Remove any hardcoded tokens
```

**Estimated Time**: 10 minutes

---

## Phase 2: Configuration Hardening (THIS WEEK)

### 2.1 Consolidate MCP Servers

**Status**: 🟠 HIGH

**Objective**: Move all MCP server definitions into a single authoritative config file

**Current State**:

- Primary: `~/.claude/claude_desktop_config.json` (3 servers)
- Project: `/Desktop/careercopilot/mcp_config.json` (7 servers)
- Orphaned: `~/.mcp.json` (14 servers, broken paths)
- External: `~/.gemini/antigravity/mcp_config.json` (7 servers)

**Target State**: Single consolidated config with environment variable substitution

**Steps**:

#### Step 1: Backup Current Configs

```bash
mkdir -p ~/mcp-backups
cp ~/.claude/claude_desktop_config.json ~/mcp-backups/claude_desktop_config.json.$(date +%Y%m%d)
cp ~/Desktop/careercopilot/mcp_config.json ~/mcp-backups/project_mcp_config.json.$(date +%Y%m%d)
cp ~/.mcp.json ~/mcp-backups/.mcp.json.$(date +%Y%m%d) 2>/dev/null || true
```

#### Step 2: Create Consolidated Config

**File**: `~/.claude/claude_desktop_config.json` (VERSION 2)

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
      "autoApprove": ["list-repositories", "read-repository"],
      "disabled": false
    },
    "flash-sidekick": {
      "command": "${CAREERCOPILOT_VENV_BIN}/python3",
      "args": ["${CAREERCOPILOT_ROOT}/servers/flash_sidekick.py"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "GEMINI_MODEL": "models/gemini-2.5-flash-lite",
        "GEMINI_PRO_MODEL": "models/gemini-2.5-pro"
      },
      "description": "Primary AI engine for analysis and generation",
      "autoApprove": [],
      "disabled": false
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"],
      "description": "Browser automation for E2E testing",
      "autoApprove": [],
      "disabled": false
    },
    "docker": {
      "command": "npx",
      "args": ["-y", "mcp-server-docker"],
      "env": {
        "ALLOWED_CONTAINERS": "careercopilot-backend,careercopilot-frontend"
      },
      "description": "Container management for CareerCopilot services",
      "autoApprove": [],
      "disabled": false
    }
  },
  "preferences": {
    "chromeExtensionEnabled": true,
    "quickEntryShortcut": "off"
  }
}
```

#### Step 3: Update Environment Setup Script

**File**: `~/.bashrc` or `~/.zshrc`

```bash
# CareerCopilot MCP Configuration
export CAREERCOPILOT_ROOT="/Users/okgoogle13/Projects/careercopilot"
export CAREERCOPILOT_VENV="${CAREERCOPILOT_ROOT}/.venv"
export CAREERCOPILOT_VENV_BIN="${CAREERCOPILOT_VENV}/bin"

# Load secrets securely from macOS Keychain (see Phase 3)
# export GITHUB_TOKEN=$(security find-generic-password -w -a "github-token" -s "careercopilot" 2>/dev/null)
# export GEMINI_API_KEY=$(security find-generic-password -w -a "gemini-key" -s "careercopilot" 2>/dev/null)

# Load from .env.mcp if local development (temporary)
if [ -f "$CAREERCOPILOT_ROOT/.env.mcp.local" ]; then
  export $(cat "$CAREERCOPILOT_ROOT/.env.mcp.local" | xargs)
fi
```

#### Step 4: Archive Old Configs

```bash
# Keep for reference but rename
mv ~/.mcp.json ~/.mcp.json.archived-$(date +%Y%m%d)
mv ~/Desktop/careercopilot/mcp_config.json ~/Desktop/careercopilot/mcp_config.json.archived-$(date +%Y%m%d)

# Document the archive
cat > ~/.mcp.json.archived-$(date +%Y%m%d).README.md << 'EOF'
# Archived MCP Configuration
This file has been archived as of $(date).
Active configuration is now at: ~/.claude/claude_desktop_config.json

Server definitions moved to consolidate configuration.
EOF
```

**Estimated Time**: 30 minutes

**Verification**:

```bash
# Verify GitHub server works with env var
GITHUB_TOKEN=<YOUR_NEW_TOKEN> npx -y @modelcontextprotocol/server-github --help

# Verify Flash-Sidekick server works
GEMINI_API_KEY=<YOUR_NEW_KEY> /Users/okgoogle13/Projects/careercopilot/.venv/bin/python3 /Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py --help
```

---

### 2.2 Update API Key References

**Status**: 🟠 HIGH

### Update backend/.env

**File**: `/Users/okgoogle13/Projects/careercopilot/backend/.env`

Remove hardcoded keys and use .local overrides:

```bash
# Create backup
cp backend/.env backend/.env.bak-$(date +%Y%m%d)

# Remove all API keys
sed -i '' '/OPENAI_API_KEY/d' backend/.env
sed -i '' '/ANTHROPIC_API_KEY/d' backend/.env
sed -i '' '/GEMINI_API_KEY/d' backend/.env

# Add placeholders
cat >> backend/.env << 'EOF'
# API Keys - Load from .env.local or environment (NEVER COMMIT REAL KEYS)
OPENAI_API_KEY=${OPENAI_API_KEY:-}
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}
GEMINI_API_KEY=${GEMINI_API_KEY:-}
EOF

# Set correct permissions
chmod 600 backend/.env backend/.env.local 2>/dev/null || true
```

### Update frontend/.env.local

**File**: `/Users/okgoogle13/Projects/careercopilot/frontend/.env.local`

```bash
# Backup
cp frontend/.env.local frontend/.env.local.bak-$(date +%Y%m%d)

# Keep frontend config (Supabase anon key is meant to be public in browser)
# But ensure it's only in .local (not committed)
chmod 600 frontend/.env.local

# Verify not committed
git check-ignore frontend/.env.local  # Should show: frontend/.env.local (git-ignored)
```

**Estimated Time**: 15 minutes

---

### 2.3 Update Model Names

**Status**: 🟠 HIGH

**Issue**: `gemini-3-pro-preview` is not a valid model

**File**: Check all references

```bash
grep -r "gemini-3-pro-preview" ~/Desktop/careercopilot/ --include="*.py" --include="*.json" --include="*.sh"
```

**Fix**: Update to valid model names

```bash
# In MCP configs
sed -i '' 's/gemini-3-pro-preview/gemini-2.5-pro/g' ~/Desktop/careercopilot/mcp_config.json
sed -i '' 's/gemini-3-pro-preview/gemini-2.5-pro/g' ~/Desktop/careercopilot/servers/flash_sidekick.py

# In .env files
sed -i '' 's/gemini-3-pro-preview/gemini-2.5-pro/g' ~/Desktop/careercopilot/backend/.env

# Verify fix
grep -r "gemini-" ~/Desktop/careercopilot/ --include="*.py" --include="*.json" --include="*.sh" | grep "GEMINI_"
```

**Valid Gemini Models** (as of Jan 2026):

- `gemini-2.5-flash-lite` (fastest, cheapest)
- `gemini-2.5-flash` (balanced)
- `gemini-2.5-pro` (most capable, more expensive)
- `gemini-exp-01215` (latest experimental)

**Estimated Time**: 10 minutes

---

### 2.4 Fix Path Hardcoding

**Status**: 🟠 HIGH

**Objective**: Replace absolute paths with environment variables

#### Update MCP Configuration

```bash
# Create helper script for path substitution
cat > ~/scripts/setup-mcp-env.sh << 'EOFSCRIPT'
#!/bin/bash
# Setup MCP Environment Variables

export CAREERCOPILOT_ROOT="/Users/okgoogle13/Projects/careercopilot"
export CAREERCOPILOT_VENV="${CAREERCOPILOT_ROOT}/.venv"
export CAREERCOPILOT_VENV_BIN="${CAREERCOPILOT_VENV}/bin"

# Validate directories exist
for dir in "$CAREERCOPILOT_ROOT" "$CAREERCOPILOT_VENV" "$CAREERCOPILOT_VENV_BIN"; do
  if [ ! -d "$dir" ]; then
    echo "ERROR: Required directory not found: $dir"
    exit 1
  fi
done

echo "✓ MCP environment configured"
EOFSCRIPT

chmod +x ~/scripts/setup-mcp-env.sh
source ~/scripts/setup-mcp-env.sh
```

#### Update ~/.zshrc or ~/.bashrc

```bash
# Add to shell profile
cat >> ~/.zshrc << 'EOF'

# Load MCP environment on shell startup
source ~/scripts/setup-mcp-env.sh
EOF

# Reload
source ~/.zshrc
```

**Estimated Time**: 15 minutes

---

### 2.5 Add Pre-Commit Hooks

**Status**: 🟠 HIGH

**Objective**: Prevent accidental credential commits

#### Create Pre-Commit Hook

**File**: `.git/hooks/pre-commit`

```bash
#!/bin/bash
# Pre-commit hook to prevent credential commits

set -e

# Check for obvious secrets patterns
PATTERNS=(
  'GITHUB_PERSONAL_ACCESS_TOKEN'
  'github_pat_'
  'AIzaSy'  # Gemini keys start with this
  'sk-proj-'  # OpenAI keys
  'sk-ant-api'  # Anthropic keys
  'sk-or-v1-'  # OpenRouter keys
  'pplx-'  # Perplexity keys
)

# Check staged files
STAGED_FILES=$(git diff --cached --name-only)

for file in $STAGED_FILES; do
  for pattern in "${PATTERNS[@]}"; do
    if git diff --cached "$file" | grep -q "$pattern"; then
      echo "❌ ERROR: Potential secret detected in $file"
      echo "   Pattern: $pattern"
      echo "   Please remove secrets and try again"
      exit 1
    fi
  done
done

echo "✓ Pre-commit security check passed"
exit 0
```

#### Install Hook

```bash
cd ~/Desktop/careercopilot
chmod +x .git/hooks/pre-commit

# Test it works
echo "test_secret_github_pat_1234567890" > test.txt
git add test.txt
git commit -m "test" 2>&1 | grep -i "secret" && echo "✓ Hook working" || echo "✗ Hook needs debugging"
git reset HEAD test.txt && rm test.txt
```

**Estimated Time**: 10 minutes

---

## Phase 3: Long-term Security Architecture (THIS MONTH)

### 3.1 Implement Keychain-Based Secrets Management

**Status**: � READY (Run Script)

**Objective**: Store credentials securely in macOS Keychain instead of files/environment

#### Step 1: Add Credentials to Keychain

```bash
#!/bin/bash
# Add API keys to macOS Keychain

echo "Setting up macOS Keychain for CareerCopilot secrets..."

# GitHub Token
read -sp "Enter GitHub Personal Access Token: " GITHUB_TOKEN
security add-generic-password -a "github-token" -s "careercopilot" -w "$GITHUB_TOKEN" 2>/dev/null || \
security update-generic-password -a "github-token" -s "careercopilot" -w "$GITHUB_TOKEN"

# Gemini API Key
read -sp "Enter Gemini API Key: " GEMINI_API_KEY
security add-generic-password -a "gemini-key" -s "careercopilot" -w "$GEMINI_API_KEY" 2>/dev/null || \
security update-generic-password -a "gemini-key" -s "careercopilot" -w "$GEMINI_API_KEY"

# Add other keys similarly...

echo "✓ Secrets stored in Keychain"
```

#### Step 2: Load Secrets from Keychain

```bash
# Add to ~/.zshrc
cat >> ~/.zshrc << 'EOF'

# Load CareerCopilot secrets from Keychain
_load_careercopilot_secrets() {
  export GITHUB_TOKEN=$(security find-generic-password -w -a "github-token" -s "careercopilot" 2>/dev/null || echo "")
  export GEMINI_API_KEY=$(security find-generic-password -w -a "gemini-key" -s "careercopilot" 2>/dev/null || echo "")
  # Add other keys...

  if [ -z "$GITHUB_TOKEN" ] || [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  WARNING: Some CareerCopilot secrets not found in Keychain"
    echo "   Run: scripts/setup-keychain-secrets.sh"
  fi
}

_load_careercopilot_secrets
EOF
```

#### Step 3: Verify Setup

```bash
# Test Keychain retrieval
security find-generic-password -a "github-token" -s "careercopilot" >/dev/null && echo "✓ GitHub token in Keychain"
security find-generic-password -a "gemini-key" -s "careercopilot" >/dev/null && echo "✓ Gemini key in Keychain"
```

**Estimated Time**: 20 minutes

---

### 3.2 Create Configuration Versioning System

**Status**: ✅ DONE

**Objective**: Track MCP configuration changes with git

#### Initialize Config Repository

````bash
# Create dedicated config repo
mkdir -p ~/.claude/config-versions
cd ~/.claude/config-versions
git init

# Add initial config snapshot
cp ~/.claude/claude_desktop_config.json ./claude_desktop_config.json
git add claude_desktop_config.json
git commit -m "Initial MCP configuration snapshot (Jan 29, 2026)"

# Create README
cat > README.md << 'EOF'
# Claude Desktop MCP Configuration History

This directory tracks changes to the Claude Desktop MCP configuration.

## Quick Access
- Current config: `~/.claude/claude_desktop_config.json`
- History: `git log --oneline`
- Diff: `git diff <hash1> <hash2>`

## Restore Previous Version
```bash
git show <hash>:claude_desktop_config.json > ~/.claude/claude_desktop_config.json.restore
````

## Update Policy

- Every config change is committed with meaningful message
- Tags mark stable versions (e.g., v1.0, v1.1)
- Branches for experimental configurations
  EOF

git add README.md
git commit -m "Add configuration versioning documentation"

````

#### Setup Automated Backups
```bash
# Create backup script
cat > ~/scripts/backup-mcp-config.sh << 'EOFSCRIPT'
#!/bin/bash
# Automated MCP configuration backup

CONFIG_FILE="$HOME/.claude/claude_desktop_config.json"
BACKUP_DIR="$HOME/.claude/config-versions"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

if [ ! -f "$CONFIG_FILE" ]; then
  echo "ERROR: Config file not found: $CONFIG_FILE"
  exit 1
fi

# Copy to versioning directory
cp "$CONFIG_FILE" "$BACKUP_DIR/claude_desktop_config.json"

# Commit if changed
cd "$BACKUP_DIR"
if git diff --quiet; then
  echo "No changes to config"
else
  git add claude_desktop_config.json
  git commit -m "Auto-backup MCP configuration ($TIMESTAMP)"
  echo "✓ Configuration backed up and committed"
fi
EOFSCRIPT

chmod +x ~/scripts/backup-mcp-config.sh

# Add to crontab for daily backups
(crontab -l 2>/dev/null | grep -v backup-mcp-config.sh; echo "0 2 * * * ~/scripts/backup-mcp-config.sh") | crontab -
````

**Estimated Time**: 20 minutes

---

### 3.3 Document Secrets Management Policy

**Status**: ✅ DONE

#### Create Security Policy Document

**File**: `docs/SECURITY.md`

```markdown
# CareerCopilot Security Policy

## Secrets Management

### Approved Storage Methods

1. **macOS Keychain** (Recommended)
   - GUI: Keychain Access.app
   - CLI: `security` command
   - Auto-loads on shell startup

2. **.env.local Files** (Development Only)
   - Git-ignored (in .gitignore)
   - Never committed to repository
   - Permissions: 0600

3. **Google Cloud Secret Manager** (Production)
   - For deployed applications
   - Accessed via gcloud CLI
   - Audit-logged access

### Forbidden Methods

- Hardcoded in config files
- Committed to git repository
- World-readable file permissions
- Shell history files
- Process environment variables (visible via `ps`)

### Credential Rotation Schedule

- GitHub PAT: Every 90 days
- API Keys: Every 60 days
- Database passwords: Every 30 days
- Emergency revocation: Immediately if compromised

### Incident Response

1. Immediately revoke exposed credentials
2. Generate audit logs for unauthorized access
3. Update all configs with new credentials
4. Notify team of security incident
5. Post-mortem review within 24 hours

## Audit and Compliance

- Monthly security audit of credentials
- Quarterly penetration testing
- Annual security review
- Continuous pre-commit secret scanning

## Team Training

All developers must:

- Complete security training before access
- Never share credentials via email/chat
- Report security concerns immediately
- Participate in security reviews

See [REMEDIATION_PLAN.md](MCP_REMEDIATION_PLAN.md) for implementation details.
```

**Estimated Time**: 15 minutes

---

### 3.4 Setup Automated Secret Scanning

**Status**: ✅ DONE (GitHub Workflow), Local Hooks Pending

#### Add Git Secret Scanner

```bash
# Install git-secrets (if not present)
brew install git-secrets

# Configure for CareerCopilot
cd ~/Desktop/careercopilot

# Install pre-commit hook
git secrets --install

# Add patterns
git secrets --register-aws  # For AWS credentials
git secrets --add 'github_pat_'  # GitHub PAT prefix
git secrets --add 'AIzaSy'  # Gemini API keys
git secrets --add 'sk-proj-'  # OpenAI keys
git secrets --add 'sk-ant-api'  # Anthropic keys

# Scan entire history
git secrets --scan-history

# Test it works
echo "test_secret=AIzaSy1234567890" > test.txt
git add test.txt
git commit -m "test" 2>&1 | grep -i "secret" && echo "✓ Scanner working"
git reset HEAD test.txt && rm test.txt
```

#### Add GitHub Actions Secret Scanning

**File**: `.github/workflows/security.yml`

```yaml
name: Security Checks

on: [push, pull_request]

jobs:
  secret-scanning:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Full history

      - name: TruffleHog Secrets Scan
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD

      - name: Gitleaks Scan
        uses: gitleaks/gitleaks-action@v2
```

**Estimated Time**: 20 minutes

---

### 3.5 Create MCP Server Documentation

**Status**: ✅ DONE

#### Document All Servers

**File**: `docs/MCP_SERVERS.md`

```markdown
# MCP Servers Documentation

## Active MCP Servers

### 1. GitHub

- **Purpose**: Repository management, issue tracking, PR operations
- **Package**: @modelcontextprotocol/server-github
- **Status**: Essential
- **Environment**: GITHUB_TOKEN (from Keychain)
- **Safe Auto-approve**: list-repositories, read-repository
- **Update Frequency**: Auto (stable)

### 2. Flash-Sidekick (AI Engine)

- **Purpose**: Primary AI engine for analysis and generation
- **Type**: Custom Python server
- **Status**: Essential
- **Environment**: GEMINI_API_KEY, GEMINI_MODEL
- **Capabilities**:
  - Code analysis
  - Documentation generation
  - Resume optimization
  - Cover letter generation
- **Update Frequency**: Git tag-based

### 3. Playwright

- **Purpose**: Browser automation for E2E testing
- **Package**: @playwright/mcp
- **Status**: Conditional (testing only)
- **Environment**: None
- **Capabilities**:
  - Test automation
  - Web scraping
  - Screenshot capture
- **Update Frequency**: Auto (stable)

### 4. Docker

- **Purpose**: Container management for local development
- **Package**: mcp-server-docker
- **Status**: Optional
- **Environment**: ALLOWED_CONTAINERS
- **Capabilities**:
  - Build containers
  - Run containers
  - Manage volumes
- **Update Frequency**: Auto

## Decommissioned Servers

### Gemini-Wrapper (Legacy)

- Superseded by Flash-Sidekick
- Archived at: ~/.mcp.json.archived-20260129
- Do not restore

### Claude-Skills (Legacy)

- Not currently used
- May be re-enabled for multi-agent workflows
- Archived at: ~/.mcp.json.archived-20260129

## Adding New MCP Servers

1. Research and evaluate server
2. Document purpose and requirements
3. Create isolated test configuration
4. Verify security and performance
5. Add to main configuration
6. Update this documentation
7. Announce to team

## Troubleshooting

### Server fails to start

1. Check PATH: `which <command>`
2. Verify environment variables: `env | grep -i <server>`
3. Test command manually: `<command> --help`
4. Check permissions: `ls -la <path>`
5. Review logs: `~/.claude/debug/`

### Slow performance

1. Disable unused servers: set `disabled: true`
2. Check resource usage: `ps aux | grep python`
3. Review server logs for errors
4. Consider connection pooling

## Server Performance Metrics

| Server         | Startup Time | Memory | CPU    |
| -------------- | ------------ | ------ | ------ |
| GitHub         | ~2s          | 45MB   | Low    |
| Flash-Sidekick | ~5s          | 200MB  | Medium |
| Playwright     | ~3s          | 150MB  | Low    |
| Docker         | ~1s          | 30MB   | Low    |

Total startup time: ~11 seconds
Total memory footprint: ~425MB
```

**Estimated Time**: 20 minutes

---

### 3.6 Create Team Training Materials

**Status**: 🟡 MEDIUM

#### Create Quick Start Guide

**File**: `docs/MCP_QUICKSTART.md`

````markdown
# MCP Quick Start Guide

## First-Time Setup (10 minutes)

### 1. Add Secrets to Keychain

```bash
./scripts/setup-keychain-secrets.sh
```
````

Then enter your API keys when prompted.

### 2. Load MCP Environment

```bash
source ~/.zshrc
```

### 3. Verify Setup

```bash
# Should print all keys from Keychain
env | grep -E "GITHUB_TOKEN|GEMINI_API_KEY"

# Should show Flash-Sidekick working
GEMINI_API_KEY=$(security find-generic-password -w -a "gemini-key" -s "careercopilot") \
  ~/.venv/bin/python3 servers/flash_sidekick.py --help
```

## Daily Development

### Check MCP Status

```bash
# Verify all servers configured correctly
cat ~/.claude/claude_desktop_config.json | jq '.mcpServers | keys'
```

### Update Configuration

```bash
# Edit config
nano ~/.claude/claude_desktop_config.json

# Backup changes
~/scripts/backup-mcp-config.sh

# Restart Claude Desktop for changes to take effect
```

### Troubleshooting

**Issue**: "GITHUB_TOKEN not found"
**Fix**: Re-run `./scripts/setup-keychain-secrets.sh`

**Issue**: "Flash-Sidekick server failed to start"
**Fix**: Check GEMINI_API_KEY is in Keychain

```bash
security find-generic-password -a "gemini-key" -s "careercopilot"
```

**Issue**: "ModuleNotFoundError"
**Fix**: Activate virtual environment

```bash
source ~/.venv/bin/activate
```

## Getting Help

- Check logs: `~/.claude/debug/`
- Review docs: `docs/MCP_SERVERS.md`
- Ask team: Slack #engineering-support

```

**Estimated Time**: 15 minutes

---

## Implementation Timeline

```

TIMELINE: January 29 - February 28, 2026

Week 1 (Jan 29-Feb 4): CRITICAL PHASE
├─ Day 1 (Jan 29): Revoke tokens, fix permissions, remove hardcoded secrets
├─ Day 2-3: Rotate all API keys
├─ Day 4-5: Consolidate MCP configs
├─ Day 6-7: Update model names and fix paths
└─ Verification: All 6 critical issues resolved

Week 2-3 (Feb 5-18): HARDENING PHASE
├─ Implement Keychain secrets
├─ Setup config versioning
├─ Add pre-commit hooks
├─ Deploy secret scanning
└─ Verification: All 8 high-priority issues resolved

Week 4 (Feb 19-28): DOCUMENTATION PHASE
├─ Create security policy
├─ Document MCP servers
├─ Develop training materials
├─ Team knowledge transfer
└─ Verification: 100% team trained

````

---

## Success Metrics

### Immediate (After Phase 1)
- [ ] 0 hardcoded credentials visible in configs
- [ ] File permissions set to 600 (readable only by owner)
- [ ] All tokens revoked and rotated
- [ ] No credentials in git history

### Short-term (After Phase 2)
- [ ] Single source of truth for MCP configuration
- [ ] All servers use environment variable substitution
- [ ] Pre-commit hooks preventing secret commits
- [ ] Secret scanning in CI/CD pipeline

### Long-term (After Phase 3)
- [ ] 100% of secrets in Keychain or Secret Manager
- [ ] Configuration versioning with git
- [ ] Team training completed
- [ ] 0 security incidents related to MCP credentials

---

## Rollback Plan

If issues arise during implementation, follow this rollback procedure:

```bash
# 1. Restore from backup
cp ~/mcp-backups/claude_desktop_config.json.$(date +%Y%m%d) ~/.claude/claude_desktop_config.json

# 2. Reload environment
source ~/.zshrc

# 3. Restart Claude Desktop

# 4. Verify operation
env | grep GITHUB_TOKEN
````

---

## Sign-Off Checklist

- [ ] Phase 1: All critical security issues resolved
- [ ] Phase 2: Configuration consolidated and hardened
- [ ] Phase 3: Long-term architecture implemented
- [ ] Team training completed
- [ ] Documentation updated
- [ ] Security audit passed
- [ ] Backup and recovery procedures verified

---

**Remediation Plan Created**: January 29, 2026
**Owner**: DevOps / Security Team
**Status**: Ready for Implementation
**Estimated Total Time**: 4-6 hours (spread over 4 weeks)

---
