# Active Skills Inventory

**Last Updated:** 2025-12-29  
**Total Active Skills:** 25 directories (26 including _legacy_archive)  
**Legacy Archived:** 4 skills

---

## Quick Reference

### By Category

| Category | Count | Status |
|----------|-------|--------|
| **Backend Development** | 4 | ✅ Active |
| **Frontend Development** | 3 | ✅ Active |
| **Integration & Analysis** | 3 | ✅ Active |
| **Test Scaffolders** | 3 | ✅ Active |
| **Design Skills** | 1 dir (7 files) | ✅ Active |
| **Utility/Reference** | 3 | ✅ Active |
| **Needs Review** | 4 | ⚠️ Verify usage |
| **Outdated (Needs Update)** | 4 | ⚠️ Update paths |
| **Legacy Archive** | 4 | ❌ Deprecated |

---

## Active Skills (Confirmed Valuable)

### Backend Development ✅

1. **pydantic-model-scaffolder**
   - Generates Pydantic validation models
   - Status: Active, Current
   - Related: fastapi-endpoint-scaffolder (Workflow)

2. **pytest-test-scaffolder**
   - Generates pytest unit tests for backend
   - Status: Active, Current
   - Includes: Async, Firestore mocking, Genkit patterns

### Frontend Development ✅

3. **react-component-scaffolder**
   - Quick React component generation
   - Status: Active
   - Complements: component_builder (Workflow)

4. **jest-test-scaffolder**
   - Generates Jest/React Testing Library tests
   - Status: Active, Current
   - Comprehensive workflow for components/hooks

### Integration & Analysis ✅

5. **api-contract-validator**
   - Validates TypeScript ↔ Pydantic type contracts
   - Status: Active, Current
   - Critical for frontend-backend integration

6. **frontend-backend-mapper** ✅✅ HIGH VALUE
   - Maps frontend API calls to backend endpoints
   - Status: Active, Current
   - Features: Missing endpoint detection, database tracing, token analysis

7. **audit-agent**
    - Security and code quality audits
    - Status: Active, Current
    - Scans: Vulnerabilities, dependencies, code smells

---

## Upgraded to Workflows 🚀

These skills have been converted to native **Antigravity Workflows** in `.agent/workflows/` for direct execution:

1. **component_builder** (`.agent/workflows/component_builder.md`)
   - Formerly `component-builder`
   - Strict M3 token enforcement, 3-file scaffolding

2. **fastapi_endpoint_scaffolder** (`.agent/workflows/fastapi_endpoint_scaffolder.md`)
   - Formerly `fastapi-endpoint-scaffolder`
   - End-to-end endpoint + schema + router + test creation

3. **api_integration_test_scaffolder** (`.agent/workflows/api_integration_test_scaffolder.md`)
   - Formerly `api-integration-test-scaffolder`
   - E2E testing with Genkit boundary mocking

---

### Design System ✅

