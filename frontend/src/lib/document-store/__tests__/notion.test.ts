import { NotionDocumentStore } from '../notion';
import { Document } from '../index';

describe('NotionDocumentStore', () => {
  let store: NotionDocumentStore;
  const mockToken = 'ntn_test_token_123';
  const mockDatabaseId = 'abc123def456';

  beforeEach(() => {
    store = new NotionDocumentStore(mockToken, mockDatabaseId);
  });

  describe('createDocument', () => {
    it('creates a document and returns it with id and timestamps', async () => {
      const doc = await store.createDocument({
        title: 'Test Document',
        content: 'This is a test',
        category: 'task',
        status: 'draft',
      });

      expect(doc.id).toBeDefined();
      expect(doc.title).toBe('Test Document');
      expect(doc.content).toBe('This is a test');
      expect(doc.category).toBe('task');
      expect(doc.status).toBe('draft');
      expect(doc.createdAt).toBeInstanceOf(Date);
      expect(doc.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getDocument', () => {
    it('retrieves a created document by id', async () => {
      const created = await store.createDocument({
        title: 'Get Test',
        content: 'Content here',
        category: 'decision',
        status: 'active',
      });

      const retrieved = await store.getDocument(created.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe('Get Test');
    });

    it('returns null for non-existent document', async () => {
      const result = await store.getDocument('non_existent_id');
      expect(result).toBeNull();
    });
  });

  describe('listDocuments', () => {
    it('lists documents with no filters', async () => {
      await store.createDocument({
        title: 'Doc 1',
        content: 'Content 1',
        category: 'task',
        status: 'active',
      });

      await store.createDocument({
        title: 'Doc 2',
        content: 'Content 2',
        category: 'decision',
        status: 'draft',
      });

      const results = await store.listDocuments({});
      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it('filters documents by status', async () => {
      await store.createDocument({
        title: 'Active Doc',
        content: 'Active content',
        category: 'task',
        status: 'active',
      });

      await store.createDocument({
        title: 'Draft Doc',
        content: 'Draft content',
        category: 'task',
        status: 'draft',
      });

      const results = await store.listDocuments({ status: 'active' });
      expect(results.every((d) => d.status === 'active')).toBe(true);
    });

    it('filters documents by category', async () => {
      await store.createDocument({
        title: 'Task Doc',
        content: 'Task content',
        category: 'task',
        status: 'active',
      });

      await store.createDocument({
        title: 'Decision Doc',
        content: 'Decision content',
        category: 'decision',
        status: 'active',
      });

      const results = await store.listDocuments({ category: 'task' });
      expect(results.every((d) => d.category === 'task')).toBe(true);
    });
  });

  describe('updateDocument', () => {
    it('updates document fields', async () => {
      const created = await store.createDocument({
        title: 'Original Title',
        content: 'Original content',
        category: 'task',
        status: 'draft',
      });

      const updated = await store.updateDocument(created.id, {
        title: 'Updated Title',
        status: 'active',
      });

      expect(updated.title).toBe('Updated Title');
      expect(updated.status).toBe('active');
      expect(updated.content).toBe('Original content'); // Unchanged
      expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
    });

    it('throws error for non-existent document', async () => {
      await expect(
        store.updateDocument('non_existent_id', { title: 'New Title' })
      ).rejects.toThrow();
    });
  });

  describe('archiveDocument', () => {
    it('archives a document', async () => {
      const created = await store.createDocument({
        title: 'To Archive',
        content: 'Content',
        category: 'task',
        status: 'active',
      });

      await store.archiveDocument(created.id);

      const retrieved = await store.getDocument(created.id);
      expect(retrieved?.status).toBe('archived');
    });
  });

  describe('summarize', () => {
    it('returns a summary of document content', async () => {
      const created = await store.createDocument({
        title: 'Long Document',
        content: 'This is a long document with lots of content that needs summarizing',
        category: 'guide',
        status: 'active',
      });

      const summary = await store.summarize(created.id);
      expect(summary).toBeDefined();
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
    });
  });
});
