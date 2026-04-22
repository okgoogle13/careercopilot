# Doc Inventory & Consolidation Plan

**Generated:** 2026-04-22  
**Total markdown files:** 1,308

## Current State

### By Location
- **docs/**: ~400 files (organized subdirectories: api, architecture, workflows, decisions, development, archive, project/active/plans, project/active/handovers)
- **Scattered** (root, backend/, frontend/, tools/, .claude/, .windsurf/, etc.): ~900 files

### By Category (from scattered files)
- **API Docs:** backend/docs, api/*, endpoints/*
- **Architecture:** AGENTS.md, CLAUDE.md, README.md, design system docs
- **UX & Workflows:** UX_PROCESS_MAP.md, WORKFLOW_CATALOG.md, workflow files in tools/
- **Decisions:** DECISIONS.md, GOVERNANCE.md, decision logs
- **Development:** CONTRIBUTING.md, scripts docs, setup guides, CI/CD docs
- **Other:** Archived docs, backups, staging docs, workflow artifacts

## Key Findings

### High-Priority Scattered Docs (Root Level)
- `TASKS.md` — active task board (must stay at root per CLAUDE.md)
- `SPRINT_BRIEF.md` — active sprint context (must stay at root)
- `DECISIONS.md` — decision log (must stay at root per CLAUDE.md governance)
- `SPRINT_LOG.md` — velocity tracking (must stay at root)
- `AGENTS.md` — multi-CLI routing rules (must stay at root)
- `CLAUDE.md` — project instructions (must stay at root)
- `GEMINI.md` — Gemini CLI role (must stay at root)
- `README.md` — project overview (must stay at root)
- `GOVERNANCE.md` — project governance (root candidate for consolidation)
- `WORKFLOW_CATALOG.md` — workflow index (candidate for docs/)

### Medium-Priority Scattered Docs (Backend/Frontend)
- `backend/docs/` — API documentation, database schema docs
- `frontend/docs/` — component docs, design system references
- `tools/ai/prompts/` — AI system prompts (consider docs/ai-prompts/)
- `tools/scripts/` — workflow automation docs (consider docs/workflows/)

### Archive & Backup Docs
- `docs/archive_legacy_reports/` — 2025 legacy reports (keep as-is)
- `tools/scripts/backups/` — stage 2 backup blueprints (archive)
- `.claude/archive/` — historical session reports (keep)

## Consolidation Strategy

**Root-level docs (non-consolidatable):**
```
TASKS.md          ← active task board (CLAUDE.md governance)
SPRINT_BRIEF.md   ← active sprint context
DECISIONS.md      ← decision log (CLAUDE.md governance)
SPRINT_LOG.md     ← velocity tracker
AGENTS.md         ← routing rules
CLAUDE.md         ← project instructions
GEMINI.md         ← Gemini role
README.md         ← project overview
```

**Consolidatable scattered docs:**
```
docs/
├── api/                    ← from backend/docs, tools/api/*, api contracts
├── architecture/           ← system design, AGENTS patterns, CLAUDE rules
├── workflows/              ← WORKFLOW_CATALOG, tools/flows/, ai prompts
├── decisions/              ← governance patterns (move GOVERNANCE.md here)
├── development/            ← CONTRIBUTING, scripts docs, CI/CD
├── ai-prompts/            ← from tools/ai/prompts/ (system, backend, image-gen)
├── automation/            ← workflow automation docs (from tools/scripts/)
├── archive/               ← keep as-is (legacy reports, backups)
└── (existing subdirs)     ← keep project/active/plans, project/active/handovers
```

## Deduplication Notes

### Identified Duplicates
- UX docs: `docs/UX_PROCESS_MAP.md` vs `WORKFLOW_CATALOG.md` sections
- API docs: scattered endpoint docs across backend/tools/api/
- Setup guides: multiple README.md files in frontend/, backend/, scripts/

### Merge Strategy
- `UX_PROCESS_MAP.md` is authoritative (Gemini-generated audit)
- `WORKFLOW_CATALOG.md` is secondary (index, can be archived)
- Backend API docs consolidate to `docs/api/`
- Setup guides: one canonical per area (`docs/development/SETUP_FRONTEND.md`, `SETUP_BACKEND.md`, `SETUP_ENVIRONMENT.md`)

## Migration Checklist

- [ ] Keep root governance docs unchanged (TASKS.md, DECISIONS.md, AGENTS.md, CLAUDE.md, SPRINT_LOG.md, README.md)
- [ ] Move GOVERNANCE.md → docs/governance/GOVERNANCE.md
- [ ] Move WORKFLOW_CATALOG.md → docs/archive/WORKFLOW_CATALOG.md (historical reference)
- [ ] Consolidate backend/docs/* → docs/api/
- [ ] Consolidate frontend/docs/* → docs/frontend-architecture/
- [ ] Consolidate tools/ai/prompts/ → docs/ai-prompts/
- [ ] Consolidate tools/scripts/ docs → docs/automation/
- [ ] Keep tools/scripts/backups/ → docs/archive/backups/ (reference only)
- [ ] Keep .claude/archive/ as-is (historical session reports)
- [ ] Keep docs/archive_legacy_reports/ as-is (2025 reports)

## Expected Outcome

**Before consolidation:** 1,308 scattered files across 15+ locations  
**After consolidation:** 900 scattered files → 400 consolidated in docs/, 500 root-level + archive
**Sync target:** All docs/ files auto-sync to Notion via CI on git push

---

**Next steps:**
1. Run consolidation script (Task 2)
2. Wire CI sync job (Task 3)
3. Verify Notion databases receive synced docs
