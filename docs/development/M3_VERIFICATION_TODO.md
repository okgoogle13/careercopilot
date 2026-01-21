# M3 Verification TODO

Tracked checklist distilled from `docs/archive/legacy/root/M3_REMAINING_TASKS.md`.

## Pre-Production Verification
- [ ] Build verification: run `cd frontend && npm run build` (expect no errors)
- [ ] Visual verification: run `cd frontend && npm run dev`, then check `/job-queue` for shapes, palette, dark mode, and M3 components

## Post-Production Enhancements (Optional)
- [ ] Replace StatusChip with custom M3Chip
- [ ] Audit ElectricTabs component
- [ ] Create M3Switch component
- [ ] Create M3Dialog wrapper
- [ ] Create M3Snackbar/Toast
- [ ] Storybook component gallery
- [ ] Visual regression testing (Chromatic/Percy)
- [ ] M3Table component
- [ ] M3Pagination component
- [ ] M3DatePicker
- [ ] Performance optimization audit (Lighthouse)
