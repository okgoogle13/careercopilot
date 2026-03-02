<<<<<<< HEAD
=======
---
name: mcp-routing-specialist
description: MCP Routing Specialist workflow and guidance. Use when this exact skill's
  domain is requested.
metadata:
  legacy_frontmatter_rebuilt: true
---

>>>>>>> restoration-KR-Rage-Figma-v2.0
# MCP Routing Specialist

**Description:** Routes tasks to optimal MCP servers based on delegationStrategy in ~/.mcp.json. Enforces token optimization by preventing expensive Claude analysis when cheaper alternatives (Gemini, local cache) are available. Use when analyzing code, debugging errors, retrieving configuration, or executing flows.

---

## Strategy Definition

This skill enforces the **Cost & Token Optimization Strategy** to prevent misuse of expensive models (Claude Sonnet) for tasks that cheaper tools (Gemini Flash, local cache) can handle.

---

## Routing Logic Table

| User Request Type                | ❌ Do NOT Use         | ✅ MUST Delegate To                        | Priority | Token Impact   |
| -------------------------------- | --------------------- | ------------------------------------------ | -------- | -------------- |
| **Code Review / Audits**         | Claude (Self-analyze) | `gemini-wrapper.analyze_code()`            | HIGH     | 40-55% savings |
| **Error Diagnosis / Root Cause** | Claude (Debug)        | `gemini-wrapper.error_diagnosis()`         | HIGH     | 50% savings    |
| **Refactoring Suggestions**      | Claude (Suggest)      | `gemini-wrapper.refactoring_suggestions()` | MEDIUM   | 35% savings    |
| **Architecture Analysis**        | Claude (Analyze)      | `gemini-wrapper.architecture_analysis()`   | MEDIUM   | 45% savings    |
| **Performance Optimization**     | Claude (Optimize)     | `gemini-wrapper.optimization_analysis()`   | MEDIUM   | 55% savings    |
| **Configuration Lookup**         | Raw file reads        | `configuration` server                     | HIGH     | 94.9% savings  |
| **Documentation Lookup**         | Load CLAUDE.md        | `documentation` server                     | HIGH     | 93.3% savings  |
| **Flow Execution/Schema**        | Read src/ files       | `genkit` server                            | CRITICAL | 99.1% savings  |
| **GitHub Issues/PRs/Files**      | Browse UI             | `github` server                            | HIGH     | 80% savings    |
| **Factual Queries**              | Contextual knowledge  | `documentation` server                     | MEDIUM   | 93.3% savings  |

---

## The Routing Protocol

When a task comes in, execute this 4-step procedure:

### Step 1: Analyze the Task

Identify the core intent:

- Is this **analysis** (code review, debugging, optimization)?
- Is this **lookup** (config, docs, facts)?
- Is this **execution** (run a flow, query Firestore)?
- Is this **repository work** (PR, issue, file read)?

### Step 2: Consult the Routing Table

Match the task type to the table above. Determine:

- ✅ MUST delegate to: [Server Name]
- ❌ Do NOT use: [Self-analysis]
- Token savings: [X%]

### Step 3: Formulate the Delegation

Draft the exact request to send to the selected MCP server:

- Include all necessary context (code, logs, config)
- Use the appropriate method name
- Format params as JSON

### Step 4: Execute

- **If path is clear:** Call the MCP server immediately
- **If unsure:** State "Recommended route: [Server] because [Reason]. Shall I proceed?"

---

## Routing Examples

### Example 1: Code Review Request

**User:** "Review this React component for bugs"

**Analysis:** Code review = analysis task
**Table Lookup:** Code Review → `gemini-wrapper`
**Delegation:**

```
Method: gemini-wrapper.analyze_code()
Params: {
  "code": "[full component code]",
  "language": "typescript"
}
```

**Result:** 40-55% token savings vs Claude self-analysis

---

### Example 2: Configuration Query

**User:** "What's the Firebase config?"

**Analysis:** Configuration lookup = factual query
**Table Lookup:** Configuration Lookup → `configuration` server
**Delegation:**

```
Method: configuration.get_environment()
Params: {
  "env": "production"
}
```

**Result:** 94.9% token savings (cache hit)

---

### Example 3: Error Diagnosis

**User:** "Why is my Genkit flow timing out?"

**Analysis:** Error diagnosis = analysis task
**Table Lookup:** Error Diagnosis → `gemini-wrapper`
**Delegation Plan:**

1. First check `genkit` server for flow status (diagnostic info)
2. Send error logs + context to `gemini-wrapper.error_diagnosis()`
3. Gemini analyzes root cause

**Result:** 50% token savings + actionable fix suggestions

---

### Example 4: Documentation + Analysis (Combined)

**User:** "What's our caching strategy and how can we optimize it?"

**Analysis:** Two-part: lookup + analysis
**Routing Plan:**

1. **Phase 1 (Lookup):** `documentation.search_docs(query="cache")`
   - Get cached docs about caching (93.3% savings)
2. **Phase 2 (Analysis):** `gemini-wrapper.optimization_analysis(perf_data)`
   - Analyze performance data from phase 1 (55% savings)
3. **Total:** 80%+ combined savings

---

## Critical Rules

### ❌ DO NOT

