# Branch Cleanup Checklist

<<<<<<< HEAD
=======
> **Status: CONSOLIDATION COMPLETE (2026-03-02)**
>
> `restoration-KR-Rage-Figma-v2.0` has been merged into `develop` via PR #111.  
> All other branches have been reviewed and their work is consolidated.  
> **Next step:** Merge PR #111, then run `scripts/cleanup-merged-branches.sh` (or trigger the `cleanup-branches` workflow) to delete stale branches.

## ✅ Branch Review Summary (2026-03-02)

| Branch | Status | Action |
|--------|--------|--------|
| `main` | 🟢 Active | **KEEP** |
| `develop` | 🟢 Active target | **KEEP** (receives restoration content via PR #111) |
| `restoration-KR-Rage-Figma-v2.0` | 🟢 Merged into develop | DELETE after PR #111 merges |
| `claude/design-migration-status-Tj6t4` | ✅ Ancestor of restoration | DELETE |
| `claude/finalize-assets-skills-98mTq` | ✅ Merged into restoration | DELETE |
| `claude/finalize-assets-skills-mzlX9` | ✅ Merged into restoration | DELETE |
| `claude/review-component-skills-O9SMw` | ✅ Merged into restoration | DELETE |
| `claude/update-claude-kr-design-NTfe4` | ✅ Ancestor of restoration | DELETE |
| `KR-Rage-Figma` | 🔴 Older branch, superseded by restoration | DELETE |
| `kerala-rage-branch` | 🔴 Subset of KR-Rage-Figma, superseded | DELETE |
| `feature/northcote-design-update` | 🔴 Old northcote work, superseded | DELETE |
| `copilot/cleanup-active-branches` | 🔵 This PR branch | Auto-deleted when PR #111 merges |

**How to complete cleanup:**
```bash
# Option 1: Use GitHub Actions workflow (recommended)
# Go to Actions > "Cleanup Stale Branches" > Run workflow
# First run with dry_run=true to review, then with dry_run=false

# Option 2: Run script locally
bash scripts/cleanup-merged-branches.sh
```

---

>>>>>>> restoration-KR-Rage-Figma-v2.0
> **Comprehensive checklist for branch consolidation process**  
> Use this to track progress and ensure nothing is missed during the 4-week consolidation effort

---

## 📋 Pre-Consolidation Checklist

### Environment Preparation
- [ ] Ensure you have latest version of repository
  ```bash
  git fetch --all
  git checkout develop
  git pull origin develop
  ```
- [ ] Verify all analysis scripts are executable
  ```bash
  ls -la scripts/analyze_branches.sh
  ls -la scripts/extract_backend_features.py
  ls -la scripts/cherry_pick_backend.sh
  ```
- [ ] Install required tools (Python 3.11+, git, jq)
- [ ] Set up working directory for patches: `/tmp/branch-consolidation-patches/`
- [ ] Create backup tag
  ```bash
  git tag pre-consolidation-backup-$(date +%Y%m%d)
  git push origin --tags
  ```

### Analysis Phase
- [ ] Run branch analysis script
  ```bash
  ./scripts/analyze_branches.sh > branch_analysis_output.txt
  ```
- [ ] Run feature extraction script
  ```bash
  python3 scripts/extract_backend_features.py
  ```
- [ ] Review generated `branch_analysis.json`
- [ ] Identify all HIGH value branches (🟢)
- [ ] Identify all MEDIUM value branches (🟡)
- [ ] Identify all LOW value branches (🔴)
- [ ] Create prioritized merge list
- [ ] Document expected conflicts
- [ ] Note branch dependencies

### Team Coordination
- [ ] Notify team about consolidation effort
- [ ] Block new feature branches during consolidation (optional)
- [ ] Set up communication channel for issues
- [ ] Schedule regular check-ins
- [ ] Identify who can help with conflict resolution

### Baseline Metrics
- [ ] Record current test pass rate: ______%
- [ ] Record current build time: _______ seconds
- [ ] Record current CI/CD status: ☐ Passing ☐ Failing
- [ ] Document known issues before starting
- [ ] Create snapshot of current develop branch
  ```bash
  git checkout develop
  git log -1 --oneline > pre_consolidation_develop_state.txt
  ```

---

## 🔄 During Consolidation Tracking

### Week 1: Analysis & Planning

#### Branch Analysis
- [ ] All branches analyzed and categorized
- [ ] `branch_analysis.json` generated and reviewed
- [ ] HIGH value branches identified: _______
- [ ] MEDIUM value branches identified: _______
- [ ] LOW value branches identified: _______

#### Planning
- [ ] Merge order determined
- [ ] Conflict prediction completed
- [ ] Timeline adjusted if needed
- [ ] Documentation reviewed (`docs/CONSOLIDATION_PLAN.md`)

#### Setup
- [ ] Consolidation branch created
  ```bash
  git checkout -b consolidation/backend-features
  ```
- [ ] Initial branch state documented
- [ ] Team notified of plan

---

### Week 2: HIGH Value Branch Consolidation

Track each HIGH value branch:

#### Branch 1: ____________________
- [ ] Branch reviewed
- [ ] Merge strategy decided: ☐ Full merge ☐ Cherry-pick
- [ ] Conflicts identified: ☐ None ☐ Minor ☐ Major
- [ ] Merge/cherry-pick completed
- [ ] Tests run and passed
- [ ] Code review completed
- [ ] Committed with descriptive message
- [ ] Notes/issues: _________________________________

#### Branch 2: ____________________
- [ ] Branch reviewed
- [ ] Merge strategy decided: ☐ Full merge ☐ Cherry-pick
- [ ] Conflicts identified: ☐ None ☐ Minor ☐ Major
- [ ] Merge/cherry-pick completed
- [ ] Tests run and passed
- [ ] Code review completed
- [ ] Committed with descriptive message
- [ ] Notes/issues: _________________________________

#### Branch 3: ____________________
- [ ] Branch reviewed
- [ ] Merge strategy decided: ☐ Full merge ☐ Cherry-pick
- [ ] Conflicts identified: ☐ None ☐ Minor ☐ Major
- [ ] Merge/cherry-pick completed
- [ ] Tests run and passed
- [ ] Code review completed
- [ ] Committed with descriptive message
- [ ] Notes/issues: _________________________________

#### Branch 4: ____________________
- [ ] Branch reviewed
- [ ] Merge strategy decided: ☐ Full merge ☐ Cherry-pick
- [ ] Conflicts identified: ☐ None ☐ Minor ☐ Major
- [ ] Merge/cherry-pick completed
- [ ] Tests run and passed
- [ ] Code review completed
- [ ] Committed with descriptive message
- [ ] Notes/issues: _________________________________

#### Branch 5: ____________________
- [ ] Branch reviewed
- [ ] Merge strategy decided: ☐ Full merge ☐ Cherry-pick
- [ ] Conflicts identified: ☐ None ☐ Minor ☐ Major
- [ ] Merge/cherry-pick completed
- [ ] Tests run and passed
- [ ] Code review completed
- [ ] Committed with descriptive message
- [ ] Notes/issues: _________________________________

#### Week 2 Validation
- [ ] All HIGH value branches processed
- [ ] Backend test suite passes
- [ ] No import errors
- [ ] Genkit flows validate (if applicable)
- [ ] No regressions detected
- [ ] Working state tagged
  ```bash
  git tag consolidation-week2-complete
  ```

---

### Week 3: MEDIUM Value Branch Review

Track each MEDIUM value branch:

#### Branch 1: ____________________
- [ ] Branch reviewed
- [ ] Backend commits identified
- [ ] Cherry-pick script used
  ```bash
  ./scripts/cherry_pick_backend.sh <branch-name>
  ```
- [ ] Patches reviewed
- [ ] Selected patches applied
- [ ] Tests run and passed
- [ ] Committed with descriptive message
- [ ] Notes/issues: _________________________________

#### Branch 2: ____________________
- [ ] Branch reviewed
- [ ] Backend commits identified
- [ ] Cherry-pick script used
- [ ] Patches reviewed
- [ ] Selected patches applied
- [ ] Tests run and passed
- [ ] Committed with descriptive message
- [ ] Notes/issues: _________________________________

#### Branch 3: ____________________
- [ ] Branch reviewed
- [ ] Backend commits identified
- [ ] Cherry-pick script used
- [ ] Patches reviewed
- [ ] Selected patches applied
- [ ] Tests run and passed
- [ ] Committed with descriptive message
- [ ] Notes/issues: _________________________________

#### Week 3 Validation
- [ ] All MEDIUM value branches processed
- [ ] No duplicate code introduced
- [ ] All tests still passing
- [ ] Code quality maintained
- [ ] Working state tagged
  ```bash
  git tag consolidation-week3-complete
  ```

---

### Week 4: Testing, Cleanup & Finalization

#### Comprehensive Testing
- [ ] Backend unit tests
  ```bash
  cd backend && pytest tests/ -v
  ```
- [ ] Backend integration tests
  ```bash
  pytest tests/integration/ -v
  ```
- [ ] Frontend tests (if UI changed)
  ```bash
  cd frontend && yarn test
  ```
- [ ] E2E tests
  ```bash
  yarn test:e2e
  ```
- [ ] Smoke tests
  ```bash
  python3 scripts/smoke_test_sidekick.py
  ```
- [ ] Genkit validation
  ```bash
  ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py
  ```

#### Code Quality Checks
- [ ] Linting
  ```bash
  cd backend && ruff check .
  ```
- [ ] Type checking
  ```bash
  mypy app/
  ```
- [ ] Format check
  ```bash
  black --check app/
  ```
- [ ] Security scan
  ```bash
  bandit -r app/
  ```
- [ ] No duplicate code
- [ ] No unused imports
- [ ] No TODO/FIXME comments added

#### Documentation
- [ ] CONSOLIDATION_LOG.md updated
- [ ] API docs updated if endpoints changed
- [ ] Architecture docs updated if needed
- [ ] Changelog created
- [ ] README updated if necessary

#### Merge to Develop
- [ ] Consolidation branch up to date with develop
  ```bash
  git fetch origin develop
  git merge origin/develop
  ```
- [ ] All conflicts resolved
- [ ] Full test suite passes
- [ ] Create pull request
  ```bash
  gh pr create --title "Branch Consolidation: Backend & AI Features" \
    --body-file consolidation_summary.md --base develop
  ```
- [ ] PR reviewed by team
- [ ] PR approved
- [ ] PR merged
  ```bash
  gh pr merge --squash
  ```

---

## ✅ Post-Consolidation Validation

### Immediate Validation (Day 1)
- [ ] Develop branch builds successfully
- [ ] All tests pass on develop
- [ ] No import errors
- [ ] API endpoints respond correctly
- [ ] Genkit flows validate
- [ ] No console errors
- [ ] Smoke tests pass

### Monitoring Period (Week 1)
- [ ] Day 1: Spot check tests and builds
- [ ] Day 2: Monitor for reported issues
- [ ] Day 3: Review CI/CD runs
- [ ] Day 4: Check for performance regressions
- [ ] Day 5: Validate with team
- [ ] Day 6-7: Continue monitoring

### Deployment Validation
- [ ] Deploy to staging environment
  ```bash
  ./scripts/deploy.sh staging
  ```
- [ ] Staging tests pass
- [ ] Manual testing on staging
- [ ] Performance benchmarks acceptable
- [ ] Security scan passes
- [ ] Ready for production: ☐ Yes ☐ No ☐ Issues to resolve

### Branch Cleanup
- [ ] Document all processed branches
- [ ] Tag branches before deletion
  ```bash
  git tag archive/<branch-name> origin/<branch-name>
  git push origin --tags
  ```
- [ ] Wait verification period (2 weeks recommended)
- [ ] Delete remote branches (if safe)
  ```bash
  git push origin --delete <branch-name>
  ```
- [ ] Clean up local branches
  ```bash
  git branch -D <branch-name>
  ```

---

## 🔒 Branch Deletion Safety Checks

> **⚠️ DANGER ZONE: Only delete branches after verification period**

Before deleting ANY branch, verify:

### Pre-Deletion Checklist (For Each Branch)
- [ ] Branch is tagged for archival
  ```bash
  git tag | grep archive/<branch-name>
  ```
- [ ] All valuable code is merged to develop
- [ ] No unique commits lost
  ```bash
  git log develop..origin/<branch-name> --oneline
  # Should be empty or only commits you intentionally skipped
  ```
- [ ] Team has been notified
- [ ] 2+ weeks have passed since merge
- [ ] No issues reported related to this branch
- [ ] Final approval from team lead

### Deletion Command Template
```bash
# Review one last time
git log develop..origin/<branch-name> --oneline

# Tag for archival
git tag archive/<branch-name> origin/<branch-name>
git push origin archive/<branch-name>

# Delete remote branch
git push origin --delete <branch-name>

# Delete local branch
git branch -D <branch-name>

# Document deletion
echo "$(date): Deleted <branch-name>" >> branch_deletion_log.txt
```

### Recovery Plan
If you accidentally delete a branch:
```bash
# Find the commit
git reflog show origin/<branch-name>

# Or use the archive tag
git checkout archive/<branch-name>

# Restore the branch
git checkout -b <branch-name>
git push origin <branch-name>
```

---

## 📊 Metrics & KPIs

### Track These Metrics

#### Before Consolidation
- Total branches: _______
- High value branches: _______
- Medium value branches: _______
- Low value branches: _______
- Test pass rate: _______%
- Build time: _______ seconds

#### After Consolidation
- Branches consolidated: _______
- Branches archived: _______
- Branches deleted: _______
- Test pass rate: _______%
- Build time: _______ seconds
- New features integrated: _______
- Lines of code added: _______
- Lines of code removed: _______

### Success Criteria
- [ ] ≥80% of HIGH value branches consolidated
- [ ] ≥50% of MEDIUM value branches consolidated
- [ ] Test pass rate maintained or improved
- [ ] No critical regressions
- [ ] Build time ≤10% increase
- [ ] Team satisfied with results

---

## 🚨 Rollback Plan

### If Things Go Wrong

#### Minor Issues
- [ ] Document the issue
- [ ] Create hotfix branch
- [ ] Fix and test
- [ ] Merge hotfix
- [ ] Continue consolidation

#### Major Issues
- [ ] Stop consolidation immediately
- [ ] Assess scope of problem
- [ ] Notify team
- [ ] Roll back to last good tag
  ```bash
  git checkout develop
  git reset --hard consolidation-week<X>-complete
  git push origin develop --force-with-lease
  ```
- [ ] Document what went wrong
- [ ] Plan recovery approach
- [ ] Resume when safe

### Emergency Contacts
- Team Lead: ___________________
- DevOps: ___________________
- Backend Lead: ___________________

---

## 📝 Notes & Issues

### Unexpected Issues
```
Date: ___________
Issue: ___________________________________________
Resolution: ______________________________________
```

### Lessons Learned
```
What went well:
- _____________________________________________

What could be improved:
- _____________________________________________

For next time:
- _____________________________________________
```

### Branch-Specific Notes
```
Branch: ___________
Issue: ___________________________________________
Resolution: ______________________________________
Time spent: _______
```

---

## ✨ Completion Checklist

### Final Validation
- [ ] All HIGH value branches consolidated
- [ ] All MEDIUM value branches reviewed
- [ ] All tests passing
- [ ] No regressions
- [ ] Documentation updated
- [ ] Team notified of completion
- [ ] Lessons learned documented
- [ ] This checklist completed

### Celebration 🎉
- [ ] Acknowledge the effort
- [ ] Thank the team
- [ ] Document achievements
- [ ] Share learnings
- [ ] Plan for ongoing branch hygiene

---

<<<<<<< HEAD
**Consolidation Status**: ☐ Not Started ☐ In Progress ☐ Complete

**Completion Date**: _______________

**Team Sign-off**: _______________
=======
**Consolidation Status**: ☑ Complete (2026-03-02 via PR #111)

**Completion Date**: 2026-03-02

**Summary**: All active branch work consolidated into `develop` via `restoration-KR-Rage-Figma-v2.0`.
Run `scripts/cleanup-merged-branches.sh` or trigger the `cleanup-branches` GitHub Actions workflow to delete stale branches.
>>>>>>> restoration-KR-Rage-Figma-v2.0

---

*Good job on completing the consolidation! Remember to maintain branch hygiene going forward to avoid this situation again.*
