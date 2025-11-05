import { useMemo } from 'react';
import { tokens, careerCopilotTokenMapper, useDesignToken } from '../mappings/design-tokens.mapper';

/**
 * Hook for accessing design tokens in React components
 */
export function useDesignTokens() {
  return useMemo(
    () => ({
      // Direct access to token object
      tokens,

      // Get a specific token by path
      getToken: (tokenPath: string) => useDesignToken(tokenPath),

      // Helper functions for common token categories
      color: (tokenName: string) =>
        tokens.colors[tokenName as keyof typeof tokens.colors] || `var(--color-${tokenName})`,
      spacing: (size: keyof typeof tokens.spacing) => tokens.spacing[size],
      typography: {
        size: (size: keyof typeof tokens.typography.size) => tokens.typography.size[size],
        weight: (weight: keyof typeof tokens.typography.weight) => tokens.typography.weight[weight],
        lineHeight: (height: keyof typeof tokens.typography.lineHeight) =>
          tokens.typography.lineHeight[height],
      },
      radius: (size: keyof typeof tokens.radius) => tokens.radius[size],
      shadow: (type: keyof typeof tokens.shadow) => tokens.shadow[type],
      animation: (property: keyof typeof tokens.animation) => tokens.animation[property],
      glass: (property: keyof typeof tokens.glass) => tokens.glass[property],
      breakpoint: (size: keyof typeof tokens.breakpoints) => tokens.breakpoints[size],

      // Style objects for common patterns (Enhanced with glass morphism)
      styles: {
        card: {
          background: tokens.glass.bg,
          backdropFilter: `blur(${tokens.glass.blur})`,
          WebkitBackdropFilter: `blur(${tokens.glass.blur})`,
          border: `1px solid ${tokens.glass.border}`,
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadow.glass,
          transition: `all ${tokens.animation.durationNormal} ${tokens.animation.ease}`,
        },
        cardElevated: {
          background: tokens.glass.bgHover,
          backdropFilter: `blur(${tokens.glass.blur})`,
          WebkitBackdropFilter: `blur(${tokens.glass.blur})`,
          border: `1px solid ${tokens.glass.borderHover}`,
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadow.glassHover,
          transition: `all ${tokens.animation.durationNormal} ${tokens.animation.ease}`,
        },
        cardGlass: {
          background: tokens.glass.bg,
          backdropFilter: `blur(${tokens.glass.blur})`,
          WebkitBackdropFilter: `blur(${tokens.glass.blur})`,
          border: `1px solid ${tokens.glass.border}`,
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadow.glass,
          transition: `all ${tokens.animation.durationNormal} ${tokens.animation.ease}`,
        },
        buttonPrimary: {
          background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.primaryLight} 100%)`,
          color: tokens.colors.foreground,
          borderRadius: tokens.radius.md,
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          fontSize: tokens.typography.size.base,
          fontWeight: tokens.typography.weight.medium,
          border: 'none',
          boxShadow: tokens.shadow.glowPrimary,
          transition: `all ${tokens.animation.durationNormal} ${tokens.animation.ease}`,
        },
        buttonGlass: {
          background: tokens.glass.bg,
          backdropFilter: `blur(${tokens.glass.blur})`,
          WebkitBackdropFilter: `blur(${tokens.glass.blur})`,
          border: `1px solid ${tokens.glass.border}`,
          color: tokens.colors.foreground,
          borderRadius: tokens.radius.md,
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          fontSize: tokens.typography.size.base,
          fontWeight: tokens.typography.weight.medium,
          transition: `all ${tokens.animation.durationNormal} ${tokens.animation.ease}`,
        },
        textPrimary: {
          color: tokens.colors.foreground,
          fontSize: tokens.typography.size.base,
          fontWeight: tokens.typography.weight.regular,
          lineHeight: tokens.typography.lineHeight.base,
        },
        textSecondary: {
          color: tokens.colors.foregroundSecondary,
          fontSize: tokens.typography.size.sm,
          fontWeight: tokens.typography.weight.regular,
          lineHeight: tokens.typography.lineHeight.base,
        },
        textGradientBlue: {
          background: `linear-gradient(135deg, ${tokens.colors.accentBlue} 0%, ${tokens.colors.accentBlueLight} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: `0 2px 4px rgba(96, 165, 250, 0.2)`,
        },
        textGradientPurple: {
          background: `linear-gradient(135deg, ${tokens.colors.accentPurple} 0%, ${tokens.colors.accentPurpleLight} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: `0 2px 4px rgba(167, 139, 250, 0.2)`,
        },
      },
    }),
    []
  );
}

/**
 * Hook for creating responsive design token values with enhanced breakpoints
 */
export function useResponsiveTokens() {
  return useMemo(
    () => ({
      // Responsive spacing with touch optimization
      spacing: {
        xs: { padding: tokens.spacing.xs },
        sm: { padding: tokens.spacing.sm },
        md: { padding: tokens.spacing.md },
        lg: { padding: tokens.spacing.lg },
        xl: { padding: tokens.spacing.xl },
        touchTarget: { minHeight: '44px', minWidth: '44px' }, // iOS/Android guidelines
      },

      // Responsive typography with improved scale
      typography: {
        mobile: {
          heading: {
            fontSize: tokens.typography.size.xl,
            lineHeight: tokens.typography.lineHeight.tight,
          },
          subheading: {
            fontSize: tokens.typography.size.lg,
            lineHeight: tokens.typography.lineHeight.base,
          },
          body: {
            fontSize: tokens.typography.size.sm,
            lineHeight: tokens.typography.lineHeight.relaxed,
          },
          caption: {
            fontSize: tokens.typography.size.xs,
            lineHeight: tokens.typography.lineHeight.base,
          },
        },
        tablet: {
          heading: {
            fontSize: tokens.typography.size['2xl'],
            lineHeight: tokens.typography.lineHeight.tight,
          },
          subheading: {
            fontSize: tokens.typography.size.xl,
            lineHeight: tokens.typography.lineHeight.base,
          },
          body: {
            fontSize: tokens.typography.size.base,
            lineHeight: tokens.typography.lineHeight.relaxed,
          },
          caption: {
            fontSize: tokens.typography.size.sm,
            lineHeight: tokens.typography.lineHeight.base,
          },
        },
        desktop: {
          heading: {
            fontSize: tokens.typography.size['3xl'],
            lineHeight: tokens.typography.lineHeight.tight,
          },
          subheading: {
            fontSize: tokens.typography.size['2xl'],
            lineHeight: tokens.typography.lineHeight.base,
          },
          body: {
            fontSize: tokens.typography.size.lg,
            lineHeight: tokens.typography.lineHeight.relaxed,
          },
          caption: {
            fontSize: tokens.typography.size.base,
            lineHeight: tokens.typography.lineHeight.base,
          },
        },
      },

      // Responsive layouts with improved breakpoints
      layout: {
        container: {
          mobile: {
            maxWidth: '100%',
            margin: '0 auto',
            padding: `0 ${tokens.spacing.md}`,
          },
          tablet: {
            maxWidth: '768px',
            margin: '0 auto',
            padding: `0 ${tokens.spacing.lg}`,
          },
          desktop: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: `0 ${tokens.spacing.xl}`,
          },
        },
        grid: {
          mobile: {
            gridTemplateColumns: '1fr',
            gap: tokens.spacing.md,
          },
          tablet: {
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: tokens.spacing.lg,
          },
          desktop: {
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: tokens.spacing.xl,
          },
        },
      },

      // Glass morphism responsive effects
      glass: {
        mobile: {
          background: tokens.glass.bg,
          backdropFilter: `blur(${tokens.glass.blur})`,
          border: `1px solid ${tokens.glass.border}`,
        },
        desktop: {
          background: tokens.glass.bg,
          backdropFilter: `blur(${tokens.glass.blur})`,
          border: `1px solid ${tokens.glass.border}`,
          boxShadow: tokens.shadow.glass,
        },
      },

      // Animation responsive settings
      animation: {
        mobile: {
          duration: tokens.animation.durationFast, // Faster on mobile for better perceived performance
          ease: tokens.animation.ease,
        },
        desktop: {
          duration: tokens.animation.durationNormal,
          ease: tokens.animation.ease,
        },
      },
    }),
    []
  );
}

/**
 * Utility function to create CSS-in-JS styles with design tokens
 */
export function createTokenStyles<T extends Record<string, any>>(
  stylesFn: (tokens: typeof tokens) => T
): T {
  return stylesFn(tokens);
}

/**
 * Type-safe design token access with enhanced categories
 */
export type DesignTokens = typeof tokens;
export type ColorTokens = keyof typeof tokens.colors;
export type SpacingTokens = keyof typeof tokens.spacing;
export type TypographySize = keyof typeof tokens.typography.size;
export type TypographyWeight = keyof typeof tokens.typography.weight;
export type TypographyLineHeight = keyof typeof tokens.typography.lineHeight;
export type RadiusTokens = keyof typeof tokens.radius;
export type ShadowTokens = keyof typeof tokens.shadow;
export type AnimationTokens = keyof typeof tokens.animation;
export type GlassTokens = keyof typeof tokens.glass;
export type BreakpointTokens = keyof typeof tokens.breakpoints;

/**
 * Helper function for responsive styles with breakpoints
 */
export function createResponsiveStyles<T extends Record<string, any>>(
  mobileStyles: T,
  tabletStyles?: Partial<T>,
  desktopStyles?: Partial<T>
): Record<string, any> {
  return {
    ...mobileStyles,
    [`@media (min-width: ${tokens.breakpoints.mobile})`]: {
      ...tabletStyles,
    },
    [`@media (min-width: ${tokens.breakpoints.tablet})`]: {
      ...desktopStyles,
    },
  };
}

/**
 * Accessibility helper for focus styles
 */
export function createAccessibleFocusStyle(color: ColorTokens = 'primary') {
  return {
    outline: `2px solid var(--accent-${color.replace('accent', '').toLowerCase()})`,
    outlineOffset: '2px',
    boxShadow: `0 0 0 4px rgba(96, 165, 250, 0.2)`,
  };
}

/**
 * Glass morphism effect helper
 */
export function createGlassEffect(intensity: 'light' | 'medium' | 'strong' = 'medium') {
  const intensityMap = {
    light: {
      background: 'rgba(26, 31, 54, 0.15)',
      blur: '10px',
      border: 'rgba(255, 255, 255, 0.05)',
    },
    medium: {
      background: tokens.glass.bg,
      blur: tokens.glass.blur,
      border: tokens.glass.border,
    },
    strong: {
      background: 'rgba(26, 31, 54, 0.4)',
      blur: '20px',
      border: 'rgba(255, 255, 255, 0.15)',
    },
  };

  const effect = intensityMap[intensity];

  return {
    background: effect.background,
    backdropFilter: `blur(${effect.blur})`,
    WebkitBackdropFilter: `blur(${effect.blur})`,
    border: `1px solid ${effect.border}`,
    boxShadow: tokens.shadow.glass,
  };
}
