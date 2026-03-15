# Branch Consolidation Plan

> **Strategic plan for consolidating 20-30+ feature branches accumulated over 5 months**

## Executive Summary

### The Situation
The CareerCopilot repository has accumulated 20-30+ feature branches over a 5-month development period. These branches contain:
- ✅ **Valuable backend/AI work** in `backend/app/genkit_flows/`, `backend/app/ai_operations/`, and `backend/app/core/`
- ⚠️ **Mixed quality frontend implementations** from early development iterations
- 📊 **Scattered features** that need to be consolidated into the `develop` branch

### The Goal
Systematically consolidate high-value backend and AI work into `develop` while avoiding poor-quality frontend code from early branches.

### Timeline
**4 weeks** divided into clear phases with validation checkpoints.

---

## Branch Categorization System

### 🟢 HIGH VALUE (Priority 1)
**Immediate consolidation recommended**

**Criteria:**
- Value score ≥ 50 points
- Contains significant AI/Genkit flows (genkit_flows/, ai_operations/)
- Contains core backend architecture changes
- Has 10+ backend file changes with minimal frontend

**Examples:**
- Branches with new Genkit flows or AI agents
- Backend API architecture improvements
- Core logic enhancements

**Action:** Merge entire branch or cherry-pick all backend commits

---

### 🟡 MEDIUM VALUE (Priority 2)
**Selective consolidation recommended**

**Criteria:**
- Value score 20-49 points
- Mixed backend/frontend changes
- Contains useful infrastructure or tooling
- May have conflicts requiring manual resolution

**Examples:**
- Branches with API endpoint additions + UI work
- Testing infrastructure improvements
- Configuration and tooling updates

**Action:** Cherry-pick backend commits only, review frontend case-by-case

---

### 🔴 LOW VALUE (Priority 3)
**Archive or skip**

**Criteria:**
- Value score < 20 points (or negative)
- Primarily frontend/design changes
- Outdated or superseded by newer work
- Minimal backend impact

**Examples:**
- Early design experiments
- Frontend-only styling changes
- Prototype branches superseded by later work

**Action:** Archive branch, extract critical fixes only if needed

---

## Value Scoring System

Our automated analysis uses weighted scoring:

| Category | Points per File | Pattern Examples |
|----------|-----------------|------------------|
| 🤖 **AI/Genkit Files** | +10 | `genkit_flows/`, `ai_operations/`, `genkit_` |
| 🔌 **API Endpoints** | +5 | `api/endpoints/`, `api/routers/` |
| ⚙️ **Core Logic** | +7 | `app/core/`, `app/services/`, `app/workflows/` |
| 🧪 **Tests** | +3 | `test_`, `_test.py`, `.test.ts`, `.spec.` |
| 📚 **Documentation** | +1 | `docs/`, `README`, `.md` |
| 🎨 **Frontend** | -2 | `frontend/`, `.tsx`, `.jsx`, `components/` |

**Formula:** `Total Score = Σ(category_files × points_per_file)`

---

## Four-Phase Consolidation Strategy

### Phase 1: Analysis & Planning (Week 1)

**Objectives:**
- Understand the full scope of branches
- Generate automated analysis
- Categorize all branches
- Create detailed merge plan

**Steps:**

1. **Run Analysis Tools**
   ```bash
   # Fetch all branches
   git fetch --all

   # Run bash analysis for quick overview
   ./scripts/analyze_branches.sh

   # Run Python analysis for detailed scoring
   python3 scripts/extract_backend_features.py

   # Review the generated report
   cat branch_analysis.json | jq '.branches[] | select(.value_category == "HIGH")'
   ```

2. **Review Output**
   - Examine `branch_analysis.json` for full details
   - Identify HIGH value branches for immediate action
   - Note branches with potential conflicts
   - Document dependencies between branches

3. **Create Merge Order**
   - Start with oldest HIGH value branches
   - Group related features together
   - Plan for conflict resolution
   - Identify branches that can be parallelized

4. **Set Up Consolidation Branch**
   ```bash
   # Create a consolidation working branch
   git checkout develop
   git pull origin develop
   git checkout -b consolidation/backend-features
   ```

**Deliverables:**
- ✅ Complete branch analysis report
- ✅ Prioritized merge list
- ✅ Conflict prediction matrix
- ✅ Initial consolidation branch created

---

### Phase 2: HIGH Value Branch Consolidation (Week 2)

