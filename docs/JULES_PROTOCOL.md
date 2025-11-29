# 🤖 Jules Delegation Protocol (JDP) - Quick Reference

This file summarizes the non-negotiable standards for task delegation to the Jules agent. For the full end-to-end operational workflow, including Batch Launch commands, Monitoring, and Validation checklists, refer to the full guide below.

---

## 1. 📝 Core Delegation Rules (JDP)

All tasks **MUST** comply with these three rules:

* **R1: Paths**
    * **Rule:** Always use **relative paths** (start with `./`).
    * **Example:** `./frontend/src/components/ui/Button.test.tsx` 

* **R2: Format**
    * **Rule:** Each task **MUST** be written on a single continuous line.
    * **Template:** `Task: [Component] - [Action] - [Requirements] - [Handover Hook]` 

* **R3: Handover Hook**
    * **Rule:** A report generation instruction is **MANDATORY** at the end of the task line.
    * **Expected File:** `/.ai_reports/[ComponentName]_report.md` 

---

## 2. 🗄️ Full Operational Workflow & History

For complete details, including monitoring commands and troubleshooting, reference the main operational guide.

* **Full Guide:** **`docs/JULES_DELEGATION_WORKFLOW.md`**
* **Launch Command:** `bash -c 'grep "^Task:" tasks.txt | while IFS= read -r line; do jules remote new --repo . --session "$line"; done'` 
* **Monitoring Command:** `jules remote list --session | grep "Task:" | awk '{print $2, $4, $NF}'` 
