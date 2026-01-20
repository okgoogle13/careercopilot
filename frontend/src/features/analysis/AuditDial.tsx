import React from 'react';
import { motion } from 'framer-motion';

interface AuditDialProps {
    score: number;
    isGateOpen: boolean;
    starDensity?: number;
    isLoading?: boolean;
}

export const AuditDial: React.FC<AuditDialProps> = ({
    score,
    isGateOpen,
    starDensity = 0,
    isLoading = false,
}) => {
    // Determine visual state based on DOC-004 specs
    const getStateColor = () => {
        if (isLoading) return 'plasma'; // Plasma Pulse
        if (isGateOpen && score >= 85) return 'sage'; // Sage Glow
        return 'terracotta'; // Terracotta Failure
    };

    const stateColor = getStateColor();

    const colorMap = {
        sage: '#B4D8AE',
        terracotta: '#E09F7D',
        plasma: '#F0C419',
    };

    const currentColor = colorMap[stateColor as keyof typeof colorMap];

    return (
        <div
            className="relative flex items-center justify-center rounded-tech bg-surface-container p-8"
            data-testid="audit-dial"
        >
            {/* Outer Ring */}
            <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 200 200">
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E09F7D" />
                        <stop offset="50%" stopColor="#F0C419" />
                        <stop offset="100%" stopColor="#B4D8AE" />
                    </linearGradient>
                </defs>

                {/* Background Circle */}
                <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#1E1E1E"
                    strokeWidth="12"
                />

                {/* Progress Arc */}
                <motion.circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={isLoading ? 'url(#scoreGradient)' : currentColor}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 502.65} 502.65`}
                    transform="rotate(-90 100 100)"
                    initial={{ strokeDasharray: '0 502.65' }}
                    animate={{
                        strokeDasharray: isLoading
                            ? ['0 502.65', '502.65 502.65', '0 502.65']
                            : `${(score / 100) * 502.65} 502.65`,
                        rotate: isLoading ? [0, 360] : 0,
                    }}
                    transition={{
                        duration: isLoading ? 2 : 0.8,
                        repeat: isLoading ? Infinity : 0,
                        ease: 'easeInOut',
                    }}
                    style={{
                        filter: isGateOpen ? `drop-shadow(0 0 12px ${currentColor})` : 'none',
                    }}
                />
            </svg>

            {/* Center Score Display */}
            <div className="z-10 flex flex-col items-center" data-testid="score-gauge-value">
                <motion.span
                    className="font-mono text-6xl font-thin text-white"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {Math.round(score)}
                </motion.span>
                <span className="font-leaf text-sm uppercase tracking-wide text-white/60">
                    {isLoading ? 'Calculating...' : isGateOpen ? 'Pass' : 'Review'}
                </span>
            </div>

            {/* Confetti Burst Effect (when gate opens) */}
            {isGateOpen && score >= 85 && (
                <motion.div
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5 }}
                >
                    {/* Confetti particles would go here */}
                </motion.div>
            )}
        </div>
    );
};

export default AuditDial;
