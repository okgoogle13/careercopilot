#!/usr/bin/env bash
# CareerCopilot Migration Kit v3 scaffold creator
# Creates deterministic file/folder skeleton for Codex to populate.

set -euo pipefail

BASE_DIR="${1:-./careercopilot-migration-kit-v3}"

echo "🚀 Creating Migration Kit scaffold at: ${BASE_DIR}"

# --- directories ---
mkdir -p "${BASE_DIR}"/{apps/web/src/{app,router,config,screens,features,components/ui,styles,tests},apps/web/public}
mkdir -p "${BASE_DIR}"/packages/{eslint-plugin-kerala-rage/{rules,tests,configs},design-audit/src,shared-config}
mkdir -p "${BASE_DIR}"/tools/design-audit/bin
mkdir -p "${BASE_DIR}"/docs/{migration,architecture,design-system}
mkdir -p "${BASE_DIR}"/.github/workflows
mkdir -p "${BASE_DIR}"/.husky

# --- root config files ---
cat > "${BASE_DIR}/package.json" <<'EOF'
{
  "name": "careercopilot-migration-kit-v3",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "echo 'configure workspace runners'",
    "build": "echo 'configure workspace runners'",
    "lint": "echo 'configure workspace runners'",
    "type-check": "echo 'configure workspace runners'",
    "design-audit": "node tools/design-audit/bin/audit-design-compliance.js"
  }
}
EOF

cat > "${BASE_DIR}/turbo.json" <<'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", "build/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "type-check": {}
  }
}
EOF

cat > "${BASE_DIR}/tsconfig.json" <<'EOF'
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true
  }
}
EOF

cat > "${BASE_DIR}/.gitignore" <<'EOF'
node_modules/
dist/
build/
.turbo/
.env*
*.log
.DS_Store
EOF

cat > "${BASE_DIR}/README.md" <<'EOF'
# CareerCopilot Migration Kit v3
Scaffold-only setup. Run Codex with the companion prompt to populate implementation.
EOF

# --- migration governance docs ---
cat > "${BASE_DIR}/docs/migration/MIGRATION_GUARDRAILS.md" <<'EOF'
# Migration Guardrails
- Canonical sources only:
  - frontend/src/design/tokens/tokens.json
  - frontend/src/design/styles/design-tokens.css
- Use semantic tokens (--sys-color-*, --sys-shape-*, --sys-type-*).
- No hardcoded hex/rgb/hsl in migrated screens.
- Zero-flora lock: ban botanical references.
- Ban deprecated tokens: labWrenMetalBlue, GumLeafGreen, WattleGold, inkGreen.
EOF

cat > "${BASE_DIR}/docs/migration/MIGRATION_TRACKER.md" <<'EOF'
# Migration Tracker

| route | status | hardcoded_violations | banned_terms | visual_parity | flag_enabled | notes |
|---|---|---:|---:|---|---|---|
| /login | legacy | 0 | 0 | pending | false | |
| /register | legacy | 0 | 0 | pending | false | |
| /dashboard | legacy | 0 | 0 | pending | false | |
EOF

cat > "${BASE_DIR}/docs/migration/PR_PLAN.md" <<'EOF'
# PR Plan
1. Governance + lint/audit tooling
2. Route coexistence + feature flags
3. /login migration
4. /register migration
5. /dashboard migration
EOF

# --- app skeleton files ---
cat > "${BASE_DIR}/apps/web/package.json" <<'EOF'
{
  "name": "@careercopilot/web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  }
}
EOF

cat > "${BASE_DIR}/apps/web/index.html" <<'EOF'
<!doctype html>
<html><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Migration Kit v3</title></head>
<body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>
EOF

cat > "${BASE_DIR}/apps/web/src/main.tsx" <<'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
EOF

cat > "${BASE_DIR}/apps/web/src/app/App.tsx" <<'EOF'
export function App() {
  return <div>Migration Kit v3 scaffold</div>;
}
EOF

