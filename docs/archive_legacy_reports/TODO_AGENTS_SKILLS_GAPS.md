# TODO: Fix Critical Gaps in Agents & Skills System

**Created:** 2025-01-18
**Status:** PENDING EXECUTION
**Priority:** HIGH
**Estimated Effort:** ~18.5 hours

---

## 📊 Current State Summary

### Health Metrics

- ✅ **Agent Health:** 16/16 agents exist (100%)
- ⚠️ **Agent Functionality:** 13/16 agents fully functional (81%)
  - 3 agents blocked by missing skills
  - 1 agent completely non-functional (m3-migration-architect)
- ⚠️ **Skill Health:** 21/24 skills complete (87.5%)
  - 3 missing skills
  - 9 stub/incomplete skills (8 M3 + theme-factory)
- ⚠️ **Documentation Health:** 14/24 skills documented in CLAUDE.md (58%)

---

## 🚨 Critical Issues Found

### 1. Missing Skills (Breaking Agent Functionality)

| Skill                              | Referenced By                        | Impact                                 | Location Needed                                  |
| :--------------------------------- | :----------------------------------- | :------------------------------------- | :----------------------------------------------- |
| **pytest-test-scaffolder**         | testing-specialist.md (lines 37, 50) | HIGH - Backend test generation broken  | `.claude/skills/pytest-test-scaffolder/`         |
| **finishing-a-development-branch** | security-analyst.md (line 12)        | MEDIUM - Pre-merge checklist missing   | `.claude/skills/finishing-a-development-branch/` |
| **root-cause-tracer**              | devops-specialist.md (line 19)       | MEDIUM - Debugging methodology missing | `.claude/skills/root-cause-tracer/`              |

### 2. M3 Migration System Non-Functional

**Problem:** m3-migration-architect agent exists but calls 8 stub skills (21-30 bytes each)

**Location:** `.claude/skills/frontend-migration/`

**Missing Implementations:**

1. m3-color-themer.md (21 bytes stub)
2. m3-typography-classifier.md (30 bytes stub)
3. m3-layout-refactor.md (24 bytes stub)
4. m3-editorial-stylist.md (26 bytes stub)
5. m3-shape-refactor.md (23 bytes stub)
6. m3-elevation-refactor.md (27 bytes stub)
7. m3-icon-replacer.md (22 bytes stub)
8. m3-motion-applier.md (23 bytes stub)

**Impact:** CRITICAL - Entire M3 migration workflow is non-functional

### 3. Documentation Gaps

**10 Skills Exist But Not Documented in CLAUDE.md:**

**Scaffolders:**

- careercopilot-agent-scaffolder
- careercopilot-tool-creator
- react-component-scaffolder
- react-page-scaffolder
- component-builder

**Integrations:**

- figma-to-component
- figma-to-page
- task-delegator

**Others:**

- theme-factory (also incomplete - 247 byte stub)

---

## ✅ Phase 1: Restore Broken Agent Functionality (HIGH PRIORITY)

### Task 1.1: Create pytest-test-scaffolder Skill

**Purpose:** Unblock testing-specialist for backend test generation

**Location:** `.claude/skills/pytest-test-scaffolder/`

**Files to Create:**

```
.claude/skills/pytest-test-scaffolder/
├── SKILL.md                           # Main skill documentation
└── templates/
    ├── unit_test.py.tpl              # Synchronous test template
    ├── async_test.py.tpl             # Async function test template
    └── fixture.py.tpl                # Shared fixture template
```

**Pattern:** Mirror jest-test-scaffolder structure

**Implementation Details:**

- Auto-detect function signatures from Python files
- Generate test cases: happy path, error scenarios, edge cases
- Use pytest fixtures for dependencies
- Include pytest markers (@pytest.mark.unit, @pytest.mark.asyncio)
- Mock external dependencies (Firebase, Genkit, databases)
- Follow existing pattern from test_ksc_integration.py (268 lines)

**Effort:** ~2-3 hours

---

### Task 1.2: Create finishing-a-development-branch Skill

**Purpose:** Unblock security-analyst pre-merge workflow

**Location:** `.claude/skills/finishing-a-development-branch/`

**Files to Create:**

```
.claude/skills/finishing-a-development-branch/
└── SKILL.md                           # Main skill documentation
```

