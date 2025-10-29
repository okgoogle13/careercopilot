/**
 * Animation Utilities
 * Reusable animation and transition configurations
 */

import { keyframes } from '@emotion/react';

/**
 * Keyframe animations
 */
export const animations = {
  fadeIn: keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `,

  slideInUp: keyframes`
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,

  slideInDown: keyframes`
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,

  slideInLeft: keyframes`
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `,

  slideInRight: keyframes`
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `,

  scaleIn: keyframes`
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  `,

  pulse: keyframes`
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  `,

  shimmer: keyframes`
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  `,

  bounce: keyframes`
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  `,

  rotate: keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `,
};

/**
 * Transition presets
 */
export const transitions = {
  fast: 'all 0.15s ease-in-out',
  normal: 'all 0.3s ease-in-out',
  slow: 'all 0.5s ease-in-out',

  fade: {
    default: 'opacity 0.3s ease-in-out',
    slow: 'opacity 0.5s ease-in-out',
  },

  transform: {
    default: 'transform 0.3s ease-in-out',
    slow: 'transform 0.5s ease-in-out',
  },

  color: {
    default: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
  },
};

/**
 * Box shadow animations
 */
export const shadowTransitions = {
  hover: 'box-shadow 0.3s ease-in-out',
  focus: 'box-shadow 0.2s ease-in-out',
};

/**
 * Common animation sx objects for Material-UI
 */
export const animatedSx = {
  fadeIn: {
    animation: `${animations.fadeIn} 0.3s ease-in-out`,
  },

  slideInUp: {
    animation: `${animations.slideInUp} 0.4s ease-out`,
  },

  slideInDown: {
    animation: `${animations.slideInDown} 0.4s ease-out`,
  },

  slideInLeft: {
    animation: `${animations.slideInLeft} 0.4s ease-out`,
  },

  slideInRight: {
    animation: `${animations.slideInRight} 0.4s ease-out`,
  },

  scaleIn: {
    animation: `${animations.scaleIn} 0.3s ease-out`,
  },

  pulse: {
    animation: `${animations.pulse} 2s ease-in-out infinite`,
  },

  shimmer: {
    animation: `${animations.shimmer} 2s infinite`,
    backgroundSize: '1000px 100%',
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0))',
  },

  bounce: {
    animation: `${animations.bounce} 2s infinite`,
  },

  rotate: {
    animation: `${animations.rotate} 1s linear infinite`,
  },
};

/**
 * Hover effect presets
 */
export const hoverEffects = {
  /**
   * Lift effect (slight raise with shadow)
   */
  lift: {
    transition: shadowTransitions.hover,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    },
  },

  /**
   * Subtle scale increase
   */
  scale: {
    transition: transitions.normal,
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },

  /**
   * Color change on hover
   */
  colorShift: {
    transition: transitions.color.default,
    '&:hover': {
      backgroundColor: 'primary.light',
    },
  },

  /**
   * Glow effect
   */
  glow: {
    transition: shadowTransitions.hover,
    '&:hover': {
      boxShadow: '0 0 24px rgba(168, 85, 247, 0.3)',
    },
  },

  /**
   * Gradient animation
   */
  gradientShift: {
    backgroundSize: '200% 200%',
    transition: 'background-position 0.5s ease',
    '&:hover': {
      backgroundPosition: '100% 100%',
    },
  },
};

/**
 * Focus state presets
 */
export const focusEffects = {
  outline: {
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: '2px',
    },
  },

  ring: {
    '&:focus-visible': {
      boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.1), 0 0 0 5px rgba(168, 85, 247, 0.3)',
    },
  },

  underline: {
    '&:focus-visible': {
      borderBottomColor: 'primary.main',
      borderBottomWidth: '2px',
    },
  },
};

/**
 * Loading skeleton animations
 */
export const skeletonAnimation = {
  animation: `${animations.shimmer} 2s infinite`,
  backgroundSize: '200% 100%',
  backgroundImage:
    'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
};

/**
 * Page transition animations
 */
export const pageTransitions = {
  enter: {
    animation: `${animations.fadeIn} 0.3s ease-in-out`,
  },

  enterFromLeft: {
    animation: `${animations.slideInRight} 0.4s ease-out`,
  },

  enterFromRight: {
    animation: `${animations.slideInLeft} 0.4s ease-out`,
  },
};

/**
 * Dialog/Modal animations
 */
export const modalTransitions = {
  enter: {
    animation: `${animations.scaleIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
  },

  enterFade: {
    animation: `${animations.fadeIn} 0.3s ease-in-out`,
  },
};

/**
 * Button interactions
 */
export const buttonInteractions = {
  default: {
    transition: transitions.fast,
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },

  withShadow: {
    transition: shadowTransitions.hover,
    '&:hover': {
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)',
    },
  },

  withGlow: {
    transition: shadowTransitions.hover,
    '&:hover': {
      boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)',
    },
  },
};

/**
 * Input field interactions
 */
export const inputInteractions = {
  base: {
    transition: transitions.color.default,
  },

  withFocus: {
    transition: shadowTransitions.focus,
    '&:focus': {
      boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.1)',
    },
  },
};
