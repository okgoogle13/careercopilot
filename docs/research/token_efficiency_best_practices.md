# Claude Desktop Token Efficiency & Context Optimization Guide

Managing the 200,000-token context window and rolling usage limits requires a shift from "continuous chat" to **modular, stratified execution**. This guide provides actionable, evidence-based strategies to maximize efficiency and minimize "context rot."

---

## 1. Context Stratification (The "Repomix" Strategy)
The most common cause of "context weighing things down" is feeding the AI an entire codebase when only a small slice is relevant.

> [!TIP]
> **Use Focused Context Packages**
> Instead of one giant `repomix-output.xml`, generate task-specific context files. 
> *   **Evidence**: Anthropic’s models prioritize information at the beginning (Primacy) and end (Recency) of the prompt. Burying relevant logic in a 100k-token file increases the risk of the "Lost in the Middle" phenomenon.
*   **Action**: Use your `generate_targeted_pack.py` script to create minimal XML packages (e.g., `< 10k tokens`) for the specific feature you are building.

---

## 2. Leverage Claude Desktop "Projects" as a Cache
Claude Desktop Projects are not just for organization; they act as a persistent "Manual Cache."

*   **How it works**: Files uploaded to a Project's "Knowledge" section are injected as part of the system-level context for every chat within that project.
*   **Efficiency Gain**: This ensures that core architecture rules (`CLAUDE.md`), API schemas, and style guides are always at the top of the context window (optimal Primacy position) and are handled more efficiently by Anthropic’s internal KV caching.
*   **Action**: Keep your `targeted_mvp_context.xml` and `AGENTS.md` in the Project Knowledge section, rather than uploading them manually to individual chats.

---

## 3. The "State of the Union" Compaction Technique
As a conversation grows, Claude re-reads the *entire* history for every message. This compounds token usage and latency.

*   **The Signal-to-Noise Ratio (SNR)**: After 20–30 turns, the "noise" (old errors, "thank you" messages, intermediate logs) outweighs the "signal."
*   **Action**: Every 15–20 turns, or when finishing a sub-task, ask Claude:
    > *"Summarize the current state of our task, all architectural decisions made, and the pending TODOs into a structured 'Checkpoint' document. Format it for immediate injection into a fresh session."*
*   **Next Step**: Start a **New Chat**, paste that summary, and continue. This drops the weight of the previous 100 turns while retaining 100% of the functional state.

---

## 4. MCP Hygiene & Environment Debt
MCP servers (Model Context Protocol) provide powerful tools but also inject "Invisible Tokens."

*   **Evidence**: Every active tool definition and the metadata returned by servers (like `list_dir` or `command_status`) adds to the prompt overhead.
*   **Action**: 
    *   **Disable unused servers**: If you aren't doing web research, disable the Perplexity/Search MCP.
    *   **Prune `list_dir` outputs**: Don't let the agent run recursive directory listings on `node_modules` or `.git`. This can inject thousands of useless tokens into the history.
    *   **Clean `.gitignore`**: Ensure `.git`, `node_modules`, and large binary folders are explicitly ignored so agents don't accidentally ingest them.

---

## 5. Visual vs. Textual Token Costs
Images (screenshots) are extremely token-heavy (~1,600 tokens per standard image).

*   **Evidence**: A single screenshot can cost more than 100 lines of high-quality code.
*   **Action**: Use visual verification sparingly. If you've already verified a UI change, don't keep uploading new screenshots for minor tweaks. Use textual descriptions until the final polish phase.
*   **Repository Hygiene**: Large binary files (like the 692MB LFS objects we purged) should never enter the context. If an agent tries to "read" a 10MB image as text, it will crush the context window instantly.

---

## 6. Model Routing (Right-Sizing Effort)
Using **Claude 3.5 Sonnet** for everything is often unnecessary.

| Task Complexity | Recommended Model | Rationale |
| :--- | :--- | :--- |
| **Simple Coding/Fixes** | Sonnet 3.5 | Best-in-class for logic/token speed. |
| **Complex Architecture** | Opus | Better for deep reasoning in long context. |
| **Renaming/Formatting** | Haiku | Fast, cheap, and preserves your Sonnet/Opus limits. |

---

## 7. Model Routing Matrix (Use Case Alignment)
Using the right model for the right task is the single biggest factor in balancing performance and token costs.

| Model Tier | Primary Role | Ideal Use Cases |
| :--- | :--- | :--- |
| **Claude 3.5 Haiku** | **The Specialist** | Generating unit tests, boilerplate code, formatting JSON/XML, or renaming files. Excellent for "low-stakes" high-volume tasks. |
| **Claude 3.5 Sonnet** | **The Workhorse** | Daily feature development, refactoring, API integration, and general problem-solving. This is the 80/20 model for 2026. |
| **Claude 3 Opus** | **The Architect** | Deep architectural planning, debugging "impossible" bugs across multiple services, and security audits. Use when the cost of an error is catastrophic. |

---

## 8. Prompt Engineering with XML (The "Gold Standard")
Claude is natively optimized to parse XML tags. Using them improves instruction following and prevents context bleed.

### Why XML?
*   **Encapsulation**: Clearly separates data (code, logs) from instructions.
*   **Evidence-Based**: Anthropic’s training data heavily utilizes XML for "Chain of Thought" reasoning and multi-step tasks.
*   **Efficiency**: Reduces the need for repetitive "Please ignore the following" or "Make sure to look at X" instructions.

### Example: High-Efficiency Structure
```xml
<context>
  <reference_file path="backend/app/core/ats_rules.py">
    <!-- Insert content here -->
  </reference_file>
</context>

<instructions>
  <task_goal>Optimize the resume scoring algorithm.</task_goal>
  <constraint>Do not use external libraries.</constraint>
  <formatting_rules>Return only the updated Python function.</formatting_rules>
</instructions>

<thinking>
  <!-- Ask Claude to think here first to improve reasoning accuracy -->
</thinking>
```

---

## 9. Model-Specific Efficiency Tips

### Claude 3.5 Sonnet (Efficiency)
*   **The "Draft" Method**: Ask Sonnet for a high-level pseudocode draft first. Once approved, ask for the implementation. This prevents the model from writing hundreds of lines of "wrong" code that you then have to pay to correct.
*   **XML Boundaries**: Use `<staged_changes>` and `<current_code>` to help Sonnet distinguish between what exists and what is being proposed.

### Claude 3.5 Haiku (Speed)
*   **One-Shot Tasks**: Haiku is best when given a single, clear objective. Avoid complex multi-step chains.
*   **Batching**: If you have 10 small files to rename or format, Haiku can process them faster and cheaper than the larger models.

### Claude 3 Opus (Reasoning)
*   **Chain of Thought**: Explicitly include `<thinking>` tags in your prompt. This triggers Opus’s deep reasoning capabilities, leading to more robust architectural decisions.
*   **Context Re-Ranking**: Use Opus to review a long context and "re-rank" or "prune" it before feeding it into a Sonnet session.

---

## Summary Checklist
- [ ] **Modularize**: Use targeted `repomix` files under 20k tokens.
- [ ] **Cache**: Use Project Knowledge for persistent reference docs.
- [ ] **Compact**: Start a fresh chat after every major milestone using a summary.
- [ ] **Route**: Use Sonnet for dev, Opus for architecture, Haiku for boilerplate.
- [ ] **Structure**: Use XML tags (`<context>`, `<instructions>`, `<thinking>`) to guide the model.
