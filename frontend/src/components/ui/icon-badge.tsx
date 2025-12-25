import { LucideIcon } from 'lucide-react';

interface IconBadgeProps {
  icon: LucideIcon;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  background?: string;
}

export function IconBadge({
  icon: Icon,
  color = 'text-[#D0BCFF]',
  size = 'md',
  background = 'bg-[#36343B]',
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
    <div
      className={`${sizeClasses[size]} ${background} rounded-full flex items-center justify-center`}
    >
      <Icon className={`${iconSizeClasses[size]} ${color}`} />
    </div>
  );
}
