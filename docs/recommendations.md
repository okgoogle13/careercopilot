# CareerCopilot: Prioritized Recommendations

The following list orders all proposed product and architecture improvements by the value they add. Priority is given to items that ensure the app actually functions, prevent errors, and drastically improve AI output quality with minimal development effort.

* **REC-001: Structured Outputs (Zod Schemas)** * *Description:* Enforce strict JSON output schemas on the Gemini API calls.
  * *Value:* Prevents the app from breaking due to AI markdown formatting or conversational text; guarantees predictable data structures.
* **REC-002: Plain Text Paste Fallback** * *Description:* Add a basic text area for users to paste raw resume or job description text.
  * *Value:* Acts as a mandatory fail-safe when PDF file parsing inevitably fails due to weird encodings.
* **REC-003: Few-Shot Prompting (Gold Standard Examples)** * *Description:* Inject 3 specific examples of ideal inputs and outputs (from your Gold Standard docs) into the system prompt.
  * *Value:* Drastically improves the professional tone and formatting of the AI's output without altering any code.
* **REC-004: Knowledge Reference Files Injection** * *Description:* Load static text files (Community Services Taxonomy, STAR rules, Document Rules) into server memory and append them to generation prompts.
  * *Value:* Forces the AI to use specific, ATS-compliant industry terms and prevents skill hallucinations.
* **REC-005: Inline AI Text Polish** * *Description:* Let users highlight a single sentence in the editor to trigger an isolated LLM rewrite.
  * *Value:* Massive UX improvement; saves API costs and user wait times compared to regenerating the entire document.
* **REC-006: Temperature Tuning per Task** * *Description:* Set API `temperature` to 0.1 for data extraction and 0.7 for document generation.
  * *Value:* Instantly fixes the balance between requiring factual accuracy (parsing jobs) and natural writing (cover letters).
* **REC-007: Locale Formatting Toggle** * *Description:* Add a US/UK/AUS English dropdown that updates the system prompt.
  * *Value:* Ensures regional spelling accuracy, which prevents basic ATS keyword matching failures.
* **REC-008: Ignore Job Criteria Toggle** * *Description:* Allow users to hide irrelevant "nice-to-have" skills from the parsed job description JSON.
  * *Value:* Gives users direct control over their ATS score without requiring complex prompt engineering.
* **REC-009: Self-Correction API Step** * *Description:* Add a hidden, automated LLM call to review the generated document for missing hard skills before showing it to the user.
  * *Value:* Catches missing keywords automatically, increasing the user's final ATS match score.
* **REC-010: 1-Click ATS Clipboard Copy** * *Description:* Add a button to copy the plain-text output directly to the user's clipboard.
  * *Value:* Saves users from downloading and manually copying PDFs to paste into recruitment software text boxes.
* **REC-011: Dynamic Document Tab Visibility** * *Description:* Hide the "KSC Responses" UI tab entirely unless the AI detects Key Selection Criteria in the job posting.
  * *Value:* Cleans up the interface and prevents confusion for users applying to standard corporate roles.
* **REC-012: Status-Specific Loading States** * *Description:* Display specific text (e.g., "Formatting timeline...") while the AI processes data.
  * *Value:* Reduces user abandonment during long API wait times using basic frontend state changes.
* **REC-013: Reduce Template Offerings** * *Description:* Offer a maximum of 3 highly reliable document templates instead of a large gallery.
  * *Value:* Saves significant development time on CSS maintenance and prevents user choice paralysis.
* **REC-014: Page Length Warning** * *Description:* Display a client-side warning if the generated resume text exceeds standard two-page limits.
  * *Value:* Helps users submit appropriate documents without requiring backend logic.
* **REC-015: Static Action Verb Highlighter** * *Description:* Use a hardcoded client-side array to highlight weak words (e.g., "helped", "responsible for") in the text editor.
  * *Value:* Provides immediate editing guidance to the user with zero API cost.
* **REC-016: Job Freshness Warning** * *Description:* Parse the job posting date and display a warning if it is older than 30 days.
  * *Value:* Prevents users from wasting time and API credits applying to expired roles.
* **REC-017: Profile Completeness Tracker** * *Description:* Show a basic fraction (e.g., "4/6 Sections Complete") checking the main JSON keys on the dashboard.
  * *Value:* Encourages data entry, which directly improves the quality of the AI outputs.
* **REC-018: Sticky Mobile Action Button** * *Description:* Pin the primary "Save & Rescore" button to the bottom of the screen on mobile devices.
  * *Value:* Ensures the main action is always accessible on long, scrolling document screens.
* **REC-019: One-Click Demo Profile** * *Description:* Add a button to populate the user's database with dummy data.
  * *Value:* Allows immediate testing of the app's core features without requiring the user to upload their own resume first.
* **REC-020: One-Click Data Deletion** * *Description:* Add a button in settings that immediately deletes the user's Firestore document.
  * *Value:* Provides essential privacy compliance and builds user trust.
* **REC-021: URL Query Parameter Routing** * *Description:* Allow the job extraction screen to read `?jobUrl=` from the web address.
  * *Value:* Allows power users to create browser bookmarks, though less critical for standard users.
