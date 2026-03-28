# MCP Routing Quick Reference Card

**Print this and bookmark it for immediate reference**

---

## The 4 Magic Rules

| When User Asks                | DO THIS                        | Savings | Method                                                  |
| ----------------------------- | ------------------------------ | ------- | ------------------------------------------------------- |
| **"Read/Analyze these files"** | Route to **Flash Sidekick**    | 95-97%  | `batch_file_analysis()` / `quick_summarize()`           |
| **"What's the design/token?"** | Route to **Design Specialist** | 85%     | `validate_asset_compliance()`                           |
| **"Why is the app crashing?"** | Route to **Sentry + Flash**    | 92%     | `analyze_issue_with_seer()` + `analyze_code_quality()`  |
| **"Optimize/refactor this"**  | Route to **Flash Sidekick**    | 90%     | `suggest_refactoring()` / `consult_pro()`               |

---

## Quick Decision Tree

```text
User asks a question
│
├─ Bulk Data / Read Files?     → flash-sidekick (96-97%)
├─ Code Quality / Tests?       → flash-sidekick (95%)
├─ Design / Tokens?            → design-system-sidekick (85%)
├─ Visual Scoring?             → vision-scorer-mcp (90%)
├─ Sentry Issues?              → sentry (92%)
├─ GitHub PR/issue?            → github (80%)
└─ Complex Reasoning?          → flash-sidekick (Gemini Pro) (40-60%)
```

---

## Server Priority Order

```text
Priority 10: flash-sidekick      ← Bulk Analysis (95-97% savings)
Priority 9:  design-system       ← Visual Truth (85% savings)
Priority 9:  vision-scorer       ← Visual Scoring (90% savings)
Priority 8:  sentry              ← Error Analysis (92% savings)
Priority 8:  github              ← Repository Work (80% savings)
Priority 7:  playwright          ← UI Verification (Mixed)
```

---

## Methods You Can Call

### Flash Sidekick (Analysis)

```javascript
quick_summarize({ text })
batch_file_analysis({ analysis_type, file_paths })
analyze_code_quality({ code, language })
consult_pro({ query, context })
suggest_refactoring({ code })
generate_unit_tests({ code, framework })
```

### Design System Specialist

```javascript
validate_asset_compliance({ asset_id, image_path })
generate_implementation_package({ asset_id, asset_metadata })
```

### Visual Scorer

```javascript
score_asset_compliance({ asset_id, image_path, target_score })
extract_visual_tokens({ image_path })
compare_attempts({ attempt_paths })
```

### Sentry Error Analysis (Seer)

```javascript
analyze_issue_with_seer({ issueUrl, instruction })
get_issue_details({ issueId, organizationSlug })
list_events({ dataset, query })
```

### GitHub MCP

```javascript
get_file_contents({ owner, repo, path })
search_code({ q })
create_pull_request({ owner, repo, title, body, head, base })
```

---

## Token Savings Cheat Sheet

| Task Type             | No Routing | With Routing  | Savings |
| --------------------- | ---------- | ------------- | ------- |
| Read 10+ files        | 50,000     | 2,000 (Flash) | **96%** |
| Grep + read matches   | 30,000     | 1,000 (Flash) | **97%** |
| Code quality audit    | 20,000     | 1,000 (Flash) | **95%** |
| Design validation     | 15,000     | 2,250 (DS)    | **85%** |
| Error root cause      | 25,000     | 2,000 (Seer)  | **92%** |

---

## Anti-Patterns (DO NOT DO)

❌ **DO NOT analyze code yourself** when Gemini available
❌ **DO NOT read raw files** when cache exists
❌ **DO NOT execute flows** without genkit server
❌ **DO NOT browse GitHub UI** when MCP available
❌ **DO NOT skip routing** for speed

---

## Do These Instead

✅ **DO delegate** analysis to Gemini
✅ **DO use caches** for factual lookups (93-99% savings)
✅ **DO report** token savings to user
✅ **DO ask** if unsure about routing
✅ **DO follow** the Routing Logic Table

---

## Example Responses

### Code Quality Audit

> "I'll use `flash-sidekick` to run a batch analysis on these files (95% token savings vs local context reading)."

### Design Compliance

> "I'll validate this UI component with `design-system-sidekick` to check KR Solidarity token compliance (85% savings)."

### Error Root Cause

> "I'll trigger a Sentry Seer analysis to find the root cause of this production error (92% savings vs manual log parsing)."

---

## When in Doubt

1. **Check AGENTS.md** for the authoritative Routing Matrix
2. **Follow the Decision Tree** (above)
3. **Default to Flash Sidekick** for bulk data
4. **Default to Design System Specialist** for visual truth
5. **Ask user** if still unsure

---

## Key Files to Reference

| File | Purpose |
| :--- | :--- |
| `AGENTS.md` | Core project standards and routing matrix |
| `docs/design/01_CANON.md` | Design system non-negotiables |
| `.claude/commands/route.md` | Detailed routing decision engine |
| `.claude/docs/ROUTING_QUICK_REFERENCE.md` | This file |

---

## Success Metrics

After deploying modern MCP routing, you should see:

- ✅ 90%+ token reduction in production workflows
- ✅ Zero-Flora compliance verified across all assets
- ✅ 10x faster response times for file processing
- ✅ Automated visual scoring for all UI PRs
- ✅ Radical transparency in token consumption

---

**Reference AGENTS.md for the source of truth.**

**Goal: Achieve 90%+ token efficiency across all workflows.**
