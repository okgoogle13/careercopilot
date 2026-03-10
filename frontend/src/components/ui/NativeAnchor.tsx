import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Register types for the symbolic anchors as defined in SOLIDARITY_SPEC_V5.md
 */
export type AnchorRegister =
  | 'Solidarity'
  | 'Defiance'
  | 'Revelation'
  | 'Trust'
  | 'Gravity'
  | 'Altitude';

export interface NativeAnchorProps {
  /**
   * Canonical Asset ID (e.g., KR-SOLID-031, KR-SOLID-023)
   */
  assetId: string;
  /**
   * The emotional register of the screen, controlling visual atmosphere.
   */
  register?: AnchorRegister;
  /**
   * Optional custom name or label for the asset.
   */
  name?: string;
  /**
   * Optional height/width overrides or className.
   */
  className?: string;
  /**
   * Z-index override (0-3 as per spec).
   */
  zIndex?: number;
  /**
   * If true, shows a technical "Analytical Mode" overlay (blueprint grid).
   */
  analyticalMode?: boolean;
}

/**
 * NativeAnchor Component
 *
 * Implements the "Canonical Symbolic Anchors" from the KR Solidarity spec.
 * Uses the "Stone" shape archetype and visual primitives (Halo, Grit, Grit).
 */
export const NativeAnchor: React.FC<NativeAnchorProps> = ({
  assetId,
  register = 'Solidarity',
  name,
  className = '',
  zIndex,
  analyticalMode = false,
}) => {
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Asset Mapping (Simplified for UI component logic)
  const assetPaths: Record<string, string> = {
    'KR-SOLID-031':
      '/assets/kr-solidarity/street/kr-solidarity__resistance__hero--treaty-now-poster--v1.png',
    'KR-SOLID-023':
      '/assets/kr-solidarity/portrait/kr-solidarity__resistance__hero--bhagat-singh--v1.png',
    'KR-SOLID-033':
      '/assets/kr-solidarity/symbol/kr-solidarity__cultural__symbol--kerala-elephant--v1.png',
    'KR-SOLID-013':
      '/assets/kr-solidarity/devotional/kr-solidarity__spiritual__devotional--shiva-statue-street--v1.png',
  };

  const currentAssetPath = assetPaths[assetId] || '';

  // Motion Settings: The Solidarity Spring
  const springTransition: any = {
    type: 'spring',
    stiffness: 100,
    damping: 15,
    mass: 1,
    restDelta: 0.001,
  };

  // Archetype Radii
  const stoneRadius = 'var(--sys-shape-radius-megaphoneBase)';
  const slabRadius = 'var(--sys-shape-radius-placardBase)';
  const currentRadius = analyticalMode ? slabRadius : stoneRadius;

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={springTransition}
      className={`relative group ${className}`}
      style={{ zIndex: zIndex ?? 'auto' }}
    >
      {/* Visual Overlay Tiers */}

      {/* 1. Halo Light (Z-2 focal point) for Defiance/Solidarity */}
      {(register === 'Defiance' || register === 'Solidarity') && !analyticalMode && (
        <div className="absolute inset-0 bg-ink-gold/5 blur-[80px] rounded-march scale-125 pointer-events-none transition-opacity group-hover:opacity-60" />
      )}

      {/* 2. Blueprint Grid (for Revelation/Analytical Mode) */}
      {(analyticalMode || register === 'Revelation') && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08] z-10"
          style={{
            backgroundImage:
              'url(/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-018--v1.svg)',
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* 3. The Core Media Container (The Stone) */}
      <div
        className="relative overflow-hidden shadow-elevation2"
        style={{
          borderRadius: currentRadius,
          transition: 'border-radius 0.6s var(--sys-motion-m3Expressive)',
          border: '1px solid rgba(218, 246, 179, 0.1)', // worker-ash at low opacity
        }}
      >
        {/* Subtle Screenprint Grit Overlay */}
        {!analyticalMode && (
          <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.15] mix-blend-overlay bg-[url('/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__ui--kr-ui-019--v1.svg')]" />
        )}

        {/* Asset Image */}
        <img
          src={currentAssetPath}
          alt={name || assetId}
          className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1] transition-transform duration-700 group-hover:scale-105"
        />

        {/* Bottom Label (Technical Metadata) */}
        <div className="absolute bottom-4 left-4 z-30">
          <span className="font-mono text-[9px] uppercase tracking-widest text-paper-white/30 group-hover:text-ink-gold/60 transition-colors">
            REF: {assetId} {analyticalMode ? '[DATA_LOCKED]' : ''}
          </span>
        </div>
      </div>

      {/* 4. Torn Edge Decorative (Optional for specific registers) */}
      {register === 'Solidarity' && !analyticalMode && (
        <div
          className="absolute -bottom-2 -left-2 w-12 h-12 z-40 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'url(/assets/kr-solidarity/ui-kit/svg/kr-solidarity__ui-kit__icons--wheat-paste-icon--v1.svg)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </motion.div>
  );
};
