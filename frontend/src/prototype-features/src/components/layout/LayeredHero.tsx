/* eslint-disable */
import React from 'react';
import { motion } from 'motion/react';

export interface LayeredHeroProps {
  imageUrl: string;
  altText?: string;
}

export function LayeredHero({ imageUrl, altText = 'Hero Background' }: LayeredHeroProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.img
        src={imageUrl}
        alt={altText}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      {/* Optional: Add a subtle overlay to ensure text readability if needed */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{ background: 'var(--sys-color-charcoalBackground-base)' }}
      />
    </div>
  );
}
