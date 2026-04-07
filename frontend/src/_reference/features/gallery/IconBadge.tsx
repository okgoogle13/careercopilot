import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { KrDarkSpring } from '@/design/tokens/motion-presets';

interface IconBadgeProps {
  icon: LucideIcon;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  background?: string;
  className?: string;
}

export function IconBadge({
  icon: Icon,
  color = 'text-primary',
  size = 'md',
  background = 'bg-surface-container-high',
  className = '',
}: IconBadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.div
      className={`
      ${sizeClasses[size]} ${background}
      flex items-center justify-center
      flex-shrink-0
      ${className}
    `}
      style={{ clipPath: 'var(--md-ref-shape-gem)' }}
      whileHover={{ scale: 1.1 }}
      transition={KrDarkSpring}
    >
      <Icon className={`${iconSizeClasses[size]} ${color}`} />
    </motion.div>
  );
}
