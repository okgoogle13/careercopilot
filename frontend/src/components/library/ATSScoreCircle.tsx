import { motion } from 'motion/react';

interface ATSScoreCircleProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  color_scheme?: 'success' | 'warning' | 'danger';
  animated?: boolean;
}

export function ATSScoreCircle({
  score,
  size = 'medium',
  color_scheme,
  animated = true,
}: ATSScoreCircleProps) {
  const sizeConfig = {
    small: { width: 60, height: 60, strokeWidth: 4, fontSize: 'text-sm' },
    medium: { width: 80, height: 80, strokeWidth: 6, fontSize: 'text-lg' },
    large: { width: 120, height: 120, strokeWidth: 8, fontSize: 'text-2xl' },
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Auto-determine color scheme based on score if not provided
  const getColorScheme = () => {
    if (color_scheme) return color_scheme;
    if (score >= 85) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  const scheme = getColorScheme();

  const colorConfig = {
    success: {
      stroke: 'stroke-accent-green',
      text: 'text-accent-green',
      glow: 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]',
    },
    warning: {
      stroke: 'stroke-accent-orange',
      text: 'text-accent-orange',
      glow: 'drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]',
    },
    danger: {
      stroke: 'stroke-accent-red',
      text: 'text-accent-red',
      glow: 'drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]',
    },
  };

  const colors = colorConfig[scheme];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={config.width} height={config.height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          fill="none"
          className="text-surface-section opacity-30"
        />

        {/* Progress circle */}
        <motion.circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={`${colors.stroke} ${colors.glow}`}
          style={{
            strokeDasharray,
          }}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`font-bold ${config.fontSize} ${colors.text}`}
          initial={animated ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className={`text-xs text-content-secondary ${size === 'small' ? 'hidden' : ''}`}>
          ATS Score
        </span>
      </div>

      {/* Pulse animation for high scores */}
      {score >= 90 && (
        <motion.div
          className={`absolute inset-0 rounded-full border-2 ${colors.stroke.replace('stroke-', 'border-')} opacity-30`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
}
