import React, { useEffect, useState, useRef, useMemo } from 'react';
import type { ResolvedLayer } from '../../lib/composeHero';
import type {
  Typography,
  AnimationProfile,
  LayerType,
  ColorBleedConfig,
  KineticLayerConfig,
} from '../../design/hero/heroTypes';
import { calculatePressure } from '../../utils/typographyPressure';
import type { SafeZones, RenderHints, ResponsiveNumber } from '../../design/hero/heroTypes';

interface LayeredHeroProps {
  layers: ResolvedLayer[];
  typography: Typography;
  animation?: AnimationProfile;
  zIndexMap?: Record<LayerType, number>;
  className?: string;
  colorBleed?: ColorBleedConfig;
  kinetic?: KineticLayerConfig;
  safeZones?: SafeZones;
  renderHints?: RenderHints;
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
  safeZones,
  renderHints,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const device = useMemo<keyof ResponsiveNumber>(() => {
    if (windowSize.width < 768) return 'mobile';
    if (windowSize.width < 1024) return 'tablet';
    return 'desktop';
  }, [windowSize.width]);

  // Resolve color bleed CSS variable from substrate layer semantic weight
  const bleedStyle = useMemo(() => {
    if (!colorBleed?.enabled) return {};
    const sourceLayer = layers.find((l) => l.type === colorBleed.source_layer);
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
      const progress = Math.max(0, Math.min(1, 1 - rect.bottom / (viewportHeight + elementHeight)));

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
    : Math.round(300 + 500 * scrollProgress); // v6.0 scrollPressure ramp: 300 -> 800

  const interpolatedWdth = typography.pressure_profile ? pressure.tracking : 100; // v6.0 baseline width

  const animLegacy = animation as any;
  const bezier = animLegacy?.bezier
    ? `cubic-bezier(${animLegacy.bezier.join(',')})`
    : DEFAULT_M3_BEZIER;

  // Typography positioning based on Safe Zones
  const typographyContainerStyle = useMemo<React.CSSProperties>(() => {
    if (!safeZones?.text_left) return { alignItems: 'center', justifyContent: 'center' };
    const { x, y, w, h } = safeZones.text_left;
    return {
      position: 'absolute',
      left: `${x * 100}%`,
      top: `${y * 100}%`,
      width: `${w * 100}%`,
      height: `${h * 100}%`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      textAlign: 'left',
    };
  }, [safeZones]);

  const typographyStyle: React.CSSProperties = {
    fontVariationSettings: `'wght' ${interpolatedWght}, 'wdth' ${interpolatedWdth}`,
    fontOpticalSizing: 'auto',
    transition: `font-variation-settings ${animLegacy?.transition_duration || 400}ms ${bezier}`,
  };

  return (
    <div
      ref={heroRef}
      className={`relative w-full h-screen overflow-hidden ${colorBleed?.enabled ? 'hero-color-bleed' : ''} ${className}`}
      style={{ backgroundColor: BASE_MATTE, ...bleedStyle }}
    >
      {/* 1. Rendering Layers */}
      {layers.map((layer, index) => {
        const zIndex = zIndexMap ? zIndexMap[layer.type] || layer.zIndex : layer.zIndex;

        // Calculate parallax offset
        const isKineticTarget = kinetic?.enabled && layer.type === 'atmospheric';
        const speedMultiplier = isKineticTarget ? (kinetic.speed_multiplier ?? 1) : 1;

        let parallaxOffset = 0;
        if (animLegacy?.parallax && layer.type !== 'substrate') {
          parallaxOffset = index * 50 * scrollProgress * speedMultiplier;
        }

        // Apply v3.1 Placement logic
        const placementStyle: React.CSSProperties = {};
        if (layer.placement) {
          const { scale, translate, objectFit, anchor } = layer.placement;
          const s = scale[device];
          const t = translate[device];

          placementStyle.objectFit = objectFit;
          placementStyle.transformOrigin = anchor;
          placementStyle.transform = `translate(${t.x}%, ${t.y + parallaxOffset}px) scale(${s})`;
        } else {
          placementStyle.transform = `translateY(${parallaxOffset}px)`;
        }

        return (
          <div
            key={`layer-${index}`}
            className={`absolute inset-0 ${isKineticTarget ? 'kinetic-layer' : ''}`}
            style={{
              zIndex,
              opacity: layer.opacity,
              mixBlendMode: layer.blendMode as any,
              transition: isKineticTarget ? 'transform 80ms linear' : 'transform 100ms linear',
              ...placementStyle,
            }}
          >
            <img
              src={layer.assetUrl}
              alt=""
              className="w-full h-full"
              style={{
                objectFit:
                  (layer.placement?.objectFit as any) ||
                  (layer.position === 'cover' ? 'cover' : 'contain'),
                objectPosition: layer.position === 'cover' ? 'center' : layer.position,
              }}
            />
          </div>
        );
      })}

      {/* 2. Global Render Hints: Scrim */}
      {renderHints?.scrim?.enabled && (
        <div
          className="absolute inset-0 z-[45] pointer-events-none"
          style={{
            background: `linear-gradient(to right, rgba(0,0,0,${renderHints.scrim.opacity}) 0%, transparent 100%)`,
            mixBlendMode: renderHints.scrim.blend_mode as any,
          }}
        />
      )}

      {/* 3. Global Render Hints: Grain */}
      {renderHints?.grain_overlay_svg && (
        <div
          className="absolute inset-0 z-[48] pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url(/assets/kr-solidarity/ui-kit/svg/${renderHints.grain_overlay_svg}.svg)`,
            backgroundRepeat: 'repeat',
          }}
        />
      )}

      {/* 4. Typography overlay with Safe Zone support */}
      <div
        className={`hero-typography z-50 px-4 ${!safeZones?.text_left ? 'absolute inset-0 flex flex-col items-center justify-center text-center' : ''}`}
        style={typographyContainerStyle}
      >
        <div style={typographyStyle}>
          <h1
            className={`text-6xl md:text-8xl font-bold mb-4 leading-tight ${
              (typography as any).font_family === 'nabla' ? 'font-nabla' : 'font-proclamation'
            }`}
            style={{
              color:
                (typography as any).font_family === 'nabla'
                  ? 'inherit'
                  : 'var(--sys-color-stencilYellow-base)',
              textShadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
              transform:
                animLegacy?.scroll_behavior === 'scale_expansion'
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
    </div>
  );
};
