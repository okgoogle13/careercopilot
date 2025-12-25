# Claude Code Agent Configuration Guide

## Overview

All Claude Code agents have been configured with specific Claude models based on task complexity and reasoning requirements. This ensures optimal cost-to-performance ratios while maintaining high code quality standards.

## Model Selection Strategy

### Three-Tier Approach

- **Haiku** (Fast, cost-effective) - For simple, straightforward tasks with clear patterns
- **Sonnet** (Balanced) - For complex reasoning, planning, and architectural decisions
- **Opus** (Premium) - Reserved for exceptional complexity (not currently assigned)

## Agent Configurations

### Haiku Models (Fast & Cost-Effective)

These agents handle tasks with clear, deterministic patterns where speed and cost efficiency are prioritized.

#### 1. **code-reviewer** - `haiku`

- **Task Complexity**: Low to Medium
- **Rationale**: Code review follows a consistent checklist. Once patterns are identified, a lighter model can effectively validate against known issues.
- **Checklist-based review**:
  - Code readability
  - Function/variable naming
  - Error handling
  - Security (secrets exposure)
  - Test coverage
  - Performance considerations
- **When Haiku Excels**: Straightforward refactoring, naming consistency, obvious bugs
- **When Haiku Struggles**: Complex architectural decisions, nuanced security analysis

#### 2. **test-runner** - `haiku`

- **Task Complexity**: Low to Medium
- **Rationale**: Test execution and failure analysis follow known patterns. Haiku can identify common test failures and simple fixes.
- **Typical Tasks**:
  - Execute test suites (frontend, backend, E2E)
  - Analyze test failure messages
  - Fix simple assertion failures
  - Re-run tests to verify fixes
- **When Haiku Excels**: Single-point failures, missing imports, simple mock issues
- **When Haiku Struggles**: Race conditions, complex test infrastructure issues

---

### Sonnet Models (Complex Reasoning & Planning)

These agents handle tasks requiring sophisticated reasoning, planning, and architectural decisions.

#### 1. **ai-agent-specialist** - `sonnet`

- **Task Complexity**: Very High
- **Rationale**: Designing multi-agent systems (crewAI) requires:
  - Deep understanding of agent roles and dependencies
  - Tool design and capability assessment
  - Workflow orchestration and error handling
  - Complex task decomposition
- **Typical Tasks**:
  - Design new agents (role, goal, backstory)
  - Plan tool requirements and capabilities
  - Orchestrate multi-agent workflows
  - Handle agent interdependencies
- **Why Sonnet**: Requires sophisticated reasoning about system design and complex interdependencies

#### 2. **debugger** - `sonnet`

- **Task Complexity**: Very High
- **Rationale**: Root cause analysis requires:
  - Understanding error patterns across the entire system
  - Hypotheses formation and testing
  - Complex logic trace through multiple modules
  - Prevention recommendations
- **Typical Tasks**:
  - Reproduce complex failures
  - Analyze stack traces and logs
  - Form and test debugging hypotheses
  - Implement minimal, correct fixes
  - Provide prevention strategies
- **Why Sonnet**: Debugging complex issues requires sophisticated reasoning and broad system knowledge

#### 3. **devops-specialist** - `sonnet`

- **Task Complexity**: Very High
- **Rationale**: DevOps decisions affect the entire system and require:
  - Understanding CI/CD pipeline architecture
  - Deployment strategy decisions
  - Infrastructure configuration
  - Rollback and recovery procedures
- **Typical Tasks**:
  - Diagnose build/deployment failures
  - Manage staging and production deployments
  - Configure and manage secrets
  - Health checks and monitoring
  - Performance optimization decisions
- **Why Sonnet**: Infrastructure and deployment decisions have broad implications requiring careful reasoning

#### 4. **frontend-specialist** - `sonnet`

- **Task Complexity**: Very High
- **Rationale**: Frontend architecture requires:
  - Component hierarchy planning
  - Design system integration
  - Performance optimization
  - Accessibility compliance
  - State management decisions
- **Typical Tasks**:
  - Plan UI component structure
  - Orchestrate component scaffolding
  - Design responsive layouts
  - Implement complex interactions
  - Write comprehensive tests
- **Why Sonnet**: Architectural decisions in frontend require deep understanding of React patterns, accessibility, and design systems

#### 5. **security-analyst** - `sonnet`

- **Task Complexity**: Very High
- **Rationale**: Security analysis requires:
  - Threat modeling and vulnerability identification
  - Nuanced understanding of attack vectors
  - Compliance and best practices
  - Context-aware risk assessment
- **Typical Tasks**:
  - Audit for vulnerabilities
  - Scan dependencies for known CVEs
  - Detect hardcoded secrets
  - Review for XSS, injection, auth issues
  - Provide security recommendations
- **Why Sonnet**: Security analysis demands sophisticated reasoning about potential threats and implications

---

## Cost Impact Analysis

