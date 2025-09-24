import logoImage from "figma:asset/cb6eaf84aec85fc7699f0c2f9000a1cb19725dc5.png";

interface CareerCopilotLogoProps {
  className?: string;
  size?: number;
  variant?: "full" | "compact";
}

export function CareerCopilotLogo({
  className = "",
  size = 32,
  variant = "full",
}: CareerCopilotLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoImage}
        alt="FML Career Copilot Logo"
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  );
}
