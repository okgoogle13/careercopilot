# AI Studio Audit Close-Out — Iterative Batch Prompt Sequence
## Optimised for Google AI Studio "Build App" Feature (Gemini)

> **How to use this file:**
> Each section below is one **paste-in prompt**. Run them in order.
> Do NOT combine prompts. Wait for Gemini's full response before pasting the next prompt.
> Each prompt is self-contained and idempotent — safe to re-run if output is incomplete.

---

## Why this is batched

Google AI Studio's Build App feature processes one instruction context at a time.
Long correction prompts produce hallucinated pass/fail claims because Gemini fills gaps with plausible-sounding output.
Breaking the audit into atomic checks forces Gemini to either produce real evidence or report "cannot verify".

---

## BATCH 1 — Scope Declaration and Session Priming

> Paste this first, before any other instruction. It anchors Gemini to the prototype path and prevents it from referencing the deleted checkout.

```
You are performing a prototype stabilization audit.

Working directory: /Users/okgoogle13/Projects/prototype_v2.0

Hard constraints you must accept before any other instruction:
- Do NOT touch or reference /Users/okgoogle13/Projects/careercopilot (main repo)
- Do NOT touch /Users/okgoogle13/Downloads/careercopilot-aistud — it is deleted and invalid
- Do NOT create or rename canonical product routes
- Do NOT install packages or run build commands unless explicitly instructed

Canonical route ownership (read-only reference — do not modify):
  /apply/quick     → ApplyQuickWorkspaceReference
  /tracker         → PastApplicationsReference
  /profile         → ProfileView
  /asset-library   → LibraryReferencePage (support-only, not a product pillar)
  StudioMatchPanel → analysis support component only, NOT a canonical route

Reply only with: "Scope accepted. Ready for Batch 2."
Do not begin any file work yet.
```

---

## BATCH 2 — File Rename Verification

> Paste after Batch 1 is confirmed. This asks Gemini to verify only the rename results — not claim lint or build passed.

```
Verify the following file renames inside /Users/okgoogle13/Projects/prototype_v2.0/src.

Expected renames — confirm each exists at the new path, or report MISSING:

  OLD: src/pages/ApplicationWorkspacePage.tsx
  NEW: src/pages/ApplyQuickWorkspaceReference.tsx

  OLD: src/pages/ProfileEditorPage.tsx
  NEW: src/pages/ProfileView.tsx

  OLD: src/pages/PastApplicationsPage.tsx
  NEW: src/pages/PastApplicationsReference.tsx

  OLD: src/pages/ComponentLibraryPage.tsx
  NEW: src/pages/LibraryReferencePage.tsx

  OLD: components/MatchDashboard.tsx
  NEW: components/StudioMatchPanel.tsx

For each item, reply with one of:
  CONFIRMED: [new path exists]
  MISSING: [old path still exists / new path not found]
  CONFLICT: [both old and new exist — old was not removed]

Do not claim any rename is complete unless you can open the new file path.
Do not report lint, type-check, or build status here.
```

---

## BATCH 3 — Import Graph Check (One File at a Time)

> Paste after Batch 2. Run this once per renamed file. Substitute [RENAMED_FILE] with each file from the Batch 2 list.
> Re-paste this prompt 5 times (once per renamed file) and collect all results before continuing.

```
Search the entire /Users/okgoogle13/Projects/prototype_v2.0/src directory for any import statement that still references the OLD file name listed below.

Renamed file: [RENAMED_FILE]
Old import pattern to search for: import ... from '.*[OLD_BASENAME_WITHOUT_EXT]'

Report one of:
  CLEAN: No stale imports found for [OLD_BASENAME_WITHOUT_EXT]
  STALE IMPORTS FOUND: List each file path and the exact import line

Do not report the file as "ready to delete" unless you report CLEAN.
Do not claim "all imports updated" globally — report per-file only.
```

> **For this project, run the above 5 times with these substitutions:**
> 1. OLD = ApplicationWorkspacePage → NEW = ApplyQuickWorkspaceReference
> 2. OLD = ProfileEditorPage → NEW = ProfileView
> 3. OLD = PastApplicationsPage → NEW = PastApplicationsReference
> 4. OLD = ComponentLibraryPage → NEW = LibraryReferencePage
> 5. OLD = MatchDashboard → NEW = StudioMatchPanel

---

## BATCH 4 — Prototype Routing Comment Verification

> Paste after all Batch 3 runs are complete. Asks Gemini to verify the two required comments were added.

```
In /Users/okgoogle13/Projects/prototype_v2.0, verify two prototype-scope comments were added:

CHECK A — Top-level shell or router file
Locate the file that manages top-level tab navigation or routing in the prototype (e.g. App.tsx, Layout.tsx, or equivalent).
Confirm it contains a comment matching this intent (exact wording may vary):
  "Canonical routing authority lives in the main CareerCopilot repo (frontend/src/App.tsx)"

Report: CONFIRMED with file path and the actual comment text found, OR NOT FOUND.

CHECK B — Sidebar or navigation labels area
Locate the sidebar or navigation component that lists tab/page labels.
Confirm it contains a comment matching this intent:
  "Prototype-only labels. Canonical runtime routing lives in the main CareerCopilot repo App.tsx and route matrix."

Report: CONFIRMED with file path and the actual comment text found, OR NOT FOUND.

CHECK C — activeTab shim status
Report whether activeTab state (or equivalent prototype nav state) is:
  PROTOTYPE-ONLY: a comment or annotation explicitly marks it as prototype navigation only
  UNMARKED: no annotation found
  NOT PRESENT: the component does not use activeTab

Report all three checks. Do not claim "comments added" globally unless you quote the actual text.
```

