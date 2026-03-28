# /route - MCP Routing Decision Engine

Instantly get the optimal MCP server routing for any task. Use this command to enforce the delegationStrategy and achieve 80%+ token efficiency.

## Usage

```
/route [task description]
```

## Examples

```
/route review this React component for bugs
/route what's the firebase configuration
/route why is my genkit flow timing out
/route optimize this database query
/route list the available automation scripts
```

## What It Does

1. **Analyzes** your task against the Routing Logic Table
2. **Determines** the optimal MCP server(s)
3. **Calculates** token savings
4. **Recommends** the routing path
5. **Explains** why that path is optimal

## Routing Logic (Enforced)

| Task Type                    | Routes To                | Savings |
| ---------------------------- | ------------------------ | ------- |
| Read 10+ files / Summarize   | `flash-sidekick`         | 96%     |
| Grep + read matches          | `flash-sidekick`         | 97%     |
| Code quality / Unit tests    | `flash-sidekick`         | 95%     |
| Complex reasoning            | `flash-sidekick` (Pro)   | 40-60%  |
| Design validation / Assets   | `design-system-sidekick` | 85%     |
| Visual compliance scoring    | `vision-scorer-mcp`      | 90%     |
| GitHub operations            | `github`                 | 80%     |
| Error analysis (Seer)        | `sentry`                 | 92%     |

## Key Rules (ENFORCED)

✅ **DO:**

- Delegate bulk file reading to `flash-sidekick` (96%+ savings)
- Use `design-system-sidekick` for all KR Solidarity visual checks
- Use `sentry` (Seer) for production error root cause analysis
- Report token savings in your response to the user

❌ **DO NOT:**

- Read large files (>500 lines) locally if `flash-sidekick` can summarize
- Perform manual visual audits if `vision-scorer` can automate them
- Browse GitHub UI when `github` MCP is available
- Hardcode design tokens; use `design-system-sidekick` to validate

## Decision Tree

```
User Task Arrives
  ├─ Bulk Data (read many files, summarize, search)?
  │  └─ Route to: flash-sidekick (96-97%)
  ├─ Code Analysis (quality, tests, refactor)?
  │  └─ Route to: flash-sidekick (95%)
  ├─ Design/Visual (tokens, compliance, assets)?
  │  └─ Route to: design-system-sidekick / vision-scorer (85-90%)
  ├─ Production Errors (sentry issues, releases)?
  │  └─ Route to: sentry (92%)
  └─ Repository Work (PR, issue, branch)?
     └─ Route to: github (80%)
```

## Server Details

**Priority 10: flash-sidekick**

- Methods: `quick_summarize`, `batch_file_analysis`, `analyze_code_quality`, `consult_pro`, `web_research_synthesis`
- Use for: Bulk analysis, token efficiency, deep reasoning, and search grounding.

**Priority 9: design-system-sidekick**

- Methods: `validate_asset_compliance`, `generate_implementation_package`
- Use for: KR Solidarity / kerala-rage visual and token compliance.

**Priority 9: vision-scorer-mcp**

- Methods: `score_asset_compliance`, `extract_visual_tokens`, `compare_attempts`
- Use for: Quantitative visual scoring and design token extraction from images.

**Priority 8: sentry**

- Methods: `analyze_issue_with_seer`, `get_issue_details`, `list_events`
- Use for: Production error analysis and root cause investigation.

**Priority 8: github**

- Methods: `create_pull_request`, `search_code`, `get_file_contents`
- Use for: All repository and CI/CD interaction.

**Priority 7: playwright**

- Methods: `browser_snapshot`, `browser_click`, `browser_type`
- Use for: E2E UI verification and dynamic web content.

## Output Format

When you use `/route`, I will respond with:

```
ROUTING DECISION
═══════════════════════════════════════

Task: [Your task description]
Classification: [Analysis/Lookup/Execution/Repository]

ROUTE PLAN
──────────────────────────────────────
[If multi-step, show all steps]
Step 1: [Server] → [Method] ([Savings]%)
Step 2: [Server] → [Method] ([Savings]%)

COMBINED SAVINGS: [X]%
CONFIDENCE: [High/Medium/Low]

RATIONALE
──────────────────────────────────────
[Explain why this routing is optimal]

PROCEED? [Yes/No/Ask for confirmation]
```

## Token Savings Examples

**Single Decision:**

- Code review: 1,200 tokens → 400 tokens (67% savings)
- Config lookup: 5,000 tokens → 78 tokens (98% savings)

**Multi-Step Workflow:**

- Config lookup + analysis: 5,000 → 600 (88% savings)
- Error diagnosis + fix: 2,000 + 1,500 → 800 (73% savings)

## Configuration Source

Routing rules are defined in `~/.mcp.json` under:

- `delegationStrategy.analysisRouting` (Gemini tasks)
- `delegationStrategy.cacheFirstRouting` (Cache tasks)
- `mcpServers[].priority` (Server priority order)

See `.claude/skills/mcp-routing-specialist/SKILL.md` for full documentation.

## Integration

This command enforces the MCP Routing Specialist skill and uses the delegationStrategy from your project configuration.

**Reference Documents:**

- Routing Specialist Skill: `.claude/skills/mcp-routing-specialist/SKILL.md`
- Verification Tests: `.claude/docs/ROUTING_VERIFICATION_TEST.md`
- Quick Reference: `.claude/docs/ROUTING_QUICK_REFERENCE.md`
- Delegation Strategy: `.claude/docs/GEMINI_DELEGATION_STRATEGY.md`

---

**Goal:** Achieve 80%+ token efficiency by intelligent MCP server routing.
**Status:** Production-ready
**Version:** 1.0
