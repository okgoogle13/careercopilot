import { ReactNode } from 'react';

interface ChartPaneProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ChartPane({ title, children, className = '' }: ChartPaneProps) {
  return (
    <div className={`bg-surface-container rounded-tech p-8 relative overflow-hidden border border-outline-variant shadow-elevation-1 ${className}`}>
      {/* Dotted Grid Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--sys-color-primary) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <h4 className="text-on-surface mb-6 font-bold text-title-large">{title}</h4>
        {children}
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> restoration-KR-Rage-Figma-v2.0
