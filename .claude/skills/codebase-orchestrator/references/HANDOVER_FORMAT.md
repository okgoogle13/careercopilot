# Automated Handover Format Specification

**Version:** 1.0
**Purpose:** Compact, machine-readable task handoff from orchestrator to Gemini 3 Pro
**Transport:** MCP (Filesystem, Git, Testing)
**Token Budget:** 2K-3K tokens (87% reduction vs. separate documents)

---

## Schema Overview

```json
{
  "handover": {
    "v": "1.0",
    "target": "gemini-3-pro:mcp",
    "transport": {"fs": boolean, "git": boolean, "test": boolean},
    "budget_tokens": number,
    "tasks": [task_object],
    "refs": {tokens: string, examples: [string]},
    "recovery": {error_type: string},
    "checkpoints": [string]
  }
}
```

---

## Complete Field Specification

### Root Level

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `v` | string | Yes | Schema version (e.g., "1.0") |
| `target` | string | Yes | Target agent (e.g., "gemini-3-pro:mcp") |
| `transport` | object | Yes | Available MCP servers (fs, git, test) |
| `budget_tokens` | number | Yes | Estimated token cost for task execution |
| `tasks` | array | Yes | Task array (ordered by priority) |
| `refs` | object | Yes | Critical references (token system, examples) |
| `recovery` | object | Yes | Error recovery procedures |
| `checkpoints` | array | Yes | Progress reporting gates |

---

## Task Object Specification

### Cleanup Task

```json
{
  "id": "cleanup_dupes",
  "type": "delete",
  "priority": 0,
  "phase": "phase_1",
  "description": "Delete 10 duplicate component files",
  "files": [
    "frontend/src/components/core/Pebble 2.tsx",
    "frontend/src/components/core/Stone 2.tsx",
    "..."
  ],
  "cmd": "git rm {files}",
  "commit_msg": "chore: remove duplicate component files",
  "success_criteria": "10 files deleted, clean git history"
}
```

### Component Migration Task

```json
{
  "id": "migrate_<component>",
  "type": "component_migration",
  "priority": 1,
  "phase": "phase_2",
  "component_name": "Lens",
  "semantic_name": "TextField",
  "description": "Migrate Lens component from Material 3 to kerala-rage",
  "file": "frontend/src/components/inputs/Lens.tsx",
  "blocking": "Core form input - blocks form adoption",
  "dependencies": ["token-system"],
  "transforms": {
    "M3Color": "ncColor.[DEPRECATED_STYLE]",
    "fontFamily:Roboto": "ncFont.body",
    "fontFamily:Inter": "ncFont.body",
    "elevation": "ncShadow.[DEPRECATED_STYLE]",
    "borderRadius:8px": "borderRadius:[DEPRECATED_STYLE]"
  },
  "token_refs": {
    "colors": "ncColorBotanical",
    "fonts": "ncFontBody",
    "shapes": "ncShapeOrganic",
    "shadows": "ncShadow*"
  },
  "test": "npm test -- --testPathPattern=Lens --json",
  "commit_msg": "refactor(components): migrate Lens to kerala-rage",
  "tokens_estimate": 1800,
  "success_criteria": [
    "All tests passing",
    "No broken imports",
    "Clean commit",
    "Token system applied"
  ]
}
```

### Audit Task

```json
{
  "id": "final_audit",
  "type": "audit",
  "priority": 99,
  "phase": "phase_3",
  "description": "Final validation of all migrations",
  "tests": [
    "npm run lint frontend/src/components/",
    "npm test frontend/src/components/ --json"
  ],
  "report": {
    "include": [
      "components_migrated_count",
      "tests_passing_percent",
      "new_completion_pct",
      "failures_count",
      "git_history_clean"
    ]
  },
  "success_criteria": "All tests pass, linting pass, 100% completion"
}
```

---

## References Object

```json
{
  "refs": {
    "tokens": "frontend/src/design-tokens/kerala-rage-tokens.ts",
    "examples": [
      "frontend/src/components/core/Pebble.tsx",
      "frontend/src/components/core/Stone.tsx"
    ],
    "mcp_config": {
      "fs_batch": true,
      "git_auto_commit": true,
      "test_json_output": true
    }
  }
}
```

---

## Recovery Procedures Object

```json
{
  "recovery": {
    "test_fail": {
      "action": "auto_revert",
      "procedure": "git revert <commit>",
      "report": "document error, halt phase",
      "resume": "await user guidance"
    },
    "token_missing": {
      "action": "halt",
      "procedure": "report which token missing",
      "report": "which token, in which component",
      "resume": "after token system update"
    },
    "import_error": {
      "action": "auto_revert",
      "procedure": "git revert <commit>, check npm install",
      "report": "import error details, dependency check",
      "resume": "verify deps, retry component"
    },
    "blocked_dependency": {
      "action": "halt",
      "procedure": "document blocking dependency",
      "report": "blocking component, reason, required fix",
      "resume": "resolve dependency, restart phase"
    }
  }
}
```

---

## Checkpoints Array

```json
{
  "checkpoints": [
    "after_cleanup_complete",
    "after_each_component_migrated",
    "after_all_tests_pass",
    "final_report_generated"
  ]
}
```

At each checkpoint, Gemini reports:
- Component completed
- Tests passing (Y/N)
- New completion percentage
- Blockers identified (if any)

