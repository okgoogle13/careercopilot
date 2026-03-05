/**
 * Theme configuration types for extracted PDF styling.
 *
 * These mirror the backend Pydantic schemas in
 * backend/app/models/theme_config_schemas.py.
 */

export interface TypographyConfig {
  fontFamily: string;
  baseFontSizePt: number;
  headingFontSizePt: number;
  nameFontSizePt: number;
  headingFontWeight: number;
  bodyFontWeight: number;
}

export interface ColorConfig {
  bodyText: string;
  headerText: string;
  nameColor: string;
  divider: string;
  accent: string;
  backgroundColor: string;
}

export interface LayoutConfig {
  spacingScale: 'compact' | 'default' | 'spacious';
  order: string[];
  variant: 'single_column' | 'two_column_sidebar';
  sidebarSections: string[];
  marginsPt: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface AtsComplianceInfo {
  score: number;
  issues: string[];
}

export interface ResumeThemeConfig {
  id: string;
  label: string;
  description: string;
  colors: ColorConfig;
  typography: TypographyConfig;
  layout: LayoutConfig;
  ats_compliance: AtsComplianceInfo;
  source_pdf?: string;
  created_at: string;
  target_sector?: string;
}

export interface CoverLetterThemeConfig {
  id: string;
  label: string;
  description: string;
  colors: ColorConfig;
  typography: TypographyConfig;
  layout: Record<string, unknown>;
  ats_compliance: AtsComplianceInfo;
  source_pdf?: string;
  created_at: string;
}
