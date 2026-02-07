---
name: careercopilot-tool-creator
description: "Scaffolds a new Python tool utility in 'src/tools/' for agents to call. Tools are utility functions (web scraping, PDF parsing, database queries) that agents use. Use when creating utilities that agents depend on."
version: 1.0.0
tags: []
---

## Purpose

Scaffolds new Python utility tools in `src/tools/` for agents to use for specialized tasks like web scraping or database queries.

## When to Use

- When needing a new modular utility function for AI agents.
- When expanding the toolset of the CareerCopilot ecosystem.

## Process

1. **Input**: Ask for the tool's file name.
2. **Template**: Read the standard tool template from `templates/tool.py.tpl`.
3. **Injection**: Replace placeholders (e.g., `{{TOOL_NAME}}`) with metadata.
4. **Creation**: Write the new tool to `src/tools/`.
5. **Integration**: Advise the user on adding the tool to `__init__.py` and agent files.
