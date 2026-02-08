/**
 * KeralaRage KrSolidarity Motion Presets
 * Framer Motion configurations for KrDark and KrDark modes
 * 
 * Usage:
 * import { KrDarkSpring, KrLightSpring, motionVariants } from '@/theme/motion-presets';
 * 
 * <motion.div
 *   initial="hidden"
 *   animate="visible"
 *   variants={motionVariants.card}
 *   transition={KrLightSpring}
 * />
 */

import { Transition, Variants } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// SPRING PHYSICS CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * KrDark Mode Spring — Viscous Breeze
 * Expressive, gentle overshoot, air resistance
 */
export const KrDarkSpring: Transition = {
    type: 'spring',
    stiffness: 500,
    damping: 27,
    mass: 1,
};

/**
 * KrDark Mode Spring — Precise Control
 * Clinical, minimal overshoot, controlled
 */
export const KrLightSpring: Transition = {
    type: 'spring',
    stiffness: 800,
    damping: 40,
    mass: 1,
};

/**
 * Elastic Spring — Pronounced Bounce
 * KrDark mode accents only
 */
export const elasticSpring: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 15,
    mass: 1,
};

// ═══════════════════════════════════════════════════════════════════════════
// EASING CURVES
// ═══════════════════════════════════════════════════════════════════════════

export const easing = {
    viscous: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    precise: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    settle: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    snap: [0.4, 0, 0.2, 1] as [number, number, number, number],
    elastic: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
};

// ═══════════════════════════════════════════════════════════════════════════
// DURATION SCALE
// ═══════════════════════════════════════════════════════════════════════════

export const duration = {
    instant: 0.1,
    fast: 0.18,
    standard: 0.28,
    moderate: 0.45,
    slow: 0.6,
    deliberate: 0.9,
};

// ═══════════════════════════════════════════════════════════════════════════
// MOTION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════

export const motionVariants = {
    /**
     * Card Hover/Lift Animation
     */
    card: {
        rest: {
            y: 0,
            scale: 1,
            boxShadow: '0 4px 24px rgba(20, 18, 16, 0.5), 0 1px 4px rgba(0, 0, 0, 0.2)',
        },
        hover: {
            y: -4,
            scale: 1.01,
            boxShadow: '0 8px 40px rgba(20, 18, 16, 0.6), 0 2px 8px rgba(0, 0, 0, 0.25)',
        },
    } as Variants,

    /**
     * Button Press Animation
     */
    button: {
        rest: {
            scale: 1,
            boxShadow: '0 2px 8px rgba(20, 18, 16, 0.3)',
        },
        hover: {
            scale: 1.02,
            boxShadow: '0 0 40px rgba(212, 168, 75, 0.15)',
        },
        press: {
            scale: 0.98,
            boxShadow: '0 2px 8px rgba(20, 18, 16, 0.4)',
        },
    } as Variants,

    /**
     * Modal/Dialog Entry
     */
    modal: {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: 20,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
        },
    } as Variants,

    /**
     * Fade In/Out
     */
    fade: {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
        },
        exit: {
            opacity: 0,
        },
    } as Variants,

    /**
     * Slide Up (Scroll Reveal)
     */
    slideUp: {
        hidden: {
            opacity: 0,
            y: 24,
        },
        visible: {
            opacity: 1,
            y: 0,
        },
    } as Variants,

    /**
     * Scale In (Chip/Badge)
     */
    scaleIn: {
        hidden: {
            opacity: 0,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            scale: 1,
        },
        exit: {
            opacity: 0,
            scale: 0.8,
        },
    } as Variants,

    /**
     * Typography Bloom (Fraunces Variable Font)
     */
    bloom: {
        rest: {
            fontVariationSettings: "'wght' 600, 'SOFT' 50, 'WONK' 1",
        },
        hover: {
            fontVariationSettings: "'wght' 750, 'SOFT' 80, 'WONK' 1",
        },
    } as Variants,
};

// ═══════════════════════════════════════════════════════════════════════════
// GESTURE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const dragConstraints = {
    card: {
        top: -50,
        bottom: 50,
        left: -50,
        right: 50,
    },
    modal: {
        top: 0,
        bottom: 200,
        left: 0,
        right: 0,
    },
};

export const dragElastic = {
    KrDark: 0.2, // More elastic in KrDark mode
    KrLight: 0.1, // Less elastic in KrDark mode
};

// ═══════════════════════════════════════════════════════════════════════════
// ACCESSIBILITY: REDUCED MOTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get transition based on reduced motion preference
 */
export const getTransition = (
    mode: 'KrDark' | 'KrLight' = 'KrDark'
): Transition => {
    if (prefersReducedMotion()) {
        return {
            duration: 0.05,
            ease: 'linear',
        };
    }
    return mode === 'KrDark' ? KrLightSpring : KrLightSpring;
};

/**
 * Get variants with reduced motion support
 */
export const getVariants = (variants: Variants): Variants => {
    if (prefersReducedMotion()) {
        // Disable transforms, keep only opacity
        return Object.entries(variants).reduce((acc, [key, value]) => {
            const opacity =
                typeof value === 'object' && value !== null && 'opacity' in value
                    ? (value as { opacity?: number }).opacity ?? 1
                    : 1;
            acc[key] = { opacity };
            return acc;
        }, {} as Variants);
    }
    return variants;
};

// ═══════════════════════════════════════════════════════════════════════════
// STAGGER CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const stagger = {
    fast: 0.05,
    standard: 0.1,
    slow: 0.15,
};

/**
 * Stagger children animation
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: stagger.standard,
            delayChildren: 0.1,
        },
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DEFAULT PRESET
// ═══════════════════════════════════════════════════════════════════════════

export default {
    spring: {
        KrDark: KrDarkSpring,
        KrLight: KrLightSpring,
        elastic: elasticSpring,
    },
    easing,
    duration,
    variants: motionVariants,
    drag: {
        constraints: dragConstraints,
        elastic: dragElastic,
    },
    stagger,
    accessibility: {
        prefersReducedMotion,
        getTransition,
        getVariants,
    },
};