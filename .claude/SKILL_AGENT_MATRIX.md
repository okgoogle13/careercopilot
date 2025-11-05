# Skill-Agent Reference Matrix

## Overview

This document maps the relationships between Claude Code skills and specialized agents in the CareerCopilot project. Use this matrix to understand which skills are available to each agent and how they work together.

---

## Project-Specific Skills (`.claude/skills/`)

### Frontend Development Skills

| Skill | Used By Agent | Purpose | Status |
|-------|---------------|---------|--------|
| **react-component-scaffolder** | frontend-specialist | Scaffolds React component directories with `.tsx`, `.css`, and `index.ts` files | ✅ Active |
| **react-page-scaffolder** | frontend-specialist | Creates complete page structures in `frontend/src/pages/` | ✅ Active |
| **storybook-scaffolder** | frontend-specialist | Generates Storybook story files (`.stories.tsx`) for existing components | ✅ Active |
| **figma-to-component** | frontend-specialist | Converts Figma design specs to React components | ✅ Active |
| **figma-to-page** | frontend-specialist | Converts Figma page designs to complete React pages | ✅ Active |

### Testing & Quality Skills

| Skill | Used By Agent | Purpose | Status |
|-------|---------------|---------|--------|
| **webapp-testing** | frontend-specialist, test-runner | Runs or writes Playwright E2E tests for the frontend | ✅ Active |
| **project-health-checker** | devops-specialist, security-analyst | Validates configuration, secrets, and system health | ✅ Active |

### Deployment & Infrastructure Skills

| Skill | Used By Agent | Purpose | Status |
|-------|---------------|---------|--------|
| **deployment-manager** | devops-specialist | Orchestrates deployments to staging/production environments | ✅ Active |

### Backend Development Skills

