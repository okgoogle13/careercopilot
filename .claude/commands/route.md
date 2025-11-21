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

| Task Type | Routes To | Savings |
|-----------|-----------|---------|
| Code analysis/review | gemini-wrapper | 40-55% |
| Error diagnosis | gemini-wrapper | 50% |
| Refactoring suggestions | gemini-wrapper | 35% |
| Architecture analysis | gemini-wrapper | 45% |
| Performance optimization | gemini-wrapper | 55% |
| Configuration lookup | configuration | 94.9% |
| Documentation lookup | documentation | 93.3% |
| Flow execution | genkit | 99.1% |
| GitHub PR/issue | github | 80% |

## Key Rules (ENFORCED)

✅ **DO:**
- Delegate analysis to Gemini (40-55% cheaper)
- Use cache servers for lookups (93-99% savings)
- Combine routes for multi-step tasks (80%+ total)
- Report token savings in your response

❌ **DO NOT:**
- Analyze code yourself when Gemini available
- Read raw files when cache servers exist
- Execute flows without genkit server
- Browse GitHub UI when MCP available

## Decision Tree

```
User Task Arrives
  ├─ Analysis (code review, debug, optimize)?
  │  └─ Route to: gemini-wrapper (40-55%)
  ├─ Factual Lookup (config, docs, facts)?
  │  └─ Route to: documentation or configuration (93-99%)
  ├─ Flow Execution (run, check, validate)?
  │  └─ Route to: genkit (99.1%)
  ├─ Repository Work (PR, issue, file)?
  │  └─ Route to: github (80%)
  └─ Multi-step Task?
     └─ Route to: Primary + Secondary (80%+ combined)
```

## Server Details

**Priority 10: gemini-wrapper**
- Model: gemini-1.5-flash
- Methods: analyze_code, refactoring_suggestions, error_diagnosis, architecture_analysis, optimization_analysis, documentation_insights, explain_text
- Use for: Analysis, optimization, insights

**Priority 9: claude-orchestrator**
- Methods: health_check_all, execute_batch
- Use for: Fallback, multi-step orchestration

**Priority 9: github**
- Methods: read_file, list_issues, get_pull_request
- Use for: Repository operations

**Priority 8: documentation**
- Savings: 93.3%
- Methods: search_docs, get_docs, get_agents, get_skills
- Use for: Documentation lookups, factual queries

**Priority 7: configuration**
- Savings: 94.9%
- Methods: get_environment, list_scripts, validate_all
- Use for: Config lookups, script discovery

**Priority 6: genkit**
- Savings: 99.1%
- Methods: list_flows, get_flow, execute_flow
- Use for: Flow execution and caching

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