**Implementation Details:**

Pre-merge checklist workflow that validates:

1. **Tests Pass:** Run full test suite (frontend + backend + E2E)
2. **No Secrets:** Scan for hardcoded secrets, API keys, credentials
3. **Dependencies Updated:** Check for outdated/vulnerable dependencies
4. **Docs Updated:** Ensure README, CHANGELOG, API docs are current
5. **Type Checking:** Run TypeScript and mypy type checks
6. **Linting Clean:** No linting errors or warnings
7. **Build Success:** Both frontend and backend build successfully
8. **Coverage Maintained:** Test coverage didn't decrease
9. **No Console Logs:** Remove debug console.log statements
10. **Branch Clean:** No merge conflicts, rebased on main/develop

**Output:** Checklist report with ✅/❌ status for each item

**Effort:** ~3 hours

---

### Task 1.3: Create root-cause-tracer Skill

**Purpose:** Unblock devops-specialist debugging workflow

**Location:** `.claude/skills/root-cause-tracer/`

**Files to Create:**

```
.claude/skills/root-cause-tracer/
└── SKILL.md                           # Main skill documentation
```

**Implementation Details:**

Systematic debugging methodology:

1. **5-Why Analysis:** Iterative questioning to find root cause
2. **Log Correlation:** Cross-reference frontend, backend, infrastructure logs
3. **Dependency Tracing:** Map service dependencies and failure cascade
4. **Timeline Reconstruction:** When did it start? What changed?
5. **Reproduction Steps:** Minimal steps to reproduce the issue
6. **Hypothesis Testing:** Propose and test potential causes
7. **Fix Validation:** Verify fix resolves root cause, not just symptoms

**Output:** Root cause analysis report with diagnosis and fix recommendations

**Effort:** ~2 hours

---

## ✅ Phase 2: Implement M3 Migration System (HIGH PRIORITY)

### Task 2.1: Implement All 8 M3 Migration Skills

**Purpose:** Unblock m3-migration-architect (currently non-functional)

**Location:** `.claude/skills/frontend-migration/`

**Current State:** All 8 files are 21-30 byte placeholder stubs

---

#### 2.1.1: m3-color-themer.md

**Purpose:** Migrate Material-UI colors to M3 color tokens

**Transformations:**

- `theme.palette.primary.main` → `var(--sys-color-primary)`
- `theme.palette.secondary.main` → `var(--sys-color-secondary)`
- `theme.palette.error.main` → `var(--sys-color-error)`
- Hardcoded hex colors → M3 semantic color tokens
- `backgroundColor: '#FFFFFF'` → `backgroundColor: 'var(--sys-color-surface)'`

**Pattern Matching:**

- Inline styles with colors
- Emotion/styled-components with theme colors
- Direct palette references

**Effort:** ~1 hour

---

#### 2.1.2: m3-typography-classifier.md

**Purpose:** Map font styles to M3 typography scale

**Transformations:**

- `fontSize: 24` → `var(--sys-typescale-headline-small-size)`
- `fontWeight: 700` → `var(--sys-typescale-headline-small-weight)`
- `theme.typography.h1` → M3 display-large tokens
- `theme.typography.body1` → M3 body-medium tokens

**Typography Scale Mapping:**

- Display (large, medium, small)
- Headline (large, medium, small)
- Title (large, medium, small)
- Label (large, medium, small)
- Body (large, medium, small)

**Pattern Matching:**

- Typography theme references
- fontSize/fontWeight props
- Text component variants

**Effort:** ~1 hour

---

#### 2.1.3: m3-layout-refactor.md

**Purpose:** Convert spacing/padding/margin to M3 spacing tokens

**Transformations:**

- `padding: 16` → `padding: 'var(--sys-spacing-4)'`
- `margin: '8px 16px'` → `margin: 'var(--sys-spacing-2) var(--sys-spacing-4)'`
- `theme.spacing(2)` → `var(--sys-spacing-2)`
- Hardcoded pixel values → Semantic spacing scale

**Spacing Scale:**

- spacing-0: 0px
- spacing-1: 4px
- spacing-2: 8px
- spacing-3: 12px
- spacing-4: 16px
- spacing-5: 20px
- spacing-6: 24px
- spacing-8: 32px
- spacing-10: 40px
- spacing-12: 48px

