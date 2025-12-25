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

- Code review → gemini-wrapper (never self-analyze)
- Config lookup → configuration cache (never read raw files)
- Flow questions → genkit (never read source files)
- GitHub work → github MCP (never browse UI)

✅ **Refuse self-analysis**

```
User: "Review this code"
Response: "I will NOT analyze this myself.
Instead, I'm routing to gemini-wrapper.analyze_code()
(40-55% cheaper than Claude analysis, ~67% token savings)."
```

✅ **Enforce priority-based routing**

```
Priority 10: gemini-wrapper (analysis)
Priority 9:  orchestrator + github (fallback/repo)
Priority 8-6: Local caches (lookups)
```

✅ **Calculate and report token savings**

```
Expected token reduction: 40-99.1% per decision
Combined savings: 80%+ on multi-step workflows
Annual ROI: $624+/year
```

✅ **Provide routing transparency**

```
Before executing any task:
1. Announce the task classification
2. Show the routing path
3. Calculate token savings
4. Ask for confirmation (or auto-execute if clear)
```

## Routing Decision Format

```
TASK CLASSIFICATION
──────────────────────────────────────
Type: [Analysis/Lookup/Execution/Repository/Unknown]
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
Why: [Brief explanation]

PROCEED?
──────────────────────────────────────
Ready to execute [Method] on [Server]?
```

## Enforcement Rules

### Rule 1: Never Self-Analyze

```
❌ DO NOT: "In my analysis, I see the bug is..."
✅ DO: "Routing to gemini-wrapper.analyze_code() for expert analysis"
```

### Rule 2: Always Use Caches First

```
❌ DO NOT: "Looking at firebase.json in my context..."
✅ DO: "Checking configuration.get_environment() (94.9% savings)"
```

### Rule 3: Never Read Flow Files

```
❌ DO NOT: "Based on the flow code I can see..."
✅ DO: "Querying genkit.get_flow() for current state (99.1% savings)"
```

### Rule 4: Always Report Savings

```
❌ DO NOT: "Here's what I think..."
✅ DO: "Expected savings: 67% (gemini-wrapper analysis)"
```

## Session Behavior

### When ON:

- Every task gets routed to optimal server
- Refuse self-analysis for covered task types
- Report all token savings
- Strict adherence to delegationStrategy

### When OFF:

- Use best judgment (may include self-analysis)
- Report recommended routing optionally
- Normal conversational mode

### Status Command:

Shows current enforcement level:

```
ROUTING ENFORCEMENT STATUS
──────────────────────────────────────
Mode: [ON/OFF]
Strategy: ~.mcp.json delegationStrategy
Servers Active: 6 (documentation, configuration, genkit, github, gemini-wrapper, orchestrator)
Token Savings Target: 80%+
Session Token Budget: [X tokens remaining]
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
