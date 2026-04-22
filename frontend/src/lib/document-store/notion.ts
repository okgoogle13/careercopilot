import { Document, DocumentFilter, DocumentStore, DocumentStoreError } from './index';

type DocumentCategory = Document['category'];
type DocumentStatus = Document['status'];

interface NotionPage {
  id: string;
  properties: Record<string, unknown>;
  created_time: string;
  last_edited_time: string;
}

/**
 * NotionDocumentStore: implements DocumentStore using Notion API.
 *
 * Maps Document model to Notion page properties:
 * - id → page_id
 * - title → Name (Title property)
 * - content → Content (Rich Text)
 * - category → Category (Select)
 * - status → Status (Select: draft|active|archived)
 * - atsScore → ATS Score (Number)
 */
export class NotionDocumentStore implements DocumentStore {
  private apiUrl = 'https://api.notion.com/v1';
  private apiVersion = '2022-06-28';
  private databaseId: string;
  private headers: Record<string, string>;
  private pageCache: Map<string, Document> = new Map();

  constructor(apiToken: string, databaseId: string) {
    this.databaseId = databaseId;
    this.headers = {
      Authorization: `Bearer ${apiToken}`,
      'Notion-Version': this.apiVersion,
      'Content-Type': 'application/json',
    };
  }

  async getDocument(id: string): Promise<Document | null> {
    // Check cache first
    if (this.pageCache.has(id)) {
      return this.pageCache.get(id) || null;
    }

    try {
      const response = await fetch(`${this.apiUrl}/pages/${id}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new DocumentStoreError(
          `Failed to fetch document: ${response.statusText}`,
          'NOTION_API_ERROR'
        );
      }

      const page = (await response.json()) as NotionPage;
      const doc = this.pageToDocument(page);
      this.pageCache.set(id, doc);
      return doc;
    } catch (error) {
      if (error instanceof DocumentStoreError) throw error;
      throw new DocumentStoreError(
        `Error fetching document: ${String(error)}`,
        'NOTION_FETCH_ERROR'
      );
    }
  }

  async listDocuments(filters: DocumentFilter): Promise<Document[]> {
    try {
      const filterPayload = this.buildFilterPayload(filters);
      const response = await fetch(`${this.apiUrl}/databases/${this.databaseId}/query`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(filterPayload),
      });

      if (!response.ok) {
        throw new DocumentStoreError(
          `Failed to list documents: ${response.statusText}`,
          'NOTION_API_ERROR'
        );
      }

      const data = (await response.json()) as { results: NotionPage[] };
      const documents = data.results.map((page) => this.pageToDocument(page));

      // Cache all results
      documents.forEach((doc) => this.pageCache.set(doc.id, doc));

      return documents;
    } catch (error) {
      if (error instanceof DocumentStoreError) throw error;
      throw new DocumentStoreError(
        `Error listing documents: ${String(error)}`,
        'NOTION_LIST_ERROR'
      );
    }
  }

  async createDocument(doc: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    try {
      const payload = {
        parent: { database_id: this.databaseId },
        properties: {
          Name: {
            title: [{ text: { content: doc.title } }],
          },
          Category: {
            select: { name: doc.category },
          },
          Status: {
            select: { name: doc.status },
          },
          ...(doc.atsScore !== undefined && {
            'ATS Score': {
              number: doc.atsScore,
            },
          }),
          Content: {
            rich_text: [{ text: { content: doc.content } }],
          },
        },
      };

      const response = await fetch(`${this.apiUrl}/pages`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new DocumentStoreError(
          `Failed to create document: ${response.statusText}`,
          'NOTION_API_ERROR'
        );
      }

      const page = (await response.json()) as NotionPage;
      const newDoc = this.pageToDocument(page);
      this.pageCache.set(newDoc.id, newDoc);
      return newDoc;
    } catch (error) {
      if (error instanceof DocumentStoreError) throw error;
      throw new DocumentStoreError(
        `Error creating document: ${String(error)}`,
        'NOTION_CREATE_ERROR'
      );
    }
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    // Verify document exists
    const existing = await this.getDocument(id);
    if (!existing) {
      throw new DocumentStoreError(`Document not found: ${id}`, 'DOCUMENT_NOT_FOUND');
    }

    try {
      const payload: Record<string, unknown> = { properties: {} };

      if (updates.title !== undefined) {
        (payload.properties as Record<string, unknown>).Name = {
          title: [{ text: { content: updates.title } }],
        };
      }

      if (updates.status !== undefined) {
        (payload.properties as Record<string, unknown>).Status = {
          select: { name: updates.status },
        };
      }

      if (updates.category !== undefined) {
        (payload.properties as Record<string, unknown>).Category = {
          select: { name: updates.category },
        };
      }

      if (updates.atsScore !== undefined) {
        (payload.properties as Record<string, unknown>)['ATS Score'] = {
          number: updates.atsScore,
        };
      }

      if (updates.content !== undefined) {
        (payload.properties as Record<string, unknown>).Content = {
          rich_text: [{ text: { content: updates.content } }],
        };
      }

      const response = await fetch(`${this.apiUrl}/pages/${id}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new DocumentStoreError(
          `Failed to update document: ${response.statusText}`,
          'NOTION_API_ERROR'
        );
      }

      const page = (await response.json()) as NotionPage;
      const updatedDoc = this.pageToDocument(page);
      this.pageCache.set(id, updatedDoc);
      return updatedDoc;
    } catch (error) {
      if (error instanceof DocumentStoreError) throw error;
      throw new DocumentStoreError(
        `Error updating document: ${String(error)}`,
        'NOTION_UPDATE_ERROR'
      );
    }
  }