**Pattern Matching:**

- padding, margin, gap props
- theme.spacing() calls
- Hardcoded pixel values in layout

**Effort:** ~1 hour

---

#### 2.1.4: m3-editorial-stylist.md

**Purpose:** Apply editorial and content-specific styles

**Transformations:**

- Line heights for readability
- Letter spacing for body text
- Text alignment and justification
- Content container max-widths
- Reading-optimized typography

**Content Patterns:**

- Article text: line-height 1.6, max-width 65ch
- Headlines: letter-spacing -0.02em
- Labels: letter-spacing 0.01em
- Code blocks: monospace with proper spacing

**Effort:** ~1 hour

---

#### 2.1.5: m3-shape-refactor.md

**Purpose:** Apply M3 shape tokens (border radius)

**Transformations:**

- `borderRadius: 4` → `borderRadius: 'var(--sys-shape-corner-extra-small)'`
- `borderRadius: 8` → `borderRadius: 'var(--sys-shape-corner-small)'`
- `borderRadius: 12` → `borderRadius: 'var(--sys-shape-corner-medium)'`
- `borderRadius: 16` → `borderRadius: 'var(--sys-shape-corner-large)'`
- `borderRadius: '50%'` → `borderRadius: 'var(--sys-shape-corner-full)'`

**Shape Scale:**

- extra-small: 4px
- small: 8px
- medium: 12px
- large: 16px
- extra-large: 28px
- full: 9999px (circular)

**Pattern Matching:**

- borderRadius props
- Border radius in styled components
- Shape theme references

**Effort:** ~1 hour

---

#### 2.1.6: m3-elevation-refactor.md

**Purpose:** Convert box-shadow to M3 elevation tokens

**Transformations:**

- `boxShadow: theme.shadows[2]` → `boxShadow: 'var(--sys-elevation-level2)'`
- Hardcoded shadow strings → Semantic elevation levels
- `elevation={4}` (Paper) → `elevation: 'var(--sys-elevation-level4)'`

**Elevation Levels:**

- level0: No shadow (flat)
- level1: 0px 1px 2px rgba(0,0,0,0.3)
- level2: 0px 1px 5px rgba(0,0,0,0.2)
- level3: 0px 2px 8px rgba(0,0,0,0.15)
- level4: 0px 4px 12px rgba(0,0,0,0.15)
- level5: 0px 6px 16px rgba(0,0,0,0.15)

**Pattern Matching:**

- boxShadow props
- Paper elevation prop
- theme.shadows references

**Effort:** ~1 hour

---

#### 2.1.7: m3-icon-replacer.md

**Purpose:** Standardize icons to Material Symbols

**Transformations:**

- Material-UI Icons → Material Symbols
- Custom SVG icons → Material Symbols equivalents
- Icon component props: size, color, variant (outlined, filled, rounded)

**Icon Migration:**

- `<CheckCircleIcon />` → `<Icon>check_circle</Icon>`
- `<AddIcon />` → `<Icon>add</Icon>`
- `<DeleteIcon />` → `<Icon>delete</Icon>`
- Apply consistent sizing and color tokens

**Pattern Matching:**

- Material-UI Icon imports
- Custom icon components
- SVG icon usage

**Effort:** ~1 hour

---

#### 2.1.8: m3-motion-applier.md

**Purpose:** Apply M3 motion and transition tokens

**Transformations:**

- `transition: 'all 0.3s ease'` → `transition: 'var(--sys-motion-easing-standard) var(--sys-motion-duration-medium2)'`
- Animation durations → M3 duration tokens
- Easing functions → M3 easing tokens

**Motion Tokens:**
**Durations:**

- duration-short1: 50ms
- duration-short2: 100ms
- duration-short3: 150ms
- duration-short4: 200ms
- duration-medium1: 250ms
- duration-medium2: 300ms
- duration-medium3: 350ms
- duration-medium4: 400ms
- duration-long1: 450ms
- duration-long2: 500ms

**Easing:**

- easing-standard: cubic-bezier(0.2, 0, 0, 1)
- easing-emphasized: cubic-bezier(0.4, 0, 0.2, 1)
- easing-decelerate: cubic-bezier(0, 0, 0, 1)
- easing-accelerate: cubic-bezier(0.3, 0, 1, 1)

