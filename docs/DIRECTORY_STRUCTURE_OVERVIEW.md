# Repository Directory Structure Overview

**Purpose:** High-level overview of the CareerCopilot repository structure showing only directories (excluding files and non-essential directories).

**Generated:** 2025-11-29  
**Method:** `tree -d -I '.git|node_modules|dist|build|venv|.ai_reports|coverage'`  
**Total Directories:** 548

---

## Directory Structure

```
.
├── .agent
│   └── workflows
├── .ai_batches
├── .ai_reports
├── .archive
│   └── old-audits-2025-11-17
├── .claude
│   ├── agents
│   ├── commands
│   ├── docs
│   ├── mcp-servers
│   └── skills
├── .github
│   ├── actions
│   ├── baselines
│   └── workflows
├── .husky
│   └── _
├── .idx
├── .storybook
├── .venv
├── .windsurf
│   └── workflows
├── .yarn
├── Career Copilot (Community)
│   └── src
├── backend
│   ├── app
│   │   ├── agents
│   │   ├── ai
│   │   ├── ai_operations
│   │   ├── api
│   │   │   └── endpoints
│   │   ├── config
│   │   ├── core
│   │   ├── docs
│   │   ├── genkit_flows
│   │   ├── models
│   │   ├── services
│   │   └── tests
│   ├── config
│   ├── docs
│   ├── migrations
│   │   └── versions
│   └── tests
├── backups
│   ├── component-consolidation-20251118-173245
│   ├── component-consolidation-20251118-190046
│   ├── component-standardization-20251118-173325
│   └── component-standardization-20251118-190116
├── data
│   └── cache
│       └── ai_operations
├── design-system
├── docs
│   ├── _archive
│   │   └── legacy-summaries
│   ├── deployment
│   ├── development
│   ├── architecture
│   ├── design
│   └── setup
├── frontend
│   ├── .ai_reports
│   ├── .husky
│   ├── .storybook
│   ├── __mocks__
│   ├── src
│   │   ├── components
│   │   │   ├── electric
│   │   │   │   ├── alert
│   │   │   │   ├── avatar
│   │   │   │   ├── badge
│   │   │   │   ├── button
│   │   │   │   ├── card
│   │   │   │   ├── checkbox
│   │   │   │   ├── dialog
│   │   │   │   ├── divider
│   │   │   │   ├── drawer
│   │   │   │   ├── empty-state
│   │   │   │   ├── grid
│   │   │   │   ├── input
│   │   │   │   ├── pagination
│   │   │   │   ├── popover
│   │   │   │   ├── progress
│   │   │   │   ├── radio-group
│   │   │   │   ├── search-input
│   │   │   │   ├── select
│   │   │   │   ├── skeleton
│   │   │   │   ├── slider
│   │   │   │   ├── switch
│   │   │   │   ├── table
│   │   │   │   ├── tabs
│   │   │   │   ├── textarea
│   │   │   │   └── tooltip
│   │   │   ├── features
│   │   │   │   ├── ATSAnalysisDashboard
│   │   │   │   ├── Analysis
│   │   │   │   ├── CareerGrowthHub
│   │   │   │   ├── CareerIntelligence
│   │   │   │   ├── FeatureCard
│   │   │   │   ├── FilterPanel
│   │   │   │   ├── JobCard
│   │   │   │   ├── JobInput
│   │   │   │   ├── JobMatching
│   │   │   │   ├── KSC
│   │   │   │   ├── auth
│   │   │   │   ├── dashboard
│   │   │   │   ├── opportunities
│   │   │   │   ├── profile
│   │   │   │   └── profiles
│   │   │   ├── figma
│   │   │   ├── ingestion
│   │   │   ├── jobs
│   │   │   ├── layout
│   │   │   ├── library
│   │   │   ├── main
│   │   │   ├── sidebar
│   │   │   └── ui
│   │   │       ├── Button
│   │   │       ├── Dialog
│   │   │       ├── EmptyState
│   │   │       ├── FullPageLoading
│   │   │       ├── LoadingSkeleton
│   │   │       ├── LoadingSpinner
│   │   │       ├── Skeleton
│   │   │       ├── Toast
│   │   │       ├── ToastContext
│   │   │       ├── animations
│   │   │       ├── feedback
│   │   │       └── loading
│   │   ├── config
│   │   ├── context
│   │   ├── features
│   │   ├── hooks
│   │   ├── lib
│   │   ├── pages
│   │   ├── stories
│   │   ├── styles
│   │   ├── theme
│   │   ├── types
│   │   └── utils
│   ├── test-results
│   └── tests
├── functions
│   ├── __tests__
│   ├── lib
│   ├── src
│   │   ├── api
│   │   ├── config
│   │   ├── middleware
│   │   ├── services
│   │   ├── types
│   │   └── utils
│   └── test
├── logs
├── monitoring
│   └── grafana
│       ├── dashboards
│       └── datasources
├── nginx
├── scripts
│   └── _archived
├── servers
│   ├── mcp-claude-orchestrator
│   ├── mcp-gemini-wrapper
│   ├── mcp-resilience-router
│   └── perplexity
│       └── src
├── src
│   ├── stories
│   └── styles
├── stories
│   └── assets
├── test-results
├── tests
└── verified_backups
    └── cleanup_backup_2025-09-27_22-11-18
```

---

## Key Directory Analysis

### **Core Application Structure**
- **`backend/`** - Python FastAPI application with Genkit AI flows
- **`frontend/`** - React TypeScript application with Material-UI components
- **`functions/`** - Firebase Cloud Functions
- **`docs/`** - Centralized documentation (newly organized)

### **Development & Infrastructure**
- **`scripts/`** - Automation and deployment scripts
- **`.claude/`** - AI agent and skill definitions
- **`.github/`** - CI/CD workflows and actions
- **`monitoring/`** - Grafana dashboards and datasources

### **Component Architecture**
- **`frontend/src/components/electric/`** - Electric Alchemist design system components (20+ components)
- **`frontend/src/components/features/`** - Feature-specific components (10+ features)
- **`frontend/src/components/ui/`** - Reusable UI primitives

### **Testing & Quality**
- **`frontend/tests/`** - Frontend test suites
- **`backend/app/tests/`** - Backend test suites
- **`tests/`** - Project-wide test configurations

### **Data & Storage**
- **`data/cache/`** - AI operations cache
- **`backups/`** - Component consolidation backups
- **`verified_backups/`** - Safety backup snapshots

---

## Excluded Directories

The following directories were excluded from this view for clarity:
- `.git/` - Git version control
- `node_modules/` - Node.js dependencies
- `dist/` - Build outputs
- `build/` - Build artifacts
- `venv/` - Python virtual environment
- `.ai_reports/` - AI-generated reports (archived separately)
- `coverage/` - Test coverage reports

---

## Usage Notes

- **Total directories:** 548 (excluding ignored directories)
- **Primary focus areas:** backend/, frontend/, docs/, scripts/
- **Component organization:** Clear separation between electric (design system), features, and ui components
- **Documentation:** Now centralized in docs/ with proper subdirectory structure
- **AI infrastructure:** Comprehensive .claude/ directory with agents, skills, and MCP servers

This overview provides a high-level map of the repository structure for navigation, cleanup planning, and architectural understanding.
