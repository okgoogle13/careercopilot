import React, { useEffect, useState, useRef } from 'react';
import type { ResolvedLayer } from '../../utils/heroComposer';
import type { Typography, AnimationProfile, LayerType } from '../../design/hero/heroTypes';
import { calculatePressure } from '../../utils/typographyPressure';

interface LayeredHeroProps {
  layers: ResolvedLayer[];
  typography: Typography;
  animation?: AnimationProfile;
  zIndexMap?: Record<LayerType, number>;
  className?: string;
}

const DEFAULT_M3_BEZIER = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const BASE_MATTE = '#1A1714';

export const LayeredHero: React.FC<LayeredHeroProps> = ({
  layers,
  typography,
  animation,
  zIndexMap,
  className = '',
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

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
      className={`relative w-full h-screen overflow-hidden ${className}`}
      style={{ backgroundColor: BASE_MATTE }}
    >
      {/* Render layers */}
      {layers.map((layer, index) => {
        const zIndex = zIndexMap ? (zIndexMap[layer.type] || layer.zIndex) : layer.zIndex;
        
        // Calculate parallax if enabled
        const parallaxOffset = (animation?.parallax && layer.type !== 'substrate')
          ? (index * 50 * scrollProgress)
          : 0;

        return (
          <div
            key={`layer-${index}`}
            className="absolute inset-0"
            style={{
              zIndex,
              opacity: layer.opacity,
              mixBlendMode: layer.blendMode as any,
              transform: `translateY(${parallaxOffset}px)`,
              transition: `transform 100ms linear`,
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
        className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center px-4"
        style={typographyStyle}
      >
        <h1
          className="text-6xl md:text-8xl font-bold text-white mb-4"
          style={{
            textShadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
            transform: animation?.scroll_behavior === 'scale_expansion' 
              ? `scale(${1 + scrollProgress * 0.2})` 
              : 'none',
          }}
        >
          {typography.headline}
        </h1>
        <p
          className="text-xl md:text-2xl text-white/90"
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
          }}
        >
          {typography.supporting}
        </p>
      </div>
    </div>
  );
};
