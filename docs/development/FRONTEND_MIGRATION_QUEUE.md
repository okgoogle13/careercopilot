# Frontend Migration Queue (Top 20)

**Generated:** 2026-01-19  
**Source:** `frontend/component-inventory.json`

## Priority Migration List (by usage count)

1) `components/shared/PageHeader.tsx` (8)
2) `components/ui/M3Button.tsx` (3)
3) `components/shared/KeywordTag.tsx` (2)
4) `frontend/packages/ui/src/components/Button/Button.tsx` (1)
5) `components/shared/ApplicationCard.tsx` (1)
6) `components/shared/ChartPane.tsx` (1)
7) `components/shared/EditableField.tsx` (1)
8) `components/shared/ImpactEnhancements.tsx` (1)
9) `components/shared/M3ErrorAlert.tsx` (1)
10) `components/shared/MetricCard.tsx` (1)
11) `components/shared/StatusChip.tsx` (1)
12) `components/ui/M3Card.tsx` (1)
13) `components/ui/StatusBadge/StatusBadge.tsx` (1)
14) `frontend/packages/ui/src/components/accordion/accordion.tsx` (0)
15) `frontend/packages/ui/src/components/alert/alert.tsx` (0)
16) `frontend/packages/ui/src/components/avatar/avatar.tsx` (0)
17) `frontend/packages/ui/src/components/badge/badge.tsx` (0)
18) `frontend/packages/ui/src/components/breadcrumb/breadcrumb.tsx` (0)
19) `frontend/packages/ui/src/components/card/card.tsx` (0)
20) `frontend/packages/ui/src/components/checkbox/checkbox.tsx` (0)

## Do Not Migrate (Rule)

Keep these in-place:
- Feature-specific components (`components/features/**`)
- Page-specific components (`components/main/**`, `components/layout/**`)
- Components tightly coupled to routes or API responses

## Notes

- `frontend/packages/ui` items are already in the UI package; validate before migrating.
- Many “0 usage” items may be unused or only referenced by Storybook.

