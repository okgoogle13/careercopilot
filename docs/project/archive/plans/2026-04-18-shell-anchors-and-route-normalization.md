# Shell Anchors & Route Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Normalize all Figma route frames in `eoNJnwvDZ64OUgSthE20WW` to use the canonical AppShell pattern, then confirm code-target nodes for near-ready screens.

**Architecture:** The canonical shell pattern (confirmed on `/generation`, page `19:3`) is `PageBackground > AppShell (216:3) > [Sidebar (216:4), MainContent (216:123) > [PageChromeHeader (216:124), RouteContent]]`. Three older pages (applications, analysis, documents) use a legacy `PageCanvas` wrapper that must be rebuilt. Dashboard (`1:1277 MainBoard`) is empty and needs content. Auth and landing have no shell — correct by design.

**Tech Stack:** Figma Plugin API (`use_figma` MCP tool), `figma-sync-order.json`, `figma-agent-tasks.md`, `TASKS.md`

---

## Shell Anchor Reference (already confirmed — do not re-extract)

| Node | ID | Page |
|---|---|---|
| AppShell | `216:3` | `/generation` (19:3) |
| Sidebar | `216:4` | `/generation` |
| SidebarNavigation | `216:22` | `/generation` |
| MainContent | `216:123` | `/generation` |
| PageChromeHeader | `216:124` | `/generation` |

## Route Node ID Reference (all confirmed 2026-04-18)

| Route | Page ID | Frame ID | Shell pattern |
|---|---|---|---|
| `/` | `1:6751` | `1:6752` | Public — no shell |
| `/auth` | `1:146` | `1:147` | AuthLayout — no shell |
| `/onboarding` | `1:329` | `1:330` | Needs shell audit |
| `/dashboard` | `1:1276` | `1:1277` | **EMPTY** — rebuild needed |
| `/profile` | `1:4410` | `1:4411` | AppShell ✅ |
| `/opportunities` | `1:2332` | `1:2333` | AppShell ✅ |
| `/applications` | `1:3175` | `1:3176` | Legacy PageCanvas — rebuild |
| `/analysis` | `1:5115` | `1:5116` | Legacy PageCanvas — rebuild |
| `/documents` | `1:5489` | `1:5490` | Legacy PageCanvas — rebuild |
| `/apply` | `19:6` | `20:13` | AppShell ✅ |
| `/generation` | `19:3` | `20:10` | AppShell ✅ canonical ref |
| `/settings` | `19:7` | `20:14` | AppShell ✅ |

---

## Task 1: Decide `/opportunities` canonical form

**Files:**
- Modify: `docs/project/active/figma-sync-order.json` (update notes field for route-opportunities)
- Modify: `docs/project/active/figma-agent-tasks.md` (mark A-5 decision for /opportunities)
- Modify: `TASKS.md`

- [ ] **Step 1: Inspect `/opportunities` frame structure**

Run in `use_figma` (fileKey `eoNJnwvDZ64OUgSthE20WW`):
```javascript
const page = figma.root.children.find(p => p.id === '1:2332');
await figma.setCurrentPageAsync(page);
const frame = await figma.getNodeByIdAsync('1:2333');
function walk(n, d) {
  if (d > 3) return [];
  const r = [{ id: n.id, name: n.name, type: n.type, w: n.width, h: n.height, depth: d }];
  if ('children' in n) for (const c of n.children) r.push(...walk(c, d+1));
  return r;
}
return walk(frame, 0);
```

Expected: frame hierarchy showing AppShell with children, width ~1440 (desktop) or ~375 (mobile).

- [ ] **Step 2: Record policy decision**

If width >= 1200 → desktop_canonical. If width <= 420 → mobile_reference_only.

Update `figma-sync-order.json` route-opportunities notes field:
```json
"notes": "desktop_canonical — confirmed YYYY-MM-DD. AppShell pattern. Width: <measured>px."
```
Or:
```json
"notes": "mobile_reference_only — frame is <width>px. Desktop frame needs creation before code sync."
```

