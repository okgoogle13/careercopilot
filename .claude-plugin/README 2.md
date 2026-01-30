# Career Copilot Plugin

AI-powered career assistant for Claude Code. Generates tailored resumes, cover letters, and KSC responses.

## Installation

```bash
claude plugin install https://github.com/okgoogle13/careercopilot.git
```

Or via marketplace:
```bash
claude plugin marketplace search careercopilot
claude plugin install careercopilot-plugin
```

## Features

- **Resume Generation**: Tailor resumes to job descriptions
- **Cover Letter Creation**: Generate customized cover letters
- **KSC Responses**: Create Key Selection Criteria answers
- **Job Analysis**: Extract requirements from job posts
- **ATS Scoring**: Check resume compatibility
- **Keyword Extraction**: Identify relevant skills

## Configuration

Edit `.vscode/settings.json`:

```json
{
  "claude-code.plugins": {
    "careercopilot-plugin": {
      "enabled": true,
      "apiBaseUrl": "http://localhost:8000",
      "enableGenkit": true
    }
  }
}
```

## Commands

- `Ctrl+Alt+R` (Mac: `Cmd+Alt+R`) - Generate Resume
- `Ctrl+Alt+C` (Mac: `Cmd+Alt+C`) - Generate Cover Letter

Or use Command Palette:
- Career Copilot: Generate Tailored Resume
- Career Copilot: Generate Cover Letter
- Career Copilot: Analyze Job Description
- Career Copilot: Generate KSC Responses
- Career Copilot: Score ATS Compatibility

## Setup

1. Ensure Career Copilot backend is running: `uvicorn backend.app.main:app --reload`
2. Verify API connectivity: `curl http://localhost:8000/health`
3. Load plugin in Claude Code
4. Use commands from VS Code Command Palette

## Troubleshooting

**Plugin not loading:**
```bash
claude plugin validate .claude-plugin/plugin.json
claude plugin debug careercopilot-plugin
```

**API connection issues:**
```bash
# Check backend
curl http://localhost:8000/health

# Verify plugin config
cat .vscode/settings.json | grep claude-code
```

**Reinstall:**
```bash
claude plugin uninstall careercopilot-plugin
claude plugin install https://github.com/okgoogle13/careercopilot.git
```

## Requirements

- Node.js 16+
- Claude Code 1.0+
- Backend API running on `http://localhost:8000`

## License

MIT
