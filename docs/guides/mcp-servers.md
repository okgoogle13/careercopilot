# MCP Servers Documentation

## Active MCP Servers

### 1. GitHub

- **Purpose**: Repository management, issue tracking, PR operations
- **Package**: `@modelcontextprotocol/server-github`
- **Status**: Essential
- **Environment**: `GITHUB_TOKEN` (from Keychain)
- **Safe Auto-approve**: `list-repositories`, `read-repository`
- **Update Frequency**: Auto (stable)

### 2. Flash-Sidekick (AI Engine)

- **Purpose**: Primary AI engine for analysis and generation
- **Type**: Custom Python server
- **Path**: `servers/flash_sidekick.py`
- **Status**: Essential
- **Environment**: `GEMINI_API_KEY`, `GEMINI_MODEL`
- **Key Features**:
  - Code analysis
  - Test generation
  - Documentation generation

### 3. Playwright

- **Purpose**: Browser automation for E2E testing
- **Package**: `@playwright/mcp`
- **Status**: Active
- **Use Cases**:
  - UI Testing
  - Dynamic content scraping

### 4. Docker

- **Purpose**: Container management for services
- **Package**: `mcp-server-docker`
- **Status**: Active
- **Configuration**:
  - `ALLOWED_CONTAINERS`: `careercopilot-backend`, `careercopilot-frontend`

### 5. Cloud Ops

- **Purpose**: Cost-Optimized Cloud Deployment
- **Type**: Custom Python server
- **Path**: `servers/cloud_ops.py`
- **Status**: Active
- **Features**:
  - Budget monitoring
  - GCP deployment

### 6. Perplexity Ask

- **Purpose**: Real-time search and documentation retrieval
- **Package**: `server-perplexity-ask`
- **Status**: Active
- **Environment**: `PERPLEXITY_API_KEY`

### 7. Supabase

- **Purpose**: Database management
- **Package**: `@supabase/mcp-server-supabase`
- **Status**: Active
- **Environment**: `SUPABASE_ACCESS_TOKEN`

### 8. Genkit

- **Purpose**: Genkit flow execution
- **Package**: `genkit-cli`
- **Status**: Active
