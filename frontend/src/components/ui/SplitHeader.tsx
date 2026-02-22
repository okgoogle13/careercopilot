import React from 'react';
import { motion } from 'framer-motion';

interface SplitHeaderProps {
    trunkText: string;
    vineText: string;
    vineRotation?: number;
    vinePosition?: 'top' | 'bottom' | 'overlay';
    className?: string;
}

export const SplitHeader: React.FC<SplitHeaderProps> = ({
    trunkText,
    vineText,
    vineRotation = 4,
    vinePosition = 'overlay',
    className = '',
}) => {
    const getVinePositionStyles = () => {
        switch (vinePosition) {
            case 'top':
                return 'top-0 left-0 -translate-y-1/2';
            case 'bottom':
                return 'bottom-0 left-0 translate-y-1/2';
            case 'overlay':
            default:
                return 'top-1/2 left-1/4 -translate-y-1/2';
        }
    };

    return (
        <div className={`relative ${className}`}>
            {/* The Proclamation (KrSerifBold) - Structural Anchor */}
            <motion.h1
                className="relative z-0 text-6xl font-black uppercase tracking-tight text-white md:text-7xl lg:text-8xl"
                style={{
                    fontFamily: "'KrSerifBold', 'Playfair Display', serif",
                    fontStretch: 'condensed',
                    letterSpacing: '-0.03em',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
                {trunkText}
            </motion.h1>

            {/* The Bloom (Fraunces) - Wild Growth */}
            <motion.span
                className={`absolute z-10 text-4xl font-medium md:text-5xl lg:text-6xl ${getVinePositionStyles()}`}
                style={{
                    fontFamily: "'Fraunces', serif",
                    fontVariationSettings: "'wght' 600, 'SOFT' 50, 'WONK' 1",
                    color: 'var(--sys-color-kr-ink-gold)', // Ink Gold
                    transform: `rotate(${vineRotation}deg)`,
                }}
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: vineRotation }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            >
                {vineText}
            </motion.span>
        </div>
    );
};

export default SplitHeader;