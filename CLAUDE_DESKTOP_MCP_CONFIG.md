# Claude Desktop MCP Configuration - Design System Integration

**Last Updated:** 2026-01-29
**Purpose:** Register Design System Sidekick server for kerala-rage kr-solidarity asset workflows

---

## Configuration File Location

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

---

## Complete Configuration

Add the `design-system-sidekick` server to your existing MCP servers configuration:

```json
{
  "mcpServers": {
    "flash-sidekick": {
      "command": "python3",
      "args": ["/Users/okgoogle13/Projects/careercopilot/servers/flash_sidekick.py"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}"
      }
    },
    "design-system-sidekick": {
      "command": "python3",
      "args": ["/Users/okgoogle13/Projects/careercopilot/servers/design_system_sidekick.py"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}"
      }
    },
    "agent-handoff": {
      "command": "python3",
      "args": ["/Users/okgoogle13/Projects/careercopilot/servers/agent_handoff.py"]
    },
    "cloud-ops": {
      "command": "python3",
      "args": ["/Users/okgoogle13/Projects/careercopilot/servers/cloud_ops.py"],
      "env": {
        "GOOGLE_CLOUD_PROJECT": "${GOOGLE_CLOUD_PROJECT}",
        "FIREBASE_PROJECT_ID": "${FIREBASE_PROJECT_ID}"
      }
    },
  },
  "globalShortcut": "Cmd+Shift+Space"
}
```

---

## Environment Variables Required

Ensure these are set in your shell environment before launching Claude Desktop:

```bash
# Required for Gemini-based MCP servers
export GEMINI_API_KEY="your-gemini-api-key"

# Required for cloud-ops server (if used)
export GOOGLE_CLOUD_PROJECT="your-gcp-project-id"
export FIREBASE_PROJECT_ID="your-firebase-project-id"

# Required for GitHub operations (if used)
export GITHUB_PAT="your-github-personal-access-token"
```

Add to `~/.zshrc` or `~/.bashrc` for persistence:

```bash
echo 'export GEMINI_API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

---

## Verification Steps

### 1. Restart Claude Desktop
After updating the configuration file, **completely quit and restart Claude Desktop** (not just close the window—quit from menu or Cmd+Q).

### 2. Verify Server Registration
In a new Claude Desktop conversation, ask:

```
What MCP tools do you have available?
```

You should see tools from `design-system-sidekick`:
- `validate_asset_compliance`
- `generate_implementation_package`
- `extract_visual_design_tokens`
- `compare_generation_attempts`
- `suggest_prompt_refinements`

### 3. Test Basic Functionality
Try a simple test call:

```
Can you list the available design system validation tools and explain what they do?
```

Claude should describe the 5 design system tools with their purposes.

---

## Troubleshooting

### Server Not Appearing

**Check log file:**
```bash
tail -f /tmp/mcp-design-system-sidekick.log
```

**Common issues:**
- Python not in PATH: Use full path to python3 (run `which python3`)
- GEMINI_API_KEY not set: Verify with `echo $GEMINI_API_KEY`
- File permissions: Ensure server script is readable (`chmod +x design_system_sidekick.py`)

### Gemini API Errors

**Rate limiting (429):**
The server has built-in rate limiting (55 RPM) but you may still hit quotas if running multiple servers.

**Invalid API key:**
Verify your key at: https://aistudio.google.com/app/apikey

**Vision API not enabled:**
Some tools use Gemini Vision models. Ensure your API key has vision capabilities enabled.

### Server Crashes on Startup

**Missing dependencies:**
```bash
pip install google-generativeai python-dotenv
```

**ImportError for google.generativeai:**
```bash
# Ensure you're using the right Python environment
python3 -m pip install --upgrade google-generativeai
```

---

## Tool Usage Examples

### Validate DALL-E Output

```
I've generated Asset 1 (kr-solidarity Wallpaper). Can you validate it against kerala-rage compliance criteria?

