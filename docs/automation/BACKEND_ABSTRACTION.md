# Backend Abstraction Layer

Decouples frontend from specific implementations of document storage and issue tracking.

## Overview

Two core interfaces enable swappable backend implementations:

1. **DocumentStore** — persistent document/note management
2. **IssueTracker** — issue/task lifecycle management

This design allows:
- Multiple implementations (Notion, Linear, PostgreSQL, custom)
- Testing with mocks
- Graceful migration from cloud (Notion) to self-hosted (PostgreSQL)
- Clean separation of concerns

## DocumentStore Interface

Manages persistent documents: tasks, decisions, specs, guides, notes.

```typescript
interface DocumentStore {
  getDocument(id: string): Promise<Document | null>;
  listDocuments(filters: DocumentFilter): Promise<Document[]>;
  createDocument(doc: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document>;
  archiveDocument(id: string): Promise<void>;
  summarize(documentId: string, context?: string): Promise<string>;
}
```

### Document Model

```typescript
interface Document {
  id: string;
  title: string;
  content: string;
  category: 'task' | 'decision' | 'spec' | 'guide' | 'note';
  status: 'draft' | 'active' | 'archived';
  atsScore?: number; // For job application scoring
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>; // Backend-specific fields
}
```

### Implementations

| Implementation | Storage | Use Case |
|---|---|---|
| NotionDocumentStore | Notion API | Cloud-hosted, interactive |
| PostgresDocumentStore | PostgreSQL | Self-hosted, SQL queries |
| MemoryDocumentStore | In-memory (dev) | Testing, prototyping |

## IssueTracker Interface

Manages issues/tasks in external issue management systems.

```typescript
interface IssueTracker {
  createIssue(data: { title, description?, priority?, assignee?, dueDate? }): Promise<Issue>;
  updateIssueStatus(issueId: string, status: Issue['status']): Promise<Issue>;
  linkToDocument(issueId: string, documentId: string): Promise<void>;
  listIssues(filters: IssueFilter): Promise<Issue[]>;
  getIssue(issueId: string): Promise<Issue | null>;
}
```

### Issue Model

```typescript
interface Issue {
  id: string;
  key: string; // e.g., LIN-123
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done' | 'archived';
  priority: 'none' | 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  linkedDocumentIds?: string[]; // Back-references to Documents
}
```

### Implementations

| Implementation | Backend | Use Case |
|---|---|---|
| LinearIssueTracker | Linear GraphQL API | Team issue tracking |
| JiraIssueTracker | Jira REST API | Enterprise integration |
| MemoryIssueTracker | In-memory (dev) | Testing |

## Usage Pattern

### Basic Flow

```typescript
import { DocumentStore } from '@/lib/document-store';
import { IssueTracker } from '@/lib/issue-tracker';

// Dependency injection (provided at app root)
const docStore: DocumentStore = new NotionDocumentStore(notionToken);
const issueTracker: IssueTracker = new LinearIssueTracker(linearApiKey);

// Create a document
const doc = await docStore.createDocument({
  title: 'Sprint Goals',
  content: 'Q2 OKRs...',
  category: 'spec',
  status: 'active'
});

// Create linked issue
const issue = await issueTracker.createIssue({
  title: 'Implement Sprint Goals',
  priority: 'high'
});

// Link them
await issueTracker.linkToDocument(issue.id, doc.id);
```

### Decorator Pattern (Perplexity Integration)

```typescript
import { PerplexityDocumentStore } from '@/lib/document-store/perplexity';

// Wrap base store with Perplexity reasoning
const perplexityStore = new PerplexityDocumentStore(
  baseStore, // NotionDocumentStore or PostgresDocumentStore
  perplexityApiKey
);

// Reads use base store; writes validated before commit
const doc = await perplexityStore.getDocument(id); // From base store
await perplexityStore.updateDocument(id, updates); // Validated then saved
const summary = await perplexityStore.summarize(id); // Perplexity reasoning
```

## Dependency Injection

Configure at app initialization:

```typescript
// src/main.tsx
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { DocumentStoreProvider, IssueTrackerProvider } from '@/lib/providers';

const docStore = new NotionDocumentStore(
  process.env.REACT_APP_NOTION_TOKEN
);
const issueTracker = new LinearIssueTracker(
  process.env.REACT_APP_LINEAR_API_KEY
);

createRoot(document.getElementById('root')).render(
  <DocumentStoreProvider value={docStore}>
    <IssueTrackerProvider value={issueTracker}>
      <App />
    </IssueTrackerProvider>
  </DocumentStoreProvider>
);
```

## Self-Hosted Migration

To swap Notion for PostgreSQL:

```typescript
// Before (cloud)
const docStore = new NotionDocumentStore(notionToken);

// After (self-hosted)
const docStore = new PostgresDocumentStore(postgresUrl);

// All consuming code unchanged
const doc = await docStore.getDocument(id); // Works with either
```

## Error Handling

Both interfaces define custom error types:

```typescript
try {
  await docStore.updateDocument(id, updates);
} catch (err) {
  if (err instanceof DocumentStoreError) {
    console.error(`Document error: ${err.code}`);
  }
}
```

## Testing

Use memory implementations for unit tests:

```typescript
const docStore = new MemoryDocumentStore();
const issueTracker = new MemoryIssueTracker();

// Test code using interfaces without hitting real backends
```

## File Structure

```
frontend/src/lib/
├── document-store/
│   ├── index.ts          # Interfaces + DocumentStore
│   ├── notion.ts         # NotionDocumentStore
│   ├── postgres.ts       # PostgresDocumentStore (scaffold)
│   ├── perplexity.ts     # PerplexityDocumentStore (decorator)
│   ├── guards.ts         # Hallucination guard
│   └── __tests__/
│       ├── notion.test.ts
│       ├── perplexity.test.ts
│       └── guards.test.ts
├── issue-tracker/
│   ├── index.ts          # Interfaces + IssueTracker
│   ├── linear.ts         # LinearIssueTracker
│   ├── memory.ts         # MemoryIssueTracker (dev)
│   └── __tests__/
│       └── linear.test.ts
└── providers.tsx         # React contexts for DI
```

## Next Steps

1. Implement NotionDocumentStore (Task 5)
2. Implement LinearIssueTracker (Task 6)
3. Add hallucination guard (Task 7)
4. Implement PerplexityDocumentStore decorator (Task 8)
5. Create sync automation (Task 9)
6. PostgreSQL migration guide (Task 10)
