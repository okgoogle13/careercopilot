# CI/CD Workflow Architecture

## Workflow Triggers Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     GitHub Repository Events                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌───────────┐       ┌──────────┐      ┌──────────────┐
        │ Pull      │       │  Push to │      │   Scheduled  │
        │ Request   │       │   main/  │      │   & Manual   │
        │           │       │  develop │      │   Dispatch   │
        └───────────┘       └──────────┘      └──────────────┘
                │                   │                   │
                └───────────────────┴───────────────────┘
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        │                                                         │
        ▼                                                         ▼
┌───────────────┐                                         ┌──────────────┐
│  Main CI/CD   │                                         │  Specialized │
│   Pipeline    │                                         │   Workflows  │
└───────────────┘                                         └──────────────┘
```

---

## Main CI Pipeline (`.github/workflows/ci.yml`)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI Pipeline Flow                          │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                        ┌──────────┐
                        │ changes  │  ◄──── Detects what changed
                        └──────────┘
                               │
            ┌──────────────────┴──────────────────┐
            │                                      │
            ▼                                      ▼
    ┌──────────────┐                      ┌──────────────┐
    │   CodeQL     │                      │   Frontend   │
    │   Security   │                      │    Tests     │
    └──────────────┘                      └──────────────┘
            │                                      │
            │                                      ▼
            │                              ┌──────────────┐
            │                              │   Frontend   │
            │                              │     Build    │
            │                              └──────────────┘
            │                                      │
            │              ┌───────────────────────┴────────────────┐
            │              │                                         │
            ▼              ▼                                         ▼
    ┌──────────────┐  ┌──────────────┐                    ┌──────────────┐
    │   Backend    │  │     MCP      │                    │  Playwright  │
    │  Static      │  │ Integration  │                    │   Matrix     │
    │   Checks     │  │    Tests     │                    │ (3 browsers  │
    └──────────────┘  └──────────────┘                    │  × 4 shards) │
            │              │                               └──────────────┘
            ▼              │                                       │
    ┌──────────────┐       │                                      │
    │   Backend    │       │                                      │
    │    Tests     │       │                                      │
    └──────────────┘       │                                      │
            │              │                                      │
            ▼              ▼                                      │
    ┌──────────────┐  ┌──────────────┐                          │
    │   Genkit     │  │  Functions   │                          │
    │    Model     │  │    Tests     │                          │
    │  Validation  │  └──────────────┘                          │
    └──────────────┘          │                                  │
            │                 │                                  │
            └─────────────────┴──────────────────────────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │ Quality Gate │  ◄──── Checks all results
                      │ (12 checks)  │
                      └──────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
        ┌──────────┐              ┌──────────────┐
        │   PASS   │              │     FAIL     │
        │  Deploy  │              │ PR Comment   │
        └──────────┘              └──────────────┘
```

---

## Specialized Workflows

### 1. MCP Health Checks (Every 6 hours)

```
┌─────────────────────────────────────────┐
│      MCP Health Checks Pipeline         │
└─────────────────────────────────────────┘
              │
      ┌───────┴───────┐
      │               │
      ▼               ▼
┌──────────┐    ┌─────────────┐
│ Validate │    │  Test MCP   │
│  Configs │    │   Servers   │
└──────────┘    └─────────────┘
      │               │
      │         ┌─────┴─────┬─────────┬─────────┐
      │         │           │         │         │
      │         ▼           ▼         ▼         ▼
      │    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
      │    │ Flash  │ │ Cloud  │ │ Docker │ │ Design │
      │    │Sidekick│ │  Ops   │ │  MCP   │ │ System │
      │    └────────┘ └────────┘ └────────┘ └────────┘
      │         │           │         │         │
      │         └───────────┴─────────┴─────────┘
      │                     │
      ▼                     ▼
┌──────────┐        ┌─────────────┐
│ Security │        │Compatibility│
│   Scan   │        │    Check    │
└──────────┘        └─────────────┘
      │                     │
      └──────────┬──────────┘
                 │
                 ▼
         ┌──────────────┐
         │    Report    │
         │   Summary    │
         └──────────────┘
```

### 2. Docker Security (Weekly + PRs)

