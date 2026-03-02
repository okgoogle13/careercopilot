---
name: careercopilot-agent-scaffolder
description: Scaffolds a new Python agent for autonomous AI tasks in 'src/agents/'.
  Agents are autonomous components that handle complex operations (resume analysis,
  job matching, KSC generation). Use when asked to create a new AI agent or automation
  component.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags: []
---

## Purpose

Scaffolds new Python agents in `src/agents/` to handle autonomous, complex AI operations like analysis or matching.

## When to Use

- When creating a new specialized agent component.
- When establishing a new autonomous workflow within the project.

## Process

1. **Input**: Ask for the new agent's name.
2. **Template**: Read the agent template from `templates/agent.py.tpl`.
3. **Injection**: Replace `{{AGENT_NAME}}` placeholder.
4. **Creation**: Write the file to `src/agents/`.
5. **Reporting**: Show the path to the newly created agent.
