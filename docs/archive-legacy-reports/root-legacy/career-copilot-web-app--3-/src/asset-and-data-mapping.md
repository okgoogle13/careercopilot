# 📦 Asset & Data Mapping Guide

This document maps all proprietary `figma:asset` imports to standard relative paths and documents all TypeScript interfaces for mock data.

---

## 🖼️ ASSET IMPORT MAPPINGS

All asset imports have been converted from `figma:asset/...` to standard relative paths.

### File Location Structure

```
/assets/
  └── images/
      ├── texture-pattern.png         (Background texture)
      ├── plant-banner.png            (Dashboard hero banner)
      ├── pilea-plant.png             (Analysis page decoration)
      ├── hanging-plant.png           (Application Tracker decoration)
      └── snake-plant.png             (Documents page decoration)
```

### Import Mapping Table

| Original Figma Import                                      | New Relative Path                      | Used In                  | Description              |
| ---------------------------------------------------------- | -------------------------------------- | ------------------------ | ------------------------ |
| `figma:asset/5dd1245f16ac811d07e4da189bb280a15ab11e33.png` | `../assets/images/texture-pattern.png` | `App.tsx`, `Layout.tsx`  | Noise texture background |
| `figma:asset/9ead2d553f2080ba9012797fe1b9bb7e1eba41e3.png` | `../assets/images/plant-banner.png`    | `Dashboard.tsx`          | Hero banner plant image  |
| `figma:asset/e947c2d20d6dda7622b4cd544ba71131af1a4d77.png` | `../assets/images/pilea-plant.png`     | `Analysis.tsx`           | Bottom left decoration   |
| `figma:asset/44569b5b09c469ebca1c4c6a3f4bcc3cfa3df233.png` | `../assets/images/hanging-plant.png`   | `ApplicationTracker.tsx` | Top right decoration     |
| `figma:asset/41188de77d610c3b921deb50cf0552f855047a4a.png` | `../assets/images/snake-plant.png`     | `Documents.tsx`          | Bottom right decoration  |

### Import Syntax Examples

**Before:**

```tsx
import texturePattern from "figma:asset/5dd1245f16ac811d07e4da189bb280a15ab11e33.png";
```

**After:**

```tsx
import texturePattern from "../assets/images/texture-pattern.png";
```

---

## 📊 DATA TYPE DEFINITIONS

All mock data has been extracted from component bodies and typed with TypeScript interfaces.

### Analysis.tsx

#### ATSScoreDataPoint

```typescript
interface ATSScoreDataPoint {
  month: string; // e.g., "Jan", "Feb", "Mar"
  score: number; // ATS score value (0-100)
}
```

**Mock Data:**

```typescript
const ATS_SCORE_DATA: ATSScoreDataPoint[] = [
  { month: "Jan", score: 82 },
  { month: "Feb", score: 83 },
  { month: "Mar", score: 84 },
  { month: "Apr", score: 85 },
  { month: "May", score: 86 },
  { month: "Jun", score: 87 },
];
```

**API Replacement:**

```typescript
// TODO: Replace with API call
const fetchATSScoreData = async (): Promise<ATSScoreDataPoint[]> => {
  const response = await fetch("/api/analytics/ats-score");
  return response.json();
};
```

---

#### ApplicationStatusData

```typescript
interface ApplicationStatusData {
  name: string; // Status name (e.g., "Applied", "Interviewing")
  value: number; // Count of applications in this status
  color: string; // Hex color for chart segment
}
```

**Mock Data:**

```typescript
const APPLICATION_STATUS_DATA: ApplicationStatusData[] = [
  { name: "Applied", value: 40, color: "#D0BCFF" },
  { name: "Interviewing", value: 30, color: "#A8C5A3" },
  { name: "Rejected", value: 20, color: "#E07A5F" },
  { name: "Offered", value: 10, color: "#F4D06F" },
];
```

**API Replacement:**

```typescript
// TODO: Replace with API call
const fetchApplicationStatus = async (): Promise<ApplicationStatusData[]> => {
  const response = await fetch("/api/analytics/status-breakdown");
  return response.json();
};
```

---

#### KeywordMatchData

```typescript
interface KeywordMatchData {
  keyword: string; // Technology/skill name
  rate: number; // Match frequency count
}
```

**Mock Data:**

```typescript
const KEYWORD_MATCH_DATA: KeywordMatchData[] = [
  { keyword: "React.js", rate: 5 },
  { keyword: "TypeScript", rate: 2 },
  { keyword: "JavaScript", rate: 4 },
  { keyword: "Node.js", rate: 3 },
  { keyword: "Python", rate: 2 },
];
```

