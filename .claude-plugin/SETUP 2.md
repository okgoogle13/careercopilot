# Claude Code Plugin Setup

## Configuration Complete ✓

Your Career Copilot project has been configured for Claude Code plugin integration.

### Files Created

- `.claude-plugin/plugin.json` - Plugin metadata and capabilities
- `.claude-plugin/marketplace.json` - Marketplace configuration
- `.claude-plugin/README.md` - Plugin documentation
- `.claude-plugin/validate-manifest.js` - Configuration validator
- `.vscode/settings.json` - Updated with Claude Code settings

### VS Code Settings Updated

Added Claude Code plugin configuration:
```json
"claude-code.plugins": {
  "careercopilot-plugin": {
    "enabled": true,
    "autoLoad": true,
    "apiBaseUrl": "http://localhost:8000",
    "enableGenkit": true
  }
}
```

### Installation

Via HTTPS (recommended - no SSH key needed):
```bash
claude plugin install https://github.com/okgoogle13/careercopilot.git
```

Or via marketplace:
```bash
claude plugin marketplace add severity1/severity1-marketplace
claude plugin install careercopilot-plugin
```

### Verification

```bash
# Validate configuration
node .claude-plugin/validate-manifest.js

# List installed plugins
claude plugin list

# Check plugin info
claude plugin info careercopilot-plugin
```

### Quick Start

1. Ensure backend is running:
   ```bash
   source venv/bin/activate
   uvicorn backend.app.main:app --reload
   ```

2. Start frontend (optional):
   ```bash
   cd frontend && yarn dev
   ```

3. Commands available in Claude Code:
   - **Ctrl+Alt+R** (Cmd+Alt+R on Mac) - Generate Resume
   - **Ctrl+Alt+C** (Cmd+Alt+C on Mac) - Generate Cover Letter
   - **Command Palette** - All Career Copilot commands

### Troubleshooting

**Plugin not recognized:**
```bash
claude plugin validate .claude-plugin/plugin.json
claude plugin debug careercopilot-plugin
```

**API connection error:**
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check VS Code settings
grep -A 5 "careercopilot-plugin" .vscode/settings.json
```

**Reload plugin:**
```bash
claude plugin uninstall careercopilot-plugin
claude plugin install https://github.com/okgoogle13/careercopilot.git
```

### Next Steps

- Implement plugin entry point in `src/plugin.ts`
- Add command handlers for AI features
- Test with backend API
- Build and bundle for distribution
- Submit to marketplace (optional)
