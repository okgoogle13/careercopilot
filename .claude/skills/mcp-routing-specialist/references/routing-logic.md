# Routing Logic - Detailed Decision Tree

## Complete Routing Decision Tree

```
┌─ User Task Arrives
│
├─ Is this CODE ANALYSIS? (review, audit, refactor, optimize)
│  ├─ Code Review → gemini-wrapper.analyze_code()
│  ├─ Refactoring → gemini-wrapper.refactoring_suggestions()
│  ├─ Architecture → gemini-wrapper.architecture_analysis()
│  └─ Optimization → gemini-wrapper.optimization_analysis()
│     Token Savings: 40-55%
│
├─ Is this ERROR DIAGNOSIS? (debugging, root cause, fix suggestion)
│  └─ → gemini-wrapper.error_diagnosis()
│     Token Savings: 50%
│
├─ Is this FACTUAL LOOKUP? (config, docs, facts)
│  ├─ Configuration? → configuration server
│  │  Token Savings: 94.9%
│  ├─ Documentation? → documentation server
│  │  Token Savings: 93.3%
│  └─ Facts/Metadata? → documentation server
│     Token Savings: 93.3%
│
├─ Is this FLOW EXECUTION? (run, check, validate)
│  └─ → genkit server
│     Token Savings: 99.1%
│
├─ Is this REPOSITORY WORK? (PR, issue, file access)
│  └─ → github server
│     Token Savings: 80%
│
└─ UNKNOWN?
   └─ Recommend route based on best guess
      Ask user: "Should I delegate to [Server]?"
```

---

## Decision Matrix

### By Task Intent

| Intent | Keywords | Delegate To | Savings | Method |
|--------|----------|-------------|---------|--------|
| **Code Analysis** | review, audit, check, bugs, issues, quality | Gemini | 40-55% | `analyze_code()` |
| **Code Improvement** | refactor, improve, optimize, clean, better | Gemini | 35% | `refactoring_suggestions()` |
| **System Design** | architecture, design, structure, pattern | Gemini | 45% | `architecture_analysis()` |
| **Performance** | slow, bottleneck, latency, optimize | Gemini | 55% | `optimization_analysis()` |
| **Error Diagnosis** | error, failing, crash, bug, debug | Gemini | 50% | `error_diagnosis()` |
| **Config Info** | config, setting, env, variable, firebase | Cache | 94.9% | `get_environment()` |
| **Doc Info** | doc, guide, how-to, reference, CLAUDE | Cache | 93.3% | `search_docs()` |
| **Flow Status** | flow, execution, run, schema, genkit | Genkit | 99.1% | `get_flow()` |
| **GitHub Work** | PR, issue, branch, merge, repository | GitHub | 80% | GitHub methods |

---

### By User Phrase

#### Analysis Tasks (→ Gemini)
- "Review this code"
- "Find bugs in this function"
- "Refactor this to be cleaner"
- "How can we optimize this?"
- "What's wrong with this architecture?"
- "Debug this error for me"
- "Why is this slow?"

#### Lookup Tasks (→ Cache)
- "What's the config?"
- "Show me the documentation"
- "What's in CLAUDE.md?"
- "List the scripts available"
- "What agents do we have?"
- "What's the Firebase config?"

#### Flow Tasks (→ Genkit)
- "Run this flow"
- "Check the flow status"
- "What's the flow schema?"
- "List available flows"

#### Repository Tasks (→ GitHub)
- "Show me the latest PR"
- "List open issues"
- "Read this file from the repo"
- "Check the branch status"

---

## Priority-Based Resolution

When multiple servers could handle a task, use this priority order:

```
Priority 1: Specialized Server (genkit for flows, github for repos)
Priority 2: Cache Server (93-99% savings for lookups)
Priority 3: Gemini Server (40-55% savings for analysis)
Priority 4: Claude (Self) - ONLY if no other option
```

### Example Conflicts

**Scenario 1: "Tell me about our genkit flows"**
- Could be: Documentation lookup OR Genkit execution
- Resolution: Genkit server (Priority 1, specialized)
- Method: `genkit.list_flows()`

**Scenario 2: "Analyze the Firebase configuration"**
- Could be: Configuration lookup OR Analysis
- Resolution: Configuration server first (cache), then Gemini if analysis needed
- Methods: `configuration.get_environment()` → `gemini.optimization_analysis()`

**Scenario 3: "What's the best way to structure this code?"**
- Could be: Documentation lookup OR Architecture analysis
- Resolution: Gemini server (Priority 3, analysis)
- Method: `gemini.architecture_analysis()`

---

## Multi-Step Workflows

### Pattern 1: Lookup → Analysis

**Goal:** Get information, then analyze it

