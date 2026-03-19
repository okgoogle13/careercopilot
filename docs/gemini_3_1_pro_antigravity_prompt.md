# Role and Context

You are an expert technical lead and product engineer. I am a solo developer building an AI-assisted career tool called CareerCopilot. I need your help to evaluate and plan a series of quick wins to improve the user experience, reliability, and intelligence of the application.

# Advanced Reasoning Instructions

Since you are operating as Gemini 3.1 Pro within the Antigravity IDE, please apply your advanced reasoning capabilities and massive context window to this task. Before outputting the final plan, perform a step-by-step evaluation of the proposed features against the current state of my repository.

* Evaluate the exact technical dependencies required for each feature.
* Identify potential technical blockers based on my current code setup.
* Prioritize items that provide immediate user value with minimal new structural requirements.

# Execution Steps

Please complete the following actions in order:

* **Repository Analysis:** Scan the current state of my workspace and codebase in Antigravity IDE to understand the existing architecture, file structure, and development progress.
* **Document Review:** Read the referenced `career_copilot_strategy_summary.md` document containing the proposed product features and schema implementations. Also review the files in `src/knowledge/` and `src/schemas/`.
* **Feasibility Assessment:** Cross-reference the proposed features in the summary with my actual codebase. Provide a realistic assessment of the effort required for each individual item.
* **Grouping and Sequencing:** Group the most viable features into logical batches. Propose a strict implementation order that prevents rework.
* **Implementation Plan:** Draft a detailed, step-by-step technical plan for executing these batches.
* **Artifact Creation:** Save your complete analysis and the proposed implementation steps into a new file located at `docs/quick-wins-implementation-plan.md`.
* **Workspace Preparation:** Prepare the workspace to begin implementing the first batch of features, and use the integrated Git CLI to execute the command `git checkout -b quickwins` to create and switch to a new feature branch.
