import { Issue, IssueFilter, IssueTracker, IssueTrackerError } from './index';

/**
 * LinearIssueTracker: implements IssueTracker using Linear GraphQL API.
 *
 * Maps Issue model to Linear issue fields:
 * - id → issueId (Linear UUID)
 * - key → key (Linear key: "ABC-123")
 * - title → title
 * - description → description
 * - status → state.name (mapped: "Todo"/"In Progress"/"Done"/"Archived")
 * - priority → priority (mapped: 0=None, 1=Urgent, 2=High, 3=Medium, 4=Low)
 * - assignee → assignee.email
 * - dueDate → dueDate
 */
export class LinearIssueTracker implements IssueTracker {
  private apiUrl = 'https://api.linear.app/graphql';
  private apiKey: string;
  private teamId: string;
  private issueCache: Map<string, Issue> = new Map();
  private nextIssueNum = 1;

  constructor(apiKey: string, teamId: string) {
    this.apiKey = apiKey;
    this.teamId = teamId;
  }

  async createIssue(data: {
    title: string;
    description?: string;
    priority?: Issue['priority'];
    assignee?: string;
    dueDate?: Date;
  }): Promise<Issue> {
    try {
      const query = `
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            issue {
              id
              key
              title
              description
              state {
                name
              }
              priority
              assignee {
                email
              }
              dueDate
              createdAt
              updatedAt
            }
          }
        }
      `;

      const variables = {
        input: {
          teamId: this.teamId,
          title: data.title,
          description: data.description,
          priority: this.priorityToLinear(data.priority || 'none'),
          dueDate: data.dueDate?.toISOString().split('T')[0],
          ...(data.assignee && {
            assigneeId: data.assignee,
          }),
        },
      };

      const response = await this.gqlQuery(query, variables);
      const issue = this.linearToIssue(response.data.issueCreate.issue);
      this.issueCache.set(issue.id, issue);
      return issue;
    } catch (error) {
      if (error instanceof IssueTrackerError) throw error;
      throw new IssueTrackerError(`Error creating issue: ${String(error)}`, 'LINEAR_CREATE_ERROR');
    }
  }

  async getIssue(issueId: string): Promise<Issue | null> {
    // Check cache first
    if (this.issueCache.has(issueId)) {
      return this.issueCache.get(issueId) || null;
    }

    try {
      const query = `
        query GetIssue($id: String!) {
          issue(id: $id) {
            id
            key
            title
            description
            state {
              name
            }
            priority
            assignee {
              email
            }
            dueDate
            createdAt
            updatedAt
          }
        }
      `;

      const response = await this.gqlQuery(query, { id: issueId });
      if (!response.data.issue) {
        return null;
      }

      const issue = this.linearToIssue(response.data.issue);
      this.issueCache.set(issueId, issue);
      return issue;
    } catch (error) {
      if (error instanceof IssueTrackerError) throw error;
      // Treat 404-like errors as null return
      if (String(error).includes('not found')) {
        return null;
      }
      throw new IssueTrackerError(`Error fetching issue: ${String(error)}`, 'LINEAR_FETCH_ERROR');
    }
  }

  async updateIssueStatus(issueId: string, status: Issue['status']): Promise<Issue> {
    try {
      // Verify issue exists
      const existing = await this.getIssue(issueId);
      if (!existing) {
        throw new IssueTrackerError(`Issue not found: ${issueId}`, 'ISSUE_NOT_FOUND');
      }

      const query = `
        mutation UpdateIssueStatus($id: String!, $status: String!) {
          issueUpdate(id: $id, input: { stateId: $status }) {
            issue {
              id
              key
              title
              description
              state {
                name
              }
              priority
              assignee {
                email
              }
              dueDate
              createdAt
              updatedAt
            }
          }
        }
      `;

      const linearStatus = this.statusToLinear(status);
      const response = await this.gqlQuery(query, {
        id: issueId,
        status: linearStatus,
      });

      const issue = this.linearToIssue(response.data.issueUpdate.issue);
      this.issueCache.set(issueId, issue);
      return issue;
    } catch (error) {
      if (error instanceof IssueTrackerError) throw error;
      throw new IssueTrackerError(
        `Error updating issue status: ${String(error)}`,
        'LINEAR_UPDATE_ERROR'
      );
    }
  }

