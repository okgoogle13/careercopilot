# Architecture Comparison: Firebase Auth vs. Supabase Auth

## 1. The Core Philosophy
*   **Firebase Auth**: Acts as a "Gatekeeper" service separate from your database. It handles the ID, but your backend API (FastAPI) must manually enforce permission logic.
*   **Supabase Auth**: Acts as a "Database Kernel" module. It injects the User ID directly into the database connection, allowing the database itself to enforce permissions via Policies (RLS).

## 2. Feature Showdown

| Feature | Firebase Auth | Supabase Auth | Winner |
| :--- | :--- | :--- | :--- |
| **Session Management** | Opaque Tokens (Google Black Box) | Standard JWTs | **Draw** |
| **User Data** | Stored in Google's cloud (can't query with SQL) | Stored in `auth.users` table (Queryable via SQL) | **Supabase** |
| **Permission Logic** | Written in API Middleware or Security Rules | Written in SQL (RLS Policies) | **Supabase** |
| **Offline Support** | Excellent (mature SDKs) | Good (improving SDKs) | **Firebase** |
| **Social Logins** | Extensive list, highly polished | Supports standard OAuth (Google, GitHub, Apple) | **Firebase** |
| **Pricing** | Generous Free Tier (50k MAU) | Generous Free Tier (50k MAU) | **Draw** |
| **Migration** | Impossible to export password hashes (Locked in) | Standard generic password hashes (Portable) | **Supabase** |

## 3. The "Killer Feature": Row Level Security (RLS)

This is the decisive factor for CareerCopilot.

### With Firebase (State Quo)
1.  User requests `GET /resumes`.
2.  FastAPI receives token -> Decodes it.
3.  FastAPI logic: `if user_id != resume.owner_id: raise 403`.
4.  *Risk:* If you forget this check in **any** endpoint, you leak data.

### With Supabase (The Upgrade)
1.  User requests `GET /resumes`.
2.  Supabase (Postgres) receives query.
3.  Policy `users_view_own_resumes` runs automatically.
4.  *Result:* The database *literally returns zero rows* for other people's data. Even if your API code is sloppy, the data is secure.

## 4. Migration Impact
*   **Pros:**
    *   One fewer dependency (Google Cloud).
    *   Unified data governance (Users live next to their Resumes).
    *   Zero-latency auth checks (no HTTP roundtrip to verify token).
*   **Cons:**
    *   **Migration Effort:** You currently perform authentication in `auth.py`. Migrating requires:
        1.  Replacing `auth.py` with Supabase Client.
        2.  Migrating existing user accounts (if any) to Supabase.
        3.  Refactoring Frontend to use `@supabase/auth-helpers-react`.

## 5. Recommendation
**Switch to Supabase Auth.**
Since you are already moving the Database and Vector Store to Supabase, unifying Authentication completes the "Zero-API" vision where the frontend talks securely to the database, minimizing backend boilerplate.
