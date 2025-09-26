// Simple version of CareerCopilotLogo for debugging
export function CareerCopilotLogo({
  className,
  size = 32,
  variant = "full",
  ...props
}: {
  className?: string;
  size?: number;
  variant?: "full" | "compact";
}) {
  const logoText = variant === "full" ? "Career Copilot" : "CC";

  return (
    <div 
      className={`inline-flex items-center gap-2 ${className || ''}`}
      {...props}
    >
      <div 
        className="flex items-center justify-center font-bold bg-blue-600 text-white rounded-md"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.6,
          lineHeight: 1
        }}
      >
        {variant === "compact" ? "CC" : "C"}
      </div>
      {variant === "full" && (
        <span 
          className="font-bold text-blue-600"
          style={{
            fontSize: size * 0.5,
          }}
        >
          {logoText}
        </span>
      )}
    </div>
  );
}
