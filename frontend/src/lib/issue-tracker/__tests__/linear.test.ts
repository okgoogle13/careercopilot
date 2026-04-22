import { LinearIssueTracker } from '../linear';
import { Issue } from '../index';

describe('LinearIssueTracker', () => {
  let tracker: LinearIssueTracker;
  const mockApiKey = 'lin_test_api_key_123';
  const mockTeamId = 'team_abc123';

  beforeEach(() => {
    tracker = new LinearIssueTracker(mockApiKey, mockTeamId);
  });

  describe('createIssue', () => {
    it('creates an issue and returns it with id and key', async () => {
      const issue = await tracker.createIssue({
        title: 'Test Issue',
        description: 'This is a test issue',
        priority: 'high',
        dueDate: new Date('2026-04-30')
      });

      expect(issue.id).toBeDefined();
      expect(issue.key).toBeDefined();
      expect(issue.key).toMatch(/^[A-Z]+-\d+$/); // Linear format: ABC-123
      expect(issue.title).toBe('Test Issue');
      expect(issue.description).toBe('This is a test issue');
      expect(issue.priority).toBe('high');
      expect(issue.status).toBe('todo'); // Default status
      expect(issue.createdAt).toBeInstanceOf(Date);
      expect(issue.updatedAt).toBeInstanceOf(Date);
    });

    it('creates issue with minimal data', async () => {
      const issue = await tracker.createIssue({
        title: 'Minimal Issue'
      });

      expect(issue.title).toBe('Minimal Issue');
      expect(issue.priority).toBe('none');
      expect(issue.status).toBe('todo');
    });
  });

  describe('getIssue', () => {
    it('retrieves a created issue by id', async () => {
      const created = await tracker.createIssue({
        title: 'Get Test',
        priority: 'medium'
      });

      const retrieved = await tracker.getIssue(created.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe('Get Test');
      expect(retrieved?.priority).toBe('medium');
    });

    it('returns null for non-existent issue', async () => {
      const result = await tracker.getIssue('non_existent_id');
      expect(result).toBeNull();
    });
  });

  describe('updateIssueStatus', () => {
    it('updates issue status', async () => {
      const created = await tracker.createIssue({
        title: 'Status Test'
      });

      const updated = await tracker.updateIssueStatus(created.id, 'in_progress');
      expect(updated.status).toBe('in_progress');
      expect(updated.id).toBe(created.id);
    });

    it('supports all status transitions', async () => {
      const created = await tracker.createIssue({
        title: 'Transition Test'
      });

      const statuses: Array<Issue['status']> = ['todo', 'in_progress', 'done', 'archived'];

      for (const status of statuses) {
        const updated = await tracker.updateIssueStatus(created.id, status);
        expect(updated.status).toBe(status);
      }
    });
  });

  describe('linkToDocument', () => {
    it('links an issue to a document', async () => {
      const issue = await tracker.createIssue({
        title: 'Link Test'
      });

      const documentId = 'doc_abc123';
      await tracker.linkToDocument(issue.id, documentId);

      const retrieved = await tracker.getIssue(issue.id);
      expect(retrieved?.linkedDocumentIds).toContain(documentId);
    });

    it('supports multiple document links', async () => {
      const issue = await tracker.createIssue({
        title: 'Multi Link Test'
      });

      const docIds = ['doc_1', 'doc_2', 'doc_3'];
      for (const docId of docIds) {
        await tracker.linkToDocument(issue.id, docId);
      }

      const retrieved = await tracker.getIssue(issue.id);
      expect(retrieved?.linkedDocumentIds?.length).toBe(3);
      docIds.forEach(id => {
        expect(retrieved?.linkedDocumentIds).toContain(id);
      });
    });
  });

  describe('listIssues', () => {
    it('lists issues with no filters', async () => {
      await tracker.createIssue({ title: 'Issue 1' });
      await tracker.createIssue({ title: 'Issue 2' });
      await tracker.createIssue({ title: 'Issue 3' });

      const results = await tracker.listIssues({});
      expect(results.length).toBeGreaterThanOrEqual(3);
    });

    it('filters issues by status', async () => {
      const issue1 = await tracker.createIssue({ title: 'Todo Issue' });
      const issue2 = await tracker.createIssue({ title: 'Done Issue' });

      await tracker.updateIssueStatus(issue2.id, 'done');

      const results = await tracker.listIssues({ status: 'done' });
      expect(results.every(i => i.status === 'done')).toBe(true);
    });

    it('filters issues by priority', async () => {
      await tracker.createIssue({ title: 'Urgent', priority: 'urgent' });
      await tracker.createIssue({ title: 'Low', priority: 'low' });

      const results = await tracker.listIssues({ priority: 'urgent' });
      expect(results.every(i => i.priority === 'urgent')).toBe(true);
    });

    it('filters issues by assignee', async () => {
      const issue = await tracker.createIssue({
        title: 'Assigned',
        assignee: 'user@example.com'
      });

      const results = await tracker.listIssues({ assignee: 'user@example.com' });
      expect(results.some(i => i.id === issue.id)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('throws error when updating non-existent issue', async () => {
      await expect(
        tracker.updateIssueStatus('non_existent_id', 'done')
      ).rejects.toThrow();
    });

    it('throws error when linking non-existent issue', async () => {
      await expect(
        tracker.linkToDocument('non_existent_id', 'doc_123')
      ).rejects.toThrow();
    });
  });
});
