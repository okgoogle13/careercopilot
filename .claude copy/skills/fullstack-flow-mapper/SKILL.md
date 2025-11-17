---
name: fullstack-flow-mapper
description: "Maps complete data flows from UI components through API services, backend endpoints, Genkit flows, to database operations. Generates visual architecture diagrams."
---
# Fullstack Flow Mapper Workflow

This skill traces complete application data flows and generates comprehensive architecture documentation with visual diagrams.

## Workflow Steps

1. **Scan all application layers:**
   - **Frontend Components** (`frontend/src/components/**`, `frontend/src/pages/**`)
     - Identify components that make API calls
     - Extract state management patterns
     - Track data transformations
   - **API Services** (`frontend/src/api/*.ts`)
     - Map service functions to components
     - Extract HTTP methods and endpoints
     - Track request/response interfaces
   - **Backend Endpoints** (`backend/app/api/endpoints/*.py`)
     - Map routes to service functions
     - Track authentication/authorization
     - Identify Genkit flow invocations
   - **Genkit Flows** (`backend/app/genkit_flows/*.py`)
     - Map flow inputs/outputs
     - Track LLM API calls
     - Identify caching patterns
   - **Database Operations** (Firestore collections)
     - Track database reads/writes
     - Map collection structures
     - Identify cache operations

2. **Build dependency graph:**
   - Create node for each layer (Component → Service → Endpoint → Flow → Database)
   - Create edges representing data flow
   - Annotate edges with data types
   - Mark authentication requirements
   - Highlight caching layers

3. **Trace complete flows:**
   - For each major feature, trace full path:
     - User interaction in component
     - API service call
     - Backend endpoint processing
     - Genkit flow execution
     - LLM API calls (with caching)
     - Database operations
     - Response transformation
     - UI update

4. **Generate flow documentation:**
   - Create `docs/FULLSTACK_FLOWS.md` with:
     - Complete flow catalog
     - Per-feature flow diagrams
     - Data transformation documentation
     - Performance characteristics
     - Caching strategy per flow
     - Error handling patterns

5. **Generate Mermaid diagrams:**
   - **Architecture Overview**: High-level system diagram
   - **Feature Flows**: Detailed per-feature flowcharts
   - **Data Flow**: Data transformation pipeline
   - **Caching Strategy**: Cache hit/miss flows

6. **Identify optimization opportunities:**
   - Unused components/endpoints
   - Missing caching opportunities
   - Redundant API calls
   - Inefficient data flows
   - Missing error handling

7. **Generate recommendations:**
   - Performance improvements
   - Caching strategies
   - Code cleanup opportunities
   - Integration gaps to fill

## Flow Documentation Structure

```markdown
# CareerCopilot Fullstack Data Flows

Generated: 2025-01-06T12:00:00Z

## Architecture Overview

\```mermaid
graph TD
    subgraph Frontend
        A[React Components] --> B[API Services]
    end

    subgraph Backend
        C[FastAPI Endpoints] --> D[Genkit Flows]
        D --> E[LLM Service]
        D --> F[Firestore]
    end

    B -->|HTTP/JSON| C
    E -->|Cache Check| G[Firestore Cache]
    G -.->|Cache Hit| E
    E -->|Cache Miss| H[Gemini API]
    H --> E

    style G fill:#90EE90
    style H fill:#FFB6C1
\```

## Feature Flow Catalog

### 1. KSC Generation Flow

**Description:** Generate Key Selection Criteria responses from job description

**Flow Diagram:**

\```mermaid
sequenceDiagram
    participant User
    participant KscGeneratorPage
    participant aiServices
    participant Backend
    participant GenkitFlow
    participant Cache
    participant Gemini

    User->>KscGeneratorPage: Paste job description
    KscGeneratorPage->>aiServices: generateKscResponses(jobDesc)
    aiServices->>Backend: POST /api/v1/ksc/generate
    Backend->>GenkitFlow: run_flow_async(generateKscResponse)
    GenkitFlow->>Cache: check_cache(prompt_hash)

    alt Cache Hit
        Cache-->>GenkitFlow: Return cached response
    else Cache Miss
        GenkitFlow->>Gemini: generate(prompt)
        Gemini-->>GenkitFlow: AI response
        GenkitFlow->>Cache: store(prompt_hash, response)
    end

    GenkitFlow-->>Backend: KscResult
    Backend-->>aiServices: JSON response
    aiServices-->>KscGeneratorPage: Display results
    KscGeneratorPage-->>User: Show KSC responses
\```

**Performance:**
- Cache Hit: ~50ms
- Cache Miss: ~2-5s (LLM call)
- Cache TTL: 1 hour

**Data Transformations:**
1. Frontend: `jobDescription: string` → `JobDescriptionRequest`
2. Backend: `JobDescriptionRequest` → Genkit flow input
3. Genkit: Structured prompt → LLM call
4. LLM: Natural language → JSON response
5. Backend: Genkit output → `KscResponseListResponse`
6. Frontend: JSON → React state → UI rendering

**Error Handling:**
- Validation: Frontend + Backend Pydantic validation
- Auth: Firebase Auth middleware
- LLM Errors: Retry with exponential backoff
- Network: Axios retry interceptor

### 2. ATS Resume Scoring Flow

[Similar detailed documentation for each major feature...]

## Database Collections

| Collection | Purpose | Operations | Indexed Fields |
|------------|---------|------------|----------------|
| `redis_cache` | LLM response caching | Read/Write | `key`, `expires_at` |
| `user_profiles` | User data | CRUD | `user_id`, `email` |
| `job_applications` | Application tracking | CRUD | `user_id`, `job_id`, `status` |
| `documents` | Resume/cover letter storage | CRUD | `user_id`, `type`, `created_at` |

## Caching Strategy

### LLM Response Cache (Firestore)

**Cache Key Format:** `llm:{model}:{hash(prompt)}`
**TTL:** 1 hour (3600 seconds)
**Hit Rate Target:** 60-70%

**Cached Flows:**
- ✅ KSC Generation
- ✅ Cover Letter Generation
- ✅ Resume Optimization
- ✅ ATS Scoring
- ❌ Real-time job search (no caching)

## Performance Metrics

| Flow | Avg Response Time | Cache Hit Rate | Cost per Request |
|------|-------------------|----------------|------------------|
| KSC Generation | 350ms | 65% | $0.003 |
| Cover Letter | 450ms | 55% | $0.005 |
| ATS Scoring | 280ms | 70% | $0.002 |
| Resume Optimization | 520ms | 60% | $0.006 |

## Optimization Recommendations

### High Priority
1. **Add caching to job matching flow** - Could reduce costs by 40%
2. **Implement request deduplication** - Prevent duplicate LLM calls
3. **Add database indexes** - Speed up user_id lookups

### Medium Priority
4. **Batch similar requests** - Reduce LLM API calls
5. **Implement response streaming** - Improve perceived performance
6. **Add service worker caching** - Cache static assets

### Low Priority
7. **Migrate to Redis for caching** - Better performance than Firestore
8. **Implement GraphQL** - Reduce over-fetching
```

## Visual Diagram Types

1. **System Architecture**: Overall component relationships
2. **Sequence Diagrams**: Request/response flows with timing
3. **Data Flow**: Data transformation pipeline
4. **Caching Flow**: Cache hit/miss decision trees
5. **Error Handling**: Error propagation and recovery

## Usage Tips

- Run mapper after major feature additions
- Use for onboarding new developers
- Reference for performance optimization
- Update after architecture changes
- Share with stakeholders for system understanding