- [ ] **Step 3: Update figma-agent-tasks.md A-5 entry**

Add decision row for `/opportunities` in the A-5 table.

- [ ] **Step 4: Mark task complete in TASKS.md**

Change `- [ ] **Decide \`/opportunities\` canonical form**` to `- [x] ~~**Decide...**~~` with date.

- [ ] **Step 5: Commit**
```bash
git add docs/project/active/figma-sync-order.json docs/project/active/figma-agent-tasks.md TASKS.md
git commit -m "docs(figma): record /opportunities canonical form decision"
```

---

## Task 2: Confirm code-target nodes for near-ready screens

Near-ready screens: `/` `/auth` `/onboarding` `/apply` `/generation` `/settings`. These already have confirmed frame IDs but need the specific sub-frame that code should target recorded.

**Files:**
- Modify: `docs/project/active/figma-sync-order.json` (add `code_target_node_id` field per route)
- Modify: `TASKS.md`

- [ ] **Step 1: Inspect child frames of each near-ready route**

Run in `use_figma`:
```javascript
const targets = [
  { pageId: '1:6751', frameId: '1:6752', name: '/' },
  { pageId: '1:146', frameId: '1:147', name: '/auth' },
  { pageId: '1:329', frameId: '1:330', name: '/onboarding' },
  { pageId: '19:6', frameId: '20:13', name: '/apply' },
  { pageId: '19:3', frameId: '20:10', name: '/generation' },
  { pageId: '19:7', frameId: '20:14', name: '/settings' },
];
const results = [];
for (const t of targets) {
  const page = figma.root.children.find(p => p.id === t.pageId);
  await figma.setCurrentPageAsync(page);
  const frame = await figma.getNodeByIdAsync(t.frameId);
  function walk(n, d) {
    if (d > 3) return [];
    const r = [{ id: n.id, name: n.name, type: n.type, depth: d }];
    if ('children' in n) for (const c of n.children) r.push(...walk(c, d+1));
    return r;
  }
  results.push({ route: t.name, tree: walk(frame, 0) });
}
return results;
```

- [ ] **Step 2: For each route, identify the deepest named content frame**

The code-target node is the frame that contains route-specific content (not shell). Pattern: the sibling of `PageChromeHeader` inside `MainContent`.

- [ ] **Step 3: Add `code_target_node_id` to figma-sync-order.json for each route**

For each item in batch 2, add:
```json
"code_target_node_id": "<node-id>",
"code_target_name": "<frame-name>"
```

- [ ] **Step 4: Mark task complete in TASKS.md**

- [ ] **Step 5: Commit**
```bash
git add docs/project/active/figma-sync-order.json TASKS.md
git commit -m "docs(figma): record code-target nodes for near-ready screens"
```

---

## Task 3: Normalize `/applications` shell (PageCanvas → AppShell)

**Files:**
- Figma: page `1:3175`, frame `1:3176`
- Modify: `docs/project/active/figma-sync-order.json`
- Modify: `TASKS.md`

- [ ] **Step 1: Audit current /applications frame structure**

```javascript
const page = figma.root.children.find(p => p.id === '1:3175');
await figma.setCurrentPageAsync(page);
const frame = await figma.getNodeByIdAsync('1:3176');
function walk(n, d) {
  if (d > 4) return [];
  const r = [{ id: n.id, name: n.name, type: n.type, depth: d, childCount: 'children' in n ? n.children.length : 0 }];
  if ('children' in n) for (const c of n.children) r.push(...walk(c, d+1));
  return r;
}
return walk(frame, 0);
```

- [ ] **Step 2: Record the AppShell node ID within /applications**

Look for node named `AppShell` inside the PageCanvas wrapper. Record its ID.

- [ ] **Step 3: Update figma-sync-order.json for route-applications**