**API Replacement:**

```typescript
// TODO: Replace with API call
const fetchKeywordMatches = async (): Promise<KeywordMatchData[]> => {
  const response = await fetch("/api/analytics/keyword-matches");
  return response.json();
};
```

---

#### Keyword Arrays

```typescript
const MATCHED_KEYWORDS: string[] = [
  "Community Support",
  "Case Management",
  "Communication",
  // ... more keywords
];

const MISSING_KEYWORDS: string[] = [
  "React.js",
  "Typescript",
  "Learning Programs",
  // ... more keywords
];
```

**API Replacement:**

```typescript
// TODO: Replace with API call
const fetchKeywordAnalysis = async (): Promise<{
  matched: string[];
  missing: string[];
}> => {
  const response = await fetch("/api/analytics/keywords");
  return response.json();
};
```

---

### ApplicationTracker.tsx

#### Application

```typescript
export interface Application {
  id: number; // Unique application ID
  title: string; // Job title
  company: string; // Company name
  location: string; // Job location (e.g., "San Francisco, CA", "Remote")
  appliedDate: string; // Human-readable date (e.g., "2 days ago")
  currentStep: number; // Current step index (0-based)
  steps: string[]; // Array of workflow step labels
}
```

**Mock Data:**

```typescript
const APPLICATIONS: Application[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    appliedDate: "2 days ago",
    currentStep: 3,
    steps: ["Applied", "Screening", "Interview", "Offer", "Accepted"],
  },
  // ... more applications
];
```

**API Replacement:**

```typescript
// TODO: Replace with API call
const fetchApplications = async (): Promise<Application[]> => {
  const response = await fetch("/api/applications");
  return response.json();
};

const updateApplicationStatus = async (applicationId: number, newStep: number): Promise<void> => {
  await fetch(`/api/applications/${applicationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentStep: newStep }),
  });
};
```

---

### Documents.tsx

#### DocumentType

```typescript
export type DocumentType = "resume" | "cover" | "ksc";
```

#### Document

```typescript
export interface Document {
  id: number; // Unique document ID
  name: string; // Document name/title
  type: DocumentType; // Document category
  date: string; // Last updated (human-readable)
  icon: string; // Emoji icon for display
}
```

**Mock Data:**

```typescript
const DOCUMENTS: Document[] = [
  {
    id: 1,
    name: "Software Engineer Resume",
    type: "resume",
    date: "Updated 2 days ago",
    icon: "📄",
  },
  {
    id: 2,
    name: "Cover Letter - TechCorp",
    type: "cover",
    date: "Updated 3 days ago",
    icon: "📝",
  },
  // ... more documents
];
```

**API Replacement:**

```typescript
// TODO: Replace with API call
const fetchDocuments = async (): Promise<Document[]> => {
  const response = await fetch("/api/documents");
  return response.json();
};

