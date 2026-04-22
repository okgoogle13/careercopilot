/**
 * DocumentStore interface and base implementations.
 * Decouples document persistence from frontend logic.
 */

export interface Document {
  id: string;
  title: string;
  content: string;
  category: 'task' | 'decision' | 'spec' | 'guide' | 'note';
  status: 'draft' | 'active' | 'archived';
  atsScore?: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface DocumentFilter {
  status?: Document['status'];
  category?: Document['category'];
  query?: string;
  limit?: number;
  offset?: number;
}

export interface DocumentStore {
  /**
   * Retrieve a document by ID.
   */
  getDocument(id: string): Promise<Document | null>;

  /**
   * List documents matching filters.
   */
  listDocuments(filters: DocumentFilter): Promise<Document[]>;

  /**
   * Create a new document.
   */
  createDocument(doc: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document>;

  /**
   * Update document fields.
   */
  updateDocument(id: string, updates: Partial<Document>): Promise<Document>;

  /**
   * Archive a document (soft delete).
   */
  archiveDocument(id: string): Promise<void>;

  /**
   * Get a summary of document content (e.g., for Perplexity reasoning).
   */
  summarize(documentId: string, context?: string): Promise<string>;
}

export class DocumentStoreError extends Error {
  constructor(message: string, public code: string = 'DOCUMENT_STORE_ERROR') {
    super(message);
    this.name = 'DocumentStoreError';
  }
}