```
Step 1: Cache Lookup
  → documentation.search_docs("caching strategy")
  → Returns: 341 tokens (93.3% savings)

Step 2: Gemini Analysis
  → gemini.optimization_analysis(cache_strategy)
  → Returns: 200 tokens (45% savings)

Total: 88%+ combined savings
```

### Pattern 2: Error Diagnosis → Fix

**Goal:** Identify root cause, get fix suggestions

```
Step 1: Genkit Diagnostic
  → genkit.get_flow("failing_flow")
  → Returns: error logs, context

Step 2: Gemini Diagnosis
  → gemini.error_diagnosis(error_logs, context)
  → Returns: root cause + fix suggestions

Total: 80%+ combined savings
```

### Pattern 3: Config Lookup → Optimization

**Goal:** Get config, then suggest improvements

```
Step 1: Configuration Lookup
  → configuration.get_environment("production")
  → Returns: 78 tokens (94.9% savings)

Step 2: Gemini Analysis
  → gemini.optimization_analysis(config_data)
  → Returns: 150 tokens (50% savings)

Total: 85%+ combined savings
```

---

## Ambiguity Resolution

### When it's unclear, ask:

**Format:**
```
"I have multiple routing options. Should I:
1. [Option A] via [Server] (Savings: X%)
2. [Option B] via [Server] (Savings: Y%)

Recommend: [Option with best savings]
Shall I proceed?"
```

**Example:**
```
"I can either:
1. Search our documentation cache (93.3% savings)
2. Ask Gemini to explain it (45% savings)

Recommend: Search cache first for factual info.
Shall I proceed?"
```

---

## False Negatives (What NOT to do)

### ❌ Anti-Patterns to Avoid

| Anti-Pattern | Why Bad | Correct Routing |
|--------------|---------|-----------------|
| Analyze code yourself when Gemini available | Wastes context | Use gemini.analyze_code() |
| Read raw files when cache exists | Misses 93% savings | Use cache server |
| Manually debug when Gemini can help | 50% savings lost | Use gemini.error_diagnosis() |
| Execute flow without genkit | Misses 99% savings | Use genkit.execute_flow() |
| Read GitHub UI when MCP available | Wastes token budget | Use github MCP |

---

## Token Impact Examples

### Example: Code Review

**Wrong approach (❌):**
```
You: Read code + self-analyze + suggest fixes
Tokens used: 1,200 tokens (expensive)
Savings: 0%
```

**Right approach (✅):**
```
Step 1: gemini.analyze_code(code)
Tokens: 400 tokens (via Gemini)
Savings: 66% vs Claude
```

### Example: Configuration Query

**Wrong approach (❌):**
```
You: Read firebase.json + parse + explain
Tokens used: 5,000+ tokens
Savings: 0%
```

**Right approach (✅):**
```
Step 1: configuration.get_environment("firebase")
Tokens: 78 tokens (cached)
Savings: 98%
```

### Example: Multi-Step Task

**Wrong approach (❌):**
```
You: Read docs + read config + analyze all
Tokens: 8,000+ tokens
Savings: 0%
```

**Right approach (✅):**
```
Step 1: documentation.search_docs("optimization")
Tokens: 341 tokens (cached)

Step 2: configuration.get_environment("production")
Tokens: 78 tokens (cached)

Step 3: gemini.optimization_analysis(data)
Tokens: 200 tokens (Gemini)

Total: 619 tokens
Savings: 92%+ vs doing it manually
```

---

## Real-World Scenarios

### Scenario 1: "Why is my Genkit flow timing out?"

**Correct Routing:**
```
Classification: Error diagnosis (compound)

Step 1: Diagnostic Info
  Task: Get flow details
  Route: genkit.get_flow("timing_out_flow")
  Savings: 99.1%

Step 2: Root Cause Analysis
  Task: Analyze error
  Route: gemini.error_diagnosis(error_logs, context)
  Savings: 50%

Combined: 75%+ token reduction
```

### Scenario 2: "Refactor this function for performance"

**Correct Routing:**
```
Classification: Code analysis + refactoring

Route: gemini.refactoring_suggestions(code, language="python")
Savings: 35% vs Claude self-refactoring

Why? Gemini-1.5-Flash is optimized for code analysis
```

### Scenario 3: "What's our configuration strategy?"

**Correct Routing:**
```
Classification: Lookup + analysis

Step 1: Factual Lookup
  Route: documentation.search_docs("configuration")
  Savings: 93.3%

Step 2: Strategy Analysis
  Route: gemini.documentation_insights(docs, query="strategy")
  Savings: 30%

Combined: 85%+ token reduction
```

---

**Use this decision tree when unclear about routing. When in doubt, default to the cache server for lookups and Gemini for analysis.**
