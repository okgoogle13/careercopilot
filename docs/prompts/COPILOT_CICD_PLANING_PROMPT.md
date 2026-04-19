# GitHub Copilot CI/CD & Quality Checks Brainstorming Prompt

Use this prompt in GitHub Copilot IDE (e.g., Copilot Chat in VS Code/Cursor) to initiate a discussion around implementing and optimizing CI/CD checks for your Figma-to-code migration phase.

---

**Paste the following into your GitHub Copilot Chat / Edits window:**

```text
You are acting as a Senior DevOps and Frontend Infrastructure Architect for the CareerCopilot application (React 18 + TS + Vite + Tailwind v4 + Zustand + GCP/Firebase).

We have just completed a massive "design-system readiness and Figma normalization" pass (rebuilding shells & canonical nodes, extracting tokens, ensuring zero-flora guidelines, and cleaning up the dashboard, opportunities, apps, and analysis routes).

Before we move into the heavy implementation/execution phase (broad code extraction & syncing), we require robust CI/CD and pre-commit checks to ensure everything stays aligned, token-compliant, and regression-free.

**Your Goal:**
Brainstorm strategies and suggest specific CI/CD mechanisms, pre-commit hooks, or other automated checks to maximize the quality of our outputs during this next phase.

**Consider the following in your response:**
1. **Design System & Token Audits:** Automated ways to continuously detect hardcoded hex values, unallowed generic shapes, or "flora" in the codebase, ensuring we only use the approved `var(--kr-color-*)` semantic tokens.
2. **Route Integrity:** Checks to ensure that our runtime UI (`App.tsx`), `route-registry.ts`, and our manifests stay perfectly aligned and that no drift occurs.
3. **CI Pipeline Flow:** Suggestions for GitHub Actions or pre-commit/husky stages that run type-checking (`tsc --noEmit`), linting/ESLint, and UI testing (Jest/Playwright).
4. **Any other strategic mechanisms** (Performance thresholds, structural linters, compliance bots) relevant to highly repetitive, design-heavy frontend work.

**Once you have mapped out the possibilities, use your `writing-plans` skill/mode to propose a concrete, step-by-step implementation plan for these next steps.**

The plan must:
- Assume an engineer with zero prior context is executing it.
- Detail exactly which files to create/modify (e.g., `.github/workflows/ci.yml`, `.husky/pre-commit`, ESLint custom rules).
- Prioritize high-impact, low-friction checks first.
```
