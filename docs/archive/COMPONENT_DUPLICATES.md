# Component Duplicates Analysis

Found 9 duplicate component pairs in the codebase:

## 1. ATSScoreCircle.tsx

- `/frontend/src/components/library/ATSScoreCircle.tsx`
- `/frontend/src/components/features/Analysis/ATSScoreCircle.tsx`

## 2. ActionCard.tsx

- `/frontend/src/components/main/ActionCard.tsx`
- `/frontend/src/components/common/ActionCard.tsx`

## 3. CreateProfileCard.tsx

- `/frontend/src/components/profiles/CreateProfileCard.tsx`
- `/frontend/src/components/profile/CreateProfileCard.tsx`

## 4. EmptyState.tsx

- `/frontend/src/components/ui/feedback/EmptyState.tsx` (CANONICAL)
- `/frontend/src/components/ui/EmptyState.tsx` (DELETE)

## 5. ErrorBoundary.tsx

- `/frontend/src/components/ErrorBoundary.tsx` (ROOT LEVEL - likely canonical)
- `/frontend/src/components/ui/feedback/ErrorBoundary.tsx`

## 6. InterviewPrep.tsx

- `/frontend/src/components/career/InterviewPrep.tsx`
- `/frontend/src/components/features/opportunities/InterviewPrep.tsx`

## 7. JobCard.tsx

- `/frontend/src/components/features/opportunities/JobCard.tsx`
- `/frontend/src/components/jobs/JobCard.tsx`

## 8. ProfileCard.tsx

- `/frontend/src/components/profiles/ProfileCard.tsx`
- `/frontend/src/components/profile/ProfileCard.tsx`

## 9. TimelineView.tsx

- `/frontend/src/components/career/TimelineView.tsx` (REAL COMPONENT)
- `/frontend/src/components/career/__mocks__/TimelineView.tsx` (MOCK - OK to keep)
