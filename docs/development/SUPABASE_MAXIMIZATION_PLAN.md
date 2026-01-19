# Supabase Maximization (roadmap)

**Source Strategy:** [Supabase Value Strategy](../architecture/SUPABASE_VALUE_STRATEGY.md)
**Status:** DRAFT
**Owner:** Antigravity

This plan outlines the specific technical tasks required to transition CareerCopilot to a "Supabase Native" architecture.

---

## Phase 1: Knowledge Consolidation (Vectors)
**Goal:** Remove local ChromaDB and centralize embeddings in Postgres.

- [ ] **Infrastructure**: Enable `pgvector` extension on Supabase.
    - *Action:* `CREATE EXTENSION vector;`
- [ ] **Schema Migration**: Create `document_embeddings` table.
    - *Columns:* `id`, `user_id` (FK), `content`, `embedding` (vector(768)), `metadata` (JSONB).
- [ ] **Backend Refactor**:
    - [ ] Create `SupabaseVectorStore` class implementing `VectorStore` interface.
    - [ ] Implement `add_documents` using `pgvector` operators.
    - [ ] Implement `similarity_search` using `<=>` (cosine distance).
- [ ] **Data Migration**: Re-ingest current artifacts into Supabase.
- [ ] **Cleanup**: Remove `chromadb` dependency and local Docker volume.

## Phase 2: Identity Sovereignty (Auth)
**Goal:** Switch from custom Auth Middleware to Supabase Native Auth.

- [ ] **Frontend**: Install `@supabase/auth-helpers-react`.
    - [ ] Replace `Login` form with Supabase Auth UI (or custom UI hooked to Supabase SDK).
    - [ ] Update `App.tsx` context to use `SessionProvider`.
- [ ] **Backend**:
    - [ ] Delete `app/core/auth.py` (Custom JWT logic).
    - [ ] Implement `Depends(get_current_user)` using Supabase JWT verification.
    - [ ] Update User model to sync with `auth.users` (using Triggers).
- [ ] **Database Policies**:
    - [ ] Enable RLS on all tables.
    - [ ] Write Policy: `Users can only SELECT/INSERT/UPDATE their own rows`.

## Phase 3: Content Vault (Storage)
**Goal:** Secure resume storage with auto-previews.

- [ ] **Infrastructure**: Create `resumes` bucket in Supabase Storage.
- [ ] **Security**: Add RLS Policy to bucket (Owner Access Only).
- [ ] **Backend**: Replace local file save with `supabase.storage.from('resumes').upload()`.
- [ ] **Frontend**: Update Resume Viewer to consume signed URLs from Supabase.

## Phase 4: Automation & Agents (Edge & MCP)
**Goal:** Event-driven architecture and Agent observability.

- [ ] **Gap Hunter (Edge)**:
    - [ ] Create Edge Function `analyze-gap`.
    - [ ] Create Database Webhook on `INSERT public.resumes` -> triggers function.
- [ ] **Agent Command Center (MCP)**:
    - [ ] Scaffold `packages/mcp-database-manager`.
    - [ ] Implement tool `list_recent_logs`.
    - [ ] Implement tool `get_user_context`.
    - [ ] Register with Claude Desktop.

## Phase 5: Design Ops (Lovable & Figma)
**Goal:** Accelerate internal tool creation.

- [ ] **Admin Dashboard**:
    - [ ] Connect Lovable to Supabase Project.
    - [ ] Generate "Super Admin" view (User Management, System Logs).
- [ ] **Figma Usage**:
    - [ ] Create generic Edge Function `get-mock-data` returning JSON.
    - [ ] Connect Figma "Data Sync" plugin to this endpoint.

---

## Execution Order
recommended to proceed in order: **1 (Vectors) -> 2 (Auth)**.
These deliver the highest technical debt reduction.
Phase 3, 4, 5 can be parallelized.
