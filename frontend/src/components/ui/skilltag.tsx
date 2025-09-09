import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import React from 'react';

interface SkillTagProps {
  text: string;
  status?: 'suggested' | 'accepted' | 'rejected';
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

export const SkillTag: React.FC<SkillTagProps> = ({
  text,
  status = 'suggested',
  onAccept,
  onReject,
  className
}) => {
  const statusConfig = {
    suggested: {
      bgClass: 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary border-dashed',
      textClass: 'text-brand-primary',
      icon: null
    },
    accepted: {
      bgClass: 'bg-accent-green/10 border-accent-green/30 text-accent-green',
      textClass: 'text-accent-green',
      icon: <Check className="w-4 h-4" />
    },
    rejected: {
      bgClass: 'bg-accent-red/10 border-accent-red/30 text-accent-red',
      textClass: 'text-accent-red',
      icon: <X className="w-4 h-4" />
    }
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-200',
        'text-sm font-medium',
        config.bgClass,
        config.textClass,
        'group',
        className
      )}
    >
      {config.icon && (
        <span className="shrink-0">
          {config.icon}
        </span>
      )}

      <span className="truncate">{text}</span>

      {status === 'suggested' && (
        <div className="flex items-center gap-1 ml-1">
          {onAccept && (
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                'h-6 w-6 p-0',
                'hover:bg-accent-green/20 text-accent-green hover:text-accent-green',
                'opacity-0 group-hover:opacity-100 transition-opacity'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
            >
              <Check className="w-4 h-4" />
            </Button>
          )}

          {onReject && (
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                'h-6 w-6 p-0',
                'hover:bg-accent-red/20 text-accent-red hover:text-accent-red',
                'opacity-0 group-hover:opacity-100 transition-opacity'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onReject();
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