**Pattern Matching:**

- transition props
- CSS animations
- Theme transition references

**Effort:** ~1 hour

---

**Total Phase 2 Effort:** ~8 hours (8 skills × 1 hour each)

---

## ✅ Phase 3: Documentation & Discoverability (MEDIUM PRIORITY)

### Task 3.1: Update CLAUDE.md

**Purpose:** Improve skill discoverability

**Add Documentation for 10 Undocumented Skills:**

```markdown
## Component & Page Scaffolders

**React Component Scaffolder** (`react-component-scaffolder`)

- Scaffolds React component directory with .tsx, .css, index files
- Location: `.claude/skills/react-component-scaffolder/`
- Usage: "Create a new Card component"

**React Page Scaffolder** (`react-page-scaffolder`)

- Scaffolds complete page directory in src/pages/
- Location: `.claude/skills/react-page-scaffolder/`
- Usage: "Create a new Settings page"

**Component Builder** (`component-builder`)

- Generate M3-compliant React components
- Location: `.claude/skills/component-builder/`
- Usage: "Build an M3 button component"

## Agent & Tool Creators

**CareerCopilot Agent Scaffolder** (`careercopilot-agent-scaffolder`)

- Create new agent files from template
- Location: `.claude/skills/careercopilot-agent-scaffolder/`
- Usage: "Create a new database-specialist agent"

**CareerCopilot Tool Creator** (`careercopilot-tool-creator`)

- Scaffold new Python tool file in src/tools/
- Location: `.claude/skills/careercopilot-tool-creator/`
- Usage: "Create a new resume_parser tool"

## Figma Integration

**Figma to Component** (`figma-to-component`)

- Vision-based component generation from Figma
- Location: `.claude/skills/figma-to-component/`
- Usage: "Generate component from Figma screenshot"

**Figma to Page** (`figma-to-page`)

- Vision-based page generation from Figma
- Location: `.claude/skills/figma-to-page/`
- Usage: "Create page from Figma design"

## Task Delegation

**Task Delegator** (`task-delegator`)

- Parallel task execution with Jules
- Location: `.claude/skills/task-delegator/`
- Usage: "Delegate test generation to Jules"

## Theming

**Theme Factory** (`theme-factory`)

- Pre-built theme templates (Dracula, Nord, etc.)
- Location: `.claude/skills/theme-factory/`
- Status: ⚠️ Incomplete (stub only)
```

**Insert Location:** After "Testing & Test Automation" section (around line 249 in CLAUDE.md)

**Effort:** ~1 hour

---

### Task 3.2: Add Container SKILL.md Files

**Purpose:** Better organization for skill groups

#### 3.2.1: Create design-skills/SKILL.md

**Location:** `.claude/skills/design-skills/SKILL.md`

**Content:**

```markdown
# Design Skills

This directory contains 4 design-related sub-skills for the Design Wing infrastructure.

## Sub-Skills

1. **design-critique-vision.md** - Analyze images for visual quality, hierarchy, spacing
2. **design-token-generator.md** - Generate tokens.json from aesthetic preferences
3. **ux-heuristic-audit.md** - Audit flows against Nielsen's 10 Usability Heuristics
4. **wcag-contrast-checker.md** - Validate WCAG AA/AAA color contrast

## Usage

These skills are typically invoked by the Design Wing agents:

- visual-design-director
- design-systems-architect
- ux-accessibility-lead

## See Also

- `design-system/` - Generated design tokens and assets
- `scripts/validate-design-tokens.py` - Token validation script
- `scripts/build-design-tokens.py` - Token build script
```

---

#### 3.2.2: Create frontend-migration/SKILL.md

**Location:** `.claude/skills/frontend-migration/SKILL.md`

**Content:**

