import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AuroraHeaderProps {
    title: string;
    tag?: string;
    wittySubtitle?: string;
}

/**
<<<<<<< HEAD
 * AuroraHeader -  Parametric Header
 * 
 * Features:
 * - Tri-color gradient text (Wattle Gold → Waratah Crimson → Flannel Flower)
=======
 * AuroraHeader - KeralaRage KrSolidarity Parametric Header
 * 
 * Features:
 * - Tri-color gradient text (Ink Gold → Solidarity Red → Concrete Grey)
>>>>>>> restoration-KR-Rage-Figma-v2.0
 * - Shimmer animation on hover
 * - Variable font axis animation (Fraunces 'SOFT' and 'WONK')
 * - Optional tag and witty subtitle
 * 
 * Typography: Fraunces (The Bloom) with parametric axes
 * 
 * @component
 * @example
 * <AuroraHeader 
 *   tag="Dashboard" 
 *   title="Welcome Back" 
 *   wittySubtitle="Let's grow your career"
 * />
 */
export const AuroraHeader: React.FC<AuroraHeaderProps> = ({
    title,
    tag,
    wittySubtitle
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <header className="mb-8 space-y-2">
            {/* Tag (Optional) */}
            {tag && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="font-mono text-xs uppercase tracking-widest"
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
<<<<<<< HEAD
                        color: '#A8A097', // Flannel Flower
=======
                        color: 'var(--sys-color-worker-ash-base)', // Worker Ash (replaces Concrete Grey)
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    }}
                >
                    {tag}
                </motion.div>
            )}

            {/* Title with Gradient */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="relative inline-block font-extrabold text-5xl md:text-6xl lg:text-7xl cursor-default"
                style={{
                    fontFamily: "'Fraunces', serif",
                }}
            >
                <motion.span
                    className="bg-clip-text text-transparent"
                    style={{
<<<<<<< HEAD
                        backgroundImage: 'linear-gradient(135deg, #D4A84B 0%, #C45C4B 50%, #A8A097 100%)',
                        // Wattle Gold → Waratah Crimson → Flannel Flower
=======
                        backgroundImage: 'linear-gradient(135deg, var(--sys-color-inkGold-base) 0%, var(--sys-color-solidarityRed-base) 50%, var(--sys-color-worker-ash-base) 100%)',
                        // Ink Gold → Solidarity Red → Worker Ash
>>>>>>> restoration-KR-Rage-Figma-v2.0
                        backgroundSize: '200% 200%',
                    }}
                    animate={{
                        backgroundPosition: isHovered ? ['0% 50%', '100% 50%'] : '0% 50%',
                        fontVariationSettings: isHovered
                            ? "'wght' 750, 'SOFT' 80, 'WONK' 1"
                            : "'wght' 700, 'SOFT' 50, 'WONK' 1",
                    }}
                    transition={{
                        backgroundPosition: {
                            duration: 2,
                            ease: 'easeInOut',
                            repeat: isHovered ? Infinity : 0,
                            repeatType: 'reverse',
                        },
                        fontVariationSettings: {
                            duration: 0.28,
                            ease: [0.34, 1.56, 0.64, 1], // Viscous Breeze
                        },
                    }}
                >
                    {title}
                </motion.span>
            </motion.h1>

            {/* Witty Subtitle (Optional) */}
            {wittySubtitle && (
                <motion.p
                    initial={{ opacity: 0, rotate: -2 }}
                    animate={{ opacity: 1, rotate: -1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg md:text-xl italic"
                    style={{
                        fontFamily: "'Fraunces', serif",
                        fontVariationSettings: "'wght' 400, 'SOFT' 100, 'WONK' 1",
<<<<<<< HEAD
                        color: '#C45C4B', // Waratah Crimson
=======
                        color: 'var(--sys-color-solidarityRed-base)', // Solidarity Red
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    }}
                >
                    {wittySubtitle}
                </motion.p>
            )}
        </header>
    );
};

<<<<<<< HEAD
export default AuroraHeader;
=======
export default AuroraHeader;
>>>>>>> restoration-KR-Rage-Figma-v2.0