const createDocument = async (name: string, type: DocumentType): Promise<Document> => {
  const response = await fetch("/api/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, type }),
  });
  return response.json();
};
```

---

#### DocumentTab

```typescript
export type DocumentTab = "all" | "resumes" | "covers" | "ksc";
```

**Filter Function:**

```typescript
function filterDocuments(documents: Document[], tab: DocumentTab): Document[] {
  if (tab === "all") return documents;

  const typeMap: Record<Exclude<DocumentTab, "all">, DocumentType> = {
    resumes: "resume",
    covers: "cover",
    ksc: "ksc",
  };

  return documents.filter((doc) => doc.type === typeMap[tab as keyof typeof typeMap]);
}
```

---

### Dashboard.tsx

#### Profile

```typescript
interface Profile {
  name: string; // Profile/job title
  company: string; // Target company
  score: number; // ATS score (0-100)
  status: string; // Status label (e.g., "Excellent", "Good", "Fair")
}
```

**Mock Data:**

```typescript
const PROFILES: Profile[] = [
  { name: "Senior Software Engineer", company: "TechCorp", score: 92, status: "Excellent" },
  { name: "UX Designer", company: "DesignHub", score: 85, status: "Good" },
  { name: "Product Manager", company: "StartupXYZ", score: 78, status: "Fair" },
];
```

**API Replacement:**

```typescript
// TODO: Replace with API call
const fetchProfiles = async (): Promise<Profile[]> => {
  const response = await fetch("/api/profiles");
  return response.json();
};
```

---

## 🔄 API INTEGRATION CHECKLIST

When replacing mock data with real API calls:

### 1. Analysis Page

- [ ] Replace `ATS_SCORE_DATA` with `fetchATSScoreData()`
- [ ] Replace `APPLICATION_STATUS_DATA` with `fetchApplicationStatus()`
- [ ] Replace `KEYWORD_MATCH_DATA` with `fetchKeywordMatches()`
- [ ] Replace `MATCHED_KEYWORDS` and `MISSING_KEYWORDS` with `fetchKeywordAnalysis()`

### 2. Application Tracker Page

- [ ] Replace `APPLICATIONS` with `fetchApplications()`
- [ ] Implement `handleUpdateStatus()` with `updateApplicationStatus()`
- [ ] Add loading states during API calls
- [ ] Add error handling for failed requests

### 3. Documents Page

- [ ] Replace `DOCUMENTS` with `fetchDocuments()`
- [ ] Implement document creation with `createDocument()`
- [ ] Add search functionality with API endpoint
- [ ] Add loading/error states

### 4. Dashboard Page

- [ ] Replace `PROFILES` with `fetchProfiles()`
- [ ] Fetch user name dynamically
- [ ] Fetch upcoming interviews count
- [ ] Add loading states

---

## 🎯 CODE MIGRATION PATTERN

### React Query Example (Recommended)

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// In Analysis.tsx
export function Analysis() {
  const { data: atsScoreData, isLoading, error } = useQuery({
    queryKey: ['atsScore'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/ats-score');
      return response.json() as Promise<ATSScoreDataPoint[]>;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    // Use atsScoreData instead of ATS_SCORE_DATA
    <ChartPane title="ATS Score Over Time">
      <LineChart data={atsScoreData}>
        {/* ... */}
      </LineChart>
    </ChartPane>
  );
}
```

### useState + useEffect Example

```typescript
import { useState, useEffect } from 'react';

export function ApplicationTracker() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/applications');
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    // Use applications state instead of APPLICATIONS constant
    <div>
      {applications.map(app => (
        <ApplicationCard key={app.id} {...app} />
      ))}
    </div>
  );
}
```

---

## 📝 FILE LOCATION SUMMARY

### Updated Files (Asset Imports Fixed)

- ✅ `/App.tsx` - Fixed texture pattern import
- ✅ `/components/Layout.tsx` - Fixed texture pattern import
- ✅ `/components/Dashboard.tsx` - Fixed plant banner import
- ✅ `/components/Analysis.tsx` - Fixed pilea plant import
- ✅ `/components/ApplicationTracker.tsx` - Fixed hanging plant import
- ✅ `/components/Documents.tsx` - Fixed snake plant import

### Data Extraction Complete

- ✅ `/components/Analysis.tsx` - All chart data extracted with types
- ✅ `/components/ApplicationTracker.tsx` - Application interface exported
- ✅ `/components/Documents.tsx` - Document types exported
- ✅ `/components/Dashboard.tsx` - Profile interface defined

---

## 🔧 Asset Placement Instructions

**Manual Steps Required:**

1. **Create Assets Directory:**

   ```bash
   mkdir -p assets/images
   ```

2. **Copy/Download Assets:**
   - Place texture pattern image as `assets/images/texture-pattern.png`
   - Place plant banner as `assets/images/plant-banner.png`
   - Place pilea plant as `assets/images/pilea-plant.png`
   - Place hanging plant as `assets/images/hanging-plant.png`
   - Place snake plant as `assets/images/snake-plant.png`

3. **Verify Imports:**
   - All import statements use relative paths
   - Assets are accessible from their component locations
   - No `figma:asset` imports remain

---

## ✅ Validation Checklist

### Asset Imports

- [ ] All `figma:asset/...` imports replaced with `../assets/images/...`
- [ ] Asset files placed in correct directory structure
- [ ] All images load correctly in development
- [ ] No 404 errors for missing assets

### Data Types

- [ ] All data arrays moved outside component functions
- [ ] TypeScript interfaces defined for all data structures
- [ ] Interfaces exported where needed (Application, Document)
- [ ] Mock data clearly marked with `// TODO: Replace with API calls`

### Code Quality

- [ ] No TypeScript errors
- [ ] All components render correctly with mock data
- [ ] Data structure supports easy API integration
- [ ] Clear separation of concerns (data vs. presentation)

---

**Last Updated:** December 2025
**Version:** 1.0.0 - Production Ready
