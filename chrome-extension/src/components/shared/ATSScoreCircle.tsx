import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ATSScoreCircleProps {
    score: number;
    size?: number;
    animated?: boolean;
    className?: string;
}

export const ATSScoreCircle = ({
    score,
    size = 120,
    animated = true,
    className = '',
}: ATSScoreCircleProps) => {
    const [displayScore, setDisplayScore] = useState(0);

    // Animate the score counting up
    useEffect(() => {
        if (!animated) {
            setDisplayScore(score);
            return;
        }

        let startTime: number;
        const duration = 1500; // 1.5 seconds

        const animateScore = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuad = (t: number) => t * (2 - t);
            const easedProgress = easeOutQuad(progress);

            setDisplayScore(Math.round(score * easedProgress));

            if (progress < 1) {
                requestAnimationFrame(animateScore);
            }
        };

        requestAnimationFrame(animateScore);
    }, [score, animated]);

    const strokeWidth = size * 0.08;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (displayScore / 100) * circumference;

    // Color based on score
    const getColor = () => {
        if (score >= 80) return { stroke: '#10b981', glow: '#10b98140', text: 'text-green-500' };
        if (score >= 60) return { stroke: '#f59e0b', glow: '#f59e0b40', text: 'text-yellow-500' };
        return { stroke: '#ef4444', glow: '#ef444440', text: 'text-red-500' };
    };

    const { stroke, glow, text } = getColor();

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />

                {/* Animated progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={animated ? circumference : offset}
                    strokeLinecap="round"
                    animate={{
                        strokeDashoffset: offset,
                    }}
                    transition={{
                        duration: 1.5,
                        ease: [0.4, 0, 0.2, 1],
                    }}
                    style={{
                        filter: `drop-shadow(0 0 8px ${glow})`,
                    }}
                />

                {/* Glow effect */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={stroke}
                    strokeWidth={strokeWidth + 2}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={animated ? circumference : offset}
                    strokeLinecap="round"
                    className="opacity-30 blur-sm"
                    animate={{
                        strokeDashoffset: offset,
                    }}
                    transition={{
                        duration: 1.5,
                        ease: [0.4, 0, 0.2, 1],
                    }}
                />
            </svg>

            {/* Score text overlay */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="text-center">
                    <div className={`font-bold ${text}`} style={{ fontSize: size * 0.25 }}>
                        {displayScore}%
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-1">ATS Match</div>
                </div>
            </motion.div>
        </div>
    );
};
