// Document types for the documents feature
export type DocumentType = 'resume' | 'cover-letter' | 'selection-criteria' | 'portfolio' | 'other';

export type DocumentView = 'grid' | 'list' | 'kanban';

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  lastModified: Date;
  size?: number;
  status?: 'draft' | 'published' | 'archived';
  atsScore?: number;
}
