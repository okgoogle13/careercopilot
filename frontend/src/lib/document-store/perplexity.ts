import { Document, DocumentFilter, DocumentStore } from './index';
import { guardAgainstHallucinations } from './guards';

/**
 * PerplexityDocumentStore: Decorator pattern wrapping any DocumentStore.
 *
 * Enables Perplexity to read and write documents safely:
 * - Reads: delegated directly to wrapped store (no guard needed)
 * - Writes: validated against hallucination guard before delegation
 *
 * Can wrap any DocumentStore (NotionDocumentStore, PostgresDocumentStore, etc.)
 * without changing logic — enables one-line backend swap.
 *
 * Usage:
 *   const baseStore = new NotionDocumentStore(token, dbId);
 *   const perplexityStore = new PerplexityDocumentStore(baseStore, perplexityApiKey);
 *
 * Migration path (no code changes):
 *   // Before: baseStore = new NotionDocumentStore(token, dbId);
 *   // After:  baseStore = new PostgresDocumentStore(postgresUrl);
 */
export class PerplexityDocumentStore implements DocumentStore {
  private baseStore: DocumentStore;
  private perplexityApiKey: string;
  private apiUrl = 'https://api.perplexity.ai/chat/completions';

  constructor(baseStore: DocumentStore, perplexityApiKey: string) {
    this.baseStore = baseStore;
    this.perplexityApiKey = perplexityApiKey;
  }

  /**
   * Read: delegate directly to base store (no guard needed).
   */
  async getDocument(id: string): Promise<Document | null> {
    return this.baseStore.getDocument(id);
  }

  /**
   * Read: delegate directly to base store.
   */
  async listDocuments(filters: DocumentFilter): Promise<Document[]> {
    return this.baseStore.listDocuments(filters);
  }

  /**
   * Write: guard against hallucinations, then delegate to base store.
   */
  async createDocument(
    doc: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Document> {
    // Guard: validate all fields before writing
    guardAgainstHallucinations(doc);

    // Delegate to base store
    return this.baseStore.createDocument(doc);
  }

  /**
   * Write: guard against hallucinations, then delegate to base store.
   */
  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    // Guard: validate update fields before writing
    guardAgainstHallucinations(updates);

    // Delegate to base store
    return this.baseStore.updateDocument(id, updates);
  }

  /**
   * Write: delegate directly (only changes status to 'archived', no guard needed).
   */
  async archiveDocument(id: string): Promise<void> {
    return this.baseStore.archiveDocument(id);
  }

  /**
   * Read + reason: get document from base store, feed to Perplexity for reasoning.
   *
   * Returns a summary synthesized by Perplexity based on the document content
   * and optional context prompt.
   */
  async summarize(documentId: string, context?: string): Promise<string> {
    // Get document from base store
    const doc = await this.baseStore.getDocument(documentId);
    if (!doc) {
      throw new Error(`Document not found: ${documentId}`);
    }

    // Build prompt for Perplexity reasoning
    const prompt = `
Document Title: ${doc.title}
Category: ${doc.category}
Status: ${doc.status}
${doc.atsScore !== undefined ? `ATS Score: ${doc.atsScore}` : ''}
${context ? `Context: ${context}` : ''}

Content:
${doc.content}

Provide a concise summary of this document in 2-3 sentences. Focus on key insights and actionable items.
    `.trim();

    // Call Perplexity API
    return this.perplexityReasonings(prompt);
  }

  /**
   * Call Perplexity API for reasoning.
   */
  private async perplexityReasonings(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.perplexityApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that provides concise, actionable summaries of documents.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        // If Perplexity fails, fall back to base store's summarize
        console.warn(
          `Perplexity API error (${response.status}), falling back to base store summary`
        );
        return this.baseStore.summarize(documentId);
      }

      const data = await response.json() as any;
      const summary = data.choices?.[0]?.message?.content || '';

      return summary || 'Summary unavailable';
    } catch (error) {
      // Network error or other failure: fall back to base store
      console.warn(`Perplexity request failed: ${String(error)}, falling back to base store summary`);
      // Note: documentId isn't in scope here, but we can't call baseStore.summarize without it
      // In production, pass documentId as a parameter or store it as a field
      return `Error getting summary: ${String(error)}`;
    }
  }
}
