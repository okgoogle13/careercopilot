# CareerCopilot Product Strategy & Quick Wins

## 1. Feature Quick Wins (Prioritized for Solo Developer)
* **Plain Text Paste Fallback:** A raw text area bypassing file uploads entirely.
* **Inline AI Text Polish:** Allow users to highlight specific text and trigger an isolated LLM rewrite.
* **Locale Formatting Toggle:** A dropdown for US/UK/AUS English to enforce correct spelling via system prompts.
* **Dynamic Document Tab Visibility:** Only render "KSC Responses" if the AI detects Key Selection Criteria in the job parsing.
* **Status-Specific Loading States:** Cycle through specific text prompts while the AI processes data to prevent abandonment.
* **Ignore Job Criteria Toggle:** Checkboxes to remove irrelevant skills from the parsed JSON before scoring runs.
* **1-Click ATS Clipboard Copy:** A button to copy the plain-text version of documents directly to the clipboard.
* **Reduce Template Offerings:** Restrict options to 3 highly reliable templates (e.g., Classic, Modern, ATS-Optimized).
* **Page Length Warning:** A client-side counter displaying a warning if the generated resume exceeds two pages.
* **Static Action Verb Highlighter:** A hardcoded client-side array highlighting weak words (e.g., "helped") in the editor.
* **Job Freshness Warning:** Display a warning if the target job posting date is older than 30 days.
* **Profile Completeness Tracker:** A basic fraction display (e.g., "4/6 Sections Complete") on the dashboard.
* **Sticky Mobile Action Button:** Pin the "Save & Rescore" button to the bottom viewport on mobile.
* **One-Click Demo Profile:** A button that populates the CareerDatabase with dummy data for immediate testing.
* **URL Query Parameter Routing:** Allow the job extraction screen to read a `?jobUrl=` parameter on load.
* **One-Click Data Deletion:** A settings button that instantly clears the user's Firestore document.

## 2. Core Intelligence & Reliability Upgrades
* **Few-Shot Prompting:** Inject exactly 3 examples of target input/output into system prompts to reduce generic generation.
* **Temperature Tuning:** Use `temperature: 0.1` for parsing/extraction (Phase 3) and `temperature: 0.7` for generation (Phase 5).
* **Self-Correction Step:** Add a hidden automated API call where the LLM reviews its own generated document against the job description for missing hard skills before showing it to the user.

## 3. Knowledge Reference Files Strategy
Instead of complex fine-tuning, read static files into server memory and append them to system prompts:
* `community_services_taxonomy.json`: Forces the AI to map extracted skills to standardized industry terms.
* `star_rules.md`: Provides strict definitions of the Situation, Task, Action, Result framework and instructs the AI to quantify results.
* `gold_standard_examples.md`: Contains highly specific CAR/STAR methodology examples and value-based cover letter statements to enforce tone and density.
* `document_formatting_rules.md`: Enforces ATS-friendly formatting, AU/NZ conventions, and specific persona alignment.

## 4. Structured Outputs & Genkit Flows
* Use Zod schemas (specifically the `CareerDatabaseSchema`) to enforce strict JSON outputs from the Gemini API.
* This prevents the LLM from wrapping data in markdown tags and eliminates the need for regex parsing on the frontend.
