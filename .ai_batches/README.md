# M3 Component Migration - AI Agent Batch Processing

## Quick Start for Other AI Agents

This directory contains batch-specific instructions for parallel M3 component migration. Pick a batch based on your skill level and execute independently.

---

## Available Batches (Ready for Delegation)

### 🟢 Batch 5: Feedback Components
- **File:** `BATCH_5_INSTRUCTIONS.md`
- **Difficulty:** Easy (85% automation)
- **Time:** 2.5 hours
- **Components:** Alert, Skeleton, EmptyState (3 total)
- **Best for:** Mid-level AI agents
- **Status:** ⏳ Available

### 🟢 Batch 6: Utility Components
- **File:** `BATCH_6_INSTRUCTIONS.md`
- **Difficulty:** Easiest (90% automation)
- **Time:** 2 hours
- **Components:** Avatar, Tooltip, Popover, Separator (4 total)
- **Best for:** Junior AI agents, perfect for first-time delegation
- **Status:** ⏳ Available

### 🟢 Batch 8: Layout Components
- **File:** `BATCH_8_INSTRUCTIONS.md`
- **Difficulty:** Easiest (90% automation)
- **Time:** 1.5 hours (fastest!)
- **Components:** Container, Grid, Divider (3 total)
- **Best for:** Junior AI agents, mostly CSS work
- **Status:** ⏳ Available

---

## How to Claim a Batch

1. **Check status** in this README - ensure batch is "Available"
2. **Read instructions** - Open the batch's `.md` file
3. **Update status** - Mark as "In Progress" (optional)
4. **Execute batch** - Follow step-by-step instructions
5. **Commit & push** - Use provided commit message template
6. **Mark complete** - Update status to "Complete"

---

## Batch Status Tracking

| Batch | Components | Difficulty | Time | Status | Agent |
|-------|-----------|------------|------|--------|-------|
| 1 | Progress, SearchInput, Textarea | Easy | 2.5h | ✅ Complete | Lead Agent |
| 2 | Select, DatePicker | Hard | 3h | 🔄 In Progress | Lead Agent |
| 3 | ActionCard, ProfileCard, JobCard | Mod-Hard | 4h | ⏳ Available | - |
| 4 | Tabs, Breadcrumb, Sidebar | Moderate | 3.5h | ⏳ Available | - |
| 5 | Alert, Skeleton, EmptyState | Easy | 2.5h | ⏳ **AVAILABLE** | - |
| 6 | Avatar, Tooltip, Popover, Separator | Easiest | 2h | ⏳ **AVAILABLE** | - |
| 7 | Checkbox, RadioGroup, Switch, Slider | Moderate | 3h | ⏳ Available | - |
| 8 | Container, Grid, Divider | Easiest | 1.5h | ⏳ **AVAILABLE** | - |
| 9 | TBD | TBD | TBD | ⏳ Pending | - |

---

## Prerequisites

Before starting ANY batch:
1. ✅ Read `M3_DELEGATION_GUIDE.md` (parent directory)
2. ✅ Verify git branch: `claude/m3-expressive-tokens-014XmAiA4Rd8N6ucn9JDEJuz`
3. ✅ Ensure clean working tree: `git status`
4. ✅ Confirm component generator works: `python3 scripts/generate-m3-component.py --help`
5. ✅ Review existing M3 components for reference: `M3Button.tsx`, `M3Card.tsx`, `M3Progress.tsx`

---

## File Structure

```
.ai_batches/
├── README.md                      # This file (batch index)
├── BATCH_5_INSTRUCTIONS.md        # Alert, Skeleton, EmptyState
├── BATCH_6_INSTRUCTIONS.md        # Avatar, Tooltip, Popover, Separator
├── BATCH_8_INSTRUCTIONS.md        # Container, Grid, Divider
└── (More batches coming soon)

../M3_DELEGATION_GUIDE.md          # Overview and common patterns
../M3_BATCH_EXECUTION_PLAN.md      # Complete 9-batch roadmap
../M3_WEEK2_PLAN.md                # Week 2 strategy context
```

---

## Recommended Order for New Agents

If you're new to this project, start with easiest batches first:

1. **Batch 8** (Layout) - 1.5 hours, 90% automation, mostly CSS
2. **Batch 6** (Utility) - 2 hours, 90% automation, simple logic
3. **Batch 5** (Feedback) - 2.5 hours, 85% automation, moderate logic

Then progress to moderate batches:
4. **Batch 7** (Form Controls)
5. **Batch 4** (Navigation)
6. **Batch 3** (Cards)

---

## Support & Resources

- **M3 Token Reference:** `design-system/tokens.json`
- **Migration Tracker:** `design-system/migration-tracker.json`
- **Example Components:** `frontend/src/components/ui/M3*.tsx`
- **Storybook:** `yarn storybook` (visual testing)
- **Type Check:** `npx tsc --noEmit`
- **Lint:** `yarn lint`

---

## Quality Standards

All batches must meet:
- ✅ 100% M3 token usage (zero hardcoded colors/sizes)
- ✅ TypeScript strict mode compliance
- ✅ WCAG AA accessibility (4.5:1 contrast)
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Comprehensive Storybook stories
- ✅ Clean git commits with descriptive messages

---

## Completion Metrics

**Target:** 32+ components by end of Week 2
**Current:** 8/134 components (6.0%)
**Remaining:** 24 components across Batches 2-9
**Available for delegation:** 10 components (Batches 5, 6, 8)

---

## Questions?

Refer to `M3_DELEGATION_GUIDE.md` for:
- Complete workflow walkthrough
- M3 token quick reference
- Common pitfalls & solutions
- Example migrations with code

**Good luck! 🚀**
