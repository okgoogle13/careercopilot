import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "./utils";

interface M3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outlined" | "text" | "elevated" | "tonal";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  asChild?: boolean;
}

const M3Button = React.forwardRef<HTMLButtonElement, M3ButtonProps>(
  (
    {
      className,
      variant = "filled",
      size = "medium",
      icon,
      trailingIcon,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          // Base Material 3 Button Styles
          "inline-flex items-center justify-center gap-2",
          "rounded-3xl font-medium text-sm leading-5",
          "transition-all cursor-pointer",
          "duration-[var(--motion-duration-short4)] ease-[var(--motion-easing-standard)]",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "disabled:pointer-events-none",

          // Size variants
          size === "small" && "h-10 px-6 text-sm",
          size === "medium" && "h-12 px-6 text-base",
          size === "large" && "h-14 px-8 text-base",

          // Filled variant (Primary)
          variant === "filled" && [
            "bg-[var(--md-sys-color-primary)]",
            "text-[var(--md-sys-color-on-primary)]",
            "shadow-[var(--elevation-level1)]",
            "hover:shadow-[var(--elevation-level3)]",
            "hover:shadow-[0_0_20px_rgba(193,193,255,0.4)]",
            "active:shadow-[var(--elevation-level1)]",
            "focus:ring-[var(--md-sys-color-primary)]",
            "focus:ring-opacity-20",
          ],

          // Outlined variant
          variant === "outlined" && [
            "bg-transparent",
            "text-[var(--md-sys-color-primary)]",
            "border border-[var(--md-sys-color-outline)]",
            "hover:bg-[var(--md-sys-color-primary)]",
            "hover:bg-opacity-8",
            "hover:border-[var(--md-sys-color-primary)]",
            "focus:ring-[var(--md-sys-color-primary)]",
            "focus:ring-opacity-20",
          ],

          // Text variant
          variant === "text" && [
            "bg-transparent",
            "text-[var(--md-sys-color-primary)]",
            "hover:bg-[var(--md-sys-color-primary)]",
            "hover:bg-opacity-8",
            "focus:ring-[var(--md-sys-color-primary)]",
            "focus:ring-opacity-20",
          ],

          // Elevated variant
          variant === "elevated" && [
            "bg-[var(--md-sys-color-surface-container-low)]",
            "text-[var(--md-sys-color-primary)]",
            "shadow-[var(--elevation-level1)]",
            "hover:bg-[var(--md-sys-color-surface-container-high)]",
            "hover:shadow-[var(--elevation-level2)]",
            "focus:ring-[var(--md-sys-color-primary)]",
            "focus:ring-opacity-20",
          ],

          // Tonal variant
          variant === "tonal" && [
            "bg-[var(--md-sys-color-secondary-container)]",
            "text-[var(--md-sys-color-on-secondary-container)]",
            "hover:shadow-[var(--elevation-level1)]",
            "focus:ring-[var(--md-sys-color-secondary)]",
            "focus:ring-opacity-20",
          ],

          className,
        )}
        {...props}
      >
        {icon && <span className="flex items-center justify-center w-4 h-4">{icon}</span>}
        {children}
        {trailingIcon && (
          <span className="flex items-center justify-center w-4 h-4">{trailingIcon}</span>
        )}
      </Comp>
    );
  },
);

M3Button.displayName = "M3Button";

export { M3Button };