  async archiveDocument(id: string): Promise<void> {
    try {
      await this.updateDocument(id, { status: 'archived' });
    } catch (error) {
      if (error instanceof DocumentStoreError) throw error;
      throw new DocumentStoreError(
        `Error archiving document: ${String(error)}`,
        'NOTION_ARCHIVE_ERROR'
      );
    }
  }

  async summarize(documentId: string, context?: string): Promise<string> {
    const doc = await this.getDocument(documentId);
    if (!doc) {
      throw new DocumentStoreError(`Document not found: ${documentId}`, 'DOCUMENT_NOT_FOUND');
    }

    // Simple summarization: first 300 chars of content
    // In production, this would call an LLM (Perplexity, OpenAI, etc.)
    const summary = doc.content.substring(0, 300);
    return summary + (doc.content.length > 300 ? '...' : '');
  }

  /**
   * Convert Notion page to Document model.
   */
  private pageToDocument(page: NotionPage): Document {
    const props = page.properties as Record<string, any>;

    return {
      id: page.id,
      title: this.extractTitle(props.Name),
      content: this.extractText(props.Content),
      category: this.extractSelect<DocumentCategory>(props.Category, 'task'),
      status: this.extractSelect<DocumentStatus>(props.Status, 'draft'),
      atsScore: props['ATS Score']?.number,
      createdAt: new Date(page.created_time),
      updatedAt: new Date(page.last_edited_time),
      metadata: { notionPageId: page.id },
    };
  }

  /**
   * Extract title from Notion Title property.
   */
  private extractTitle(titleProp: any): string {
    if (!titleProp?.title || !Array.isArray(titleProp.title)) {
      return 'Untitled';
    }
    return titleProp.title.map((t: any) => t.text?.content || '').join('');
  }

  /**
   * Extract text content from Notion Rich Text property.
   */
  private extractText(textProp: any): string {
    if (!textProp?.rich_text || !Array.isArray(textProp.rich_text)) {
      return '';
    }
    return textProp.rich_text.map((t: any) => t.text?.content || '').join('');
  }

  /**
   * Extract value from Notion Select property.
   */
  private extractSelect<T extends string>(selectProp: any, defaultValue: T): T {
    return selectProp?.select?.name || defaultValue;
  }

  /**
   * Build Notion API filter payload.
   */
  private buildFilterPayload(filters: DocumentFilter): Record<string, unknown> {
    const andConditions: any[] = [];

    if (filters.status) {
      andConditions.push({
        property: 'Status',
        select: { equals: filters.status },
      });
    }

    if (filters.category) {
      andConditions.push({
        property: 'Category',
        select: { equals: filters.category },
      });
    }

    const payload: Record<string, unknown> = {};

    if (andConditions.length > 0) {
      payload.filter = {
        and: andConditions,
      };
    }

    if (filters.limit) {
      payload.page_size = filters.limit;
    }

    return payload;
  }
}
