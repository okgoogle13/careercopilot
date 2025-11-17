**"Prompt for Claude"** 

(to initialize the work) and the specific 


**Commit Message** to use.

### PR 1: The "M3 Foundation" (Additive)

**Goal:** Safe installation of new agents, skills, and docs. No existing files are touched.

**Step 1: Input this Prompt into Claude Code:**

```text
Create a new branch named "feat/m3-infrastructure".
I need to create several new files for the M3 Design System migration.
Please create the following directories if they don't exist:
- .claude/agents
- .claude/skills/frontend-migration
- .claude/skills/design-system-core
- .claude/skills/theme-factory
- .claude/skills/frontend-generation
- docs
- scripts

I will now provide the content for the new agents (Design PM, Migration Architect, Visual Director, etc.) and the new skills (M3 Migration skills, Component Builder, Token Generator).
```

**(Action: Paste the content for the "New Infrastructure" files provided in the previous turn, or run `Script 1` if you saved it.)**

**Step 2: Commit Command:**

```bash
git add .
git commit -m "feat: implement M3 design system infrastructure

- Add Design Project Manager and M3 Migration Architect agents
- Add 8-step M3 migration skill suite (.claude/skills/frontend-migration)
- Add Component Builder v2 engine
- Add Design System Core skills (Token Generator, Contrast Checker)
- Add infrastructure documentation (Model Reference, Skill Matrix)
- Add token validation and build scripts"
```

**Step 3: Push:**

```bash
git push -u origin feat/m3-infrastructure
```

-----

### PR 2: The "Scaffolder" Update (Tooling)

**Goal:** Update the scripts to stop producing `.css` files and start producing M3-ready code.

**Step 1: Input this Prompt into Claude Code:**

```text
Create a new branch named "chore/scaffolder-update" from "main".
I need to update our scaffolding scripts to align with the new M3 token system.
Please update the following files with the "V2 UPDATE" content I will provide:
1. .claude/skills/react-component-scaffolder/scripts/create-component.sh
2. .claude/skills/react-page-scaffolder/scripts/create-page.sh
3. .claude/skills/storybook-scaffolder/SKILL.md
```

**(Action: Paste the updated shell script content and Storybook skill definition.)**

**Step 2: Commit Command:**

```bash
git add .
git commit -m "chore(skills): update scaffolders to support M3 token system

- Update create-component.sh to generate MUI Box/sx instead of CSS modules
- Update create-page.sh to use M3 layout tokens
- Update Storybook scaffolder to import global design-tokens.css
- Remove legacy CSS generation logic"
```

**Step 3: Push:**

```bash
git push -u origin chore/scaffolder-update
```

-----

### PR 3: The "Frontend 2.0" Switch (Agent Logic)

**Goal:** Instruct the Frontend Specialist to use the new tools.

**Step 1: Input this Prompt into Claude Code:**

```text
Create a new branch named "feat/frontend-agent-v2" from "main".
I am upgrading the Frontend Specialist agent to use the new M3 Component Builder.
Please update:
1. .claude/agents/frontend-specialist.md (Update system prompt to enforce M3 tokens and ban CSS files)
2. .claude/skills/figma-to-component/SKILL.md (Mark as DEPRECATED in favor of the Vision workflow)
```

**(Action: Paste the updated agent and skill files.)**

**Step 2: Commit Command:**

```bash
git add .
git commit -m "feat(agents): upgrade frontend-specialist to Component Builder v2

- Update frontend-specialist system prompt to strictly enforce M3 tokens
- Ban creation of external CSS files in favor of MUI sx prop
- Deprecate legacy figma-to-component skill in favor of Vision workflow"
```

**Step 3: Push:**

```bash
git push -u origin feat/frontend-agent-v2
```

-----

### PR 4: Governance & Cleanup (Enforcement)

**Goal:** Strict enforcement of the new rules by the Code Reviewer.

**Step 1: Input this Prompt into Claude Code:**

```text
Create a new branch named "chore/governance-enforcement" from "main".
I need to update the Code Reviewer to strictly enforce the new M3 rules.
Please update:
1. .claude/agents/code-reviewer.md (Add rejection criteria for hex codes and CSS files)
2. .claude/skills/fullstack-flow-mapper/SKILL.md (Update to include Design Token flow analysis)
```

**(Action: Paste the updated Code Reviewer and Mapper files.)**

**Step 2: Commit Command:**

```bash
git add .
git commit -m "chore(governance): enforce strict M3 compliance in code-reviewer

- Update code-reviewer checklist to auto-reject hardcoded hex colors
- Add rejection rule for legacy CSS/SCSS files
- Update fullstack-flow-mapper to trace Design Token usage"
```

**Step 3: Push:**

```bash
git push -u origin chore/governance-enforcement
```