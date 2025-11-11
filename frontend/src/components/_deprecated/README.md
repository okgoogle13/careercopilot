# Deprecated Components

This directory contains archived UI components that are no longer actively used in the Career Copilot application. These components are preserved in git history but have been removed from active exports to reduce codebase clutter.

## Archived Components

### dropdown-menu.tsx
- **Archived**: 2025-11-11
- **Reason**: Zero active usages in codebase
- **Status**: Can be purged after 2-3 sprints if no usage emerges
- **Git History**: Preserved via `git mv` - can be recovered if needed

### scroll-area.tsx
- **Archived**: 2025-11-11
- **Reason**: Zero active usages in codebase
- **Status**: Can be purged after 2-3 sprints if no usage emerges
- **Git History**: Preserved via `git mv` - can be recovered if needed

## Recovery Instructions

If a deprecated component needs to be restored:

```bash
# Find the component in git history
git log --follow frontend/src/components/_deprecated/[component].tsx

# Check out a specific version
git checkout <commit-hash> -- frontend/src/components/_deprecated/[component].tsx

# Move back to active components
git mv frontend/src/components/_deprecated/[component].tsx frontend/src/components/ui/[component].tsx

# Update exports in frontend/src/components/ui/index.ts
```

## Purge Guidelines

- Archive date: 2025-11-11
- Recommended purge date: 2025-12-25 (6 weeks)
- Purge condition: No import requests in code review or issues filed

## Note

Archived components are NOT exported from `frontend/src/components/ui/index.ts` to keep the public API clean and discoverable.
