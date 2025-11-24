# Build & Test Parallel CI Workflow

---

description: Run build and all test suites in parallel for the CareerCopilot monorepo
---

## Overview

This workflow demonstrates how to execute the **build** step and **all test suites** (frontend, functions, backend, e2e) concurrently, leveraging the `npm-run-all` utility. It can be used locally or in a CI environment (e.g., GitHub Actions).

## Prerequisites

1. **Install `npm-run-all`** (dev dependency) in the root of the repository:
   ```bash
   yarn add -D npm-run-all
   # or npm i -D npm-run-all
   ```
2. Ensure the following scripts exist in `package.json` (they already do, but we add the parallel wrappers):
   ```json
   "scripts": {
     "test:all:parallel": "npm-run-all --parallel test:frontend test:functions test:backend test:e2e",
     "build-and-test:parallel": "npm-run-all --parallel build test:all:parallel"
   }
   ```

## Steps

1. **Install dependencies**
   ```bash
   yarn install   # installs workspace packages and dev deps (including npm-run-all)
   ```

2. **Run the combined parallel workflow**
   ```bash
   npm run build-and-test:parallel
   ```
   - `build` runs the monorepo build (frontend + functions).
   - `test:all:parallel` spawns four test processes concurrently:
     - `test:frontend`
     - `test:functions`
     - `test:backend`
     - `test:e2e`
   - Output from each task is prefixed with its name, making logs easy to follow.

3. **CI Integration (GitHub Actions example)**
   ```yaml
   name: Build & Test Parallel
   on: [push, pull_request]

   jobs:
     build-test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Set up Node
           uses: actions/setup-node@v4
           with:
             node-version: '20'
         - name: Install dependencies
           run: yarn install
         - name: Run parallel build & tests
           run: npm run build-and-test:parallel
   ```
   This CI job will fail fast if any of the parallel tasks exit with a non‑zero status.

## Why Parallel?

- **Speed** – On a 4‑core CI runner, the four test suites finish roughly in the time of the **slowest** suite instead of the sum of all.
- **Resource Utilisation** – Each suite runs in its own process, allowing Node, Python (backend tests), and Playwright (e2e) to use CPU cores independently.
- **Immediate Feedback** – Logs are interleaved but clearly labelled, so you can spot failures instantly.

## Customising Concurrency

- **Limit concurrency** – If your CI runner has limited CPU, you can cap the number of parallel jobs using a semaphore pattern inside the scripts, or simply run a subset in parallel:
  ```json
  "test:core:parallel": "npm-run-all --parallel test:frontend test:functions"
  ```
- **Add more tasks** – Extend `test:all:parallel` with additional scripts (e.g., lint, typecheck) as needed.

---

**Enjoy blazing‑fast builds and tests!**