- ❌ Do NOT analyze code yourself when `gemini-wrapper` is available
- ❌ Do NOT read raw files (firebase.json, CLAUDE.md) when cache servers exist
- ❌ Do NOT execute flows yourself when `genkit` server can execute + memoize
- ❌ Do NOT browse GitHub UI when `github` MCP server can query it
- ❌ Do NOT attempt error diagnosis without Gemini delegation

### ✅ DO

- ✅ Always check the Routing Logic Table first
- ✅ Always delegate analysis to Gemini (40-55% cheaper)
- ✅ Always use cache servers for lookups (93-99% savings)
- ✅ Always combine routes for multi-step tasks (80%+ total savings)
- ✅ Mention the token savings impact in your response
- ✅ Link to the GEMINI_DELEGATION_STRATEGY.md guide

---

## MCP Server Methods

### gemini-wrapper (Priority 10)

**Analysis-heavy delegation**

```python
# Code analysis
gemini-wrapper.analyze_code(code, language="python")

# Refactoring advice
gemini-wrapper.refactoring_suggestions(code, language="python")

# Error diagnosis
gemini-wrapper.error_diagnosis(error_message, context="")

# Architecture review
gemini-wrapper.architecture_analysis(system_description)

# Performance tuning
gemini-wrapper.optimization_analysis(performance_data)

# Documentation insights
gemini-wrapper.documentation_insights(doc_content, query="")

# General delegation
gemini-wrapper.delegate_to_gemini(prompt, system_prompt=None)
```

### documentation (Priority 8)

**93.3% token savings cache**

```python
# Search documentation
documentation.search_docs(query)

# Get specific docs
documentation.get_docs(key)

# List agents/skills
documentation.get_agents()
documentation.get_skills()
```

### configuration (Priority 7)

**94.9% token savings cache**

```python
# List automation scripts
configuration.list_scripts()

# Get environment config
configuration.get_environment(env="production")

# Validate configuration
configuration.validate_all()
```

### genkit (Priority 6)

**99.1% token savings cache**

```python
# List flows
genkit.list_flows()

# Get flow schema
genkit.get_flow(flow_name)

# Execute flow (cached)
genkit.execute_flow(flow_name, inputs)
```

### github (Priority 9)

**Repository management**

```python
# Read files from repo
github.read_file(path)

# List/search issues
github.list_issues()

# Get PR details
github.get_pull_request(number)
```

---

## Decision Tree (Quick Reference)

```
User asks a question
│
├─ "Analyze/Review/Debug this code?"
│  └─ → gemini-wrapper (40-55% savings)
│
├─ "What's the config/doc/fact about..."
│  └─ → documentation OR configuration (93-99% savings)
│
├─ "Run/check this flow..."
│  └─ → genkit (99.1% savings)
│
├─ "GitHub PR/issue/file..."
│  └─ → github (80% savings)
│
└─ Unsure?
   └─ → Ask: "Should I delegate this to [Server]?"
```

---

## Token Impact Summary

| Server         | Task Type  | Savings | Method Count |
| -------------- | ---------- | ------- | ------------ |
| gemini-wrapper | Analysis   | 40-55%  | 7 methods    |
| documentation  | Factual    | 93.3%   | 5 methods    |
| configuration  | Config     | 94.9%   | 4 methods    |
| genkit         | Execution  | 99.1%   | 4 methods    |
| github         | Repository | 80%     | 10+ methods  |

**Combined Strategy:** 80%+ token reduction in production workflows

---

## When to Use This Skill

✅ **Use when:**

- User asks for code review, debugging, or optimization advice
- User requests configuration or documentation information
- User wants to run a Genkit flow
- User needs to interact with GitHub (PRs, issues, files)
- You're unsure which MCP server to call
- You need to optimize token usage

❌ **Don't use when:**

- Task is trivial and doesn't warrant server delegation
- User explicitly asks "use your own judgment" without analysis
- Server is not available/disabled in ~/.mcp.json

---

## Reference Documents

- **Full Strategy Guide:** [GEMINI_DELEGATION_STRATEGY.md](./../GEMINI_DELEGATION_STRATEGY.md)
- **MCP Configuration:** [~/.mcp.json](https://github.com/okgoogle13/careercopilot/blob/develop/.mcp.json)
- **Phase 1-3 Summary:** [PHASE1_3_COMPLETE.md](./../PHASE1_3_COMPLETE.md)

---

## Example: The Routing Test

**User asks:** "Why is my Genkit flow failing to optimize?"

**Correct routing response:**

```
Task Analysis: Error diagnosis + optimization = 2-part delegation

Part 1 - Diagnostic (CACHE):
  → genkit.get_flow("optimization_flow")
  → Returns: flow status, recent execution logs

Part 2 - Analysis (GEMINI):
  → gemini-wrapper.error_diagnosis(error_message, context=logs)
  → Returns: root cause analysis + fix suggestions

Expected Token Savings: 99.1% (Part 1) + 50% (Part 2) = 80%+ combined
```

**What I will NOT do:**

- ❌ Read flow files myself (bypass genkit cache)
- ❌ Analyze error logs without Gemini (waste context)
- ❌ Suggest fixes without root cause analysis

---

**Status:** Ready for immediate use | **Confidence:** VERY HIGH | **Token Savings Target:** 80%+
