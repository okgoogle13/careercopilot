# /enforce-routing - Activate Strict MCP Routing Mode

Activates strict routing enforcement for this session. When enabled, all task routing decisions will follow the delegationStrategy in ~/.mcp.json exactly.

## Usage

```
/enforce-routing [on|off|status]
```

## Examples

```
/enforce-routing on          # Enable strict routing
/enforce-routing off         # Disable strict routing
/enforce-routing status      # Show current status
```

## What Happens When Enabled

When strict routing is ON, I will:

✅ **Always follow the Routing Logic Table**

- Bulk Analysis → `flash-sidekick` (never self-analyze)
- Design Audit → `design-system-sidekick` (never eye-ball)
- Error Diagnosis → `sentry` (never guess)
- Repository Work → `github` MCP (never browse UI)

✅ **Refuse self-analysis**

```text
User: "Review this code"
Response: "I will NOT analyze this myself.
Instead, I'm routing to flash-sidekick.batch_file_analysis()
(95% token savings vs Claude analysis)."
```

✅ **Enforce priority-based routing**

```text
Priority 10: flash-sidekick (bulk analysis)
Priority 9:  design-system-sidekick (visual truth)
Priority 8:  sentry / github (production / repo)
```

✅ **Calculate and report token savings**

```text
Expected token reduction: 80-97% per decision
Combined savings: 90%+ on multi-step workflows
```

✅ **Provide routing transparency**

```text
Before executing any task:
1. Announce the task classification
2. Show the routing path (MCP Server + Method)
3. Calculate token savings
4. Ask for confirmation (or auto-execute if clear)
```

## Routing Decision Format

```text
TASK CLASSIFICATION
──────────────────────────────────────
Type: [Bulk Analysis/Visual/Diagnostic/Repository/Unknown]
Confidence: [High/Medium/Low]

ROUTING PATH
──────────────────────────────────────
Step 1: [Primary Server] → [Method]
  └─ Expected Savings: [X]%
Step 2: [Secondary Server] (optional) → [Method]
  └─ Expected Savings: [Y]%

COMBINED IMPACT
──────────────────────────────────────
Total Token Reduction: [X+Y]%
Why: [Brief explanation of why MCP is more efficient than local context]

PROCEED?
──────────────────────────────────────
Ready to execute [Method] on [Server]?
```

## Enforcement Rules

### Rule 1: Never Self-Analyze Bulk Data

```text
❌ DO NOT: "In my analysis of these 15 files, I see..."
✅ DO: "Routing to flash-sidekick.batch_file_analysis() for efficient processing"
```

### Rule 2: Always Use Visual Truth

```text
❌ DO NOT: "The UI looks correct based on the code..."
✅ DO: "Validating with design-system-sidekick.validate_asset_compliance()"
```

### Rule 3: Never Guess on Errors

```text
❌ DO NOT: "Based on this snippet, the error might be..."
✅ DO: "Querying sentry.analyze_issue_with_seer() for root cause (92% savings)"
```

### Rule 4: Always Report Savings

```text
❌ DO NOT: "Here's what I found..."
✅ DO: "Expected savings: 96% (using flash-sidekick summarization)"
```

## Session Behavior

### When ON

- Every task gets routed to optimal MCP server
- Refuse self-analysis for covered task types
- Report all token savings
- Strict adherence to AGENTS.md routing matrix

### When OFF

- Use best judgment (may include self-analysis)
- Report recommended routing optionally
- Normal conversational mode

### Status Command

Shows current enforcement level:

```text
ROUTING ENFORCEMENT STATUS
──────────────────────────────────────
Mode: [ON/OFF]
Servers Active: flash-sidekick, design-system-sidekick, sentry, github, playwright, vision-scorer
Token Savings Target: 90%+
```

## Examples of Strict Routing in Action

### Example 1: Code Review Request

```
User: "Review this code for performance issues"

[STRICT ROUTING MODE: ON]

TASK CLASSIFICATION: Code Analysis
ROUTING PATH: gemini-wrapper.analyze_code()
TOKEN SAVINGS: 55% (vs Claude self-analysis)

→ Executing: gemini-wrapper.analyze_code(code, language="python")
```

### Example 2: Config Lookup

```
User: "What's our Firebase configuration?"

[STRICT ROUTING MODE: ON]

TASK CLASSIFICATION: Factual Lookup
ROUTING PATH: configuration.get_environment()
TOKEN SAVINGS: 94.9% (vs reading raw files)

→ Executing: configuration.get_environment(env="production")
```

### Example 3: Error Diagnosis (Multi-Step)

```
User: "Why is my Genkit flow timing out?"

[STRICT ROUTING MODE: ON]

TASK CLASSIFICATION: 2-Part (Diagnostic + Analysis)
ROUTING PATH:
  Step 1: genkit.get_flow() for context (99.1% savings)
  Step 2: gemini-wrapper.error_diagnosis() for analysis (50% savings)
COMBINED SAVINGS: 75%+

→ Step 1: genkit.get_flow("timing_out_flow")
→ Step 2: gemini-wrapper.error_diagnosis(error_logs, context)
```

## Configuration

Routing rules come from:

- **~/.mcp.json** → `delegationStrategy` object
- **Analysis Routing** → gemini-wrapper (Priority 10)
- **Cache Routing** → documentation/configuration (Priority 8-7)
- **Execution Routing** → genkit (Priority 6)
- **Repository Routing** → github (Priority 9)

## Related Commands

- `/route` - Get routing recommendation for any task
- `/enforcement` - Same as `/enforce-routing`

## Reference Documents

- Routing Specialist Skill: `.claude/skills/mcp-routing-specialist/SKILL.md`
- Quick Reference: `.claude/docs/ROUTING_QUICK_REFERENCE.md`
- Verification Tests: `.claude/docs/ROUTING_VERIFICATION_TEST.md`
- Delegation Strategy: `.claude/docs/GEMINI_DELEGATION_STRATEGY.md`

---

**Goal:** Enforce 80%+ token efficiency through strict MCP routing
**Status:** Production-ready
**Default:** OFF (use /enforce-routing on to activate)
**Version:** 1.0
