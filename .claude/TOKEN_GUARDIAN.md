# Token Guardian: Smart Fallback System

**Status:** 🛡️ ACTIVE
**Date:** 2026-01-30
**Purpose:** Mandate sidekick routing when Claude token usage approaches 80% of session limit

---

## System Architecture

### Trigger Levels

| Level | Token Usage | Action | Routing |
|-------|-------------|--------|---------|
| **Green** | 0-60% | Normal operation | Optional sidekick use |
| **Yellow** | 60-80% | Advisory mode | Ask before expensive ops |
| **Red** | 80%+ | Lockdown mode | MANDATORY sidekick routing |

### Red Zone Behavior (80%+ Usage)

When token budget approaches depletion:

**AUTOMATIC ENFORCEMENT:**
- ❌ **BLOCK:** Direct file reads > 2KB
- ❌ **BLOCK:** Sequential grep + file reading workflows
- ❌ **BLOCK:** Multi-file analysis without batching
- ✅ **MANDATE:** All operations route to flash-sidekick or design-system-sidekick
- ✅ **MANDATE:** Session reset proposal every 15min

**NO EXCEPTIONS** — Even if you request direct operations, I will refuse and propose sidekick alternative.

---

## Token Budget Tracking

### Session Budget Allocation

```
Total Budget:        200,000 tokens
─────────────────────────────────
Green Zone (0-60%):  120,000 tokens  ← Normal work
Yellow Zone (60-80%): 40,000 tokens  ← Warnings active
Red Zone (80-100%):  40,000 tokens   ← Lockdown mode
```

### My Internal Token Counter

I will track token usage by:
1. **Counting tool calls** — Each Read/Edit/Bash/Grep call costs ~500-2000 tokens
2. **Estimating file sizes** — Large files multiply token cost
3. **Monitoring output** — Complex responses consume more tokens
4. **Calculating ratios** — If 60% of budget is spent, I enter Yellow Zone

### Trigger Points

**Yellow Zone Entry (120K tokens):**
- "I'm approaching token limits. For the next operation, should I use flash-sidekick?"
- Require explicit confirmation before expensive reads

**Red Zone Entry (160K tokens):**
- "⚠️ Token budget critical (80% used). Switching to sidekick-only mode."
- REFUSE all direct file operations
- Route everything through flash-sidekick or design-system-sidekick

---

## Mandated Sidekick Routing in Red Zone

### When Token Usage ≥ 80%

**File Analysis Request:**
```
User: "Analyze this component"
Me: "⚠️ CRITICAL: Token budget at 82%.
    Instead of reading directly, I'm using flash-sidekick's
    analyze_code_quality tool. This preserves ~1K tokens."
```

**Code Quality Check:**
```
User: "Check this code"
Me: "🛡️ Red Zone Active: Delegating to flash-sidekick
    batch_file_analysis instead of direct reads."
```

**Design Validation:**
```
User: "Validate these design assets"
Me: "🛡️ Red Zone Active: Using design-system-sidekick
    validate_asset_compliance to offload Gemini Vision analysis."
```

**Documentation Request:**
```
User: "Generate API docs"
Me: "🛡️ Red Zone Active: Using flash-sidekick
    create_readme tool instead of reading all files."
```

### Workflow Example in Red Zone

```
[Token Usage: 82% / Red Zone Active]

User: "Check the frontend components"

Me: CANNOT use Read tool (would cost 1-2K tokens)
    MUST use flash-sidekick batch_file_analysis

    Invoking: Task(subagent_type='general-purpose')
    Routing: batch_file_analysis on frontend/src/components/*
    Result: ~200 tokens (99% savings vs. direct read)

    Status: ✅ Operation completed
    New token usage: 82.2% (minimal increase)
```

---

## Preventive Measures

### Yellow Zone (60-80% Usage)

**Automatic Question Before Expensive Ops:**

```
Estimated cost of this operation: ~5K tokens
Current usage: 68% of session budget
You are in YELLOW ZONE.

Option 1: Continue directly (costs 5K)
          Usage after: 73%

Option 2: Use flash-sidekick (costs 200 tokens)
          Usage after: 68.1%

Recommendation: Use Option 2? (Y/n)
```

If you don't respond, I default to sidekick routing.

### Red Zone (80%+ Usage)

**No Choice — Forced Sidekick Routing:**

```
⚠️ CRITICAL TOKEN ALERT
Current usage: 84% of session budget
Status: RED ZONE - Emergency mode active

Your request would normally cost 3K tokens.
I'm routing to flash-sidekick instead (~100 tokens).

This operation will proceed using the sidekick.
If you need further work, please start a NEW session.
```

---

## Session Reset Protocol

### When to Propose New Session

**Automatic triggers:**
- Token usage hits 85% (non-negotiable)
- Every 15 minutes after hitting 80%
- User requests "reset" or "new session"

**Proposal Format:**

```
⏱️ CONTEXT WINDOW APPROACHING LIMIT

Current session has used 162K / 200K tokens (81%)

I recommend:
1. I summarize current progress
2. You start a fresh session
3. Fresh session gets another 200K tokens

Summary of this session:
- ✅ Configured flash-sidekick MCP servers
- ✅ Added custom instructions
- ✅ Implemented token tracking
- 🔄 Next: Deploy design system components

Shall I prepare handoff summary? (Y/n)
```