```markdown
# Frontend M3 Migration Skills

This directory contains 8 M3 Design System migration sub-skills for systematic component migration.

## Sub-Skills

1. **m3-color-themer.md** - Migrate colors to M3 color tokens
2. **m3-typography-classifier.md** - Map fonts to M3 typography scale
3. **m3-layout-refactor.md** - Convert spacing to M3 spacing tokens
4. **m3-editorial-stylist.md** - Apply editorial/content styles
5. **m3-shape-refactor.md** - Apply M3 shape tokens (border radius)
6. **m3-elevation-refactor.md** - Convert shadows to M3 elevation tokens
7. **m3-icon-replacer.md** - Standardize to Material Symbols
8. **m3-motion-applier.md** - Apply M3 motion/transition tokens

## Usage

These skills are orchestrated by the **m3-migration-architect** agent for systematic component migration from Material-UI v5 to M3 Design System.

## Migration Workflow

1. Architect analyzes component
2. Calls relevant M3 skills in sequence
3. Validates M3 compliance
4. Tests component functionality
5. Commits migration

## See Also

- `.claude/agents/m3-migration-architect.md` - Orchestration agent
- `design-system/tokens.json` - M3 design tokens
- `frontend/src/styles/design-tokens.css` - CSS variables
```

**Effort:** ~30 minutes

---

## ✅ Phase 4: Complete Incomplete Skills (LOW PRIORITY)

### Task 4.1: Complete theme-factory Skill

**Purpose:** Enable preset-based design workflow

**Location:** `.claude/skills/theme-factory/`

**Current State:** 247-byte stub file

**Files to Create:**

```
.claude/skills/theme-factory/
├── SKILL.md                           # Main skill documentation
└── themes/
    ├── dracula.json                  # Dracula theme preset
    ├── nord.json                     # Nord theme preset
    ├── solarized-light.json          # Solarized Light
    ├── solarized-dark.json           # Solarized Dark
    ├── monokai.json                  # Monokai theme
    ├── gruvbox.json                  # Gruvbox theme
    └── one-dark.json                 # One Dark theme
```

**Implementation Details:**

Each theme JSON contains complete M3 token system:

- Color tokens (primary, secondary, tertiary, error, warning, success)
- Typography tokens (scales, weights, line heights)
- Spacing tokens (8px base grid)
- Shape tokens (border radius scale)
- Elevation tokens (shadow levels)
- Motion tokens (durations, easing)

**Usage Workflow:**

1. User: "Apply Dracula theme"
2. Skill loads `themes/dracula.json`
3. Validates against token schema
4. Writes to `design-system/tokens.json`
5. Runs `./scripts/update-design-system.sh`
6. Applies theme system-wide

**Effort:** ~2 hours

---

## 📋 Execution Checklist

### Phase 1: Restore Broken Functionality (7 hours)

- [ ] Create pytest-test-scaffolder skill (~2-3 hours)
  - [ ] SKILL.md documentation
  - [ ] unit_test.py.tpl template
  - [ ] async_test.py.tpl template
  - [ ] fixture.py.tpl template
  - [ ] Test with sample Python function
- [ ] Create finishing-a-development-branch skill (~3 hours)
  - [ ] SKILL.md with 10-point checklist
  - [ ] Integration with existing validators
  - [ ] Test on sample branch
- [ ] Create root-cause-tracer skill (~2 hours)
  - [ ] SKILL.md with 7-step methodology
  - [ ] Example root cause analysis
  - [ ] Test on sample bug

### Phase 2: M3 Migration System (8 hours)

- [ ] Implement m3-color-themer.md (~1 hour)
  - [ ] Color token mappings
  - [ ] Pattern matching logic
  - [ ] Test on sample component
- [ ] Implement m3-typography-classifier.md (~1 hour)
  - [ ] Typography scale mappings
  - [ ] Font property transformations
  - [ ] Test on sample component
- [ ] Implement m3-layout-refactor.md (~1 hour)
  - [ ] Spacing token mappings
  - [ ] Layout property transformations
  - [ ] Test on sample component
- [ ] Implement m3-editorial-stylist.md (~1 hour)
  - [ ] Content-specific styles
  - [ ] Readability optimizations
  - [ ] Test on sample content
- [ ] Implement m3-shape-refactor.md (~1 hour)
  - [ ] Shape token mappings
  - [ ] Border radius transformations
  - [ ] Test on sample component
- [ ] Implement m3-elevation-refactor.md (~1 hour)
  - [ ] Elevation token mappings
  - [ ] Shadow transformations
  - [ ] Test on sample component