[Upload image or provide path]
```

Claude will call `validate_asset_compliance` and return:
- Overall score (0-100)
- Dimension breakdowns (translucency, scale, density, colors, typography, Haeckel)
- Critical issues requiring regeneration
- Recommendations for improvement

### Generate Implementation Package

```
Asset 1 is validated at 92/100. Generate the Implementation Package for handover to Gemini.
```

Claude will call `generate_implementation_package` and produce:
- `context.md` (narrative philosophy)
- `tokens.json` (machine-readable specs)
- `usage.md` (CSS implementation guidelines)

### Extract Design Tokens

```
Extract color palette and scale hierarchy from this validated asset.

[Upload image]
```

Claude will call `extract_visual_design_tokens` with vision analysis to identify:
- Hex codes with token matches
- kr-motif size relationships
- Density zone coverage

---

## Integration with Workflow

### Phase 1: Generation (Claude Desktop)
1. Refine DALL-E prompt in Claude Desktop conversation
2. Generate via DALL-E (manual step—no programmatic API yet)
3. Upload result to Claude Desktop

### Phase 2: Validation (Design System Sidekick)
4. Claude calls `validate_asset_compliance` with image
5. Review compliance scorecard
6. If score < 90: Claude calls `suggest_prompt_refinements`
7. Regenerate with improved prompt
8. Repeat until validated

### Phase 3: Packaging (Design System Sidekick)
9. Claude calls `generate_implementation_package`
10. Review generated context.md, tokens.json, usage.md
11. Save package to `/assets/ASSET-X-Implementation-Package/`

### Phase 4: Implementation (Gemini in Antigravity)
12. Hand off Implementation Package to Gemini
13. Gemini integrates assets into component library
14. Gemini updates design tokens and CSS

---

## Performance Characteristics

**Validation (validate_asset_compliance):**
- Engine: Gemini Pro Vision
- Latency: 8-12 seconds (vision analysis + aesthetic reasoning)
- Cost: ~$0.002 per validation

**Packaging (generate_implementation_package):**
- Engine: Gemini Flash (3 parallel calls)
- Latency: 3-5 seconds (structured output generation)
- Cost: ~$0.0003 per package

**Token Extraction (extract_visual_design_tokens):**
- Engine: Gemini Pro Vision
- Latency: 10-15 seconds (detailed analysis per token type)
- Cost: ~$0.003 per extraction

**Prompt Refinements (suggest_prompt_refinements):**
- Engine: Gemini Pro
- Latency: 5-8 seconds (pattern analysis + suggestions)
- Cost: ~$0.001 per refinement

---

## Security Considerations

**API Key Protection:**
- Never commit `claude_desktop_config.json` with hardcoded keys
- Use environment variables (`${GEMINI_API_KEY}`)
- Rotate keys periodically

**Image Data Handling:**
- Images sent to Gemini Vision are processed by Google's servers
- Don't validate assets containing sensitive information
- For proprietary designs, consider self-hosted vision models

**Log File Privacy:**
- Server logs to `/tmp/mcp-design-system-sidekick.log`
- Logs may contain image paths and validation results
- Clear logs periodically: `rm /tmp/mcp-design-system-sidekick.log`

---

## Future Enhancements

**When DALL-E API becomes available:**
- Add `generate_asset_from_prompt` tool
- Implement automatic regeneration loops
- Build prompt optimization feedback cycles

**Advanced Vision Analysis:**
- Color histogram extraction
- Geometric pattern detection
- Translucency depth mapping

**Integration with Agent Handoff:**
- Automatic task publishing after validation
- Gemini auto-claiming packaging tasks
- Full workflow orchestration

---

## Support

**Server logs:**
```bash
tail -100 /tmp/mcp-design-system-sidekick.log
```

**Test server standalone:**
```bash
cd /Users/okgoogle13/Projects/careercopilot/servers
python3 design_system_sidekick.py
# Should start and wait for JSON-RPC input
```

**Gemini API status:**
https://status.cloud.google.com/

**MCP Protocol documentation:**
https://spec.modelcontextprotocol.io/

---

**Configuration Complete**
**Design System Sidekick Ready for kerala-rage kr-solidarity Asset Workflows**
