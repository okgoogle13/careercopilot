export interface TemplateStyle {
  id: string;
  name: string;
  layout: 'single' | 'two-column';
  primaryColor: string; // Usually background or major header
  secondaryColor: string;
  accentColor: string;
  fontSans: string;
  fontSerif: string;
  headingColor: string;
  textColor: string;
  borderColor: string;
  bgLight: string;
}

// All colors and fonts adhere strictly to KR Solidarity v6.0 manifesto guidelines.
export const RESUME_TEMPLATES: TemplateStyle[] = [
  {
    id: 'krs-charcoal-ash',
    name: 'Charcoal & Ash (ATS)',
    layout: 'single',
    primaryColor: 'var(--kr-color-charcoal-background-base)', // Charcoal
    secondaryColor: 'var(--kr-color-concrete-grey-base)', // Concrete Grey
    accentColor: 'var(--kr-color-worker-ash-base)', // Worker Ash
    fontSans: "'Work Sans', sans-serif",
    fontSerif: "'Fraunces', serif",
    headingColor: 'var(--kr-color-charcoal-background-base)',
    textColor: 'var(--kr-color-charcoal-background-base)',
    borderColor: 'var(--kr-color-concrete-grey-base)',
    bgLight: 'var(--kr-color-worker-ash-base)',
  },
  {
    id: 'krs-crimson-strike',
    name: 'Crimson Strike (ATS)',
    layout: 'single',
    primaryColor: 'var(--kr-color-solidarity-red-base)', // Solidarity Crimson
    secondaryColor: 'var(--kr-color-concrete-grey-base)',
    accentColor: 'var(--kr-color-charcoal-background-base)',
    fontSans: "'Work Sans', sans-serif",
    fontSerif: "'Libre Bodoni', serif",
    headingColor: 'var(--kr-color-solidarity-red-base)',
    textColor: 'var(--kr-color-worker-ash-base)', // Worker Ash for readability on dark
    borderColor: 'var(--kr-color-solidarity-red-base)',
    bgLight: 'var(--kr-color-charcoal-background-base)', // Charcoal
  },
  {
    id: 'krs-protest-blue',
    name: 'Protest Metal (ATS)',
    layout: 'single',
    primaryColor: 'var(--kr-color-protest-metal-blue-base)', // Protest Metal Blue
    secondaryColor: 'var(--kr-color-worker-ash-base)',
    accentColor: 'var(--kr-color-stencil-yellow-base)', // Stencil Yellow
    fontSans: "'JetBrains Mono', monospace",
    fontSerif: "'Work Sans', sans-serif",
    headingColor: 'var(--kr-color-protest-metal-blue-base)',
    textColor: 'var(--kr-color-worker-ash-base)',
    borderColor: 'var(--kr-color-concrete-grey-base)',
    bgLight: 'var(--kr-color-charcoal-background-base)',
  },
  {
    id: 'krs-ink-gold',
    name: 'Ink Gold (ATS)',
    layout: 'single',
    primaryColor: 'var(--kr-color-ink-gold-base)', // Ink Gold
    secondaryColor: 'var(--kr-color-concrete-grey-base)',
    accentColor: 'var(--kr-color-charcoal-background-base)',
    fontSans: "'Work Sans', sans-serif",
    fontSerif: "'Fraunces', serif",
    headingColor: 'var(--kr-color-ink-gold-base)',
    textColor: 'var(--kr-color-worker-ash-base)',
    borderColor: 'var(--kr-color-concrete-grey-base)',
    bgLight: 'var(--kr-color-charcoal-background-base)',
  },
  {
    id: 'krs-activist-green',
    name: 'Activist Smoke (ATS)',
    layout: 'single',
    primaryColor: 'var(--kr-color-kr-activist-smoke-green-base)', // Activist Smoke Green
    secondaryColor: 'var(--kr-color-concrete-grey-base)',
    accentColor: 'var(--kr-color-charcoal-background-base)',
    fontSans: "'Work Sans', sans-serif",
    fontSerif: "'Fraunces', serif",
    headingColor: 'var(--kr-color-kr-activist-smoke-green-base)',
    textColor: 'var(--kr-color-worker-ash-base)',
    borderColor: 'var(--kr-color-concrete-grey-base)',
    bgLight: 'var(--kr-color-charcoal-background-base)',
  },
];
