---
name: example-skill
description: Example skill demonstrating YAML best practices. Use when learning skill
  structure, reviewing formatting standards, or creating new skills as a reference.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags:
    - example
    - reference
    - yaml
---

# Example Skill

This is a reference implementation showing YAML best practices.

## Purpose

Provides a reference implementation demonstrating proper YAML formatting, frontmatter structure, and skill documentation standards for creating new Claude Code skills.

## Process

1. **Review Structure**: Examine frontmatter fields (name, description, version, tags)
2. **Study Formatting**: Observe indentation, spacing, and section organization
3. **Apply Patterns**: Use as template when creating new skills
4. **Validate**: Ensure new skills match this reference format

## When to Use

- When learning skill structure and formatting standards
- When creating new skills as a reference template
- When reviewing or updating existing skills for compliance
- When training others on skill creation best practices

## Features

- Clean, consistent formatting
- Proper indentation (2 spaces)
- Clear section organization
- Helpful comments

## Usage

```yaml
# Example configuration
config:
  enabled: true
  timeout: 30s
  retries: 3
```

## Reference Files

- `references/yaml-style-guide.md` - YAML formatting standards
- `references/example-config.md` - Configuration options
