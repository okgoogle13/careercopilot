import React from "react";
import { cn } from "./utils";

interface M3InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const M3Input = React.forwardRef<HTMLInputElement, M3InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error = false,
      errorText,
      leadingIcon,
      trailingIcon,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const inputId = props.id || `m3-input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="relative w-full">
        {/* Input Container */}
        <div
          className={cn(
            "relative flex items-center",
            "rounded-xl border transition-all",
            "duration-[var(--motion-duration-short4)] ease-[var(--motion-easing-standard)]",
            "bg-[var(--md-sys-color-surface-container-low)]",

            // Border states
            error
              ? "border-[var(--md-sys-color-error)]"
              : isFocused
                ? "border-[var(--md-sys-color-primary)]"
                : "border-[var(--md-sys-color-outline-variant)] hover:border-[var(--md-sys-color-outline)]",

            // Aurora Focus glow effect
            isFocused && !error && "shadow-[var(--shadow-glow-aurora)]",
            error && "shadow-[0_0_20px_rgba(255,180,171,0.4)]",
          )}
        >
          {/* Leading Icon */}
          {leadingIcon && (
            <div className="flex items-center justify-center w-6 h-6 ml-4">
              <div
                className={cn(
                  "text-[var(--md-sys-color-on-surface-variant)]",
                  isFocused && "text-[var(--md-sys-color-primary)]",
                  error && "text-[var(--md-sys-color-error)]",
                )}
              >
                {leadingIcon}
              </div>
            </div>
          )}

          {/* Input Field */}
          <div className="relative flex-1">
            <input
              ref={ref}
              id={inputId}
              type={type}
              className={cn(
                "w-full px-4 py-4 bg-transparent",
                "text-base font-normal leading-6",
                "text-[var(--md-sys-color-on-surface)]",
                "placeholder:text-[var(--md-sys-color-on-surface-variant)]",
                "focus:outline-none",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                leadingIcon && "pl-2",
                trailingIcon && "pr-2",
                label && "pt-6 pb-2",
                className,
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...props}
            />

            {/* Enhanced Floating Label with Expressive Animation */}
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  "absolute left-4 transition-all pointer-events-none",
                  "duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                  "text-[var(--md-sys-color-on-surface-variant)]",
                  "bg-[var(--md-sys-color-surface-container-low)] px-1 rounded-sm",

                  // Enhanced Aurora label animation states with slide up and fade
                  isFocused || hasValue || props.value
                    ? "top-0 -translate-y-1/2 text-xs font-medium opacity-100 transform scale-105"
                    : "top-1/2 -translate-y-1/2 text-base font-normal opacity-70 transform scale-100",

                  // Aurora enhanced label color states with text glow
                  isFocused && !error && "text-[var(--primary)] opacity-100",
                  isFocused && !error && "text-shadow-[0_0_8px_rgba(167,139,250,0.3)]",
                  error && "text-[var(--md-sys-color-error)] opacity-100",
                  leadingIcon && (isFocused || hasValue || props.value) && "left-14",
                  leadingIcon && !(isFocused || hasValue || props.value) && "left-14",
                )}
                style={{
                  transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {label}
              </label>
            )}
          </div>

          {/* Trailing Icon */}
          {trailingIcon && (
            <div className="flex items-center justify-center w-6 h-6 mr-4">
              <div
                className={cn(
                  "text-[var(--md-sys-color-on-surface-variant)]",
                  isFocused && "text-[var(--md-sys-color-primary)]",
                  error && "text-[var(--md-sys-color-error)]",
                )}
              >
                {trailingIcon}
              </div>
            </div>
          )}
        </div>

        {/* Helper/Error Text */}
        {(helperText || errorText) && (
          <div className="mt-2 px-4">
            <p
              className={cn(
                "text-xs leading-4",
                error
                  ? "text-[var(--md-sys-color-error)]"
                  : "text-[var(--md-sys-color-on-surface-variant)]",
              )}
            >
              {error ? errorText : helperText}
            </p>
          </div>
        )}
      </div>
    );
  },
);

M3Input.displayName = "M3Input";

export { M3Input };
