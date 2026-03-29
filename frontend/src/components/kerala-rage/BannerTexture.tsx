import React from 'react';
import { cn } from '../../lib/utils';

interface BannerTextureProps {
  className?: string;
}

/**
 * BannerTexture - KeralaRage Global Texture Overlay
 * Archetype: Substrate (Film Grain / Wheat Paste)
 */
export const BannerTexture: React.FC<BannerTextureProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'grit-overlay grit-overlay--film-grain fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-multiply',
        className
      )}
    />
  );
};