```
┌─────────────────────────────────────────┐
│      Docker Security Pipeline           │
└─────────────────────────────────────────┘
              │
      ┌───────┴───────┬───────────┐
      │               │           │
      ▼               ▼           ▼
┌──────────┐    ┌──────────┐  ┌──────────┐
│  Scan    │    │  Scan    │  │  Scan    │
│ Backend  │    │ Frontend │  │   Root   │
└──────────┘    └──────────┘  └──────────┘
      │               │           │
      ▼               ▼           ▼
┌──────────┐    ┌──────────┐  ┌──────────┐
│  Trivy   │    │  Trivy   │  │  Trivy   │
│  SARIF   │    │  SARIF   │  │  SARIF   │
└──────────┘    └──────────┘  └──────────┘
      │               │           │
      ▼               ▼           ▼
┌──────────┐    ┌──────────┐  ┌──────────┐
│Generate  │    │Generate  │  │ Upload   │
│  SBOM    │    │  SBOM    │  │  SARIF   │
└──────────┘    └──────────┘  └──────────┘
      │               │           │
      └───────────────┴───────────┘
                  │
                  ▼
          ┌──────────────┐
          │   Security   │
          │  Dashboard   │
          └──────────────┘
```

### 3. Bundle Analysis (PRs only)

```
┌─────────────────────────────────────────┐
│       Bundle Analysis Pipeline          │
└─────────────────────────────────────────┘
              │
      ┌───────┴───────┐
      │               │
      ▼               ▼
┌──────────┐    ┌──────────┐
│  Build   │    │  Build   │
│ PR Branch│    │   Base   │
└──────────┘    └──────────┘
      │               │
      ▼               ▼
┌──────────┐    ┌──────────┐
│Calculate │    │Calculate │
│  Sizes   │    │  Sizes   │
└──────────┘    └──────────┘
      │               │
      └───────┬───────┘
              │
              ▼
        ┌──────────┐
        │ Compare  │
        └──────────┘
              │
              ▼
        ┌──────────┐
        │ PR       │
        │ Comment  │
        └──────────┘
```

### 4. Storybook (PRs + Push)

```
┌─────────────────────────────────────────┐
│        Storybook Pipeline               │
└─────────────────────────────────────────┘
              │
      ┌───────┴───────┬───────────┐
      │               │           │
      ▼               ▼           ▼
┌──────────┐    ┌──────────┐  ┌──────────┐
│  Build   │    │Chromatic │  │Component │
│Storybook │    │  Deploy  │  │  Tests   │
└──────────┘    └──────────┘  └──────────┘
      │               │           │
      ▼               ▼           ▼
┌──────────┐    ┌──────────┐  ┌──────────┐
│  Upload  │    │  Visual  │  │Playwright│
│Artifact  │    │Regression│  │  Tests   │
└──────────┘    └──────────┘  └──────────┘
      │               │           │
      └───────────────┴───────────┘
                  │
                  ▼
          ┌──────────────┐
          │   Summary    │
          └──────────────┘
```

---

## Workflow Dependencies

```
Quality Gate depends on:
├── changes
├── codeql
├── frontend
├── frontend-build
├── backend-static-checks
├── backend-tests
├── functions
├── e2e-tests
├── test-firestore-rules
├── extension-build
├── mcp-integration-tests  ◄─── NEW
├── genkit-model-tests     ◄─── NEW
└── playwright-matrix      ◄─── NEW
```

---

## Parallel Execution Matrix

```
Playwright Matrix (12 parallel jobs):
├── chromium
│   ├── shard 1/4
│   ├── shard 2/4
│   ├── shard 3/4
│   └── shard 4/4
├── firefox
│   ├── shard 1/4
│   ├── shard 2/4
│   ├── shard 3/4
│   └── shard 4/4
└── webkit
    ├── shard 1/4
    ├── shard 2/4
    ├── shard 3/4
    └── shard 4/4
```

---

## Scheduled Workflows

```
┌─────────────────────────────────────────────────────────────┐
│                    Scheduled Workflows                       │
├─────────────────────────────────────────────────────────────┤
│ MCP Health Checks   │ Every 6 hours      │ Continuous      │
│ Docker Security     │ Weekly Mon 2am UTC │ Weekly          │
│ MCP Benchmarks      │ Weekly Mon 3am UTC │ Weekly          │
└─────────────────────────────────────────────────────────────┘
```

---

## Artifact Flow

```
┌─────────────────────────────────────────┐
│          Artifact Retention             │
├─────────────────────────────────────────┤
│ Frontend Dist       │ 1 day             │
│ E2E Test Results    │ 7 days            │
│ Playwright Reports  │ 7 days            │
│ Bundle Analysis     │ 7 days            │
│ Security Reports    │ 30 days           │
│ MCP Benchmarks      │ 30 days           │
│ SBOM                │ 90 days           │
└─────────────────────────────────────────┘
```

---

## Security Integration

```
GitHub Security Tab receives:
├── CodeQL Results (Python, JavaScript)
├── Trivy SARIF (Backend Container)
├── Trivy SARIF (Frontend Container)
├── Trivy SARIF (Root Container)
└── Bandit Security Report (Python)
```

---

*Workflow architecture diagram for CI/CD enhancements*
*Total: 6 new workflows + 3 new jobs in main CI*
