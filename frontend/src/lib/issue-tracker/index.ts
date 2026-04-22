/**
 * IssueTracker interface and base implementations.
 * Decouples issue management from frontend logic (Linear, Jira, custom).
 */

export interface Issue {
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
  linkedDocumentIds?: string[]; // References to DocumentStore documents
}

export interface IssueFilter {
  status?: Issue['status'];
  priority?: Issue['priority'];
  assignee?: string;
  query?: string;
  limit?: number;
  offset?: number;
}

export interface IssueTracker {
  /**
   * Create a new issue.
   */
  createIssue(data: {
    title: string;
    description?: string;
    priority?: Issue['priority'];
    assignee?: string;
    dueDate?: Date;
  }): Promise<Issue>;

  /**
   * Update issue status (transition).
   */
  updateIssueStatus(issueId: string, status: Issue['status']): Promise<Issue>;

  /**
   * Link an issue to a document (bidirectional reference).
   */
  linkToDocument(issueId: string, documentId: string): Promise<void>;

  /**
   * List issues matching filters.
   */
  listIssues(filters: IssueFilter): Promise<Issue[]>;

  /**
   * Get a single issue by ID.
   */
  getIssue(issueId: string): Promise<Issue | null>;
}

export class IssueTrackerError extends Error {
  constructor(
    message: string,
    public code: string = 'ISSUE_TRACKER_ERROR'
  ) {
    super(message);
    this.name = 'IssueTrackerError';
  }
}
