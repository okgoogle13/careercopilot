import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  variant?: "outlined" | "filled";
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  iconColor = "text-[#D0BCFF]",
  variant = "outlined",
}: MetricCardProps) {
  return (
    <div
      className={`
      rounded-[28px] p-6
      ${
        variant === "outlined"
          ? "bg-transparent border border-[#938F99]"
          : "bg-[var(--surface-container)]"
      }
    `}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-[#36343B] rounded-full flex items-center justify-center">
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className="text-[#CAC4D0] tier-data">{label}</span>
      </div>
      <p className="text-5xl text-[#E6E1E5] tier-data">{value}</p>
    </div>
  );
}
