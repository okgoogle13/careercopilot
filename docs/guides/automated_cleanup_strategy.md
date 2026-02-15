# Automated Repository Cleanup Strategy

This guide outlines effective, scriptable strategies for removing dead code, legacy files, and deprecated React components from your repository.

---

## 1. Dead Code & Unused Export Detection (JS/TS)

The most effective "silent" cleanup is removing code that is exported but never imported.

### 🛠️ Recommended Tool: [Knip](https://knip.dev/)
Knip is currently the industry standard for finding unused files, dependencies, and exports.

- **Capabilities**: 
  - Finds unused files.
  - Finds unused dependencies in `package.json`.
  - Finds unused exports (the "dead code" within files).
  - Supports workspaces (Monorepos).
  
- **Automated Command**:
  ```bash
  npx knip
  ```

### 🛠️ Alternative: [ts-prune](https://github.com/nadiv/ts-prune)
A lightweight alternative specifically for TypeScript.
  ```bash
  npx ts-prune
  ```

---

## 2. Unused Dependency Cleanup

Unused libraries bloat `node_modules` and increase security surface area.

### 🛠️ Recommended Tool: [depcheck](https://www.npmjs.com/package/depcheck)
Scans your code to see which `package.json` dependencies are actually used.

- **Automated Command**:
  ```bash
  npx depcheck
  ```

---

## 3. React Component & Asset Cleanup

### 🛠️ React-Specific Linting
Configure ESLint to catch unused bits before they become dead code.
- `react/no-unused-prop-types`
- `react/no-unused-state`
- `no-unused-vars` (standard JS)

### 🛠️ Dead File Detection
For React apps, use `webpack-deadcode-plugin` or `knip` to identify files that are never part of the main entry point bundle.

### 🛠️ Asset Purging (Custom Script)
You already have a logic for this in `scripts/asset_purge.py`. 
**Strategy**: Scan the `assets/` folder and `git grep` the filename in the `src/` directory. If 0 hits, move to `purge/`.

---

## 4. Automated Refactoring (Codemods)

Instead of manual deletion, use scripts to transform or remove code.

### 🛠️ Recommended Tool: [Putout](https://github.com/coderaiser/putout)
Putout is a pluggable linter and fixer that specializes in **dead code removal**.
- **Features**: 
  - Removes unused variables and imports.
  - Removes redundant logic (e.g., `if (true) { ... }`).
  - Simplifies complex expressions.
  
- **Automated Command**:
  ```bash
  npx putout src/ --fix
  ```

### 🛠️ Tool: [jscodeshift](https://github.com/facebook/jscodeshift)
The foundation for Meta's `react-codemod`. Best for complex migrations (e.g., changing a component API across 100 files).

---

## 5. Implementation Roadmap for CareerCopilot

| Phase | Action | Tool |
| :--- | :--- | :--- |
| **Audit** | Scan for unused files & exports | `npx knip` |
| **Dependency**| Remove unused npm packages | `npx depcheck` |
| **Dead Code** | Safe removal of unused imports/vars | `npx putout . --fix` |
| **Assets** | Move unreferenced images to archive | `scripts/asset_purge.py` |
| **Prevention**| Add cleanup check to CI | GitHub Actions + `knip` |

---

## 💡 Pro-Tip: The "Git Safety Net"
When doing mass-deletion:
1. Create a branch: `git checkout -b cleanup/dead-code`
2. Run your automated tool.
3. Commit everything.
4. If some part of the app breaks (e.g., dynamic imports missed by the tool), you can `git checkout` just that file. 

Never be afraid to delete code in Git; it’s never actually gone!