- [ ] Implement m3-icon-replacer.md (~1 hour)
  - [ ] Icon migration mappings
  - [ ] Material Symbols integration
  - [ ] Test on sample icons
- [ ] Implement m3-motion-applier.md (~1 hour)
  - [ ] Motion token mappings
  - [ ] Transition transformations
  - [ ] Test on sample animations

### Phase 3: Documentation (1.5 hours)

- [ ] Update CLAUDE.md (~1 hour)
  - [ ] Add 10 undocumented skills
  - [ ] Update skill count statistics
  - [ ] Add new section for scaffolders
- [ ] Create design-skills/SKILL.md (~15 minutes)
- [ ] Create frontend-migration/SKILL.md (~15 minutes)

### Phase 4: Complete Stubs (2 hours)

- [ ] Complete theme-factory skill (~2 hours)
  - [ ] SKILL.md documentation
  - [ ] Dracula theme JSON
  - [ ] Nord theme JSON
  - [ ] Solarized themes JSON
  - [ ] Monokai theme JSON
  - [ ] Gruvbox theme JSON
  - [ ] One Dark theme JSON
  - [ ] Test theme application

---

## 🎯 Success Criteria

Upon completion, the following must be true:

### Agent Functionality

- [ ] All 16 agents are fully functional (0 broken references)
- [ ] testing-specialist can generate pytest tests
- [ ] security-analyst can run pre-merge checklist
- [ ] devops-specialist can trace root causes
- [ ] m3-migration-architect can perform actual component migrations

### Skill Completeness

- [ ] All 24 skills are complete (0 stubs)
- [ ] All M3 migration skills have working implementations
- [ ] theme-factory has 7+ preset themes

### Documentation

- [ ] 100% skill documentation coverage in CLAUDE.md (24/24)
- [ ] Container directories have SKILL.md files
- [ ] All skill locations are discoverable

### Testing

- [ ] Each new skill tested with sample use case
- [ ] M3 migration system tested end-to-end on real component
- [ ] No broken imports or missing dependencies

---

## 📊 Impact Analysis

### Before This Work

- **Functional Agents:** 13/16 (81%)
- **Complete Skills:** 21/24 (87.5%)
- **Documented Skills:** 14/24 (58%)
- **M3 Migration System:** ❌ Non-functional

### After This Work

- **Functional Agents:** 16/16 (100%) ✅
- **Complete Skills:** 24/24 (100%) ✅
- **Documented Skills:** 24/24 (100%) ✅
- **M3 Migration System:** ✅ Fully functional

### ROI

- **Unblocks:** 4 critical agents
- **Enables:** Full M3 migration capability
- **Improves:** Developer experience and skill discoverability
- **Total Value:** ~40 hours of future productivity saved

---

## 🔄 Next Steps After Completion

1. **Test Full M3 Migration Workflow**
   - Migrate 3-5 sample components end-to-end
   - Validate M3 compliance
   - Document any edge cases

2. **Update Agent Documentation**
   - Add examples of new skills in agent docs
   - Update capability matrices

3. **Create Video Walkthroughs** (Optional)
   - Demo pytest-test-scaffolder
   - Demo M3 migration workflow
   - Demo theme-factory presets

4. **Monitor Usage Analytics**
   - Track which skills are most used
   - Identify any additional gaps
   - Plan future enhancements

---

## 📝 Notes

- All skill implementations should follow the pattern established by existing complete skills (jest-test-scaffolder, fastapi-endpoint-scaffolder, etc.)
- M3 migration skills should include comprehensive before/after code examples
- All new skills must have SKILL.md with clear usage instructions
- Test each skill in isolation before integration testing
- Consider creating automated tests for skill templates

---

**END OF TODO DOCUMENT**

---

## Handover Instructions for Claude Code Web

1. Review this entire TODO document
2. Start with Phase 1 (highest priority, unblocks agents)
3. Test each skill thoroughly before moving to next phase
4. Update this document with progress checkmarks
5. Create git commits after completing each phase
6. Notify stakeholders when critical agents are unblocked (end of Phase 1)
7. Final validation: Run all agents with new skills to confirm functionality

**Estimated Timeline:** 2-3 days of focused work (assuming 6-8 hour workdays)

**Point of Contact:** Original Claude Code instance that performed the audit