# route/flag placeholders
for f in \
  apps/web/src/router/FeaturesRouter.tsx \
  apps/web/src/router/ScreensRouter.tsx \
  apps/web/src/router/RouteGate.tsx \
  apps/web/src/config/featureFlags.ts \
  apps/web/src/screens/LoginScreen.tsx \
  apps/web/src/screens/RegisterScreen.tsx \
  apps/web/src/screens/DashboardScreen.tsx \
  apps/web/src/features/LoginLegacy.tsx \
  apps/web/src/features/RegisterLegacy.tsx \
  apps/web/src/features/DashboardLegacy.tsx \
  apps/web/src/components/ui/Strike.tsx \
  apps/web/src/components/ui/Placard.tsx \
  apps/web/src/components/ui/March.tsx \
  apps/web/src/styles/tokens.css \
  apps/web/src/styles/screen.css \
  apps/web/src/tests/login.spec.tsx \
  apps/web/src/tests/routing.spec.tsx
do
  cat > "${BASE_DIR}/${f}" <<'EOF'
/* TODO: Implement via Codex prompt */
EOF
done

# --- eslint plugin skeleton ---
cat > "${BASE_DIR}/packages/eslint-plugin-kerala-rage/package.json" <<'EOF'
{
  "name": "eslint-plugin-kerala-rage",
  "version": "0.0.1",
  "main": "index.js"
}
EOF

cat > "${BASE_DIR}/packages/eslint-plugin-kerala-rage/index.js" <<'EOF'
module.exports = {
  rules: {
    'no-hardcoded-styles': require('./rules/no-hardcoded-styles'),
    'no-banned-design-terms': require('./rules/no-banned-design-terms')
  },
  configs: {
    recommended: { plugins: ['kerala-rage'], rules: {} }
  }
};
EOF

for f in \
  packages/eslint-plugin-kerala-rage/rules/no-hardcoded-styles.js \
  packages/eslint-plugin-kerala-rage/rules/no-banned-design-terms.js \
  packages/eslint-plugin-kerala-rage/tests/no-hardcoded-styles.test.js \
  packages/eslint-plugin-kerala-rage/tests/no-banned-design-terms.test.js \
  packages/eslint-plugin-kerala-rage/configs/screens.js \
  packages/eslint-plugin-kerala-rage/configs/features.js
do
  cat > "${BASE_DIR}/${f}" <<'EOF'
/* TODO: Implement via Codex prompt */
EOF
done

# --- design audit tool skeleton ---
cat > "${BASE_DIR}/tools/design-audit/bin/audit-design-compliance.ts" <<'EOF'
#!/usr/bin/env node
// TODO: Implement via Codex prompt
console.log('design-audit scaffold');
EOF
chmod +x "${BASE_DIR}/tools/design-audit/bin/audit-design-compliance.ts"

for f in \
  packages/design-audit/src/index.ts \
  packages/design-audit/src/rules.ts \
  packages/design-audit/src/reporter.ts \
  packages/design-audit/src/types.ts
do
  cat > "${BASE_DIR}/${f}" <<'EOF'
/* TODO: Implement via Codex prompt */
EOF
done

# --- CI / hooks ---
cat > "${BASE_DIR}/.github/workflows/design-compliance.yml" <<'EOF'
name: Design Compliance
on: [pull_request]
jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "TODO: wire install, lint, type-check, design-audit"
EOF

cat > "${BASE_DIR}/.husky/pre-commit" <<'EOF'
#!/usr/bin/env sh
echo "TODO: lint-staged hook"
EOF
chmod +x "${BASE_DIR}/.husky/pre-commit"

# --- extra docs/placeholders to guarantee 40+ files ---
for f in \
  docs/architecture/ROUTING.md \
  docs/architecture/FEATURE_FLAGS.md \
  docs/design-system/TOKEN_USAGE.md \
  docs/design-system/BANNED_TERMS.md \
  docs/migration/SCREEN_LOGIN.md \
  docs/migration/SCREEN_REGISTER.md \
  docs/migration/SCREEN_DASHBOARD.md \
  apps/web/src/app/providers.tsx \
  apps/web/src/app/routes.tsx \
  apps/web/src/app/layout.tsx \
  apps/web/src/tests/visual.spec.ts \
  packages/shared-config/eslint.base.cjs \
  packages/shared-config/tsconfig.base.json \
  packages/shared-config/prettier.config.cjs
do
  cat > "${BASE_DIR}/${f}" <<'EOF'
/* TODO: Implement via Codex prompt */
EOF
done

# file count
COUNT=$(find "${BASE_DIR}" -type f | wc -l | tr -d ' ')
echo "✅ Scaffold created with ${COUNT} files."
echo "Next: run Codex with the companion prompt to populate implementations."
