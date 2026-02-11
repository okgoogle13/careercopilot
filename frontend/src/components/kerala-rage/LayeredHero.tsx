import React, { useEffect, useState, useRef } from 'react';
import type { ResolvedLayer } from '../../utils/heroComposer';
import type { Typography, Motion } from '../../design/hero/heroTypes';

interface LayeredHeroProps {
  layers: ResolvedLayer[];
  typography: Typography;
  motion: Motion;
  className?: string;
}

const M3_BEZIER = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const BASE_MATTE = '#1A1714';

export const LayeredHero: React.FC<LayeredHeroProps> = ({
  layers,
  typography,
  motion,
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
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Interpolate font weight based on scroll
  const interpolatedWght = Math.round(
    motion.scroll_wght_range[0] +
      (motion.scroll_wght_range[1] - motion.scroll_wght_range[0]) * scrollProgress
  );

  const typographyStyle: React.CSSProperties = {
    fontVariationSettings: `'wght' ${interpolatedWght}, 'wdth' ${typography.pressure_state.wdth}`,
    fontOpticalSizing: 'auto',
    transition: `font-variation-settings ${motion.transition_duration}ms ${M3_BEZIER}`,
  };

  return (
    <div
      ref={heroRef}
      className={`relative w-full h-screen overflow-hidden ${className}`}
      style={{ backgroundColor: BASE_MATTE }}
    >
      {/* Render layers */}
      {layers.map((layer, index) => (
        <div
          key={`layer-${index}`}
          className="absolute inset-0"
          style={{
            zIndex: layer.zIndex,
            opacity: layer.opacity,
            mixBlendMode: layer.blendMode as any,
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
      ))}

      {/* Typography overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center px-4"
        style={typographyStyle}
      >
        <h1
          className="text-6xl md:text-8xl font-bold text-white mb-4"
          style={{
            textShadow: '0 4px 16px rgba(0, 0, 0, 0.8)',
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
