import { cn } from './ui/utils';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'minimal' | 'icon-only';
  className?: string;
  showText?: boolean;
}

export function Logo({
  size = 'md',
  variant = 'default',
  className = '',
  showText = true,
}: LogoProps) {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const SkullIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], 'text-primary')}
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"
        fill="currentColor"
        opacity="0.8"
      />
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
      <path d="M10 13h4v1h-4z" fill="currentColor" opacity="0.6" />
      <path d="M11 20h2v2h-2z" fill="currentColor" opacity="0.4" />
    </svg>
  );

  const FMLText = ({ size: textSize }: { size: keyof typeof textSizeClasses }) => (
    <div className="flex flex-col">
      <span
        className={cn(textSizeClasses[textSize], 'font-semibold text-gradient-blue leading-tight')}
      >
        FML
      </span>
      {size !== 'xs' && size !== 'sm' && (
        <span className={cn('text-xs text-muted-foreground leading-tight -mt-1')}>
          Career Copilot
        </span>
      )}
    </div>
  );

  if (variant === 'icon-only' || !showText) {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          'hover:scale-105 transition-normal cursor-pointer',
          className
        )}
      >
        <SkullIcon />
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          'flex items-center gap-2',
          'hover:scale-105 transition-normal cursor-pointer',
          className
        )}
      >
        <SkullIcon />
        <span className={cn(textSizeClasses[size], 'font-semibold text-gradient-blue')}>FML</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        'hover:scale-105 transition-normal cursor-pointer',
        className
      )}
    >
      <div className="relative">
        <SkullIcon />
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-30 transition-opacity">
          <SkullIcon />
        </div>
      </div>
      <FMLText size={size} />
    </div>
  );
}

// Logo variations for different contexts
export function LogoMark({ size = 'md', className = '' }: Pick<LogoProps, 'size' | 'className'>) {
  return <Logo size={size} variant="icon-only" className={className} />;
}

export function LogoMinimal({
  size = 'md',
  className = '',
}: Pick<LogoProps, 'size' | 'className'>) {
  return <Logo size={size} variant="minimal" className={className} />;
}

// Responsive logo that adapts to screen size
export function ResponsiveLogo({ className = '' }: { className?: string }) {
  return (
    <>
      {/* Mobile: Icon only */}
      <div className="block sm:hidden">
        <Logo size="sm" variant="icon-only" className={className} />
      </div>

      {/* Tablet: Minimal */}
      <div className="hidden sm:block lg:hidden">
        <Logo size="sm" variant="minimal" className={className} />
      </div>

      {/* Desktop: Full logo */}
      <div className="hidden lg:block">
        <Logo size="md" variant="default" className={className} />
      </div>
    </>
  );
}

// Watermark version (for background use)
export function LogoWatermark({ className = '' }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        'opacity-[0.02] pointer-events-none select-none',
        'text-foreground',
        className
      )}
    >
      <Logo size="xl" variant="icon-only" />
    </div>
  );
}
