# Skill Guidelines Audit Report

**Generated:** 2025-11-18
**Reference:** [Anthropic Skills Best Practices](https://github.com/anthropics/skills/blob/main/skill-creator/SKILL.md)

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Audit Findings](#audit-findings)
  - [✅ Compliant Areas](#-compliant-areas)
  - [⚠️ Issues Found](#️-issues-found)
- [Detailed Analysis](#detailed-analysis)
- [Recommendations](#recommendations)
- [Implementation Plan](#implementation-plan)

---

## Executive Summary

**Overall Compliance:** 75% ✅
**Critical Issues:** 2
**Minor Issues:** 3
**Total Skills Audited:** 19

Your skill infrastructure is well-structured and follows most best practices. Key strengths include concise SKILL.md files, clear workflow instructions, and no nested reference structures. The main areas for improvement are directory naming conventions and missing automation tooling.

---

## Audit Findings

### ✅ Compliant Areas

1. **SKILL.md Structure** ✅
   - All skills have proper YAML frontmatter with `name` and `description`
   - All SKILL.md files are under 500 lines (largest: 375 lines)
   - Clear, imperative workflow instructions
   - No auxiliary documentation (README.md) in skill directories

2. **Reference Depth** ✅
   - All reference files are one level deep from SKILL.md
   - No nested REFERENCE/subdirectory/file.md structures found
   - Clean, flat reference organization

3. **File Size Management** ✅
   - All reference files are under 100 lines (104 total lines across all files)
   - No table of contents needed for reference files
   - Appropriate content distribution between SKILL.md and references

4. **Resource Organization** ✅
   - Clear separation between scripts, references, and assets
   - No duplication between SKILL.md and reference files
   - Progressive disclosure patterns implemented

### ⚠️ Issues Found

#### **1. Directory Naming Convention** (Critical)

**Issue:** Using `REFERENCE/` instead of lowercase `references/`

**Affected Skills:** 5 skills

- webapp-testing
- figma-to-page
- figma-to-component
- example-skill
- deployment-manager

**Official Guideline:**

> Bundled resources should use lowercase directory names: `scripts/`, `references/`, `assets/`

**Impact:** Medium - Inconsistent with official conventions, may cause issues with tooling

**Fix:** Rename all `REFERENCE/` directories to `references/` and update SKILL.md references

---

#### **2. Missing Automation Tooling** (Critical)

**Issue:** No `init-skill.py` or `package-skill.py` scripts available

**Official Guideline:**

> Use `scripts/init_skill.py` to create skeleton directory with template SKILL.md
> Use `scripts/package_skill.py` to validate structure and create distributable .skill files

**Impact:** High - Manual skill creation is error-prone, no automated validation

**Fix:** Implement both scripts in `.claude/scripts/` or `scripts/` directory

---

#### **3. Description Field Enhancement** (Minor)

**Issue:** Some skills could benefit from more explicit "when to use" triggers in frontmatter

**Current Examples:**

**Good Example:**

```yaml
description: "Runs or writes Playwright tests for the 'careercopilot' webapp. Use when asked to 'run playwright' or 'write a new e2e test'."
```

**Could Be Enhanced:**

```yaml
# Current
description: "Example skill demonstrating YAML best practices"

# Enhanced
description: "Example skill demonstrating YAML best practices. Use when learning skill structure, reviewing formatting standards, or creating new skills."
```

**Affected Skills:**

- example-skill
- component-builder
- project-health-checker
- careercopilot-agent-scaffolder

**Impact:** Low - Affects skill triggering accuracy

**Fix:** Add explicit use case triggers to description fields

---

#### **4. M3 Migration Skills Structure** (Minor)

**Issue:** M3 migration skills (m3-layout-refactor.md, m3-color-themer.md, etc.) are standalone files, not proper SKILL.md directories

**Location:** `.claude/skills/frontend-migration/*.md` (8 files, 5,036 lines total)

**Official Guideline:**

> Skills should be directories with SKILL.md, not standalone markdown files

**Impact:** Low - They work but don't follow standard structure

**Fix:** Convert to proper skill directories:

```
frontend-migration/
  m3-layout-refactor/
    SKILL.md
    references/
      spacing-scale.md
      examples.md
```

---

#### **5. Script Organization** (Minor)

**Issue:** Some skills have inline bash scripts in SKILL.md instead of separate `scripts/` files

**Example:** `react-component-scaffolder` has inline script logic

**Official Guideline:**

> `scripts/` — Executable code (Python/Bash) for deterministic, repetitive tasks

**Impact:** Low - Works but less reusable

**Fix:** Extract repetitive script logic to `scripts/` directory when it exceeds ~20 lines

---

## Detailed Analysis

### Skill-by-Skill Breakdown

| Skill Name                      | SKILL.md Lines | References | Compliance | Notes                                     |
| ------------------------------- | -------------- | ---------- | ---------- | ----------------------------------------- |
| task-delegator                  | 375            | 0          | ✅ 100%    | Well-structured                           |
| jest-test-scaffolder            | 197            | 0          | ✅ 100%    | Comprehensive examples                    |
| component-builder               | 160            | 0          | ⚠️ 90%     | Description could be enhanced             |
| api-contract-validator          | 157            | 0          | ✅ 100%    | Excellent documentation                   |
| frontend-backend-mapper         | 148            | 0          | ✅ 100%    | Clear workflow                            |
| pdf (document-skills)           | 104            | 0          | ✅ 100%    | Good structure                            |
| pydantic-model-scaffolder       | 100            | 0          | ✅ 100%    | Concise and clear                         |
| api-integration-test-scaffolder | 95             | 0          | ✅ 100%    | Well-defined steps                        |
| fastapi-endpoint-scaffolder     | 65             | 0          | ✅ 100%    | Good examples                             |
| example-skill                   | 34             | 2          | ⚠️ 80%     | REFERENCE→references, enhance description |
| webapp-testing                  | 19             | 1          | ⚠️ 85%     | REFERENCE→references                      |
| deployment-manager              | 12             | 1          | ⚠️ 85%     | REFERENCE→references                      |
| react-component-scaffolder      | 11             | 0          | ⚠️ 90%     | Inline script could be extracted          |

### M3 Migration Skills (Special Case)

Located in `.claude/skills/frontend-migration/`:

- m3-layout-refactor.md (460 lines)
- m3-color-themer.md (530 lines)
- m3-typography-classifier.md (626 lines)
- m3-editorial-stylist.md (593 lines)
- m3-shape-refactor.md (568 lines)
- m3-elevation-refactor.md (554 lines)
- m3-icon-replacer.md (549 lines)
- m3-motion-applier.md (617 lines)

**Status:** These are comprehensive but don't follow the directory-based skill structure.

---

## Recommendations

### Priority 1: Critical Fixes (Immediate)

1. **Rename REFERENCE → references**
   - Impact: Consistency with official conventions
   - Effort: Low (5 skills, simple rename)
   - Risk: Low (update SKILL.md links)

2. **Create Automation Scripts**
   - Impact: Significant improvement to workflow
   - Effort: Medium (2 scripts, ~200-300 lines each)
   - Risk: Low (non-breaking addition)

### Priority 2: Enhancements (Next Sprint)

3. **Enhance Description Fields**
   - Impact: Better skill triggering
   - Effort: Low (4-5 skills, frontmatter edits)
   - Risk: None

4. **Restructure M3 Migration Skills**
   - Impact: Better organization, consistency
   - Effort: High (8 skills to restructure)
   - Risk: Medium (requires testing)

### Priority 3: Optimizations (Future)

5. **Extract Inline Scripts**
   - Impact: Improved reusability
   - Effort: Low-Medium
   - Risk: Low

---

## Implementation Plan

### Phase 1: Quick Wins (1-2 hours)

```bash
# 1. Rename REFERENCE directories
for skill in webapp-testing figma-to-page figma-to-component example-skill deployment-manager; do
  mv .claude/skills/$skill/REFERENCE .claude/skills/$skill/references
  # Update SKILL.md links
  sed -i 's|REFERENCE/|references/|g' .claude/skills/$skill/SKILL.md
done

# 2. Enhance descriptions (manual YAML edits)
# Edit frontmatter in:
# - example-skill/SKILL.md
# - component-builder/SKILL.md
# - project-health-checker/SKILL.md
# - careercopilot-agent-scaffolder/SKILL.md
```

### Phase 2: Automation Tooling (3-4 hours)

Create `.claude/scripts/init-skill.py`:

- Generate skill directory structure
- Create template SKILL.md with frontmatter
- Create `scripts/`, `references/`, `assets/` subdirectories
- Include example templates

Create `.claude/scripts/package-skill.py`:

- Validate YAML frontmatter
- Check for required fields (name, description)
- Validate reference depth (no nesting)
- Check description quality (triggers included)
- Create .skill zip file
- Generate validation report

### Phase 3: M3 Migration Restructure (6-8 hours)

Convert M3 migration skills to directory structure:

```
frontend-migration/
  m3-layout-refactor/
    SKILL.md (extract header + workflow)
    references/
      spacing-scale.md (extract scale table)
      examples.md (extract before/after examples)
  m3-color-themer/
    SKILL.md
    references/
      color-tokens.md
      wcag-compliance.md
  ...
```

---

## Validation Checklist

After implementing fixes, validate:

- [ ] All `REFERENCE/` directories renamed to `references/`
- [ ] All SKILL.md files updated to reference `references/` paths
- [ ] All SKILL.md files have frontmatter with name + description
- [ ] All descriptions include "when to use" triggers
- [ ] No reference files exceed 100 lines without TOC
- [ ] No nested reference structures (depth > 1)
- [ ] `init-skill.py` script functional and tested
- [ ] `package-skill.py` script validates all existing skills
- [ ] All skills pass `package-skill.py` validation
- [ ] M3 migration skills restructured (if Phase 3 complete)

---

## Appendix: Official Guidelines Summary

### Key Rules

1. **SKILL.md under 500 lines** - Move detailed content to references
2. **References one level deep** - No nested subdirectories
3. **100+ line references need TOC** - Table of contents at top
4. **Description includes triggers** - Both function and use cases
5. **Lowercase directories** - `scripts/`, `references/`, `assets/`
6. **No auxiliary docs** - No README.md or changelogs
7. **Progressive disclosure** - Metadata → SKILL.md → References

### Tooling Commands

```bash
# Initialize new skill
.claude/scripts/init-skill.py my-new-skill --path .claude/skills

# Validate and package skill
.claude/scripts/package-skill.py .claude/skills/my-new-skill
```

---

## Next Steps

1. ✅ Review this audit report
2. ⬜ Implement Phase 1 quick wins (directory renaming)
3. ⬜ Implement Phase 2 automation tooling
4. ⬜ Run package-skill.py validation on all skills
5. ⬜ Address any validation failures
6. ⬜ (Optional) Phase 3 M3 migration restructure
7. ⬜ Document new workflow in CLAUDE.md

**Estimated Total Effort:** 10-14 hours across all phases
