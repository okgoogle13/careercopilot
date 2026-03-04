# MCP Configuration - Single Source of Truth

**Last Updated**: 2026-02-15
**Status**: ✅ Consolidated to Antigravity config

---

## Configuration Location

**Single Source of Truth**:
```
/Users/okgoogle13/.gemini/antigravity/mcp_config.json
```

**Project Symlink** (for convenience):
```
/Users/okgoogle13/Projects/careercopilot/mcp_config.json → ~/.gemini/antigravity/mcp_config.json
```

---

## Why This Consolidation?

Previously, there were **two separate MCP configurations**:

1. ❌ `/Users/okgoogle13/Projects/careercopilot/claude_desktop_config.json` (Claude Desktop)
2. ✅ `/Users/okgoogle13/.gemini/antigravity/mcp_config.json` (Antigravity)

This caused:
- **Configuration drift** (servers registered in one but not the other)
- **Maintenance overhead** (updating two files for every change)
- **Confusion** (which config is active?)

**Solution**: Use Antigravity's `mcp_config.json` as the single source of truth.

---

## Current MCP Servers

All servers are configured in `/Users/okgoogle13/.gemini/antigravity/mcp_config.json`:

### Active Gemini Servers ✅

| Server | Purpose | Engine | Status |
|--------|---------|--------|--------|
| `flash-sidekick` | Token-efficient batch processing | Gemini Flash/Pro | ✅ Active |
| `design-system-sidekick` | Kerala Rage validation | Gemini Pro Vision | ✅ Active |
| `vision-scorer-mcp` | M3 Expressive scoring | Gemini Vision | ✅ Active |

### Active Utility Servers ✅

| Server | Purpose | Status |
|--------|---------|--------|
| `task-router` | Task routing and delegation | ✅ Active |
| `codex` | Autonomous coding with Claude | ✅ Active |
| `github` | GitHub operations (limited tools) | ✅ Active |
| `genkit` | Firebase Genkit flows | ✅ Active |
| `perplexity-ask` | Web research | ✅ Active |
| `supabase-mcp-server` | Supabase operations | ✅ Active |
| `figma-dev-mode-mcp-server` | Figma Dev Mode | ✅ Active |

### Disabled Servers 🔕

| Server | Reason |
|--------|--------|
| `cloud-ops` | Disabled (GCP operations) |
| `playwright` | Disabled (browser automation) |
| `docker` | Disabled (container management) |

---

## How to Update MCP Configuration

**Edit the single source of truth**:
```bash
# Open in editor
code ~/.gemini/antigravity/mcp_config.json

# Or use the project symlink
code /Users/okgoogle13/Projects/careercopilot/mcp_config.json
```

**Restart Antigravity** to apply changes (no restart needed for live config updates in most cases).

---

## Adding a New MCP Server

1. **Edit the config**:
   ```bash
   code ~/.gemini/antigravity/mcp_config.json
   ```

2. **Add server entry**:
   ```json
   {
     "mcpServers": {
       "your-server-name": {
         "command": "/path/to/executable",
         "args": ["arg1", "arg2"],
         "env": {
           "API_KEY": "${API_KEY}"
         }
       }
     }
   }
   ```

3. **Verify**:
   ```bash
   # Check symlink is intact
   ls -la /Users/okgoogle13/Projects/careercopilot/mcp_config.json

   # Validate JSON
   cat ~/.gemini/antigravity/mcp_config.json | python3 -m json.tool
   ```

---

## Backup Files

The old Claude Desktop config has been backed up:
```
/Users/okgoogle13/Projects/careercopilot/claude_desktop_config.json.backup
```

You can safely delete this after verifying the consolidated config works.

---

## Environment Variables

MCP servers use environment variables for sensitive credentials:

```bash
# Required for Gemini servers
export GEMINI_API_KEY="your-key-here"

# Required for GitHub server
export GITHUB_TOKEN="your-token-here"

# Required for Supabase server
export SUPABASE_ACCESS_TOKEN="your-token-here"

# Required for Perplexity server
export PERPLEXITY_API_KEY="your-key-here"
```

Add these to your shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
echo 'export GEMINI_API_KEY="your-key"' >> ~/.zshrc
source ~/.zshrc
```

---

## Troubleshooting

### Server Not Appearing

1. **Check config syntax**:
   ```bash
   cat ~/.gemini/antigravity/mcp_config.json | python3 -m json.tool
   ```

2. **Verify server path**:
   ```bash
   ls -la /Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py
   ```

3. **Check environment variables**:
   ```bash
   echo $GEMINI_API_KEY
   ```

4. **Check server logs**:
   ```bash
   tail -f /tmp/mcp-flash-sidekick.log
   tail -f /tmp/mcp-design-system-sidekick.log
   ```

### Configuration Drift

If you accidentally edit the wrong file:

1. **Always edit the source of truth**:
   ```bash
   code ~/.gemini/antigravity/mcp_config.json
   ```

2. **Verify symlink**:
   ```bash
   ls -la /Users/okgoogle13/Projects/careercopilot/mcp_config.json
   # Should show: mcp_config.json -> /Users/okgoogle13/.gemini/antigravity/mcp_config.json
   ```

---

## Migration Complete ✅

- ✅ Consolidated to single source of truth
- ✅ Created symlink for project access
- ✅ Backed up old config
- ✅ All Gemini servers registered
- ✅ Environment variables documented
- ✅ Troubleshooting guide added

**Next Steps**:
1. Delete backup file after verification: `rm claude_desktop_config.json.backup`
2. Update `.gitignore` to exclude MCP configs (done below)
3. Test MCP servers in Antigravity

---

**Maintained by**: Antigravity
**Configuration File**: `/Users/okgoogle13/.gemini/antigravity/mcp_config.json`