**Objectives:**
- Merge all HIGH value branches
- Integrate critical backend/AI features
- Resolve conflicts as they arise
- Validate each merge

**Steps:**

1. **For Each HIGH Value Branch:**

   ```bash
   # Option A: Merge entire branch (if mostly backend)
   git checkout consolidation/backend-features
   git merge --no-ff origin/branch-name

   # Resolve conflicts if any
   git status
   git diff --name-only --diff-filter=U

   # After resolving conflicts
   git add .
   git commit -m "Merge branch-name: [description]"
   ```

   ```bash
   # Option B: Cherry-pick backend commits only (if mixed)
   ./scripts/cherry_pick_backend.sh branch-name

   # Review and apply suggested commits
   # Follow interactive prompts
   ```

2. **After Each Merge:**

   ```bash
   # Run tests
   cd backend
   pytest tests/ -v

   # Check for import errors
   python3 -m py_compile app/**/*.py

   # Verify Genkit flows if applicable
   ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py
   ```

3. **Document Each Integration:**
   - Create commit message with context
   - Note any manual changes required
   - Update CONSOLIDATION_LOG.md
   - Tag working states

**Validation Checklist:**
- [ ] All tests pass
- [ ] No import errors
- [ ] Genkit flows validate (if modified)
- [ ] API endpoints respond correctly
- [ ] No duplicate code introduced
- [ ] Documentation updated

---

### Phase 3: MEDIUM Value Branch Review (Week 3)

**Objectives:**
- Selectively extract backend code from MEDIUM value branches
- Review frontend changes case-by-case
- Integrate valuable infrastructure improvements

**Steps:**

1. **For Each MEDIUM Value Branch:**

   ```bash
   # Use the cherry-pick helper
   ./scripts/cherry_pick_backend.sh branch-name

   # This will:
   # - Show backend-only commits
   # - Create patch files for review
   # - Allow interactive apply/skip
   ```

2. **Manual Review Process:**
   - Review each patch file individually
   - Check for conflicts with existing code
   - Verify no frontend dependencies
   - Test isolated changes

3. **Selective Frontend Integration:**
   - Only bring in frontend if it's high quality
   - Check against current design system
   - Ensure M3 compliance if UI components
   - Test thoroughly in isolation

**Guidelines for Selective Merging:**

```bash
# Extract only backend directory
git diff develop..origin/branch-name -- backend/ > /tmp/backend-only.patch

# Review the patch
less /tmp/backend-only.patch

# Apply if acceptable
git apply /tmp/backend-only.patch

# Or apply specific files
git checkout origin/branch-name -- backend/app/genkit_flows/new_flow.py
git checkout origin/branch-name -- backend/app/api/endpoints/new_endpoint.py
```

---

### Phase 4: Testing, Cleanup & Finalization (Week 4)

**Objectives:**
- Comprehensive testing of all integrated features
- Clean up and archive processed branches
- Merge consolidation branch to develop
- Document the consolidation

**Steps:**

1. **Comprehensive Testing:**

   ```bash
   # Backend tests
   cd backend
   pytest tests/ -v --cov=app --cov-report=html

   # Frontend tests (if any UI was integrated)
   cd ../frontend
   yarn test

   # Integration tests
   yarn test:e2e

   # Smoke tests
   ./scripts/smoke_test_sidekick.py
   ```

2. **Code Quality Checks:**

   ```bash
   # Linting
   cd backend
   ruff check .
   mypy app/

   # Format check
   black --check app/

   # Security scan
   bandit -r app/
   ```

3. **Merge to Develop:**

   ```bash
   # Ensure consolidation branch is up to date
   git checkout consolidation/backend-features
   git fetch origin develop
   git merge origin/develop

   # Resolve any conflicts
   # Run full test suite

   # Create PR
   gh pr create \
     --title "Branch Consolidation: Backend & AI Features" \
     --body-file consolidation_summary.md \
     --base develop \
     --head consolidation/backend-features

   # After PR review and approval
   gh pr merge --squash
   ```

4. **Branch Cleanup:**

   ```bash
   # Archive processed branches (don't delete yet)
   # Mark them with a tag first
   for branch in $(cat processed_branches.txt); do
     git tag archive/$branch origin/$branch
     echo "Tagged $branch for archival"
   done

   # Push tags
   git push origin --tags

   # After verification period (2 weeks), delete remote branches
   # Only if absolutely sure!
   for branch in $(cat processed_branches.txt); do
     git push origin --delete $branch
   done
   ```

---

