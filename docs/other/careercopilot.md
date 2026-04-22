# CareerCopilot

AI-powered job application assistant. Solo project by Jonas Dougall.

## Stage
Figma-to-code + frontend source-of-truth convergence. Blocked on Figma sync contract repair and shared shell anchors before broad code extraction begins.

## Stack
- Frontend: React 18 + TS + Vite + Tailwind v4 + Zustand + TanStack Query
- Backend: FastAPI + SQLAlchemy + Genkit + Python 3.10+
- Cloud: GCP us-central1, Firebase, Cloud Run
- Design: KR Solidarity v6.1 (M3 Expressive), dark-only

## Route Families & Readiness

### Ready after sync-doc repair
`/` · `/auth` · `/onboarding` · `/dashboard` · `/apply` · `/generation` · `/settings`

### Not ready yet
`/profile` (in progress) · `/opportunities` · `/applications` · `/analysis` · `/documents`

## Current Blockers
1. Figma sync contract broken — `MISSING` status on existing route frames
2. Shared shell anchors not yet documented — blocks all normalization work
