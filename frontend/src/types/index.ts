// Shared type definitions

export type AppTab = 'dashboard' | 'ats-analysis';

export type DashboardTab = 'documents' | 'profiles' | 'analytics' | 'history' | 'applications';

export type DocumentType = 'resume' | 'cover-letter' | 'selection-criteria' | 'portfolio' | 'other';

export interface Profile {
  id: string;
  profile_name: string;
  keyword_count: number;
  last_modified: Date;
  is_default?: boolean;
}

export interface Template {
  id: string;
  name: string;
  type: DocumentType;
}

export type {
  AtsComplianceInfo,
  ColorConfig,
  CoverLetterThemeConfig,
  LayoutConfig,
  ResumeThemeConfig,
  TypographyConfig,
} from './themeConfig';

export * from './career';
