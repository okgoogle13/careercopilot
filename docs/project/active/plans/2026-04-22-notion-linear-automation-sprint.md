# 7-Day Notion + Linear Automation Sprint — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modular Notion + Linear + Perplexity automation infrastructure that consolidates fragmented docs, syncs workflows, enables read/write Perplexity reasoning, and provides a clean self-hosted migration path (PostgreSQL swap).

**Architecture:** 
- Git `docs/` consolidates fragmented markdown (source of truth)
- Notion databases sync from git docs via CI (interactive hub)
- Abstraction layer (`DocumentStore`, `IssueTracker` interfaces) decouples automation from backends
- Perplexity reads Notion, reasons about state, writes via guarded updates
- Self-hosted swap: swap `NotionDocumentStore` → `PostgresDocumentStore` in one line

**Tech Stack:** Python (sync scripts), TypeScript (Perplexity guard logic), Notion API, Linear API, git CI hooks, Mermaid (diagrams)

---

## Phase 1: Doc Consolidation + Sync Infrastructure (Days 1-2)

### Task 1: Audit + Inventory Fragmented Docs

**Files:**
- Create: `scripts/doc-audit.py`
- Create: `.claude/reports/doc-inventory-2026-04-22.md`

- [ ] **Step 1: Write audit script** — See implementation plan
- [ ] **Step 2: Run audit**
- [ ] **Step 3: Document findings**
- [ ] **Step 4: Commit**

### Task 2: Consolidate Fragmented Docs into `docs/` Structure

**Files:**
- Create: `scripts/consolidate-docs.py`
- Modify: `docs/` (move/organize all markdown)

- [ ] **Step 1: Write consolidation script**
- [ ] **Step 2: Run consolidation**
- [ ] **Step 3: Verify no links are broken**
- [ ] **Step 4: Commit**

### Task 3: Create Doc Sync Infrastructure (Git → Notion)

**Files:**
- Create: `scripts/docs-to-notion.py`
- Create: `.github/workflows/sync-docs-to-notion.yml`
- Create: `docs/automation/NOTION_SYNC_CONFIG.md`

- [ ] **Step 1: Write docs-to-notion sync script**
- [ ] **Step 2: Create CI workflow**
- [ ] **Step 3: Create config doc**
- [ ] **Step 4: Commit**

---

## Phase 2: Notion + Linear Automation (Days 3-5)

### Task 4: Create Abstraction Layer Interfaces

**Files:**
- Create: `frontend/src/lib/document-store/index.ts` (interfaces)
- Create: `frontend/src/lib/issue-tracker/index.ts` (interfaces)
- Create: `docs/automation/BACKEND_ABSTRACTION.md`

- [ ] **Step 1: Define DocumentStore interface**
- [ ] **Step 2: Define IssueTracker interface**
- [ ] **Step 3: Create abstraction documentation**
- [ ] **Step 4: Commit**

### Task 5: Implement NotionDocumentStore

**Files:**
- Create: `frontend/src/lib/document-store/notion.ts`
- Create: `frontend/src/lib/document-store/__tests__/notion.test.ts`

- [ ] **Step 1: Write failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement NotionDocumentStore**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

### Task 6: Implement LinearIssueTracker

**Files:**
- Create: `frontend/src/lib/issue-tracker/linear.ts`
- Create: `frontend/src/lib/issue-tracker/__tests__/linear.test.ts`

- [ ] **Step 1: Write failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement LinearIssueTracker**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

## Phase 3: Perplexity Integration + Guarded Writes (Days 6-7)

### Task 7: Implement Hallucination Guard

**Files:**
- Create: `frontend/src/lib/document-store/guards.ts`
- Create: `frontend/src/lib/document-store/__tests__/guards.test.ts`

- [ ] **Step 1: Write failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement guard logic**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

### Task 8: Implement PerplexityDocumentStore (Decorator)

**Files:**
- Create: `frontend/src/lib/document-store/perplexity.ts`
- Create: `frontend/src/lib/document-store/__tests__/perplexity.test.ts`

- [ ] **Step 1: Write failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement PerplexityDocumentStore**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

### Task 9: Create Task → Linear → Notion Sync Automation

**Files:**
- Create: `backend/scripts/sync_tasks_to_linear_notion.py`
- Create: `docs/automation/TASK_SYNC_WORKFLOW.md`

- [ ] **Step 1: Write sync script**
- [ ] **Step 2: Test sync script locally**
- [ ] **Step 3: Create workflow documentation**
- [ ] **Step 4: Commit**

### Task 10: Self-Hosted Migration Guide

**Files:**
- Create: `docs/automation/SELF_HOSTED_MIGRATION.md`
- Create: `frontend/src/lib/document-store/postgres.ts` (scaffold)

- [ ] **Step 1: Write migration guide**
- [ ] **Step 2: Create PostgresDocumentStore scaffold**
- [ ] **Step 3: Commit**

### Task 11: Create Execution Prompts for All Tools

**Files:**
- Create: `docs/automation/EXECUTION_PROMPTS.md`

- [ ] **Step 1: Write unified execution guide**
- [ ] **Step 2: Commit**

### Task 12: Final Docs + Handoff Summary

**Files:**
- Create: `.claude/reports/sprint-handoff-2026-04-22.md`

- [ ] **Step 1: Save this plan to repo**
- [ ] **Step 2: Create sprint handoff summary**
- [ ] **Step 3: Final commit**

---

## Success Criteria (Day 7 End)

- ✅ All fragmented docs consolidated in `docs/` (git source of truth)
- ✅ Notion databases fully synced + interactive (Notion hub)
- ✅ CI job auto-syncs `docs/` commits to Notion
- ✅ Three automation workflows running (Task, Decision, Sprint)
- ✅ Perplexity read/write integration live (guarded writes)
- ✅ Self-hosted migration documented + ready to swap
- ✅ All tests passing
- ✅ Team docs complete

---

**Execution:** Worktree: `.worktrees/notion-linear-sprint`  
**Branch:** `sprint/2026-04-22-notion-linear-automation`  
**Skill:** superpowers:executing-plans (subagent-driven)