---

## Complete Example Output

```json
{
  "migration_status": {
    "total": 46,
    "migrated": 8,
    "legacy": 9,
    "completion_pct": 17
  },
  "handover": {
    "v": "1.0",
    "target": "gemini-3-pro:mcp",
    "transport": {
      "fs": true,
      "git": true,
      "test": true
    },
    "budget_tokens": 2000,
    "tasks": [
      {
        "id": "cleanup_dupes",
        "type": "delete",
        "priority": 0,
        "phase": "phase_1",
        "files": 10,
        "cmd": "git rm <files>",
        "commit_msg": "chore: remove duplicates"
      },
      {
        "id": "migrate_lens",
        "type": "component_migration",
        "priority": 1,
        "phase": "phase_2",
        "component": "Lens",
        "file": "frontend/src/components/inputs/Lens.tsx",
        "blocking": "form adoption",
        "deps": ["token-system"],
        "test": "npm test -- Lens",
        "tokens_estimate": 1800
      },
      {
        "id": "migrate_mark",
        "type": "component_migration",
        "priority": 2,
        "phase": "phase_2",
        "component": "Mark",
        "file": "frontend/src/components/inputs/Mark.tsx",
        "blocking": "KeywordTagGroup",
        "deps": ["Pebble"],
        "test": "npm test -- Mark",
        "tokens_estimate": 1600
      },
      {
        "id": "final_audit",
        "type": "audit",
        "priority": 99,
        "phase": "phase_3",
        "tests": ["npm run lint", "npm test"],
        "report_include": [
          "migrated_count",
          "tests_passing",
          "completion_pct"
        ]
      }
    ],
    "refs": {
      "tokens": "frontend/src/design-tokens/kerala-rage-tokens.ts",
      "examples": [
        "frontend/src/components/core/Pebble.tsx",
        "frontend/src/components/core/Stone.tsx"
      ]
    },
    "recovery": {
      "test_fail": "auto_revert",
      "token_missing": "halt_report",
      "import_error": "revert_check_deps"
    },
    "checkpoints": [
      "after_cleanup",
      "per_component",
      "final_audit"
    ]
  }
}
```

---

## Token Efficiency Principles

### What's Included (Minimal)
- ✅ Task ID and type
- ✅ Component name and file path
- ✅ Token system references (paths only)
- ✅ Transform patterns (shorthand)
- ✅ Test command
- ✅ Commit message
- ✅ Error recovery rules

### What's NOT Included (Eliminated)
- ❌ Verbose descriptions (use task ID for reference)
- ❌ Step-by-step guides (Gemini knows patterns)
- ❌ Full MCP configuration (hints only)
- ❌ Repeated examples (one per category)
- ❌ Duplicate documentation (reference docs once)

### Size Comparison
```
Original Approach: 7 separate files
- GEMINI_HANDOVER_MANIFEST.md: 6,000 tokens
- component-migration.json: 4,500 tokens
- HANDOVER_SUMMARY.txt: 1,200 tokens
- HANDOFF_CHECKLIST.md: 2,000 tokens
- component-migration-handover.md: 5,000 tokens
- mcp-gemini-config.json: 1,500 tokens
- README.md: 800 tokens
TOTAL: 20,000 tokens

Embedded Approach: Single output
- Orchestrator base output: 1,000 tokens
- Handover section: 2,000 tokens
TOTAL: 3,000 tokens

SAVINGS: 85% reduction (17K tokens saved)
```

---

## MCP Integration Patterns

### Filesystem MCP (Read)
Gemini reads file content for current state:
```json
{
  "file": "frontend/src/components/inputs/Lens.tsx",
  "operation": "read",
  "response_format": "content"
}
```

### Git MCP (Write)
Gemini commits changes:
```json
{
  "operation": "commit",
  "files": ["Lens.tsx"],
  "message": "refactor(components): migrate Lens to kerala-rage"
}
```

### Testing MCP (Execute)
Gemini runs tests and captures output:
```json
{
  "operation": "test",
  "command": "npm test -- Lens",
  "output_format": "json"
}
```

---

## Validation Checklist

Before sending handover to Gemini, verify:

- [ ] JSON is valid and parseable
- [ ] All tasks have unique IDs
- [ ] Tasks ordered by priority (0 first)
- [ ] Token budget is realistic (< 3K)
- [ ] References are valid paths
- [ ] Recovery procedures cover all error types
- [ ] Checkpoints are named clearly
- [ ] Transforms match token system exports
- [ ] Test commands are executable
- [ ] Total output < 3K tokens

---

## Usage Pattern for Orchestrator

When orchestrator is invoked for handover:

1. **Assess current state** (standard output)
2. **Identify critical path** (component priorities)
3. **Generate task array** (ordered by impact)
4. **Embed in output** (under "handover" key)
5. **Include references** (token system paths only)
6. **Add recovery rules** (error handling)
7. **Set checkpoints** (progress tracking)

Result: Single JSON output, machine-readable, immediately executable.

---

## Related Documentation

- **Codebase Orchestrator Skill**: `.claude/skills/codebase-orchestrator/SKILL.md`
- **Compliance Dashboard Skill**: `.claude/skills/compliance-dashboard/SKILL.md`
- **Component Migration Plan**: `.claude/plans/partitioned-sleeping-nova.md`
