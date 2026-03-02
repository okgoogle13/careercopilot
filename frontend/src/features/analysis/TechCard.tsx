import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMode } from '@/hooks/use-mode';

interface TechCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    tags?: string[];
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

const TechCard = React.forwardRef<HTMLDivElement, TechCardProps>(
    ({ className, title, description, icon, tags, level, ...props }, ref) => {
        const { mode } = useMode();
        const [isHovered, setIsHovered] = React.useState(false);
        const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        };

        const levelColors = {
<<<<<<< HEAD
            beginner: mode === 'gallery' ? 'text-status-gallery-ghost-gum' : 'text-status-laboratory-clinical-sage',
            intermediate: mode === 'gallery' ? 'text-wattle-gold' : 'text-wattle-gold',
            advanced: mode === 'gallery' ? 'text-status-gallery-banksia-orange' : 'text-status-gallery-banksia-orange',
            expert: mode === 'gallery' ? 'text-tertiary-waratah-crimson' : 'text-status-laboratory-clinical-alert',
=======
            beginner: mode === 'KrDark' ? 'text-status-KrDark-solidarity-green' : 'text-status-KrDark-clinical-sage',
            intermediate: mode === 'KrDark' ? 'text-ink-gold' : 'text-ink-gold',
            advanced: mode === 'KrDark' ? 'text-status-KrDark-KrFlower-orange' : 'text-status-KrDark-KrFlower-orange',
            expert: mode === 'KrDark' ? 'text-tertiary-solidarity-red' : 'text-status-KrDark-clinical-alert',
>>>>>>> restoration-KR-Rage-Figma-v2.0
        };

        // Styles derived from M3Card glass variant logic
        const containerClasses = cn(
            'relative overflow-hidden transition-all duration-300 border backdrop-blur-md',
<<<<<<< HEAD
            mode === 'gallery'
                ? 'bg-surface-gallery-glass-medium border-white/10 text-on-surface-gallery-parchment'
                : 'bg-surface-laboratory-glass-medium border-white/5 text-on-surface-laboratory-parchment',
=======
            mode === 'KrDark'
                ? 'bg-surface-KrDark-glass-medium border-white/10 text-on-surface-KrDark-paper-white'
                : 'bg-surface-KrDark-glass-medium border-white/5 text-on-surface-KrDark-paper-white',
>>>>>>> restoration-KR-Rage-Figma-v2.0
            className
        );

        return (
            <motion.div
                ref={ref}
                className={containerClasses}
                style={{
<<<<<<< HEAD
                    borderRadius: mode === 'gallery' ? 'var(--radius-stone)' : '8px'
=======
                    borderRadius: mode === 'KrDark' ? 'var(--radius-stone)' : '8px'
>>>>>>> restoration-KR-Rage-Figma-v2.0
                }}
                whileHover={{
                    y: -4,
                    transition: { type: "spring", stiffness: 500, damping: 27, mass: 1 }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
                {...props}
            >
                {/* Glare effect on hover */}
<<<<<<< HEAD
                {isHovered && mode === 'gallery' && (
=======
                {isHovered && mode === 'KrDark' && (
>>>>>>> restoration-KR-Rage-Figma-v2.0
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 168, 75, 0.15), transparent 70%)`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}

                <div className="relative z-10 w-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {icon && (
                                <motion.div
<<<<<<< HEAD
                                    className="text-wattle-gold"
=======
                                    className="text-ink-gold"
>>>>>>> restoration-KR-Rage-Figma-v2.0
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                >
                                    {icon}
                                </motion.div>
                            )}
                            <h3 className={cn(
                                "font-semibold",
<<<<<<< HEAD
                                mode === 'gallery' ? 'font-bloom text-xl' : 'font-field-note text-lg'
=======
                                mode === 'KrDark' ? 'font-bloom text-xl' : 'font-field-note text-lg'
>>>>>>> restoration-KR-Rage-Figma-v2.0
                            )}>
                                {title}
                            </h3>
                        </div>
                        {level && (
                            <span className={cn(
                                "text-xs uppercase tracking-wider font-annotation",
                                levelColors[level]
                            )}>
                                {level}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {description && (
<<<<<<< HEAD
                        <p className="text-sm text-secondary-flannel-flower mb-4 leading-relaxed">
=======
                        <p className="text-sm text-secondary-concrete-grey mb-4 leading-relaxed">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                            {description}
                        </p>
                    )}

                    {/* Tags */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <motion.span
                                    key={index}
                                    className={cn(
                                        "px-2 py-1 text-xs font-annotation uppercase tracking-wider",
<<<<<<< HEAD
                                        mode === 'gallery'
                                            ? 'bg-surface-gallery-eucalypt-smoke-high border border-glassmorphism-gallery-border'
                                            : 'bg-surface-laboratory-slate-smoke-high border border-glassmorphism-laboratory-border'
                                    )}
                                    style={{
                                        borderRadius: mode === 'gallery' ? 'var(--radius-seed)' : '2px'
=======
                                        mode === 'KrDark'
                                            ? 'bg-surface-KrDark-concrete-grey-high border border-KrScreenprint-KrDark-border'
                                            : 'bg-surface-KrDark-slate-smoke-high border border-KrScreenprint-KrDark-border'
                                    )}
                                    style={{
                                        borderRadius: mode === 'KrDark' ? 'var(--radius-seed)' : '2px'
>>>>>>> restoration-KR-Rage-Figma-v2.0
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }
);
TechCard.displayName = 'TechCard';

export { TechCard };
