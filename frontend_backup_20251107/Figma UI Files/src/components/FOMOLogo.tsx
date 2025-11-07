import { ComponentProps } from 'react';
import logoImage from 'figma:asset/cb6eaf84aec85fc7699f0c2f9000a1cb19725dc5.png';

interface FOMOLogoProps extends ComponentProps<'div'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function FOMOLogo({
  size = 'md',
  showText = true,
  className = '',
  ...props
}: FOMOLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`} {...props}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* New FOMO Logo */}
        <div className="w-full h-full relative">
          <img src={logoImage} alt="FOMO Logo" className="w-full h-full object-contain" />
          {/* Optional glow effect */}
          <div className="absolute inset-0 rounded-lg glow-primary opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={`${textSizeClasses[size]} font-bold text-brand-red font-display leading-none`}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            FML
          </span>
          <span className="text-xs text-content-secondary font-medium tracking-wider">
            CAREER COPILOT
          </span>
        </div>
      )}
    </div>
  );
}

export function FOMOIcon({ size = 'md', className = '' }: Omit<FOMOLogoProps, 'showText'>) {
  return <FOMOLogo size={size} showText={false} className={className} />;
}
