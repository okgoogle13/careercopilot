# Kerala Rage Asset Governance

**Version:** 3.0.0
**Last Updated:** 2026-02-11
**Status:** Active

---

## Overview

This document defines the **asset governance system** for the Kerala Rage design system. The system enforces cultural respect, prevents decorative misuse, and maintains the integrity of visual assets through code-level controls.

> [!IMPORTANT]
> **Assets are not decorative.** Every visual in the Kerala Rage system carries cultural intent and political meaning. This governance framework ensures that intent is preserved.

---

## Canon Rules

### 1. Cultural Intent Preservation

Each asset in the KR Solidarity collection has a specific cultural or political purpose:

- **Devotional assets** (Shiva statue) ground the design in deep-time spirituality
- **Portrait assets** (Tipu Sultan, Bhagat Singh) honor resistance history
- **Symbol assets** (Kerala elephant, landscape) anchor regional identity
- **Street assets** (graffiti, placards) express activism and solidarity
- **Texture assets** (laneway) provide substrate without appropriation
- **Abstract assets** (murals, typography) support narrative depth

### 2. No Decorative Reuse

**Prohibited:**
- Using resistance imagery as generic "ethnic decoration"
- Placing First Nations assets outside their designated in-situ contexts
- Mixing assets without consideration of their combined meaning
- Treating cultural symbols as interchangeable stock graphics

**Required:**
- Assets must be used only in components listed in `components_allowed`
- Usage must align with the `intended_context` field
- Special restrictions (e.g., "ONE instance per page maximum") must be followed

### 3. First Nations In-Situ Restriction

**Asset:** `KR-SOLID-009` (First Nations Placard)
**Text:** "ALWAYS WAS ALWAYS WILL BE"

This asset is **strictly restricted** to:
- ✅ `LandingPage` component (Acknowledgement of Country section only)
- ✅ `Attributions.md` documentation reference

**Rationale:**
First Nations imagery must not be used decoratively or outside the context of explicit acknowledgement. This is a cultural respect protocol, not a design preference.

**Enforcement:**
The runtime guard will log a **CRITICAL** error in development if this asset is requested by any other component.

---

## Asset Registry Structure

All assets are defined in:
```
frontend/src/lib/krSolidarityAssets.ts
```

Each asset includes:

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (e.g., `KR-SOLID-001`) |
| `name` | Human-readable name |
| `category` | Asset category (`devotional`, `portrait`, `symbol`, `abstract`, `street`, `texture`) |
| `file_path` | Absolute path from public root |
| `priority` | `CRITICAL`, `HIGH`, or `MEDIUM` |
| `status` | Asset readiness (`ready`, `pending`, `deprecated`) |
| `intended_context` | Cultural/political purpose |
| `specs` | Technical specs (aspect ratio, style notes) |
| `components_allowed` | **Array of components authorized to use this asset** |

---

## Developer Workflow

### Using Assets in Components

**Step 1: Import the hook**
```tsx
import { useKRAsset } from '@/utils/assetGuards';
```

**Step 2: Request the asset**
```tsx
function ManifestoCard() {
  const shivaStatue = useKRAsset('KR-SOLID-001', 'ManifestoCard', 'background motif');

  return (
    <div style={{ backgroundImage: `url(${shivaStatue})` }}>
      {/* content */}
    </div>
  );
}
```

**Step 3: Check console in development**
- If your component is in `components_allowed`, no warnings appear
- If not, you'll see a governance violation warning

### Interpreting Console Warnings

**Example warning:**
```
[Asset Guard] ⚠️  GOVERNANCE VIOLATION
Asset: "KR-SOLID-001" (Shiva Statue)
Requested by: "UnauthorizedComponent"
Allowed components: LandingPage, KrDarkLanding, ManifestoSlab, ManifestoCard
Cultural intent: Deep-time grounding, spiritual anchor for core views
```

**What to do:**
1. **Check if your component should be allowed** — Does the cultural intent match your use case?
2. **If yes:** Propose adding your component to `components_allowed` (see "Adding Components" below)
3. **If no:** Choose a different asset or reconsider your design approach

