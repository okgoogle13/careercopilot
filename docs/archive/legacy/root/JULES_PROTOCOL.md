# 🤖 Jules Autonomous Delegation Standard (JADS) v1.0

This standard defines the non-negotiable input requirements for task delegation to the autonomous Jules agent. Compliance ensures transparent planning, test validation, and successful, auditable task completion.

---

## 1. 🎯 Task Execution Rules (Non-Negotiable)

| ID  | Rule                   | Description                                                                                                                               |
| --- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **Asynchronous Mode**  | All tasks are assumed to run in asynchronous, autonomous mode. No real-time interaction is expected during execution (use MCP for that).  |
| R2  | **Relative Paths**     | All file references in the SCOPE MUST use relative paths (starting with ./).                                                              |
| R3  | **Single Line Format** | The task command MUST be written on a single continuous line for script compatibility.                                                    |
| R4  | **Plan Approval Hook** | The task is defaulted to require human approval of the generated plan unless the AUTO_APPROVE flag is explicitly included in the command. |

---

## 2. 📝 Structured Task Command Format

The task line uses four mandatory, colon-separated blocks to ensure clarity and full context.

**Template (Single Line):**

```
JADS_TASK: [CONTEXT] : [GOAL] : [SCOPE_AND_TESTS] : [OUTPUT_REPORT]
```

### Block Details:

| Block               | Purpose                                   | Mandatory Contents                                                        | Example                                                                  |
| ------------------- | ----------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **CONTEXT**         | Why the task is needed (business reason). | Must reference a unique ID (e.g., GitHub Issue ID, JIRA ticket).          | `ISSUE_1234: Bugfix for null pointer`                                    |
| **GOAL**            | What the final outcome must be.           | Must specify the exact functional change expected.                        | `Implement JWT token refresh logic and pass all existing tests.`         |
| **SCOPE_AND_TESTS** | Where to focus and How to validate.       | A list of files/directories to examine, plus the test validation command. | `SCOPE: ./auth/ \| TEST: Run 'npm test' in auth dir.`                    |
| **OUTPUT_REPORT**   | Audit requirement for history.            | A mandatory instruction for the final report file location.               | `REPORT: Generate detailed markdown to /.ai_reports/Task_1234_report.md` |

### Complete Example for Scripting:

```
JADS_TASK: ISSUE_1234: Bugfix for null pointer : Implement JWT token refresh logic and pass all existing tests. : SCOPE: ./auth/ | TEST: Run 'npm test' in auth dir. : REPORT: Generate detailed markdown to /.ai_reports/Task_1234_report.md
```

---

## 3. 🛠️ Operational Workflow

This section details how to execute the JADS tasks using the command line interface (CLI).

| Step               | Command/Action                                                                                                                                                                                                                                                                                                   | Notes                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Batch Launch**   | `bash -c 'grep "^JADS_TASK:" jads_tasks.txt \| while IFS= read -r line; do jules remote new --repo . --session "$line"; done'`                                                                                                                                                                                   | Execute all JADS tasks from file                                                                             |
| **Monitoring**     | `jules remote list --session \| awk '/^JADS_TASK:/ {session_id = $2; status = $4; full_prompt = ""; for (i = 5; i <= NF; i++) full_prompt = full_prompt $i " "; if (match(full_prompt, /REPORT: ([^ ]+)/, arr)) { print session_id, status, arr[1] } else { print session_id, status, "REPORT_PATH_UNKNOWN" }}'` | Monitor all JADS tasks with report paths                                                                     |
| **Plan Approval**  | `jules task approve --id=task_abc123`                                                                                                                                                                                                                                                                            | MANDATORY action to approve the plan posted by Jules before execution begins (unless AUTO_APPROVE was used). |
| **Status Details** | `jules task status --id=task_abc123`                                                                                                                                                                                                                                                                             | Use to inspect the detailed status, logs, and execution plan of a single task.                               |

---

## 4. 🗄️ Full Operational Workflow & History

For complete details, including monitoring commands and troubleshooting, reference the main operational guide.

- **Full Guide:** **`docs/JULES_DELEGATION_WORKFLOW.md`**
- **Legacy Format:** The previous `Task:` format is deprecated but still supported for backward compatibility
