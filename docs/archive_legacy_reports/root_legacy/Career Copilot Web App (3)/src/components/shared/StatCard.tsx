import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface StatCardProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  iconColor = "text-[#D0BCFF]",
  className = "",
}: StatCardProps) {
  const noiseOverlay = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`;

  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.01,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.6)",
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 1,
      }}
      className={`
        bg-[var(--surface-container)] rounded-[28px] p-8 
        flex flex-col items-center justify-center 
        relative overflow-hidden
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-1px_0_0_rgba(0,0,0,0.2),0_4px_24px_-1px_rgba(0,0,0,0.2)]
        ${className}
      `}
      style={{
        backgroundImage: noiseOverlay,
      }}
    >
      <div className="relative z-10 flex flex-col items-center">
        <Icon className={`w-12 h-12 ${iconColor} mb-4`} />
        <p className="text-7xl mb-6 text-[var(--on-surface)] font-mono tabular-nums">{value}</p>
        <p className="text-[var(--on-surface-variant)] text-[0.75rem] uppercase tracking-widest font-mono">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