11. **design-skills/** (Directory with 7 files)
    - `m3-anti-slop-validator.md` - Electric Alchemist validation
    - `m3-atmospheric-backgrounds.md` - Background design
    - `m3-expressive-typography-enhancer.md` - Typography
    - `m3-spring-motion-choreography.md` - Motion design
    - `m3-design-system-generator.md` - System generation
    - `design-critique-vision.md` - Design critique
    - `ux-heuristic-audit.md` - UX auditing
    - Status: Active, Critical for Electric Alchemist theme

### Utility & Reference ✅

12. **example-skill**
    - Reference for skill creation
    - Status: Active
    - Shows YAML best practices

---

## Skills Requiring Review ⚠️

Need verification of actual usage:

13. **react-page-scaffolder**
    - Generates React pages
    - Action: Verify if actively used, check for usage in codebase

14. **storybook-scaffolder**
    - Generates Storybook stories
    - Action: Check if Storybook is in active use

15. **theme-factory**
    - Generates design themes
    - Action: Check relationship with Electric Alchemist/M3 tokens

16. **webapp-testing**
    - E2E testing skills
    - Action: Check relationship with Playwright tests

17. **skill-reviewer**
    - Reviews skills (meta-skill)
    - Action: View SKILL.md to understand purpose

18. **task-delegator**
    - Delegates tasks to agents
    - Action: View SKILL.md to understand purpose

19. **document-skills/** (Only has pdf/ subdirectory)
    - Action: Review pdf/ skill purpose

---

## Skills Needing Updates ⚠️

These reference old paths or may need alignment:

20. **deployment-manager**
    - References: `./scripts/deploy.sh`, `./scripts/test-deployment.sh`
    - Status: Scripts EXIST ✅
    - Action: Verify deployment process alignment

21. **project-health-checker**
    - References: `production-secrets-validator.py`, `test-configuration.py`
    - Status: Scripts EXIST ✅ (`scripts/` directory)
    - Action: Verify still relevant for health checks

22. **careercopilot-agent-scaffolder**
    - References: Old `src/agents/` path
    - Current: `.claude/agents/` and `backend/app/agents/` exist
    - Action: Update to current structure or deprecate

23. **careercopilot-tool-creator**
    - References: Old `src/tools/` path
    - Current: No `src/` directory (uses `backend/`, `frontend/`)
    - Action: Update to current structure or deprecate

24. **figma-to-page**
    - References: Old `src/pages/`, `yarn` commands
    - Current: frontend/src/, npm commands
    - Action: Update paths or deprecate if not used

25. **frontend-migration** (Directory exists but no SKILL.md)
    - Action: Check contents, may be obsolete

---

## Legacy Archive ❌

Moved to `.claude/skills/_legacy_archive/`:

1. **mcp-configuration-skill** - ConfigurationRegistry server doesn't exist
2. **mcp-documentation-skill** - CodebaseDocumentation server doesn't exist
3. **mcp-genkit-flows-skill** - GenKitFlowRegistry server never built
4. **mcp-routing-specialist** - References all non-existent MCP servers

See: `.claude/skills/_legacy_archive/README.md` for details

---

## Usage Statistics (Estimated)

Based on skill quality and relevance:

| Status | Count | Percentage |
|--------|-------|------------|
| **High Value (In Use)** | 10 | 38% |
| **Active (Confirmed)** | 13 | 50% |
| **Needs Review** | 7 | 27% |
| **Needs Updates** | 5 | 19% |
| **Deprecated** | 4 | 15% |

---

## Recommendations

### Immediate (Done ✅)
- ✅ Created legacy archive
- ✅ Moved 4 deprecated MCP skills
- ✅ Created archive README with migration guide

### Short-term (Next Steps)
1. 📝 Review 7 "needs review" skills
2. 🔧 Update 5 "needs update" skills with current paths
3. 📋 Create skill status tracking system

### Long-term
1. Add `status:` and `last_verified:` fields to all SKILL.md files
2. Consolidate redundant scaffolders
3. Create skill usage analytics
4. Quarterly skill audits

---

## High-Value Skills to Prioritize

These skills provide exceptional value and should be maintained:

1. **component-builder** - Core M3 component generation
2. **frontend-backend-mapper** - Integration analysis
3. **design-skills/** - Electric Alchemist theme skills
4. **api-contract-validator** - Type safety
5. **pytest-test-scaffolder** - Backend testing
6. **jest-test-scaffolder** - Frontend testing

---

## Quick Commands

```bash
# List all active skills
ls -1 .claude/skills/ | grep -v _legacy_archive

# Count active skills  
ls -1 .claude/skills/ | grep -v _legacy_archive | wc -l

# List legacy skills
ls -1 .claude/skills/_legacy_archive/

# Find skills by pattern
find .claude/skills -name "SKILL.md" | grep -v _legacy

# Search skills for keyword
grep -r "keyword" .claude/skills/ --include="SKILL.md"
```

---

**Maintained by:** Antigravity  
**Last Audit:** 2025-12-29  
**Next Scheduled Audit:** 2026-03-29 (Quarterly)  
**Contact:** See `.claude/docs/SKILLS_COMPREHENSIVE_AUDIT_2025-12-29.md` for details