## Cherry-Pick Strategy for Backend-Only Code

### When to Use Cherry-Picking

✅ **Use when:**
- Branch has mixed backend/frontend changes
- Frontend quality is questionable
- You want specific commits, not entire branch
- Branch has many commits but only some are relevant

❌ **Don't use when:**
- Branch is entirely backend (just merge)
- Frontend is actually valuable
- Too many conflicts to resolve manually

### Step-by-Step Cherry-Pick Process

1. **Identify Backend Commits:**
   ```bash
   # List commits that touched backend/
   git log develop..origin/branch-name --oneline -- backend/
   ```

2. **Use Helper Script:**
   ```bash
   ./scripts/cherry_pick_backend.sh branch-name
   ```

3. **Manual Cherry-Pick (if needed):**
   ```bash
   # Cherry-pick specific commits
   git cherry-pick <commit-hash>

   # If conflicts occur
   git status
   # Resolve conflicts in backend files only
   git add backend/
   git cherry-pick --continue
   ```

4. **Create Patch for Review:**
   ```bash
   # Create a patch file
   git format-patch -1 <commit-hash> -o /tmp/patches/

   # Review patch
   less /tmp/patches/0001-*.patch

   # Apply patch
   git am /tmp/patches/0001-*.patch
   ```

---

## Conflict Resolution Guidelines

### Common Conflict Scenarios

#### 1. Import Statement Conflicts
**Cause:** Different branches reorganized imports differently

**Resolution:**
```python
# Keep the most recent/organized version
# Ensure all imports are actually used
# Follow project import order conventions
```

#### 2. API Endpoint Conflicts
**Cause:** Same endpoint path defined in multiple branches

**Resolution:**
- Review both implementations
- Keep the more complete/robust version
- Rename if both are needed
- Update API documentation

#### 3. Genkit Flow Conflicts
**Cause:** Different branches modified same flow

**Resolution:**
- Compare flow logic carefully
- Merge complementary features
- Keep stricter validation
- Test flow thoroughly after merge

#### 4. Configuration Conflicts
**Cause:** Environment configs modified differently

**Resolution:**
- Merge all non-conflicting settings
- Document all config options
- Add validation for required configs
- Update .env.example

### Conflict Resolution Process

```bash
# When merge conflict occurs
git status  # See conflicted files

# For each conflicted file
git diff <file>  # Review conflicts

# Edit file to resolve
# Look for <<<<<<< HEAD markers

# After resolving
git add <file>

# Complete merge
git commit -m "Resolve conflicts: [description]"

# Test immediately
pytest tests/test_<affected_area>.py
```

---

## Testing & Validation Checklist

### Pre-Consolidation Testing
- [ ] Current develop branch tests pass
- [ ] Baseline performance metrics recorded
- [ ] No existing regressions

### During Consolidation (After Each Merge)
- [ ] Unit tests pass for affected modules
- [ ] Integration tests pass
- [ ] No new linting errors
- [ ] No type checking errors
- [ ] API endpoints respond correctly
- [ ] Genkit flows validate

### Post-Consolidation Testing
- [ ] Full backend test suite passes
- [ ] Full frontend test suite passes (if UI changed)
- [ ] E2E tests pass
- [ ] Performance benchmarks acceptable
- [ ] Security scan passes
- [ ] No duplicate functionality
- [ ] Documentation is accurate

### Validation Commands

```bash
# Backend validation
cd backend
pytest tests/ -v --cov=app --cov-report=term-missing
ruff check app/
mypy app/
black --check app/

# Genkit validation
ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py

# Frontend validation (if applicable)
cd ../frontend
yarn lint
yarn typecheck
yarn test
yarn build  # Ensure it builds

# E2E tests
yarn test:e2e

# Smoke tests
cd ..
python3 scripts/smoke_test_sidekick.py
```

---

## Risk Mitigation

### Before Starting
1. **Create Full Backup**
   ```bash
   # Tag current state
   git tag pre-consolidation-backup
   git push origin pre-consolidation-backup
   ```

2. **Document Current State**
   - Record all passing tests
   - Take performance baseline
   - Note any existing issues

3. **Set Up Rollback Plan**
   - Know how to revert to pre-consolidation state
   - Have communication plan for team
   - Schedule consolidation during low-traffic period

### During Consolidation
1. **Work in Small Batches**
   - Merge 2-3 branches at a time
   - Validate after each batch
   - Commit working states frequently

