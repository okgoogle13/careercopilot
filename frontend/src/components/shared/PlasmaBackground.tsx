import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import React, { useEffect } from 'react';

// --- Blob Configuration ---
interface BlobConfig {
  id: number;
  color: string;
  size: string;
  initialPosition: { x: string; y: string };
  animationPath: { x: number[]; y: number[] };
  duration: number;
  delay: number;
  mouseMultiplier: { x: number; y: number };
}

const BLOB_CONFIGS: BlobConfig[] = [
  {
    id: 1,
    color: '#8A9A5B', // Sage
    size: 'w-80 h-80 md:w-96 md:h-96',
    initialPosition: { x: '15%', y: '20%' },
    animationPath: { x: [0, 200, -150, 100, 0], y: [0, -120, 80, -50, 0] },
    duration: 18,
    delay: 0,
    mouseMultiplier: { x: -50, y: -50 },
  },
  {
    id: 2,
    color: '#6B4C9A', // Purple
    size: 'w-72 h-72 md:w-[22rem] md:h-[22rem]',
    initialPosition: { x: '60%', y: '15%' },
    animationPath: { x: [0, -180, 120, -80, 0], y: [0, 100, -60, 120, 0] },
    duration: 22,
    delay: 1,
    mouseMultiplier: { x: 40, y: 40 },
  },
  {
    id: 3,
    color: '#E2725B', // Terracotta
    size: 'w-64 h-64 md:w-80 md:h-80',
    initialPosition: { x: '35%', y: '55%' },
    animationPath: { x: [0, 150, -100, 50, 0], y: [0, -80, 150, -100, 0] },
    duration: 20,
    delay: 2,
    mouseMultiplier: { x: -30, y: 30 },
  },
  {
    id: 4,
    color: '#FFD700', // Gold highlight
    size: 'w-56 h-56 md:w-72 md:h-72',
    initialPosition: { x: '70%', y: '60%' },
    animationPath: { x: [0, -120, 80, -150, 0], y: [0, 60, -120, 80, 0] },
    duration: 16,
    delay: 3,
    mouseMultiplier: { x: 35, y: -35 },
  },
  {
    id: 5,
    color: '#8A9A5B', // Second Sage for more merging
    size: 'w-60 h-60 md:w-[18rem] md:h-[18rem]',
    initialPosition: { x: '25%', y: '70%' },
    animationPath: { x: [0, 100, -180, 120, 0], y: [0, -150, 60, -80, 0] },
    duration: 24,
    delay: 4,
    mouseMultiplier: { x: -25, y: -40 },
  },
];

// Spring physics for the mouse interaction
const MOUSE_SPRING_CONFIG = { damping: 25, stiffness: 120, mass: 0.5 };

interface PlasmaBlobProps {
  blob: BlobConfig;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
}

const PlasmaBlob = ({ blob, smoothX, smoothY }: PlasmaBlobProps) => {
  const x = useTransform(smoothX, (val) => val * blob.mouseMultiplier.x);
  const y = useTransform(smoothY, (val) => val * blob.mouseMultiplier.y);

  return (
    <motion.div
      style={{ x, y }}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    >
      <motion.div
        className={`absolute rounded-march ${blob.size}`}
        style={{
          left: blob.initialPosition.x,
          top: blob.initialPosition.y,
          backgroundColor: blob.color,
          opacity: 0.85,
        }}
        animate={{
          x: blob.animationPath.x,
          y: blob.animationPath.y,
          scale: [1, 1.15, 0.9, 1.1, 1],
        }}
        transition={{
          duration: blob.duration,
          delay: blob.delay,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export const PlasmaBackground = () => {
  // --- Interactive Mouse Setup ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, MOUSE_SPRING_CONFIG);
  const smoothY = useSpring(mouseY, MOUSE_SPRING_CONFIG);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalize to -1...1
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base background color */}
      <div className="absolute inset-0 bg-[#121212]" />

      {/*
                SVG Filter Definition - THE MAGIC GOOEY EFFECT
                Step A: Gaussian blur spreads out the alpha channel
                Step B: Color matrix with high contrast (18 -7) creates sharp threshold
                This makes overlapping blobs physically merge like liquid/ferrofluid
            */}
      <svg
        className="absolute w-0 h-0"
        aria-hidden="true"
      >
        <defs>
          <filter id="plasma-goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="40"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
          </filter>
        </defs>
      </svg>

      {/* Gooey Plasma Container - filter applied here for merge effect */}
      <div
        className="absolute inset-0"
        style={{ filter: 'url(#plasma-goo)' }}
      >
        {BLOB_CONFIGS.map((blob) => (
          <PlasmaBlob
            key={blob.id}
            blob={blob}
            smoothX={smoothX}
            smoothY={smoothY}
          />
        ))}
      </div>

      {/* Radial Vignette Overlay - adds depth focus */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 20%, rgba(18, 18, 18, 0.6) 60%, #121212 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle noise texture for organic feel */}
      <div
        className="absolute inset-0 z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