### Non-React Contexts

For utility functions or services, use the non-hook version:

```ts
import { getKRAsset } from '@/utils/assetGuards';

const assetPath = getKRAsset('KR-SOLID-008', 'Stone', 'texture overlay');
```

---

## Governance Operations

### Adding a New Asset

**Process:**

1. **Generate or source the asset** following Kerala Rage visual guidelines
2. **Place the file** in the appropriate category folder:
   ```
   frontend/public/assets/kr-solidarity/[category]/
   ```
3. **Add entry to the registry** in `krSolidarityAssets.ts`:
   ```ts
   'KR-SOLID-013': {
     id: 'KR-SOLID-013',
     name: 'New Asset Name',
     category: 'portrait',
     file_path: '/assets/kr-solidarity/portrait/kr-solidarity__portrait__new-asset__v1.png',
     priority: 'HIGH',
     status: 'ready',
     intended_context: 'Why this asset exists and what it represents',
     specs: { /* technical specs */ },
     components_allowed: ['ComponentA', 'ComponentB'],
   }
   ```
4. **Update the manifest** at `frontend/public/assets/kerala-rage-kr-solidarity-manifest.json`
5. **Document cultural intent** — Explain the asset's purpose in a commit message or PR description
6. **Test the guards** — Verify that unauthorized components are blocked

### Adding a Component to `components_allowed`

**When to add:**
- The component's design purpose aligns with the asset's `intended_context`
- The usage respects cultural governance principles
- The component is not using the asset purely decoratively

**Process:**

1. Open `frontend/src/lib/krSolidarityAssets.ts`
2. Find the asset entry (e.g., `KR-SOLID-005`)
3. Add your component name to the `components_allowed` array:
   ```ts
   components_allowed: [
     'PageHeader',
     'Dashboard',
     'UnifiedPane',
     'YourNewComponent', // ← Add here
   ],
   ```
4. **Document the reason** in your commit message
5. **Test in development** to ensure no warnings

### Removing or Deprecating an Asset

**Deprecation process:**

1. Change `status` to `'deprecated'` in the registry
2. Add a deprecation comment:
   ```ts
   'KR-SOLID-XXX': {
     // DEPRECATED: 2026-02-15 — Reason for deprecation
     status: 'deprecated',
     // ... rest of entry
   }
   ```
3. Create a migration guide for components currently using it
4. After migration, remove the entry entirely

---

## Forbidden Imagery

The following visual elements are **prohibited** in Kerala Rage assets:

| Category | Examples | Rationale |
|----------|----------|-----------|
| **Monarchy symbols** | Crowns, royal crests, throne imagery | Contradicts anti-colonial stance |
| **Bureaucracy** | Passports, visas, ID cards, stamps | Subverts rather than rejects authority |
| **Corporate stock aesthetics** | Generic business imagery, stock photos | Contradicts grassroots authenticity |
| **State authority icons** | Police badges, government seals | Antagonistic to design values |
| **Unauthorized Aboriginal art** | Dot painting styles, traditional motifs | Cultural appropriation unless in-situ placards |

> [!CAUTION]
> If you're uncertain whether an image violates these principles, **ask** before adding it to the registry.

---

## Runtime Enforcement

### Development Mode

In `NODE_ENV=development`, the asset guards:
- ✅ Log warnings for unauthorized component access
- ✅ Log critical errors for First Nations restriction violations
- ✅ Provide actionable context (allowed components, cultural intent)
- ❌ Do NOT block rendering (warnings only)

### Production Mode

In production:
- ❌ No console warnings (performance)
- ✅ Assets still load normally
- ✅ Governance relies on code review and CI gates (future enhancement)

### Future: CI Integration

**Planned enhancements:**
- Linting rule to detect hardcoded asset paths (force use of `useKRAsset`)
- Pre-commit hook to validate `components_allowed` against actual imports
- Build-time asset audit report

---

## Component Asset Map (Quick Reference)

