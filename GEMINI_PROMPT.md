# Gemini Code Assist: Fix Remaining Frontend TypeScript Errors

## Objective

Fix all remaining TypeScript compilation errors in the frontend to achieve 100% CI test pass rate (currently at 80%, need to fix Frontend Tests).

## Current Status

- ✅ 8/10 CI tests passing
- ❌ Frontend Tests failing with TypeScript errors
- ❌ Quality Gate failing (depends on Frontend Tests)

## Critical Instructions

### 1. DO NOT MODIFY Grid Components

**IMPORTANT:** The previous Grid API changes created errors. The project uses Material-UI v5, NOT v7.

**For DocumentBrowser.tsx and layout.tsx:**

- REVERT any Grid component changes back to original
- Keep Grid usage as-is (the original code was working)
- Do NOT change `size` props or add `item` props
- Focus ONLY on icon imports and type errors

### 2. Fix Missing Icon Imports

**Files to Fix with Missing Icons:**

#### DocumentSharingDialog.tsx (Line 147-149)

```typescript
// ADD this import:
import { PersonAdd as UserPlus } from "@mui/icons-material";

// The icon is used around line 147-149
```

#### CardShowcase.tsx (Line 285)

```typescript
// ADD these imports:
import { GpsFixed, Target } from "@mui/icons-material";

// Fix line 285: Use 'typeof Target' instead of 'Target' as a type
// Change: icon: GpsFixed as Target
// To: icon: GpsFixed as typeof Target
```

#### AppLayout.tsx (Lines 77, 83, 96)

```typescript
// ADD these imports:
import { BarChart, GpsFixed, ChatBubble } from "@mui/icons-material";

// Fix type usage on lines 77, 83, 96:
// Change: icon: BarChart as BarChart3
// To: icon: BarChart

// Change: icon: GpsFixed as Target
// To: icon: GpsFixed

// Line 96 already fixed (MessageSquare), verify it's correct
```

#### Sidebar.tsx (Line 24)

```typescript
// ADD this import:
import { BarChart } from "@mui/icons-material";

// Fix line 24: Use 'typeof BarChart3' instead of 'BarChart3' as a type
// Or better: just use BarChart directly if available
```

### 3. Fix Sentry Import (main.tsx)

#### main.tsx (Line 4)

```typescript
// Option 1: If Sentry is not used, comment out or remove the import
// import * as Sentry from '@sentry/react';

// Option 2: If Sentry is needed, add to package.json:
// yarn add @sentry/react

// Option 3: If Sentry usage is conditional, wrap in try-catch or make optional
```

## Specific Error Codes to Fix

### TS2304 - Cannot find name

- `UserPlus` → Import from @mui/icons-material as `PersonAdd`
- `GpsFixed` → Import from @mui/icons-material
- `BarChart` → Import from @mui/icons-material
- `ChatBubble` → Import from @mui/icons-material

### TS2749 - Value used as type

- `Target` → Use `typeof Target`
- `BarChart3` → Use `typeof BarChart3` or import `BarChart` directly
- `MessageSquare` → Already fixed, should be just the value

### TS2307 - Cannot find module

- `@sentry/react` → Either install package or remove import

### TS2769 - No overload matches this call

- Grid components → REVERT to original code, DO NOT MODIFY

## Files to Modify (in order)

1. **src/components/documents/DocumentSharingDialog.tsx**
   - Add UserPlus import (as PersonAdd)

2. **src/components/features/demo/CardShowcase.tsx**
   - Add GpsFixed and Target imports
   - Fix line 285 type usage

3. **src/components/layout/AppLayout.tsx**
   - Add BarChart, GpsFixed, ChatBubble imports
   - Fix lines 77, 83 type usage

4. **src/components/layout/Sidebar.tsx**
   - Add BarChart import
   - Fix line 24 type usage

5. **src/main.tsx**
   - Comment out or fix Sentry import

6. **src/components/features/Documents/DocumentBrowser.tsx**
   - REVERT Grid changes to original

7. **src/components/ui/layout.tsx**
   - REVERT Grid changes to original

## Verification Commands

After making changes, verify locally:

```bash
# From frontend directory:
cd frontend

# Type check (should pass with 0 errors):
npx tsc --noEmit --skipLibCheck

# Build (should complete successfully):
npm run build

# If both pass, changes are ready!
```

## Expected Result

After these fixes:

- ✅ Frontend Tests: PASSING
- ✅ Quality Gate: PASSING
- ✅ **10/10 CI tests passing (100% pass rate)**

## Key Rules

1. ❌ DO NOT modify Grid component props
2. ❌ DO NOT change size/item props on Grid
3. ✅ DO add missing icon imports from @mui/icons-material
4. ✅ DO fix type usage (typeof vs direct value)
5. ✅ DO handle Sentry import (comment out or install)
6. ✅ DO verify with `npx tsc --noEmit` before committing

## Summary

**Problem:** Missing icon imports and incorrect type usage
**Solution:** Import icons from @mui/icons-material and fix typeof usage
**Do NOT:** Modify any Grid component code (causes TS2769 errors)

Focus on imports and types only. The Grid code was working before and should be left as-is.
