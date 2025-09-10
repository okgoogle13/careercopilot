import logoImage from '../assets/cb6eaf84aec85fc7699f0c2f9000a1cb19725dc5.png';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = '', size = 28, showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoImage}
        alt="Career Copilot Logo"
        width={size}
        height={size}
        className="object-contain"
      />
      {showText && <span className="font-bold text-sidebar-foreground">FML Career Copilot</span>}
    </div>
  );
}