  async linkToDocument(issueId: string, documentId: string): Promise<void> {
    try {
      const issue = await this.getIssue(issueId);
      if (!issue) {
        throw new IssueTrackerError(`Issue not found: ${issueId}`, 'ISSUE_NOT_FOUND');
      }

      // Store document link in issue metadata (description append or custom field)
      const linkedIds = issue.linkedDocumentIds || [];
      if (!linkedIds.includes(documentId)) {
        linkedIds.push(documentId);

        // In production, this would update a custom field or description
        // For now, store in cache
        issue.linkedDocumentIds = linkedIds;
        this.issueCache.set(issueId, issue);
      }
    } catch (error) {
      if (error instanceof IssueTrackerError) throw error;
      throw new IssueTrackerError(`Error linking document: ${String(error)}`, 'LINEAR_LINK_ERROR');
    }
  }

  async listIssues(filters: IssueFilter): Promise<Issue[]> {
    try {
      let filterString = `team.id = "${this.teamId}"`;

      if (filters.status) {
        const linearStatus = this.statusToLinear(filters.status);
        filterString += ` AND state.id = "${linearStatus}"`;
      }

      if (filters.priority) {
        const linearPriority = this.priorityToLinear(filters.priority);
        filterString += ` AND priority = ${linearPriority}`;
      }

      if (filters.assignee) {
        filterString += ` AND assignee.email = "${filters.assignee}"`;
      }

      const query = `
        query ListIssues($filter: String, $limit: Int) {
          issues(filter: $filter, first: $limit) {
            nodes {
              id
              key
              title
              description
              state {
                name
              }
              priority
              assignee {
                email
              }
              dueDate
              createdAt
              updatedAt
            }
          }
        }
      `;

      const response = await this.gqlQuery(query, {
        filter: filterString,
        limit: filters.limit || 50,
      });

      const issues = response.data.issues.nodes.map((node: any) => this.linearToIssue(node));

      // Cache all results
      issues.forEach((issue) => this.issueCache.set(issue.id, issue));

      return issues;
    } catch (error) {
      if (error instanceof IssueTrackerError) throw error;
      throw new IssueTrackerError(`Error listing issues: ${String(error)}`, 'LINEAR_LIST_ERROR');
    }
  }

  /**
   * Execute GraphQL query against Linear API.
   */
  private async gqlQuery(query: string, variables: Record<string, unknown>) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new IssueTrackerError(`Linear API error: ${response.statusText}`, 'LINEAR_API_ERROR');
    }

    const result = await response.json();

    if (result.errors) {
      throw new IssueTrackerError(
        `GraphQL error: ${JSON.stringify(result.errors)}`,
        'LINEAR_GQL_ERROR'
      );
    }

    return result;
  }

  /**
   * Convert Linear state name to Issue status.
   */
  private linearStateToStatus(stateName: string): Issue['status'] {
    const mapping: Record<string, Issue['status']> = {
      Todo: 'todo',
      'In Progress': 'in_progress',
      'In Review': 'in_progress',
      Done: 'done',
      Canceled: 'archived',
      Duplicate: 'archived',
    };
    return mapping[stateName] || 'todo';
  }

  /**
   * Convert Issue status to Linear state ID (placeholder).
   */
  private statusToLinear(status: Issue['status']): string {
    const mapping: Record<Issue['status'], string> = {
      todo: 'linear_todo_state_id',
      in_progress: 'linear_in_progress_state_id',
      done: 'linear_done_state_id',
      archived: 'linear_archived_state_id',
    };
    return mapping[status];
  }

  /**
   * Convert Issue priority to Linear priority number.
   */
  private priorityToLinear(priority: Issue['priority']): number {
    const mapping: Record<Issue['priority'], number> = {
      none: 0,
      low: 4,
      medium: 3,
      high: 2,
      urgent: 1,
    };
    return mapping[priority];
  }

  /**
   * Convert Linear priority number to Issue priority.
   */
  private linearPriorityToIssue(linearPriority: number): Issue['priority'] {
    const mapping: Record<number, Issue['priority']> = {
      0: 'none',
      1: 'urgent',
      2: 'high',
      3: 'medium',
      4: 'low',
    };
    return mapping[linearPriority] || 'none';
  }

  /**
   * Convert Linear issue to Issue model.
   */
  private linearToIssue(linearIssue: any): Issue {
    return {
      id: linearIssue.id,
      key: linearIssue.key,
      title: linearIssue.title,
      description: linearIssue.description,
      status: this.linearStateToStatus(linearIssue.state?.name || 'Todo'),
      priority: this.linearPriorityToIssue(linearIssue.priority || 0),
      assignee: linearIssue.assignee?.email,
      dueDate: linearIssue.dueDate ? new Date(linearIssue.dueDate) : undefined,
      createdAt: new Date(linearIssue.createdAt),
      updatedAt: new Date(linearIssue.updatedAt),
      linkedDocumentIds: [],
    };
  }
}
