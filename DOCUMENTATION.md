# Documentation Map

Quick reference for which doc to read based on your task.

## 📚 Documentation Files

### `README.md`
**For**: First-time visitors, project overview, getting started
**Contains**: Problem statement, features, quick start, live demo, contributing guide
**Length**: ~500 lines, 10-15 min read

### `CLAUDE.md`
**For**: Claude Code (Claude Agent) specific instructions
**Contains**: Tech stack, file patterns, response guidelines, quick commands, MCP routing
**Length**: ~100 lines, 5 min read
**Note**: Anthropic-specific; ignore if using other AI tools

### `agents.md` ⭐ START HERE FOR AI AGENTS
**For**: GitHub Copilot, OpenAI Codex, Claude Code, any AI coding agent
**Contains**: Quick commands, project structure, code standards, boundaries, testing, security
**Length**: ~550 lines, 15-20 min read
**Key sections**:
- Quick Commands (copy-paste ready)
- Standards & Patterns (do/don't)
- Git Workflow & Safety Boundaries (three-tier system)
- Code Style & Conventions (language-specific)

### `PLANS.md` ⭐ ARCHITECTURE & DECISION MAKING
**For**: Developers implementing features, understanding design choices, roadmap
**Contains**: System architecture, data models, API design, AI patterns, roadmap, decision log
**Length**: ~700 lines, 20-30 min read
**Key sections**:
- Architecture Overview (system layers)
- Core Data Models (TypeScript interfaces)
- API Design Principles
- AI Agent Design Patterns (Genkit template)
- Performance & Scalability targets
- Known Constraints & Gotchas

### `DOCUMENTATION.md` (this file)
**For**: Navigating all documentation
**Contains**: File map, task-based routing, FAQ
**Length**: ~100 lines, 5 min read

---

## 🎯 Task-Based Routing

### "I'm new to this project"
1. Read `README.md` (5 min)
2. Run `./scripts/setup-everything.sh`
3. Skim `agents.md` Quick Commands section
4. Read `PLANS.md` Architecture Overview

### "I'm an AI agent (GitHub Copilot, Claude, Codex, etc.)"
1. Read `agents.md` completely (your primary guide)
2. Reference `PLANS.md` for architecture questions
3. Check `CLAUDE.md` if you're Claude-based

### "I'm adding a new feature"
1. Check `PLANS.md` roadmap (is it planned?)
2. Read `PLANS.md` architecture section (where does it fit?)
3. Review `PLANS.md` AI Agent Design Patterns (if using Genkit)
4. Read `agents.md` Code Style & Conventions
5. Follow PR Checklist in `agents.md`

### "I'm debugging a problem"
1. Check `PLANS.md` Known Constraints & Gotchas
2. Check `PLANS.md` Debugging & Troubleshooting Guide
3. Review error message against `agents.md` Security Gotchas
4. Check `README.md` Troubleshooting section

### "I'm setting up CI/CD or deployment"
1. Read `README.md` Deployment Workflow section
2. Reference `agents.md` Deployment commands
3. Check `PLANS.md` Performance & Scalability (if performance issues)

### "I'm reviewing a PR"
1. Check `agents.md` PR Checklist
2. Check `PLANS.md` Review Checklist for Maintainers
3. Cross-reference changes against `PLANS.md` architecture

### "I'm writing a Genkit flow or API endpoint"
1. Read `PLANS.md` API Design Principles
2. Study `PLANS.md` Genkit Flow Template
3. Check `agents.md` API Contracts for examples
4. Follow error handling pattern from `PLANS.md`

### "I'm deploying to production"
1. Run `./scripts/test-deployment.sh` (pre-flight checks)
2. Review `agents.md` "Before Submitting PR" section
3. Check `README.md` Environment URLs
4. Follow `PLANS.md` Roadmap to ensure feature is approved

---

## 📋 Decision Matrix: Which Doc Has What?

| Question | Where to Find |
|----------|----------------|
| How do I run tests? | `agents.md` Quick Commands |
| What's the system architecture? | `PLANS.md` Architecture Overview |
| How do I write a Genkit flow? | `PLANS.md` AI Agent Design Patterns |
| What are the API contracts? | `agents.md` API Contracts section |
| How do I handle authentication? | `PLANS.md` Security Architecture |
| What are performance targets? | `PLANS.md` Performance & Scalability |
| How do I commit code? | `agents.md` Code Style & Conventions |
| What boundaries must I respect? | `agents.md` Git Workflow & Safety Boundaries |
| What's the product roadmap? | `PLANS.md` Roadmap & Future Enhancements |
| Why did we choose X over Y? | `PLANS.md` Decision Log |
| What are common gotchas? | `PLANS.md` Known Constraints & Gotchas |
| How do I debug Firestore issues? | `PLANS.md` Debugging & Troubleshooting Guide |
| What's the design system? | `agents.md` Standards & Patterns (kerala-rage) |
| How do I structure components? | `agents.md` Code Examples + `PLANS.md` Data Models |

---

## 🚀 Quick Command Reference

### Most Common Commands
```bash
# Start development servers
cd frontend && yarn dev        # Frontend :5173
uvicorn backend.app.main:app --reload  # Backend :8000

# Run tests
cd frontend && yarn test
cd backend && pytest

# Format & lint
cd frontend && yarn lint:fix
cd backend && ruff check --fix backend/

# Pre-flight deployment check
./scripts/test-deployment.sh

# Deploy
./scripts/deploy.sh staging
./scripts/deploy.sh production
```

See `agents.md` Quick Commands for full reference.

---

## ❓ FAQ

### Q: Where do I report bugs?
**A**: Create an issue on GitHub. Include: reproduction steps, expected vs actual, environment (node version, python version, etc.)

### Q: Can I modify .gitignore to allow secrets?
**A**: **No.** This is explicitly forbidden in `agents.md` "Never" section. Use environment variables and `.env.local`.

### Q: Should I use Gemini 1.5 Flash or Pro?
**A**: Default to Flash (cheaper, faster). Use Pro only for complex reasoning or multi-step workflows. See `PLANS.md` Model Selection Strategy.

### Q: How do I test a Genkit flow locally?
**A**: Run `ENABLE_GENKIT_FLOWS=true pytest backend/app/tests/agents/ -v`. See `agents.md` Backend AI Agents commands.

### Q: What's the difference between agents.md and PLANS.md?
**A**:
- `agents.md` = conventions, code standards, boundaries (what you must do)
- `PLANS.md` = architecture, design decisions, roadmap (why we built it this way)

### Q: Can I skip the pre-commit hook?
**A**: Strongly discouraged. If absolutely necessary: `git commit --no-verify`, but you must ensure no secrets are committed.

### Q: Where are API keys stored?
**A**: Development: `.env.local` (git-ignored). Production: Google Cloud Secret Manager.

### Q: How do I access the Firebase emulator?
**A**: Run `firebase emulators:start`. Then set `FIREBASE_EMULATOR_HOST=localhost:8080` in `.env.local`.

### Q: What's the kerala-rage kr-solidarity design system?
**A**: Custom design system with [DEPRECATED_STYLE] aesthetic (Australian palette, kerala-streetprint craftsmanship). See `agents.md` Standards & Patterns and `design-system/tokens.json`.

### Q: Can I use Redux instead of Zustand?
**A**: No. Zustand is the standard. It's simpler and sufficient for our needs. See `PLANS.md` Decision Log for rationale.

---

## 📞 Getting Help

### Code Questions
- Check relevant doc section first
- Search GitHub issues for similar problems
- Ask in pull request comments with context
- Mention: environment (OS, Node version, Python version, browser), exact error, reproduction steps

### Architecture Questions
- Read `PLANS.md` thoroughly first
- Check `PLANS.md` Decision Log (why we chose this)
- Ask in GitHub discussions (public, searchable)

### Onboarding Questions
- Read `README.md` Getting Started section
- Run `./scripts/setup-everything.sh`
- Check `agents.md` quick commands
- Ask team members in Slack/Discord

---

## 🔄 Keeping Docs Updated

When you:
- **Make a design decision**: Add to `PLANS.md` Decision Log
- **Hit a constraint**: Document in `PLANS.md` Known Constraints
- **Hit a bug**: Document in `PLANS.md` Debugging Guide
- **Complete a feature**: Update `PLANS.md` roadmap
- **Change API contracts**: Update `agents.md` API Contracts section
- **Add new command**: Add to `agents.md` Quick Commands
- **Change code style**: Update `agents.md` Code Style & Conventions

---

## 📖 Reading Priority

**Minimum viable reading**:
1. `README.md` (overview, setup)
2. `agents.md` (commands, standards, boundaries)

**Recommended for feature development**:
1. + `PLANS.md` (architecture, patterns, roadmap)

**Comprehensive (ideal for maintainers)**:
1. All above + `CLAUDE.md` (if using Claude agents)
2. All project .md files + source code

---

**Last updated**: 2026-01-30
**Maintainers**: Career Copilot team
**Contributing**: PRs to docs welcome! Update the decision log and keep this map current.