| Skill | Used By Agent | Purpose | Status |
|-------|---------------|---------|--------|
| **careercopilot-agent-scaffolder** | *(not applicable)* | Scaffolds agent files to `src/agents/` (directory doesn't exist in current project) | ⚠️ Not Used |
| **careercopilot-tool-creator** | *(not applicable)* | Scaffolds tool files to `src/tools/` (directory doesn't exist in current project) | ⚠️ Not Used |

> **Note**: The `careercopilot-agent-scaffolder` and `careercopilot-tool-creator` skills reference a `src/` directory structure that doesn't match the current project architecture. The backend uses `backend/app/genkit_flows/`, `backend/app/ai/`, and `backend/app/api/routers/` instead.

---

## Global Skills (`~/.claude/skills/`)

These comprehensive skills are available to all agents and provide general development workflows.

| Skill | Used By Agents | Purpose | Documentation |
|-------|----------------|---------|---------------|
| **skill-creator** | All agents | Guide for creating new Claude Code skills with proper structure | 398 lines |
| **task-delegator** | All agents | Delegate tasks to specialized agents and coordinate multi-agent workflows | 419 lines |
| **finishing-a-development-branch** | All agents | Complete pre-merge checklist with quality gates | 616 lines |
| **root-cause-tracer** | debugger, All agents | Systematic debugging methodology for tracing root causes | 551 lines |
| **video-generator** | All agents | Generate video content, tutorials, and demonstrations | 548 lines |

---

## Agent-Skill Usage Guide

### 🎨 Frontend Specialist

**Primary Skills**:
- `react-component-scaffolder` - Scaffold new components
- `react-page-scaffolder` - Create page structures
- `storybook-scaffolder` - Add component documentation
- `figma-to-component` - Convert designs to code
- `figma-to-page` - Convert page designs to code
- `webapp-testing` - Run/write Playwright tests

**Example Usage**:
```markdown
User: "Build a new JobTracker page"
Frontend Specialist:
1. Uses react-page-scaffolder to create JobTrackerPage.tsx
2. Uses react-component-scaffolder for custom components
3. Uses storybook-scaffolder to add stories
4. Uses webapp-testing to create E2E tests
```

**Global Skills**:
- `task-delegator` - Coordinate with other agents
- `finishing-a-development-branch` - Pre-merge checklist
- `root-cause-tracer` - Debug frontend issues

---

### 🤖 AI Agent Specialist

**Primary Skills**:
- *(No project-specific skills currently applicable)*

**Direct Architecture Access**:
- Creates Genkit flows in `backend/app/genkit_flows/`
- Builds LLM services in `backend/app/ai/`
- Adds API routers in `backend/app/api/routers/`

**Example Usage**:
```markdown
User: "Add job description analyzer"
AI Agent Specialist:
1. Creates backend/app/genkit_flows/job_analyzer.py
2. Writes Genkit flow with @flow decorator
3. Integrates Redis caching via llm_service
4. Creates pytest tests with mocked AI responses
```

**Global Skills**:
- `task-delegator` - Coordinate with frontend specialist for UI
- `finishing-a-development-branch` - Pre-merge checklist
- `root-cause-tracer` - Debug AI/LLM issues

---

### 🚀 DevOps Specialist

**Primary Skills**:
- `deployment-manager` - Deploy to staging/production
- `project-health-checker` - Validate infrastructure health

**Example Usage**:
```markdown
User: "Deploy to staging"
DevOps Specialist:
1. Uses project-health-checker to validate secrets/config
2. Uses deployment-manager to orchestrate deployment
3. Monitors GitHub Actions workflows
4. Verifies Cloud Run services are healthy
```

**Global Skills**:
- `task-delegator` - Coordinate deployment with other agents
- `finishing-a-development-branch` - Ensure quality before deploy
- `root-cause-tracer` - Debug deployment failures

---

### 🔒 Security Analyst

**Primary Skills**:
- `project-health-checker` - Validate secrets and security config

**Direct Analysis**:
- Runs `yarn audit` for frontend dependencies
- Runs `pip-audit` for backend dependencies
- Scans code for hardcoded secrets
- Reviews authentication/authorization logic

**Example Usage**:
```markdown
User: "Security audit before production"
Security Analyst:
1. Uses project-health-checker to validate secrets
2. Runs dependency audits (yarn audit, pip-audit)
3. Scans for exposed secrets in code
4. Reviews OWASP Top 10 vulnerabilities
5. Generates security report
```

**Global Skills**:
- `task-delegator` - Coordinate remediation with other agents
- `finishing-a-development-branch` - Security checks before merge
- `root-cause-tracer` - Debug security incidents

---

## Skill Invocation Examples

### Scaffolding a React Component

```bash
# Agent: frontend-specialist
# Skill: react-component-scaffolder

User: "Create a JobCard component"
Agent:
1. Asks for component name: JobCard
2. Asks for parent directory: src/components/library
3. Runs: .claude/skills/react-component-scaffolder/scripts/create-component.sh
4. Creates:
   - src/components/library/JobCard/JobCard.tsx
   - src/components/library/JobCard/JobCard.css
   - src/components/library/JobCard/index.ts
```

### Running Deployment

```bash
# Agent: devops-specialist
# Skill: deployment-manager

User: "Deploy to production"
Agent:
1. Runs: python3 scripts/production-secrets-validator.py --checklist
2. Reports validation results
3. Asks for confirmation
4. Runs: ./scripts/deploy.sh production
5. Reports deployment URL
```

### Health Check

```bash
# Agent: devops-specialist OR security-analyst
# Skill: project-health-checker

User: "Something is wrong with the backend"
Agent:
1. Runs: python3 scripts/production-secrets-validator.py
2. Runs: python3 scripts/test-configuration.py
3. Runs: python3 verify_genkit.py
4. Reports summary of all outputs
```

---

## Skill Dependencies

### Scripts Referenced by Skills

| Skill | Script/Template | Location | Status |
|-------|----------------|----------|--------|
| react-component-scaffolder | `create-component.sh` | `.claude/skills/react-component-scaffolder/scripts/` | ✅ Exists |
| react-page-scaffolder | `create-page.sh` | `.claude/skills/react-page-scaffolder/scripts/` | ✅ Exists |
| storybook-scaffolder | `story.tsx.tpl` | `.claude/skills/storybook-scaffolder/templates/` | ✅ Exists |
| careercopilot-agent-scaffolder | `agent.py.tpl` | `.claude/skills/careercopilot-agent-scaffolder/templates/` | ✅ Exists |
| careercopilot-tool-creator | `tool.py.tpl` | `.claude/skills/careercopilot-tool-creator/templates/` | ✅ Exists |
| deployment-manager | `production-secrets-validator.py` | `scripts/` | ✅ Exists |
| deployment-manager | `deploy.sh` | `scripts/` | ✅ Exists |
| project-health-checker | `production-secrets-validator.py` | `scripts/` | ✅ Exists |
| project-health-checker | `test-configuration.py` | `scripts/` | ✅ Exists |
| project-health-checker | `verify_genkit.py` | Root | ✅ Exists |

---

## Best Practices

### For Agent Developers

1. **Reference Skills in System Prompts**: Include skill names in agent workflow examples
2. **Use Skill for Scaffolding**: Always prefer skills over manual file creation
3. **Chain Skills**: Use multiple skills in sequence for complex workflows
4. **Validate Dependencies**: Ensure scripts/templates referenced by skills exist

### For Skill Creators

1. **Clear Workflow**: Provide numbered step-by-step instructions
2. **Reference Real Paths**: Only reference scripts/files that actually exist
3. **Validate Structure**: Ensure target directories match project architecture
4. **Add to Matrix**: Update this matrix when creating new skills

### For Users

1. **Use Agent Names**: Request work from specialized agents (e.g., "frontend-specialist, build...")
2. **Let Agents Choose Skills**: Agents know which skills to use for their tasks
3. **Reference This Matrix**: Understand which agent handles which type of work

---

## Maintenance

**Last Updated**: 2024-11-05

**Update Triggers**:
- New skill created → Add to matrix
- Skill deprecated → Mark as inactive
- Agent system prompt updated → Verify skill references
- Project structure changed → Update skill applicability

**Maintainers**: Update this document when:
- Adding new agents to `.claude/agents/`
- Creating new skills in `.claude/skills/`
- Changing project directory structure
- Deprecating or removing skills

---

## Related Documentation

- [skill-creator](../../../.claude/skills/../../../.claude/skills/skill-creator/SKILL.md) - How to create new skills
- [task-delegator](../../../.claude/skills/../../../.claude/skills/task-delegator/SKILL.md) - How to delegate tasks to agents
- [CLAUDE.md](../CLAUDE.md) - Project commands and configuration
- Agent Documentation:
  - [frontend-specialist.md](.claude/agents/frontend-specialist.md)
  - [ai-agent-specialist.md](.claude/agents/ai-agent-specialist.md)
  - [devops-specialist.md](.claude/agents/devops-specialist.md)
  - [security-analyst.md](.claude/agents/security-analyst.md)
