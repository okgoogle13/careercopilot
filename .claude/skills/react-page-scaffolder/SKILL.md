---
name: react-page-scaffolder
description: "Creates a complete React page directory (page.tsx, index.ts, styles.css) with routing integration. Use when asked to create a new page, view, or route handler that combines components and layouts."
version: 1.0.0
tags: []
---

## Purpose

Creates a complete React page directory structure (page.tsx, index.ts, styles.css) with routing integration via a helper script.

## When to Use

- When adding a new page, view, or route handler to the application.
- When establishing a consistent layout and style pattern for new sections.
- When needing to rapidly scaffold the boilerplate for a complex page component.

## Process

1. **Page Naming**: Get name in `PascalCase` (e.g., `UserProfile`).
2. **Environment Prep**: Ensure the helper script is executable (`chmod +x`).
3. **Execution**: Run `create-page.sh {{PAGE_NAME}}`.
4. **Reporting**: Display script output and file paths to the user.
