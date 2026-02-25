import React, { useEffect, useState, useRef, useMemo } from 'react';
import type { ResolvedLayer } from '../../utils/heroComposer';
import type { Typography, AnimationProfile, LayerType, ColorBleedConfig, KineticLayerConfig } from '../../design/hero/heroTypes';
import { calculatePressure } from '../../utils/typographyPressure';

interface LayeredHeroProps {
  layers: ResolvedLayer[];
  typography: Typography;
  animation?: AnimationProfile;
  zIndexMap?: Record<LayerType, number>;
  className?: string;
  colorBleed?: ColorBleedConfig;
  kinetic?: KineticLayerConfig;
}

const DEFAULT_M3_BEZIER = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const BASE_MATTE = 'var(--sys-color-charcoalBackground-base)';

/** Map substrate semantic weight to CSS color variable for color bleed */
const BLEED_COLOR_MAP: Record<string, string> = {
  'grounded-grit': 'var(--sys-color-solidaritySmokeOrange-steps-3)',
  'industrial-decay': 'var(--sys-color-solidarityRed-steps-4)',
  'heritage-urban': 'var(--sys-color-stencilYellow-steps-3)',
  'futuristic-contemplative': 'var(--sys-color-labWrenMetalBlue-steps-3)',
};

export const LayeredHero: React.FC<LayeredHeroProps> = ({
  layers,
  typography,
  animation,
  zIndexMap,
  className = '',
  colorBleed,
  kinetic,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Resolve color bleed CSS variable from substrate layer semantic weight
  const bleedStyle = useMemo(() => {
    if (!colorBleed?.enabled) return {};
    const sourceLayer = layers.find(l => l.type === colorBleed.source_layer);
    const semanticWeight = (sourceLayer as any)?.semanticWeight;
    const bleedColor = BLEED_COLOR_MAP[semanticWeight] ?? 'var(--sys-color-solidarityRed-steps-4)';
    return {
      '--bleed-color': bleedColor,
      '--bleed-opacity': String(colorBleed.opacity),
    } as React.CSSProperties;
  }, [colorBleed, layers]);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementHeight = rect.height;
      
      // Calculate progress from 0 to 1 as element scrolls out of view
      const progress = Math.max(
        0,
        Math.min(1, 1 - (rect.bottom / (viewportHeight + elementHeight)))
      );
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use dynamic pressure calculation if profile exists, else fallback to legacy
  const pressure = calculatePressure(scrollProgress, typography.pressure_profile);
  
  const interpolatedWght = typography.pressure_profile 
    ? pressure.weight 
    : Math.round(300 + (500 * scrollProgress)); // Legacy fallback

  const interpolatedWdth = typography.pressure_profile
    ? pressure.tracking
    : 75; // Legacy fallback

  const bezier = animation?.bezier 
    ? `cubic-bezier(${animation.bezier.join(',')})` 
    : DEFAULT_M3_BEZIER;

  const typographyStyle: React.CSSProperties = {
    fontVariationSettings: `'wght' ${interpolatedWght}, 'wdth' ${interpolatedWdth}`,
    fontOpticalSizing: 'auto',
    transition: `font-variation-settings ${animation?.transition_duration || 400}ms ${bezier}`,
  };

  return (
    <div
      ref={heroRef}
      className={`relative w-full h-screen overflow-hidden ${colorBleed?.enabled ? 'hero-color-bleed' : ''} ${className}`}
      style={{ backgroundColor: BASE_MATTE, ...bleedStyle }}
    >
      {/* Render layers */}
      {layers.map((layer, index) => {
        const zIndex = zIndexMap ? (zIndexMap[layer.type] || layer.zIndex) : layer.zIndex;

        // Calculate parallax offset — kinetic layers move at multiplied speed
        const isKineticTarget = kinetic?.enabled && layer.type === 'atmospheric';
        const speedMultiplier = isKineticTarget ? (kinetic.speed_multiplier ?? 1) : 1;
        const parallaxOffset = (animation?.parallax && layer.type !== 'substrate')
          ? (index * 50 * scrollProgress * speedMultiplier)
          : 0;

        return (
          <div
            key={`layer-${index}`}
            className={`absolute inset-0 ${isKineticTarget ? 'kinetic-layer' : ''}`}
            style={{
              zIndex,
              opacity: layer.opacity,
              mixBlendMode: layer.blendMode as any,
              transform: `translateY(${parallaxOffset}px)`,
              transition: isKineticTarget ? 'transform 80ms linear' : 'transform 100ms linear',
            }}
          >
            <img
              src={layer.assetUrl}
              alt=""
              className={`w-full h-full object-${
                layer.position === 'cover' ? 'cover' : 'contain'
              }`}
              style={{
                objectPosition:
                  layer.position === 'cover'
                    ? 'center'
                    : layer.position,
              }}
            />
          </div>
        );
      })}

      {/* Typography overlay */}
      <div
        className="hero-typography absolute inset-0 flex flex-col items-center justify-center z-50 text-center px-4"
        style={typographyStyle}
      >
        <h1
          className={`text-6xl md:text-8xl font-bold mb-4 leading-tight ${
            (typography as any).font_family === 'nabla' ? 'font-nabla' : 'font-proclamation'
          }`}
          style={{
            color: (typography as any).font_family === 'nabla' ? 'inherit' : 'var(--sys-color-stencilYellow-base)',
            textShadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
            transform: animation?.scroll_behavior === 'scale_expansion' 
              ? `scale(${1 + scrollProgress * 0.2})` 
              : 'none',
          }}
        >
          {typography.headline}
        </h1>
        <p
          className="text-xl md:text-2xl font-body leading-relaxed max-w-2xl"
          style={{
            color: 'var(--sys-color-worker-ash-base)',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
          }}
        >
          {typography.supporting}
        </p>
      </div>
    </div>
  );
};
