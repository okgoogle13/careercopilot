export type DocumentView = 'grid' | 'list';

export interface Document {
  /**
   * Unique identifier for the document
   */
  id: string;
  
  /**
   * Display name of the document
   */
  title: string;
  
  /**
   * Type of the document
   */
  type: 'resume' | 'cover-letter' | 'portfolio' | 'other';
  
  /**
   * Last modified date
   */
  lastModified: Date;
  
  /**
   * ATS score (0-100)
   */
  atsScore?: number;
  
  /**
   * URL to the document preview image
   */
  previewUrl?: string;
  
  /**
   * File size in bytes
   */
  size?: number;
  
  /**
   * Optional tags for filtering
   */
  tags?: string[];
}

export interface DocumentFilterOptions {
  searchQuery?: string;
  documentTypes?: Document['type'][];
  dateRange?: {
    from: Date;
    to: Date;
  };
  minScore?: number;
  tags?: string[];
}
