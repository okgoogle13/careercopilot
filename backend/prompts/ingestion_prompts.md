### Master Career Database Ingestion
**System Role:** Career Database Pre-processor
**Input:** Raw file text content.

Analyze the following collection of career documents, provided as separate files.
Extract, analyze, de-duplicate, merge, and structure the information from ALL provided documents into a single, coherent JSON object.

**Core Instructions:**
1.  **De-duplication & Merging**: Identify identical roles across different documents and merge them.
2.  **Structured Achievements**: Rewrite text into "Action Verb + Noun + Metric + Strategy + Outcome".
3.  **KSC to STAR Method**: Structure narrative selection criteria responses into STAR format.

4.  **DEEP STAR CRITIQUE & VALIDATION**:
    For every KSC Response, perform a "High-Impact Audit". Set 'Needs_Review_Flag' to true if any of the following are detected:
    
    - **Vague Language Audit**: Check for "fluff" words like "assisted," "involved in," "handled," or "helped with." Replace with power verbs like "orchestrated," "standardized," "mitigated," or "pioneered."
    - **Quantification Gap**: If the 'Result' lacks numbers, percentages, dollar amounts, or timeframes (e.g., "improved efficiency" vs. "reduced processing time by 30%"), flag it.
    - **Detail Deficiency**:
        - **Situation**: Is the scale of the project or team size missing?
        - **Task**: Is the specific business problem or obstacle unclear?
        - **Action**: Are the technical tools or specific steps missing? (e.g., "I used software" vs. "I leveraged Python's Pandas library to automate...").
        - **Result**: Is the qualitative impact (stakeholder feedback, award) or quantitative metric missing?

    - **STAR_Feedback**: Provide a professional, critical analysis. Tell the user exactly *why* their response is currently weak.
    - **Improvement_Suggestions**: Provide draft rewrites that include placeholders (e.g., "[Insert Number here]") to show the user exactly where they need to provide more data to reach a 10/10 rating.

5.  **Achievement Optimization**:
    For EVERY Structured Achievement, provide an "Improvement_Suggestions" object. 
    Analyze the original text and provide the strongest possible version for the Action Verb, Noun/Task, Metric, Strategy, and Outcome. 
    If the metric is missing in the original, suggest a realistic placeholder.

6.  **Subtype Tagging**: Apply relevant tags aligned with Australian Community Services best practices (e.g., NDIS, Trauma-Informed, Strengths-Based).
7.  **Unique IDs**: Generate IDs like 'work-1', 'ach-1', 'ksc-1'.

8.  **Skill Enrichment**:
    For every skill in 'Master_Skills_Inventory', attempt to infer the 'Proficiency' (Novice, Competent, Proficient, Expert, Master) and 'Years_Experience' based on the duration of roles where that skill was used.

9. **Job Preferences**:
    Infer the user's implicit job preferences (e.g., if they have only worked remote recently, mark remote) and extract any explicit ones found in summaries or objective statements.

---

### Strategic Tagging & Gap Analysis
**Context:** Analyzing specific career items against target roles.

Analyze the following career items (Work entries or KSC responses) in the context of a user targeting these roles: {target_titles}.

**User Summary context:** {summary_points}

**Items to analyze:**
{items_json}

**Tasks:**
1. Suggest 5-10 high-value "Capability Tags" that represent the strategic value of these items (e.g., "Change Management", "Stakeholder Engagement", "Crisis Intervention").
2. Identify 1-3 "Strategic Skills Gaps" - areas usually required for the target roles that seem missing or weak in these specific items.

---

### STAR Refinement
**Context:** Refining a specific KSC/STAR response.

Refine the following STAR response to be more impactful, concise, and metric-driven.

**Original Prompt:** {ksc_prompt}
**Current Situation:** {situation}
**Current Task:** {task}
**Current Action:** {action}
**Current Result:** {result}

---

### Achievement Field Optimization
**Context:** Optimizing a specific field within a structured achievement.

**Context:** The user has a career achievement: "{original_text}".
**Current Parsed Data:**
- Action: {action_verb}
- Task: {noun_task}
- Metric: {metric}
- Strategy: {strategy}
- Outcome: {outcome}

**Task:** Suggest a stronger, more professional, or more specific value for the field: "{field_to_optimize}".
If the field is 'Metric' and the current value is 'X' or missing, suggest a realistic placeholder format (e.g. "reduced processing time by 20%").
