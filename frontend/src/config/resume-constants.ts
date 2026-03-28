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
    primaryColor: '#1A1714', // Charcoal
    secondaryColor: '#A39B8F', // Concrete Grey
    accentColor: '#DAF6B3', // Worker Ash
    fontSans: "'Work Sans', sans-serif",
    fontSerif: "'Fraunces', serif",
    headingColor: '#1A1714',
    textColor: '#1A1714',
    borderColor: '#A39B8F',
    bgLight: '#DAF6B3',
  },
  {
    id: 'krs-crimson-strike',
    name: 'Crimson Strike (ATS)',
    layout: 'single',
    primaryColor: '#F14714', // Solidarity Crimson
    secondaryColor: '#A39B8F',
    accentColor: '#1A1714',
    fontSans: "'Work Sans', sans-serif",
    fontSerif: "'Libre Bodoni', serif",
    headingColor: '#F14714',
    textColor: '#1A1714',
    borderColor: '#F14714',
    bgLight: '#ffffff',
  },
  {
    id: 'krs-protest-blue',
    name: 'Protest Metal (ATS)',
    layout: 'single',
    primaryColor: '#48B3DA', // Protest Metal Blue
    secondaryColor: '#1A1714',
    accentColor: '#F6E748', // Stencil Yellow
    fontSans: "'JetBrains Mono', monospace",
    fontSerif: "'Work Sans', sans-serif",
    headingColor: '#48B3DA',
    textColor: '#1A1714',
    borderColor: '#A39B8F',
    bgLight: '#ffffff',
  },
  {
    id: 'krs-ink-gold',
    name: 'Ink Gold (ATS)',
    layout: 'single',
    primaryColor: '#1A1714',
    secondaryColor: '#A39B8F',
    accentColor: '#DAF674', // Ink Gold
    fontSans: "'Work Sans', sans-serif",
    fontSerif: "'Fraunces', serif",
    headingColor: '#1A1714',
    textColor: '#1A1714',
    borderColor: '#A39B8F',
    bgLight: '#ffffff',
  },
  {
    id: 'krs-activist-green',
    name: 'Activist Smoke (ATS)',
    layout: 'single',
    primaryColor: '#48DA8B', // Activist Smoke Green
    secondaryColor: '#1A1714',
    accentColor: '#DAF6B3',
    fontSans: "'Work Sans', sans-serif",
    fontSerif: "'Fraunces', serif",
    headingColor: '#1A1714',
    textColor: '#1A1714',
    borderColor: '#A39B8F',
    bgLight: '#ffffff',
  },
];
