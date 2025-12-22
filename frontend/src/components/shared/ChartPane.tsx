import { ReactNode } from 'react';

interface ChartPaneProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ChartPane({ title, children, className = '' }: ChartPaneProps) {
  return (
    <div className={`bg-[#25232A] rounded-[28px] p-8 relative overflow-hidden ${className}`}>
      {/* Dotted Grid Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #E6DEFF 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <h4 className="text-[#E6E1E5] mb-6 font-semibold">{title}</h4>
        {children}
      </div>
    </div>
  );
}
