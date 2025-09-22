import { cn } from './utils';

/**
 * Aurora Theme Utility Classes
 * These utilities can be combined with existing components to apply Aurora theme effects
 */

export const auroraStyles = {
  // Aurora gradient backgrounds
  bgAuroraFull: "bg-aurora-full",
  bgAuroraPrimary: "bg-aurora-primary", 
  bgAuroraSecondary: "bg-aurora-secondary",
  bgAuroraTertiary: "bg-aurora-tertiary",
  bgAuroraSubtle: "bg-aurora-subtle",

  // Aurora text gradients
  textAurora: "text-gradient-aurora",
  textPrimary: "text-gradient-primary",
  textSecondary: "text-gradient-secondary", 
  textTertiary: "text-gradient-tertiary",

  // Aurora glow effects
  glowPrimary: "shadow-glow-primary",
  glowSecondary: "shadow-glow-secondary",
  glowTertiary: "shadow-glow-tertiary",
  glowAurora: "shadow-glow-aurora",

  // Aurora interactive cards
  cardAurora: "card-aurora",
  cardInteractive: "card-interactive-enhanced",
  cardCreate: "card-create-profile",

  // Aurora glass effects
  glassAurora: "glass-aurora",
  glass: "glass",

  // Aurora buttons
  btnPrimary: "btn-primary-cta",
  btnGradient: "btn-gradient",
  btnSecondary: "btn-gradient-secondary",
  btnTertiary: "btn-gradient-tertiary",

  // Aurora animations
  pulse: "ats-score-pulse",
  pulseAi: "pulse-ai",
  pulseTertiary: "pulse-tertiary",
  iconInteractive: "icon-interactive",

  // Aurora form inputs
  formEnhanced: "form-input-enhanced",

  // Aurora elevation
  elevationInteractive: "elevation-interactive",
  liftOnHover: "lift-on-hover",

  // Aurora motion
  transitionShort: "transition-short4",
  transitionMedium: "transition-medium2",
  easeEmphasized: "ease-emphasized"
};

/**
 * Aurora theme utility functions
 */
export const aurora = {
  /**
   * Creates an Aurora-themed interactive card
   */
  card: (additionalClasses?: string) => 
    cn("card-aurora glass transition-all duration-300 cursor-pointer group", additionalClasses),

  /**
   * Creates an Aurora-themed button with gradient and glow
   */
  button: (variant: 'primary' | 'secondary' | 'tertiary' = 'primary', additionalClasses?: string) => {
    const variantClasses = {
      primary: "btn-gradient",
      secondary: "btn-gradient-secondary", 
      tertiary: "btn-gradient-tertiary"
    };
    return cn(variantClasses[variant], additionalClasses);
  },

  /**
   * Creates Aurora-themed gradient text
   */
  text: (variant: 'aurora' | 'primary' | 'secondary' | 'tertiary' = 'aurora', additionalClasses?: string) => {
    const variantClasses = {
      aurora: "text-gradient-aurora",
      primary: "text-gradient-primary",
      secondary: "text-gradient-secondary",
      tertiary: "text-gradient-tertiary"
    };
    return cn(variantClasses[variant], additionalClasses);
  },

  /**
   * Creates Aurora-themed glow effects
   */
  glow: (variant: 'aurora' | 'primary' | 'secondary' | 'tertiary' = 'aurora', additionalClasses?: string) => {
    const variantClasses = {
      aurora: "shadow-glow-aurora",
      primary: "shadow-glow-primary", 
      secondary: "shadow-glow-secondary",
      tertiary: "shadow-glow-tertiary"
    };
    return cn(variantClasses[variant], additionalClasses);
  },

  /**
   * Creates Aurora-themed background with gradient
   */
  background: (variant: 'full' | 'primary' | 'secondary' | 'tertiary' | 'subtle' = 'full', additionalClasses?: string) => {
    const variantClasses = {
      full: "bg-aurora-full",
      primary: "bg-aurora-primary",
      secondary: "bg-aurora-secondary", 
      tertiary: "bg-aurora-tertiary",
      subtle: "bg-aurora-subtle"
    };
    return cn(variantClasses[variant], additionalClasses);
  },

  /**
   * Creates Aurora-themed interactive icon with hover effects
   */
  icon: (additionalClasses?: string) =>
    cn("icon-interactive transition-transform duration-300", additionalClasses),

  /**
   * Creates Aurora-themed form input with enhanced floating label
   */
  input: (additionalClasses?: string) =>
    cn("form-input-enhanced", additionalClasses),

  /**
   * Creates Aurora-themed glass morphism effect
   */
  glass: (variant: 'default' | 'aurora' = 'default', additionalClasses?: string) => {
    const variantClasses = {
      default: "glass",
      aurora: "glass-aurora"
    };
    return cn(variantClasses[variant], additionalClasses);
  },

  /**
   * Creates Aurora-themed badge with pulse animation
   */
  badge: (variant: 'ai' | 'tertiary' | 'new' = 'ai', additionalClasses?: string) => {
    const variantClasses = {
      ai: "pulse-ai",
      tertiary: "pulse-tertiary",
      new: "pulse-new"
    };
    return cn(variantClasses[variant], additionalClasses);
  }
};

/**
 * Aurora color utilities for direct CSS custom property access
 */
export const auroraColors = {
  primary: "var(--primary)",
  primaryAccent: "var(--color-primary-accent)",
  tertiary: "var(--tertiary)",
  tertiaryContainer: "var(--tertiary-container)",
  background: "var(--background)",
  surface: "var(--surface-container)",
  surfaceHigh: "var(--surface-container-high)",
  onSurface: "var(--on-surface)",
  outline: "var(--outline-variant)"
};

/**
 * Aurora motion utilities for enhanced animations
 */
export const auroraMotion = {
  durationShort: "var(--motion-duration-short4)",
  durationMedium: "var(--motion-duration-medium2)", 
  durationLong: "var(--motion-duration-long2)",
  easeStandard: "var(--motion-easing-standard)",
  easeEmphasized: "var(--motion-easing-emphasized)",
  easeDecelerate: "var(--motion-easing-emphasized-decelerate)",
  easeAccelerate: "var(--motion-easing-emphasized-accelerate)"
};