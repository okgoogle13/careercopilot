import { PerplexityDocumentStore } from '../perplexity';
import { Document, DocumentStore } from '../index';
import { PerplexityValidationError } from '../guards';

/**
 * Mock DocumentStore for testing PerplexityDocumentStore decorator.
 */
class MockDocumentStore implements DocumentStore {
  private documents: Map<string, Document> = new Map();
  private nextId = 1;

  async getDocument(id: string): Promise<Document | null> {
    return this.documents.get(id) || null;
  }

  async listDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async createDocument(doc: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    const id = `mock_${this.nextId++}`;
    const newDoc: Document = {
      ...doc,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.documents.set(id, newDoc);
    return newDoc;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    const doc = this.documents.get(id);
    if (!doc) throw new Error('Not found');

    const updated: Document = {
      ...doc,
      ...updates,
      updatedAt: new Date()
    };
    this.documents.set(id, updated);
    return updated;
  }

  async archiveDocument(id: string): Promise<void> {
    const doc = this.documents.get(id);
    if (doc) {
      doc.status = 'archived';
    }
  }

  async summarize(documentId: string): Promise<string> {
    const doc = this.documents.get(documentId);
    return doc ? doc.content.substring(0, 100) : '';
  }
}

describe('PerplexityDocumentStore', () => {
  let perplexityStore: PerplexityDocumentStore;
  let baseStore: MockDocumentStore;
  const mockApiKey = 'pplx_test_key_123';

  beforeEach(() => {
    baseStore = new MockDocumentStore();
    perplexityStore = new PerplexityDocumentStore(baseStore, mockApiKey);
  });

  describe('read operations (delegated)', () => {
    it('getDocument delegates to base store', async () => {
      const created = await baseStore.createDocument({
        title: 'Test',
        content: 'Content',
        category: 'task',
        status: 'active'
      });

      const retrieved = await perplexityStore.getDocument(created.id);
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe('Test');
    });

    it('listDocuments delegates to base store', async () => {
      await baseStore.createDocument({
        title: 'Doc 1',
        content: 'Content 1',
        category: 'task',
        status: 'active'
      });

      const results = await perplexityStore.listDocuments({});
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it('summarize delegates to base store', async () => {
      const doc = await baseStore.createDocument({
        title: 'To Summarize',
        content: 'This is some content to summarize',
        category: 'guide',
        status: 'active'
      });

      const summary = await perplexityStore.summarize(doc.id);
      expect(summary).toBeTruthy();
      expect(typeof summary).toBe('string');
    });
  });

  describe('write operations (guarded)', () => {
    it('createDocument with valid data delegates to base', async () => {
      const doc = await perplexityStore.createDocument({
        title: 'New Doc',
        content: 'New content',
        category: 'decision',
        status: 'draft'
      });

      expect(doc.id).toBeDefined();
      expect(doc.title).toBe('New Doc');

      // Verify it's in base store
      const fromBase = await baseStore.getDocument(doc.id);
      expect(fromBase).not.toBeNull();
    });

    it('createDocument rejects invalid status', async () => {
      await expect(
        perplexityStore.createDocument({
          title: 'Bad Doc',
          content: 'Content',
          category: 'task',
          status: 'published' as any // Invalid
        })
      ).rejects.toThrow(PerplexityValidationError);
    });

    it('createDocument rejects invalid category', async () => {
      await expect(
        perplexityStore.createDocument({
          title: 'Bad Doc',
          content: 'Content',
          category: 'blog' as any, // Invalid
          status: 'active'
        })
      ).rejects.toThrow(PerplexityValidationError);
    });

    it('createDocument rejects out-of-range atsScore', async () => {
      await expect(
        perplexityStore.createDocument({
          title: 'Bad Doc',
          content: 'Content',
          category: 'task',
          status: 'active',
          atsScore: 150 // Out of range
        })
      ).rejects.toThrow(PerplexityValidationError);
    });

    it('createDocument rejects oversized title', async () => {
      await expect(
        perplexityStore.createDocument({
          title: 'a'.repeat(501), // > 500 chars
          content: 'Content',
          category: 'task',
          status: 'active'
        })
      ).rejects.toThrow(PerplexityValidationError);
    });

    it('createDocument rejects oversized content', async () => {
      await expect(
        perplexityStore.createDocument({
          title: 'Title',
          content: 'a'.repeat(50001), // > 50000 chars
          category: 'task',
          status: 'active'
        })
      ).rejects.toThrow(PerplexityValidationError);
    });
  });

  describe('updateDocument (guarded writes)', () => {
    it('updateDocument with valid changes delegates to base', async () => {
      const created = await baseStore.createDocument({
        title: 'Original',
        content: 'Original content',
        category: 'task',
        status: 'draft'
      });

      const updated = await perplexityStore.updateDocument(created.id, {
        title: 'Updated',
        status: 'active'
      });

      expect(updated.title).toBe('Updated');
      expect(updated.status).toBe('active');

      // Verify in base store
      const fromBase = await baseStore.getDocument(created.id);
      expect(fromBase?.title).toBe('Updated');
    });

    it('updateDocument rejects invalid status change', async () => {
      const created = await baseStore.createDocument({
        title: 'Title',
        content: 'Content',
        category: 'task',
        status: 'draft'
      });

      await expect(
        perplexityStore.updateDocument(created.id, {
          status: 'invalid' as any
        })
      ).rejects.toThrow(PerplexityValidationError);
    });

    it('updateDocument rejects partial invalid update', async () => {
      const created = await baseStore.createDocument({
        title: 'Title',
        content: 'Content',
        category: 'task',
        status: 'draft'
      });

      await expect(
        perplexityStore.updateDocument(created.id, {
          title: 'New Title',
          atsScore: 150 // Invalid
        })
      ).rejects.toThrow(PerplexityValidationError);
    });

    it('updateDocument allows valid partial updates', async () => {
      const created = await baseStore.createDocument({
        title: 'Title',
        content: 'Content',
        category: 'task',
        status: 'draft'
      });

      const updated = await perplexityStore.updateDocument(created.id, {
        atsScore: 75 // Valid partial
      });

      expect(updated.atsScore).toBe(75);
      expect(updated.title).toBe('Title'); // Unchanged
    });
  });

  describe('archiveDocument', () => {
    it('archiveDocument delegates to base', async () => {
      const doc = await baseStore.createDocument({
        title: 'To Archive',
        content: 'Content',
        category: 'task',
        status: 'active'
      });

      await perplexityStore.archiveDocument(doc.id);

      const archived = await baseStore.getDocument(doc.id);
      expect(archived?.status).toBe('archived');
    });
  });

  describe('error handling', () => {
    it('re-throws PerplexityValidationError from guard', async () => {
      try {
        await perplexityStore.createDocument({
          title: 'Title',
          content: 'Content',
          category: 'task',
          status: 'bad' as any
        });
        fail('Should have thrown');
      } catch (e) {
        expect(e instanceof PerplexityValidationError).toBe(true);
      }
    });

    it('propagates base store errors', async () => {
      // Create a failing base store
      const failingStore: DocumentStore = {
        getDocument: async () => null,
        listDocuments: async () => [],
        createDocument: async () => {
          throw new Error('Base store error');
        },
        updateDocument: async () => {
          throw new Error('Base store error');
        },
        archiveDocument: async () => {},
        summarize: async () => ''
      };

      const failingPerplexity = new PerplexityDocumentStore(failingStore, 'key');

      await expect(
        failingPerplexity.createDocument({
          title: 'Title',
          content: 'Content',
          category: 'task',
          status: 'active'
        })
      ).rejects.toThrow('Base store error');
    });
  });

  describe('decorator pattern', () => {
    it('can wrap different DocumentStore implementations', async () => {
      // Test that decorator works with any DocumentStore
      const notionLike: DocumentStore = {
        getDocument: async (id: string) => null,
        listDocuments: async () => [],
        createDocument: async (doc) => ({
          ...doc,
          id: 'notion_' + Math.random(),
          createdAt: new Date(),
          updatedAt: new Date()
        }),
        updateDocument: async (id, updates) => {
          throw new Error('Not implemented');
        },
        archiveDocument: async () => {},
        summarize: async () => 'Summary'
      };

      const decorated = new PerplexityDocumentStore(notionLike, 'key');
      const doc = await decorated.createDocument({
        title: 'Test',
        content: 'Content',
        category: 'task',
        status: 'active'
      });

      expect(doc.id.startsWith('notion_')).toBe(true);
    });
  });
});
