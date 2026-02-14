interface KeywordTagProps {
  keyword: string;
  variant?: "matched" | "missing";
  className?: string;
}

export function KeywordTag({ keyword, variant = "matched", className = "" }: KeywordTagProps) {
  return (
    <span
      className={`
        px-4 py-2 rounded-full text-xs uppercase tracking-wider font-mono
        ${
          variant === "matched"
            ? "bg-[#A8C5A3]/20 text-[#A8C5A3] border border-[#A8C5A3]/30"
            : "bg-[#E07A5F]/10 text-[#E07A5F]/60 border border-[#E07A5F]/20"
        }
        ${className}
      `}
    >
      {keyword}
    </span>
  );
}