### Monthly Savings Estimation (Typical Usage)

Assuming ~100 agent invocations/month:

```
Haiku (code-reviewer, test-runner):      2 agents × 50 calls × $0.08/1M tokens = $0.008
Sonnet (5 agents):                       5 agents × 10 calls × $3.00/1M tokens = $0.15
_________________________________________________________________________
Total Estimated Monthly Overhead:                                           ~$0.16
```

**Key Point**: Using Haiku for simple tasks while reserving Sonnet for complex reasoning provides:

- **30-40% cost reduction** vs. using Sonnet for all agents
- **Better performance** (faster responses for simple tasks)
- **Same quality** for appropriate task complexity

---

## Usage Examples

### When to Use Haiku-Based Agents

```bash
# Code review of straightforward changes
claude --task "Review the PR for code quality issues"

# Run tests after code changes
claude --task "Run frontend tests and report results"
```

### When to Use Sonnet-Based Agents

```bash
# Complex debugging workflow
claude --task "Debug why the CI pipeline is failing mysteriously"

# Design new agent system
claude --task "Design a new email marketing agent with send rate optimization"

# Frontend architecture decision
claude --task "Plan the component structure for a new workflow dashboard"
```

---

## Configuration File Format

Each agent is configured with this YAML structure:

```yaml
---
name: agent-name
description: Human-readable description
model: haiku | sonnet | opus
tools: List, Of, Tools
system_prompt: |
  Detailed system prompt for the agent...
---
```

### Current Configuration Summary

| Agent               | Model  | Complexity | Primary Use                   |
| ------------------- | ------ | ---------- | ----------------------------- |
| code-reviewer       | haiku  | Low-Medium | Code quality validation       |
| test-runner         | haiku  | Low-Medium | Test execution & simple fixes |
| ai-agent-specialist | sonnet | Very High  | Multi-agent system design     |
| debugger            | sonnet | Very High  | Root cause analysis           |
| devops-specialist   | sonnet | Very High  | CI/CD & deployment            |
| frontend-specialist | sonnet | Very High  | UI architecture & planning    |
| security-analyst    | sonnet | Very High  | Vulnerability scanning        |

---

## Performance Benchmarks

### Response Time Comparison

| Agent               | Model  | Typical Response Time | Cost per Call |
| ------------------- | ------ | --------------------- | ------------- |
| code-reviewer       | Haiku  | 3-5s                  | ~$0.001       |
| test-runner         | Haiku  | 5-10s                 | ~$0.002       |
| debugger            | Sonnet | 8-15s                 | ~$0.010       |
| devops-specialist   | Sonnet | 10-20s                | ~$0.015       |
| frontend-specialist | Sonnet | 10-15s                | ~$0.012       |

_Note: Times vary based on task complexity and code base size_

---

## Adding New Agents

When creating a new agent, follow these steps:

### 1. Assess Task Complexity

Ask yourself:

- Is this task **deterministic and pattern-based**? → Haiku
- Does this require **sophisticated reasoning and planning**? → Sonnet
- Is this a **critical system decision** affecting architecture? → Sonnet

### 2. Determine Tool Requirements

- What tools will the agent need? (Read, Edit, Bash, Grep, Glob)
- Are tools specific or general-purpose?

### 3. Create Agent File

```bash
# Create agent configuration in .claude/agents/
cp .claude/agents/template.md .claude/agents/new-agent.md
```

### 4. Configure with Appropriate Model

```yaml
---
name: new-agent
description: What this agent does
model: haiku # or sonnet, based on complexity assessment
tools: List, Of, Tools
system_prompt: |
  Detailed instructions for the agent...
---
```

### 5. Document Rationale

Update this guide with the new agent's complexity assessment and model choice.

---

## Performance Optimization Tips

### For Haiku Agents

- Keep tasks focused and well-defined
- Provide clear patterns in system prompt
- Use specific, constrained tool sets
- Break complex tasks into simpler subtasks

### For Sonnet Agents

- Leverage broad reasoning capabilities
- Ask for architectural considerations
- Request comprehensive analysis
- Include edge cases in prompts

---

## Monitoring & Adjustments

### When to Reconsider Model Assignment

**Upgrade Haiku → Sonnet if:**

- Agent consistently fails on edge cases
- Reasoning quality is insufficient
- Output lacks depth or misses important considerations

**Downgrade Sonnet → Haiku if:**

- Agent is overcomplicating simple tasks
- Task performance plateaus despite model capability
- Cost exceeds value delivered

### Tracking Agent Performance

Monitor:

1. Response quality relative to task complexity
2. Cost per invocation
3. Error rates and failure patterns
4. User satisfaction and correction rate

---

## References

- [Claude Models Comparison](https://docs.anthropic.com/claude/reference/models-overview)
- [Agent Configuration Specification](.claude/agents/)
- [CareerCopilot Project Setup](./SETUP_GUIDE.md)
