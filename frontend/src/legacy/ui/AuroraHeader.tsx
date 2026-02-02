import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMode } from '@/hooks/use-mode';

interface AuroraHeaderProps {
    title: string;
    tag?: string;
    wittySubtitle?: string;
}

/**
 * AuroraHeader - Northcote Curio Parametric Header
 * 
 * Features:
 * - Tri-color gradient text (Wattle Gold → Waratah Crimson → Flannel Flower)
 * - Shimmer animation on hover
 * - Variable font axis animation (Fraunces 'SOFT' and 'WONK')
 * - Optional tag and witty subtitle
 * - Dual-mode support (Gallery/Laboratory)
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
    const { mode } = useMode();

    return (
        <header className="mb-8 space-y-2">
            {/* Tag (Optional) */}
            {tag && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-xs uppercase tracking-widest font-annotation text-secondary-flannel-flower"
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
                className="relative inline-block font-extrabold text-5xl md:text-6xl lg:text-7xl cursor-default font-bloom"
            >
                <motion.span
                    className="bg-clip-text text-transparent"
                    style={{
                        backgroundImage: mode === 'gallery'
                            ? 'linear-gradient(135deg, var(--color-primary-wattle-gold) 0%, var(--color-tertiary-waratah-crimson) 50%, var(--color-secondary-flannel-flower) 100%)'
                            : 'linear-gradient(135deg, var(--color-primary-wattle-gold) 0%, var(--color-status-alert) 50%, var(--color-status-neutral) 100%)',
                        backgroundSize: '200% 200%',
                    }}
                    animate={{
                        backgroundPosition: isHovered ? ['0% 50%', '100% 50%'] : '0% 50%',
                        fontVariationSettings: isHovered
                            ? (mode === 'gallery' ? "'wght' 750, 'SOFT' 80, 'WONK' 1" : "'wght' 600, 'SOFT' 30, 'WONK' 0")
                            : (mode === 'gallery' ? "'wght' 700, 'SOFT' 50, 'WONK' 1" : "'wght' 500, 'SOFT' 20, 'WONK' 0"),
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
                    animate={{ opacity: 1, rotate: mode === 'gallery' ? -1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg md:text-xl italic font-bloom text-tertiary-waratah-crimson"
                    style={{
                        fontVariationSettings: mode === 'gallery'
                            ? "'wght' 400, 'SOFT' 100, 'WONK' 1"
                            : "'wght' 400, 'SOFT' 30, 'WONK' 0",
                    }}
                >
                    {wittySubtitle}
                </motion.p>
            )}
        </header>
    );
};

export default AuroraHeader;
