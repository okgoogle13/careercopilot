---
name: storybook-scaffolder
description: "Scaffolds a new, M3-token-aware Storybook file (*.stories.tsx)."
version: 2.0.0
---
# Storybook Scaffolder Workflow (v2)
1. Get component path.
2. Generate `.stories.tsx` file from template.
3. **Prepend this line to the top of the generated file:** `import 'src/styles/design-tokens.css';`
4. Report success.