---

## Implementation Rules (Binding)

### I MUST Refuse These Operations in Red Zone:

1. ❌ Reading any file without checking size first
2. ❌ Sequential analysis (grep, then read each file)
3. ❌ Generating large documentation directly
4. ❌ Bulk code reviews without batching
5. ❌ Multiple large file edits in one request

### I MUST Always Route These in Red Zone:

1. ✅ File analysis (> 2KB) → flash-sidekick
2. ✅ Multi-file operations → batch_file_analysis
3. ✅ Design validation → design-system-sidekick
4. ✅ Documentation generation → create_readme/generate_api_docs
5. ✅ Code quality checks → analyze_code_quality

---

## Token Counter Implementation

### Visible Counter in My Responses

Starting next response, I will include:

```
[Token Usage: 42% ██████░░░░░░░░░░░░ | 84K/200K]
```

**What this means:**
- `42%` = Percentage of session budget used
- `██████░░░░░░░░░░░░` = Visual progress bar
- `84K/200K` = Actual tokens consumed

**Color coding:**
- 🟢 0-60% — Normal (green bar)
- 🟡 60-80% — Warning (yellow bar)
- 🔴 80%+ — Critical (red bar)

### Where Counter Appears

- **Top of each response** (after this policy is active)
- **When entering Yellow Zone** (explicit warning)
- **When entering Red Zone** (with lockdown notice)
- **With token-intensive operations** (before/after comparison)

---

## Fallback Behavior in Action

### Scenario: Token Budget at 78% (Yellow Zone)

```
[Token Usage: 78% ██████████████░░░░ | 156K/200K] 🟡 YELLOW ZONE

User: "Analyze all the backend services"

Me: "⚠️ You're in YELLOW ZONE (78% usage).

    This operation would cost:
    • Direct approach: ~8K tokens → Usage: 82% (Red Zone)
    • Flash-sidekick: ~300 tokens → Usage: 78.2% (stay in Yellow)

    I recommend flash-sidekick. Shall I proceed? (Y/n)

    (Auto-proceeding with sidekick in 10s if no response...)"
```

### Scenario: Token Budget at 82% (Red Zone)

```
[Token Usage: 82% ████████████████░░ | 164K/200K] 🔴 RED ZONE

User: "Check the React components"

Me: "🛡️ RED ZONE ACTIVE - Emergency token preservation mode

    Your request cannot be processed directly (would exceed budget).

    Alternative: I'm using flash-sidekick batch_file_analysis
    Estimated cost: ~200 tokens

    Processing...

    [flash-sidekick] batch_file_analysis on frontend/src/components/
    ✅ Complete: 4 components analyzed, 2 issues found

    Token cost: 215 tokens
    New usage: 82.1%

    ⏱️ Recommended: Start a new session for further work
    Type 'new session' or 'continue' when ready."
```

---

## User Controls

### Explicit Commands Available

**Monitor tokens:**
```
/tokens          → Show current usage
/tokens-detail   → Show breakdown by operation
/reset-session   → Prepare handoff and reset
```

**Override fallback (use carefully):**
```
/force-direct    → Bypass sidekick for ONE operation
                   (costs full tokens, useful for emergencies)
```

**Check sidekick status:**
```
/sidekick-status → Verify all servers running
```

---

## Technical Implementation

### Token Estimation Formula

```
Tokens Used ≈ (Files Read × File Size / 100)
            + (Edits Made × Edit Size / 50)
            + (Bash Commands × Command Complexity / 20)
            + (API Calls × Response Size / 100)
            + (Analysis Output × Complexity / 10)
```

### Safety Margin

I track tokens **conservatively** to avoid overruns:
- Add 10% buffer to estimates
- Treat uncertain costs as maximum cost
- Round up all calculations

### Reset Trigger (Non-Negotiable)

At **160K tokens (80% of 200K budget)**, I:
1. Stop accepting new work
2. Refuse direct file operations
3. Propose session reset
4. Offer handoff summary

---

## Examples: Before vs. After

### Before (Token Bleed)
```
User: "Analyze 5 large backend files"

Me: [reads all 5 files sequentially]
    Cost: 15K tokens

Result: Token budget goes from 78% to 85%+
        Enters Red Zone unprepared
        Must refuse further work
```

### After (Guardian Active at 78%)
```
User: "Analyze 5 large backend files"

Me: ⚠️ Yellow Zone detected
    "Should I use flash-sidekick batch analysis? (Y/n)"

User: "yes"

Me: [delegates to flash-sidekick]
    Cost: 300 tokens

Result: Token budget stays at 78.15%
        Remains in Green Zone
        Work continues smoothly
```

---

## Commitment

This system is **binding on me**. I will:

✅ **ALWAYS track token usage** in real-time
✅ **ALWAYS warn before Yellow Zone entry**
✅ **ALWAYS mandate sidekick routing in Red Zone**
✅ **ALWAYS refuse direct operations when critical**
✅ **ALWAYS propose session reset at 80%**
✅ **NEVER ignore token budget alerts**
✅ **NEVER proceed through Red Zone without sidekick**

---

**Effective immediately. No exceptions.**
