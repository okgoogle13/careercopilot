# MCP Server Configuration for Playwright Integration

## 🎯 Recommended MCP Servers for Your Project

Based on your CareerCopilot project with extensive Playwright E2E testing, here are the recommended MCP server configurations.

---

## 1. Playwright MCP Server ⭐⭐⭐ (ESSENTIAL)

### Purpose
- Debug E2E test failures
- Visual test report management
- Screenshot and video capture analysis
- Trace viewer integration

### Configuration

**File:** `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    }
  }
}
```

### Installation
```bash
# The server will auto-install when first accessed via MCP
# No manual installation needed
```

### Benefits for Your Project
✅ Debug failing smoke tests
✅ Analyze test traces from your 4 running Playwright processes
✅ Screenshot comparison for UI regression
✅ Video playback of test failures
✅ Integration with `playwright-report` directory

---

## 2. GitHub MCP Server ⭐⭐ (HIGHLY RECOMMENDED)

### Purpose
- Monitor CI/CD workflows
- View GitHub Actions test results
- Manage issues for failing tests
- PR check status

### Configuration

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Setup GitHub Token
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `workflow`, `read:org`
4. Copy token and add to config above

### Benefits
✅ Monitor your `.github/workflows` CI status
✅ View test reports from GitHub Actions
✅ Create issues from failing E2E tests
✅ Track deployment status

---

## 3. Git MCP Server ⭐ (USEFUL)

### Purpose
- Track test file changes
- Blame analysis for test failures
- Commit history for test snapshots

### Configuration

```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git"
      ]
    }
  }
}
```

### Benefits
✅ See who last modified failing tests
✅ Track test file history
✅ Correlate code changes with test failures

---

## 4. Filesystem MCP Server (Already Active)

This should already be active in your setup. It provides:
- File read/write operations
- Directory navigation
- Test file management

---

## 📋 Complete MCP Configuration File

Merge all servers into one configuration file:

**File:** `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {
        "PLAYWRIGHT_BROWSERS_PATH": "0"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    }
  }
}
```

---

## 🚀 Quick Start

### Step 1: Create/Edit MCP Config
```bash
mkdir -p ~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings
code ~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

### Step 2: Add Configuration
Copy the "Complete MCP Configuration File" above into the file.

### Step 3: Set GitHub Token (Optional but Recommended)
```bash
# Add to ~/.zshrc or ~/.bashrc
export GITHUB_TOKEN="your_github_personal_access_token_here"
```

### Step 4: Restart VS Code / Cursor
The MCP servers will initialize on next session.

---

## 🧪 Testing Your MCP Setup

Once configured, you can use MCP-powered commands like:

### Playwright MCP Examples:
```
"Show me the last Playwright test run results"
"Analyze the screenshots from the smoke-test.spec.ts failure"
"Display the trace from the authentication flow test"
```

### GitHub MCP Examples:
```
"What's the status of the latest CI run?"
"Show me failing tests from the last GitHub Actions run"
"Create an issue for the dashboard test failure"
```

### Git MCP Examples:
```
"Who last modified the smoke-test.spec.ts file?"
"Show me the commit history for the E2E tests"
"What changed in the login test recently?"
```

---

## 🔧 Playwright-Specific Configuration

### Running Playwright Tests with MCP Integration

Your current test commands:
```bash
# Smoke tests
cd frontend && yarn playwright test tests/e2e/smoke-test.spec.ts --project=chromium

# All tests
cd frontend && yarn playwright test --project=chromium

# With UI mode (recommended for debugging)
cd frontend && yarn playwright test --ui
```

### Playwright Report Location
After tests run, reports are generated at:
```
frontend/playwright-report/
```

The Playwright MCP server can automatically access these reports for analysis.

---

## 📊 Expected Benefits

| Feature | Without MCP | With MCP |
|---------|------------|----------|
| Test Debugging | Manual log review | AI-assisted trace analysis |
| Screenshot Review | Manual file browsing | AI-powered comparison |
| CI Monitoring | Switch to GitHub web | Query CI status via chat |
| Test History | Git blame manually | AI-powered history search |
| Issue Creation | Manual issue writing | Auto-generated from failures |

---

## 🆘 Troubleshooting

### MCP Server Not Loading
1. Check file path is correct
2. Verify JSON syntax is valid
3. Restart VS Code/Cursor completely
4. Check terminal output for MCP errors

### Playwright MCP Issues
```bash
# Ensure Playwright is installed in your project
npm list @playwright/test

# Reinstall if needed
npm install -D @playwright/test@latest
```

### GitHub MCP Authentication
```bash
# Test your GitHub token
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user

# Should return your GitHub user info
```

---

---

**Generated:** 2026-01-06
**Updated:** 2026-04-10
**Project:** CareerCopilot Frontend
**Status:** Configuration Ready ✅