---

## BATCH 5 — Mapping Artifact Verification

> Paste after Batch 4. Verifies the mapping doc exists and contains only the canonical mapping (no extras).

```
Check whether the file docs/prototype-to-canonical-mapping.md exists inside /Users/okgoogle13/Projects/prototype_v2.0.

If it exists, open it and confirm it contains ONLY these five mappings (no additional entries):

  ApplyQuickWorkspaceReference → /apply/quick
  PastApplicationsReference    → /tracker
  ProfileView                  → /profile
  LibraryReferencePage         → /asset-library (support-only analog)
  StudioMatchPanel             → generation/analysis support component only, not a canonical route

Report:
  EXISTS + CORRECT: all five mappings present, no extras
  EXISTS + INCORRECT: paste the actual file contents so extras can be identified
  MISSING: file does not exist

If MISSING, create the file now with exactly those five mappings and no other content. Then confirm.
```

---

## BATCH 6 — Deletion Evidence Check

> Paste after Batch 5. Forces evidence-gated deletion reporting. Do not skip even if Gemini previously claimed files were deleted.

```
For any file you previously deleted or plan to delete from /Users/okgoogle13/Projects/prototype_v2.0:

You must provide evidence before the deletion is accepted.

For EACH deleted file, confirm:
1. The file path that was deleted
2. The exact search command or grep pattern you used to confirm zero remaining imports
3. The result of that search (zero matches output or equivalent)

If you cannot provide items 1-3 for a file:
  - Do NOT list it under "Files Deleted"
  - Move it to "Files Reviewed But Not Deleted" instead
  - State the reason: "import check not performed" or "search result unavailable"

If you have not deleted any files, report: "No files deleted in this session."

Do not infer import status from context. Only report what you explicitly searched.
```

---

## BATCH 7 — Checks Performed Honest Summary

> Paste after Batch 6. Forces honest separation of check types. This replaces the monolithic "audit passed" claim.

```
Produce a checks summary for this session. Use exactly this format:

TYPE-CHECK:
  Ran: YES / NO
  Command used: [exact command, or "not run"]
  Result: PASS / FAIL / NOT RUN
  Notes: [any errors or skipped files]

LINT:
  Ran: YES / NO
  Command used: [exact command, or "not run"]
  Result: PASS / FAIL / NOT RUN
  Notes: [any errors or skipped files]

BUILD:
  Ran: YES / NO
  Command used: [exact command, or "not run"]
  Result: PASS / FAIL / NOT RUN
  Notes: [any errors or skipped files]

FILE EXISTENCE CHECKS:
  Ran: YES / NO
  Method: [file open / directory listing / other]
  Files confirmed: [list]

IMPORT SEARCH:
  Ran: YES / NO
  Method: [grep / manual scan / other]
  Files checked: [list]

Do NOT combine type-check and lint as a single "code check".
Do NOT claim a check passed if you did not run it.
```

---

## BATCH 8 — Final Audit Report (Compilation)

> Paste last. Instructs Gemini to compile the results from all prior batches into the final audit report.
> Do not paste this before Batches 1–7 are complete.

```
Compile the final audit report for the prototype stabilization task.

Use ONLY the results from the checks you ran in this session.
Do NOT invent pass/fail results for checks not performed.
Do NOT restate assumptions as evidence.

Return exactly these sections in this order:

1. Summary
   One paragraph. State what was done, what was confirmed by evidence, and what was not verified.

2. Checks Performed
   Copy the output from the Checks Summary batch (type-check, lint, build, file existence, import search).

3. Issues Found
   List any MISSING renames, STALE imports, NOT FOUND comments, or INCORRECT mapping entries.
   If none: "No issues found."

4. Fixes Applied
   List only actions you took in this session with specific file paths.
   Classify each as: REQUIRED FIX / OPTIONAL CLEANUP / INCIDENTAL.
   Do not classify aesthetic/token changes as required unless they fixed a breakage.

5. Files Deleted
   List only files with confirmed zero-import evidence (from Batch 6).
   For each: include the search method and result.

6. Files Reviewed But Not Deleted
   List files you checked but did not delete, with the reason.

7. Build And Validation Status
   Copy from Batch 7 summary. Do not upgrade status beyond what was confirmed.

8. Prototype To Canonical Mapping
   Copy the exact five-entry mapping from Batch 5. No additions.

9. Final File Tree
   Show the current state of /Users/okgoogle13/Projects/prototype_v2.0/src with all renames applied.

10. Notes
    Any unresolved items, risks, or actions deferred for next session.
```

---

## Quick Reference: What Gemini must NOT do in any batch

| Prohibited behaviour | Correct behaviour |
|---|---|
| Claim lint passed without running lint | Report NOT RUN for lint |
| Claim "all imports updated" globally | Report per-file import check results |
| List deleted files without search evidence | Move to "Files Reviewed But Not Deleted" |
| Add extra canonical route mappings | Use only the 5 mappings listed in Batch 5 |
| Frame token/shape fixes as required audit items | Classify as OPTIONAL CLEANUP |
| Claim "all components classified" without verification | Report only files where comments were added |
| Merge type-check and lint into a single check | Report separately |

---

## Session Continuity Note

If you need to restart the AI Studio session mid-audit:
- Re-paste Batch 1 first to re-anchor scope
- Then paste only the batch(es) not yet completed
- Do NOT re-run batches that produced confirmed results unless you suspect drift
