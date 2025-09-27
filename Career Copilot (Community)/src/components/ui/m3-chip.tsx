import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "./utils";

interface M3ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "assist" | "filter" | "input" | "suggestion";
  selected?: boolean;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  asChild?: boolean;
}

const M3Chip = React.forwardRef<HTMLButtonElement, M3ChipProps>(
  (
    {
      className,
      variant = "assist",
      selected = false,
      icon,
      trailingIcon,
      removable = false,
      onRemove,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.();
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          // Base Chip Styles
          "inline-flex items-center justify-center gap-2",
          "h-8 px-4 rounded-lg",
          "text-sm font-medium leading-5",
          "transition-all cursor-pointer",
          "duration-[var(--motion-duration-short4)] ease-[var(--motion-easing-standard)]",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "disabled:pointer-events-none",

          // Assist Chip (Default state)
          variant === "assist" &&
            !selected && [
              "bg-transparent",
              "text-[var(--md-sys-color-on-surface)]",
              "border border-[var(--md-sys-color-outline)]",
              "hover:bg-[var(--md-sys-color-on-surface)]",
              "hover:bg-opacity-8",
              "focus:ring-[var(--md-sys-color-on-surface)]",
              "focus:ring-opacity-20",
            ],

          // Filter Chip
          variant === "filter" &&
            !selected && [
              "bg-transparent",
              "text-[var(--md-sys-color-on-surface-variant)]",
              "border border-[var(--md-sys-color-outline)]",
              "hover:bg-[var(--md-sys-color-on-surface-variant)]",
              "hover:bg-opacity-8",
              "focus:ring-[var(--md-sys-color-on-surface-variant)]",
              "focus:ring-opacity-20",
            ],

          variant === "filter" &&
            selected && [
              "bg-[var(--md-sys-color-secondary-container)]",
              "text-[var(--md-sys-color-on-secondary-container)]",
              "border border-transparent",
              "focus:ring-[var(--md-sys-color-secondary)]",
              "focus:ring-opacity-20",
            ],

          // Input Chip
          variant === "input" && [
            "bg-transparent",
            "text-[var(--md-sys-color-on-surface-variant)]",
            "border border-[var(--md-sys-color-outline)]",
            "hover:bg-[var(--md-sys-color-on-surface-variant)]",
            "hover:bg-opacity-8",
            "focus:ring-[var(--md-sys-color-on-surface-variant)]",
            "focus:ring-opacity-20",
          ],

          // Suggestion Chip
          variant === "suggestion" && [
            "bg-transparent",
            "text-[var(--md-sys-color-on-surface-variant)]",
            "border border-[var(--md-sys-color-outline)]",
            "hover:bg-[var(--md-sys-color-on-surface-variant)]",
            "hover:bg-opacity-8",
            "focus:ring-[var(--md-sys-color-on-surface-variant)]",
            "focus:ring-opacity-20",
          ],

          className,
        )}
        {...props}
      >
        {icon && <span className="flex items-center justify-center w-4 h-4">{icon}</span>}

        <span className="text-sm font-medium">{children}</span>

        {removable && (
          <button
            type="button"
            onClick={handleRemove}
            className={cn(
              "flex items-center justify-center w-4 h-4 ml-1",
              "text-[var(--md-sys-color-on-surface-variant)]",
              "hover:text-[var(--md-sys-color-on-surface)]",
              "transition-colors",
              "duration-[var(--motion-duration-short2)]",
            )}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {trailingIcon && !removable && (
          <span className="flex items-center justify-center w-4 h-4">{trailingIcon}</span>
        )}
      </Comp>
    );
  },
);

M3Chip.displayName = "M3Chip";

export { M3Chip };
