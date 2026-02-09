# ROOT_CLUTTER_REPORT

| File | Classification | Proposed Action | Target Path | Reason |
| :--- | :--- | :--- | :--- | :--- |
| `analyze_phase3_catalog.py` | script | move | `scripts/maintenance/` | Maintenance script for cataloging. |
| `audit_branches 2.py` | obsolete | delete | - | Duplicate of audit_branches.py. |
| `audit_branches.py` | script | move | `scripts/maintenance/` | Source control maintenance. |
| `categorize_assets.py` | script | move | `scripts/maintenance/` | Asset management utility. |
| `convert_assets 2.py` | obsolete | delete | - | Duplicate. |
| `convert_assets.py` | script | move | `scripts/maintenance/` | Asset conversion utility. |
| `final_repair.py` | obsolete | delete | - | One-off repair script. |
| `generate_consolidation_script.py` | script | move | `scripts/maintenance/` | Migration utility. |
| `generate_consolidation_summary.py` | script | move | `scripts/maintenance/` | Summary generator. |
| `kerala_rage_design_migration.py` | script | move | `scripts/maintenance/` | Design system migration. |
| `process_assets_parallel.py` | script | move | `scripts/maintenance/` | Per-asset utility. |
| `process_uncategorized_assets.py` | script | move | `scripts/maintenance/` | Per-asset utility. |
| `repair_pascal_camel.py` | script | move | `scripts/maintenance/` | Code style utility. |
| `run_kerala-rage_workflow.py` | script | move | `scripts/` | Core workflow runner. |
| `script.py` | obsolete | delete | - | Generic/temp filename. |
| `setup_assets.py` | script | move | `scripts/maintenance/` | Initialization script. |
| `verify_genkit.py` | script | move | `scripts/maintenance/` | Verification utility. |
| `verify_manifest_integrity.py` | script | move | `scripts/maintenance/` | Data integrity check. |
| `COMPONENT_AUDIT_REPORT.md` | report | move | `docs/reports/` | Audit finding. |
| `CONFIGURATION_GUIDE.md` | report | move | `docs/development/` | Developer guide. |
| `CONTRIBUTING.md` | report | move | `docs/development/` | Standard dev guide. |
| `DOCUMENTATION.md` | report | move | `docs/development/` | Doc index. |
| `Final_Audit_Remediation_Report.md` | report | move | `docs/reports/` | Historical audit. |
| `GENKIT_CONFIG_STATUS.md` | report | move | `docs/reports/` | Integration status. |
| `GENKIT_FLOWS_FIXED.md` | report | move | `docs/reports/` | Integration status. |
| `MCP_AUDIT_INDEX.md` | report | move | `docs/reports/` | Audit index. |
| `MCP_AUDIT_QUICKREF.md` | report | move | `docs/reports/` | Audit quick ref. |
| `MCP_AUDIT_REPORT.md` | report | move | `docs/reports/` | Audit report. |
| `MCP_OPTIMIZATION_HANDOVER.md` | report | move | `_archive/docs/` | Historical handover. |
| `MCP_REMEDIATION_PLAN.md` | report | move | `docs/reports/` | Remediation plan. |
| `SECURITY_STATUS_FINAL.md` | report | move | `docs/reports/` | Security status. |
| `WORKFLOW_DIAGRAM.md` | report | move | `docs/development/` | Visual documentation. |
| `WORKFLOW_FIXES.md` | report | move | `docs/reports/` | Historical fix logs. |
| `WORKFLOW_IMPLEMENTATION.md` | report | move | `docs/reports/` | Implementation log. |
| `WORKFLOW_OPTIMIZATION_SUMMARY.md` | report | move | `docs/reports/` | Summary report. |
| `REVERT.md` | obsolete | delete | - | Temp revert instructions. |
| `plans.md` | report | move | `docs/reports/` | High-level plans. |
| `mui_migration_claude_md.md` | obsolete | delete | - | Temp/instructional artifact. |

## Proposed Commands

```bash
# Move Scripts
mkdir -p scripts/maintenance
git mv analyze_phase3_catalog.py scripts/maintenance/
git mv audit_branches.py scripts/maintenance/
git mv categorize_assets.py scripts/maintenance/
git mv convert_assets.py scripts/maintenance/
git mv generate_consolidation_script.py scripts/maintenance/
git mv generate_consolidation_summary.py scripts/maintenance/
git mv kerala_rage_design_migration.py scripts/maintenance/
git mv process_assets_parallel.py scripts/maintenance/
git mv process_uncategorized_assets.py scripts/maintenance/
git mv repair_pascal_camel.py scripts/maintenance/
git mv run_kerala-rage_workflow.py scripts/
git mv setup_assets.py scripts/maintenance/
git mv verify_genkit.py scripts/maintenance/
git mv verify_manifest_integrity.py scripts/maintenance/

# Move Reports/Docs
mkdir -p docs/reports docs/development _archive/docs
git mv COMPONENT_AUDIT_REPORT.md docs/reports/
git mv CONFIGURATION_GUIDE.md docs/development/
git mv CONTRIBUTING.md docs/development/
git mv DOCUMENTATION.md docs/development/
git mv Final_Audit_Remediation_Report.md docs/reports/
git mv GENKIT_CONFIG_STATUS.md docs/reports/
git mv GENKIT_FLOWS_FIXED.md docs/reports/
git mv MCP_AUDIT_INDEX.md docs/reports/
git mv MCP_AUDIT_QUICKREF.md docs/reports/
git mv MCP_AUDIT_REPORT.md docs/reports/
git mv MCP_OPTIMIZATION_HANDOVER.md _archive/docs/
git mv MCP_REMEDIATION_PLAN.md docs/reports/
git mv SECURITY_STATUS_FINAL.md docs/reports/
git mv WORKFLOW_DIAGRAM.md docs/development/
git mv WORKFLOW_FIXES.md docs/reports/
git mv WORKFLOW_IMPLEMENTATION.md docs/reports/
git mv WORKFLOW_OPTIMIZATION_SUMMARY.md docs/reports/
git mv plans.md docs/reports/

# Delete Obsolete
git rm "audit_branches 2.py" "convert_assets 2.py" final_repair.py script.py REVERT.md mui_migration_claude_md.md
```
