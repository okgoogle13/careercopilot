---
name: artifact-bundler
description: Bundles a React component or mini-app into a single, self-contained HTML
  file. Use this to create shareable prototypes of Kerala Rage components that can
  be run independently in a browser.
metadata:
  legacy_frontmatter:
    version: 1.0.0
    tags:
    - bundling
    - prototype
    - html
    - parcel
---

# Artifact Bundler

## Purpose
Wraps a specific React component or entry point into a standalone HTML file with all CSS (Tailwind/Kerala Rage) and JS inlined. This allows for easy sharing and testing of components outside the main application environment.

## When to Use
- **Prototyping**: You want to share a specific "ManifestoCard" or "Pebble" implementation with the user as a single file.
- **Testing**: You want to verify a component's behavior in isolation without running the full dev server.
- **Archiving**: You want to save a snapshot of a component's state.

## Usage

```bash
# Bundle a specific component (scaffolds a temporary entry point)
./scripts/bundle.sh --component src/components/ui/Pebble.tsx --output dist/pebble-prototype.html

# Bundle an existing entry point
./scripts/bundle.sh --entry src/prototypes/dashboard-v2.tsx --output dist/dashboard.html
```

## How It Works
1.  **Scaffolding**: If a component is provided, it creates a temporary `_entry.tsx` wrapper that imports the component and renders it with the `KeralaRage` theme providers.
2.  **Building**: Uses `parcel` to build the entry point.
3.  **Inlining**: Uses `html-inline` (or similar logic) to embed all scripts and styles into a single HTML file.
4.  **Cleanup**: Removes temporary build files.

## Dependencies
- `parcel`
- `html-inline` (or equivalent in-script logic)