2. **Maintain Parallel Develop**
   - Don't block develop branch for 4 weeks
   - Work in consolidation branch
   - Merge to develop only when stable

3. **Document Everything**
   - Keep CONSOLIDATION_LOG.md updated
   - Note manual changes required
   - Record decisions made

### After Consolidation
1. **Monitoring Period**
   - Watch for issues for 2 weeks
   - Keep old branches tagged (don't delete)
   - Be ready to rollback if needed

2. **Gradual Rollout**
   - Deploy to staging first
   - Run extended testing
   - Deploy to production after validation

---

## Tools & Commands Reference

### Analysis Tools
```bash
# Quick overview
./scripts/analyze_branches.sh

# Detailed analysis with scoring
python3 scripts/extract_backend_features.py

# View HIGH value branches
cat branch_analysis.json | jq '.branches[] | select(.value_category == "HIGH")'

# Count by category
cat branch_analysis.json | jq '.branches | group_by(.value_category) | map({category: .[0].value_category, count: length})'
```

### Consolidation Tools
```bash
# Cherry-pick backend only
./scripts/cherry_pick_backend.sh branch-name

# Show branch differences
git diff develop..origin/branch-name --stat

# List backend files changed
git diff --name-only develop..origin/branch-name -- backend/

# Create merge commit
git merge --no-ff origin/branch-name -m "Merge: [description]"
```

### Validation Tools
```bash
# Run tests
pytest backend/tests/ -v

# Check imports
python3 -m py_compile backend/app/**/*.py

# Validate Genkit
ENABLE_GENKIT_FLOWS=true python3 verify_genkit.py

# Check for duplicates
./scripts/analyze-component-duplication.sh
```

---

## Success Criteria

### Technical Success
- ✅ All HIGH value branches consolidated
- ✅ All tests pass
- ✅ No regressions introduced
- ✅ Performance maintained or improved
- ✅ Security scan passes
- ✅ Documentation updated

### Process Success
- ✅ Completed within 4-week timeline
- ✅ Team can continue development in parallel
- ✅ Clear audit trail of all changes
- ✅ Rollback plan tested and ready

### Quality Success
- ✅ No duplicate code
- ✅ Consistent coding standards
- ✅ All integrations properly tested
- ✅ No broken dependencies

---

## Timeline Summary

| Week | Phase | Focus | Deliverable |
|------|-------|-------|-------------|
| **1** | Analysis | Understanding scope | branch_analysis.json, merge plan |
| **2** | HIGH Value | Critical backend/AI features | Integrated HIGH value branches |
| **3** | MEDIUM Value | Selective extraction | Cherry-picked valuable code |
| **4** | Finalization | Testing & cleanup | Merged to develop, branches archived |

---

## Emergency Procedures

### If Something Goes Wrong

1. **Stop Immediately**
   ```bash
   git reset --hard HEAD  # Undo uncommitted changes
   ```

2. **Assess the Situation**
   - What broke?
   - Can it be fixed quickly?
   - Or should we rollback?

3. **Rollback if Needed**
   ```bash
   # Rollback to last good state
   git reset --hard <last-good-commit>

   # Or rollback entire consolidation
   git checkout develop
   git reset --hard pre-consolidation-backup
   ```

4. **Communicate**
   - Notify team immediately
   - Document what happened
   - Plan recovery approach

---

## Post-Consolidation

### Immediate Next Steps
1. Deploy consolidation branch to staging
2. Run extended testing (1 week)
3. Monitor for issues
4. Merge to develop after validation
5. Deploy to production

### Archive Old Branches
```bash
# Tag for archival (keep for 1-2 months)
git tag archive/<branch-name> origin/<branch-name>

# Push tags
git push origin --tags

# Delete remote branches after verification
git push origin --delete <branch-name>
```

### Update Documentation
- Update architecture docs with new features
- Update API documentation
- Update deployment docs if needed
- Create changelog of integrated features

---

## Contact & Support

### Resources
- Branch analysis: `branch_analysis.json`
- This plan: `docs/CONSOLIDATION_PLAN.md`
- Checklist: `.github/BRANCH_CLEANUP_CHECKLIST.md`
- Helper script: `scripts/cherry_pick_backend.sh`

### Questions?
Refer to the branch analysis output and this plan. When in doubt:
1. Run the analysis tools again
2. Test in isolation first
3. Merge small batches
4. Document your decisions

---

**Good luck with the consolidation! 🚀**

*Remember: Slow and steady wins the race. It's better to take 4 weeks and do it right than rush and break things.*
