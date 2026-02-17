# CareerCopilot 🚀

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

CareerCopilot is an AI-powered career management platform designed to automate job extraction, analysis, and application drafting.

## 📄 Overview

- **Frontend**: Vite-based React application with modern UI components.
- **Backend API**: Python FastAPI service for AI analysis and data processing.
- **AI Engine**: Powered by Gemini Pro 2.0 (and Flash) for high-performance job analysis.
- **Infrastructure**: Fully containerized with Docker and modular architecture.

## 📚 Documentation

- **[Full Documentation →](docs/)** — Complete guides and references
- **[Setup Guide](docs/setup/)** — Get started in 5 minutes
- **[Architecture](docs/architecture/)** — Understand the system

## 🚀 Quickstart

Start the entire application with a single command:

```bash
python3 run_copilot.py
```

### Accessing the Platform:
- **Frontend**: [http://localhost:5173/job-queue](http://localhost:5173/job-queue)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Stop the Application:
Press `Ctrl+C` in the terminal.

## 🏗️ Architecture

- **Root**: Workspace management and cross-service orchestration.
- **`backend/`**: FastAPI server, job analysis flows (Genkit), and database logic.
- **`frontend/`**: Vite React app, design system, and user dashboard.
- **`functions/`**: Firebase Cloud Functions for background tasks.
- **`servers/`**: MCP (Model Context Protocol) servers for AI-IDE integration.

## 🔧 MCP Setup

This repository uses a unified MCP configuration for AI-assisted coding.

1. **Configure**: Use the unified config at `.antigravity/mcp.json`.
2. **Deploy**: Run the helper script to sync with Claude Desktop:
   ```bash
   ./scripts/antigravitymcpwrapper.sh deploy
   ```
3. **Validate**: Check your environment:
   ```bash
   ./scripts/antigravitymcpwrapper.sh validate
   ```

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build both frontend and functions |
| `npm run test` | Run frontend test suite |
| `python3 tools/doctor.py` | Run system health check |
| `bash scripts/git-health-check.sh` | Check git repository health |

## 🔍 Troubleshooting

### Git Repository Issues

If you encounter "short read" errors or git corruption:

```bash
# Run comprehensive git health check
bash scripts/git-health-check.sh --verbose

# Attempt automatic repairs
bash scripts/git-health-check.sh --repair
```

See [docs/GIT_HEALTH_CHECK.md](docs/GIT_HEALTH_CHECK.md) for detailed diagnostics and resolution steps.

### Repository Size Issues

If the repository is slow to clone or taking up too much disk space:

```bash
# Analyze repository size
# See docs/REPOSITORY_SIZE_ANALYSIS.md for full report

# Preview cleanup (dry-run)
bash scripts/cleanup-repository-size.sh

# Execute cleanup with backup
bash scripts/cleanup-repository-size.sh --execute
```

**Current working tree size: 1.4GB**
- `frontend/` - 744MB (mostly public/assets/)
- `assets/` - 546MB (uncategorized images)
- Potential savings: ~900MB with cleanup

See [docs/REPOSITORY_SIZE_ANALYSIS.md](docs/REPOSITORY_SIZE_ANALYSIS.md) for detailed analysis and Git LFS migration guide.

---
**Status**: ✅ PRODUCTION READY - v1.0.0
