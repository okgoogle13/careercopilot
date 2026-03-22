# Prototype Development & Harvest Guardrails

This document establishes canonical rules for AI agents (Comet/Gemini) and developers working within the `prototype_v2.0` repository.

## Core Mandate
- **This is an existing prototype, not a fresh scaffold.**
- **Preserve the current prototype as a support-reference build.**
- **Harvest patterns and seams, not shell ownership.**

---

## 1. Architectural Boundaries (Shell Integrity)
- **Do not introduce or expand routing systems.**
- **Do not add `react-router-dom`, URL routes, route guards, or new navigation architecture.**
- **Preserve the current prototype shell (`App.tsx`, `AppShell.tsx`)** unless a task explicitly targets a named shell file.
- **Maintain local state (`activeTab`)** for navigation within the prototype.

## 2. Dependency & File Posture
- **Do not add, remove, or upgrade dependencies** unless explicitly naming the package.
- **Do not delete or rename files** unless explicitly naming the file and requiring import updates.
- **Modify only the files listed in the task.**
- **Preserve unrelated code** in target files.
- **Use local stub data only** unless the task explicitly requests interface shaping for future harvest.

## 3. React Strategy & Harvest Patterns
- **Prototype**: Maintain React v19.2.0.
- **Main Repo Target**: Maintain React v18 compatibility.
- **Rule**: Write **React 18-compatible component patterns** unless a batch explicitly specifies a "prototype-only enhancement."
- **Avoid React 19-only assumptions** in prototype cleanup.
- **Isolation**: Treat any future React 19 upgrade in the main repository as a separate migration.

---

## 4. Work Summary Requirements
At the end of each session, provide a concise list of files changed and any new patterns established for harvest.