Add fields:
```json
"shell_node_id": "<AppShell-node-id-within-applications>",
"shell_status": "legacy_pagecanvas_wrapper",
"shell_rebuild_needed": true,
"notes": "Legacy PageCanvas wrapper (1:3178). AppShell is at <node-id>. Rebuild: remove PageCanvas, promote AppShell to direct child of Route / Applications frame."
```

- [ ] **Step 4: In Figma — flatten PageCanvas wrapper**

```javascript
const page = figma.root.children.find(p => p.id === '1:3175');
await figma.setCurrentPageAsync(page);
const routeFrame = await figma.getNodeByIdAsync('1:3176');
const pageCanvas = routeFrame.children.find(c => c.name === 'PageCanvas');
// Move AppShell out of PageCanvas to be direct child of routeFrame
const appShell = pageCanvas.children.find(c => c.name === 'AppShell');
if (appShell) {
  routeFrame.appendChild(appShell);
  pageCanvas.remove();
  return 'PageCanvas removed, AppShell promoted';
}
return 'AppShell not found in PageCanvas';
```

- [ ] **Step 5: Verify structure**

```javascript
const page = figma.root.children.find(p => p.id === '1:3175');
await figma.setCurrentPageAsync(page);
const frame = await figma.getNodeByIdAsync('1:3176');
return frame.children.map(c => ({ id: c.id, name: c.name }));
```

Expected: `[{ name: 'AppShell', ... }, ...]` — no PageCanvas wrapper.

- [ ] **Step 6: Update figma-sync-order.json shell_status**

Change `"shell_rebuild_needed": true` to `false`, add `"shell_status": "appshell_canonical"`.

- [ ] **Step 7: Mark task complete in TASKS.md**

- [ ] **Step 8: Commit**
```bash
git add docs/project/active/figma-sync-order.json TASKS.md
git commit -m "docs(figma): normalize /applications shell — PageCanvas flattened to AppShell"
```

---

## Task 4: Normalize `/analysis` shell (PageCanvas → AppShell)

Same pattern as Task 3. **Files:** Figma page `1:5115`, frame `1:5116`, PageCanvas `1:5117`, AppShell `1:5118`.

- [ ] **Step 1: Confirm AppShell is 1:5118 (child of PageCanvas 1:5117)**

```javascript
const page = figma.root.children.find(p => p.id === '1:5115');
await figma.setCurrentPageAsync(page);
const appShell = await figma.getNodeByIdAsync('1:5118');
return { id: appShell.id, name: appShell.name, parentName: appShell.parent?.name };
```

Expected: `{ name: 'AppShell', parentName: 'PageCanvas' }`

- [ ] **Step 2: Flatten PageCanvas — promote AppShell**

```javascript
const page = figma.root.children.find(p => p.id === '1:5115');
await figma.setCurrentPageAsync(page);
const routeFrame = await figma.getNodeByIdAsync('1:5116');
const pageCanvas = routeFrame.children.find(c => c.name === 'PageCanvas');
const appShell = pageCanvas?.children.find(c => c.name === 'AppShell');
if (appShell) {
  routeFrame.appendChild(appShell);
  pageCanvas.remove();
  return 'done';
}
return 'not found';
```

- [ ] **Step 3: Verify and handle SideSheet panels**

The old PageCanvas on `/analysis` also contained `Layout / SideSheet` siblings. After promoting AppShell, check if Layout frames need to be re-parented or removed:

```javascript
const page = figma.root.children.find(p => p.id === '1:5115');
await figma.setCurrentPageAsync(page);
const frame = await figma.getNodeByIdAsync('1:5116');
return frame.children.map(c => ({ id: c.id, name: c.name }));
```

If Layout frames remain, leave them as-is (they are content, not shell). Document their IDs in sync-order notes.

- [ ] **Step 4: Update figma-sync-order.json and TASKS.md**

- [ ] **Step 5: Commit**
```bash
git add docs/project/active/figma-sync-order.json TASKS.md
git commit -m "docs(figma): normalize /analysis shell — PageCanvas flattened to AppShell"
```

---

