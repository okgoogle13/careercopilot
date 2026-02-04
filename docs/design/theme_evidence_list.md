# Theme & Design Token Evidence List

This document provides a verified locations list for the Northcote Design System's theme and token infrastructure.

## 1. Design Tokens

### **Master Source of Truth**

- **Location:** `design-system/tokens.json`
- **Purpose:** The definitive, canonical JSON definition of all design tokens (Color, Typography, Motion, Spacing). This is the source from which other files should be derived or synced.

### **Frontend Implementation Source**

- **Location:** `frontend/src/design/tokens/tokens.json`
- **Purpose:** The local copy used explicitly by the Frontend's Tailwind configuration. This file should be kept in sync with the Master Source.

## 2. Tailwind Configuration

### **Active Configuration File**

- **Location:** `frontend/tailwind.config.ts`
- **Purpose:** Configures the Tailwind CSS framework. It imports `frontend/src/design/tokens/tokens.json` to map token values directly to Tailwind utility classes (e.g., `text-primary`, `bg-surface-0`).

## 3. CSS Styling Architecture

### **Global Entry Point**

- **Location:** `frontend/src/globals.css`
- **Purpose:** The main content file loaded by the application. It acts as an orchestrator, importing the unified theme file.

### **Northcote Theme Styles**

- **Location:** `frontend/src/design/styles/northcote.css`
- **Purpose:** Contains the CSS variable definitions (`:root { ... }`) and foundational class styles for the Northcote theme. It is here that the abstract tokens are bound to actual CSS Custom Properties.

### **Legacy Support**

- **Location:** `frontend/src/index.css`
- **Purpose:** A legacy entry point retained for compatibility; it redirects to `globals.css`.
