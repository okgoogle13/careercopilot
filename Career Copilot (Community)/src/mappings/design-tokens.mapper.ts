/**
 * Universal Figma → CSS Design Token Mapper
 * Copy-pasteable for any solution or design system
 */

export function designTokenMapper(token: string): string | undefined {
  // Transform Figma token (slashes/spaces to hyphens, lowercase)
  const transformed = token.replace(/\//g, '-').replace(/\s+/g, '-').toLowerCase();

  // Category-based mapping (colors, spacing, typography, shadow, etc.)
  if (transformed.startsWith('color-')) {
    return `var(--${transformed})`;
  }
  if (transformed.startsWith('font-size') || transformed.startsWith('font-family') || transformed.startsWith('font-weight')) {
    return `var(--${transformed})`;
  }
  if (transformed.startsWith('spacing-')) {
    return `var(--${transformed})`;
  }
  if (transformed.startsWith('shadow-')) {
    return `var(--${transformed})`;
  }
  if (transformed.startsWith('radius-')) {
    return `var(--${transformed})`;
  }
  if (transformed.startsWith('breakpoint-')) {
    return `var(--${transformed})`;
  }
  // Optionally add more custom categories as needed...

  // Fallback: return as a CSS variable if not mapped, otherwise undefined (preserve Figma)
  return `var(--${transformed})`;
}

/**
 * Career Copilot Specific Token Mappings
 * Maps common design patterns to our Google-inspired design system
 */
export function careerCopilotTokenMapper(token: string): string | undefined {
  const normalized = token.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
  
  // Color mappings (Updated with new palette)
  const colorMappings: Record<string, string> = {
    'primary': 'var(--primary)',
    'primary-light': 'var(--primary-light)',
    'primary-dark': 'var(--primary-dark)',
    'background': 'var(--background)',
    'background-section': 'var(--background-section)',
    'background-card': 'var(--background-card)',
    'background-elevated': 'var(--background-elevated)',
    'background-gradient': 'var(--background-gradient)',
    'foreground': 'var(--foreground)',
    'foreground-secondary': 'var(--foreground-secondary)',
    'foreground-muted': 'var(--foreground-muted)',
    'accent-blue': 'var(--accent-blue)',
    'accent-blue-light': 'var(--accent-blue-light)',
    'accent-purple': 'var(--accent-purple)',
    'accent-purple-light': 'var(--accent-purple-light)',
    'accent-green': 'var(--accent-green)',
    'accent-yellow': 'var(--accent-yellow)',
    'accent-red': 'var(--accent-red)',
    'border-primary': 'var(--border-primary)',
    'border-subtle': 'var(--border-subtle)',
    'glass-bg': 'var(--glass-bg)',
    'glass-bg-hover': 'var(--glass-bg-hover)',
    'glass-border': 'var(--glass-border)',
    'glass-border-hover': 'var(--glass-border-hover)',
  };

  // Typography mappings
  const typographyMappings: Record<string, string> = {
    'font-size-xs': '12px',
    'font-size-sm': '14px',
    'font-size-base': '16px',
    'font-size-lg': '18px',
    'font-size-xl': '24px',
    'font-size-2xl': '32px',
    'font-size-3xl': '48px',
    'font-size-4xl': '64px',
    'font-weight-regular': '400',
    'font-weight-medium': '500',
    'font-weight-semibold': '600',
    'line-height-tight': '120%',
    'line-height-base': '150%',
    'line-height-relaxed': '160%',
  };

  // Spacing mappings
  const spacingMappings: Record<string, string> = {
    'spacing-xs': '8px',
    'spacing-sm': '16px',
    'spacing-md': '24px',
    'spacing-lg': '32px',
    'spacing-xl': '48px',
    'spacing-2xl': '64px',
    'spacing-3xl': '96px',
  };

  // Border radius mappings
  const radiusMappings: Record<string, string> = {
    'radius-sm': '4px',
    'radius-md': '8px',
    'radius-lg': '16px',
    'radius-xl': '24px',
  };

  // Shadow mappings (Enhanced with glass morphism)
  const shadowMappings: Record<string, string> = {
    'shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.3)',
    'shadow-md': '0 4px 16px rgba(0, 0, 0, 0.4)',
    'shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
    'shadow-glow-primary': '0 0 16px rgba(96, 165, 250, 0.3)',
    'shadow-glow-purple': '0 0 16px rgba(167, 139, 250, 0.3)',
    'shadow-glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
    'shadow-glass-hover': '0 16px 64px rgba(0, 0, 0, 0.5)',
  };
  
  // Animation mappings
  const animationMappings: Record<string, string> = {
    'animation-duration-fast': '150ms',
    'animation-duration-normal': '300ms',
    'animation-duration-slow': '500ms',
    'animation-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'animation-ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'animation-ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'animation-ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  };
  
  // Glass morphism mappings
  const glassMappings: Record<string, string> = {
    'glass-bg': 'rgba(26, 31, 54, 0.25)',
    'glass-bg-hover': 'rgba(26, 31, 54, 0.35)',
    'glass-border': 'rgba(255, 255, 255, 0.1)',
    'glass-border-hover': 'rgba(96, 165, 250, 0.3)',
    'glass-blur': '15px',
  };
  
  // Breakpoint mappings
  const breakpointMappings: Record<string, string> = {
    'breakpoint-mobile': '768px',
    'breakpoint-tablet': '1024px',
    'breakpoint-desktop': '1440px',
  };

  // Check mappings in order
  if (colorMappings[normalized]) {
    return colorMappings[normalized];
  }
  if (typographyMappings[normalized]) {
    return typographyMappings[normalized];
  }
  if (spacingMappings[normalized]) {
    return spacingMappings[normalized];
  }
  if (radiusMappings[normalized]) {
    return radiusMappings[normalized];
  }
  if (shadowMappings[normalized]) {
    return shadowMappings[normalized];
  }
  if (animationMappings[normalized]) {
    return animationMappings[normalized];
  }
  if (glassMappings[normalized]) {
    return glassMappings[normalized];
  }
  if (breakpointMappings[normalized]) {
    return breakpointMappings[normalized];
  }

  // Fallback to generic mapper
  return designTokenMapper(token);
}

/**
 * Utility functions for design token usage
 */
export const tokens = {
  // Color tokens (Enhanced)
  colors: {
    primary: 'var(--primary)',
    primaryLight: 'var(--primary-light)',
    primaryDark: 'var(--primary-dark)',
    background: 'var(--background)',
    backgroundSection: 'var(--background-section)',
    backgroundCard: 'var(--background-card)',
    backgroundElevated: 'var(--background-elevated)',
    backgroundGradient: 'var(--background-gradient)',
    foreground: 'var(--foreground)',
    foregroundSecondary: 'var(--foreground-secondary)',
    foregroundMuted: 'var(--foreground-muted)',
    accentBlue: 'var(--accent-blue)',
    accentBlueLight: 'var(--accent-blue-light)',
    accentPurple: 'var(--accent-purple)',
    accentPurpleLight: 'var(--accent-purple-light)',
    accentGreen: 'var(--accent-green)',
    accentYellow: 'var(--accent-yellow)',
    accentRed: 'var(--accent-red)',
    borderPrimary: 'var(--border-primary)',
    borderSubtle: 'var(--border-subtle)',
    glassBg: 'var(--glass-bg)',
    glassBgHover: 'var(--glass-bg-hover)',
    glassBorder: 'var(--glass-border)',
    glassBorderHover: 'var(--glass-border-hover)',
  },
  
  // Typography tokens
  typography: {
    size: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '24px',
      '2xl': '32px',
      '3xl': '48px',
      '4xl': '64px',
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
    },
    lineHeight: {
      tight: '120%',
      base: '150%',
      relaxed: '160%',
    },
  },
  
  // Spacing tokens
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    '2xl': '64px',
    '3xl': '96px',
  },
  
  // Border radius tokens
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
  },
  
  // Shadow tokens (Enhanced)
  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glowPrimary: '0 0 16px rgba(96, 165, 250, 0.3)',
    glowPurple: '0 0 16px rgba(167, 139, 250, 0.3)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.37)',
    glassHover: '0 16px 64px rgba(0, 0, 0, 0.5)',
  },
  
  // Animation tokens
  animation: {
    durationFast: '150ms',
    durationNormal: '300ms',
    durationSlow: '500ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Glass morphism tokens
  glass: {
    bg: 'rgba(26, 31, 54, 0.25)',
    bgHover: 'rgba(26, 31, 54, 0.35)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(96, 165, 250, 0.3)',
    blur: '15px',
  },
  
  // Breakpoint tokens
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
  },
};

/**
 * Helper function to apply design tokens in React components
 */
export function useDesignToken(tokenPath: string): string {
  const token = careerCopilotTokenMapper(tokenPath);
  return token || `var(--${tokenPath.replace(/\s+/g, '-').toLowerCase()})`;
}

/**
 * Generate CSS custom properties from token object
 */
export function generateCSSCustomProperties(tokenObj: Record<string, any>, prefix = ''): string {
  let css = '';
  
  for (const [key, value] of Object.entries(tokenObj)) {
    const tokenName = prefix ? `${prefix}-${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      css += generateCSSCustomProperties(value, tokenName);
    } else {
      css += `  --${tokenName}: ${value};\n`;
    }
  }
  
  return css;
}