## Task 5: Normalize `/documents` shell (PageCanvas → AppShell)

Same pattern. **Files:** Figma page `1:5489`, frame `1:5490`, PageCanvas `1:5491`.

- [ ] **Step 1: Confirm AppShell child ID inside PageCanvas 1:5491**

```javascript
const page = figma.root.children.find(p => p.id === '1:5489');
await figma.setCurrentPageAsync(page);
const pc = await figma.getNodeByIdAsync('1:5491');
return pc.children.map(c => ({ id: c.id, name: c.name }));
```

- [ ] **Step 2: Flatten PageCanvas**

```javascript
const page = figma.root.children.find(p => p.id === '1:5489');
await figma.setCurrentPageAsync(page);
const routeFrame = await figma.getNodeByIdAsync('1:5490');
const pageCanvas = routeFrame.children.find(c => c.name === 'PageCanvas');
const appShell = pageCanvas?.children.find(c => c.name === 'AppShell');
if (appShell) {
  routeFrame.appendChild(appShell);
  pageCanvas.remove();
  return 'done';
}
return 'AppShell not found';
```

- [ ] **Step 3: Verify structure**

```javascript
const page = figma.root.children.find(p => p.id === '1:5489');
await figma.setCurrentPageAsync(page);
const frame = await figma.getNodeByIdAsync('1:5490');
return frame.children.map(c => ({ id: c.id, name: c.name }));
```

- [ ] **Step 4: Update figma-sync-order.json and TASKS.md**

- [ ] **Step 5: Commit**
```bash
git add docs/project/active/figma-sync-order.json TASKS.md
git commit -m "docs(figma): normalize /documents shell — PageCanvas flattened to AppShell"
```

---

## Task 6: Design-system readiness pass

**Files:**
- Read: `docs/project/active/figma-sync-order.json` (batch 1 utility_internal items)
- Modify: `TASKS.md`

- [ ] **Step 1: Extract node IDs for utility/internal surfaces**

```javascript
const pages = [
  { id: '19:8', name: '/asset-library' },
  { id: '1:7322', name: '/style-guide' },
  { id: '1:7397', name: '/design-sidekick' },
];
const results = [];
for (const p of pages) {
  const page = figma.root.children.find(pg => pg.id === p.id);
  await figma.setCurrentPageAsync(page);
  const frames = page.children.map(c => ({ id: c.id, name: c.name }));
  results.push({ page: p.name, frames });
}
return results;
```

- [ ] **Step 2: Update figma-sync-order.json batch 4 with real node IDs**

Replace `"figma_node_id": "MISSING"` for asset-library, design-sidekick, style-guide.

- [ ] **Step 3: Verify style-guide has token and shell primitive documentation**

```javascript
const page = figma.root.children.find(p => p.id === '1:7322');
await figma.setCurrentPageAsync(page);
return page.children.map(c => ({ id: c.id, name: c.name, childCount: 'children' in c ? c.children.length : 0 }));
```

If the style-guide page is empty or sparse, record `"readiness": "incomplete"` in sync-order notes.

- [ ] **Step 4: Mark task complete in TASKS.md**

- [ ] **Step 5: Commit**
```bash
git add docs/project/active/figma-sync-order.json TASKS.md
git commit -m "docs(figma): design-system readiness pass — utility surface node IDs recorded"
```

---

## Self-Review

**Spec coverage:**
- ✅ Define shared shell anchors — done (already executed, documented in contract)
- ✅ Extract all canonical route node IDs — done
- ✅ Decide /opportunities canonical form — Task 1
- ✅ Confirm code-target nodes for near-ready screens — Task 2
- ✅ Normalize /applications, /analysis, /documents shells — Tasks 3–5
- ✅ Design-system readiness pass — Task 6

**Missing:** Dashboard (`1:1277 MainBoard`) is empty. This requires a Figma design decision (not a code task) — adding to TASKS.md as a separate design task.

**Placeholder check:** All steps have concrete node IDs and JavaScript code. No TBDs.
