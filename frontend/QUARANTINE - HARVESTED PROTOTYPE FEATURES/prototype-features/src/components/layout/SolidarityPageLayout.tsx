import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export interface SolidarityPageLayoutProps {
  heroNode: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SolidarityPageLayout({
  heroNode,
  children,
  className = '',
}: SolidarityPageLayoutProps) {
  const { scrollY } = useScroll();

  // Subtle parallax effect: moves down 1px for every 2px scrolled
  const y = useTransform(scrollY, [0, 1000], [0, 500]);

  // Dim the hero asset opacity down to 0% as the user scrolls down
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className={`relative min-h-screen w-full ${className}`}>
      {/* Absolute inset-0 -z-10 container logic */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 -z-10 pointer-events-none h-[100vh] overflow-hidden"
      >
        <div
          className="w-full h-full"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          }}
        >
          {heroNode}
        </div>
      </motion.div>

      {/* Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
