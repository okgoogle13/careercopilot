# Skills Development & Tooling

The project includes automation scripts for creating and validating Claude Code skills following [Anthropic's official guidelines](https://github.com/anthropics/skills/blob/main/skill-creator/SKILL.md).

## Skill Creation Tool

### Initialize a New Skill

```bash
python3 .claude/scripts/init-skill.py <skill-name> [--path <output-directory>]

# Examples:
python3 .claude/scripts/init-skill.py my-awesome-skill
python3 .claude/scripts/init-skill.py database-migrator --path .claude/skills
```

### Generated Structure

**What it creates:**

- `SKILL.md` - Main skill definition with YAML frontmatter and workflow
- `README.md` - Development notes and guidelines
- `scripts/` - Directory for automation scripts (bash, python)
- `references/` - Directory for detailed documentation
- `assets/` - Directory for templates and boilerplate files

## Skill Validation & Packaging Tool

### Validate a Skill

```bash
python3 .claude/scripts/package-skill.py <path/to/skill> [--validate-only]

# Examples:
python3 .claude/scripts/package-skill.py .claude/skills/my-skill --validate-only
python3 .claude/scripts/package-skill.py .claude/skills/my-skill dist/
```

### Validation Checks

- ✅ SKILL.md exists with valid YAML frontmatter
- ✅ Required fields: `name`, `description`
- ✅ Description includes "when to use" triggers
- ✅ SKILL.md under 500 lines (recommended)
- ✅ Lowercase directory names (`scripts/`, `references/`, `assets/`)
- ✅ References one level deep (no nested subdirectories)
- ✅ Reference files over 100 lines have table of contents
- ✅ No auxiliary docs (README.md excluded from package)
- ✅ Scripts are executable (`chmod +x`)

### Package Output

- Creates `.skill` file (zip format) ready for distribution
- Excludes README.md and auxiliary documentation
- Includes only essential skill resources

## Skill Development Best Practices

### Structure Guidelines

1. **Keep SKILL.md concise** - Under 500 lines, move detailed content to `references/`
2. **Progressive disclosure** - Load content in layers (metadata → SKILL.md → references)
3. **Single-level references** - All reference files directly in `references/`, no nesting
4. **Table of contents** - Add TOC to reference files over 100 lines
5. **Executable scripts** - Always `chmod +x` your automation scripts
6. **Clear descriptions** - Include both functionality and "when to use" triggers

### Description Examples

**Good Description:**

```yaml
description: "Runs or writes Playwright tests for the webapp. Use when asked to 'run playwright' or 'write a new e2e test'."
```

**Needs Improvement:**

```yaml
description: "Example skill demonstrating YAML best practices"
# Missing: When to use this skill!
```

## Backend API Development & Integration Skills

### Complete Reference

See `docs/INTEGRATION_ARCHITECTURAL_GUIDE.md` for full stack integration details, type safety contracts, and component mapping.

### Key Skills

- `fastapi-endpoint-scaffolder` - Create new FastAPI endpoints
- `pydantic-model-scaffolder` - Create type-safe Pydantic models
- `api-contract-validator` - Validate TypeScript ↔ Pydantic contracts
- `frontend-backend-mapper` - Analyze integration health

### Quick Start

```bash
# Create new endpoint
"Use fastapi-endpoint-scaffolder to create user notifications endpoint"

# Validate integration
"Use api-contract-validator to check all API contracts"

# Map integrations
"Use frontend-backend-mapper to analyze integration health"
```

## Skill Audit Report

### Current Status

- **Audit Report**: `docs/architecture/SKILL_AGENT_MATRIX.md` (Complete skill and agent reference)
- **Backend Architecture**: `docs/architecture/BACKEND_REFACTORING_SUMMARY.md` (DRY refactoring patterns)
- **Compliance Status**: 95% (19/20 skills passing validation)
- **Last Audit**: 2025-11-18

### Validation Metrics

| Metric                    | Current   | Target      |
| ------------------------- | --------- | ----------- |
| Skills Passing Validation | 19/20     | 20/20       |
| Average Skill Length      | 450 lines | < 500 lines |
| Skills with TOC           | 8/10      | 10/10       |
| Executable Scripts        | 95%       | 100%        |

## Tooling Scripts

### Skill Management

```bash
# List all skills
find .claude/skills -name "SKILL.md" | sort

# Validate all skills
for skill in .claude/skills/*/; do
  python3 .claude/scripts/package-skill.py "$skill" --validate-only
done

# Package all skills
mkdir -p dist/
for skill in .claude/skills/*/; do
  python3 .claude/scripts/package-skill.py "$skill" dist/
done
```

### Development Workflow

```bash
# 1. Create new skill
python3 .claude/scripts/init-skill.py my-new-skill

# 2. Edit skill definition
vim .claude/skills/my-new-skill/SKILL.md

# 3. Validate skill
python3 .claude/scripts/package-skill.py .claude/skills/my-new-skill --validate-only

# 4. Test skill
# (Test with Claude Code)

# 5. Package for distribution
python3 .claude/scripts/package-skill.py .claude/skills/my-new-skill dist/
```

## Quality Assurance

### Automated Checks

The validation tool performs the following automated checks:

1. **YAML Frontmatter Validation**
   - Required fields present
   - Valid YAML syntax
   - Proper data types

2. **File Structure Validation**
   - Required directories exist
   - Proper naming conventions
   - No nested subdirectories in references/

3. **Content Quality Checks**
   - Description includes usage triggers
   - File size limits enforced
   - TOC requirements for long files

4. **Script Validation**
   - Scripts are executable
   - Proper file permissions
   - No auxiliary docs in package

### Manual Review Guidelines

1. **Functionality Testing**
   - Test skill with Claude Code
   - Verify expected outputs
   - Check error handling

2. **Documentation Review**
   - Clear usage instructions
   - Comprehensive examples
   - Proper formatting

3. **Integration Testing**
   - Test with different contexts
   - Verify tool interactions
   - Check edge cases

## Troubleshooting

### Common Issues

1. **YAML Validation Errors**
   - Check indentation (spaces vs tabs)
   - Verify quote usage
   - Validate special characters

2. **File Permission Issues**

   ```bash
   # Fix script permissions
   chmod +x .claude/skills/*/scripts/*
   ```

3. **Package Creation Failures**
   - Check for missing required files
   - Verify directory structure
   - Validate file sizes

### Debug Commands

```bash
# Debug skill validation
python3 .claude/scripts/package-skill.py .claude/skills/my-skill --validate-only --verbose

# Check file structure
tree .claude/skills/my-skill/

# Validate YAML syntax
python3 -c "import yaml; yaml.safe_load(open('.claude/skills/my-skill/SKILL.md'))"
```

## Best Practices Summary

### Do's

- ✅ Keep descriptions specific with usage triggers
- ✅ Use progressive disclosure for complex content
- ✅ Maintain single-level reference structure
- ✅ Include TOC for long reference files
- ✅ Make all scripts executable
- ✅ Test skills thoroughly before packaging

### Don'ts

- ❌ Write vague descriptions without usage context
- ❌ Create nested reference directories
- ❌ Include auxiliary documentation in packages
- ❌ Forget to validate before packaging
- ❌ Use tabs instead of spaces in YAML
- ❌ Exceed recommended file size limits

## Future Enhancements

- **Automated Testing**: Integration with Claude Code for automated skill testing
- **Template Library**: Pre-built skill templates for common patterns
- **Dependency Management**: Track skill dependencies and versions
- **Marketplace**: Skill distribution and discovery platform
