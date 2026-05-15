import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMode } from '@/hooks/use-mode';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

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
      beginner:
        mode === 'KrDark'
          ? 'text-[var(--sys-color-kr-activistSmokeGreen-base)]'
          : 'text-[var(--sys-color-kr-activistSmokeGreen-base)]',
      intermediate: 'text-[var(--sys-color-inkGold-base)]',
      advanced:
        mode === 'KrDark'
          ? 'text-[var(--sys-color-solidaritySmokeOrange-base)]'
          : 'text-[var(--sys-color-solidaritySmokeOrange-base)]',
      expert:
        mode === 'KrDark'
          ? 'text-[var(--sys-color-solidarityRed-base)]'
          : 'text-[var(--sys-color-kr-charcoalRed-base)]',
    };

    // Styles derived from glass variant logic
    const containerClasses = cn(
      'relative overflow-hidden transition-all duration-300 border backdrop-blur-md',
      mode === 'KrDark'
        ? 'bg-[var(--sys-color-charcoalBackground-base)] border-white/10 text-[var(--sys-color-paperWhite-base)]'
        : 'bg-[var(--sys-color-charcoalBackground-base)] border-white/5 text-[var(--sys-color-paperWhite-base)]',
      className
    );

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        style={{
          borderRadius: mode === 'KrDark' ? 'var(--shape-megaphoneCut01)' : '8px',
        }}
        whileHover={{
          y: -4,
          transition: KrDarkSpring,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {/* Glare effect on hover */}
        {isHovered && mode === 'KrDark' && (
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
                  className="text-ink-gold"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={KrDarkSpring}
                >
                  {icon}
                </motion.div>
              )}
              <h3
                className={cn(
                  'font-semibold',
                  mode === 'KrDark' ? 'font-display text-xl' : 'font-primary text-lg'
                )}
              >
                {title}
              </h3>
            </div>
            {level && (
              <span
                className={cn('text-xs uppercase tracking-wider font-mono', levelColors[level])}
              >
                {level}
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-secondary-concrete-grey mb-4 leading-relaxed">
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
                    'px-2 py-1 text-xs font-mono uppercase tracking-wider',
                    mode === 'KrDark'
                      ? 'bg-[var(--sys-color-concreteGrey-base)]/20 border border-[var(--sys-color-concreteGrey-base)]'
                      : 'bg-[var(--sys-color-concreteGrey-base)]/10 border border-[var(--sys-color-concreteGrey-base)]'
                  )}
                  style={{
                    borderRadius: mode === 'KrDark' ? 'var(--shape-marchSurge01)' : '2px',
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={KrDarkSpring}
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