| Component | Allowed Assets |
|-----------|----------------|
| **LandingPage** | KR-SOLID-001, 003, 007, 009, 010 |
| **KrDarkLanding** | KR-SOLID-001 |
| **ManifestoSlab** | KR-SOLID-001, 002, 003, 011 |
| **ManifestoCard** | KR-SOLID-001, 002, 003, 007, 012 |
| **PageHeader** | KR-SOLID-004, 005, 006, 011 |
| **GardenLayout** | KR-SOLID-004 |
| **SolidarityCard** | KR-SOLID-004, 012 |
| **Dashboard** | KR-SOLID-005 |
| **UnifiedPane** | KR-SOLID-005, 006, 010 |
| **Stone** | KR-SOLID-008 |
| **Vessel** | KR-SOLID-008 |
| **StatCard** | KR-SOLID-008 |
| **MetricCard** | KR-SOLID-008 |
| **StyleGuide** | KR-SOLID-002, 007, 011 |
| **Separator** | KR-SOLID-006 (when component exists) |
| **AssetLibrary** | KR-SOLID-012 |

---

## Testing Compliance

### Manual Testing

**Step 1: Valid usage**
1. Use `useKRAsset('KR-SOLID-001', 'ManifestoCard')` in the ManifestoCard component
2. Open browser dev tools
3. **Expected:** No warnings

**Step 2: Invalid usage**
1. Use `useKRAsset('KR-SOLID-001', 'RandomComponent')` in an unauthorized component
2. Open browser dev tools
3. **Expected:** Governance violation warning

**Step 3: First Nations restriction**
1. Use `useKRAsset('KR-SOLID-009', 'SomeOtherComponent')`
2. Open browser dev tools
3. **Expected:** CRITICAL error with cultural respect message

### Automated Testing (Future)

Planned test suite:
- Unit tests for `assetGuards.ts` validation logic
- Integration tests for each component's asset usage
- Visual regression tests to detect unauthorized asset changes

---

## Asset Library Component

The `AssetLibrary` component (`features/analysis/AssetLibrary.tsx`) serves as a **reference gallery and developer tool** for browsing KR Solidarity assets.

> [!IMPORTANT]
> **AssetLibrary is for inspection and exploration ONLY.**
> It is NOT the source of truth for governance rules. The registry (`krSolidarityAssets.ts`) is the canonical authority.

**Role in governance:**
- 📋 Displays asset metadata (name, category, intended context, priority)
- 🔍 Shows which components are allowed to use each asset
- 📝 Provides copy-paste examples of `useKRAsset()` calls
- 📖 Documents cultural intent and usage restrictions
- 🛠️ Helps developers discover available assets

**Usage:**
Developers can use this component to:
- Explore available assets without reading code
- Understand placement rules visually
- Learn cultural context for each asset
- Get code snippets for proper usage
- Verify asset availability before implementing

**NOT for:**
- ❌ Runtime asset resolution (use `useKRAsset` instead)
- ❌ Overriding governance rules
- ❌ Bypassing component placement restrictions

**Adding AssetLibrary to a page:**
Since AssetLibrary itself can display KR-SOLID-012 (Street Poster), it's already in the `components_allowed` list. Use it as a documentation/developer tool, not as a way to circumvent governance.

---

## Questions or Violations?

If you encounter:
- **Unclear placement rules** → Check the asset's `intended_context`
- **Missing components in `components_allowed`** → Propose an addition (see above)
- **Cultural questions** → Pause and consult team/stakeholders
- **Technical issues with guards** → File an issue with reproduction steps

---

## References

- [Kerala Rage Design System Canon](./design/KERALA_RAGE_DESIGN_SYSTEM_CANON.md)
- [Asset Manifest JSON](../frontend/public/assets/kerala-rage-kr-solidarity-manifest.json)
- [Asset Registry Source](../frontend/src/lib/krSolidarityAssets.ts)
- [Runtime Guards Source](../frontend/src/utils/assetGuards.ts)

---

**Governance system version:** 3.0.0
**Enforced via:** Code-level runtime guards
**Status:** Active and enforced in development mode
