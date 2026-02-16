Handover: esbuild/Yarn install failure

Summary

This repository's frontend build is failing during `yarn install` due to an esbuild native-binary version mismatch observed during the package postinstall. The installer expects esbuild 0.21.5 but a binary reporting 0.18.20 is being found at link/build time. Multiple attempts to clean caches and reinstall have been made but the error persists.

Key facts

- Repo: careercopilot (branch: develop)
- Node observed in logs: v22.17.0
- Yarn observed: 4.10.2 (Yarn v4 workspaces)
- Problematic package: esbuild (native binary, platform-specific `@esbuild/*` packages)
- Symptoms: `yarn install` fails in the link/build step with message: "Error: Expected \"0.21.5\" but got \"0.18.20\""
- Artifacts: many temporary build logs under /tmp/xfs-\*/build.log containing the same error
- Files touched during debugging: root `package.json` (resolutions pinned to esbuild 0.21.5), backups of `yarn.lock` (e.g., yarn.lock.bak.<timestamp>), created scripts: `scripts/frontend-readiness.sh`, `scripts/prep-production-env.sh`, and `.github/copilot-instructions.md` (doc updates)

What we tried already (so Claude doesn't repeat work)

- Backed up the original `yarn.lock`.
- Added a `resolutions` entry in root `package.json` to pin `esbuild` to `0.21.5` and bumped the root `esbuild` devDependency to `^0.21.5`.
- Removed `node_modules`, `frontend/node_modules`, `functions/node_modules`, `.yarn/cache`, `.yarn/unplugged`, and `.pnp.*` and re-ran `yarn install`.
- Removed local `node_modules/@esbuild` and `node_modules/esbuild` artifacts and retried `yarn install`.
- Attempted a focused `esbuild` install and saved an install log in `/tmp` (tools were limited by environment rc files when trying curl/tar directly).

Observed state after the attempts

- `yarn install` still fails at the esbuild build step with the same binary-version mismatch.
- The repo's `yarn.lock` still contains many `@esbuild/*` entries referencing 0.18.20 (legacy lock entries), which is likely a root cause.
- There are `package-lock.json` entries referencing esbuild@0.18.20 as well (from npm lock previously present), which may cause confusion if some scripts or tools read it.

Primary root cause hypothesis

1. The current lockfile (`yarn.lock`) includes platform-specific `@esbuild/*` entries at version 0.18.20. Even after adding `resolutions` for `esbuild: 0.21.5`, Yarn is attempting to build esbuild packages and ends up interacting with a binary or cached package that reports 0.18.20.
2. There may be residual cached or unplugged artifacts, or a manually checked-in `node_modules` snapshot, or a stale downloaded binary in Yarn caches or in `node_modules` paths that wasn't removed by earlier cleanup.
3. `package-lock.json` (npm) exists in the repo and references 0.18.20; that can be confusing in a Yarn-first workspace and should be removed unless intentionally used.

Goals for Claude

- Produce a clean repo state where `yarn install` completes successfully and the frontend build (`yarn build:frontend` / `cd frontend && yarn build`) works locally.
- Regenerate and commit a consistent `yarn.lock` that resolves esbuild to 0.21.5 across the monorepo.
- Ensure no stale esbuild binaries or `@esbuild/*` 0.18.20 artifacts remain in caches or node_modules after the fix.

Assumptions (confirm before applying)

- It's OK to regenerate `yarn.lock` (we backed it up). If lockfile immutability or CI policy forbids this, create a PR and explain the lockfile change.
- Using Yarn v4 is desired for this monorepo. If the team prefers npm or pnpm, discuss migration options.
- Environment where you'll test is Linux x64 (the dev container here is Ubuntu 24.04). If testing on other OS (mac, windows), esbuild platform-specific tarballs will differ.

Step-by-step remediation (exact commands)

Note: use these commands from the repo root. Commands are written for bash. When a command may take long, it's noted.

1. Create a branch for the fix

```bash
git checkout -b fix/esbuild-lock-and-install
```

2. Ensure no interfering shell startup hooks (rvm or similar): run commands in a clean environment if necessary

If your shell sources rvm or other tools that cause errors during non-interactive commands, run the long-running installs in a clean environment (example used in diagnostics):

```bash
# Run in a clean environment to avoid rc hook errors
env -i bash -lc 'cd /workspaces/careercopilot && set -euo pipefail; yarn -v; node -v'
```

3. Remove npm lock and stale caches to avoid cross-manager confusion

```bash
# optional but recommended: remove npm's package-lock if repo uses Yarn
git rm -f package-lock.json || true
rm -rf package-lock.json
```

4. Remove node_modules and Yarn caches & unplugged copies

```bash
rm -rf node_modules frontend/node_modules functions/node_modules .yarn/cache .yarn/unplugged .pnp.* || true
```

5. Ensure any checked-in esbuild artifacts are removed

```bash
# remove any leftover local esbuild directories
rm -rf node_modules/@esbuild || true
rm -rf node_modules/esbuild || true
# search and remove any other stray esbuild binaries
find . -type f -name "esbuild*" -path "*/node_modules/*" -print -exec rm -f {} \; || true
```

6. Make sure `package.json` has a resolution and devDependency for esbuild pinned to the target version (0.21.5). If not present, add or update:

```json
"resolutions": {
  "esbuild": "0.21.5"
}
```

And in `devDependencies` add/update:

```json
"esbuild": "^0.21.5"
```

(Modify the JSON using an editor or `jq` — avoid manual syntax mistakes.)

7. Run a clean Yarn install and capture logs to workspace files for inspection

```bash
# capture both stdout/stderr to a file under the workspace for later inspection
env -i bash -lc 'cd /workspaces/careercopilot && set -euo pipefail; yarn install 2>&1 | tee yarn_install_output.log'
```

If `yarn install` still fails: collect the temporary build log path from Yarn failure message (e.g., /tmp/xfs-\*/build.log) and copy it into the repo for analysis:

```bash
# after a failing yarn install, find the last xfs dir and copy its build.log
last=$(ls -td /tmp/xfs-* 2>/dev/null | head -n1) || true
[ -n "$last" ] && cp "$last/build.log" /workspaces/careercopilot/yarn_esbuild_build.log || true
```

8. If `yarn install` succeeds, regenerate and commit `yarn.lock`

```bash
# verify the lockfile was created/updated
git add yarn.lock
git commit -m "fix: regenerate yarn.lock and pin esbuild@0.21.5" || true
```

9. Verify the frontend build

```bash
# run the frontend readiness script we added (it runs install/build + artifact check)
./scripts/frontend-readiness.sh  # or: cd frontend && yarn build
```

10. Run quick smoke tests

- Confirm `frontend/dist/index.html` exists and references hashed bundles.
- Run a few backend pytest quick checks if appropriate: `pytest backend/app/tests/ -q` (only if tests are fast)

Helpful debugging tips and extra checks

- If the postinstall script still complains about version mismatches, inspect `node_modules/esbuild/bin/esbuild` (if present) and run it with `node node_modules/esbuild/bin/esbuild --version` or `strings node_modules/esbuild/bin/esbuild | head` to see what version the binary returns.

- Check `yarn.lock` for leftover `@esbuild/*` platform-specific entries by searching for `@esbuild/` and verifying their `version:` lines. Replace or delete them by regenerating the lockfile.

- If `yarn` is constructing downloaded binaries under a `downloaded-...` path, inspect `node_modules/esbuild/install.js` (or the package's `postinstall`) to see where it looks for platform packages. You can extract the `install.js` from the package tarball (download the tarball from registry and inspect it).

- If workspaces or a package (like `vite` or `tsx`) depend on older esbuild versions and are forcing older `@esbuild/*` entries, consider raising those package versions or adding top-level overrides/resolutions to enforce 0.21.5 for all `@esbuild/*` packages.

- If CI or other team policies block lockfile regeneration directly on `develop`, create a PR and explain that regenerating `yarn.lock` and pinning esbuild is necessary for reproducible native builds.

Files likely to change in the PR

- `package.json` (root): updates for `resolutions` and `devDependencies.esbuild` (already attempted). Confirm JSON is valid.
- `yarn.lock`: regenerated and committed.
- (Optional) Delete `package-lock.json` if present.
- Potential minor changes in `scripts/*` if you add logging or adjust readiness script behavior for CI.

Verification checklist (before merging PR)

- [ ] `yarn install` runs to completion locally and in CI (no esbuild postinstall errors).
- [ ] `yarn build:frontend` or `cd frontend && yarn build` completes successfully and `frontend/dist/index.html` exists.
- [ ] `yarn.lock` committed and PR includes the lockfile change.
- [ ] No references to esbuild 0.18.20 remain in `yarn.lock` or `package-lock.json`.
- [ ] Build logs from the failed runs (if any) are attached to the PR for traceability.

If you hit a blocker

- Save the failing build log from `/tmp/xfs-*` into the repo (copy to a file like `/workspaces/careercopilot/yarn_esbuild_build.log`) and attach it to the PR or paste the relevant excerpt.
- If `yarn` still refuses to pick the pinned resolution, try temporarily updating the packages that depend on esbuild (for example `vite`, `tsx`, or others) to versions that depend on later esbuild, then regenerate `yarn.lock`.

Extra recommendations (post-fix)

- Add an entry to the repo README or developer onboarding notes documenting: "How to build the frontend locally", including Node and Yarn version requirements and the `./scripts/frontend-readiness.sh` script.
- Add a brief CI job that runs `yarn install` and `cd frontend && yarn build` in a clean Ubuntu environment to detect these native-binary mismatches early.

Contact and context

If anything is unclear, refer to the working notes in this dev session: key temporary build logs in `/tmp/xfs-*` (they consistently contain the same "Expected 0.21.5 but got 0.18.20" message), root `package.json` now contains a `resolutions` entry for esbuild 0.21.5, and `yarn.lock` backups exist (e.g., yarn.lock.bak.\*).

Next step for me (if you want me to continue)

- I can proceed to run the remediation steps above, capture the install logs inside the workspace, and commit the regenerated `yarn.lock` to a fix branch and open a PR. Say "please proceed" to authorize me to run the install+commit flow.
# CI Trigger
